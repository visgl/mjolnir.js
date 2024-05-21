import each from './each';
import splitStr from './split-str';
/**
 * addEventListener with multiple events at once
 */
export default function addEventListeners(target: EventTarget, types: string, handler: EventListener) {
  if (!types) {
    return;
  }
  each(splitStr(types), (type: string) => {
    target.addEventListener(type, handler, false);
  });
}
