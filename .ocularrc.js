/** @typedef {import('ocular-dev-tools').OcularConfig} OcularConfig */
import {resolve} from 'path';

/** @type OcularConfig */
export default {
  lint: {
    paths: ['src', 'examples', 'test', 'docs']
  },

  bundle: {
    globalName: 'mjolnir',
    target: ['chrome110', 'firefox110', 'safari15'],
    format: 'umd'
  },

  typescript: {
    project: 'tsconfig.build.json'
  },

  babel: false,

  alias: {
    'mjolnir.js': resolve('./src')
  },

  entry: {
    test: 'test/node.ts',
    'test-browser': 'index.html',
    size: ['test/size.js']
  }
};
