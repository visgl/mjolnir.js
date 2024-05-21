import * as hammerjs from '../hammerjs/index';
import {enhancePointerEventInput, enhanceMouseInput} from './hammer-overrides';

enhancePointerEventInput(hammerjs.PointerEventInput);
enhanceMouseInput(hammerjs.MouseInput);

export const Manager = hammerjs.Manager;

export default hammerjs;
