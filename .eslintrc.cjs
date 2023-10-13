module.exports = {
    root: true,
    env: {
        node: true,
    },
    plugins: [
        'vue',
        '@typescript-eslint',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'no-console': 'warn',
        'no-alert': 'error',
        'semi': ['warn', 'never'],
        'quotes': ['warn', 'single', { 'avoidEscape': true }],
        'comma-dangle': ['warn', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'never',
        }],
        '@typescript-eslint/no-inferrable-types': 'warn',
        'vue/html-indent': ['warn', 4],
        'vue/multi-word-component-names': 'off',
    },
}
