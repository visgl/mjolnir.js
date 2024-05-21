# Upgrade Guide

## From 2.x to 3.0

- `EventManager` no longer comes with a default set of recognizers. Specify `options.recognizers` to emit gesture events. 
- `EventManager`'s `recognizers` is now a different format. Each element in the array should be either a recognizer instance or an array of [recognizer, recognizeWith, requireFailure].
- `EventManager`'s `recognizerOptions` is removed.
- Element must be supplied when constructing `EventManager` and cannot be reassigned. To change the event target, destroy the existing event manager instance and construct a new one.
- Hammer.js is no longer a dependency. Due to the lack of maintenance on the legacy hammerjs project, mjolnir.js has ported it to TypeScript and incorporated it into the code base. To configure recognizers (Pan, Pinch etc.), directly import them from `mjolnir.js`. For details, see the documentation of each recognizer.

Before:

```ts title="v2"
import Hammer from 'hammer.js';
import {EventManager} from 'mjolnir.js';

new EventManager(document.body, {
  recognizers: [
    [Hammer.Pan, {threshold: 4, direction: Hammer.DIRECTION_HORIZONTAL}],
    [Hammer.Tap, {event: 'doubletap', pointers: 2}],
    [Hammer.Tap, {event: 'singletap'}, null, 'doubletap']
  ]
});
```

After:

```ts title="v3"
import {EventManager, Pan, Tap, InputDirection} from 'mjolnir.js';

new EventManager(document.body, {
  recognizers: [
    new Pan({threshold: 4, direction: InputDirection.Horizontal}),
    new Tap({event: 'doubletap', pointers: 2}),
    [new Tap({event: 'singletap'}), null, 'doubletap']
  ]
});
```

## From 1.x to 2.0

- The `legacyBlockScroll` option to `EventManager` is removed. Use `eventManager.on('wheel', evt => evt.preventDefault())` to block scrolling.
- The `rightButton` option to `EventManager` is removed. Use `eventManager.on('contextmenu', evt => evt.preventDefault())` to enable right-button clicking and dragging.
