// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {whichButtons} from 'mjolnir.js/utils/event-utils';

test('EventUtils#whichButtons', (t) => {
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
    t.is(whichButtons(testCase)?.leftButton, testCase.leftButton, 'returns left button flag');
    t.is(whichButtons(testCase)?.middleButton, testCase.middleButton, 'returns middle button flag');
    t.is(whichButtons(testCase)?.rightButton, testCase.rightButton, 'returns right button flag');
  }

  t.end();
});
