// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {AttrRecognizer, type AttrRecognizerOptions} from './attribute';
import {getDirection} from '../input/get-direction';
import type {HammerInput} from '../input/types';
import type {
  WheelGestureSession,
  WheelGestureSessionEvent
} from '../../inputs/wheel-gesture-session';

export type TrackpadRecognizerOptions = AttrRecognizerOptions & {
  trackpad: boolean;
};

export type TrackpadRecognizerSetOptions<OptionsT> = Partial<OptionsT> & {
  wheelSession?: WheelGestureSession;
};

export abstract class TrackpadRecognizer<
  OptionsT extends TrackpadRecognizerOptions
> extends AttrRecognizer<OptionsT> {
  private wheelSession: WheelGestureSession | null = null;
  private wheelSessionUnsubscribe: (() => void) | null = null;

  set(options: TrackpadRecognizerSetOptions<OptionsT>) {
    const {wheelSession, ...recognizerOptions} = options;
    if (wheelSession && wheelSession !== this.wheelSession) {
      this.wheelSessionUnsubscribe?.();
      this.wheelSessionUnsubscribe = null;
      this.wheelSession = wheelSession;
    }

    super.set(recognizerOptions as Partial<OptionsT>);
    this.updateWheelSessionSubscription();
    return this;
  }

  protected abstract handleTrackpadEvent(event: WheelGestureSessionEvent): void;

  protected getTrackpadInput(
    event: WheelGestureSessionEvent,
    overrides: Partial<HammerInput> = {}
  ): HammerInput {
    const {srcEvent} = event;
    const deltaX = overrides.deltaX ?? event.deltaX;
    const deltaY = overrides.deltaY ?? event.deltaY;
    const direction = getDirection(deltaX, deltaY);
    const pointer = srcEvent as unknown as HammerInput['srcEvent'];

    return {
      pointers: [pointer, pointer],
      changedPointers: [pointer, pointer],
      pointerType: 'trackpad',
      srcEvent: pointer,
      eventType: event.eventType,
      timeStamp: event.timeStamp,
      deltaTime: event.deltaTime,
      center: event.center,
      deltaX,
      deltaY,
      angle: (Math.atan2(deltaY, deltaX) * 180) / Math.PI,
      distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      scale: 1,
      rotation: 0,
      direction,
      offsetDirection: direction,
      velocity: event.velocity,
      velocityX: event.velocityX,
      velocityY: event.velocityY,
      overallVelocity: event.overallVelocity,
      overallVelocityX: event.overallVelocityX,
      overallVelocityY: event.overallVelocityY,
      maxPointers: 2,
      target: (srcEvent.target as HTMLElement) || this.manager.element!,
      additionalEvent: '',
      ...overrides
    };
  }

  private updateWheelSessionSubscription(): void {
    const shouldSubscribe = Boolean(
      this.wheelSession &&
        this.options.enable &&
        this.options.trackpad &&
        this.options.pointers === 2
    );

    if (shouldSubscribe && !this.wheelSessionUnsubscribe) {
      this.wheelSessionUnsubscribe = this.wheelSession!.on(this.handleWheelSessionEvent);
    } else if (!shouldSubscribe && this.wheelSessionUnsubscribe) {
      this.wheelSessionUnsubscribe();
      this.wheelSessionUnsubscribe = null;
    }
  }

  private handleWheelSessionEvent = (event: WheelGestureSessionEvent): void => {
    if (event.device === 'trackpad') {
      this.handleTrackpadEvent(event);
    }
  };
}
