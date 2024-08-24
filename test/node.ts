// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {JSDOM} from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html>');
globalThis.document = dom.window.document;

import('./index');
