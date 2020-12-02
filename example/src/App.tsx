import React from 'react';

import {
    $Checkbox,
    $Checklist,
    $Date,
    $Form,
    $Number,
    $Password,
    $Text,
    $Time,
    $Radio,
    CustomField,
    optional,
    useForm,
    $TextArea,
    $Decimal,
    $Button,
    XFormContext,
    spanish,
} from '@tdc-cl/x-form';
import '@tdc-cl/x-form/dist/index.css';
import { LocalTime } from 'js-joda';
import { Decimal } from 'decimal.js';

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
    const form = useForm(
        $Form({
            fields: {
                user: $Text('Username'),
                pass: $Password(),
                age: optional($Number('Age')),
                dob: $Date('Date of birth'),
                tob: $Time('Time of birth'),
                gender: $Gender().editable(),
                bio: optional($TextArea('Bio')),
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
            submit: $Button('Create account', {
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

    return (
        <XFormContext.Provider value={{ locale: spanish }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ padding: '1em' }}>
                    {form.render()}
                    <button onClick={autoFill}>Autofill</button>
                </div>
                {/*<InfoProyecto />*/}
            </div>
        </XFormContext.Provider>
    );
}

export default App;
