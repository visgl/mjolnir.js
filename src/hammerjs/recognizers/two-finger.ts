import {InputEvent} from '../input/input-consts';
import {RecognizerState} from '../recognizer/recognizer-state';
import {PanRecognizer} from './pan';
import {PinchRecognizer} from './pinch';
import type {HammerInput} from '../input/types';
import type {PanRecognizerOptions} from './pan';
import type {PinchRecognizerOptions} from './pinch';

const POINTER_MOVEMENT_THRESHOLD = 1;
const PINCH_THRESHOLD = 0.03;
const ROTATION_THRESHOLD = 3;
const SINGLE_POINTER_DELAY = 40;
const ACTIVE_RECOGNIZER_STATE = RecognizerState.Began | RecognizerState.Changed;

type GesturePointer = HammerInput['pointers'][number];
type MovementState = 'pending' | 'coherent' | 'single-pointer';

function getPointerId(pointer: GesturePointer, index: number): number {
  return 'pointerId' in pointer ? pointer.pointerId : index;
}

function getRotationDelta(rotation: number): number {
  return Math.abs(((((rotation + 180) % 360) + 360) % 360) - 180);
}

class CoherentTwoFingerMovement {
  private pointerPositions = new Map<number, {x: number; y: number}>();
  private movedPointers = new Set<number>();
  private firstMovementTime: number | null = null;

  update(input: HammerInput): MovementState {
    if (input.pointerType !== 'touch' || input.pointers.length !== 2) {
      this.reset();
      return 'coherent';
    }

    const pointers = input.pointers.map((pointer, index) => ({
      id: getPointerId(pointer, index),
      x: pointer.clientX,
      y: pointer.clientY
    }));
    const isNewPair =
      this.pointerPositions.size !== 2 ||
      pointers.some((pointer) => !this.pointerPositions.has(pointer.id));

    if (isNewPair || input.eventType & InputEvent.Start) {
      this.pointerPositions = new Map(
        pointers.map((pointer) => [pointer.id, {x: pointer.x, y: pointer.y}])
      );
      this.movedPointers.clear();
      this.firstMovementTime = null;
      return 'pending';
    }

    for (const pointer of pointers) {
      const previousPosition = this.pointerPositions.get(pointer.id)!;
      if (
        Math.hypot(pointer.x - previousPosition.x, pointer.y - previousPosition.y) >=
        POINTER_MOVEMENT_THRESHOLD
      ) {
        this.movedPointers.add(pointer.id);
      }
    }

    if (this.movedPointers.size < 2) {
      if (this.movedPointers.size === 1) {
        this.firstMovementTime ??= input.timeStamp;
        if (input.timeStamp - this.firstMovementTime >= SINGLE_POINTER_DELAY) {
          return 'single-pointer';
        }
      }
      return 'pending';
    }

    this.pointerPositions = new Map(
      pointers.map((pointer) => [pointer.id, {x: pointer.x, y: pointer.y}])
    );
    this.movedPointers.clear();
    this.firstMovementTime = null;
    return 'coherent';
  }

  private reset(): void {
    this.pointerPositions.clear();
    this.movedPointers.clear();
    this.firstMovementTime = null;
  }
}

/**
 * A two-pointer pan recognizer that waits for a coherent touch update before
 * claiming the gesture. Scale and rotation intent are left for a paired pinch
 * recognizer.
 */
export class TwoFingerPanRecognizer extends PanRecognizer {
  private movement = new CoherentTwoFingerMovement();

  constructor(options: PanRecognizerOptions = {}) {
    super({pointers: 2, ...options});
  }

  attrTest(input: HammerInput): boolean {
    if (input.pointerType !== 'touch' || this.state & ACTIVE_RECOGNIZER_STATE) {
      return super.attrTest(input);
    }

    const movementState = this.movement.update(input);
    if (movementState !== 'coherent') {
      return false;
    }

    const pinchRecognizer = this.manager.recognizers.find(
      (recognizer) => recognizer instanceof PinchRecognizer
    ) as PinchRecognizer | undefined;
    const pinchThreshold = pinchRecognizer?.options.threshold ?? PINCH_THRESHOLD;
    const hasPinchIntent = Math.abs(input.scale - 1) > pinchThreshold;
    const hasRotationIntent = getRotationDelta(input.rotation) > ROTATION_THRESHOLD;
    return !hasPinchIntent && !hasRotationIntent && super.attrTest(input);
  }
}

/**
 * A pinch recognizer that ignores transient scale changes from staggered touch
 * updates and recognizes deliberate two-finger rotation as transform intent.
 */
export class TwoFingerPinchRecognizer extends PinchRecognizer {
  private movement = new CoherentTwoFingerMovement();

  constructor(options: PinchRecognizerOptions = {}) {
    super({threshold: PINCH_THRESHOLD, ...options});
  }

  attrTest(input: HammerInput): boolean {
    if (input.pointerType !== 'touch') {
      return super.attrTest(input);
    }

    const isActive = Boolean(this.state & ACTIVE_RECOGNIZER_STATE);
    const movementState = this.movement.update(input);
    const hasTransformIntent =
      isActive ||
      (movementState !== 'pending' &&
        (Math.abs(input.scale - 1) > this.options.threshold ||
          getRotationDelta(input.rotation) > ROTATION_THRESHOLD));

    if (!hasTransformIntent) {
      return false;
    }

    // Delegate pointer-count validation while keeping an active twist alive
    // even when its scale remains exactly 1.
    return super.attrTest({
      ...input,
      scale: 1 + Math.max(this.options.threshold, Number.EPSILON) * 2
    });
  }
}
