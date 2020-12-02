import React, { ReactElement } from 'react';

/** Because we can't do `x instanceof ReactElement`. */
export function isReactElement(x: any): x is ReactElement {
    return React.isValidElement(x);
}

export function isEmptyOrWhitespace(input: string): boolean {
    return input.trim().length === 0;
}

export function removeExcessWhitespace(input: string): string {
    return input.trim().replace(/  +/g, ' ');
}

const single = "'";
const double = '"';

export function quote(s: string, preferredQuote: string = double): string {
    if (
        [single, double].includes(preferredQuote) &&
        s.includes(preferredQuote)
    ) {
        const alternativeQuote = preferredQuote === double ? single : double;

        if (s.includes(alternativeQuote)) {
            return (
                preferredQuote +
                s.replace(
                    new RegExp(alternativeQuote, 'g'),
                    '\\' + alternativeQuote
                ) +
                preferredQuote
            );
        }

        return alternativeQuote + s + alternativeQuote;
    }

    return preferredQuote + s + preferredQuote;
}

export function scrollToTop(): void {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}
