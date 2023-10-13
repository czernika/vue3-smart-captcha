# Yandex SmartCaptcha for Vue3 projects

Adds [Yandex SmartCaptcha](https://cloud.yandex.ru/docs/smartcaptcha/) component into your Vue3 application

[Create](https://cloud.yandex.ru/docs/smartcaptcha/operations/create-captcha) Captcha and [get](https://cloud.yandex.ru/docs/smartcaptcha/operations/get-keys) keys. You need client site key to activate captcha

> NOTE: this package does NOT provides verification

## Installation

```sh
npm install vue3-smart-captcha
```

## Usage

### As plugin

```js
// main.js
import { createApp } from 'vue'
import { SmartCaptchaPlugin } from 'vue3-smart-captcha'

const app = createApp(App)
app.use(SmartCaptchaPlugin)
```

### As component

```vue
<template>
    <SmartCaptcha :sitekey="sitekey" />
</template>

<script setup>
import { SmartCaptcha } from 'vue3-smart-captcha'

const sitekey = 'client_site_key' // import.meta.env.VITE_YANDEX_SMART_CAPTCHA_KEY
</script>
```

## Options

**TODO**

Basically it gets every parameter of `window.smartCaptcha` [object](https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#methods) plus 5 callbacks for every [subscription](https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#subscribe) events named as `on` + event name in camelCase ('success' => 'onSuccess', 'network-error' => 'onNetworkError', etc)

## License

Open-source under [MIT license](LICENSE)

## Testing

**TODO**
