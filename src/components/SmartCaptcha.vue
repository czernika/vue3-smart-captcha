<template>
    <div ref="container" />
</template>

<script lang="ts" setup>
import { useSmartCaptcha } from '@/composables/useSmartCaptcha'
import type {
    BaseEventCallback,
    JavascriptErrorEventCallback,
    SmartCaptchaRenderProps,
    SuccessEventCallback,
} from '@/types/smartcaptcha'
import { ref } from 'vue'

const container = ref<HTMLDivElement>()

type SubscribeEventProps = {
    onChallengeVisible?: BaseEventCallback
    onChallengeHidden?: BaseEventCallback
    onNetworkError?: BaseEventCallback
    onTokenExpired?: BaseEventCallback
    onSuccess?: SuccessEventCallback
    onJavascriptError?: JavascriptErrorEventCallback
}
type SmartCaptchaComponentProps = SmartCaptchaRenderProps & SubscribeEventProps & {
    loadWidget?: boolean
}
const props = withDefaults(defineProps<SmartCaptchaComponentProps>(), {
    loadWidget: true,

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
}, props.loadWidget)

if (props.onChallengeHidden) {
    subscribeTo('challenge-hidden', props.onChallengeHidden)
}

if (props.onChallengeVisible) {
    subscribeTo('challenge-visible', props.onChallengeVisible)
}

if (props.onJavascriptError) {
    subscribeTo('javascript-error', props.onJavascriptError)
}

if (props.onNetworkError) {
    subscribeTo('network-error', props.onNetworkError)
}

if (props.onSuccess) {
    subscribeTo('success', props.onSuccess)
}

if (props.onTokenExpired) {
    subscribeTo('token-expired', props.onTokenExpired)
}
</script>
