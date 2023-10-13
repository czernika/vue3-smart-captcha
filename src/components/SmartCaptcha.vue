<template>
    <div
        ref="container"
        class="smart-captcha"
    />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { YANDEX_SMART_CAPTCHA_SCRIPT_LINK } from '@/utils/captcha-data'
import type { RenderParams, Subscriptions, WidgetId } from '@/types/smartcaptcha'

const container = ref<HTMLDivElement>()

const props = defineProps<RenderParams & Subscriptions>()

onMounted(() => {
    loadWidgetScript()
    initWidget()
})

const loadWidgetScript = () => {
    const smartCaptchaScript = document.createElement('script')
    smartCaptchaScript.setAttribute('src', `${YANDEX_SMART_CAPTCHA_SCRIPT_LINK}?render=onload`)
    smartCaptchaScript.setAttribute('defer', 'true')
    document.head.appendChild(smartCaptchaScript)
}

const initWidget = () => {
    const checkIfSmartCaptchaIsLoaded = setInterval(() => {
        if (window.smartCaptcha !== undefined) {
            clearInterval(checkIfSmartCaptchaIsLoaded)

            const widgetId = window.smartCaptcha.render((container.value) as HTMLDivElement, props)

            subscribe(widgetId)           
        }
    }, 200)
}

const subscribe = (widgetId: WidgetId) => {
    if (props.onChallengeHidden) {
        window.smartCaptcha.subscribe(widgetId, 'challenge-hidden', props.onChallengeHidden)
    }

    if (props.onChallengeVisible) {
        window.smartCaptcha.subscribe(widgetId, 'challenge-visible', props.onChallengeVisible)
    }

    if (props.onNetworkError) {
        window.smartCaptcha.subscribe(widgetId, 'network-error', props.onNetworkError)
    }

    if (props.onSuccess) {
        window.smartCaptcha.subscribe(widgetId, 'success', props.onSuccess)
    }

    if (props.onTokenExpired) {
        window.smartCaptcha.subscribe(widgetId, 'token-expired', props.onTokenExpired)
    }
}
</script>
