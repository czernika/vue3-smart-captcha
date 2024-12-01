# Yandex SmartCaptcha for Vue3 projects

[![Run tests](https://github.com/czernika/vue3-smart-captcha/actions/workflows/tests.yml/badge.svg)](https://github.com/czernika/vue3-smart-captcha/actions/workflows/tests.yml)

Adds [Yandex SmartCaptcha](https://cloud.yandex.ru/docs/smartcaptcha/) into your Vue3 application

> You need to [create](https://cloud.yandex.ru/docs/smartcaptcha/operations/create-captcha) captcha first and [get](https://cloud.yandex.ru/docs/smartcaptcha/operations/get-keys) both client and server keys. This package requires only client site key

> NOTE: this package does **NOT** provides verification of response - you still need to [implement](https://cloud.yandex.ru/docs/smartcaptcha/concepts/validation) it on server side

## Migration to v1

If you have vue3-smart-captcha package already installed there are few changes - all of them related to subscriptions as every subscription property was "relocated" to emitted events, e.g.

```vue
<template>
    <!-- Before -->
    <SmartCaptcha
        ...
        :on-success="onSuccess"
        :on-network-error="onNetworkError"
        :on-challenge-visible="onChallengeVisible"
        :on-challenge-hidden="onChallengeHidden"
        :on-token-expired="onTokenExpired"
    />

    <!-- After -->
    <SmartCaptcha
        ...
        @success="onSuccess"
        @network-error="onNetworkError"
        @challenge-visible="onChallengeVisible"
        @challenge-hidden="onChallengeHidden"
        @token-expired="onTokenExpired"

        @javascript-error="onJavascriptError" // new event
    />
</template>
```

Everything else you can keep as it is or migrate to a new API

## Installation

Run installation command using your preferred package manager, e.g

```sh
npm install vue3-smart-captcha
```

Script registers `window.smartCaptcha` global object you can access. This come from Yandex SmartCaptcha script itself

## Usage

Since version 1.0.0 this package provides two ways to use it - as component or composable

## Component

Register component globally as plugin or import it per component base

```js
import { SmartCaptchaPlugin } from 'vue3-smart-captcha'

const app = createApp()

app.use(SmartCaptchaPlugin)
```

**OR**

```vue
<template>
    <SmartCaptcha />
</template>

<script setup>
import SmartCaptcha from 'vue3-smart-captcha'

// In order to keep backward compatibility plugin can be imported this way
// import { SmartCaptcha } from 'vue3-smart-captcha'
</script>
```

You need to pass client key in order to activate captcha. You can either pass `:sitekey` component property

```vue
<template>
    <SmartCaptcha :sitekey="key" />
</template>

<script setup>
import SmartCaptcha from 'vue3-smart-captcha'

const key = '__client_key'
</script>
```

**OR** register environment variable called `VITE_SMARTCAPTCHA_KEY`

```
// .env
VITE_SMARTCAPTCHA_KEY="__client_key"
```

Now you can see captcha being rendered

### Do not initialize widget script

Component appends captcha script into head section of application. If you already load smartcaptcha script via direct link you can disable this behavior by passing `:load-widget="false"`

```vue
<template>
    <SmartCaptcha :load-widget="false" />
</template>
```

> Package checks if `window.smartCaptcha` object was defined. However when using multiple captcha instances at once all of them will have `window.smartCaptcha === undefined` on initial load. Therefore it is better either load script on your own and disable widget loading for every captcha or disable it for every captcha but first, e.g.

```vue
<template>
    <SmartCaptcha />
    <SmartCaptcha :load-widget="false" />
</template>
```

### Rendering timeout

On a mount component will try to resolve global `window.smartCaptcha` object. If it was not defined component will "die". You may set `timeout` property in milliseconds to specify amount of time package will try to resolve this object

```vue
<template>
    <SmartCaptcha :timeout="5000" />
</template>
```

Default value is `2000` (2 seconds)

### SmartCaptcha render properties

Component accepts every property from YandexSmartCaptcha widget as is. Basically it gets every parameter of `window.smartCaptcha` [object](https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#render)

Every property is optional (Well, technically *sitekey* is not)

| Property       | Type                                                                                    | Default                                 |
|----------------|-----------------------------------------------------------------------------------------|-----------------------------------------|
| sitekey        | string                                                                                  | `import.meta.env.VITE_SMARTCAPTCHA_KEY` |
| callback       | (token: Token) => void                                                                  | `undefined`                             |
| hl             | `'ru', 'en', 'be', 'kk', 'tt', 'uk', 'uz', 'tr'`                                        | `window.navigator.language`             |
| test           | boolean                                                                                 | `false`                                 |
| webview        | boolean                                                                                 | `false`                                 |
| invisible      | boolean                                                                                 | `false`                                 |
| shieldPosition | `'top-left', 'center-left', 'bottom-left', 'top-right', 'center-right', 'bottom-right'` | `center-right`                          |
| hideShield     | boolean                                                                                 | `false`                                 |

### Events

Let start with special `initialized` event - it fires when widget ID was resolved

```vue
<template>
    <SmartCaptcha @initialized="onInit" />
</template>

<script setup>
const onInit = (widgetId) => {
    console.log(widgetId)
}
</script>
```

#### SmartCaptcha subscription events

Every [subscription](https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#subscribe) represented as emit. Only `success` and `javascript-error` accepts arguments

```vue
<template>
    <SmartCaptcha
        ...
        @success="onSuccess"
        @network-error="onNetworkError"
        @challenge-visible="onChallengeVisible"
        @challenge-hidden="onChallengeHidden"
        @token-expired="onTokenExpired"
        @javascript-error="onJavascriptError"
    />
</template>

<script setup>
const onSuccess = (token) => {
    console.log(token)
}

const onJavascriptError = (error) => {
    console.log(error)
}

// ...
</script>
```

## Composable

If you need you may create your own Captcha component using composable methods. This is more flexible and recommended way

```vue
<template>
    <div ref="container" />
</template>

<script setup>
import { useSmartCaptcha } from 'vue3-smart-captcha'

const container = ref()

// Need to pass valid CSS selector, HTMLElement or Ref to it's element as first and only required argument
const captcha = useSmartCaptcha(container)
</script>
```

> **NOTE:** `useSmartCaptcha('#captcha')` or `useSmartCaptcha(document.querySelector('#captcha'))` are both valid options but with some restrictions - Ref type `container` is undefined on initial load (it will be resolved lately, on mounted hook). Therefore do not pass `container.value` into composable. Same valid for other selectors as they are undefined on initial load so use it within `onMounted` hook

### Specifying site key

When using composable there are some ways to pass sitekey into captcha

Default one is to look into `.env` file for a key named `VITE_SMARTCAPTCHA_KEY`

Second - passing it as a string in second argument

```js
const captcha = useSmartCaptcha(container, '__sitekey')
```

or pass it with other render props

```js
const captcha = useSmartCaptcha(container, {
    sitekey: '__sitekey',
})
```

### Resolve properties

To access token or widget id use related ref values

```js
const { token, widgetId } = useSmartCaptcha(container)

console.log(token.value, widgetId.value)
```

> Remember that `token.value` is undefined on initial load. It will be resolved only on successful captcha response after executing captcha component

### Do not initialize widget script

Composable appends captcha script into head section of application when being called. If you already load smartcaptcha script via direct link you can disable this behavior by setting third argument as `false`

```js
const captcha = useSmartCaptcha(container, {
    // render props
}, false)
```

> Package checks if `window.smartCaptcha` object was defined. However when using multiple captcha instances at once all of them will have `window.smartCaptcha === undefined` on initial load.. Therefore it is better either load script on your own and disable widget loading for every captcha or disable it for every captcha but first, e.g.

```js
const firstCaptcha = useSmartCaptcha(container, {
    // render props
})

const secondCaptcha = useSmartCaptcha(container, {
    // render props
}, false) // disable script appending as it will be appended by first captcha
```

### Rendering timeout

When being called composable will try to resolve global `window.smartCaptcha` object. If it was not defined component will "die". You may set `timeout` as fourth argument in milliseconds to specify amount of time package will try to resolve this object

```js
const captcha = useSmartCaptcha(container, {
    // render props
}, true, 5000)
```

Default value is `2000` (2 seconds)

### SmartCaptcha render properties

Same as for component properties (or `window.smartCaptcha` [object](https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#render))

```js
const captcha = useSmartCaptcha(container, {
    sitekey: '__sitekey',
    callback: callback,
    hl: 'ru',
    test: false,
    invisible: false,
    webview: false,
    hideShield: false,
    shieldPosition: 'top-center',
})
```

### Subscriptions

In order to subscribe on captcha events use `subscribeTo` method passing event name and callback function to handle it

```js
const { subscribeTo } = useSmartCaptcha(container)

const onSuccess = (token) => {
    console.log(token)
}

const onNetworkError = () => {
    console.log('Good bye World!')
}

subscribeTo('success', onSuccess)
subscribeTo('network-error', onNetworkError)
```

### SmartCaptcha utility methods

Composable provides methods to deal with captcha [object](https://cloud.yandex.ru/docs/smartcaptcha/concepts/widget-methods#render) methods such as `execute`, `reset`, `destroy` and `getResponse`

```js
const {
    execute,
    destroy,
    reset,
    getResponse,
} = useSmartCaptcha(container)
```

## Examples

### Get token with invisible captcha into form data

```vue
<template>
    <div ref="container" />

    <button type="button" @click="getToken">
        Get token
    </button>
</template>

<script lang="ts" setup>
import { useSmartCaptcha, type Token } from 'vue3-smart-captcha'

const sitekey = import.meta.env.VITE_CUSTOM_CLIENT_KEY
const container = ref()

// Dummy form code
const form = useForm({
    name: '',
    token: undefined,
})

const { token, execute } = useSmartCaptcha(container, {
    sitekey,
    invisible: true,
})

const getToken = () => {
    execute()

    console.log(token.value) // `undefined` see bellow
}

// Token will not be resolved instantly. Therefore you need to watch its value being changed
watch(token, (newVal) => {
    if (newVal !== undefined) {
        form.token = newVal
    }
})
</script>
```

### Send request to backend using invisible captcha

```vue
<template>
    <form @submit.prevent="submit">
        <!-- Fields -->

        <div ref="container" />

        <button type="submit">
            Submit
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useSmartCaptcha, type Token } from 'vue3-smart-captcha'

const sitekey = import.meta.env.VITE_CUSTOM_CLIENT_KEY
const container = ref()

const { execute } = useSmartCaptcha(container, {
    sitekey,
    invisible: true,
    callback: onCaptchaFired,
})

const submit = () => {
    execute() // this will trigger onCaptchaFired function when token being received
}

const onCaptchaFired = async (tkn: Token) => {
    // Dummy code
    // Send request to backend to validate token
    try {
        const response = await validateToken(tkn)
    } catch (error) {

    }

    if (! isSuccessful(response)) {
        // Handle validation error
        // ...
        return
    }

    // Send form data to backend
    // ...
}
</script>
```

## Utilities

Package provides utility class with every method but `render` in order if you need call captcha methods "manually" outside of current captcha (since both composable and captcha do not allows you to specify "custom" widget id)

```js
import { SmartCaptchaUtils } from 'vue3-smart-captcha'

const widgetId = 0 // example
const utils = new SmartCaptchaUtils()

utils.execute(widgetId)
```

## License

Open-source under [MIT license](LICENSE)

## Testing

We are using [Vitest](https://vitest.dev/guide/)
