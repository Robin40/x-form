import _ from 'lodash';

export interface Being {
    is(x: any): boolean;
}

export function isBeing(obj: unknown): obj is Being {
    return _.isFunction((obj as any)?.is);
}
