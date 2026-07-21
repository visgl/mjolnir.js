// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {InputEvent} from 'mjolnir.js';
import {WheelGestureSession} from 'mjolnir.js/inputs/wheel-gesture-session';
import {WheelInput} from 'mjolnir.js/inputs/wheel-input';
import {spy} from '../test-utils/spy';
import {createEventTarget} from '../test-utils/dom';

test('wheelInput#constructor', (t) => {
  const element = createEventTarget();
  const addELSpy = spy(element, 'addEventListener');
  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, () => {}, {wheelSession});
  t.ok(wheelInput, 'WheelInput created without optional params');
  t.equal(addELSpy.callCount, 1, 'only the passive session listener is registered');

  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
  t.end();
});

test('wheelInput#destroy', (t) => {
  const element = createEventTarget();
  const numWheelEvents = 1;
  const removeELSpy = spy(element, 'removeEventListener');
  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, () => {}, {wheelSession});
  wheelInput.destroy();
  t.equal(
    removeELSpy.callCount,
    numWheelEvents,
    'should call removeEventListener once for each passed event:handler pair'
  );

  wheelSession.destroy();
  element.remove();
  t.end();
});

test('wheelInput#enableEventType', (t) => {
  const element = createEventTarget();
  const addELSpy = spy(element, 'addEventListener');
  const removeELSpy = spy(element, 'removeEventListener');
  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, null, {
    enable: false,
    wheelSession
  });
  wheelInput.enableEventType('foo', true);
  t.notOk(wheelInput.options.enable, 'should not enable for unsupported event');

  wheelInput.enableEventType('wheel', true);
  t.ok(wheelInput.options.enable, 'should enable for supported event');
  t.equal(addELSpy.callCount, 2, 'adds the passive session and raw wheel listeners');
  wheelInput.enableEventType('wheel', true);
  t.equal(addELSpy.callCount, 2, 'does not add listeners again when already enabled');

  removeELSpy.reset();
  wheelInput.enableEventType('wheel', false);
  t.equal(removeELSpy.callCount, 1, 'removes the raw wheel listener');
  wheelInput.enableEventType('wheel', false);
  t.equal(removeELSpy.callCount, 1, 'does not remove listeners again when already disabled');

  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
  t.end();
});

test('wheelInput#handleEvent', (t) => {
  const element = createEventTarget();

  const wheelEventMock = {
    type: 'foo',
    cancelable: true,
    ctrlKey: false,
    deltaMode: 0,
    deltaX: 0,
    preventDefault: () => {},
    deltaY: 1,
    timeStamp: 0,
    clientX: 123,
    clientY: 456,
    target: element
  };

  let callbackParams = null;
  const callback = (evt) => (callbackParams = evt);

  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, callback, {
    enable: false,
    wheelSession
  });

  wheelInput.handleEvent(wheelEventMock);
  t.notOk(callbackParams, 'callback should not be called when disabled');

  wheelInput.enableEventType('wheel', true);
  wheelSession.handleEvent(wheelEventMock);
  wheelInput.handleEvent(wheelEventMock);
  t.ok(callbackParams, 'callback should be called on wheel event when enabled');
  t.is(callbackParams.delta, -1, 'callback contains the correct delta');
  t.is(callbackParams.device, 'unknown', 'callback contains the current device classification');
  t.deepEquals(callbackParams.center, {x: 123, y: 456}, 'callback contains the correct position');

  callbackParams = null;
  wheelEventMock.deltaY = 4.000244140625;
  wheelEventMock.shiftKey = true;
  wheelSession.handleEvent(wheelEventMock);
  wheelInput.handleEvent(wheelEventMock);
  t.is(callbackParams.delta, -1.00006103515625, 'callback contains the unscaled delta');
  t.is(callbackParams.device, 'mouse', 'callback contains the resolved device classification');

  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
  t.end();
});

test('wheelInput#handleEvent feeds subscribed wheel sessions while disabled', (t) => {
  const element = createEventTarget();
  const sessionEvents = [];
  let callbackParams = null;
  const wheelSession = new WheelGestureSession(element);
  const unsubscribe = wheelSession.on((event) => sessionEvents.push(event));
  const wheelInput = new WheelInput(
    element,
    (event) => {
      callbackParams = event;
    },
    {enable: false, wheelSession}
  );

  const WheelEvent = element.ownerDocument.defaultView!.WheelEvent;
  element.dispatchEvent(
    new WheelEvent('wheel', {
      cancelable: true,
      ctrlKey: true,
      deltaMode: 0,
      deltaX: 0,
      deltaY: 1,
      clientX: 123,
      clientY: 456
    })
  );

  t.notOk(callbackParams, 'raw wheel callback remains disabled');
  t.deepEquals(
    sessionEvents.map((event) => event.eventType),
    [InputEvent.Start, InputEvent.Move],
    'subscribed session still receives the wheel event'
  );
  t.ok(
    sessionEvents.every((event) => event.device === 'trackpad'),
    'session events contain the classified device'
  );

  unsubscribe();
  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
  t.end();
});
