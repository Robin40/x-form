import Immutable, { ValueObject } from 'immutable';
import _ from 'lodash';

/***
 *    ██████╗ ███████╗███████╗██╗   ██╗██╗  ████████╗
 *    ██╔══██╗██╔════╝██╔════╝██║   ██║██║  ╚══██╔══╝
 *    ██████╔╝█████╗  ███████╗██║   ██║██║     ██║
 *    ██╔══██╗██╔══╝  ╚════██║██║   ██║██║     ██║
 *    ██║  ██║███████╗███████║╚██████╔╝███████╗██║
 *    ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝
 *
 */

/** The return type for `parse` and `validate` functions.
 *
 * `Result` can store the following results after a field is parsed and/or
 * validated:
 * - a `Valid(value)`
 * - an `Invalid(message)` where `message` is the error message shown to the
 * user below the field.
 *
 * Note for immutable users: `Result` implements `ValueObject`.
 *
 * Note for functional programmers: the `Result` type is a chainable functor. */
export abstract class Result<T> implements ValueObject {
    /** Use `.equals(...)` instead of `===` or `==` for equality by value.
     *
     * ```
     * Result(42) === Result(42) // false
     * Result(42) == Result(42) // false
     * Result(42).equals(Result(42)) // true
     * ``` */
    abstract equals(other: any): boolean;

    /** Used internally by the `immutable` package to optimize equality checks.
     * */
    abstract hashCode(): number;

    /** Applies the given function to the value of a `Valid` result, returning
     * another `Valid` result with the transformed value.
     *
     * If applied to an `Invalid` result it returns that same result unmodified.
     *
     * Examples:
     * - `Valid(42).map(x => x + 1)  // Valid(43)`
     * - `Invalid("Oops").map(x => x + 1)  // Invalid("Oops")`
     * */
    abstract map<U>(fn: (x: T) => U): Result<U>;

    /** Applies the `fn` function to the value of a `Valid` result, returning
     * the same result that `fn` returned.
     *
     * If applied to an `Invalid` result it returns that same result unmodified.
     *
     * Examples:
     * - `Valid(42).chain(x => Invalid(x + '!'))  // Invalid("42!")`
     * - `Invalid("Oops").chain(x => Invalid(x + '!')) // Invalid("Oops")`
     * */
    abstract chain<U>(fn: (x: T) => Result<U>): Result<U>;

    /** Gets the value assuming the result is `Valid`, or throws otherwise.
     *
     * You can pass an errorMessage to be shown
     * if an `Invalid` result is unwrapped. */
    abstract unwrap(errorMessage?: string): T;

    /** Checks whether this result is a `Valid` result with the given value,
     * using `Immutable.is` for the equality check.
     *
     * Examples:
     * ```
     * Valid(42).is(42) // true
     * Valid("42").is(42) // false
     * Invalid("Nope").is(42) // false
     * ``` */
    abstract is(value: T): boolean;

    /** Checks whether this result is a `Valid` result whose value satisfies
     * the given predicate.
     *
     * Examples:
     * ```
     * const over9000 = x => x > 9000;
     * Valid(9999).is(over9000) // true
     * Valid(42).is(over9000) // false
     * Invalid('Whoops').is(over9000) // false
     * ```
     * */
    abstract is(predicate: Predicate<T>): boolean;

    /** Checks whether this result is an instance of the given result type.
     *
     * Examples:
     * ```
     * Valid(42).is(Valid) // true
     * Valid(42).is(Invalid) // false
     * Invalid('...').is(Valid) // false
     * Invalid('...').is(Invalid) // true
     * ``` */
    abstract is(type: ResultType): boolean;
}

export type Predicate<T> = (x: T) => boolean;

export type ResultType = typeof Valid | typeof Invalid;

function isResultType(x: any): x is ResultType {
    return x === Valid || x === Invalid;
}

/***
 *    ██╗   ██╗ █████╗ ██╗     ██╗██████╗
 *    ██║   ██║██╔══██╗██║     ██║██╔══██╗
 *    ██║   ██║███████║██║     ██║██║  ██║
 *    ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║
 *     ╚████╔╝ ██║  ██║███████╗██║██████╔╝
 *      ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝
 *
 */

/** @see Result */
class $Valid<T> extends Result<T> {
    constructor(readonly value: T) {
        super();
    }

    equals(other: any): boolean {
        return other instanceof Valid && Immutable.is(this.value, other.value);
    }

    hashCode(): number {
        return Immutable.hash(this.value);
    }

    map<U>(fn: (x: T) => U): Valid<U> {
        return Valid(fn(this.value));
    }

    chain<U>(fn: (x: T) => Result<U>): Result<U> {
        return fn(this.value);
    }

    unwrap(_errorMessage?: string): T {
        return this.value;
    }

    is(arg: T | Predicate<T> | ResultType): boolean {
        if (isResultType(arg)) {
            return arg === Valid;
        }

        if (_.isFunction(arg)) {
            return arg(this.value);
        }

        return Immutable.is(this.value, arg);
    }
}

/** @see Result */
export type Valid<T> = $Valid<T>;

/** @see Result */
// // eslint-disable-next-line @typescript-eslint/no-redeclare
export function Valid<T>(value: T): Valid<T> {
    return new $Valid(value);
}

// make `Valid(...) instanceof Valid` to work
Valid.prototype = $Valid.prototype;

/***
 *    ██╗███╗   ██╗██╗   ██╗ █████╗ ██╗     ██╗██████╗
 *    ██║████╗  ██║██║   ██║██╔══██╗██║     ██║██╔══██╗
 *    ██║██╔██╗ ██║██║   ██║███████║██║     ██║██║  ██║
 *    ██║██║╚██╗██║╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║
 *    ██║██║ ╚████║ ╚████╔╝ ██║  ██║███████╗██║██████╔╝
 *    ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝
 *
 */

/** @see Result */
class $Invalid<T> extends Result<T> {
    constructor(readonly message: string) {
        super();
    }

    equals(other: any): boolean {
        return other instanceof Invalid && this.message === other.message;
    }

    hashCode(): number {
        return Immutable.hash(this.message);
    }

    map<U>(_fn: (x: T) => U): Invalid<U> {
        return this.cast();
    }

    chain<U>(_fn: (x: T) => Result<U>): Result<U> {
        return this.cast();
    }

    unwrap(errorMessage?: string): T {
        throw new Error(
            errorMessage ?? 'Attempted to unwrap an Invalid result'
        );
    }

    is(arg: T | Predicate<T> | ResultType): boolean {
        return arg === Invalid;
    }

    /** Casts this `Invalid<T>` instance to `Invalid<U>`. */
    cast<U>(): Invalid<U> {
        // `Invalid` results always store strings so this is safe
        return (this as unknown) as Invalid<U>;
    }
}

/** @see Result */
export type Invalid<T> = $Invalid<T>;

/** @see Result */
// // eslint-disable-next-line @typescript-eslint/no-redeclare
export function Invalid<T>(message: string): Invalid<T> {
    return new $Invalid(message);
}

// make `Invalid("...") instanceof Invalid` to work
Invalid.prototype = $Invalid.prototype;
