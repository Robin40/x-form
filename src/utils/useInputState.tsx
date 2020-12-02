import { Dispatch, SetStateAction, useState } from 'react';
import { Option } from '../fields/EnumOption';
import { useMountEffect } from './useMountEffect';
import _ from 'lodash/fp';
import { AsyncOptions, FieldOption, Options } from '../fields/$Field';

export interface InputState<S> {
    readonly value: S;
    readonly setValue: Dispatch<SetStateAction<S>>;

    readonly hasBeenBlurred: boolean;
    readonly setHasBeenBlurred: Dispatch<SetStateAction<boolean>>;

    readonly isLoading: boolean;
    readonly error: Error | null;
    readonly options: Option[];
}

export function useInputState<S>(
    initialState: S,
    optionsObject: Options
): InputState<S> {
    const [value, setValue] = useState(initialState);
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
        hasBeenBlurred,
        setHasBeenBlurred,
        isLoading,
        error,
        options,
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
