module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'perf',
        'revert',
      ],
    ],
  },
  'type-case': [
    0,
    'always',
    'lower-case',
    'sentence-case',
    'start-case',
    'pascal-case',
    'upper-case',
  ],
};
