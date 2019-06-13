import { Alt3 } from './Alt';
import { Bifunctor3 } from './Bifunctor';
import { Either } from './Either';
import { Predicate, Refinement } from './function';
import { IO } from './IO';
import { IOEither } from './IOEither';
import { Monad3 } from './Monad';
import { MonadIO3 } from './MonadIO';
import { MonadTask3 } from './MonadTask';
import { Monoid } from './Monoid';
import { Option } from './Option';
import { Reader } from './Reader';
import { Semigroup } from './Semigroup';
import { Task } from './Task';
import * as TE from './TaskEither';
import TaskEither = TE.TaskEither;
import { ReaderEither } from './ReaderEither';
declare module './HKT' {
    interface URI2HKT3<U, L, A> {
        ReaderTaskEither: ReaderTaskEither<U, L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "ReaderTaskEither";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface ReaderTaskEither<R, E, A> {
    (r: R): TaskEither<E, A>;
}
/**
 * @since 2.0.0
 */
export declare function run<R, E, A>(ma: ReaderTaskEither<R, E, A>, r: R): Promise<Either<E, A>>;
/**
 * @since 2.0.0
 */
export declare function left<R, E>(e: E): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare const right: <R, A>(a: A) => ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function rightTask<R, A>(ma: Task<A>): ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftTask<R, E>(me: Task<E>): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare const fromTaskEither: <R, E, A>(ma: TaskEither<E, A>) => ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare const rightReader: <R, A>(ma: Reader<R, A>) => ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftReader<R, E>(me: Reader<R, E>): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare function fromIOEither<R, E, A>(ma: IOEither<E, A>): ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromEither<R, E, A>(ma: Either<E, A>): ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromReaderEither<R, E, A>(ma: ReaderEither<R, E, A>): ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fromOption<E>(onNone: () => E): <R, A>(ma: Option<A>) => ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function rightIO<R, A>(ma: IO<A>): ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function leftIO<R, E>(me: IO<E>): ReaderTaskEither<R, E, never>;
/**
 * @since 2.0.0
 */
export declare function fromPredicate<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(a: A) => ReaderTaskEither<R, E, B>;
export declare function fromPredicate<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(a: A) => ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function fold<R, E, A, B>(onLeft: (e: E) => Reader<R, Task<B>>, onRight: (a: A) => Reader<R, Task<B>>): (ma: ReaderTaskEither<R, E, A>) => Reader<R, Task<B>>;
/**
 * @since 2.0.0
 */
export declare function getOrElse<R, E, A>(onLeft: (e: E) => Reader<R, Task<A>>): (ma: ReaderTaskEither<R, E, A>) => Reader<R, Task<A>>;
/**
 * @since 2.0.0
 */
export declare function orElse<R, E, A, M>(f: (e: E) => ReaderTaskEither<R, M, A>): (ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, M, A>;
/**
 * @since 2.0.0
 */
export declare function filterOrElse<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, B>;
export declare function filterOrElse<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): <R>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<R, E, A>;
/**
 * @since 2.0.0
 */
export declare function swap<R, E, A>(ma: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, A, E>;
/**
 * @since 2.0.0
 */
export declare function getSemigroup<R, E, A>(S: Semigroup<A>): Semigroup<ReaderTaskEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplySemigroup<R, E, A>(S: Semigroup<A>): Semigroup<ReaderTaskEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplyMonoid<R, E, A>(M: Monoid<A>): Monoid<ReaderTaskEither<R, E, A>>;
/**
 * @since 2.0.0
 */
export declare const ask: <R>() => ReaderTaskEither<R, never, R>;
/**
 * @since 2.0.0
 */
export declare const asks: <R, A>(f: (r: R) => A) => ReaderTaskEither<R, never, A>;
/**
 * @since 2.0.0
 */
export declare function local<Q, R>(f: (f: Q) => R): <E, A>(ma: ReaderTaskEither<R, E, A>) => ReaderTaskEither<Q, E, A>;
/**
 * @since 2.0.0
 */
export declare const readerTaskEither: Monad3<URI> & Bifunctor3<URI> & Alt3<URI> & MonadIO3<URI> & MonadTask3<URI>;
/**
 * Like `readerTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
export declare const readerTaskEitherSeq: typeof readerTaskEither;
declare const alt: <U, L, A>(that: () => ReaderTaskEither<U, L, A>) => (fa: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, L, A>, ap: <U, L, A>(fa: ReaderTaskEither<U, L, A>) => <B>(fab: ReaderTaskEither<U, L, (a: A) => B>) => ReaderTaskEither<U, L, B>, apFirst: <U, L, B>(fb: ReaderTaskEither<U, L, B>) => <A>(fa: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, L, A>, apSecond: <U, L, B>(fb: ReaderTaskEither<U, L, B>) => <A>(fa: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, L, B>, bimap: <L, A, M, B>(f: (l: L) => M, g: (a: A) => B) => <U>(fa: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, M, B>, chain: <U, L, A, B>(f: (a: A) => ReaderTaskEither<U, L, B>) => (ma: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, L, B>, chainFirst: <U, L, A, B>(f: (a: A) => ReaderTaskEither<U, L, B>) => (ma: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, L, A>, flatten: <U, L, A>(mma: ReaderTaskEither<U, L, ReaderTaskEither<U, L, A>>) => ReaderTaskEither<U, L, A>, map: <A, B>(f: (a: A) => B) => <U, L>(fa: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, L, B>, mapLeft: <L, A, M>(f: (l: L) => M) => <U>(fa: ReaderTaskEither<U, L, A>) => ReaderTaskEither<U, M, A>;
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft };
