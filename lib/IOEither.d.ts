/**
 * @file `IOEither<E, A>` represents a synchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `E`. If you want to represent a synchronous computation that never fails, please see `IO`.
 */
import { Alt2, Alt2C } from './Alt';
import { Bifunctor2 } from './Bifunctor';
import * as E from './Either';
import { Lazy } from './function';
import { IO } from './IO';
import { Monad2, Monad2C } from './Monad';
import { MonadIO2 } from './MonadIO';
import { MonadThrow2 } from './MonadThrow';
import { Monoid } from './Monoid';
import { Semigroup } from './Semigroup';
import Either = E.Either;
declare module './HKT' {
    interface URItoKind2<E, A> {
        IOEither: IOEither<E, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "IOEither";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface IOEither<E, A> extends IO<Either<E, A>> {
}
/**
 * @since 2.0.0
 */
export declare const left: <E>(l: E) => IOEither<E, never>;
/**
 * @since 2.0.0
 */
export declare const right: <A>(a: A) => IOEither<never, A>;
/**
 * @since 2.0.0
 */
export declare const rightIO: <A>(ma: IO<A>) => IOEither<never, A>;
/**
 * @since 2.0.0
 */
export declare const leftIO: <E>(me: IO<E>) => IOEither<E, never>;
/**
 * @since 2.0.0
 */
export declare function fold<E, A, B>(onLeft: (e: E) => IO<B>, onRight: (a: A) => IO<B>): (ma: IOEither<E, A>) => IO<B>;
/**
 * @since 2.0.0
 */
export declare function getOrElse<E, A>(f: (e: E) => IO<A>): (ma: IOEither<E, A>) => IO<A>;
/**
 * @since 2.0.0
 */
export declare function orElse<E, A, M>(f: (e: E) => IOEither<M, A>): (ma: IOEither<E, A>) => IOEither<M, A>;
/**
 * @since 2.0.0
 */
export declare const swap: <E, A>(ma: IOEither<E, A>) => IOEither<A, E>;
/**
 * @since 2.0.0
 */
export declare function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<IOEither<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<IOEither<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<IOEither<E, A>>;
/**
 * Constructs a new `IOEither` from a function that performs a side effect and might throw
 *
 * @since 2.0.0
 */
export declare function tryCatch<E, A>(f: Lazy<A>, onError: (reason: unknown) => E): IOEither<E, A>;
/**
 * Make sure that a resource is cleaned up in the event of an exception. The
 * release action is called regardless of whether the body action throws or
 * returns.
 *
 * @since 2.0.0
 */
export declare function bracket<E, A, B>(acquire: IOEither<E, A>, use: (a: A) => IOEither<E, B>, release: (a: A, e: Either<E, B>) => IOEither<E, void>): IOEither<E, B>;
/**
 * @since 2.0.0
 */
export declare function getIOValidation<E>(S: Semigroup<E>): Monad2C<URI, E> & Alt2C<URI, E>;
/**
 * @since 2.0.0
 */
export declare const ioEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadIO2<URI> & MonadThrow2<URI>;
declare const alt: <E, A>(that: () => IOEither<E, A>) => (fa: IOEither<E, A>) => IOEither<E, A>, ap: <E, A>(fa: IOEither<E, A>) => <B>(fab: IOEither<E, (a: A) => B>) => IOEither<E, B>, apFirst: <E, B>(fb: IOEither<E, B>) => <A>(fa: IOEither<E, A>) => IOEither<E, A>, apSecond: <e, B>(fb: IOEither<e, B>) => <A>(fa: IOEither<e, A>) => IOEither<e, B>, bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: IOEither<E, A>) => IOEither<G, B>, chain: <E, A, B>(f: (a: A) => IOEither<E, B>) => (ma: IOEither<E, A>) => IOEither<E, B>, chainFirst: <E, A, B>(f: (a: A) => IOEither<E, B>) => (ma: IOEither<E, A>) => IOEither<E, A>, flatten: <E, A>(mma: IOEither<E, IOEither<E, A>>) => IOEither<E, A>, map: <A, B>(f: (a: A) => B) => <E>(fa: IOEither<E, A>) => IOEither<E, B>, mapLeft: <E, G, A>(f: (e: E) => G) => (fa: IOEither<E, A>) => IOEither<G, A>, fromEither: <E, A>(ma: E.Either<E, A>) => IOEither<E, A>, fromOption: <E>(onNone: () => E) => <A>(ma: import("./Option").Option<A>) => IOEither<E, A>, fromPredicate: {
    <E, A, B extends A>(refinement: import("./function").Refinement<A, B>, onFalse: (a: A) => E): (a: A) => IOEither<E, B>;
    <E, A>(predicate: import("./function").Predicate<A>, onFalse: (a: A) => E): (a: A) => IOEither<E, A>;
}, filterOrElse: {
    <E, A, B extends A>(refinement: import("./function").Refinement<A, B>, onFalse: (a: A) => E): (ma: IOEither<E, A>) => IOEither<E, B>;
    <E, A>(predicate: import("./function").Predicate<A>, onFalse: (a: A) => E): (ma: IOEither<E, A>) => IOEither<E, A>;
};
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft, fromEither, fromOption, fromPredicate, filterOrElse };