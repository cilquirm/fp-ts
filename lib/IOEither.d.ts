/**
 * @file `IOEither<L, A>` represents a synchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `L`. If you want to represent a synchronous computation that never fails, please see `IO`.
 */
import { Alt2 } from './Alt';
import { Bifunctor2 } from './Bifunctor';
import { Either } from './Either';
import { Lazy } from './function';
import { IO } from './IO';
import { Monad2 } from './Monad';
import { MonadThrow2 } from './MonadThrow';
declare module './HKT' {
    interface URI2HKT2<L, A> {
        IOEither: IOEither<L, A>;
    }
}
export declare const URI = "IOEither";
export declare type URI = typeof URI;
/**
 * @since 1.6.0
 */
export declare class IOEither<L, A> {
    readonly value: IO<Either<L, A>>;
    readonly _A: A;
    readonly _L: L;
    readonly _URI: URI;
    constructor(value: IO<Either<L, A>>);
    /**
     * Runs the inner io
     */
    run(): Either<L, A>;
    map<B>(f: (a: A) => B): IOEither<L, B>;
    ap<B>(fab: IOEither<L, (a: A) => B>): IOEither<L, B>;
    /**
     * Flipped version of `ap`
     */
    ap_<B, C>(this: IOEither<L, (b: B) => C>, fb: IOEither<L, B>): IOEither<L, C>;
    /**
     * Combine two effectful actions, keeping only the result of the first
     */
    applyFirst<B>(fb: IOEither<L, B>): IOEither<L, A>;
    /**
     * Combine two effectful actions, keeping only the result of the second
     */
    applySecond<B>(fb: IOEither<L, B>): IOEither<L, B>;
    chain<B>(f: (a: A) => IOEither<L, B>): IOEither<L, B>;
    fold<R>(left: (l: L) => R, right: (a: A) => R): IO<R>;
    /**
     * Similar to `fold`, but the result is flattened.
     *
     * @since 1.19.0
     */
    foldIO<R>(left: (l: L) => IO<R>, right: (a: A) => IO<R>): IO<R>;
    /**
     * Similar to `fold`, but the result is flattened.
     *
     * @since 1.19.0
     */
    foldIOEither<M, B>(onLeft: (l: L) => IOEither<M, B>, onRight: (a: A) => IOEither<M, B>): IOEither<M, B>;
    mapLeft<M>(f: (l: L) => M): IOEither<M, A>;
    orElse<M>(f: (l: L) => IOEither<M, A>): IOEither<M, A>;
    alt(fy: IOEither<L, A>): IOEither<L, A>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): IOEither<V, B>;
}
/**
 * Use `rightIO`
 *
 * @since 1.6.0
 * @deprecated
 */
export declare const right: <L, A>(fa: IO<A>) => IOEither<L, A>;
/**
 * Use `leftIO`
 *
 * @since 1.6.0
 * @deprecated
 */
export declare const left: <L, A>(fa: IO<L>) => IOEither<L, A>;
/**
 * @since 1.6.0
 */
export declare const fromEither: <L, A>(fa: Either<L, A>) => IOEither<L, A>;
/**
 * Use `left2v`
 *
 * @since 1.6.0
 * @deprecated
 */
export declare const fromLeft: <L, A>(l: L) => IOEither<L, A>;
/**
 * Use `tryCatch2v` instead
 *
 * @since 1.6.0
 * @deprecated
 */
export declare const tryCatch: <A>(f: Lazy<A>, onerror?: (reason: unknown) => Error) => IOEither<Error, A>;
/**
 * @since 1.11.0
 */
export declare const tryCatch2v: <L, A>(f: Lazy<A>, onerror: (reason: unknown) => L) => IOEither<L, A>;
/**
 * @since 1.6.0
 */
export declare const ioEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadThrow2<URI>;
/**
 * @since 1.19.0
 */
export declare const left2v: <L>(l: L) => IOEither<L, never>;
/**
 * @since 1.19.0
 */
export declare function right2v<A>(a: A): IOEither<never, A>;
/**
 * @since 1.19.0
 */
export declare const rightIO: <A>(ma: IO<A>) => IOEither<never, A>;
/**
 * @since 1.19.0
 */
export declare const leftIO: <E>(me: IO<E>) => IOEither<E, never>;
/**
 * @since 1.19.0
 */
export declare function fold<E, A, R>(onLeft: (e: E) => IO<R>, onRight: (a: A) => IO<R>): (ma: IOEither<E, A>) => IO<R>;
/**
 * @since 1.19.0
 */
export declare function orElse<E, A, M>(f: (e: E) => IOEither<M, A>): (ma: IOEither<E, A>) => IOEither<M, A>;
declare const alt: <L, A>(that: () => IOEither<L, A>) => (fa: IOEither<L, A>) => IOEither<L, A>, ap: <L, A>(fa: IOEither<L, A>) => <B>(fab: IOEither<L, (a: A) => B>) => IOEither<L, B>, apFirst: <L, B>(fb: IOEither<L, B>) => <A>(fa: IOEither<L, A>) => IOEither<L, A>, apSecond: <L, B>(fb: IOEither<L, B>) => <A>(fa: IOEither<L, A>) => IOEither<L, B>, bimap: <L, A, M, B>(f: (l: L) => M, g: (a: A) => B) => (fa: IOEither<L, A>) => IOEither<M, B>, chain: <L, A, B>(f: (a: A) => IOEither<L, B>) => (ma: IOEither<L, A>) => IOEither<L, B>, chainFirst: <L, A, B>(f: (a: A) => IOEither<L, B>) => (ma: IOEither<L, A>) => IOEither<L, A>, flatten: <L, A>(mma: IOEither<L, IOEither<L, A>>) => IOEither<L, A>, map: <A, B>(f: (a: A) => B) => <L>(fa: IOEither<L, A>) => IOEither<L, B>, mapLeft: <L, A, M>(f: (l: L) => M) => (fa: IOEither<L, A>) => IOEither<M, A>;
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft };
