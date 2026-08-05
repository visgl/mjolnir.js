// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test, vi} from 'vitest';
import {InputEvent} from 'mjolnir.js';
import {WheelGestureSession} from 'mjolnir.js/inputs/wheel-gesture-session';
import {WheelInput} from 'mjolnir.js/inputs/wheel-input';
import {createEventTarget} from '../test-utils/dom';

test('wheelInput#constructor', () => {
  const element = createEventTarget();
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, () => {}, {wheelSession});
  expect(wheelInput, 'WheelInput created without optional params').toBeTruthy();
  expect(addELSpy, 'only the passive session listener is registered').toHaveBeenCalledTimes(1);

  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
});

test('wheelInput#destroy', () => {
  const element = createEventTarget();
  const numWheelEvents = 1;
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, () => {}, {wheelSession});
  wheelInput.destroy();
  expect(
    removeELSpy,
    'should call removeEventListener once for each passed event:handler pair'
  ).toHaveBeenCalledTimes(numWheelEvents);

  wheelSession.destroy();
  element.remove();
});

test('wheelInput#enableEventType', () => {
  const element = createEventTarget();
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const wheelSession = new WheelGestureSession(element);
  const wheelInput = new WheelInput(element, null, {
    enable: false,
    wheelSession
  });
  wheelInput.enableEventType('foo', true);
  expect(wheelInput.options.enable, 'should not enable for unsupported event').toBeFalsy();

  wheelInput.enableEventType('wheel', true);
  expect(wheelInput.options.enable, 'should enable for supported event').toBeTruthy();
  expect(addELSpy, 'adds the passive session and raw wheel listeners').toHaveBeenCalledTimes(2);
  wheelInput.enableEventType('wheel', true);
  expect(addELSpy, 'does not add listeners again when already enabled').toHaveBeenCalledTimes(2);

  removeELSpy.mockClear();
  wheelInput.enableEventType('wheel', false);
  expect(removeELSpy, 'removes the raw wheel listener').toHaveBeenCalledTimes(1);
  wheelInput.enableEventType('wheel', false);
  expect(
    removeELSpy,
    'does not remove listeners again when already disabled'
  ).toHaveBeenCalledTimes(1);

  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
});

test('wheelInput#handleEvent', () => {
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
  expect(callbackParams, 'callback should not be called when disabled').toBeFalsy();

  wheelInput.enableEventType('wheel', true);
  wheelSession.handleEvent(wheelEventMock);
  wheelInput.handleEvent(wheelEventMock);
  expect(callbackParams, 'callback should be called on wheel event when enabled').toBeTruthy();
  expect(callbackParams.delta, 'callback contains the correct delta').toBe(-1);
  expect(callbackParams.device, 'callback contains the current device classification').toBe(
    'unknown'
  );
  expect(callbackParams.center, 'callback contains the correct position').toEqual({x: 123, y: 456});

  callbackParams = null;
  wheelEventMock.deltaY = 4.000244140625;
  wheelEventMock.shiftKey = true;
  wheelSession.handleEvent(wheelEventMock);
  wheelInput.handleEvent(wheelEventMock);
  expect(callbackParams.delta, 'callback contains the unscaled delta').toBe(-1.00006103515625);
  expect(callbackParams.device, 'callback contains the resolved device classification').toBe(
    'mouse'
  );

  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
});

test('wheelInput#handleEvent feeds subscribed wheel sessions while disabled', () => {
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

  expect(callbackParams, 'raw wheel callback remains disabled').toBeFalsy();
  expect(
    sessionEvents.map((event) => event.eventType),
    'subscribed session still receives the wheel event'
  ).toEqual([InputEvent.Start, InputEvent.Move]);
  expect(
    sessionEvents.every((event) => event.device === 'trackpad'),
    'session events contain the classified device'
  ).toBeTruthy();

  unsubscribe();
  wheelInput.destroy();
  wheelSession.destroy();
  element.remove();
});
