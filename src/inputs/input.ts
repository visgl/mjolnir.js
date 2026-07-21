// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {MjolnirEventRaw} from '../types';

export interface InputOptions {
  enable?: boolean;
}

export abstract class Input<EventType extends MjolnirEventRaw, Options extends InputOptions> {
  element: HTMLElement;
  options: Options;
  callback: (e: EventType) => void;
  abstract handleEvent: (event: any) => void;

  constructor(element: HTMLElement, callback: (e: EventType) => void, options: Options) {
    this.element = element;
    this.callback = callback;
    this.options = options;
  }

  listen(eventType: string, enabled: boolean): void {
    if (enabled) {
      this.element.addEventListener(eventType, this.handleEvent, {passive: false});
    } else {
      this.element.removeEventListener(eventType, this.handleEvent);
    }
  }
}
