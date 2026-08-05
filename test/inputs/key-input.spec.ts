// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test, vi} from 'vitest';
import {KeyInput} from 'mjolnir.js/inputs/key-input';
import {createEventTarget} from '../test-utils/dom';

test('keyInput#constructor', () => {
  const element = createEventTarget();

  const numKeyEvents = 2; // KEY_EVENTS.length
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const keyInput = new KeyInput(element, () => {}, {});
  expect(keyInput, 'KeyInput created without optional params').toBeTruthy();
  expect(
    addELSpy,
    'should call addEventListener once for each passed event:handler pair'
  ).toHaveBeenCalledTimes(numKeyEvents);

  element.remove();
});

test('keyInput#destroy', () => {
  const element = createEventTarget();
  const numKeyEvents = 2; // KEY_EVENTS.length
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const keyInput = new KeyInput(element, () => {}, {});
  keyInput.destroy();
  expect(
    removeELSpy,
    'should call removeEventListener once for each passed event:handler pair'
  ).toHaveBeenCalledTimes(numKeyEvents);

  element.remove();
});

test('keyInput#only listens while enabled', () => {
  const element = createEventTarget();
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const keyInput = new KeyInput(element, () => {}, {enable: false});

  expect(addELSpy, 'does not add listeners when disabled').toHaveBeenCalledTimes(0);

  keyInput.enableEventType('keydown', true);
  expect(addELSpy, 'adds the enabled key listener').toHaveBeenCalledTimes(1);
  keyInput.enableEventType('keydown', true);
  expect(addELSpy, 'does not add an already enabled key listener').toHaveBeenCalledTimes(1);

  removeELSpy.mockClear();
  keyInput.enableEventType('keydown', false);
  expect(removeELSpy, 'removes the disabled key listener').toHaveBeenCalledTimes(1);
  keyInput.enableEventType('keydown', false);
  expect(removeELSpy, 'does not remove an already disabled key listener').toHaveBeenCalledTimes(1);

  keyInput.destroy();
  element.remove();
});

/* eslint-disable max-statements */
test('keyInput#enableEventType', () => {
  const element = createEventTarget();
  const keyDownMock = {
    type: 'keydown',
    key: 'a',
    target: element
  };
  const keyUpMock = {
    type: 'keyup',
    key: 'a',
    target: element
  };
  const keyUpMock2 = {
    type: 'keyup',
    key: 'a'
  };

  let callbackSpy = vi.fn();
  let keyInput = new KeyInput(element, callbackSpy, {enable: true});

  keyInput.enableEventType('keydown', false);
  keyInput.handleEvent(keyDownMock);
  expect(callbackSpy, 'callback should not be called when disabled').not.toHaveBeenCalled();

  keyInput.enableEventType('keydown', true);
  keyInput.handleEvent(keyDownMock);
  expect(callbackSpy, 'callback should be called on key down when enabled...').toHaveBeenCalled();

  callbackSpy = vi.fn();
  keyInput = new KeyInput(element, callbackSpy, {enable: true});

  keyInput.enableEventType('keyup', false);
  keyInput.handleEvent(keyUpMock);
  expect(callbackSpy, 'callback should not be called when disabled').not.toHaveBeenCalled();

  keyInput.enableEventType('keyup', true);
  keyInput.handleEvent(keyUpMock);
  expect(callbackSpy, 'callback should be called on key up when enabled...').toHaveBeenCalled();

  callbackSpy.mockClear();
  keyUpMock2.srcElement = {
    tagName: 'TEXTAREA'
  };
  keyInput.handleEvent(keyUpMock2);
  expect(
    callbackSpy,
    'callback should not be called when typing into a text box'
  ).not.toHaveBeenCalled();

  keyUpMock2.srcElement = {
    tagName: 'INPUT',
    type: 'text'
  };
  keyInput.handleEvent(keyUpMock2);
  expect(
    callbackSpy,
    'callback should not be called when typing into a text box'
  ).not.toHaveBeenCalled();

  element.remove();
});
