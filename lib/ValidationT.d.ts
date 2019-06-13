import { ApplicativeComposition02C, ApplicativeComposition12C, ApplicativeComposition22C } from './Applicative';
import { Either, URI } from './Either';
import { HKT, Type, Type2, URIS, URIS2 } from './HKT';
import { Monad, Monad1, Monad2 } from './Monad';
import { Semigroup } from './Semigroup';
/**
 * @since 2.0.0
 */
export interface ValidationT<M, E, A> extends HKT<M, Either<E, A>> {
}
/**
 * @since 2.0.0
 */
export interface ValidationM<M, E> extends ApplicativeComposition02C<M, URI, E> {
    readonly chain: <A, B>(ma: ValidationT<M, E, A>, f: (a: A) => ValidationT<M, E, B>) => ValidationT<M, E, B>;
    readonly alt: <A>(fx: ValidationT<M, E, A>, f: () => ValidationT<M, E, A>) => ValidationT<M, E, A>;
}
/**
 * @since 2.0.0
 */
export declare type ValidationT1<M extends URIS, E, A> = Type<M, Either<E, A>>;
/**
 * @since 2.0.0
 */
export interface ValidationM1<M extends URIS, E> extends ApplicativeComposition12C<M, URI, E> {
    readonly chain: <A, B>(ma: ValidationT1<M, E, A>, f: (a: A) => ValidationT1<M, E, B>) => ValidationT1<M, E, B>;
    readonly alt: <A>(fx: ValidationT1<M, E, A>, f: () => ValidationT1<M, E, A>) => ValidationT1<M, E, A>;
}
/**
 * @since 2.0.0
 */
export declare type ValidationT2<M extends URIS2, L, E, A> = Type2<M, L, Either<E, A>>;
/**
 * @since 2.0.0
 */
export interface ValidationM2<M extends URIS2, E> extends ApplicativeComposition22C<M, URI, E> {
    readonly chain: <L, A, B>(ma: ValidationT2<M, L, E, A>, f: (a: A) => ValidationT2<M, L, E, B>) => ValidationT2<M, L, E, B>;
    readonly alt: <L, A>(fx: ValidationT2<M, L, E, A>, f: () => ValidationT2<M, L, E, A>) => ValidationT2<M, L, E, A>;
}
/**
 * @since 2.0.0
 */
export declare function getValidationM<E, M extends URIS2>(S: Semigroup<E>, M: Monad2<M>): ValidationM2<M, E>;
export declare function getValidationM<E, M extends URIS>(S: Semigroup<E>, M: Monad1<M>): ValidationM1<M, E>;
export declare function getValidationM<E, M>(S: Semigroup<E>, M: Monad<M>): ValidationM<M, E>;
