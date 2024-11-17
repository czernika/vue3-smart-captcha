<template>
    <div ref="container" />
</template>

<script lang="ts" setup>
import { useSmartCaptcha } from '@/composables/useSmartCaptcha'
import type {
    JavascriptError,
    SmartCaptchaRenderProps,
    Token,
    WidgetId,
} from '@/types/smartcaptcha'
import { ref, watch } from 'vue'

const container = ref<HTMLDivElement>()

type SmartCaptchaComponentProps = SmartCaptchaRenderProps & {
    loadWidget?: boolean
    timeout?: number
}
const props = withDefaults(defineProps<SmartCaptchaComponentProps>(), {
    loadWidget: true,
    timeout: 2000,

    onChallengeVisible: undefined,
    onChallengeHidden: undefined,
    onNetworkError: undefined,
    onTokenExpired: undefined,
    onSuccess: undefined,
    onJavascriptError: undefined,
})

const { subscribeTo, widgetId } = useSmartCaptcha(container, {
    sitekey: props.sitekey,
    callback: props.callback,
    hl: props.hl,
    test: props.test,
    webview: props.webview,
    invisible: props.invisible,
    shieldPosition: props.shieldPosition,
    hideShield: props.hideShield,
}, props.loadWidget, props.timeout)

const emits = defineEmits<{
    challengeHidden: [],
    challengeVisible: [],
    javascriptError: [error: JavascriptError],
    networkError: [],
    tokenExpired: [],
    success: [token: Token],
    initialized: [id: WidgetId]
}>()

watch(widgetId, (newVal) => {
    if (newVal !== undefined) {
        emits('initialized', newVal)
    }
})

subscribeTo('challenge-hidden', () => {
    emits('challengeHidden')
})

subscribeTo('challenge-visible', () => {
    emits('challengeVisible')
})

subscribeTo('javascript-error', (error: JavascriptError) => {
    emits('javascriptError', error)
})

subscribeTo('network-error', () => {
    emits('networkError')
})

subscribeTo('token-expired', () => {
    emits('tokenExpired')
})

subscribeTo('success', (tkn: Token) => {
    emits('success', tkn)
})
</script>
