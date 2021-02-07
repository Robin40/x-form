/* eslint-disable */
import { FieldSpec } from '../core/FieldSpec';

export type PartialDeep<T> = T extends Function
    ? T
    : T extends object
    ? { [P in keyof T]?: PartialDeep<T[P]> }
    : T;

export type InferS<F> = F extends FieldSpec<infer S, any>
    ? S
    : {
          [P in keyof F]: InferS<F[P]>;
      };

export type InferT<F> = F extends FieldSpec<any, infer T>
    ? T
    : {
          [P in keyof F]: InferT<F[P]>;
      };
