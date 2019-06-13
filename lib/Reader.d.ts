import { Category2 } from './Category';
import { Choice2 } from './Choice';
import { Monad2 } from './Monad';
import { Monoid } from './Monoid';
import { Profunctor2 } from './Profunctor';
import { Semigroup } from './Semigroup';
import { Strong2 } from './Strong';
declare module './HKT' {
    interface URI2HKT2<L, A> {
        Reader: Reader<L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "Reader";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface Reader<R, A> {
    (r: R): A;
}
/**
 * Reads the current context
 *
 * @since 2.0.0
 */
export declare const ask: <R>() => Reader<R, R>;
/**
 * Projects a value from the global context in a Reader
 *
 * @since 2.0.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => Reader<R, A>;
/**
 * changes the value of the local context during the execution of the action `ma`
 *
 * @since 2.0.0
 */
export declare function local<Q, R>(f: (d: Q) => R): <A>(ma: Reader<R, A>) => Reader<Q, A>;
/**
 * @since 2.0.0
 */
export declare function getSemigroup<R, A>(S: Semigroup<A>): Semigroup<Reader<R, A>>;
/**
 * @since 2.0.0
 */
export declare function getMonoid<R, A>(M: Monoid<A>): Monoid<Reader<R, A>>;
/**
 * @since 2.0.0
 */
export declare const of: <A>(a: A) => Reader<unknown, A>;
/**
 * @since 2.0.0
 */
export declare const reader: Monad2<URI> & Profunctor2<URI> & Category2<URI> & Strong2<URI> & Choice2<URI>;
declare const ap: <L, A>(fa: Reader<L, A>) => <B>(fab: Reader<L, (a: A) => B>) => Reader<L, B>, apFirst: <L, B>(fb: Reader<L, B>) => <A>(fa: Reader<L, A>) => Reader<L, A>, apSecond: <L, B>(fb: Reader<L, B>) => <A>(fa: Reader<L, A>) => Reader<L, B>, chain: <L, A, B>(f: (a: A) => Reader<L, B>) => (ma: Reader<L, A>) => Reader<L, B>, chainFirst: <L, A, B>(f: (a: A) => Reader<L, B>) => (ma: Reader<L, A>) => Reader<L, A>, compose: <L, A>(la: Reader<L, A>) => <B>(ab: Reader<A, B>) => Reader<L, B>, flatten: <L, A>(mma: Reader<L, Reader<L, A>>) => Reader<L, A>, map: <A, B>(f: (a: A) => B) => <L>(fa: Reader<L, A>) => Reader<L, B>, promap: <A, B, C, D>(f: (a: A) => B, g: (c: C) => D) => (fbc: Reader<B, C>) => Reader<A, D>;
export { ap, apFirst, apSecond, chain, chainFirst, compose, flatten, map, promap };
