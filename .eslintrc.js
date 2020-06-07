module.exports = {
  env: {
    'browser': true,
    'node': true,
    'es6': true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  ignorePatterns: ['dist', 'example'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': ['error'],
    'no-multiple-empty-lines': ['error', { 'max': 1 }]
  },
  overrides: [{
    files: ['*.ts'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-namespace': 0
    }
  }]
};
