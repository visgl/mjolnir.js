/** @typedef {import('@vis.gl/dev-tools').OcularConfig} OcularConfig */
import {resolve} from 'path';

/** @type OcularConfig */
export default {
  lint: {
    paths: ['src', 'examples', 'test', 'docs'],
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx', 'd.ts', 'md']
  },

  bundle: {
    globalName: 'mjolnir',
    target: ['chrome110', 'firefox110', 'safari15'],
    format: 'umd'
  },

  typescript: {
    project: 'tsconfig.build.json'
  },

  alias: {
    'mjolnir.js': resolve('./src')
  },

  entry: {
    test: 'test/node.ts',
    'test-browser': 'index.html',
    size: ['test/size.js']
  }
};
