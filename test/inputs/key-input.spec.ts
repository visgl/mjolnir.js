// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {KeyInput} from 'mjolnir.js/inputs/key-input';
import {spy} from '../test-utils/spy';
import {createEventTarget} from '../test-utils/dom';

test('keyInput#constructor', t => {
  const element = createEventTarget();

  const numKeyEvents = 2; // KEY_EVENTS.length
  const addELSpy = spy(element, 'addEventListener');
  const keyInput = new KeyInput(element, () => {}, {});
  t.ok(keyInput, 'KeyInput created without optional params');
  t.equal(
    addELSpy.callCount,
    numKeyEvents,
    'should call addEventListener once for each passed event:handler pair'
  );

  element.remove();
  t.end();
});

test('keyInput#destroy', t => {
  const element = createEventTarget();
  const numKeyEvents = 2; // KEY_EVENTS.length
  const removeELSpy = spy(element, 'removeEventListener');
  const keyInput = new KeyInput(element, () => {}, {});
  keyInput.destroy();
  t.equal(
    removeELSpy.callCount,
    numKeyEvents,
    'should call removeEventListener once for each passed event:handler pair'
  );

  element.remove();
  t.end();
});

/* eslint-disable max-statements */
test('keyInput#enableEventType', t => {
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

  let callbackSpy = spy();
  let keyInput = new KeyInput(element, callbackSpy, {enable: true});

  keyInput.enableEventType('keydown', false);
  keyInput.handleEvent(keyDownMock);
  t.notOk(callbackSpy.called, 'callback should not be called when disabled');

  keyInput.enableEventType('keydown', true);
  keyInput.handleEvent(keyDownMock);
  t.ok(callbackSpy.called, 'callback should be called on key down when enabled...');

  callbackSpy = spy();
  keyInput = new KeyInput(element, callbackSpy, {enable: true});

  keyInput.enableEventType('keyup', false);
  keyInput.handleEvent(keyUpMock);
  t.notOk(callbackSpy.called, 'callback should not be called when disabled');

  keyInput.enableEventType('keyup', true);
  keyInput.handleEvent(keyUpMock);
  t.ok(callbackSpy.called, 'callback should be called on key up when enabled...');

  callbackSpy.reset();
  keyUpMock2.srcElement = {
    tagName: 'TEXTAREA'
  };
  keyInput.handleEvent(keyUpMock2);
  t.notOk(callbackSpy.called, 'callback should not be called when typing into a text box');

  keyUpMock2.srcElement = {
    tagName: 'INPUT',
    type: 'text'
  };
  keyInput.handleEvent(keyUpMock2);
  t.notOk(callbackSpy.called, 'callback should not be called when typing into a text box');

  element.remove();
  t.end();
});
