import { afterEach, beforeEach, describe, expect, it, test } from 'vitest'
import { type VueWrapper, mount } from '@vue/test-utils'
import SmartCaptchaComponent from './SmartCaptcha.vue' 
import { YANDEX_SMART_CAPTCHA_SCRIPT_LINK } from '@/utils/captcha-data'

describe('SmartCaptcha component', () => {
    let captcha: VueWrapper
    
    beforeEach(() => {
        captcha = mount(SmartCaptchaComponent, {
            props: {
                sitekey: 'sitekey',
            },
        })
    })

    afterEach(() => {
        captcha.unmount()
    })

    test('api script was rendered', () => {
        const script = document.head.querySelector(`[src="${YANDEX_SMART_CAPTCHA_SCRIPT_LINK}?render=onload"]`)
        expect(script).not.toBeUndefined()
    })

    it('has smart-captcha class if visible', async () => {
        expect(captcha.html()).toContain('class="smart-captcha"')

        await captcha.setProps({ invisible: true })

        expect(captcha.html()).not.toContain('class="smart-captcha"')
    })
})
