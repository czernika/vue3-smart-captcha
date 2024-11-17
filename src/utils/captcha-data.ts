import type { Token, WidgetId } from '@/types/smartcaptcha'

/**
 * Yandex SmartCaptcha script
 * @link https://cloud.yandex.ru/docs/smartcaptcha/quickstart#add-widget
 */
const YANDEX_SMART_CAPTCHA_SCRIPT_LINK = 'https://smartcaptcha.yandexcloud.net/captcha.js'

const execute = (widgetId?: WidgetId) => {
    if (! window.smartCaptcha) {
        return
    }

    window.smartCaptcha.execute(widgetId)
}

const destroy = (widgetId?: WidgetId) => {
    if (! window.smartCaptcha) {
        return
    }

    window.smartCaptcha.destroy(widgetId)
}

const reset = (widgetId?: WidgetId) => {
    if (! window.smartCaptcha) {
        return
    }

    window.smartCaptcha.reset(widgetId)
}

const getResponse = (widgetId?: WidgetId): Token | undefined => {
    if (! window.smartCaptcha) {
        return undefined
    }

    return window.smartCaptcha.getResponse(widgetId)
}

export {
    YANDEX_SMART_CAPTCHA_SCRIPT_LINK,
    execute,
    destroy,
    reset,
    getResponse,
}
