import {JSDOM} from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html>');
globalThis.document = dom.window.document;
