// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable @typescript-eslint/no-use-before-define */

import {InputEvent} from '../hammerjs/input/input-consts';
import type {RawInput} from '../hammerjs/input/types';
import type {WheelDevice} from '../types';

export type {WheelDevice} from '../types';

type WheelGestureSessionInputFields =
  | 'eventType'
  | 'timeStamp'
  | 'center'
  | 'deltaX'
  | 'deltaY'
  | 'deltaTime'
  | 'velocity'
  | 'velocityX'
  | 'velocityY'
  | 'overallVelocity'
  | 'overallVelocityX'
  | 'overallVelocityY'
  | 'isFirst'
  | 'isFinal';

export type WheelGestureSessionEvent = Required<Pick<RawInput, WheelGestureSessionInputFields>> & {
  device: Exclude<WheelDevice, 'unknown'>;
  srcEvent: WheelEvent;
};

export type WheelGestureSessionListener = (event: WheelGestureSessionEvent) => void;

type TimerHandle = ReturnType<typeof globalThis.setTimeout>;

export type WheelGestureSessionOptions = {
  /**
   * How long to collect inconclusive wheel events before choosing a device.
   * @default 32
   */
  classificationDelay?: number;
  /**
   * How long without another wheel event ends the current session.
   * @default 80
   */
  endDelay?: number;
};

type RequiredWheelGestureSessionOptions = Required<WheelGestureSessionOptions>;

type Subscription = {
  listener: WheelGestureSessionListener;
};

type WheelSample = {
  event: WheelEvent;
  timeStamp: number;
  deltaX: number;
  deltaY: number;
  isControlKeyDown: boolean;
};

type ActiveSession = {
  samples: WheelSample[];
  device: WheelDevice;
  firstTimeStamp: number;
  lastTimeStamp: number;
  totalDeltaX: number;
  totalDeltaY: number;
  velocityX: number;
  velocityY: number;
  lastEvent: WheelEvent;
};

const WHEEL_DELTA_MAGIC_SCALER = 4.000244140625;
const WHEEL_DELTA_PER_LINE = 40;
const DOM_DELTA_PIXEL = 0;
const DOM_DELTA_LINE = 1;
const RAPID_EVENT_INTERVAL = 40;
const SMALL_DELTA_THRESHOLD = 40;
const LEGACY_WHEEL_DELTA_STEP = 120;

const DEFAULT_OPTIONS: RequiredWheelGestureSessionOptions = {
  classificationDelay: 32,
  endDelay: 80
};

/**
 * Groups DOM wheel events into sessions and classifies each session as mouse
 * or trackpad input.
 *
 * The class passively observes wheel events on the target element.
 * Classification and timers are dormant while there are no subscribers.
 */
export class WheelGestureSession {
  private readonly element: HTMLElement | null;
  private readonly options: RequiredWheelGestureSessionOptions;
  private readonly subscriptions = new Map<WheelGestureSessionListener, Subscription>();

  private session: ActiveSession | null = null;
  private classificationTimer: TimerHandle | null = null;
  private endTimer: TimerHandle | null = null;
  private readonly pressedControlKeys = new Set<string>();
  private listeningForControlKeys = false;

  constructor(element: HTMLElement | null, options: WheelGestureSessionOptions = {}) {
    this.element = element;
    this.options = {...DEFAULT_OPTIONS, ...options};
    this.element?.addEventListener('wheel', this.handleEvent, {passive: true});
  }

  get hasSubscribers(): boolean {
    return this.subscriptions.size > 0;
  }

  get device(): WheelDevice {
    return this.session?.device ?? 'unknown';
  }

  on(listener: WheelGestureSessionListener): () => void {
    const subscription: Subscription = {listener};
    this.subscriptions.set(listener, subscription);
    this.updateControlKeyEventListeners();

    return () => {
      if (this.subscriptions.get(listener) === subscription) {
        this.off(listener);
      }
    };
  }

  off(listener: WheelGestureSessionListener): void {
    this.subscriptions.delete(listener);
    this.updateControlKeyEventListeners();
    if (!this.hasSubscribers) {
      this.reset();
    }
  }

  /**
   * Processes one DOM wheel event and returns the classification known at the
   * end of this call. Ambiguous initial events return "unknown".
   */
  handleEvent = (event: WheelEvent): WheelDevice => {
    if (!this.hasSubscribers) {
      return 'unknown';
    }

    const sample = createSample(event, this.pressedControlKeys.size > 0);
    let session = this.session;
    if (session && sample.timeStamp - session.lastTimeStamp >= this.options.endDelay) {
      this.end();
      if (!this.hasSubscribers) {
        return 'unknown';
      }
      session = null;
    }

    if (session) {
      this.scheduleEnd();
      this.addSample(session, sample);
    } else {
      session = this.startPendingSession(sample);
      this.scheduleEnd();
    }

    let {device} = session;
    if (device === 'unknown') {
      device = classifyWheelSession(session.samples, false);
      if (device !== 'unknown') {
        this.begin(session, device);
      }
    }
    return device;
  };

  /**
   * Cancels a recognized session. An unclassified pending session is silently
   * discarded.
   */
  cancel(): void {
    const session = this.session;
    if (session && session.device !== 'unknown') {
      this.emit(InputEvent.Cancel, session.lastEvent);
    }
    this.reset();
  }

  destroy(): void {
    this.cancel();
    this.subscriptions.clear();
    this.updateControlKeyEventListeners();
    this.element?.removeEventListener('wheel', this.handleEvent);
  }

  private startPendingSession(sample: WheelSample): ActiveSession {
    const session: ActiveSession = {
      samples: [sample],
      device: 'unknown',
      firstTimeStamp: sample.timeStamp,
      lastTimeStamp: sample.timeStamp,
      totalDeltaX: sample.deltaX,
      totalDeltaY: sample.deltaY,
      velocityX: 0,
      velocityY: 0,
      lastEvent: sample.event
    };
    this.session = session;
    this.classificationTimer = globalThis.setTimeout(
      this.finishClassification,
      this.options.classificationDelay
    );
    return session;
  }

  private addSample(session: ActiveSession, sample: WheelSample): void {
    session.samples.push(sample);
    session.lastTimeStamp = sample.timeStamp;
    session.lastEvent = sample.event;
    session.totalDeltaX += sample.deltaX;
    session.totalDeltaY += sample.deltaY;

    if (session.device !== 'unknown') {
      const previousSample = session.samples[session.samples.length - 2];
      const elapsed = sample.timeStamp - previousSample.timeStamp;
      session.velocityX = elapsed > 0 ? sample.deltaX / elapsed : 0;
      session.velocityY = elapsed > 0 ? sample.deltaY / elapsed : 0;
      this.emit(InputEvent.Move, sample.event, {
        velocityX: session.velocityX,
        velocityY: session.velocityY
      });
    }
  }

  private finishClassification = (): void => {
    this.classificationTimer = null;
    if (!this.session || this.session.device !== 'unknown') {
      return;
    }

    const session = this.session;
    const device = classifyWheelSession(session.samples, true);
    this.begin(session, device === 'unknown' ? 'mouse' : device);
  };

  private begin(session: ActiveSession, device: Exclude<WheelDevice, 'unknown'>): void {
    session.device = device;
    this.clearClassificationTimer();

    this.emit(InputEvent.Start, session.samples[0].event);

    const elapsed = session.lastTimeStamp - session.firstTimeStamp;
    session.velocityX = elapsed > 0 ? session.totalDeltaX / elapsed : 0;
    session.velocityY = elapsed > 0 ? session.totalDeltaY / elapsed : 0;
    this.emit(InputEvent.Move, session.lastEvent, {
      velocityX: session.velocityX,
      velocityY: session.velocityY
    });
  }

  private scheduleEnd(): void {
    this.clearEndTimer();
    this.endTimer = globalThis.setTimeout(this.end, this.options.endDelay);
  }

  private end = (): void => {
    if (!this.session) {
      return;
    }

    if (this.session.device === 'unknown') {
      const session = this.session;
      const device = classifyWheelSession(session.samples, true);
      this.begin(session, device === 'unknown' ? 'mouse' : device);
    }

    if (!this.session) {
      return;
    }

    const session = this.session;
    this.emit(InputEvent.End, session.lastEvent);
    this.reset();
  };

  private emit(
    eventType: InputEvent,
    srcEvent: WheelEvent,
    velocities?: {velocityX: number; velocityY: number}
  ): void {
    const session = this.session;
    if (!session || session.device === 'unknown') {
      return;
    }

    const isFirst = eventType === InputEvent.Start;
    const isFinal = eventType === InputEvent.End || eventType === InputEvent.Cancel;
    const timeStamp = isFirst ? session.firstTimeStamp : session.lastTimeStamp;
    const deltaTime = isFirst ? 0 : Math.max(0, timeStamp - session.firstTimeStamp);
    const deltaX = isFirst ? 0 : session.totalDeltaX;
    const deltaY = isFirst ? 0 : session.totalDeltaY;
    const overallVelocityX = deltaTime > 0 ? deltaX / deltaTime : 0;
    const overallVelocityY = deltaTime > 0 ? deltaY / deltaTime : 0;
    const velocityX = isFirst ? 0 : (velocities?.velocityX ?? session.velocityX);
    const velocityY = isFirst ? 0 : (velocities?.velocityY ?? session.velocityY);

    const event: WheelGestureSessionEvent = {
      eventType,
      device: session.device,
      srcEvent,
      timeStamp,
      center: {
        x: srcEvent.clientX,
        y: srcEvent.clientY
      },
      deltaX,
      deltaY,
      deltaTime,
      velocity: Math.abs(velocityX) > Math.abs(velocityY) ? velocityX : velocityY,
      velocityX,
      velocityY,
      overallVelocity:
        Math.abs(overallVelocityX) > Math.abs(overallVelocityY)
          ? overallVelocityX
          : overallVelocityY,
      overallVelocityX,
      overallVelocityY,
      isFirst,
      isFinal
    };

    for (const {listener} of [...this.subscriptions.values()]) {
      listener(event);
    }
  }

  private reset(): void {
    this.clearClassificationTimer();
    this.clearEndTimer();
    this.session = null;
  }

  private clearClassificationTimer(): void {
    if (this.classificationTimer !== null) {
      globalThis.clearTimeout(this.classificationTimer);
      this.classificationTimer = null;
    }
  }

  private clearEndTimer(): void {
    if (this.endTimer !== null) {
      globalThis.clearTimeout(this.endTimer);
      this.endTimer = null;
    }
  }

  private updateControlKeyEventListeners(): void {
    const shouldListen = this.hasSubscribers;

    const eventTarget = getWindow();
    if (!eventTarget || shouldListen === this.listeningForControlKeys) {
      return;
    }

    this.listeningForControlKeys = shouldListen;
    if (shouldListen) {
      eventTarget.addEventListener('keydown', this.handleKeyDown, true);
      eventTarget.addEventListener('keyup', this.handleKeyUp, true);
      eventTarget.addEventListener('blur', this.handleWindowBlur);
    } else {
      eventTarget.removeEventListener('keydown', this.handleKeyDown, true);
      eventTarget.removeEventListener('keyup', this.handleKeyUp, true);
      eventTarget.removeEventListener('blur', this.handleWindowBlur);
      this.pressedControlKeys.clear();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Control') {
      this.pressedControlKeys.add(event.code || event.key);
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key === 'Control') {
      if (event.code) {
        this.pressedControlKeys.delete(event.code);
      } else {
        this.pressedControlKeys.clear();
      }
    }
  };

  private handleWindowBlur = (): void => {
    this.pressedControlKeys.clear();
  };
}

function getWindow(): Window | null {
  if (typeof window !== 'undefined') {
    return window;
  }
  return globalThis.document?.defaultView;
}

function createSample(event: WheelEvent, isControlKeyDown: boolean): WheelSample {
  let deltaX = event.deltaX;
  let deltaY = event.deltaY;

  if (event.deltaMode === DOM_DELTA_LINE) {
    deltaX *= WHEEL_DELTA_PER_LINE;
    deltaY *= WHEEL_DELTA_PER_LINE;
  }

  return {
    event,
    timeStamp: event.timeStamp,
    deltaX,
    deltaY,
    isControlKeyDown
  };
}

function classifyWheelSession(samples: WheelSample[], force: boolean): WheelDevice {
  if (samples.some(({event, isControlKeyDown}) => event.ctrlKey && !isControlKeyDown)) {
    return 'trackpad';
  }

  if (samples.some(({event}) => event.deltaMode !== DOM_DELTA_PIXEL)) {
    return 'mouse';
  }

  if (samples.some(isLegacyMouseWheelSample)) {
    return 'mouse';
  }

  if (
    samples.every(({event}) => {
      const wheelDelta = (event as WheelEvent & {wheelDelta?: number}).wheelDelta;
      return wheelDelta !== undefined && Math.abs(wheelDelta) % 40 === 0;
    })
  ) {
    return 'mouse';
  }

  if (samples.some(({deltaX}) => deltaX !== 0)) {
    return 'trackpad';
  }

  if (samples.length > 1 && isRapidSmallDeltaSequence(samples)) {
    return 'trackpad';
  }

  return force ? 'mouse' : 'unknown';
}

function isLegacyMouseWheelSample({event, deltaX, deltaY}: WheelSample): boolean {
  if (deltaX !== 0 || deltaY === 0) {
    return false;
  }

  const magicScaledDelta = Math.abs(deltaY / WHEEL_DELTA_MAGIC_SCALER);
  if (Number.isInteger(magicScaledDelta)) {
    return true;
  }

  const legacyWheelDelta = (event as WheelEvent & {wheelDelta?: number}).wheelDelta;
  return (
    typeof legacyWheelDelta === 'number' &&
    legacyWheelDelta !== 0 &&
    legacyWheelDelta % LEGACY_WHEEL_DELTA_STEP === 0
  );
}

function isRapidSmallDeltaSequence(samples: WheelSample[]): boolean {
  for (let index = 0; index < samples.length; index++) {
    const sample = samples[index];
    if (
      Math.abs(sample.deltaX) > SMALL_DELTA_THRESHOLD ||
      Math.abs(sample.deltaY) > SMALL_DELTA_THRESHOLD
    ) {
      return false;
    }
    if (index > 0 && sample.timeStamp - samples[index - 1].timeStamp > RAPID_EVENT_INTERVAL) {
      return false;
    }
  }
  return true;
}
