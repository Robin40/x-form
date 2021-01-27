# @tdc-cl/x-form

> Declarative forms for React

[![NPM](https://img.shields.io/npm/v/@tdc-cl/x-form.svg)](https://www.npmjs.com/package/@tdc-cl/x-form) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Created at [The Dog Company](https://thedogcompany.cl/)

### <img src="https://images.emojiterra.com/google/android-oreo/512px/1f389.png" width="16"/> Good news!
> You can already use the new nomenclature for fields, e.g. `text` instead of `$Text`, for versions `>= 3.2.0`.

## Installation

- Install x-form and its peer dependencies, using your package manager of choice

### Option 1: `npm`
```bash
npm install --save @tdc-cl/x-form immutable js-joda decimal.js
```

### Option 2: `yarn`
```bash
yarn add @tdc-cl/x-form immutable js-joda decimal.js
```

---

> For TypeScript users, type definitions are already included, so you don't need to install a `@types/...` package.

## Basic usage
Let's create a login form
```typescript jsx
import { useForm, $Form, $Text, $Password, $Checkbox, $Button } from '@tdc-cl/x-form';

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

## Documentation

https://hackmd.io/izREMyHCQAKNmNZOq7ujmw

## License

MIT © [Robin40](https://github.com/Robin40)
