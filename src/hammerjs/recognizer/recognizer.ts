import {RecognizerState} from './recognizer-state';
import uniqueId from '../utils/unique-id';
import stateStr from './state-str';

import type { Manager } from '../manager';
import type { HammerInput } from '../input/types';

export type RecognizerOptions = {
  event: string;
  enable: boolean;
};

/**
 * @private
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */

/**
 * @private
 * Recognizer
 * Every recognizer needs to extend from this class.
 */
export abstract class Recognizer<OptionsT extends RecognizerOptions> {
  id: number;

  protected options: OptionsT;
  protected manager: Manager | null = null;
  protected state: RecognizerState;
  protected simultaneous: {[id: string]: Recognizer<any>};
  protected requireFail: Recognizer<any>[];

  constructor(options: OptionsT) {
    this.options = options;

    this.id = uniqueId();

    this.state = RecognizerState.Possible;
    this.simultaneous = {};
    this.requireFail = [];
  }

  /**
   * set options
   */
  set(options: Partial<OptionsT>) {
    Object.assign(this.options, options);

    // also update the touchAction, in case something changed about the directions/enabled state
    this.manager?.touchAction.update();
    return this;
  }

  /**
   * recognize simultaneous with an other recognizer.
   */
  recognizeWith(recognizerOrName: Recognizer<any> | string | (Recognizer<any> | string)[]) {
    if (Array.isArray(recognizerOrName)) {
      for (const item of recognizerOrName) {
        this.recognizeWith(item);
      }
      return this;
    }

    const { simultaneous } = this;
    const otherRecognizer =  this.manager?.get(recognizerOrName) ?? (recognizerOrName as Recognizer<any>);
    if (!simultaneous[otherRecognizer.id]) {
      simultaneous[otherRecognizer.id] = otherRecognizer;
      otherRecognizer.recognizeWith(this);
    }
    return this;
  }

  /**
   * drop the simultaneous link. it doesnt remove the link on the other recognizer.
   */
  dropRecognizeWith(recognizerOrName: Recognizer<any> | string | (Recognizer<any> | string)[]) {
    if (Array.isArray(recognizerOrName)) {
      for (const item of recognizerOrName) {
        this.dropRecognizeWith(item);
      }
      return this;
    }

    const otherRecognizer = this.manager?.get(recognizerOrName) ?? (recognizerOrName as Recognizer<any>);
    delete this.simultaneous[otherRecognizer.id];
    return this;
  }

  /**
   * recognizer can only run when an other is failing
   */
  requireFailure(recognizerOrName: Recognizer<any> | string | (Recognizer<any> | string)[]) {
    if (Array.isArray(recognizerOrName)) {
      for (const item of recognizerOrName) {
        this.requireFailure(item);
      }
      return this;
    }

    const { requireFail } = this;
    const otherRecognizer = this.manager?.get(recognizerOrName) ?? (recognizerOrName as Recognizer<any>);
    if (requireFail.indexOf(otherRecognizer) === -1) {
      requireFail.push(otherRecognizer);
      otherRecognizer.requireFailure(this);
    }
    return this;
  }

  /**
   * drop the requireFailure link. it does not remove the link on the other recognizer.
   */
  dropRequireFailure(recognizerOrName: Recognizer<any> | string | (Recognizer<any> | string)[]) {
    if (Array.isArray(recognizerOrName)) {
      for (const item of recognizerOrName) {
        this.dropRequireFailure(item);
      }
      return this;
    }

    const otherRecognizer = this.manager?.get(recognizerOrName) ?? (recognizerOrName as Recognizer<any>);
    const index = this.requireFail.indexOf(otherRecognizer);
    if (index > -1) {
      this.requireFail.splice(index, 1);
    }
    return this;
  }

  /**
   * has require failures boolean
   */
  hasRequireFailures(): boolean {
    return this.requireFail.length > 0;
  }

  /**
   * if the recognizer can recognize simultaneous with an other recognizer
   */
  canRecognizeWith(otherRecognizer: Recognizer<any>): boolean {
    return Boolean(this.simultaneous[otherRecognizer.id]);
  }

  /**
   * You should use `tryEmit` instead of `emit` directly to check
   * that all the needed recognizers has failed before emitting.
   */
  protected emit(input: HammerInput) {
    const self = this;
    const { state } = this;

    function emit(event: string) {
      self.manager?.emit(event, input);
    }

    // 'panstart' and 'panmove'
    if (state < RecognizerState.Ended) {
      emit(self.options.event + stateStr(state));
    }

    emit(self.options.event); // simple 'eventName' events

    if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
      emit(input.additionalEvent);
    }

    // panend and pancancel
    if (state >= RecognizerState.Ended) {
      emit(self.options.event + stateStr(state));
    }
  }

  /**
   * Check that all the require failure recognizers has failed,
   * if true, it emits a gesture event,
   * otherwise, setup the state to FAILED.
   */
  protected tryEmit(input: HammerInput) {
    if (this.canEmit()) {
      return this.emit(input);
    }
    // it's failing anyway
    this.state = RecognizerState.Failed;
  }

  /**
   * can we emit?
   */
  protected canEmit(): boolean {
    let i = 0;
    while (i < this.requireFail.length) {
      if (!(this.requireFail[i].state & (RecognizerState.Failed | RecognizerState.Possible))) {
        return false;
      }
      i++;
    }
    return true;
  }

  /**
   * update the recognizer
   */
  recognize(inputData: HammerInput) {
    // make a new copy of the inputData
    // so we can change the inputData without messing up the other recognizers
    const inputDataClone = {...inputData};

    // is is enabled and allow recognizing?
    if (this.options.enable) {
      this.reset();
      this.state = RecognizerState.Failed;
      return;
    }

    // reset when we've reached the end
    if (this.state & (RecognizerState.Recognized | RecognizerState.Cancelled | RecognizerState.Failed)) {
      this.state = RecognizerState.Possible;
    }

    this.state = this.process(inputDataClone);

    // the recognizer has recognized a gesture
    // so trigger an event
    if (this.state & (RecognizerState.Began | RecognizerState.Changed | RecognizerState.Ended | RecognizerState.Cancelled)) {
      this.tryEmit(inputDataClone);
    }
  }

  /**
   * return the state of the recognizer
   * the actual recognizing happens in this method
   */

  abstract process(inputData: HammerInput): RecognizerState;

  /**
   * return the preferred touch-action
   */
  abstract getTouchAction(): string[];

  /**
   * called when the gesture isn't allowed to recognize
   * like when another is being recognized or it is disabled
   */
  reset(): void {}
}
