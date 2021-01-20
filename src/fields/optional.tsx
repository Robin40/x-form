import { FieldSpec } from './FieldSpec';
import { Valid } from '../Result';

export function optional<S, T>(field: FieldSpec<S, T>): FieldSpec<S, T | null> {
    return new FieldSpec<S, T | null>(field.config, {
        ...field.defaults,

        blankResult: Valid<T | null>(null),
    });
}
