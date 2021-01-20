import { $Form, FormConfig, useForm } from './$Form';
import { checkbox, acceptBoolean } from './fields/checkbox';
import { checklist } from './fields/checklist';
import { date } from './fields/date';
import { decimal } from './fields/decimal';
import { FieldSpec, FieldConfig, FieldDefaults } from './fields/FieldSpec';
import { number } from './fields/number';
import { password } from './fields/password';
import { radio } from './fields/radio';
import { select } from './fields/select';
import { text } from './fields/text';
import { textarea } from './fields/textarea';
import { time } from './fields/time';
import { CustomField } from './fields/CustomField';
import { EnumOption, Option, OptionWithProps } from './fields/EnumOption';
import { Field, scrollToField } from './fields/Field';
import { optional } from './fields/optional';
import { Theme } from './fields/Theme';
import { Invalid, Result, Valid } from './Result';
import { $Button } from './submit/$Button';
import { $Submitter, SubmitConfig } from './submit/$Submitter';
import { FormState } from './useFormState';
import {
    ButtonProps,
    FormProps,
    LabelProps,
    InputProps,
    TextAreaProps,
} from './utils/htmlProps';
import { InputState } from './utils/useInputState';
import { removeExcessWhitespace } from './utils/utils';
import { XFormContext } from './XFormContext';
import { english, spanish } from './XFormLocale';

export {
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
    $Button,
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
    Invalid,
    Option,
    OptionWithProps,
    Result,
    Valid,
    XFormContext,
};

export type {
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
