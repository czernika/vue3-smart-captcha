<template>
    <div ref="container" />
</template>

<script lang="ts" setup>
import { useSmartCaptcha } from '@/composables/useSmartCaptcha'
import type {
    JavascriptError,
    SmartCaptchaRenderProps,
    Token,
} from '@/types/smartcaptcha'
import { ref } from 'vue'

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

const { subscribeTo } = useSmartCaptcha(container, {
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
    'challenge-hidden': [],
    'challenge-visible': [],
    'javascript-error': [error: JavascriptError],
    'network-error': [],
    'token-expired': [],
    'success': [token: Token],
}>()

subscribeTo('challenge-hidden', () => {
    emits('challenge-hidden')
})

subscribeTo('javascript-error', (error: JavascriptError) => {
    emits('javascript-error', error)
})

subscribeTo('challenge-visible', () => {
    emits('challenge-visible')
})

subscribeTo('token-expired', () => {
    emits('token-expired')
})

subscribeTo('network-error', () => {
    emits('network-error')
})

subscribeTo('success', (tkn: Token) => {
    emits('success', tkn)
})
</script>
