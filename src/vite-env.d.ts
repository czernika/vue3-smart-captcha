/// <reference types="vite/client" />

import type { SmartCaptcha } from './types/smartcaptcha'

declare global {
    interface Window {
        smartCaptcha: SmartCaptcha
    }
}
