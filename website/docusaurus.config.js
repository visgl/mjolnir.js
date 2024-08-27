const {getDocusaurusConfig} = require('@vis.gl/docusaurus-website');
const {resolve} = require('path');

const config = getDocusaurusConfig({
  projectName: 'mjolnir.js',
  tagline: 'An event manager',
  siteUrl: 'https://visgl.github.io/mjolnir.js',
  repoUrl: 'https://github.com/visgl/mjolnir.js',

  docsTableOfContents: require('../docs/table-of-contents.json'),

  examplesDir: './src/examples',
  exampleTableOfContents: require('./src/examples/table-of-contents.json'),

  search: 'local',

  webpackConfig: {
    resolve: {
      alias: {
        'mjolnir.js': resolve('../src')
      }
    }
  }
});

module.exports = config;
