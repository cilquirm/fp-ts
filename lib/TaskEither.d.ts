/**
 * @file `TaskEither<E, A>` represents an asynchronous computation that either yields a value of type `A` or fails yielding an
 * error of type `E`. If you want to represent an asynchronous computation that never fails, please see `Task`.
 */
import { Alt2, Alt2C } from './Alt';
import { Bifunctor2 } from './Bifunctor';
import * as E from './Either';
import { Lazy, Predicate, Refinement } from './function';
import { IO } from './IO';
import { IOEither } from './IOEither';
import { Monad2, Monad2C } from './Monad';
import { MonadIO2 } from './MonadIO';
import { MonadTask2 } from './MonadTask';
import { Monoid } from './Monoid';
import { Option } from './Option';
import { Semigroup } from './Semigroup';
import { Task } from './Task';
import Either = E.Either;
declare module './HKT' {
    interface URI2HKT2<L, A> {
        TaskEither: TaskEither<L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "TaskEither";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface TaskEither<E, A> extends Task<Either<E, A>> {
}
/**
 * @since 2.0.0
 */
export declare const left: <E>(e: E) => TaskEither<E, never>;
/**
 * @since 2.0.0
 */
export declare const right: <A>(a: A) => TaskEither<never, A>;
/**
 * @since 2.0.0
 */
export declare function rightIO<A>(ma: IO<A>): TaskEither<never, A>;
/**
 * @since 2.0.0
 */
export declare function leftIO<E>(me: IO<E>): TaskEither<E, never>;
/**
 * @since 2.0.0
 */
export declare const rightTask: <A>(ma: Task<A>) => TaskEither<never, A>;
/**
 * @since 2.0.0
 */
export declare const leftTask: <E>(me: Task<E>) => TaskEither<E, never>;
/**
 * @since 2.0.0
 */
export declare const fromEither: <E, A>(ma: Either<E, A>) => TaskEither<E, A>;
/**
 * @since 2.0.0
 */
export declare function fromOption<E>(onNone: () => E): <A>(ma: Option<A>) => TaskEither<E, A>;
/**
 * @since 2.0.0
 */
export declare const fromIOEither: <E, A>(fa: IOEither<E, A>) => TaskEither<E, A>;
/**
 * @since 2.0.0
 */
export declare function fromPredicate<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => TaskEither<E, B>;
export declare function fromPredicate<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => TaskEither<E, A>;
/**
 * @since 2.0.0
 */
export declare function fold<E, A, R>(onLeft: (e: E) => Task<R>, onRight: (a: A) => Task<R>): (ma: TaskEither<E, A>) => Task<R>;
/**
 * @since 2.0.0
 */
export declare function getOrElse<E, A>(f: (e: E) => Task<A>): (ma: TaskEither<E, A>) => Task<A>;
/**
 * @since 2.0.0
 */
export declare function orElse<E, A, M>(f: (e: E) => TaskEither<M, A>): (ma: TaskEither<E, A>) => TaskEither<M, A>;
/**
 * @since 2.0.0
 */
export declare function filterOrElse<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: TaskEither<E, A>) => TaskEither<E, B>;
export declare function filterOrElse<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: TaskEither<E, A>) => TaskEither<E, A>;
/**
 * @since 2.0.0
 */
export declare const swap: <E, A>(ma: TaskEither<E, A>) => TaskEither<A, E>;
/**
 * @since 2.0.0
 */
export declare function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<TaskEither<E, A>>;
/**
 * @since 2.0.0
 */
export declare function tryCatch<E, A>(f: Lazy<Promise<A>>, onRejected: (reason: unknown) => E): TaskEither<E, A>;
/**
 * Make sure that a resource is cleaned up in the event of an exception. The
 * release action is called regardless of whether the body action throws or
 * returns.
 *
 * @since 2.0.0
 */
export declare function bracket<E, A, B>(acquire: TaskEither<E, A>, use: (a: A) => TaskEither<E, B>, release: (a: A, e: Either<E, B>) => TaskEither<E, void>): TaskEither<E, B>;
/**
 * Convert a node style callback function to one returning a `TaskEither`
 *
 * **Note**. If the function `f` admits multiple overloadings, `taskify` will pick last one. If you want a different
 * behaviour, add an explicit type annotation
 *
 * ```ts
 * // readFile admits multiple overloadings
 *
 * // const readFile: (a: string) => TaskEither<NodeJS.ErrnoException, Buffer>
 * const readFile = taskify(fs.readFile)
 *
 * const readFile2: (filename: string, encoding: string) => TaskEither<NodeJS.ErrnoException, Buffer> = taskify(
 *   fs.readFile
 * )
 * ```
 *
 * @example
 * import { taskify } from 'fp-ts/lib/TaskEither'
 * import * as fs from 'fs'
 *
 * // const stat: (a: string | Buffer) => TaskEither<NodeJS.ErrnoException, fs.Stats>
 * const stat = taskify(fs.stat)
 * assert.strictEqual(stat.length, 0)
 *
 *
 * @since 2.0.0
 */
export declare function taskify<L, R>(f: (cb: (e: L | null | undefined, r?: R) => void) => void): () => TaskEither<L, R>;
export declare function taskify<A, L, R>(f: (a: A, cb: (e: L | null | undefined, r?: R) => void) => void): (a: A) => TaskEither<L, R>;
export declare function taskify<A, B, L, R>(f: (a: A, b: B, cb: (e: L | null | undefined, r?: R) => void) => void): (a: A, b: B) => TaskEither<L, R>;
export declare function taskify<A, B, C, L, R>(f: (a: A, b: B, c: C, cb: (e: L | null | undefined, r?: R) => void) => void): (a: A, b: B, c: C) => TaskEither<L, R>;
export declare function taskify<A, B, C, D, L, R>(f: (a: A, b: B, c: C, d: D, cb: (e: L | null | undefined, r?: R) => void) => void): (a: A, b: B, c: C, d: D) => TaskEither<L, R>;
export declare function taskify<A, B, C, D, E, L, R>(f: (a: A, b: B, c: C, d: D, e: E, cb: (e: L | null | undefined, r?: R) => void) => void): (a: A, b: B, c: C, d: D, e: E) => TaskEither<L, R>;
/**
 * @since 2.0.0
 */
export declare function getTaskValidation<E>(S: Semigroup<E>): Monad2C<URI, E> & Alt2C<URI, E>;
/**
 * @since 2.0.0
 */
export declare const taskEither: Monad2<URI> & Bifunctor2<URI> & Alt2<URI> & MonadIO2<URI> & MonadTask2<URI>;
/**
 * Like `TaskEither` but `ap` is sequential
 *
 * @since 2.0.0
 */
export declare const taskEitherSeq: typeof taskEither;
declare const alt: <L, A>(that: () => TaskEither<L, A>) => (fa: TaskEither<L, A>) => TaskEither<L, A>, ap: <L, A>(fa: TaskEither<L, A>) => <B>(fab: TaskEither<L, (a: A) => B>) => TaskEither<L, B>, apFirst: <L, B>(fb: TaskEither<L, B>) => <A>(fa: TaskEither<L, A>) => TaskEither<L, A>, apSecond: <L, B>(fb: TaskEither<L, B>) => <A>(fa: TaskEither<L, A>) => TaskEither<L, B>, bimap: <L, A, M, B>(f: (l: L) => M, g: (a: A) => B) => (fa: TaskEither<L, A>) => TaskEither<M, B>, chain: <L, A, B>(f: (a: A) => TaskEither<L, B>) => (ma: TaskEither<L, A>) => TaskEither<L, B>, chainFirst: <L, A, B>(f: (a: A) => TaskEither<L, B>) => (ma: TaskEither<L, A>) => TaskEither<L, A>, flatten: <L, A>(mma: TaskEither<L, TaskEither<L, A>>) => TaskEither<L, A>, map: <A, B>(f: (a: A) => B) => <L>(fa: TaskEither<L, A>) => TaskEither<L, B>, mapLeft: <L, A, M>(f: (l: L) => M) => (fa: TaskEither<L, A>) => TaskEither<M, A>;
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, flatten, map, mapLeft };
