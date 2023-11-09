import type { Plugin } from 'vue'
import SmartCaptcha from '@/components/SmartCaptcha.vue'

const SmartCaptchaPlugin: Plugin = {
    install: (app) => {
        app.component('SmartCaptcha', SmartCaptcha)
    },
}

export { SmartCaptchaPlugin, SmartCaptcha }
