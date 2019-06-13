/**
 * @file Adapted from https://github.com/purescript/purescript-tuples
 */
import { Applicative2C } from './Applicative';
import { Apply2C } from './Apply';
import { Bifunctor2 } from './Bifunctor';
import { Chain2C } from './Chain';
import { ChainRec2C } from './ChainRec';
import { Comonad2 } from './Comonad';
import { Foldable2 } from './Foldable';
import { Monad2C } from './Monad';
import { Monoid } from './Monoid';
import { Semigroup } from './Semigroup';
import { Semigroupoid2 } from './Semigroupoid';
import { Traversable2 } from './Traversable';
declare module './HKT' {
    interface URI2HKT2<L, A> {
        Tuple: [A, L];
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "Tuple";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export declare function fst<A, S>(sa: [A, S]): A;
/**
 * @since 2.0.0
 */
export declare function snd<A, S>(sa: [A, S]): S;
/**
 * @since 2.0.0
 */
export declare function swap<A, S>(sa: [A, S]): [S, A];
/**
 * @since 2.0.0
 */
export declare function getApply<S>(S: Semigroup<S>): Apply2C<URI, S>;
/**
 * @since 2.0.0
 */
export declare function getApplicative<S>(M: Monoid<S>): Applicative2C<URI, S>;
/**
 * @since 2.0.0
 */
export declare function getChain<S>(S: Semigroup<S>): Chain2C<URI, S>;
/**
 * @since 2.0.0
 */
export declare function getMonad<S>(M: Monoid<S>): Monad2C<URI, S>;
/**
 * @since 2.0.0
 */
export declare function getChainRec<S>(M: Monoid<S>): ChainRec2C<URI, S>;
/**
 * @since 2.0.0
 */
export declare const tuple: Semigroupoid2<URI> & Bifunctor2<URI> & Comonad2<URI> & Foldable2<URI> & Traversable2<URI>;
declare const bimap: <L, A, M, B>(f: (l: L) => M, g: (a: A) => B) => (fa: [A, L]) => [B, M], compose: <L, A>(la: [A, L]) => <B>(ab: [B, A]) => [B, L], duplicate: <L, A>(ma: [A, L]) => [[A, L], L], extend: <L, A, B>(f: (fa: [A, L]) => B) => (ma: [A, L]) => [B, L], foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <L>(fa: [A, L]) => M, map: <A, B>(f: (a: A) => B) => <L>(fa: [A, L]) => [B, L], mapLeft: <L, A, M>(f: (l: L) => M) => (fa: [A, L]) => [A, M], reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <L>(fa: [A, L]) => B, reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <L>(fa: [A, L]) => B;
export { bimap, compose, duplicate, extend, foldMap, map, mapLeft, reduce, reduceRight };
