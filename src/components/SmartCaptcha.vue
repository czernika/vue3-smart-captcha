<template>
    <div
        ref="container"
        :class="{'smart-captcha': !isInvisible}"
    />
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { YANDEX_SMART_CAPTCHA_SCRIPT_LINK } from '@/utils/captcha-data'
import type { RenderParams, CaptchaProps, Subscriptions, WidgetId } from '@/types/smartcaptcha'

const container = ref<HTMLDivElement>()

const props = withDefaults(defineProps<RenderParams & CaptchaProps & Subscriptions>(), {
    loadWidget: true,
    timeout: 2000,
})

onMounted(() => {
    if (widgetNeedsToBeLoaded.value) {
        loadWidgetScript()
    }

    initWidget()
})

onUnmounted(() => {
    if (widgetNeedsToBeLoaded.value) {
        document.querySelector(`script[src="${YANDEX_SMART_CAPTCHA_SCRIPT_LINK}?render=onload"]`)?.remove()
    }
})

const widgetNeedsToBeLoaded = computed(() => props.loadWidget)

const isInvisible = computed(() => props.invisible === true)

const loadWidgetScript = () => {
    const smartCaptchaScript = document.createElement('script')
    smartCaptchaScript.setAttribute('src', `${YANDEX_SMART_CAPTCHA_SCRIPT_LINK}?render=onload`)
    smartCaptchaScript.setAttribute('defer', 'true')
    document.head.appendChild(smartCaptchaScript)
}

const totalAttempts = 10

const initWidget = () => {
    let attempt = 0 // allow max 10 connection attempts
    const isSmartCaptchaLoaded = setInterval(() => {
        if (++attempt === totalAttempts) {
            /* eslint-disable no-console */
            console.warn(
                `Captcha cannot be initialized for ${props.timeout}ms. Make sure widget script is loaded`
            )
            /* eslint-enable no-console */
            
            clearInterval(isSmartCaptchaLoaded)
            return
        }

        if (window.smartCaptcha !== undefined) {
            clearInterval(isSmartCaptchaLoaded)

            const widgetId = window.smartCaptcha.render((container.value) as HTMLDivElement, {
                sitekey: props.sitekey,
                callback: props.callback,
                hl: props.hl,
                test: props.test,
                webview: props.webview,
                invisible: props.invisible,
                shieldPosition: props.shieldPosition,
                hideShield: props.hideShield,
            })

            subscribe(widgetId)           
        }
    }, props.timeout / totalAttempts)
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
