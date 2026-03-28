import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    '**/tests-examples',
    '**/.eslintrc.js',
    '**/node_modules/',
    '**/build/',
    '**/playwright-report/',
    '**/test-results/',
    '**/html-test-results/',
]), {
    extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),

    plugins: {
        '@typescript-eslint': typescriptEslint,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',

        parserOptions: {
            projectService: {
              allowDefaultProject: [
                '*.js',
                '*.mjs'
              ],
            }
        },
    },

    rules: {
        curly: 'warn',
        eqeqeq: ['warn', 'smart'],
        'no-unused-vars': 'off',

        '@typescript-eslint/no-unused-vars': ['off', {
            argsIgnorePattern: '_',
            args: 'none',
        }],

        '@typescript-eslint/no-unused-vars-experimental': 'off',
        'no-multi-spaces': 'warn',
        'array-bracket-newline': ['warn', 'consistent'],
        'array-bracket-spacing': 'warn',
        'block-spacing': 'warn',
        '@typescript-eslint/no-unused-expressions': ['warn', {
            allowShortCircuit: true,
            allowTernary: true
        }],

        'brace-style': ['warn', '1tbs', {
            allowSingleLine: true,
        }],

        camelcase: ['warn', {
            properties: 'never',
        }],

        'comma-spacing': 'warn',
        'comma-style': 'warn',
        'computed-property-spacing': 'warn',
        'eol-last': 'warn',
        'func-call-spacing': 'warn',
        'implicit-arrow-linebreak': 'warn',
        'key-spacing': 'warn',
        'keyword-spacing': 'warn',

        'lines-between-class-members': ['warn', 'always', {
            exceptAfterSingleLine: true,
        }],

        'no-floating-decimal': 'warn',
        'no-lonely-if': 'warn',
        'no-multi-assign': 'warn',
        'no-multiple-empty-lines': 'warn',
        'no-trailing-spaces': 'warn',
        'no-unneeded-ternary': 'warn',
        'no-whitespace-before-property': 'warn',
        'nonblock-statement-body-position': 'warn',

        'object-curly-newline': ['warn', {
            multiline: true,
            consistent: true,
        }],

        'one-var': ['warn', 'never'],
        'padded-blocks': ['warn', 'never'],
        'quote-props': ['warn', 'as-needed'],

        quotes: ['warn', 'single', {
            allowTemplateLiterals: true,
            avoidEscape: true,
        }],

        'space-before-blocks': 'warn',

        'space-before-function-paren': ['warn', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
        }],

        'space-in-parens': 'warn',
        'space-infix-ops': 'warn',
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
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/promise-function-async': 'error',
        'import/first': 'warn',

        'import/no-anonymous-default-export': ['warn', {
            allowObject: true,
        }],

        'no-debugger': 'warn',

        'no-restricted-imports': ['error', {
            patterns: [{
                group: ['../'],
                message: 'Relative import is not allowed.',
            }],
        }],

        '@typescript-eslint/no-non-null-assertion': 'off',

        'max-len': ['warn', 150, {
            ignorePattern: '^import |^export\\{(.*?)\\}',
            ignoreComments: true,
            ignoreUrls: true,
            tabWidth: 2,
            ignoreRegExpLiterals: true,
        }],
    },
}]);
