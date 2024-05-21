import {Recognizer, RecognizerOptions} from '../recognizer/recognizer';
import { TOUCH_ACTION_MANIPULATION } from '../touchaction/touchaction-Consts';
import { InputEvent } from '../input/input-consts';
import {
  RecognizerState
} from '../recognizer/recognizer-state';
import {getPointDistance} from '../input/get-distance';
import type { Point, HammerInput } from '../input/types';

export type TapRecognizerOptions = Partial<RecognizerOptions> & {
  event?: string;
  pointers?: number;
  /** number of taps in succession */
  taps?: number;
  /** max time between the multi-tap taps */
  interval?: number;
  /** max time of the pointer to be down (like finger on the screen) */
  time?: number;
  /** a minimal movement is ok, but keep it low */
  threshold?: number;
  /** a multi-tap can be a bit off the initial position */
  posThreshold?: number;
};

/**
 * A tap is recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 */
export class TapRecognizer extends Recognizer<Required<TapRecognizerOptions>> {
  /** previous time for tap counting */
  private pTime: number | null = null;
  /** previous center for tap counting */
  private pCenter: Point | null = null;

  private _timer: number | null = null;
  private _input: HammerInput | null = null;

  private count: number = 0;

  constructor(options: TapRecognizerOptions) {
    super({
      enable: true,
      event: 'tap',
      pointers: 1,
      taps: 1,
      interval: 300,
      time: 250,
      threshold: 9,
      posThreshold: 10,
      ...options
    });
  }

  getTouchAction() {
    return [TOUCH_ACTION_MANIPULATION];
  }

  process(input: HammerInput) {
    const { options } = this;

    const validPointers = input.pointers.length === options.pointers;
    const validMovement = input.distance < options.threshold;
    const validTouchTime = input.deltaTime < options.time;

    this.reset();

    if ((input.eventType & InputEvent.Start) && (this.count === 0)) {
      return this.failTimeout();
    }

    // we only allow little movement
    // and we've reached an end event, so a tap is possible
    if (validMovement && validTouchTime && validPointers) {
      if (input.eventType !== InputEvent.End) {
        return this.failTimeout();
      }

      const validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
      const validMultiTap = !this.pCenter || getPointDistance(this.pCenter, input.center) < options.posThreshold;

      this.pTime = input.timeStamp;
      this.pCenter = input.center;

      if (!validMultiTap || !validInterval) {
        this.count = 1;
      } else {
        this.count += 1;
      }

      this._input = input;

      // if tap count matches we have recognized it,
      // else it has began recognizing...
      const tapCount = this.count % options.taps;
      if (tapCount === 0) {
        // no failing requirements, immediately trigger the tap event
        // or wait as long as the multitap interval to trigger
        if (!this.hasRequireFailures()) {
          return RecognizerState.Recognized;
        } 
          this._timer = window.setTimeout(() => {
            this.state = RecognizerState.Recognized;
            this.tryEmit(this._input!);
          }, options.interval);
          return RecognizerState.Began;
        
      }
    }
    return RecognizerState.Failed;
  }

  failTimeout() {
    this._timer = window.setTimeout(() => {
      this.state = RecognizerState.Failed;
    }, this.options.interval);
    return RecognizerState.Failed;
  }

  reset() {
    clearTimeout(this._timer as any);
  }

  emit(input: HammerInput) {
    if (this.state === RecognizerState.Recognized) {
      input.tapCount = this.count;
      this.manager?.emit(this.options.event, input);
    }
  }
}
