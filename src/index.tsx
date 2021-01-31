import { $Form, FormConfig, useForm } from './core/$Form';
import { checkbox, acceptBoolean } from './builtin/checkbox';
import { checklist } from './builtin/checklist';
import { date } from './builtin/date';
import { decimal } from './builtin/decimal';
import { FieldSpec, FieldConfig, FieldDefaults } from './core/FieldSpec';
import { number } from './builtin/number';
import { password } from './builtin/password';
import { radio } from './builtin/radio';
import { select } from './builtin/select';
import { text } from './builtin/text';
import { textarea } from './builtin/textarea';
import { time } from './builtin/time';
import { CustomField } from './core/CustomField';
import { EnumOption, Option, OptionWithProps } from './core/EnumOption';
import { Field, scrollToField } from './core/Field';
import { optional } from './core/optional';
import { Theme } from './core/Theme';
import { Invalid, Result, Valid } from './core/Result';
import { $Submitter, SubmitConfig } from './core/$Submitter';
import { FormState } from './core/useFormState';
import {
    ButtonProps,
    FormProps,
    LabelProps,
    InputProps,
    TextAreaProps,
} from './utils/htmlProps';
import { InputState } from './core/useInputState';
import { removeExcessWhitespace } from './utils/utils';
import { XFormContext } from './core/XFormContext';
import { english, spanish } from './core/XFormLocale';
import { button, ButtonSpec } from './builtin/button';
import { Form } from './core/Form';

export {
    button,
    checkbox,
    checklist,
    date,
    decimal,
    number,
    password,
    radio,
    select,
    text,
    textarea,
    time,
    button as $Button,
    checkbox as $Checkbox,
    checklist as $Checklist,
    date as $Date,
    decimal as $Decimal,
    number as $Number,
    password as $Password,
    radio as $Radio,
    select as $Select,
    text as $Text,
    textarea as $TextArea,
    time as $Time,
    $Form,
    $Submitter,
    acceptBoolean,
    english,
    optional,
    removeExcessWhitespace,
    scrollToField,
    spanish,
    useForm,
    CustomField,
    Field,
    FieldSpec,
    FieldSpec as $Field,
    Form,
    Invalid,
    Option,
    OptionWithProps,
    Result,
    Valid,
    XFormContext,
};

export type {
    ButtonSpec,
    ButtonProps,
    EnumOption,
    FieldConfig,
    FieldDefaults,
    FormConfig,
    FormProps,
    FormState,
    LabelProps,
    InputProps,
    InputState,
    SubmitConfig,
    TextAreaProps,
    Theme,
};
