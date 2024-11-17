import type { Plugin } from 'vue'
import SmartCaptcha from '@/components/SmartCaptcha.vue'
import { 
    execute,
    destroy,
    reset,
    getResponse,
} from '@/utils/captcha-data'

const SmartCaptchaPlugin: Plugin = {
    install: (app) => {
        app.component('SmartCaptcha', SmartCaptcha)
    },
}

export {
    SmartCaptchaPlugin,
    SmartCaptcha,
    execute,
    destroy,
    reset,
    getResponse,
}
