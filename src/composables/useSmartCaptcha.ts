import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import type {
    BaseEventCallback,
    JavascriptErrorEventCallback,
    SmartCaptchaRenderProps,
    SubscribeEvent,
    SuccessEventCallback,
    Token,
    WidgetId,
} from '@/types/smartcaptcha'

type RenderProps = Partial<SmartCaptchaRenderProps> | string
type CaptchaContainer = Ref | HTMLElement | 'string'
type CaptchaSubscriptionEventCallback = BaseEventCallback | SuccessEventCallback | JavascriptErrorEventCallback

export const useSmartCaptcha = (container: CaptchaContainer, renderProps?: RenderProps, load = true) => {
    const widgetId = ref<WidgetId>()
    const token = ref<Token>()

    const __container = ref()
    const __scriptWasAppended = ref(false)

    const __subscriptions: Record<SubscribeEvent, CaptchaSubscriptionEventCallback[]> = {
        success: [] as SuccessEventCallback[],
        'javascript-error': [] as JavascriptErrorEventCallback[],
        'network-error': [] as BaseEventCallback[],
        'token-expired': [] as BaseEventCallback[],
        'challenge-hidden': [] as BaseEventCallback[],
        'challenge-visible': [] as BaseEventCallback[],
    }

    const __setContainer = () => {
        if (typeof container === 'string') {
            __container.value = document.querySelector(container)
        } else if (container instanceof HTMLElement) {
            __container.value = container
        } else if (container.value) {
            __container.value = container.value
        }
    }

    const __addScript = () => {
        const scriptElement = document.createElement('script')
        scriptElement.src = 'https://smartcaptcha.yandexcloud.net/captcha.js?render=onload&onload=__smartCaptchaLoaded'
        scriptElement.defer = true
        scriptElement.type = 'text/javascript'
        scriptElement.crossOrigin = 'anonymous'
        scriptElement.dataset.captcha = 'true'
        document.head.appendChild(scriptElement)

        __scriptWasAppended.value = true
    }

    const __renderProps = (): SmartCaptchaRenderProps => {
        if (typeof renderProps === 'string') {
            return { sitekey: renderProps }
        }

        const sitekey = renderProps?.sitekey || import.meta.env.VITE_SMARTCAPTCHA_KEY

        if (! sitekey) {
            throw new Error('Captcha key is not defined. Please provide value or specify `VITE_SMARTCAPTCHA_KEY` environment variable')
        }

        return {
            ...renderProps,
            sitekey, // the only required parameter
        }
    }

    const __onSuccess = (tkn: Token) => {
        token.value = tkn
    }

    const __subscribeToCaptchaEvent = (event: SubscribeEvent) => {
        if (__subscriptions[event].length > 0) {
            __subscriptions[event].forEach(cb => {
                // Type guard to ensure the correct callback type is used
                if (event === 'success') {
                    window.smartCaptcha?.subscribe(widgetId.value as WidgetId, event, cb as SuccessEventCallback)
                } else if (event === 'javascript-error') {
                    window.smartCaptcha?.subscribe(widgetId.value as WidgetId, event, cb as JavascriptErrorEventCallback)
                } else {
                    window.smartCaptcha?.subscribe(widgetId.value as WidgetId, event, cb as BaseEventCallback)
                }
            })
        }
    }

    const __subscribe = () => {
        if (widgetId.value === undefined) {
            return
        }
        
        // Required to set token value
        window.smartCaptcha?.subscribe(widgetId.value, 'success', __onSuccess)

        __subscribeToCaptchaEvent('challenge-hidden')
        // Array.from(Object.keys(__subscriptions) as SubscribeEvent[]).forEach(event => {
        //     __subscribeToCaptchaEvent(event)
        // })
    }

    const __initWidget = () => {
        if (! __container.value) {
            return
        }

        if (window.smartCaptcha === undefined) {
            return
        }
        
        widgetId.value = window.smartCaptcha.render(__container.value, __renderProps())
    
        __subscribe()
    }

    onMounted(() => {
        __setContainer()

        if (! __scriptWasAppended.value && load) {
            __addScript()
        }

        if (window.__smartCaptchaLoaded === undefined) {
            window.__smartCaptchaLoaded = __initWidget
        }
    })

    onUnmounted(() => {
        if (load) {
            document.querySelector('script[data-captcha]')?.remove()
            window.__smartCaptchaLoaded = undefined
        }
    })

    const execute = () => {
        window.smartCaptcha?.execute(widgetId.value)
    }

    const reset = () => {
        window.smartCaptcha?.reset(widgetId.value)
        widgetId.value = undefined
        token.value = undefined
    }

    const destroy = () => {
        window.smartCaptcha?.destroy(widgetId.value)
        widgetId.value = undefined
        token.value = undefined
    }

    const getResponse = (): Token | undefined => window.smartCaptcha?.getResponse(widgetId.value)

    const subscribeTo = (event: SubscribeEvent, cb: CaptchaSubscriptionEventCallback) => {
        __subscriptions[event].push(cb)
    }

    return {
        widgetId,
        token,
        execute,
        reset,
        destroy,
        getResponse,
        subscribeTo,
    }
}
