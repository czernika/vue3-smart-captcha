import type { SmartCaptcha } from '@/types/smartcaptcha'

declare global {
    interface Window {
        smartCaptcha: SmartCaptcha
        __smartCaptchaLoaded?: () => void
    }
}

export {}
