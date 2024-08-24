// mjolnir.js
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

type ElementOptions = {
  id?: string;
  children?: ElementOptions[];
};

/** Generate an event root element for testing */
export function createEventTarget(
  opts: ElementOptions = {},
  parent: HTMLElement = document.body
): HTMLDivElement {
  const {id, children} = opts;
  const el = document.createElement('div');
  if (id) {
    el.id = id;
  }
  if (children) {
    for (const child of children) {
      createEventTarget(child, el);
    }
  }
  parent.appendChild(el);
  return el;
}
