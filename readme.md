# promise-spin-wait [![Build Status](https://travis-ci.org/marekventur/promise-spin-wait.svg?branch=master)](https://travis-ci.org/marekventur/promise-spin-wait)

> An ES6-Promise based spin wait

## Install

```
$ npm install --save promise-spin-wait
```

## Usage

Imagine you'd want to test a script that sends emails. Sadly the infrastructure that actually sends them is out of your controll, so emails are not delivered instantly. This is when a spin wait can be useful, it allows you to check regularly for a certain criteria until it's fulfilled.

```js
const spinner = require('promise-spin-wait');

return sendEmail() // Asyncronous, but it will return before the email has actually been delivered
.then(() => {
    return spinner(
        () => {
            return getEmailInboxCount().then(n => n > 0);
        },
        {
            message: "Timeout: No Email received",
            timeout: 5000,
            interval: 500
        }
    );
})
```


## API

### spinner(fn, options)

Returns a promise for a the first truish response of ```fn()``` or the first rejected promise of ```fn()```;

#### fn

A function returning a value or a promise. If a promise is returned ```fn()``` will not be called again until it is resolved. Any errors thrown or promise rejections will lead to the spinner rejecting as well.

Only a truish return value will lead to the spinner stopping.

#### options

##### message

Type: `string`<br>
Default: `Timeout`

Message thrown when timeout occurs

##### timeout

Type: `number`<br>
Default: `5000`

Milliseconds since start when instead of calling ```fn``` again an timeout error will be returned

##### interval

Type: `number`<br>
Default: `100`

Duration between the last time ```fn()``` has been fulfilled and the next ```fn()``` is being called


## License

MIT © [marekventur](https://github.com/marekventur)