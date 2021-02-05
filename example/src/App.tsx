import React from 'react';

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
    Invalid,
    optional,
    select,
    spanish,
    text,
    useForm,
    Valid,
    XFormContext,
} from '@tdc-cl/x-form';
import '@tdc-cl/x-form/dist/index.css';
import { LocalTime } from 'js-joda';
import { Decimal } from 'decimal.js';
import { $Rut } from './$Rut';

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

    const form = useForm(
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
                    nonZero: true,
                    // allowNegative: true,
                }),
                dob: $Date('Date of birth'),
                tob: $Time('Time of birth'),
                gender: $Gender().editable(),
                pet: select('Favorite pet').with({
                    options: ['Cat', 'Dog', 'Other'],
                    initialInput: 'Cat',
                }),
                // prettier-ignore
                specifyPet: text('Specify favorite pet')
                    .showIf(_ => _.pet.is('Other')),
                bio: optional($TextArea('Bio')),
                rut: optional($Rut()),
                income: $Decimal('Income').with({
                    inputProps: { min: 2, max: 4 },
                }),
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

                onInvalid: 'disable',
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

    const incomeIsFocused = form.fields.income.input.isFocused;

    return (
        <XFormContext.Provider value={{ locale: spanish }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ padding: '1em' }}>
                    {form.render()}
                    <button onClick={autoFill}>Autofill</button>
                    <button onClick={form.reset}>Reset</button>

                    <pre>
                        {JSON.stringify({ incomeIsFocused }, null, '    ')}
                    </pre>
                </div>
                {/*<InfoProyecto />*/}
            </div>
        </XFormContext.Provider>
    );
}

export default App;
