const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {}
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          'accessibility': 'explicit',
          'overrides': {
            'accessors': 'explicit',
            'constructors': 'no-public',
            'methods': 'explicit',
            'properties': 'explicit',
            'parameterProperties': 'explicit'
          }
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'error'
    }
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {}
  }
];
