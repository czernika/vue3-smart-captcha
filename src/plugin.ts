import type { App } from 'vue'
import SmartCaptcha from '@/components/SmartCaptcha.vue'

const SmartCaptchaPlugin = {
    install: (app: App) => {
        app.component('SmartCaptcha', SmartCaptcha)
    },
}

export { SmartCaptchaPlugin, SmartCaptcha }
