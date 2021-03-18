import React from 'react';
import { Set } from 'immutable';

import {
    $Checkbox,
    $Checklist,
    $Date,
    $Decimal,
    $Form,
    $Number,
    $Password,
    $Radio,
    $TextArea,
    $Time,
    button,
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
import { $Rut } from './$Rut';
import _ from 'lodash';

const $Gender = CustomField.extends($Radio).with({
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

function App() {
    const $RepeatPassword = CustomField.extends($Password).with({
        label: 'Repeat password',

        validate(value) {
            const { pass } = form.fields;

            if (!pass.is(value)) {
                return Invalid('Passwords do not match');
            }

            return Valid(value);
        },
    });

    const form = useForm<Account>(
        $Form({
            fields: {
                user: text('Username').with({
                    initialInput: 'Joe',
                    render: {
                        Input({ field }) {
                            return (
                                <input
                                    {...field.inputProps}
                                    ref={field.inputRef}
                                />
                            );
                        },
                        Error({ children }) {
                            return <pre>{children}</pre>;
                        },
                    },
                }),
                pass: $Password(),
                repeatPass: $RepeatPassword(),
                age: optional($Number('Age')).with({
                    // inputProps: {
                    //     placeholder: '40',
                    // },
                    placeholder: '42',
                    nonZero: true,
                    // allowNegative: true,
                }),
                dob: $Date('Date of birth'),
                tob: $Time('Time of birth'),
                gender: $Gender().editable(),
                pet: select('Favorite pet').with({
                    options: ['Cat', 'Dog', 'Other'],
                    initialInput: 'Cat',
                    classNames: {
                        Input: 'test',
                    },
                }),
                // prettier-ignore
                specifyPet: text('Specify favorite pet')
                    .showIf(_ => _.pet.is('Other')),
                bio: optional($TextArea('Bio')),
                rut: optional($Rut()),
                income: $Decimal('Income').with({
                    inputProps: { min: 2, max: 4 },
                }),
                realEstateValue: money('Real estate value'),
                checklist: $Checklist({
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
                autoRenew: $Checkbox('Automatically renew my subscription'),
            },
            submit: button('Create account', {
                async onValid(values) {
                    await new Promise((r) => setTimeout(r, 2000));
                    alert(JSON.stringify(values, null, '  '));
                },
            }),
        }) /*.readOnly()*/
    );

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

                    <Debug value={form.fields.realEstateValue.input} />
                    <Debug value={form.fields.realEstateValue.result} />
                    <Debug value={form.fields.realEstateValue.isFocused} />
                    <Debug
                        value={_.mapValues(
                            form.fields.realEstateValue.subFields,
                            'isFocused'
                        )}
                    />
                </div>
                {/*<InfoProyecto />*/}
            </div>
        </XFormContext.Provider>
    );
}

export default App;
