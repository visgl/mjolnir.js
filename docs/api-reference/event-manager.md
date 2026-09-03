# EventManager

Provides a unified API for subscribing to events about both basic input events (e.g. 'pointermove', 'keydown', 'wheel') and gestural input (e.g. 'click', 'tap', 'panstart').

## Constructor

Creates a new `EventManager` instance.

```ts
import {EventManager} from 'mjolnir.js';

const eventManager = new EventManager(target, options);
```

- `target` (HTMLElement) - DOM element on which event handlers will be registered.
- `options` (object) - Options
  - `events` (object) - A map from event names to their handler functions, to register on init.
  - `recognizers` (RecognizerTuple[]) - Gesture recognizers. See [Recognize Gestures](#recognize-gestures) section below for usage.
  - `touchAction` (string) - Allow browser default touch actions. See [touch-action CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action). Use 'compute' to automatically set as the least restrictive value to support the recognizers. Default `'compute'`.
  - `tabIndex` (number) - The [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the root element. Default `0`.
  - `cssProps` (object) - Optional CSS properties to apply to the target element. Default `{userSelect: 'none', touchCallout: 'none'}`.

## Methods

### destroy

Tears down internal event management implementations.

```ts
eventManager.destroy();
```

_Note: It is recommended to call `destroy` when done since `EventManager` adds event listeners to `window`._

### on

Register an event handler function to be called on `event`.

```ts
eventManager.on(event, handler, options);
eventManager.on(eventMap, options);
```

- `event` (string) - An event name
- `handler` ((event: MjolnirEvent) => void) - The function to be called on `event`.
- `eventMap` (object) - A map from event names to their handler functions
- `options` (object, optional)
  - `srcElement` (HTMLElement) - The source element of this event. If provided, only events that are targeting this element or its decendants will invoke the handler. If ignored, default to the root element of the event manager. Events are propagated up the DOM tree.
  - `priority` (number) - Handlers targeting the same `srcElement` will be executed by their priorities (higher numbers first). Handlers with the same priority will be executed in the order of registration. Default `0`.

_Note: Unlike the DOM event system, developers are responsible of deregistering event handlers when `srcElement` is removed._

### once

Register a one-time event handler function to be called on `event`. The handler is removed once it has been called.

```ts
eventManager.once(event, handler, options);
eventManager.once(eventMap, options);
```

Expects the same arguments as [on](#on).

### watch

Register an event handler function to be called on `event`. This handler does not ask the event to be recognized from user input; rather, it "intercepts" the event if some other handler is getting it.

```ts
eventManager.watch(event, handler, options);
eventManager.watch(eventMap, options);
```

Expects the same arguments as [on](#on).

For example, we want a child element to block any `dblclick` event from bubbling up to root. The root may or may not be actually listening to `dblclick`. If the root did not register a handler, and we use

```ts
eventManager.on('dblClick', evt => evt.stopPropagation(), {srcElement: <child>});
```

It will enable the double tap recognizer. Recognizers for gestures add additional overhead, and may cause subtle behavioral changes. In this case, recognizing `dblclick` events will cause the `click` events to be fired with a small delay. Since we only want to be notified _if_ a `dblclick` event is fired, it is safer to use:

```ts
eventManager.watch('dblClick', evt => evt.stopPropagation(), {srcElement: <child>});
```

### off

- Deregister a previously-registered event handler.

`eventManager.off(event, handler)`
`eventManager.off(eventMap)`

- `event` (string) - An event name
- `handler` ((event: MjolnirEvent) => void) - The function to be called on `event`.
- `eventMap` (object) - A map from event names to their handler functions

## Events and Gestures

### Basic input events

- `'keydown'`
- `'keyup'`
- `'pointerdown'`
- `'pointermove'`
- `'pointerup'`
- `'pointerover'`
- `'pointerout'`
- `'pointerleave'`
- `'wheel'`
- `'contextmenu'`

Remarks:

- Keyboard events are fired when focus is on the EventManager's target element or its decendants, unless typing into a text input.
- `wheel` events are emitted for both mouse wheels and trackpads. See [`MjolnirWheelEvent`](./types.md#mjolnirwheelevent) for device classification.
- Calling `preventDefault()` from a `wheel` handler prevents the browser's default scrolling behavior.

### Recognize gestures

To emit gesture events from user input, the application should pass a list of recognizers to the `EventManager` constructor.
Each item in the `recognizers` list can be one of:

- A recognizer class, e.g. `Pan`
- A recognizer instance, e.g. `new Pan({pointers: 2})`
- An array in the following form:
  - `RecognizerClass` - A recognizer class
  - `options` (object, optional) - An object that is the recognizer options
  - `recognizeWith` (string | string[], optional) - Allow another gesture to be recognized simultaneously with this one. For example an interaction can trigger pinch and rotate at the same time.
  - `requireFailure` (string | string[], optional) - Another recognizer is mutually exclusive with this one. For example an interaction could be singletap or doubletap; pan-horizontal or pan-vertical; but never both.
- An object with the following field:
  - `recognizer` - A recognizer instance
  - `recognizeWith` (string[], optional) - Allow another gesture to be recognized simultaneously with this one. For example an interaction can trigger pinch and rotate at the same time.
  - `requireFailure` (string[], optional) - Another recognizer is mutually exclusive with this one. For example an interaction could be singletap or doubletap; pan-horizontal or pan-vertical; but never both.

The following recognizers are available for use:

- [Pan](./pan.md)
- [Pinch](./pinch.md)
- [Press](./press.md)
- [Rotate](./rotate.md)
- [Swipe](./swipe.md)
- [Tap](./tap.md)

### Trackpad gestures

`Pan` and `Pinch` can optionally recognize trackpad gestures. Trackpad recognition is disabled by default and does not change existing pointer or touch handling.

```ts
import {EventManager, Pan, Pinch} from 'mjolnir.js';

const eventManager = new EventManager(target, {
  recognizers: [
    new Pan({event: 'trackpadpan', pointers: 2, trackpad: true}),
    new Pinch({trackpad: true})
  ]
});
```

Two-finger scrolling can drive a two-pointer [Pan](./pan.md#trackpad-pan), while a trackpad pinch can drive [Pinch](./pinch.md#trackpad-pinch). Generated gesture events have `pointerType: 'trackpad'`.

### Coherent two-finger gestures

The existing `Pan` and `Pinch` recognizers accept opt-in `coherent` conditions for applications
that need to distinguish two-finger translation from scale and rotation. Each condition describes
minimum input deltas that must all be met. Multiple conditions are alternatives, so any one may
begin recognition. `distancePerPointer` measures each pointer's displacement from its position
when the current pointer set was established. `movementDeltaTime` measures time since the first
movement within that set, including subpixel movement. Both reset only when a pointer is added,
removed, or replaced, not after each pair of moves. The `distancePerPointer` condition accepts
any numeric threshold in pixels, such as `0.5`, `1`, or `4`.

```ts
import {EventManager, Pan, Pinch} from 'mjolnir.js';

const eventManager = new EventManager(target, {
  recognizers: [
    new Pinch({
      pointers: 2,
      coherent: [
        {movementDeltaTime: 40, distance: 2, scale: 0.03},
        {movementDeltaTime: 40, distance: 2, rotation: 3},
        {distancePerPointer: 1, scale: 0.03},
        {distancePerPointer: 1, rotation: 3}
      ]
    }),
    {
      recognizer: new Pan({
        event: 'multipan',
        pointers: 2,
        threshold: 10,
        coherent: [{distancePerPointer: 1}]
      }),
      requireFailure: ['pinch']
    }
  ]
});
```

In this example, `Pinch` wins when its scale or rotation condition succeeds first. `Pan` wins when
every pointer has moved at least one pixel, its pan threshold is exceeded, and `Pinch` has not
claimed the event. Passing only the pan coherence test does not block a subsequent pinch while
pan remains below its threshold. Once either recognizer begins, the manager prevents the other
from claiming later events, even if the input drops below the initial coherence threshold.
A delayed condition preserves deliberately anchored pinches where only one pointer moves.
Omitting `coherent` preserves the existing `Pan` and `Pinch` behavior.

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/event-manager.ts
