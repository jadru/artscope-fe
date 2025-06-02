

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    '@cspell/eslint-plugin',
    'unused-imports',
    'prettier',
  ],
  extends: ['eslint:recommended', 'next', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        useTabs: false,
        trailingComma: 'es5',
        singleQuote: true,
        semi: true,
      },
    ],
    quotes: [2, 'single', { avoidEscape: true }],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/require-statement-exists': 'off',
    'no-console': 'warn',
    'react/react-in-jsx-scope': 'off',
    'comma-dangle': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  plugins: [...commonConfig.plugins, 'react-refresh', 'eslint-plugin-react'],
  rules: {
    ...commonConfig.rules,
    'react/no-unescaped-entities': 'off',
    'unused-imports/no-unused-vars': 'off',
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
