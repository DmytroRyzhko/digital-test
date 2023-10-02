import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    'ignores': ['assets'],
    'plugins': {},
    'languageOptions': {
      'ecmaVersion': 'latest',
      'globals': {
        ...globals.browser,
        'Shopify': 'readonly',
        'ShopifyAnalytics': 'readonly',
        'process': true,
      },
    },
    'rules': {
      'padding-line-between-statements': [
        'error',
        {
          'blankLine': 'always',
          'prev': '*',
          'next': '*',
        },
        {
          'blankLine': 'any',
          'prev': ['export', 'import'],
          'next': ['export', 'import'],
        },
        {
          'blankLine': 'any',
          'prev': ['const', 'let'],
          'next': ['const', 'let'],
        },
        {
          'blankLine': 'any',
          'prev': ['expression'],
          'next': ['expression'],
        },
      ],
      'lines-between-class-members': ['error', 'always'],
      'comma-dangle': ['error', 'only-multiline'],
      'space-before-function-paren': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'no-multi-spaces': 'error',
      'prefer-const': 'error',
      'array-bracket-newline': [
        'error',
        {
          'minItems': 3,
          'multiline': true,
        },
      ],
      'array-element-newline': ['error', 'consistent'],
      'camelcase': 'off',
      'id-length': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/order': 'off',
      'lines-around-comment': 'error',
      'keyword-spacing': [
        'error',
        {
          'after': true,
          'before': true,
        },
      ],
      'no-process-env': 'off',
      'no-undef': 'error',
      'no-multiple-empty-lines': [
        'error',
        {
          'max': 1,
        },
      ],
      'no-unused-vars': 'off',
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      'semi': ['error', 'always'],
    },
  },
];
