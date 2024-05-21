// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import test from 'tape-promise/tape';
import {MoveInput} from 'mjolnir.js/inputs/move-input';
import {spy} from '../test-utils/spy';
import {createEventTarget} from '../test-utils/dom';

test('moveInput#constructor', t => {
  const element = createEventTarget();
  const numMouseEvents = 6; // MOUSE_EVENTS.length
  const addELSpy = spy(element, 'addEventListener');
  const moveInput = new MoveInput(element, () => {}, {});
  t.ok(moveInput, 'MoveInput created without optional params');
  t.equal(
    addELSpy.callCount,
    numMouseEvents,
    'should call addEventListener once for each passed event:handler pair'
  );
  t.end();
});

test('moveInput#destroy', t => {
  const element = createEventTarget();
  const numMouseEvents = 6; // MOUSE_EVENTS.length
  const removeELSpy = spy(element, 'removeEventListener');
  const moveInput = new MoveInput(element, () => {}, {});
  moveInput.destroy();
  t.equal(
    removeELSpy.callCount,
    numMouseEvents,
    'should call removeEventListener once for each passed event:handler pair'
  );

  element.remove();
  t.end();
});

test('moveInput#handleEvent', t => {
  const element = createEventTarget();
  const callbackSpy = spy();
  const mouseDownMock = {
    type: 'mousedown',
    button: 0,
    target: element
  };
  const mouseDragMock = {
    type: 'mousemove',
    button: 0,
    buttons: 1,
    target: element
  };
  const mouseHoverMock = {
    type: 'mousemove',
    button: 0,
    buttons: 0,
    target: element
  };
  const mouseUpMock = {
    type: 'mouseup',
    target: element
  };
  const moveInput = new MoveInput(element, callbackSpy, {
    enable: true
  });

  moveInput.handleEvent(mouseDownMock);
  t.notOk(callbackSpy.called, 'callback should not be called on mouse down');
  moveInput.handleEvent(mouseDragMock);
  t.notOk(callbackSpy.called, 'callback should not be called on mouse drag');
  moveInput.handleEvent(mouseUpMock);
  t.notOk(callbackSpy.called, 'callback should not be called on mouse up');
  moveInput.handleEvent(mouseHoverMock);
  t.ok(callbackSpy.called, 'callback should be called on mouse hover');

  element.remove();
  t.end();
});

test('moveInput#enableEventType', t => {
  const element = createEventTarget();

  let callbackSpy;
  let moveInput;

  t.test('pointermove', assert => {
    const mouseHoverMock = {
      type: 'mousemove',
      button: 0,
      buttons: 0,
      target: element
    };

    callbackSpy = spy();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointermove', false);
    moveInput.handleEvent(mouseHoverMock);
    assert.notOk(callbackSpy.called, 'callback should not be called when disabled');

    moveInput.enableEventType('pointermove', true);
    moveInput.handleEvent(mouseHoverMock);
    assert.ok(callbackSpy.called, 'callback should be called on mouse hover when enabled...');

    assert.end();
  });

  t.test('pointerleave', assert => {
    const mouseLeaveMock = {
      type: 'mouseleave',
      target: element
    };

    callbackSpy = spy();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointerleave', false);
    moveInput.handleEvent(mouseLeaveMock);
    assert.notOk(callbackSpy.called, 'callback should not be called when disabled');

    moveInput.enableEventType('pointerleave', true);
    moveInput.handleEvent(mouseLeaveMock);
    assert.ok(callbackSpy.called, 'callback should be called on mouse leave when enabled...');

    assert.end();
  });

  t.test('pointerover', assert => {
    const mouseOverMock = {
      type: 'mouseover',
      target: element
    };

    callbackSpy = spy();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointerover', false);
    moveInput.handleEvent(mouseOverMock);
    assert.notOk(callbackSpy.called, 'callback should not be called when disabled');

    moveInput.enableEventType('pointerover', true);
    moveInput.handleEvent(mouseOverMock);
    assert.ok(callbackSpy.called, 'callback should be called on mouse over when enabled...');

    assert.end();
  });

  t.test('pointerout', assert => {
    const mouseOutMock = {
      type: 'mouseout',
      target: element
    };

    callbackSpy = spy();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointerout', false);
    moveInput.handleEvent(mouseOutMock);
    assert.notOk(callbackSpy.called, 'callback should not be called when disabled');

    moveInput.enableEventType('pointerout', true);
    moveInput.handleEvent(mouseOutMock);
    assert.ok(callbackSpy.called, 'callback should be called on mouse out when enabled...');

    assert.end();
  });

  element.remove();
  t.end();
});
