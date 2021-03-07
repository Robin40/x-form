import { Dispatch, SetStateAction, useState } from 'react';

export interface FormState {
    readonly isSubmitting: boolean;
    /** @internal */
    readonly setIsSubmitting: Dispatch<SetStateAction<boolean>>;

    readonly hasBeenSubmitted: boolean;
    /** @internal */
    readonly setHasBeenSubmitted: Dispatch<SetStateAction<boolean>>;

    readonly submitError: Error | null;
    /** @internal */
    readonly setSubmitError: Dispatch<SetStateAction<Error | null>>;
}

export function useFormState(): FormState {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<Error | null>(null);

    return {
        isSubmitting,
        setIsSubmitting,

        hasBeenSubmitted,
        setHasBeenSubmitted,

        submitError,
        setSubmitError,
    };
}
