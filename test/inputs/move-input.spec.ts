// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {MoveInput} from 'mjolnir.js/inputs/move-input';
import {createEventTarget} from '../test-utils/dom';

test('moveInput#constructor', () => {
  const element = createEventTarget();
  const numMouseEvents = 7; // MOUSE_EVENTS.length
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const moveInput = new MoveInput(element, () => {}, {});
  expect(moveInput, 'MoveInput created without optional params').toBeTruthy();
  expect(
    addELSpy,
    'should call addEventListener once for each passed event:handler pair'
  ).toHaveBeenCalledTimes(numMouseEvents);
});

test('moveInput#destroy', () => {
  const element = createEventTarget();
  const numMouseEvents = 7; // MOUSE_EVENTS.length
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const moveInput = new MoveInput(element, () => {}, {});
  moveInput.destroy();
  expect(
    removeELSpy,
    'should call removeEventListener once for each passed event:handler pair'
  ).toHaveBeenCalledTimes(numMouseEvents);

  element.remove();
});

test('moveInput#only listens while enabled', () => {
  const element = createEventTarget();
  const addELSpy = vi.spyOn(element, 'addEventListener');
  const removeELSpy = vi.spyOn(element, 'removeEventListener');
  const moveInput = new MoveInput(element, () => {}, {enable: false});

  expect(addELSpy, 'does not add listeners when disabled').toHaveBeenCalledTimes(0);

  moveInput.enableEventType('pointermove', true);
  expect(addELSpy, 'adds mouse state listeners for pointermove').toHaveBeenCalledTimes(3);
  moveInput.enableEventType('pointermove', true);
  expect(addELSpy, 'does not add pointermove listeners again').toHaveBeenCalledTimes(3);

  removeELSpy.mockClear();
  moveInput.enableEventType('pointermove', false);
  expect(removeELSpy, 'removes mouse state listeners for pointermove').toHaveBeenCalledTimes(3);
  moveInput.enableEventType('pointermove', false);
  expect(removeELSpy, 'does not remove pointermove listeners again').toHaveBeenCalledTimes(3);

  moveInput.enableEventType('pointerover', true);
  expect(addELSpy, 'adds the enabled pointerover listener').toHaveBeenCalledTimes(4);

  moveInput.destroy();
  element.remove();
});

test('moveInput#handleEvent', () => {
  const element = createEventTarget();
  const callbackSpy = vi.fn();
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
  expect(callbackSpy, 'callback should not be called on mouse down').not.toHaveBeenCalled();
  moveInput.handleEvent(mouseDragMock);
  expect(callbackSpy, 'callback should not be called on mouse drag').not.toHaveBeenCalled();
  moveInput.handleEvent(mouseUpMock);
  expect(callbackSpy, 'callback should not be called on mouse up').not.toHaveBeenCalled();
  moveInput.handleEvent(mouseHoverMock);
  expect(callbackSpy, 'callback should be called on mouse hover').toHaveBeenCalled();

  element.remove();
});

describe('moveInput#enableEventType', () => {
  let element: HTMLDivElement;
  let callbackSpy;
  let moveInput: MoveInput;

  beforeEach(() => {
    element = createEventTarget();
  });

  afterEach(() => {
    moveInput.destroy();
    element.remove();
  });

  test('pointermove', () => {
    const mouseHoverMock = {
      type: 'mousemove',
      button: 0,
      buttons: 0,
      target: element
    };

    callbackSpy = vi.fn();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointermove', false);
    moveInput.handleEvent(mouseHoverMock);
    expect(callbackSpy, 'callback should not be called when disabled').not.toHaveBeenCalled();

    moveInput.enableEventType('pointermove', true);
    moveInput.handleEvent(mouseHoverMock);
    expect(
      callbackSpy,
      'callback should be called on mouse hover when enabled...'
    ).toHaveBeenCalled();
  });

  test('pointerleave', () => {
    const mouseLeaveMock = {
      type: 'mouseleave',
      target: element
    };

    callbackSpy = vi.fn();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointerleave', false);
    moveInput.handleEvent(mouseLeaveMock);
    expect(callbackSpy, 'callback should not be called when disabled').not.toHaveBeenCalled();

    moveInput.enableEventType('pointerleave', true);
    moveInput.handleEvent(mouseLeaveMock);
    expect(
      callbackSpy,
      'callback should be called on mouse leave when enabled...'
    ).toHaveBeenCalled();
  });

  test('pointerover', () => {
    const mouseOverMock = {
      type: 'mouseover',
      target: element
    };

    callbackSpy = vi.fn();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointerover', false);
    moveInput.handleEvent(mouseOverMock);
    expect(callbackSpy, 'callback should not be called when disabled').not.toHaveBeenCalled();

    moveInput.enableEventType('pointerover', true);
    moveInput.handleEvent(mouseOverMock);
    expect(
      callbackSpy,
      'callback should be called on mouse over when enabled...'
    ).toHaveBeenCalled();
  });

  test('pointerout', () => {
    const mouseOutMock = {
      type: 'mouseout',
      target: element
    };

    callbackSpy = vi.fn();
    moveInput = new MoveInput(element, callbackSpy, {enable: true});

    moveInput.enableEventType('pointerout', false);
    moveInput.handleEvent(mouseOutMock);
    expect(callbackSpy, 'callback should not be called when disabled').not.toHaveBeenCalled();

    moveInput.enableEventType('pointerout', true);
    moveInput.handleEvent(mouseOutMock);
    expect(
      callbackSpy,
      'callback should be called on mouse out when enabled...'
    ).toHaveBeenCalled();
  });
});
