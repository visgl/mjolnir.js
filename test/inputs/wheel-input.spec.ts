// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {WheelInput} from 'mjolnir.js/inputs/wheel-input';
import {spy} from '../test-utils/spy';
import {createEventTarget} from '../test-utils/dom';

test('wheelInput#constructor', (t) => {
  const element = createEventTarget();
  const numWheelEvents = 1; // WHEEL_EVENTS.length
  const addELSpy = spy(element, 'addEventListener');
  const wheelInput = new WheelInput(element, () => {}, {});
  t.ok(wheelInput, 'WheelInput created without optional params');
  t.equal(
    addELSpy.callCount,
    numWheelEvents,
    'should call addEventListener once for each passed event:handler pair'
  );

  element.remove();
  t.end();
});

test('wheelInput#destroy', (t) => {
  const element = createEventTarget();
  const numWheelEvents = 1; // WHEEL_EVENTS.length
  const removeELSpy = spy(element, 'removeEventListener');
  const wheelInput = new WheelInput(element, () => {}, {});
  wheelInput.destroy();
  t.equal(
    removeELSpy.callCount,
    numWheelEvents,
    'should call removeEventListener once for each passed event:handler pair'
  );

  element.remove();
  t.end();
});

test('moveInput#enableEventType', (t) => {
  const element = createEventTarget();
  const WHEEL_EVENT_TYPES = ['wheel']; // wheel-input.EVENT_TYPE
  const wheelInput = new WheelInput(element, null, {
    enable: false
  });
  wheelInput.enableEventType('foo', true);
  t.notOk(wheelInput.options.enable, 'should not enable for unsupported event');

  t.ok(
    WHEEL_EVENT_TYPES.every((event) => {
      wheelInput.options.enable = false;
      wheelInput.enableEventType(event, true);
      return wheelInput.options.enable;
    }),
    'should enable for all supported events'
  );

  element.remove();
  t.end();
});

test('wheelInput#handleEvent', (t) => {
  const element = createEventTarget();

  const wheelEventMock = {
    type: 'foo',
    preventDefault: () => {},
    deltaY: 1,
    clientX: 123,
    clientY: 456,
    target: element
  };

  let callbackParams = null;
  const callback = (evt) => (callbackParams = evt);

  const wheelInput = new WheelInput(element, callback, {
    enable: false
  });

  wheelInput.handleEvent(wheelEventMock);
  t.notOk(callbackParams, 'callback should not be called when disabled');

  wheelInput.options.enable = true;
  wheelInput.handleEvent(wheelEventMock);
  t.ok(callbackParams, 'callback should be called on wheel event when enabled');
  t.is(callbackParams.delta, -1, 'callback contains the correct delta');
  t.deepEquals(callbackParams.center, {x: 123, y: 456}, 'callback contains the correct position');

  callbackParams = null;
  wheelEventMock.deltaY = 4.000244140625;
  wheelEventMock.shiftKey = true;
  wheelInput.handleEvent(wheelEventMock);
  t.is(callbackParams.delta, -0.25, 'callback contains the correct delta');

  element.remove();
  t.end();
});
