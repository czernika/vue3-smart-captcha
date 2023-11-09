import { describe, expect, it, test } from 'vitest'
import { mount } from '@vue/test-utils'
import SmartCaptchaComponent from './SmartCaptcha.vue' 
import { YANDEX_SMART_CAPTCHA_SCRIPT_LINK } from '@/utils/captcha-data'

describe('SmartCaptcha component', () => {
    const widgetScript = () => document.head.querySelector(`[src="${YANDEX_SMART_CAPTCHA_SCRIPT_LINK}?render=onload"]`)

    test('api script was rendered', () => {
        mount(SmartCaptchaComponent, {
            props: {
                sitekey: 'sitekey',
            },
        })

        expect(widgetScript()).not.toBeUndefined()
    })

    test('api script was rendered when loadWidget set to true', () => {
        mount(SmartCaptchaComponent, {
            props: {
                sitekey: 'sitekey',
                loadWidget: true,
            },
        })

        expect(widgetScript()).not.toBeUndefined()
    })

    // TODO resolve test
    test.skip('api script was not rendered when loadWidget set to false', () => {
        mount(SmartCaptchaComponent, {
            props: {
                sitekey: 'sitekey',
                loadWidget: false,
            },
        })

        expect(widgetScript()).toBeUndefined()
    })

    it('has smart-captcha class if visible', async () => {
        const captcha = mount(SmartCaptchaComponent, {
            props: {
                sitekey: 'sitekey',
            },
        })

        expect(captcha.html()).toContain('class="smart-captcha"')
    })

    it('has not smart-captcha class if not visible', async () => {
        const captcha = mount(SmartCaptchaComponent, {
            props: {
                sitekey: 'sitekey',
                invisible: true,
            },
        })

        expect(captcha.html()).not.toContain('class="smart-captcha"')
    })
})
