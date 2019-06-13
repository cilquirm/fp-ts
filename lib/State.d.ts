import { Monad2 } from './Monad';
declare module './HKT' {
    interface URI2HKT2<L, A> {
        State: State<L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "State";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface State<S, A> {
    (s: S): [A, S];
}
/**
 * Run a computation in the `State` monad, discarding the final state
 *
 * @since 2.0.0
 */
export declare const evalState: <S, A>(ma: State<S, A>, s: S) => A;
/**
 * Run a computation in the `State` monad discarding the result
 *
 * @since 2.0.0
 */
export declare const execState: <S, A>(ma: State<S, A>, s: S) => S;
/**
 * Get the current state
 *
 * @since 2.0.0
 */
export declare const get: <S>() => State<S, S>;
/**
 * Set the state
 *
 * @since 2.0.0
 */
export declare const put: <S>(s: S) => State<S, void>;
/**
 * Modify the state by applying a function to the current state
 *
 * @since 2.0.0
 */
export declare const modify: <S>(f: (s: S) => S) => State<S, void>;
/**
 * Get a value which depends on the current state
 *
 * @since 2.0.0
 */
export declare const gets: <S, A>(f: (s: S) => A) => State<S, A>;
/**
 * @since 2.0.0
 */
export declare const of: <S, A>(a: A) => State<S, A>;
/**
 * @since 2.0.0
 */
export declare const state: Monad2<URI>;
declare const ap: <L, A>(fa: State<L, A>) => <B>(fab: State<L, (a: A) => B>) => State<L, B>, apFirst: <L, B>(fb: State<L, B>) => <A>(fa: State<L, A>) => State<L, A>, apSecond: <L, B>(fb: State<L, B>) => <A>(fa: State<L, A>) => State<L, B>, chain: <L, A, B>(f: (a: A) => State<L, B>) => (ma: State<L, A>) => State<L, B>, chainFirst: <L, A, B>(f: (a: A) => State<L, B>) => (ma: State<L, A>) => State<L, A>, flatten: <L, A>(mma: State<L, State<L, A>>) => State<L, A>, map: <A, B>(f: (a: A) => B) => <L>(fa: State<L, A>) => State<L, B>;
export { ap, apFirst, apSecond, chain, chainFirst, flatten, map };
