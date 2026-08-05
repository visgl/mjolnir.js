import {getVitestConfig} from '@vis.gl/dev-tools';

const includePatterns = ['test/**/*.spec.ts'];

export default getVitestConfig({
  projects: {
    node: {
      test: {
        include: includePatterns,
        setupFiles: ['./test/test-utils/node-test-setup.ts']
      }
    },
    browser: {
      test: {
        include: includePatterns
      }
    },
    headless: {
      test: {
        include: includePatterns
      }
    }
  },
  coverage: {
    include: ['src/**/*.ts'],
    exclude: ['**/*.d.ts']
  }
});
