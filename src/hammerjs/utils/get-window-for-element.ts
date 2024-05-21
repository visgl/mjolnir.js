/**
 * get the window object of an element
 */
export default function getWindowForElement(element: HTMLElement): Window {
  const doc = element.ownerDocument || (element as unknown as Document);
  return doc.defaultView || window;
}
