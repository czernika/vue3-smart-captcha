import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import type {
    CaptchaSubscriptionEventCallback,
    SmartCaptchaRenderProps,
    SubscribeEvent,
    Token,
    WidgetId,
} from '@/types/smartcaptcha'
import SmartCaptchaUtils from '@/utils/smartcaptcha'

type RenderProps = Partial<SmartCaptchaRenderProps> | string
type CaptchaContainer = Ref | HTMLElement | string

export const useSmartCaptcha = (container: CaptchaContainer, renderProps?: RenderProps, load = true, timeout = 2000) => {
    const utils = new SmartCaptchaUtils()

    const widgetId = ref<WidgetId>()
    const token = ref<Token>()

    const __container = ref()

    const __subscriptions: Record<SubscribeEvent, CaptchaSubscriptionEventCallback[]> = {
        success: [],
        'javascript-error': [],
        'network-error': [],
        'token-expired': [],
        'challenge-hidden': [],
        'challenge-visible': [],
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
        scriptElement.src = utils.SCRIPT_RENDER_ONLOAD_SRC
        scriptElement.defer = true
        scriptElement.type = 'text/javascript'
        scriptElement.crossOrigin = 'anonymous'
        scriptElement.dataset.captcha = 'true'
        document.head.appendChild(scriptElement)
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
            sitekey,
        }
    }

    const __onSuccess = (tkn: Token) => {
        token.value = tkn
    }

    const __subscribeToCaptchaEvent = (event: SubscribeEvent) => {
        if (__subscriptions[event].length > 0) {
            __subscriptions[event].forEach(cb => {
                utils.subscribe(widgetId.value!, event, cb)
            })
        }
    }

    const __subscribe = () => {
        if (widgetId.value === undefined) {
            return
        }
        
        // Required to set token value
        utils.subscribe(widgetId.value, 'success', __onSuccess)

        Array.from(Object.keys(__subscriptions) as SubscribeEvent[]).forEach(event => {
            __subscribeToCaptchaEvent(event)
        })
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

        // Try not to load multiple instances per time
        if (window.smartCaptcha === undefined && load) {
            __addScript()
        }

        // NOTE cannot use `onrender` method as there is an issue with multiple captchas on the same page
        const totalAttempts = 10
        const isSmartCaptchaLoaded = setInterval(() => {
            let attempt = 0 
            if (++attempt === totalAttempts) {
                console.warn(
                    `The captcha could not be initialized in ${timeout}ms. Make sure the widget script has been loaded`,
                )
                
                clearInterval(isSmartCaptchaLoaded)
                return
            }
    
            if (window.smartCaptcha !== undefined) {
                clearInterval(isSmartCaptchaLoaded)
                __initWidget()
            }
        }, timeout / totalAttempts)
    })

    onUnmounted(() => {
        if (load) {
            document.querySelector('script[data-captcha]')?.remove()
        }
    })

    const execute = () => {
        utils.execute(widgetId.value)
    }

    const __reset = () => {
        widgetId.value = undefined
        token.value = undefined
    }

    const reset = () => {
        utils.reset(widgetId.value)

        __reset()
    }

    const destroy = () => {
        utils.destroy(widgetId.value)
        
        __reset()
    }

    const getResponse = (): Token | undefined => utils.getResponse(widgetId.value)

    const subscribeTo = <T extends CaptchaSubscriptionEventCallback>(event: SubscribeEvent, cb: T) => {
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
