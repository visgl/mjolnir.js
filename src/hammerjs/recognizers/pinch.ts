import {AttrRecognizer, AttrRecognizerOptions} from './attribute';
import { TOUCH_ACTION_NONE } from '../touchaction/touchaction-Consts';
import { RecognizerState } from '../recognizer/recognizer-state';
import type { HammerInput } from '../input/types';

export type PinchRecognizerOptions = Partial<AttrRecognizerOptions> & {
  threshold?: number;
};

/**
 * @private
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
export default class PinchRecognizer extends AttrRecognizer<Required<PinchRecognizerOptions>> {
  constructor(options: PinchRecognizerOptions) {
    super({
      enable: true,
      event: 'pinch',
      threshold: 0,
      pointers: 2,
      ...options
    });
  }

  getTouchAction() {
    return [TOUCH_ACTION_NONE];
  }

  attrTest(input: HammerInput): boolean {
    return super.attrTest(input) &&
        (Math.abs(input.scale - 1) > this.options.threshold || Boolean(this.state & RecognizerState.Began));
  }

  emit(input: HammerInput) {
    if (input.scale !== 1) {
      const inOut = input.scale < 1 ? 'in' : 'out';
      input.additionalEvent = this.options.event + inOut;
    }
    super.emit(input);
  }
}
