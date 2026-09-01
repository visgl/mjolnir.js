import {TrackpadRecognizer} from './trackpad';
import {InputDirection, InputEvent} from '../input/input-consts';
import {RecognizerState} from '../recognizer/recognizer-state';
import {TOUCH_ACTION_PAN_X, TOUCH_ACTION_PAN_Y} from '../touchaction/touchaction-Consts';
import type {HammerInput} from '../input/types';
import type {InputCoherenceCondition} from './attribute';
import type {WheelGestureSessionEvent} from '../../inputs/wheel-gesture-session';

export type PanRecognizerOptions = {
  /** Name of the event.
   * @default 'pan'
   */
  event?: string;
  /** Enable this event.
   * @default true
   */
  enable?: boolean;
  /** Required number of pointers. 0 for all pointers.
   * @default 1
   */
  pointers?: number;
  /** Required direction of panning.
   * @default InputDirection.All
   */
  direction?: InputDirection;
  /** Minimal pan distance required before recognizing.
   * @default 10
   */
  threshold?: number;
  /** Recognize two-finger trackpad pan gestures from wheel events.
   * Only applies when pointers is 2.
   * @default false
   */
  trackpad?: boolean;
  /**
   * Alternative minimum input deltas used to delay recognition until pointer movement is coherent.
   * Conditions in one object are combined with AND. Multiple objects are combined with OR.
   */
  coherent?: InputCoherenceCondition[];
};

const EVENT_NAMES = ['', 'start', 'move', 'end', 'cancel', 'up', 'down', 'left', 'right'] as const;

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 */
export class PanRecognizer extends TrackpadRecognizer<Required<PanRecognizerOptions>> {
  pX: number | null;
  pY: number | null;
  private trackpadGesture = false;

  constructor(options: PanRecognizerOptions = {}) {
    super({
      enable: true,
      pointers: 1,
      event: 'pan',
      threshold: 10,
      direction: InputDirection.All,
      trackpad: false,
      coherent: [],
      ...options
    });
    this.pX = null;
    this.pY = null;
  }

  getTouchAction(): string[] {
    const {
      options: {direction}
    } = this;
    const actions: string[] = [];
    if (direction & InputDirection.Horizontal) {
      actions.push(TOUCH_ACTION_PAN_Y);
    }
    if (direction & InputDirection.Vertical) {
      actions.push(TOUCH_ACTION_PAN_X);
    }
    return actions;
  }

  getEventNames(): string[] {
    return EVENT_NAMES.map((suffix) => this.options.event + suffix);
  }

  directionTest(input: HammerInput): boolean {
    const {options} = this;
    let hasMoved = true;
    let {distance} = input;
    let {direction} = input;
    const x = input.deltaX;
    const y = input.deltaY;

    // lock to axis?
    if (!(direction & options.direction)) {
      if (options.direction & InputDirection.Horizontal) {
        direction =
          x === 0 ? InputDirection.None : x < 0 ? InputDirection.Left : InputDirection.Right;
        hasMoved = x !== this.pX;
        distance = Math.abs(input.deltaX);
      } else {
        direction = y === 0 ? InputDirection.None : y < 0 ? InputDirection.Up : InputDirection.Down;
        hasMoved = y !== this.pY;
        distance = Math.abs(input.deltaY);
      }
    }
    input.direction = direction;
    return hasMoved && distance > options.threshold && Boolean(direction & options.direction);
  }

  attrTest(input: HammerInput): boolean {
    const isActive = Boolean(this.state & RecognizerState.Began);
    const canBegin = !(
      this.options.coherent?.length && input.eventType & (InputEvent.End | InputEvent.Cancel)
    );
    return (
      super.attrTest(input) &&
      (isActive || (canBegin && this.coherentTest(input) && this.directionTest(input)))
    );
  }

  emit(input: HammerInput) {
    this.pX = input.deltaX;
    this.pY = input.deltaY;

    const direction = InputDirection[input.direction].toLowerCase();

    if (direction) {
      input.additionalEvent = this.options.event + direction;
    }
    super.emit(input);
  }

  protected handleTrackpadEvent(event: WheelGestureSessionEvent): void {
    if (event.isFirst) {
      this.trackpadGesture = !event.srcEvent.ctrlKey;
      if (
        !this.trackpadGesture &&
        this.state &
          (RecognizerState.Recognized | RecognizerState.Cancelled | RecognizerState.Failed)
      ) {
        this.state = RecognizerState.Possible;
      }
    }
    if (!this.trackpadGesture) {
      return;
    }

    this.recognize(
      this.getTrackpadInput(event, {
        deltaX: -event.deltaX,
        deltaY: -event.deltaY,
        velocity: -event.velocity,
        velocityX: -event.velocityX,
        velocityY: -event.velocityY,
        overallVelocity: -event.overallVelocity,
        overallVelocityX: -event.overallVelocityX,
        overallVelocityY: -event.overallVelocityY
      })
    );
    if (event.isFinal) {
      this.trackpadGesture = false;
    }
  }
}
