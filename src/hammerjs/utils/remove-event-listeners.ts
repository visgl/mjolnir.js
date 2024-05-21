import each from './each';
import splitStr from './split-str';
/**
 * removeEventListener with multiple events at once
 */
export default function removeEventListeners(target: EventTarget, types: string, handler: EventListener) {
  if (!types) {
    return;
  }
  each(splitStr(types), (type) => {
    target.removeEventListener(type, handler, false);
  });
}
