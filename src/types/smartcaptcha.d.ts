/**
 * @link https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#subscribe
 */
export type SubscribeEvent =
    | 'challenge-visible'
    | 'challenge-hidden'
    | 'network-error'
    | 'success'
    | 'token-expired'

export type WidgetId = number

export type Token = string

export type SupportedLangs =
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

export interface Subscriptions {
    onChallengeVisible?: () => void,
    onChallengeHidden?: () => void,
    onNetworkError?: () => void,
    onSuccess?: (token: Token) => void,
    onTokenExpired?: () => void,
} 

/**
 * @link https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#render
 */
export interface RenderParams {
    sitekey: string,
    callback?: (token: Token) => void,
    hl?: SupportedLangs,
    test?: boolean,
    webview?: boolean,
    invisible?: boolean,
    shieldPosition?: ShieldPosition,
    hideShield?: boolean,
    loadWidget?: boolean,
}

/**
 * @link https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#methods
 */
export interface SmartCaptcha {
    render: (
        container: HTMLElement | string,
        params: RenderParams
    ) => WidgetId

    getResponse: (widgetId?: WidgetId) => Token

    execute: (widgetId?: WidgetId) => void

    reset: (widgetId?: WidgetId) => void

    destroy: (widgetId?: WidgetId) => void
    
    // With 'success' subscription event token passed into callback
    subscribe(widgetId: widgetId, event: Extract<SubscribeEvent, 'success'>, callback: (token: Token) => void): () => void
    subscribe(widgetId: widgetId, event: Exclude<SubscribeEvent, 'success'>, callback: () => void): () => void
}
