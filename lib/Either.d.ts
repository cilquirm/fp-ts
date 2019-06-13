/**
 * @file Represents a value of one of two possible types (a disjoint union).
 *
 * An instance of `Either` is either an instance of `Left` or `Right`.
 *
 * A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
 * `None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
 * dictates that `Left` is used for failure and `Right` is used for success.
 *
 * For example, you could use `Either<string, number>` to detect whether a received input is a `string` or a `number`.
 *
 * ```ts
 * const parse = (errorMessage: string) => (input: string): Either<string, number> => {
 *   const n = parseInt(input, 10)
 *   return isNaN(n) ? left(errorMessage) : right(n)
 * }
 * ```
 *
 * `Either` is right-biased, which means that `Right` is assumed to be the default case to operate on. If it is `Left`,
 * operations like `map`, `chain`, ... return the `Left` value unchanged:
 *
 * ```ts
 * import { either } from 'fp-ts/lib/Either'
 *
 * either.map(right(12), double) // right(24)
 * either.map(left(23), double)  // left(23)
 * ```
 */
import { Alt2, Alt2C } from './Alt';
import { Bifunctor2 } from './Bifunctor';
import { ChainRec2 } from './ChainRec';
import { Eq } from './Eq';
import { Extend2 } from './Extend';
import { Foldable2 } from './Foldable';
import { Lazy, Predicate, Refinement } from './function';
import { Monad2, Monad2C } from './Monad';
import { Monoid } from './Monoid';
import { Option } from './Option';
import { Semigroup } from './Semigroup';
import { Show } from './Show';
import { Traversable2 } from './Traversable';
import { Witherable2C } from './Witherable';
declare module './HKT' {
    interface URI2HKT2<L, A> {
        Either: Either<L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "Either";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export interface Left<E> {
    readonly _tag: 'Left';
    readonly left: E;
}
/**
 * @since 2.0.0
 */
export interface Right<A> {
    readonly _tag: 'Right';
    readonly right: A;
}
/**
 * @since 2.0.0
 */
export declare type Either<E, A> = Left<E> | Right<A>;
/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure
 *
 * @since 2.0.0
 */
export declare function left<E>(e: E): Either<E, never>;
/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure
 *
 * @since 2.0.0
 */
export declare function right<A>(a: A): Either<never, A>;
/**
 * @since 2.0.0
 */
export declare function fromOption<E>(onNone: () => E): <A>(ma: Option<A>) => Either<E, A>;
/**
 * @since 2.0.0
 */
export declare function fromPredicate<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => Either<E, B>;
export declare function fromPredicate<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => Either<E, A>;
/**
 * Takes a default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`
 *
 * @since 2.0.0
 */
export declare function fromNullable<E>(e: E): <A>(a: A | null | undefined) => Either<E, A>;
/**
 * Default value for the `onError` argument of `tryCatch`
 *
 * @since 2.0.0
 */
export declare function toError(e: unknown): Error;
/**
 * Constructs a new `Either` from a function that might throw
 *
 * @example
 * import { Either, left, right, tryCatch } from 'fp-ts/lib/Either'
 *
 * const unsafeHead = <A>(as: Array<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: Array<A>): Either<Error, A> => {
 *   return tryCatch(() => unsafeHead(as), e => (e instanceof Error ? e : new Error('unknown error')))
 * }
 *
 * assert.deepStrictEqual(head([]), left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), right(1))
 *
 * @since 2.0.0
 */
export declare function tryCatch<E, A>(f: Lazy<A>, onError: (e: unknown) => E): Either<E, A>;
/**
 * @since 2.0.0
 */
export declare function fold<E, A, R>(onLeft: (e: E) => R, onRight: (a: A) => R): (ma: Either<E, A>) => R;
/**
 * @since 2.0.0
 */
export declare function getShow<E, A>(SE: Show<E>, SA: Show<A>): Show<Either<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getEq<E, A>(EL: Eq<E>, EA: Eq<A>): Eq<Either<E, A>>;
/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * @example
 * import { getSemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getSemigroup<string, number>(semigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), right(2))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), right(1))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 *
 * @since 2.0.0
 */
export declare function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<Either<E, A>>;
/**
 * `Apply` semigroup
 *
 * @example
 * import { getApplySemigroup, left, right } from 'fp-ts/lib/Either'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup<string, number>(semigroupSum)
 * assert.deepStrictEqual(S.concat(left('a'), left('b')), left('a'))
 * assert.deepStrictEqual(S.concat(left('a'), right(2)), left('a'))
 * assert.deepStrictEqual(S.concat(right(1), left('b')), left('b'))
 * assert.deepStrictEqual(S.concat(right(1), right(2)), right(3))
 *
 *
 * @since 2.0.0
 */
export declare function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<Either<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<Either<E, A>>;
/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise
 *
 * @since 2.0.0
 */
export declare function isLeft<E, A>(ma: Either<E, A>): ma is Left<E>;
/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise
 *
 * @since 2.0.0
 */
export declare function isRight<E, A>(ma: Either<E, A>): ma is Right<A>;
/**
 * @since 2.0.0
 */
export declare function swap<E, A>(ma: Either<E, A>): Either<A, E>;
/**
 * @since 2.0.0
 */
export declare function orElse<E, A, M>(f: (e: E) => Either<M, A>): (ma: Either<E, A>) => Either<M, A>;
/**
 * @since 2.0.0
 */
export declare function getOrElse<E, A>(f: (e: E) => A): (ma: Either<E, A>) => A;
/**
 * @since 2.0.0
 */
export declare function elem<A>(E: Eq<A>): <E>(a: A, ma: Either<E, A>) => boolean;
/**
 * @since 2.0.0
 */
export declare function filterOrElse<E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: Either<E, A>) => Either<E, B>;
export declare function filterOrElse<E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: Either<E, A>) => Either<E, A>;
/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 *
 * @example
 * import { parseJSON, toError, right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(parseJSON('{"a":1}', toError), right({ a: 1 }))
 * assert.deepStrictEqual(parseJSON('{"a":}', toError), left(new SyntaxError('Unexpected token } in JSON at position 5')))
 *
 * @since 2.0.0
 */
export declare function parseJSON<E>(s: string, onError: (reason: unknown) => E): Either<E, unknown>;
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 *
 * @example
 * import { stringifyJSON, toError, right, left } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(stringifyJSON({ a: 1 }, toError), right('{"a":1}'))
 * const circular: any = { ref: null }
 * circular.ref = circular
 * assert.deepStrictEqual(stringifyJSON(circular, toError), left(new TypeError('Converting circular structure to JSON')))
 *
 * @since 2.0.0
 */
export declare function stringifyJSON<E>(u: unknown, onError: (reason: unknown) => E): Either<E, string>;
/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @since 2.0.0
 */
export declare function getWitherable<E>(M: Monoid<E>): Witherable2C<URI, E>;
/**
 * @since 2.0.0
 */
export declare function getValidation<E>(S: Semigroup<E>): Monad2C<URI, E> & Alt2C<URI, E>;
/**
 * @since 2.0.0
 */
export declare function getValidationSemigroup<E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Semigroup<Either<E, A>>;
/**
 * @since 2.0.0
 */
export declare function getValidationMonoid<E, A>(SE: Semigroup<E>, SA: Monoid<A>): Monoid<Either<E, A>>;
/**
 * @since 2.0.0
 */
export declare const either: Monad2<URI> & Foldable2<URI> & Traversable2<URI> & Bifunctor2<URI> & Alt2<URI> & Extend2<URI> & ChainRec2<URI>;
declare const alt: <L, A>(that: () => Either<L, A>) => (fa: Either<L, A>) => Either<L, A>, ap: <L, A>(fa: Either<L, A>) => <B>(fab: Either<L, (a: A) => B>) => Either<L, B>, apFirst: <L, B>(fb: Either<L, B>) => <A>(fa: Either<L, A>) => Either<L, A>, apSecond: <L, B>(fb: Either<L, B>) => <A>(fa: Either<L, A>) => Either<L, B>, bimap: <L, A, M, B>(f: (l: L) => M, g: (a: A) => B) => (fa: Either<L, A>) => Either<M, B>, chain: <L, A, B>(f: (a: A) => Either<L, B>) => (ma: Either<L, A>) => Either<L, B>, chainFirst: <L, A, B>(f: (a: A) => Either<L, B>) => (ma: Either<L, A>) => Either<L, A>, duplicate: <L, A>(ma: Either<L, A>) => Either<L, Either<L, A>>, extend: <L, A, B>(f: (fa: Either<L, A>) => B) => (ma: Either<L, A>) => Either<L, B>, flatten: <L, A>(mma: Either<L, Either<L, A>>) => Either<L, A>, foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <L>(fa: Either<L, A>) => M, map: <A, B>(f: (a: A) => B) => <L>(fa: Either<L, A>) => Either<L, B>, mapLeft: <L, A, M>(f: (l: L) => M) => (fa: Either<L, A>) => Either<M, A>, reduce: <A, B>(b: B, f: (b: B, a: A) => B) => <L>(fa: Either<L, A>) => B, reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => <L>(fa: Either<L, A>) => B;
export { alt, ap, apFirst, apSecond, bimap, chain, chainFirst, duplicate, extend, flatten, foldMap, map, mapLeft, reduce, reduceRight };
