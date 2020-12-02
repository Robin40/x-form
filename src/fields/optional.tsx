import { $Field } from './$Field';
import { Valid } from '../Result';

export function optional<S, T>(field: $Field<S, T>): $Field<S, T | null> {
    return new $Field<S, T | null>(field.config, {
        ...field.defaults,

        blankResult: Valid<T | null>(null),
    });
}
