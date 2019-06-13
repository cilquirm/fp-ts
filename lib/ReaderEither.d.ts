import { Alt3 } from './Alt';
import { Bifunctor3 } from './Bifunctor';
import * as E from './Either';
import { Predicate, Refinement } from './function';
import { Monad3 } from './Monad';
import { Monoid } from './Monoid';
import { Option } from './Option';
import { Reader } from './Reader';
import { Semigroup } from './Semigroup';
import Either = E.Either;
declare module './HKT' {
    interface URI2HKT3<U, L, A> {
        ReaderEither: ReaderEither<U, L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "ReaderEither";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface ReaderEither<R, E, A> extends Reader<R, Either<E, A>> {
}
/**
 * @since 2.0.0
 */
export declare const left: <R, E>(e: E) => ReaderEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare const right: <R, A>(a: A) => ReaderEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare const rightReader: <R, A>(ma: Reader<R, A>) => ReaderEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare const leftReader: <R, E>(me: Reader<R, E>) => ReaderEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare const fromEither: <R, E, A>(ma: Either<E, A>) => ReaderEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromOption<E>(onNone: () => E): <R, A>(ma: Option<A>) => ReaderEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromPredicate<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderEither<R, E, B>;
export declare function fromPredicate<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fold<R, E, A, B>(onLeft: (e: E) => Reader<R, B>, onRight: (a: A) => Reader<R, B>): (ma: ReaderEither<R, E, A>) => Reader<R, B>;
/**
 * @since 2.0.0
 */
export declare function getOrElse<R, E, A>(f: (e: E) => Reader<R, A>): (ma: ReaderEither<R, E, A>) => Reader<R, A>;
/**
 * @since 2.0.0
 */
export declare function orElse<R, E, A, M>(f: (e: E) => ReaderEither<R, M, A>): (ma: ReaderEither<R, E, A>) => ReaderEither<R, M, A>;
/**
 * @since 2.0.0
 */
export declare function filterOrElse<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, B>;
export declare function filterOrElse<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderEither<R, E, A>) => ReaderEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare const swap: <R, E, A>(ma: ReaderEither<R, E, A>) => ReaderEither<R, A, E>;
/**
 * @since 2.0.0
 */
export declare function getSemigroup<R, E, A>(S: Semigroup<A>): Semigroup<ReaderEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplySemigroup<R, E, A>(S: Semigroup<A>): Semigroup<ReaderEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplyMonoid<R, E, A>(M: Monoid<A>): Monoid<ReaderEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function ask<R>(): ReaderEither<R, never, R>;
/**
 * @since 2.0.0
 */
export declare function asks<R, A>(f: (r: R) => A): ReaderEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function local<Q, R>(f: (f: Q) => R): <E, A>(ma: ReaderEither<R, E, A>) => ReaderEither<Q, E, A>;
/**
 * @since 2.0.0
 */
export declare const readerEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI>;
declare const alt: <U, L, A>(that: () => ReaderEither<U, L, A>) => (fa: ReaderEither<U, L, A>) => ReaderEither<U, L, A>, ap: <U, L, A>(fa: ReaderEither<U, L, A>) => <B>(fab: ReaderEither<U, L, (a: A) => B>) => ReaderEither<U, L, B>, apFirst: <U, L, B>(fb: ReaderEither<U, L, B>) => <A>(fa: ReaderEither<U, L, A>) => ReaderEither<U, L, A>, apSecond: <U, L, B>(fb: ReaderEither<U, L, B>) => <A>(fa: ReaderEither<U, L, A>) => ReaderEither<U, L, B>, bimap: <L, A, M, B>(f: (l: L) => M, g: (a: A) => B) => <U>(fa: ReaderEither<U, L, A>) => ReaderEither<U, M, B>, chain: <U, L, A, B>(f: (a: A) => ReaderEither<U, L, B>) => (ma: ReaderEither<U, L, A>) => ReaderEither<U, L, B>, chainFirst: <U, L, A, B>(f: (a: A) => ReaderEither<U, L, B>) => (ma: ReaderEither<U, L, A>) => ReaderEither<U, L, A>, flatten: <U, L, A>(mma: ReaderEither<U, L, ReaderEither<U, L, A>>) => ReaderEither<U, L, A>, map: <A, B>(f: (a: A) => B) => <U, L>(fa: ReaderEither<U, L, A>) => ReaderEither<U, L, B>, mapLeft: <L, A, M>(f: (l: L) => M) => <U>(fa: ReaderEither<U, L, A>) => ReaderEither<U, M, A>;
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft };
