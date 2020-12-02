import { english, XFormLocale } from './XFormLocale';
import { createContext } from 'react';

export interface IXFormContext {
    locale: XFormLocale;
}

export const XFormContext = createContext<IXFormContext>({ locale: english });
