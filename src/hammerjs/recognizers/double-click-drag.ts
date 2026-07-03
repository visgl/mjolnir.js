import {Recognizer} from '../recognizer/recognizer';
import {RecognizerState} from '../recognizer/recognizer-state';
import {TOUCH_ACTION_MANIPULATION} from '../touchaction/touchaction-Consts';
import {InputEvent} from '../input/input-consts';
import {getPointDistance} from '../input/get-distance';

import type {HammerInput, Point} from '../input/types';

export type DoubleClickDragRecognizerOptions = {
  /** Name of the event.
   * @default 'doubleclickdrag'
   */
  event?: string;
  /** Enable this event.
   * @default true
   */
  enable?: boolean;
  /** Required number of pointers.
   * @default 1
   */
  pointers?: number;
  /** Maximum time in ms between the two taps.
   * @default 500
   */
  interval?: number;
  /** Maximum press time in ms for each tap.
   * @default 350
   */
  time?: number;
  /** Maximum movement in px allowed while tapping.
   * @default 28
   */
  threshold?: number;
  /** Minimum vertical movement in px before drag zoom begins.
   * @default 1
   */
  dragThreshold?: number;
  /** Vertical pixels required to double the scale.
   * @default 120
   */
  pixelsPerScale?: number;
};

const EVENT_NAMES = ['', 'start', 'move', 'end', 'cancel'] as const;

type TapInfo = {
  center: Point;
  timeStamp: number;
  pointerId: number | null;
};

type DragInfo = {
  startCenter: Point;
  pointerId: number | null;
  active: boolean;
};

/**
 * DoubleClickDrag
 * Recognized when a second tap/click turns into a vertical drag gesture.
 */
export class DoubleClickDragRecognizer extends Recognizer<
  Required<DoubleClickDragRecognizerOptions>
> {
  private _tapStart: TapInfo | null = null;
  private _lastTap: TapInfo | null = null;
  private _drag: DragInfo | null = null;
  private _emittedStart = false;

  constructor(options: DoubleClickDragRecognizerOptions = {}) {
    super({
      enable: true,
      event: 'doubleclickdrag',
      pointers: 1,
      interval: 500,
      time: 350,
      threshold: 28,
      dragThreshold: 1,
      pixelsPerScale: 120,
      ...options
    });
  }

  getTouchAction() {
    return [TOUCH_ACTION_MANIPULATION];
  }

  getEventNames(): string[] {
    return EVENT_NAMES.map((suffix) => this.options.event + suffix);
  }

  process(input: HammerInput) {
    const {options} = this;
    const validPointers = input.pointers.length === options.pointers;

    if (!validPointers) {
      this.reset();
      return RecognizerState.Failed;
    }

    if (input.eventType & InputEvent.Start) {
      return this._handleStart(input);
    }
    if (input.eventType & InputEvent.Move) {
      return this._handleMove(input);
    }
    if (input.eventType & InputEvent.Cancel) {
      return this._handleEnd(input, true);
    }
    if (input.eventType & InputEvent.End) {
      return this._handleEnd(input, false);
    }

    return RecognizerState.Failed;
  }

  reset() {
    this._tapStart = null;
    this._lastTap = null;
    this._drag = null;
    this._emittedStart = false;
  }

  emit(input?: HammerInput) {
    if (!input) {
      return;
    }

    if (this.state === RecognizerState.Began) {
      if (!this._drag?.active || this._emittedStart) {
        return;
      }
      this._emittedStart = true;
      this.manager.emit(`${this.options.event}start`, input);
      this.manager.emit(this.options.event, input);
      return;
    }

    if (this.state === RecognizerState.Changed) {
      if (!this._emittedStart) {
        return;
      }
      this.manager.emit(`${this.options.event}move`, input);
      this.manager.emit(this.options.event, input);
      return;
    }

    if (this.state === RecognizerState.Ended) {
      if (!this._emittedStart) {
        return;
      }
      this.manager.emit(this.options.event, input);
      this.manager.emit(`${this.options.event}end`, input);
      this._emittedStart = false;
      return;
    }

    if (this.state === RecognizerState.Cancelled) {
      if (!this._emittedStart) {
        return;
      }
      this.manager.emit(this.options.event, input);
      this.manager.emit(`${this.options.event}cancel`, input);
      this._emittedStart = false;
    }
  }

  private _handleStart(input: HammerInput): RecognizerState {
    const pointerId = this._getPointerId(input);
    if (this._lastTap && this._isTapMatch(input, this._lastTap)) {
      this._tapStart = null;
      this._lastTap = null;
      this._drag = {
        startCenter: input.center,
        pointerId,
        active: false
      };
      this._emittedStart = false;
      return RecognizerState.Began;
    }

    this._tapStart = {
      center: input.center,
      timeStamp: input.timeStamp,
      pointerId
    };
    this._lastTap = null;
    this._drag = null;
    this._emittedStart = false;
    return RecognizerState.Failed;
  }

  private _handleMove(input: HammerInput): RecognizerState {
    if (!this._drag || !this._isSamePointer(input, this._drag.pointerId)) {
      return RecognizerState.Failed;
    }

    const dy = this._drag.startCenter.y - input.center.y;
    if (!this._drag.active && Math.abs(dy) < this.options.dragThreshold) {
      return RecognizerState.Began;
    }

    this._drag.active = true;
    input.scale = Math.pow(2, dy / this.options.pixelsPerScale);
    return this._emittedStart ? RecognizerState.Changed : RecognizerState.Began;
  }

  private _handleEnd(input: HammerInput, cancelled: boolean): RecognizerState {
    if (this._drag && this._isSamePointer(input, this._drag.pointerId)) {
      const {active, startCenter} = this._drag;
      this._drag = null;
      this._tapStart = null;
      this._lastTap = null;

      if (!active) {
        this._emittedStart = false;
        return RecognizerState.Failed;
      }

      const dy = startCenter.y - input.center.y;
      input.scale = Math.pow(2, dy / this.options.pixelsPerScale);
      return cancelled ? RecognizerState.Cancelled : RecognizerState.Ended;
    }

    if (!this._tapStart || !this._isSamePointer(input, this._tapStart.pointerId)) {
      if (cancelled) {
        this.reset();
      }
      return RecognizerState.Failed;
    }

    if (this._isValidTap(input)) {
      this._lastTap = {
        center: input.center,
        timeStamp: input.timeStamp,
        pointerId: this._tapStart.pointerId
      };
    } else {
      this._lastTap = null;
    }
    this._tapStart = null;
    return RecognizerState.Failed;
  }

  private _isTapMatch(input: HammerInput, tap: TapInfo): boolean {
    return (
      input.timeStamp - tap.timeStamp <= this.options.interval &&
      getPointDistance(input.center, tap.center) <= this.options.threshold
    );
  }

  private _isValidTap(input: HammerInput): boolean {
    return input.deltaTime <= this.options.time && input.distance <= this.options.threshold;
  }

  private _getPointerId(input: HammerInput): number | null {
    return 'pointerId' in input.srcEvent ? input.srcEvent.pointerId : null;
  }

  private _isSamePointer(input: HammerInput, pointerId: number | null): boolean {
    return pointerId === null || this._getPointerId(input) === pointerId;
  }
}
