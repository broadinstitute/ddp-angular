module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es6: true
  },
  ignorePatterns: ['build', 'node_modules', 'tests-examples', '.eslintrc.js'],
  rules: {
    /* Code Quality */
    'curly': 'warn',
    'eqeqeq': ['warn', 'smart'],

    'no-unused-vars': 'off', // Needed for the below rule
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_', args: "none" }],

    'no-multi-spaces': 'warn',

    // Stylistic Issues
    'array-bracket-newline': ['warn', 'consistent'],
    'array-bracket-spacing': 'warn',
    'block-spacing': 'warn',
    'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'camelcase': ['warn', { properties: 'never' }],
    'comma-spacing': 'warn',
    'comma-style': 'warn',
    'computed-property-spacing': 'warn',
    'eol-last': 'warn',
    'func-call-spacing': 'warn',
    'implicit-arrow-linebreak': 'warn',
    'key-spacing': 'warn',
    'keyword-spacing': 'warn',
    'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
    'no-floating-decimal': 'warn',
    'no-lonely-if': 'warn',
    'no-multi-assign': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-trailing-spaces': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-whitespace-before-property': 'warn',
    'nonblock-statement-body-position': 'warn',
    'object-curly-newline': ['warn', { multiline: true, consistent: true }],
    'one-var': ['warn', 'never'],
    'padded-blocks': ['warn', 'never'],
    'quote-props': ['warn', 'as-needed'],
    'quotes': ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'space-before-blocks': 'warn',
    'space-before-function-paren': ['warn', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
    'space-in-parens': 'warn',
    'space-infix-ops': 'warn',

    // ES6
    'arrow-spacing': 'warn',
    'no-useless-rename': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'prefer-template': 'warn',
    'prefer-rest-params': 'warn',
    'prefer-spread': 'warn',
    'rest-spread-spacing': 'warn',
    'template-curly-spacing': 'warn',
    'vars-on-top': 'warn',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',

    'import/first': 'warn',
    'import/no-anonymous-default-export': ['warn', { allowObject: true }],

    'no-debugger': 'warn',

    /* Style */
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        tabWidth: 2
      }
    ],
    'max-len': [
      'warn',
      120,
      {
        ignorePattern: '^import |^export\\{(.*?)\\}',
        ignoreComments: true,
        ignoreUrls: true,
        tabWidth: 2,
        ignoreRegExpLiterals: true
      }
    ]
  }
};
