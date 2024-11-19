import type { SubscribeEvent, Token, WidgetId, CaptchaSubscriptionEventCallback } from '@/types/smartcaptcha'

class SmartCaptchaUtils
{
    readonly SCRIPT_RENDER_ONLOAD_SRC = 'https://smartcaptcha.yandexcloud.net/captcha.js?render=onload'

    execute (widgetID?: WidgetId) {
        window.smartCaptcha?.execute(widgetID)
    }

    reset (widgetID?: WidgetId) {
        window.smartCaptcha?.reset(widgetID)
    }

    destroy (widgetID?: WidgetId) {
        window.smartCaptcha?.destroy(widgetID)
    }

    getResponse(widgetID?: WidgetId): Token | undefined {
        return window.smartCaptcha?.getResponse(widgetID)
    }

    subscribe(widgetId: WidgetId, event: SubscribeEvent, cb: CaptchaSubscriptionEventCallback) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Yelling because of callback type
        window.smartCaptcha?.subscribe(widgetId, event, cb)
    }
}

export default SmartCaptchaUtils
