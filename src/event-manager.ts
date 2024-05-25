import {Manager as HammerManager, RecognizerTuple} from './hammerjs';
import type {
  MjolnirEventRaw,
  MjolnirEvent,
  MjolnirEventHandler,
  MjolnirEventHandlers
} from './types';

import WheelInput from './inputs/wheel-input';
import MoveInput from './inputs/move-input';
import KeyInput from './inputs/key-input';
import ContextmenuInput from './inputs/contextmenu-input';

import EventRegistrar, {HandlerOptions} from './utils/event-registrar';

import {
  BASIC_EVENT_ALIASES,
  EVENT_RECOGNIZER_MAP,
  GESTURE_EVENT_ALIASES,
  RECOGNIZERS,
  RECOGNIZER_COMPATIBLE_MAP,
  RECOGNIZER_FALLBACK_MAP
} from './constants';

export type EventManagerOptions = {
  events?: MjolnirEventHandlers;
  recognizers?: RecognizerTuple[];
  touchAction?: string;
  tabIndex?: number;
};

const DEFAULT_OPTIONS: EventManagerOptions = {
  // allow browser default touch action
  // https://github.com/uber/react-map-gl/issues/506
  touchAction: 'none',
  tabIndex: 0
};

// Unified API for subscribing to events about both
// basic input events (e.g. 'mousemove', 'touchstart', 'wheel')
// and gestural input (e.g. 'click', 'tap', 'panstart').
// Delegates gesture related event registration and handling to Hammer.js.
export default class EventManager {
  private manager: HammerManager | null = null;
  private element: HTMLElement | null = null;
  private options: EventManagerOptions;
  private events: Map<string, EventRegistrar>;

  // Custom handlers
  private wheelInput: WheelInput | null = null;
  private moveInput: MoveInput | null = null;
  private contextmenuInput: ContextmenuInput | null = null;
  private keyInput: KeyInput | null = null;

  constructor(element: HTMLElement | null = null, options: EventManagerOptions) {
    this.options = {...DEFAULT_OPTIONS, ...options};
    this.events = new Map();

    this.setElement(element);

    // Register all passed events.
    const {events} = this.options;
    if (events) {
      this.on(events);
    }
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  setElement(element: HTMLElement | null): void {
    if (this.element) {
      // unregister all events
      this.destroy();
    }
    this.element = element;
    if (!element) {
      return;
    }

    const {options} = this;

    const manager = new HammerManager(element, {
      touchAction: options.touchAction,
      recognizers: options.recognizers || RECOGNIZERS
    });
    this.manager = manager;

    manager.on('hammer.input', this._onBasicInput);

    if (!options.recognizers) {
      // Set default recognize withs
      for (const [name, compatibleNames] of Object.entries(RECOGNIZER_COMPATIBLE_MAP)) {
        const recognizer = manager.get(name);
        if (recognizer) {
          compatibleNames.forEach(otherName => {
            recognizer.recognizeWith(otherName);
          });
        }
      }
    }

    // Handle events not handled by Hammer.js:
    // - mouse wheel
    // - pointer/touch/mouse move
    this.wheelInput = new WheelInput(element, this._onOtherEvent, {
      enable: false
    });
    this.moveInput = new MoveInput(element, this._onOtherEvent, {
      enable: false
    });
    this.keyInput = new KeyInput(element, this._onOtherEvent, {
      enable: false,
      tabIndex: options.tabIndex
    });
    this.contextmenuInput = new ContextmenuInput(element, this._onOtherEvent, {
      enable: false
    });

    // Register all existing events
    for (const [eventAlias, eventRegistrar] of this.events) {
      if (!eventRegistrar.isEmpty()) {
        // Enable recognizer for this event.
        this._toggleRecognizer(eventRegistrar.recognizerName, true);
        this.manager.on(eventAlias, eventRegistrar.handleEvent);
      }
    }
  }

  // Tear down internal event management implementations.
  destroy(): void {
    if (this.element) {
      // wheelInput etc. are created in setElement() and therefore
      // cannot exist if there is no element
      this.wheelInput?.destroy();
      this.moveInput?.destroy();
      this.keyInput?.destroy();
      this.contextmenuInput?.destroy();
      this.manager.destroy();

      this.wheelInput = null;
      this.moveInput = null;
      this.keyInput = null;
      this.contextmenuInput = null;
      this.manager = null;
      this.element = null;
    }
  }

  /** Register multiple event handlers */
  on(events: MjolnirEventHandlers, opts?: HandlerOptions): void;
  on<EventT extends MjolnirEvent>(
    event: EventT['type'],
    handler: (event: EventT) => void,
    opts?: HandlerOptions
  ): void;

  /** Register an event handler function to be called on `event` */
  on(event: any, handler: any, opts?: any) {
    this._addEventHandler(event, handler, opts, false);
  }

  /** Register an event handler function to be called on `event`, then remove it */
  once(events: MjolnirEventHandlers, opts?: HandlerOptions): void;
  once<EventT extends MjolnirEvent>(
    event: EventT['type'],
    handler: (event: EventT) => void,
    opts?: HandlerOptions
  ): void;

  once(event: any, handler: any, opts?: any) {
    this._addEventHandler(event, handler, opts, true);
  }

  /** Register an event handler function to be called on `event`
   * This handler does not ask the event to be recognized at all times.
   * Instead, it only "intercepts" the event if some other handler is getting it.
   */
  watch(events: MjolnirEventHandlers, opts?: HandlerOptions): void;
  watch<EventT extends MjolnirEvent>(
    event: EventT['type'],
    handler: (event: EventT) => void,
    opts?: HandlerOptions
  ): void;

  watch(event: any, handler: any, opts?: any) {
    this._addEventHandler(event, handler, opts, false, true);
  }

  /**
   * Deregister a previously-registered event handler.
   */
  off(events: MjolnirEventHandlers): void;
  off<EventT extends MjolnirEvent>(event: EventT['type'], handler: (event: EventT) => void): void;

  off(event: any, handler?: any) {
    this._removeEventHandler(event, handler);
  }

  /*
   * Enable/disable recognizer for the given event
   */
  private _toggleRecognizer(name: string, enabled: boolean): void {
    const {manager} = this;
    if (!manager) {
      return;
    }
    const recognizer = manager.get(name);
    // @ts-ignore
    if (recognizer && recognizer.options.enable !== enabled) {
      recognizer.set({enable: enabled});

      // @ts-expect-error name may not be in RECOGNIZER_FALLBACK_MAP
      const fallbackRecognizers: string[] = RECOGNIZER_FALLBACK_MAP[name];
      if (fallbackRecognizers && !this.options.recognizers) {
        // Set default require failures
        // http://hammerjs.github.io/require-failure/
        fallbackRecognizers.forEach(otherName => {
          const otherRecognizer = manager.get(otherName);
          if (!otherRecognizer) return;
          if (enabled) {
            // Wait for this recognizer to fail
            otherRecognizer.requireFailure(name);
            /**
             * This seems to be a bug in hammerjs:
             * requireFailure() adds both ways
             * dropRequireFailure() only drops one way
             * https://github.com/hammerjs/hammer.js/blob/master/src/recognizerjs/
               recognizer-constructor.js#L136
             */
            recognizer.dropRequireFailure(otherName);
          } else {
            // Do not wait for this recognizer to fail
            otherRecognizer.dropRequireFailure(name);
          }
        });
      }
    }
    this.wheelInput?.enableEventType(name, enabled);
    this.moveInput?.enableEventType(name, enabled);
    this.keyInput?.enableEventType(name, enabled);
    this.contextmenuInput?.enableEventType(name, enabled);
  }

  /**
   * Process the event registration for a single event + handler.
   */
  private _addEventHandler(
    event: string | MjolnirEventHandlers,
    handler: MjolnirEventHandler,
    opts?: HandlerOptions,
    once?: boolean,
    passive?: boolean
  ) {
    if (typeof event !== 'string') {
      // @ts-ignore
      opts = handler;
      // If `event` is a map, call `on()` for each entry.
      for (const [eventName, handler] of Object.entries(event)) {
        this._addEventHandler(eventName, handler!, opts, once, passive);
      }
      return;
    }

    const {manager, events} = this;
    // Alias to a recognized gesture as necessary.
    // @ts-expect-error event may not be in GESTURE_EVENT_ALIASES
    const eventAlias: string = GESTURE_EVENT_ALIASES[event] || event;

    let eventRegistrar = events.get(eventAlias);
    if (!eventRegistrar) {
      // Enable recognizer for this event.
      // @ts-expect-error eventAlias may not be in EVENT_RECOGNIZER_MAP
      const recognizerName = EVENT_RECOGNIZER_MAP[eventAlias] || eventAlias;

      eventRegistrar = new EventRegistrar(this, recognizerName);
      events.set(eventAlias, eventRegistrar);
      // Listen to the event
      if (manager) {
        manager.on(eventAlias, eventRegistrar.handleEvent);
      }
    }
    eventRegistrar.add(event, handler, opts, once, passive);
    if (!eventRegistrar.isEmpty()) {
      this._toggleRecognizer(eventRegistrar.recognizerName, true);
    }
  }

  /**
   * Process the event deregistration for a single event + handler.
   */
  private _removeEventHandler(event: string | MjolnirEventHandlers, handler?: MjolnirEventHandler) {
    if (typeof event !== 'string') {
      // If `event` is a map, call `off()` for each entry.
      for (const [eventName, handler] of Object.entries(event)) {
        this._removeEventHandler(eventName, handler);
      }
      return;
    }

    const {events} = this;
    // Alias to a recognized gesture as necessary.
    // @ts-expect-error event may not be in GESTURE_EVENT_ALIASES
    const eventAlias = GESTURE_EVENT_ALIASES[event] || event;

    const eventRegistrar = events.get(eventAlias);

    if (!eventRegistrar) {
      return;
    }

    eventRegistrar.remove(event, handler!);

    if (eventRegistrar.isEmpty()) {
      const {recognizerName} = eventRegistrar;
      // Disable recognizer if no more handlers are attached to its events
      let isRecognizerUsed = false;
      for (const eh of events.values()) {
        if (eh.recognizerName === recognizerName && !eh.isEmpty()) {
          isRecognizerUsed = true;
          break;
        }
      }
      if (!isRecognizerUsed) {
        this._toggleRecognizer(recognizerName, false);
      }
    }
  }

  /**
   * Handle basic events using the 'hammer.input' Hammer.js API:
   * Before running Recognizers, Hammer emits a 'hammer.input' event
   * with the basic event info. This function emits all basic events
   * aliased to the "class" of event received.
   * See constants.BASIC_EVENT_CLASSES basic event class definitions.
   */
  private _onBasicInput = (event: MjolnirEventRaw) => {
    const {srcEvent} = event;
    // @ts-expect-error srcEvent.type may not be in BASIC_EVENT_ALIASES
    const alias = BASIC_EVENT_ALIASES[srcEvent.type];
    if (alias) {
      // fire all events aliased to srcEvent.type
      this.manager!.emit(alias, event as any);
    }
  };

  /**
   * Handle events not supported by Hammer.js,
   * and pipe back out through same (Hammer) channel used by other events.
   */
  private _onOtherEvent = (event: MjolnirEventRaw) => {
    // console.log('onotherevent', event.type, event)
    this.manager!.emit(event.type, event as any);
  };
}
