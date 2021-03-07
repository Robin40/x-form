import React from 'react';
import { Set } from 'immutable';

import {
    FormSpec,
    Field,
    checkbox,
    checklist,
    date,
    number,
    password,
    radio,
    textarea,
    time,
    CustomField,
    Debug,
    decimal,
    Invalid,
    Option,
    optional,
    select,
    spanish,
    text,
    useForm,
    Valid,
    XFormContext,
} from '@tdc-cl/x-form';
import '@tdc-cl/x-form/dist/index.css';
import { LocalDate, LocalTime } from 'js-joda';
import { Decimal } from 'decimal.js';
import { rut } from './rut';

const gender = CustomField.extends(radio).with({
    label: 'Gender',
    async options() {
        await new Promise((r) => setTimeout(r, 3000));
        return [
            { value: 'F', label: 'Female' },
            { value: 'M', label: 'Male' },
        ];
    },
});

const money = CustomField.composite({
    currency: select().with({ options: ['UF', 'CLP'] }),
    amount: decimal(),
}).with({});

interface Account {
    user: string;
    pass: string;
    repeatPass: string;
    age: number | null;
    dob: LocalDate;
    tob: LocalTime;
    gender: Option;
    pet: Option;
    specifyPet?: string;
    bio: string | null;
    rut: string | null;
    income: Decimal;
    realEstateValue: {
        currency: Option;
        amount: Decimal;
    };
    checklist: Set<string>;
    autoRenew: boolean;
}

const repeatPassword = CustomField.extends(password).with({
    label: 'Repeat password',

    validate(this: Field<string, string>, value) {
        const { pass } = this.form.fields;

        if (!pass.is(value)) {
            return Invalid('Passwords do not match');
        }

        return Valid(value);
    },
});

const myForm = new FormSpec<Account>({
    fields: {
        user: text('Username').with({
            initialInput: 'Joe',
            render: {
                Input({ field }) {
                    return <input {...field.inputProps} ref={field.inputRef} />;
                },
                Error({ children }) {
                    return <pre>{children}</pre>;
                },
            },
        }),
        pass: password(),
        repeatPass: repeatPassword(),
        age: optional(number('Age')).with({
            // inputProps: {
            //     placeholder: '40',
            // },
            placeholder: '42',
            nonZero: true,
            // allowNegative: true,
        }),
        dob: date('Date of birth'),
        tob: time('Time of birth'),
        gender: gender().editable(),
        pet: select('Favorite pet').with({
            options: ['Cat', 'Dog', 'Other'],
            initialInput: 'Cat',
        }),
        // prettier-ignore
        specifyPet: text('Specify favorite pet')
            .showIf(_ => _.pet.is('Other')),
        bio: optional(textarea('Bio')),
        rut: optional(rut()),
        income: decimal('Income').with({
            inputProps: { min: 2, max: 4 },
        }),
        realEstateValue: money('Real estate value'),
        checklist: checklist({
            options: [
                { value: 'ToS', label: 'Agree with terms of service' },
                {
                    value: 'Privacy',
                    label: 'Agree with privacy policy',
                },
                {
                    value: 'Spam',
                    label: 'Subscribe to email spam notifications',
                },
            ],
        }),
        autoRenew: checkbox('Automatically renew my subscription'),
    },
});

function App() {
    const form = useForm(myForm, {
        submitButtonLabel: 'Create account',
        async onValid(values) {
            await new Promise((r) => setTimeout(r, 2000));
            alert(JSON.stringify(values, null, '  '));
        },
    });

    function autoFill() {
        form.fillWith({
            user: 'Robin40',
            dob: '1996-04-12',
            tob: LocalTime.now(),
            gender: 'M',
            bio: 'meow :3',
            income: Decimal.acos(-1),
            checklist: {
                Spam: true,
            },
            autoRenew: 'YES',
        });
    }

    return (
        <XFormContext.Provider value={{ locale: spanish }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ padding: '1em' }}>
                    {form.render()}
                    <button onClick={autoFill}>Autofill</button>
                    <button onClick={form.reset}>Reset</button>

                    <Debug value={form.values} />
                </div>
                {/*<InfoProyecto />*/}
            </div>
        </XFormContext.Provider>
    );
}

export default App;
