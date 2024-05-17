import {resolve} from 'path';

export default {
  lint: {
    paths: ['src', 'examples', 'test', 'docs']
  },

  typescript: {
    project: 'tsconfig.build.json'
  },

  babel: false,

  alias: {
    'mjolnir.js': resolve('./src')
  },

  entry: {
    test: 'test/index.js',
    'test-browser': 'index.html',
    size: ['test/size.js']
  }
};
