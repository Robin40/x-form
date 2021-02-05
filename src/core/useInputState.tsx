import { Dispatch, SetStateAction, useState } from 'react';
import { Option } from './EnumOption';
import { useMountEffect } from '../utils/useMountEffect';
import _ from 'lodash/fp';
import { AsyncOptions, FieldOption, Options } from './FieldSpec';

export interface InputState<S> {
    readonly value: S;
    readonly setValue: Dispatch<SetStateAction<S>>;

    readonly isFocused: boolean;
    readonly setIsFocused: Dispatch<SetStateAction<boolean>>;

    readonly hasBeenBlurred: boolean;
    readonly setHasBeenBlurred: Dispatch<SetStateAction<boolean>>;

    readonly isLoading: boolean;
    readonly error: Error | null;
    readonly options: Option[];

    readonly initialValue: S;
}

export function useInputState<S>(
    initialValue: S,
    optionsObject: Options
): InputState<S> {
    const [value, setValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenBlurred, setHasBeenBlurred] = useState(false);

    const [isLoading, setIsLoading] = useState(isAsync(optionsObject));
    const [error, setError] = useState<Error | null>(null);
    const [options, setOptions] = useState(
        isAsync(optionsObject) ? [] : optionsObject.map(parseOption)
    );

    useMountEffect(() => {
        if (isAsync(optionsObject)) {
            optionsObject()
                .then(_.map(parseOption))
                .then(setOptions)
                .catch(setError)
                .finally(() => setIsLoading(false));
        }
    });

    return {
        value,
        setValue,
        isFocused,
        setIsFocused,
        hasBeenBlurred,
        setHasBeenBlurred,
        isLoading,
        error,
        options,
        initialValue,
    };
}

function isAsync(options: Options): options is AsyncOptions {
    return _.isFunction(options);
}

function parseOption(option: FieldOption): Option {
    if (typeof option === 'string') {
        return new Option({ value: option, label: option });
    }

    return new Option(option);
}
