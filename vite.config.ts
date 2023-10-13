import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            copyDtsFiles: true,
            cleanVueFileName: true,
            rollupTypes: true,
            include: ['src/'],
        }),
    ],
    build: {
        lib: {
            entry: './src/plugin.ts',
            formats: ['es', 'cjs'],
            name: 'vue3SmartCaptcha',
            fileName(format) {
                return format === 'es' ? 'index.js' : 'index.cjs'
            },
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
