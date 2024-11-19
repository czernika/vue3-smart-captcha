import SmartCaptcha from '@/components/SmartCaptcha.vue'
import { useSmartCaptcha } from '@/composables/useSmartCaptcha'
import SmartCaptchaUtils from '@/utils/smartcaptcha'
import type { Plugin } from 'vue'
import type {
    SmartCaptcha as WindowSmartCaptcha,
    WidgetId,
    Token,
} from '@/types/smartcaptcha'

const SmartCaptchaPlugin: Plugin = {
    install: (app) => {
        app.component('SmartCaptcha', SmartCaptcha)
    },
}

export default SmartCaptcha

export {
    SmartCaptcha, // to keep backward compatibility
    SmartCaptchaPlugin,
    useSmartCaptcha,
    SmartCaptchaUtils,
    type WindowSmartCaptcha,
    type WidgetId,
    type Token,
}
