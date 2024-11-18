<template>
    <div ref="container" />

    <div data-testid="widget">
        {{ widgetId }}
    </div>

    <div data-testid="token">
        {{ token }}
    </div>

    <div data-testid="test-token">
        {{ testToken }}
    </div>

    <button
        data-testid="execute-btn"
        type="button"
        @click="handleExecute"
    >
        Execute
    </button>

    <button
        data-testid="reset-btn"
        type="button"
        @click="handleReset"
    >
        Reset
    </button>

    <button
        data-testid="response-btn"
        type="button"
        @click="handleResponse"
    >
        Get response
    </button>

    <button
        data-testid="destroy-btn"
        type="button"
        @click="handleDestroy"
    >
        Destroy
    </button>
</template>

<script lang="ts" setup>
import { useSmartCaptcha, type Token } from '@/plugin'
import { ref } from 'vue'

const testToken = ref<Token>()
const container = ref()

const {
    widgetId,
    token,
    execute,
    reset,
    getResponse,
    destroy,
    subscribeTo,
} = useSmartCaptcha(container, '__sitekey', true, 100)

subscribeTo('challenge-hidden', () => {
    testToken.value = '__hidden'
})

const handleExecute = () => {
    execute()
}

const handleReset = () => {
    reset()
}

const handleResponse = () => {
    testToken.value = getResponse()
}

const handleDestroy = () => {
    destroy()
}
</script>
