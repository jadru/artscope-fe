const commonConfig = require('./eslint.common.js');

module.exports = {
  ...commonConfig,
  extends: [...commonConfig.extends, 'next', 'next/core-web-vitals'],
  rules: {
    ...commonConfig.rules,
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': [
      'warn',
      {
        props: 'never',
        children: 'never',
      },
    ],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // ext library & side effect imports
          ['^@?\\w', '^\\u0000'],
          // {s}css files
          ['^.+\\.s?css$'],
          // Lib and hooks
          ['^@/lib', '^@/hooks'],
          // static data
          ['^@/data'],
          // components
          ['^@/components', '^@/container'],
          // zustand store
          ['^@/store'],
          // Other imports
          ['^@/'],
          // relative paths up until 3 level
          [
            '^\\./?$',
            '^\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\.(?!/?$)',
            '^\\.\\./\\.\\./\\.\\./?$',
            '^\\.\\./\\.\\./\\.\\.(?!/?$)',
          ],
          ['^@/types'],
          // other that didnt fit in
          ['^'],
        ],
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
};
