import { baseConfig } from '@echoing/eslintconfig/base';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
        },
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...baseConfig,
];
