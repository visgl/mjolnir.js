# Tap

Recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur between the given interval and position. The eventData from the emitted event contains the property `tapCount`, which contains the amount of multi-taps being recognized.

If an Tap recognizer has a failing requirement, it waits the interval time before emitting the event. This is because if you want to only trigger a doubletap, the recognizer needs to see if any other taps are coming in. Use [requireFailure](./event-manager.md#recognize-gesture) to distinguish single tap events from double tap.

## Constructor

```ts
import {EventManager, Tap} from 'mjolnir.js';

const eventManager = new EventManager({
  // ...
  recognizers: [
    new Tap({event: 'doubletap', pointers: 2}),
    [new Tap({event: 'singletap'}), null, 'doubletap']
  ]
});
```

- `options` (object, optional) - Options
  - `event` (string) - Name of the event. Default `'tap'`.
  - `pointers` (number) - Required pointers. Default `1`.
  - `taps` (number) - Amount of taps required. Default `1`.
  - `interval` (number) - Maximum time in ms between multiple taps. Default `300`.
  - `time` (number) - Maximum press time in ms. Default `250`.
  - `threshold` (number) - While doing a tap some small movement is allowed. Default `2`.
  - `posThreshold` (number) - The maximum position difference between multiple taps. Default `10`.

## Events

- tap

## Source

https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/tap.ts
