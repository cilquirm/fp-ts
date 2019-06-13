import * as RTE from './ReaderTaskEither';
import { Monad4 } from './Monad';
import { Either } from './Either';
import { State } from './State';
import { Task } from './Task';
import { TaskEither } from './TaskEither';
import { Reader } from './Reader';
import { IOEither } from './IOEither';
import { Option } from './Option';
import { IO } from './IO';
import ReaderTaskEither = RTE.ReaderTaskEither;
import { ReaderEither } from './ReaderEither';
declare module './HKT' {
    interface URI2HKT4<X, U, L, A> {
        StateReaderTaskEither: StateReaderTaskEither<X, U, L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "StateReaderTaskEither";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
    (s: S): ReaderTaskEither<R, E, [A, S]>;
}
/**
 * @since 2.0.0
 */
export declare function run<S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S, r: R): Promise<Either<E, [A, S]>>;
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.0.0
 */
export declare const evalState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, A>;
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.0.0
 */
export declare const execState: <S, R, E, A>(ma: StateReaderTaskEither<S, R, E, A>, s: S) => ReaderTaskEither<R, E, S>;
/**
 * @since 2.0.0
 */
export declare function left<S, R, E>(e: E): StateReaderTaskEither<S, R, E, never>;
/**
 * @since 2.0.0
 */
export declare const right: <S, R, A>(a: A) => StateReaderTaskEither<S, R, never, A>;
/**
 * @since 2.0.0
 */
export declare function rightTask<S, R, A>(ma: Task<A>): StateReaderTaskEither<S, R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftTask<S, R, E>(me: Task<E>): StateReaderTaskEither<S, R, E, never>;
/**
 * @since 2.0.0
 */
export declare function fromTaskEither<S, R, E, A>(ma: TaskEither<E, A>): StateReaderTaskEither<S, R, E, A>;
/**
 * @since 2.0.0
 */
export declare function rightReader<S, R, A>(ma: Reader<R, A>): StateReaderTaskEither<S, R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftReader<S, R, E>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, never>;
/**
 * @since 2.0.0
 */
export declare function fromIOEither<S, R, E, A>(ma: IOEither<E, A>): StateReaderTaskEither<S, R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromEither<S, R, E, A>(ma: Either<E, A>): StateReaderTaskEither<S, R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromReaderEither<S, R, E, A>(ma: ReaderEither<R, E, A>): StateReaderTaskEither<S, R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromOption<E>(onNone: () => E): <S, R, A>(ma: Option<A>) => StateReaderTaskEither<S, R, E, A>;
/**
 * @since 2.0.0
 */
export declare function rightIO<S, R, A>(ma: IO<A>): StateReaderTaskEither<S, R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftIO<S, R, E>(me: IO<E>): StateReaderTaskEither<S, R, E, never>;
/**
 * @since 2.0.0
 */
export declare const rightState: <S, R, A>(ma: State<S, A>) => StateReaderTaskEither<S, R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftState<S, R, E>(me: State<S, E>): StateReaderTaskEither<S, R, E, never>;
/**
 * @since 2.0.0
 */
export declare const fromReaderTaskEither: <S, R, E, A>(ma: ReaderTaskEither<R, E, A>) => StateReaderTaskEither<S, R, E, A>;
/**
 * Get the current state
 *
 * @since 2.0.0
 */
export declare const get: <S, R>() => StateReaderTaskEither<S, R, never, S>;
/**
 * Set the state
 *
 * @since 2.0.0
 */
export declare const put: <S, R>(s: S) => StateReaderTaskEither<S, R, never, void>;
/**
 * Modify the state by applying a function to the current state
 *
 * @since 2.0.0
 */
export declare const modify: <S, R>(f: (s: S) => S) => StateReaderTaskEither<S, R, never, void>;
/**
 * Get a value which depends on the current state
 *
 * @since 2.0.0
 */
export declare const gets: <S, R, A>(f: (s: S) => A) => StateReaderTaskEither<S, R, never, A>;
/**
 * @since 2.0.0
 */
export declare const stateReaderTaskEither: Monad4<URI>;
/**
 * Like `stateReaderTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
export declare const stateReaderTaskEitherSeq: typeof stateReaderTaskEither;
declare const ap: <X, U, L, A>(fa: StateReaderTaskEither<X, U, L, A>) => <B>(fab: StateReaderTaskEither<X, U, L, (a: A) => B>) => StateReaderTaskEither<X, U, L, B>, apFirst: <X, U, L, B>(fb: StateReaderTaskEither<X, U, L, B>) => <A>(fa: StateReaderTaskEither<X, U, L, A>) => StateReaderTaskEither<X, U, L, A>, apSecond: <X, U, L, B>(fb: StateReaderTaskEither<X, U, L, B>) => <A>(fa: StateReaderTaskEither<X, U, L, A>) => StateReaderTaskEither<X, U, L, B>, chain: <X, U, L, A, B>(f: (a: A) => StateReaderTaskEither<X, U, L, B>) => (ma: StateReaderTaskEither<X, U, L, A>) => StateReaderTaskEither<X, U, L, B>, chainFirst: <X, U, L, A, B>(f: (a: A) => StateReaderTaskEither<X, U, L, B>) => (ma: StateReaderTaskEither<X, U, L, A>) => StateReaderTaskEither<X, U, L, A>, flatten: <X, U, L, A>(mma: StateReaderTaskEither<X, U, L, StateReaderTaskEither<X, U, L, A>>) => StateReaderTaskEither<X, U, L, A>, map: <A, B>(f: (a: A) => B) => <X, U, L>(fa: StateReaderTaskEither<X, U, L, A>) => StateReaderTaskEither<X, U, L, B>;
export { ap, apFirst, apSecond, chain, chainFirst, flatten, map };
