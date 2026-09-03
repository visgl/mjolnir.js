import {Recognizer, RecognizerOptions} from '../recognizer/recognizer';
import {RecognizerState} from '../recognizer/recognizer-state';
import {InputEvent} from '../input/input-consts';
import type {HammerInput} from '../input/types';

/**
 * Minimum input deltas that must be reached before a recognizer can begin.
 * Conditions in one object are combined with AND. Multiple objects are combined with OR.
 */
export type InputCoherenceCondition = {
  /** Minimum movement of the gesture center, in pixels. */
  distance?: number;
  /** Minimum displacement of every pointer from where the current pointer set began, in pixels. */
  distancePerPointer?: number;
  /** Minimum time since the first movement within the current pointer set, in milliseconds. */
  movementDeltaTime?: number;
  /** Minimum absolute rotation from the initial pointer orientation, in degrees. */
  rotation?: number;
  /** Minimum absolute scale change from 1. */
  scale?: number;
};

export type AttrRecognizerOptions = RecognizerOptions & {
  pointers: number;
  coherent?: InputCoherenceCondition[];
};

function getRotationDelta(rotation: number): number {
  return Math.abs(((((rotation + 180) % 360) + 360) % 360) - 180);
}

function matchesCoherenceCondition(
  input: HammerInput,
  condition: InputCoherenceCondition
): boolean {
  return (
    (condition.distance === undefined || input.distance >= condition.distance) &&
    (condition.distancePerPointer === undefined ||
      (input.distancePerPointer.length > 0 &&
        input.distancePerPointer.every((distance) => distance >= condition.distancePerPointer!))) &&
    (condition.movementDeltaTime === undefined ||
      input.movementDeltaTime >= condition.movementDeltaTime) &&
    (condition.rotation === undefined || getRotationDelta(input.rotation) >= condition.rotation) &&
    (condition.scale === undefined || Math.abs(input.scale - 1) >= condition.scale)
  );
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 */
export abstract class AttrRecognizer<
  OptionsT extends AttrRecognizerOptions
> extends Recognizer<OptionsT> {
  /**
   * Used to check if it the recognizer receives valid input, like input.distance > 10.
   */
  attrTest(input: HammerInput): boolean {
    const optionPointers = this.options.pointers;
    return optionPointers === 0 || input.pointers.length === optionPointers;
  }

  /** Test the configured input coherence conditions without retaining recognizer state. */
  protected coherentTest(input: HammerInput): boolean {
    const conditions = this.options.coherent;
    return (
      !conditions?.length ||
      conditions.some((condition) => matchesCoherenceCondition(input, condition))
    );
  }

  /**
   * Process the input and return the state for the recognizer
   */
  process(input: HammerInput) {
    const {state} = this;
    const {eventType} = input;

    const isRecognized = state & (RecognizerState.Began | RecognizerState.Changed);
    const isValid = this.attrTest(input);

    // on cancel input and we've recognized before, return STATE_CANCELLED
    if (isRecognized && (eventType & InputEvent.Cancel || !isValid)) {
      return state | RecognizerState.Cancelled;
    } else if (isRecognized || isValid) {
      if (eventType & InputEvent.End) {
        return state | RecognizerState.Ended;
      } else if (!(state & RecognizerState.Began)) {
        return RecognizerState.Began;
      }
      return state | RecognizerState.Changed;
    }
    return RecognizerState.Failed;
  }
}
