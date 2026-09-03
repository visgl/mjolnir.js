# What's New

## Unreleased

- Added opt-in `coherent` conditions to `Pan` and `Pinch` for distinguishing two-finger
  translation from pinch and rotation gestures without custom recognizer classes.

## v3.1

- `DoubleClickDrag` recognizer
- Added opt-in trackpad gesture support to two-pointer `Pan` and `Pinch` recognizers.
- Added wheel device classification through `MjolnirWheelEvent.device`.

## v3.0

- ES module
- Improved TypeScript definitions
- Ready to use with script tag
- Hammer.js is no longer a dependency due to the lack of maintenance. It has been ported to TypeScript and incorporated into mjolnir.js' code base. This will allow us to better address bugs and security issues moving forward.
