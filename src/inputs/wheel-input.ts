// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {MjolnirWheelEventRaw} from '../types';
import {Input, InputOptions} from './input';
import {WheelGestureSession} from './wheel-gesture-session';

import {userAgent} from '../utils/globals';

const firefox = userAgent.indexOf('firefox') !== -1;

// Constants for normalizing input delta
const WHEEL_DELTA_PER_LINE = 40;
// Slow down zoom if shift key is held for more precise zooming
const SHIFT_MULTIPLIER = 0.25;

type WheelInputOptions = InputOptions & {
  wheelSession?: WheelGestureSession;
};

export class WheelInput extends Input<MjolnirWheelEventRaw, WheelInputOptions> {
  private wheelSessionUnsubscribe: (() => void) | undefined;

  constructor(
    element: HTMLElement,
    callback: (event: MjolnirWheelEventRaw) => void,
    options: WheelInputOptions
  ) {
    options.enable = options.enable ?? false;
    super(element, callback, options);

    if (options.enable) {
      this.wheelSessionUnsubscribe = this.options.wheelSession?.on(() => {});
      this.listen('wheel', true);
    }
  }

  destroy() {
    this.listen('wheel', false);
    this.wheelSessionUnsubscribe?.();
    this.wheelSessionUnsubscribe = undefined;
  }

  /**
   * Enable this input (begin processing events)
   * if the specified event type is among those handled by this input.
   */
  enableEventType(eventType: string, enabled: boolean) {
    if (eventType === 'wheel' && this.options.enable !== enabled) {
      this.options.enable = enabled;
      if (enabled && !this.wheelSessionUnsubscribe) {
        this.wheelSessionUnsubscribe = this.options.wheelSession?.on(() => {});
      }
      this.listen('wheel', enabled);
      if (!enabled) {
        this.wheelSessionUnsubscribe?.();
        this.wheelSessionUnsubscribe = undefined;
      }
    }
  }

  /* eslint-disable complexity, max-statements */
  handleEvent = (event: WheelEvent) => {
    if (!this.options.enable) {
      return;
    }

    let value = event.deltaY;
    if (globalThis.WheelEvent) {
      // Firefox doubles the values on retina screens...
      if (firefox && event.deltaMode === globalThis.WheelEvent.DOM_DELTA_PIXEL) {
        value /= globalThis.devicePixelRatio;
      }
      if (event.deltaMode === globalThis.WheelEvent.DOM_DELTA_LINE) {
        value *= WHEEL_DELTA_PER_LINE;
      }
    }

    if (event.shiftKey && value) {
      value = value * SHIFT_MULTIPLIER;
    }

    this.callback({
      type: 'wheel',
      center: {
        x: event.clientX,
        y: event.clientY
      },
      delta: -value,
      device: this.options.wheelSession?.device ?? 'unknown',
      srcEvent: event,
      pointerType: 'mouse',
      target: event.target as HTMLElement
    });
  };
}
