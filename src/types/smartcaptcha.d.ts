/**
 * @link https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#subscribe
 */
export type SubscribeEvent =
    | 'challenge-visible'
    | 'challenge-hidden'
    | 'network-error'
    | 'success'
    | 'token-expired'
    | 'javascript-error'

export type WidgetId = number

export type Token = string

export type SupportedLang =
    | 'ru'
    | 'en'
    | 'be'
    | 'kk'
    | 'tt'
    | 'uk'
    | 'uz'
    | 'tr'

export type ShieldPosition =
    | 'top-left'
    | 'center-left'
    | 'bottom-left'
    | 'top-right'
    | 'center-right'
    | 'bottom-right'

/**
 * @link https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#render
 */
export interface SmartCaptchaRenderProps {
    sitekey: string,
    callback?: (token: Token) => void,
    hl?: SupportedLang,
    test?: boolean,
    webview?: boolean,
    invisible?: boolean,
    shieldPosition?: ShieldPosition,
    hideShield?: boolean,
}

export type BaseEventCallback = () => void
export type SuccessEventCallback = (token: Token) => void
export type JavascriptError = { filename: string, message: string, col: number, line: number }
export type JavascriptErrorEventCallback = (error: JavascriptError) => void
export type CaptchaSubscriptionEventCallback = BaseEventCallback | SuccessEventCallback | JavascriptErrorEventCallback

/**
 * @link https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#methods
 */
export interface SmartCaptcha {
    render: (
        container: HTMLElement | string,
        params: SmartCaptchaRenderProps
    ) => WidgetId

    getResponse: (widgetId?: WidgetId) => Token

    execute: (widgetId?: WidgetId) => void

    reset: (widgetId?: WidgetId) => void

    destroy: (widgetId?: WidgetId) => void
    
    subscribe(widgetId: WidgetId, event: 'success', callback: SuccessEventCallback): () => void
    subscribe(widgetId: WidgetId, event: 'javascript-error', callback: JavascriptErrorEventCallback): () => void
    subscribe(widgetId: WidgetId, event: Exclude<SubscribeEvent, 'success', 'javascript-error'>, callback: BaseEventCallback): () => void
}
