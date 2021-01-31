import { Dispatch, SetStateAction, useState } from 'react';

export const setIsSubmitting = Symbol('setIsSubmitting');
export const setHasBeenSubmitted = Symbol('setHasBeenSubmitted');
export const setSubmitError = Symbol('setSubmitError');

export interface FormState {
    readonly isSubmitting: boolean;
    readonly [setIsSubmitting]: Dispatch<SetStateAction<boolean>>;

    readonly hasBeenSubmitted: boolean;
    readonly [setHasBeenSubmitted]: Dispatch<SetStateAction<boolean>>;

    readonly submitError: Error | null;
    readonly [setSubmitError]: Dispatch<SetStateAction<Error | null>>;
}

export function useFormState(): FormState {
    const [isSubmitting, setIsSubmitting_] = useState(false);
    const [hasBeenSubmitted, setHasBeenSubmitted_] = useState(false);
    const [submitError, setSubmitError_] = useState<Error | null>(null);

    return {
        isSubmitting,
        [setIsSubmitting]: setIsSubmitting_,

        hasBeenSubmitted,
        [setHasBeenSubmitted]: setHasBeenSubmitted_,

        submitError,
        [setSubmitError]: setSubmitError_,
    };
}
