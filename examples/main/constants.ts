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
import {Pan, Rotate, Pinch, Swipe, Press, Tap, RecognizerTuple} from 'mjolnir.js';

export const RECOGNIZERS: RecognizerTuple[] = [
  [Rotate, {enable: false}],
  [Pinch, {enable: false}, ['rotate']],
  [Swipe, {enable: false}],
  [Pan, {threshold: 1, enable: false}, ['pinch'], ['swipe']],
  [Press, {enable: false}],
  [Tap, {event: 'dblclick', taps: 2, enable: false}],
  [Tap, {event: 'anyclick', enable: false}, ['dblclick']],
  [Tap, {event: 'click', enable: false}, ['anyclick'], ['dblclick']]
];

export const EVENTS = [
  'click',
  'anyclick',
  'dblclick',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerover',
  'pointerout',
  'pointerleave',
  'pinchin',
  'pinchout',
  'pinchstart',
  'pinchmove',
  'pinchend',
  'pinchcancel',
  'rotatestart',
  'rotatemove',
  'rotateend',
  'rotatecancel',
  'panstart',
  'panmove',
  'panend',
  'pancancel',
  'panup',
  'pandown',
  'panleft',
  'panright',
  'swipe',
  'swipeleft',
  'swiperight',
  'swipeup',
  'swipedown',
  'keydown',
  'keyup',
  'wheel'
];

export const INITIAL_OPTIONS = {
  click: true,
  doubletap: true,
  pinchstart: true,
  pinchmove: true,
  pinchend: true,
  rotatestart: true,
  rotatemove: true,
  rotateend: true,
  panstart: true,
  panmove: true,
  panend: true,
  wheel: true
};
