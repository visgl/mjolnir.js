import {RecognizerState} from './recognizer-state';

/**
 * @private
 * get a usable string, used as event postfix
 */
export default function stateStr(state: RecognizerState) {
  if (state & RecognizerState.Cancelled) {
    return 'cancel';
  } else if (state & RecognizerState.Ended) {
    return 'end';
  } else if (state & RecognizerState.Changed) {
    return 'move';
  } else if (state & RecognizerState.Began) {
    return 'start';
  }
  return '';
}
