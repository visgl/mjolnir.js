// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {expect, test} from 'vitest';
import {whichButtons} from 'mjolnir.js/utils/event-utils';

test('EventUtils#whichButtons', () => {
  const TESTS = [
    {
      srcEvent: {
        type: 'mouseup',
        button: 0,
        buttons: 0
      },
      leftButton: true,
      middleButton: false,
      rightButton: false
    },
    {
      srcEvent: {
        type: 'mousemove',
        button: 0,
        buttons: 2
      },
      leftButton: false,
      middleButton: false,
      rightButton: true
    },
    {
      srcEvent: {
        type: 'pointermove',
        buttons: 1
      },
      leftButton: true,
      middleButton: false,
      rightButton: false
    },
    {
      srcEvent: {
        type: 'pointerdown',
        button: 2
      },
      leftButton: false,
      middleButton: false,
      rightButton: true
    },
    {
      srcEvent: {
        type: 'pointerup'
      },
      leftButton: false,
      middleButton: false,
      rightButton: false
    }
  ];

  for (const testCase of TESTS) {
    expect(whichButtons(testCase)?.leftButton, 'returns left button flag').toBe(
      testCase.leftButton
    );
    expect(whichButtons(testCase)?.middleButton, 'returns middle button flag').toBe(
      testCase.middleButton
    );
    expect(whichButtons(testCase)?.rightButton, 'returns right button flag').toBe(
      testCase.rightButton
    );
  }
});
