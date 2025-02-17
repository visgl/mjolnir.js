// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* global window */
import test from 'tape';
import {_enableDOMLogging as enableDOMLogging} from '@probe.gl/test-utils';

let failed = false;
test.onFinish(window.browserTestDriver_finish);
test.onFailure(() => {
  failed = true;
  window.browserTestDriver_fail();
});

// tap-browser-color alternative
enableDOMLogging({
  getStyle: () => ({
    background: failed ? '#F28E82' : '#8ECA6C',
    position: 'absolute',
    top: '500px',
    width: '100%'
  })
});

import './index';
