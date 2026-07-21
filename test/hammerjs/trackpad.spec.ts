// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {EventManager, InputDirection, Pan, Pinch} from 'mjolnir.js';
import {createEventTarget} from '../test-utils/dom';

test('PanRecognizer#trackpad', async (t) => {
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

  t.deepEquals(
    events.map((event) => event.type),
    ['panstart', 'panmove', 'panend'],
    'emits a continuous two-finger trackpad pan'
  );
  t.equal(events[0].pointerType, 'trackpad', 'identifies the pointer type');
  t.equal(events[0].deltaX, -10, 'converts scroll delta to pointer movement');
  t.equal(events[0].direction, InputDirection.Left, 'reports pointer movement direction');
  t.equal(events[1].deltaX, -15, 'reports accumulated movement');

  eventManager.destroy();
  element.remove();
  t.end();
});

test('PinchRecognizer#trackpad', (t) => {
  const element = createEventTarget();
  const eventManager = new EventManager(element, {
    recognizers: [new Pinch({trackpad: true})]
  });
  const events = [];
  eventManager.on('pinchstart', (event) => events.push(event));

  const WheelEvent = element.ownerDocument.defaultView!.WheelEvent;
  element.dispatchEvent(
    new WheelEvent('wheel', {
      ctrlKey: true,
      deltaMode: 0,
      deltaY: -10
    })
  );

  t.equal(events.length, 1, 'recognizes a trackpad pinch');
  t.equal(events[0].pointerType, 'trackpad', 'identifies the pointer type');
  t.ok(events[0].scale > 1, 'converts negative wheel delta to zoom-in scale');

  eventManager.destroy();
  element.remove();
  t.end();
});

test('trackpad recognizers require opt-in and two pointers', (t) => {
  const element = createEventTarget();
  const panHandler = () => {};
  const eventManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 2})]
  });

  eventManager.on('panstart', panHandler);
  t.notOk(eventManager.wheelSession.hasSubscribers, 'does not subscribe without trackpad opt-in');
  eventManager.destroy();

  const onePointerManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 1, trackpad: true})]
  });
  onePointerManager.on('panstart', panHandler);
  t.notOk(
    onePointerManager.wheelSession.hasSubscribers,
    'does not subscribe for a one-pointer recognizer'
  );
  onePointerManager.destroy();

  const trackpadManager = new EventManager(element, {
    recognizers: [new Pan({pointers: 2, trackpad: true})]
  });
  trackpadManager.on('panstart', panHandler);
  t.ok(
    trackpadManager.wheelSession.hasSubscribers,
    'subscribes when trackpad recognition is enabled'
  );
  trackpadManager.off('panstart', panHandler);
  t.notOk(
    trackpadManager.wheelSession.hasSubscribers,
    'unsubscribes when the recognizer is disabled'
  );
  trackpadManager.destroy();

  element.remove();
  t.end();
});
