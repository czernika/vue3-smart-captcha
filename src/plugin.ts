import type { Plugin } from 'vue'
import SmartCaptcha from '@/components/SmartCaptcha.vue'
import { useSmartCaptcha } from '@/composables/useSmartCaptcha'
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

export default SmartCaptchaPlugin

export {
    SmartCaptchaPlugin,
    SmartCaptcha,
    useSmartCaptcha,
    type WindowSmartCaptcha,
    type WidgetId,
    type Token,
}
