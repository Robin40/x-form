import { InputProps, LabelProps } from '../utils/htmlProps';
import Immutable, { ValueObject } from 'immutable';

export interface EnumOption {
    readonly value: string;
    readonly label: string;
}

export class Option implements EnumOption, ValueObject {
    readonly value: string;
    readonly label: string;

    constructor(option: EnumOption) {
        this.value = option.value;
        this.label = option.label;
    }

    toJSON(): string {
        return this.value;
    }

    equals(other: any): boolean {
        return (
            other instanceof Option &&
            Immutable.is(this.value, other.value) &&
            Immutable.is(this.label, other.label)
        );
    }

    hashCode(): number {
        return Immutable.hash(this.value) ^ Immutable.hash(this.label);
    }
}

export class OptionWithProps extends Option {
    constructor(
        readonly option: Option,
        readonly inputProps: InputProps,
        readonly labelProps: LabelProps
    ) {
        super(option);
    }
}
