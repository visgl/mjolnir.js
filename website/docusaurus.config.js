const {getDocusaurusConfig} = require('@vis.gl/docusaurus-website');

const config = getDocusaurusConfig({
  projectName: 'mjolnir.js',
  tagline: 'A modern event manager',
  siteUrl: 'https://visgl.github.io/mjolnir.js',
  repoUrl: 'https://github.com/visgl/mjolnir.js',

  docsTableOfContents: require('../docs/table-of-contents.json'),

  examplesDir: './src/examples',
  exampleTableOfContents: require('./src/examples/table-of-contents.json'),

  search: 'local'
});

module.exports = config;
