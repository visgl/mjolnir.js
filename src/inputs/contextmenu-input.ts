// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {MjolnirPointerEventRaw} from '../types';
import {Input, InputOptions} from './input';

export class ContextmenuInput extends Input<MjolnirPointerEventRaw, InputOptions> {
  constructor(
    element: HTMLElement,
    callback: (event: MjolnirPointerEventRaw) => void,
    options: InputOptions
  ) {
    options.enable = options.enable ?? false;
    super(element, callback, options);

    if (options.enable) {
      this.listen('contextmenu', true);
    }
  }

  destroy() {
    this.listen('contextmenu', false);
  }

  /**
   * Enable this input (begin processing events)
   * if the specified event type is among those handled by this input.
   */
  enableEventType(eventType: string, enabled: boolean) {
    if (eventType === 'contextmenu' && this.options.enable !== enabled) {
      this.options.enable = enabled;
      this.listen('contextmenu', enabled);
    }
  }

  handleEvent = (event: MouseEvent) => {
    if (!this.options.enable) {
      return;
    }

    this.callback({
      type: 'contextmenu',
      center: {
        x: event.clientX,
        y: event.clientY
      },
      srcEvent: event,
      pointerType: 'mouse',
      target: event.target as HTMLElement
    });
  };
}
