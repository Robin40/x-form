# @tdc-cl/x-form

> Declarative forms for React

[![NPM](https://img.shields.io/npm/v/@tdc-cl/x-form.svg)](https://www.npmjs.com/package/@tdc-cl/x-form) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install (yarn)
- Install the peer dependencies
```bash
yarn add immutable
yarn add js-joda
yarn add decimal.js
```

- Then install x-form
```bash
yarn add @tdc-cl/x-form
```

## Install (npm)
- Install the peer dependencies
```bash
npm install --save immutable
npm install --save js-joda
npm install --save decimal.js
```

- Then install x-form
```bash
npm install --save @tdc-cl/x-form
```

## Basic usage
Let's create a login form
```typescript jsx
import { useForm, $Form, $Text, $Checkbox, $Button } from '@tdc-cl/x-form';

function MyLoginFormComponent() {
    const form = useForm($Form({
        fields: {
            user: $Text('Username'),
            pass: $Password(),
            remember: $Checkbox('Remember me'),
        },
        submit: $Button('Log in', {
            async onValid(values) {
                // make a request to your endpoint here
            },
            onInvalid: 'disable',
        }),
    }));

    return form.render();
}
```
And that's all you need.

## Documentation

See the rest of the documentation (WIP) at https://hackmd.io/izREMyHCQAKNmNZOq7ujmw

## License

MIT © [Robin40](https://github.com/Robin40)
