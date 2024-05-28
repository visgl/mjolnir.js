import {AttrRecognizer, AttrRecognizerOptions} from './attribute';
import {InputDirection} from '../input/input-consts';
import {PanRecognizer} from './pan';
import {InputEvent} from '../input/input-consts';
import type {HammerInput} from '../input/types';

export type SwipeRecognizerOptions = Partial<AttrRecognizerOptions> & {
  direction?: InputDirection;
  threshold?: number;
  velocity?: number;
};

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 */
export class SwipeRecognizer extends AttrRecognizer<Required<SwipeRecognizerOptions>> {
  constructor(options: SwipeRecognizerOptions) {
    super({
      enable: true,
      event: 'swipe',
      threshold: 10,
      velocity: 0.3,
      direction: InputDirection.All,
      pointers: 1,
      ...options
    });
  }

  getTouchAction() {
    return PanRecognizer.prototype.getTouchAction.call(this);
  }

  getEventNames(): string[] {
    return ['', 'up', 'down', 'left', 'right'].map(suffix => this.options.event + suffix);
  }

  attrTest(input: HammerInput): boolean {
    const {direction} = this.options;
    let velocity = 0;

    if (direction & InputDirection.All) {
      velocity = input.overallVelocity;
    } else if (direction & InputDirection.Horizontal) {
      velocity = input.overallVelocityX;
    } else if (direction & InputDirection.Vertical) {
      velocity = input.overallVelocityY;
    }

    return (
      super.attrTest(input) &&
      Boolean(direction & input.offsetDirection) &&
      input.distance > this.options.threshold &&
      input.maxPointers === this.options.pointers &&
      Math.abs(velocity) > this.options.velocity &&
      Boolean(input.eventType & InputEvent.End)
    );
  }

  emit(input: HammerInput) {
    const direction = InputDirection[input.offsetDirection].toLowerCase();
    if (direction) {
      this.manager.emit(this.options.event + direction, input);
    }

    this.manager.emit(this.options.event, input);
  }
}
