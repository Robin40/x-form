import { $Form, FormConfig, useForm } from './$Form';
import { $Checkbox, acceptBoolean } from './fields/$Checkbox';
import { $Checklist } from './fields/$Checklist';
import { $Date } from './fields/$Date';
import { $Decimal } from './fields/$Decimal';
import { FieldSpec, FieldConfig, FieldDefaults } from './fields/FieldSpec';
import { $Number } from './fields/$Number';
import { $Password } from './fields/$Password';
import { $Radio } from './fields/$Radio';
import { $Select } from './fields/$Select';
import { text } from './fields/text';
import { $TextArea } from './fields/$TextArea';
import { $Time } from './fields/$Time';
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
    text,
    text as $Text,
    $Button,
    $Checkbox,
    $Checklist,
    $Date,
    $Decimal,
    $Form,
    $Number,
    $Password,
    $Radio,
    $Select,
    $Submitter,
    $TextArea,
    $Time,
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
