import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import stylisticTs from '@stylistic/eslint-plugin-ts'

export default tseslint.config(
    ...tseslint.configs.stylistic,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
        rules: {
            'vue/html-indent': ['warn', 4],
            'vue/max-attributes-per-line': ['warn', {
                singleline: {
                    max: 3,
                },
                multiline: {
                    max: 1,
                },
            }],
        },
    },
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
        ],

        plugins: {
            '@stylistic/ts': stylisticTs,
        },

        // @see https://typescript-eslint.io/rules/
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            '@stylistic/ts/semi': ['warn', 'never'],
            '@stylistic/ts/quotes': ['warn', 'single'],
            '@stylistic/ts/comma-dangle': ['warn', 'always-multiline'],
            '@/newline-per-chained-call': ['warn', {
                ignoreChainWithDepth: 2,
            }],
        },
    },
)
