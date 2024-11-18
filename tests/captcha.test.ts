import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DummyCaptchaWithNoProps from './components/DummyCaptchaWithNoProps.vue'
import type { SuccessEventCallback } from '@/types/smartcaptcha'
import { nextTick } from 'vue'

const sleep = async (time = 200) => await new Promise(resolve => setTimeout(resolve, time)) // Wait longer than the component timeout

beforeEach(() => {
    window.smartCaptcha = {
        render: vi.fn(() => 1234),
        getResponse: vi.fn(() => '__token'),
        subscribe: vi.fn((id, event, cb) => {
            // mock token on success
            if (event === 'success') {
                (cb as SuccessEventCallback)('__token')
            }

            if (event === 'challenge-hidden') {
                cb()
            }

            return () => {}
        }),
        execute: vi.fn(),
        destroy: vi.fn(),
        reset: vi.fn(),
    }
})

afterEach(() => {
    window.smartCaptcha = undefined
})

describe('captcha with no props', () => {
    it('renders captcha', async () => {
        mount(DummyCaptchaWithNoProps)

        await sleep()

        expect(window.smartCaptcha?.render).toHaveBeenCalled()
    })

    it('calls initial subscription for retrieving token value', async () => {
        mount(DummyCaptchaWithNoProps)

        await sleep()

        expect(window.smartCaptcha?.subscribe).toHaveBeenCalled()
    })

    it('gets widget id value', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        expect(wrapper.get('[data-testid="widget"]').text()).toBe('1234')
    })

    it('gets token value', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        window.smartCaptcha?.execute()

        expect(wrapper.get('[data-testid="token"]').text()).toBe('__token')
    })

    it('calls smartcaptcha `execute` method', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        wrapper.get('[data-testid="execute-btn"]').trigger('click')

        await nextTick()

        expect(window.smartCaptcha?.execute).toHaveBeenCalled()
    })

    it('calls smartcaptcha `reset` method', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        wrapper.get('[data-testid="reset-btn"]').trigger('click')

        await nextTick()

        expect(window.smartCaptcha?.reset).toHaveBeenCalled()
    })

    it('calls smartcaptcha `getResponse` method', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        wrapper.get('[data-testid="response-btn"]').trigger('click')

        await nextTick()

        expect(window.smartCaptcha?.getResponse).toHaveBeenCalled()
        expect(wrapper.get('[data-testid="test-token"]').text()).toBe('__token')
    })

    it('calls smartcaptcha `destroy` method', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        wrapper.get('[data-testid="destroy-btn"]').trigger('click')

        await nextTick()

        expect(window.smartCaptcha?.destroy).toHaveBeenCalled()
    })

    it('calls subscriptions', async () => {
        const wrapper = mount(DummyCaptchaWithNoProps)

        await sleep()

        expect(wrapper.get('[data-testid="test-token"]').text()).toBe('__hidden')
    })
})
