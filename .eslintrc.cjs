const {getESLintConfig} = require('@vis.gl/dev-tools/configuration');

module.exports = getESLintConfig({
  overrides: {
    env: {
      es2020: true
      // browser: true,
      // node: true
    },

    rules: {
      camelcase: 0,
      indent: 0,
      'import/no-unresolved': 0,
      'import/no-extraneous-dependencies': 0
    },

    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
        rules: {
          indent: 0,
          'max-statements': 1,
          complexity: 1,

          // https://github.com/typescript-eslint/typescript-eslint/issues/2483
          "no-shadow": 0,
          "@typescript-eslint/no-shadow": 2,

          "no-use-before-define": 0,
          "@typescript-eslint/no-use-before-define": 2,

          '@typescript-eslint/ban-ts-comment': 0,
          '@typescript-eslint/ban-types': 0,
          '@typescript-eslint/explicit-module-boundary-types': 0,
          '@typescript-eslint/no-unsafe-assignment': 0,
          '@typescript-eslint/no-unsafe-member-access': 0,
          '@typescript-eslint/no-unsafe-return': 0,
          '@typescript-eslint/no-unsafe-call': 0
        }
      }
    ]
  }
});
