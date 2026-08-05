// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test} from 'vitest';
import {EventManager, InputDirection, Pan, Pinch} from 'mjolnir.js';
import {createEventTarget} from '../test-utils/dom';

test('PanRecognizer#trackpad', async () => {
  const element = createEventTarget();
  const eventManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 2, threshold: 0, trackpad: true})]
  });
  const events = [];
  eventManager.on('panstart', (event) => events.push(event));
  eventManager.on('panmove', (event) => events.push(event));
  eventManager.on('panend', (event) => events.push(event));

  const WheelEvent = element.ownerDocument.defaultView!.WheelEvent;
  element.dispatchEvent(
    new WheelEvent('wheel', {
      deltaMode: 0,
      deltaX: 10
    })
  );
  element.dispatchEvent(
    new WheelEvent('wheel', {
      deltaMode: 0,
      deltaX: 5
    })
  );
  await new Promise((resolve) => globalThis.setTimeout(resolve, 100));

  expect(
    events.map((event) => event.type),
    'emits a continuous two-finger trackpad pan'
  ).toEqual(['panstart', 'panmove', 'panend']);
  expect(events[0].pointerType, 'identifies the pointer type').toBe('trackpad');
  expect(events[0].deltaX, 'converts scroll delta to pointer movement').toBe(-10);
  expect(events[0].direction, 'reports pointer movement direction').toBe(InputDirection.Left);
  expect(events[1].deltaX, 'reports accumulated movement').toBe(-15);

  eventManager.destroy();
  element.remove();
});

test('PinchRecognizer#trackpad', () => {
  const element = createEventTarget();
  const eventManager = new EventManager(element, {
    recognizers: [new Pinch({trackpad: true})]
  });
  const events = [];
  eventManager.on('pinchstart', (event) => events.push(event));
  eventManager.on('pinchmove', (event) => events.push(event));

  const WheelEvent = element.ownerDocument.defaultView!.WheelEvent;
  element.dispatchEvent(
    new WheelEvent('wheel', {
      ctrlKey: true,
      deltaMode: 0,
      deltaY: -10
    })
  );
  element.dispatchEvent(
    new WheelEvent('wheel', {
      ctrlKey: true,
      deltaMode: 0,
      deltaY: -5
    })
  );

  expect(events.length, 'recognizes a continuous trackpad pinch').toBe(2);
  expect(events[0].pointerType, 'identifies the pointer type').toBe('trackpad');
  expect(events[0].scale, 'converts wheel delta to zoom-in scale').toBe(Math.exp(0.1));
  expect(events[1].scale, 'reports scale from cumulative wheel delta').toBe(Math.exp(0.15));

  eventManager.destroy();
  element.remove();
});

test('trackpad recognizers require opt-in and two pointers', () => {
  const element = createEventTarget();
  const panHandler = () => {};
  const eventManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 2})]
  });

  eventManager.on('panstart', panHandler);
  expect(
    eventManager.wheelSession.hasSubscribers,
    'does not subscribe without trackpad opt-in'
  ).toBeFalsy();
  eventManager.destroy();

  const onePointerManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 1, trackpad: true})]
  });
  onePointerManager.on('panstart', panHandler);
  expect(
    onePointerManager.wheelSession.hasSubscribers,
    'does not subscribe for a one-pointer recognizer'
  ).toBeFalsy();
  onePointerManager.destroy();

  const trackpadManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 2, trackpad: true})]
  });
  trackpadManager.on('panstart', panHandler);
  expect(
    trackpadManager.wheelSession.hasSubscribers,
    'subscribes when trackpad recognition is enabled'
  ).toBeTruthy();
  trackpadManager.off('panstart', panHandler);
  expect(
    trackpadManager.wheelSession.hasSubscribers,
    'unsubscribes when the recognizer is disabled'
  ).toBeFalsy();
  trackpadManager.destroy();

  element.remove();
});
