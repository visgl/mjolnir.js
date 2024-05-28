import {AttrRecognizer, AttrRecognizerOptions} from './attribute';
import {TOUCH_ACTION_NONE} from '../touchaction/touchaction-Consts';
import {RecognizerState} from '../recognizer/recognizer-state';
import type {HammerInput} from '../input/types';

export type RotateRecognizerOptions = Partial<AttrRecognizerOptions> & {
  threshold?: number;
};

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 */
export class RotateRecognizer extends AttrRecognizer<Required<RotateRecognizerOptions>> {
  constructor(options: RotateRecognizerOptions) {
    super({
      enable: true,
      event: 'rotate',
      threshold: 0,
      pointers: 2,
      ...options
    });
  }

  getTouchAction() {
    return [TOUCH_ACTION_NONE];
  }

  getEventNames(): string[] {
    return ['', 'start', 'move', 'end', 'cancel'].map(suffix => this.options.event + suffix);
  }

  attrTest(input: HammerInput): boolean {
    return (
      super.attrTest(input) &&
      (Math.abs(input.rotation) > this.options.threshold ||
        Boolean(this.state & RecognizerState.Began))
    );
  }
}
