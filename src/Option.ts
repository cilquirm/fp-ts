/**
 * @file If you have worked with JavaScript at all in the past, it is very likely that you have come across a `TypeError` at
 * some time (other languages will throw similarly named errors in such a case). Usually this happens because some
 * method returns `null` or `undefined` when you were not expecting it and thus not dealing with that possibility in
 * your client code.
 *
 * ```ts
 * const as: Array<string> = []
 * as[0].trim() // throws TypeError: Cannot read property 'trim' of undefined
 * ```
 *
 * fp-ts models the absence of values through the `Option` datatype similar to how Scala, Haskell and other FP languages
 * handle optional values. A value of `null` or `undefined` is often abused to represent an absent optional value.
 *
 * `Option<A>` is a container for an optional value of type `A`. If the value of type `A` is present, the `Option<A>` is
 * an instance of `Some<A>`, containing the present value of type `A`. If the value is absent, the `Option<A>` is an
 * instance of `None<A>`.
 *
 * An option could be looked at as a collection or foldable structure with either one or zero elements.
 * Another way to look at option is: it represents the effect of a possibly failing computation.
 *
 * ```ts
 * import { Option, some, none } from 'fp-ts/lib/Option'
 *
 * const someValue: Option<string> = some('foo')
 * const emptyValue: Option<string> = none
 * ```
 *
 * Let's write a function that may or not give us a string, thus returning `Option<string>`
 *
 *
 * ```ts
 * const head = (as: Array<string>): Option<string> => {
 *   return as.length > 0 ? some(as[0]) : none
 * }
 * ```
 *
 * Using `getOrElse` we can provide a default value `"No value"` when the optional argument `None` does not exist:
 *
 * ```ts
 * const value1 = head(['foo', 'bar']) // some('foo)
 * const value2 = head([]) // none
 * value1.getOrElse('No value') // 'foo'
 * value2.getOrElse('No value') // 'No value'
 * ```
 *
 * Checking whether option has value:
 *
 * ```ts
 * value1.isNone() // false
 * value2.isNone() // true
 * ```
 *
 * We can pattern match using the `fold` method
 *
 * ```ts
 * const number: Option<number> = some(3)
 * const noNumber: Option<number> = none
 * number.fold(1, n => n * 3) // 9
 * noNumber.fold(1, n => n * 3) // 1
 * ```
 *
 * You can chain several possibly failing computations using the `chain` method
 *
 * ```ts
 * const inverse = (n: number): Option<number> => {
 *   return n === 0 ? none : some(1 / n)
 * }
 *
 * number.chain(inverse) // 1/3
 * noNumber.chain(inverse) // none
 * some(0).chain(inverse) // none
 * ```
 *
 * Computing over independent values
 *
 * ```ts
 * const sum = (a: number) => (b: number): number => a + b
 * const sumLifted = (oa: Option<number>, ob: Option<number>): Option<number> => ob.ap(oa.map(sum))
 * sumLifted(some(1), some(2)) // some(3)
 * sumLifted(some(1), none) // none
 * ```
 */
import { Alternative1 } from './Alternative'
import { Applicative } from './Applicative'
import { Compactable1, Separated } from './Compactable'
import { Either } from './Either'
import { Extend1 } from './Extend'
import { Filterable1 } from './Filterable'
import { Foldable2v1 } from './Foldable2v'
import { identity, Lazy, Predicate, Refinement, toString } from './function'
import { HKT } from './HKT'
import { Monad1 } from './Monad'
import { getDualMonoid, Monoid } from './Monoid'
import { Ord, fromCompare } from './Ord'
import { Plus1 } from './Plus'
import { Semigroup } from './Semigroup'
import { Eq, fromEquals } from './Eq'
import { Traversable2v1 } from './Traversable2v'
import { Witherable1 } from './Witherable'
import { Show } from './Show'
import { pipeable } from './pipeable'
import { MonadThrow1 } from './MonadThrow'

declare module './HKT' {
  interface URItoKind<A> {
    Option: Option<A>
  }
}

export const URI = 'Option'

export type URI = typeof URI

/**
 * @since 1.0.0
 */
export type Option<A> = None<A> | Some<A>

export class None<A> {
  static value: Option<never> = new None()
  readonly _tag: 'None' = 'None'
  readonly _A!: A
  readonly _URI!: URI
  private constructor() {}
  /**
   * Takes a function `f` and an `Option` of `A`. Maps `f` either on `None` or `Some`, Option's data constructors. If it
   * maps on `Some` then it will apply the `f` on `Some`'s value, if it maps on `None` it will return `None`.
   *
   * @example
   * import { some } from 'fp-ts/lib/Option'
   *
   * assert.deepStrictEqual(some(1).map(n => n * 2), some(2))
   * @obsolete
   */
  map<B>(f: (a: A) => B): Option<B> {
    return none
  }

  /**
   * Maps `f` over this `Option`'s value. If the value returned from `f` is null or undefined, returns `None`
   *
   * @example
   * import { none, some } from 'fp-ts/lib/Option'
   *
   * interface Foo {
   *   bar?: {
   *     baz?: string
   *   }
   * }
   *
   * assert.deepStrictEqual(
   *   some<Foo>({ bar: { baz: 'quux' } })
   *     .mapNullable(foo => foo.bar)
   *     .mapNullable(bar => bar.baz),
   *   some('quux')
   * )
   * assert.deepStrictEqual(
   *   some<Foo>({ bar: {} })
   *     .mapNullable(foo => foo.bar)
   *     .mapNullable(bar => bar.baz),
   *   none
   * )
   * assert.deepStrictEqual(
   *   some<Foo>({})
   *     .mapNullable(foo => foo.bar)
   *     .mapNullable(bar => bar.baz),
   *   none
   * )
   * @obsolete
   */
  mapNullable<B>(f: (a: A) => B | null | undefined): Option<B> {
    return none
  }

  /**
   * `ap`, some may also call it "apply". Takes a function `fab` that is in the context of `Option`, and applies that
   * function to this `Option`'s value. If the `Option` calling `ap` is `none` it will return `none`.
   *
   * @example
   * import { some, none } from 'fp-ts/lib/Option'
   *
   * assert.deepStrictEqual(some(2).ap(some((x: number) => x + 1)), some(3))
   * assert.deepStrictEqual(none.ap(some((x: number) => x + 1)), none)
   * @obsolete
   */
  ap<B>(fab: Option<(a: A) => B>): Option<B> {
    return none
  }
  /**
   * Flipped version of `ap`
   *
   * @example
   * import { some, none } from 'fp-ts/lib/Option'
   *
   * assert.deepStrictEqual(some((x: number) => x + 1).ap_(some(2)), some(3))
   * assert.deepStrictEqual(none.ap_(some(2)), none)
   * @obsolete
   */
  ap_<B, C>(this: Option<(b: B) => C>, fb: Option<B>): Option<C> {
    return fb.ap(this)
  }
  /**
   * Returns the result of applying f to this `Option`'s value if this `Option` is nonempty. Returns `None` if this
   * `Option` is empty. Slightly different from `map` in that `f` is expected to return an `Option` (which could be
   * `None`)
   * @obsolete
   */
  chain<B>(f: (a: A) => Option<B>): Option<B> {
    return none
  }
  /** @obsolete */
  reduce<B>(b: B, f: (b: B, a: A) => B): B {
    return b
  }
  /**
   * `alt` short for alternative, takes another `Option`. If this `Option` is a `Some` type then it will be returned, if
   * it is a `None` then it will return the next `Some` if it exist. If both are `None` then it will return `none`.
   *
   * @example
   * import { Option, some, none } from 'fp-ts/lib/Option'
   *
   * assert.deepStrictEqual(some(2).alt(some(4)), some(2))
   * const fa: Option<number> = none
   * assert.deepStrictEqual(fa.alt(some(4)), some(4))
   * @obsolete
   */
  alt(fa: Option<A>): Option<A> {
    return fa
  }

  /**
   * Lazy version of `alt`
   *
   * @example
   * import { some } from 'fp-ts/lib/Option'
   *
   * assert.deepStrictEqual(some(1).orElse(() => some(2)), some(1))
   *
   * @since 1.6.0
   * @obsolete
   */
  orElse(fa: Lazy<Option<A>>): Option<A> {
    return fa()
  }

  /** @obsolete */
  extend<B>(f: (ea: Option<A>) => B): Option<B> {
    return none
  }
  /**
   * Applies a function to each case in the data structure
   *
   * @example
   * import { none, some } from 'fp-ts/lib/Option'
   *
   * assert.strictEqual(some(1).fold('none', a => `some: ${a}`), 'some: 1')
   * assert.strictEqual(none.fold('none', a => `some: ${a}`), 'none')
   * @obsolete
   */
  fold<B>(b: B, onSome: (a: A) => B): B {
    return b
  }
  /**
   * Lazy version of `fold`
   * @obsolete
   */
  foldL<B>(onNone: () => B, onSome: (a: A) => B): B {
    return onNone()
  }
  /**
   * Returns the value from this `Some` or the given argument if this is a `None`
   *
   * @example
   * import { Option, none, some } from 'fp-ts/lib/Option'
   *
   * assert.strictEqual(some(1).getOrElse(0), 1)
   * const fa: Option<number> = none
   * assert.strictEqual(fa.getOrElse(0), 0)
   * @obsolete
   */
  getOrElse(a: A): A {
    return a
  }
  /**
   * Lazy version of `getOrElse`
   * @obsolete
   */
  getOrElseL(f: () => A): A {
    return f()
  }
  /**
   * Returns the value from this `Some` or `null` if this is a `None`
   * @obsolete
   */
  toNullable(): A | null {
    return null
  }
  /**
   * Returns the value from this `Some` or `undefined` if this is a `None`
   * @obsolete
   */
  toUndefined(): A | undefined {
    return undefined
  }
  inspect(): string {
    return this.toString()
  }
  toString(): string {
    return 'none'
  }
  /**
   * Returns `true` if the option has an element that is equal (as determined by `S`) to `a`, `false` otherwise
   * @obsolete
   */
  contains(E: Eq<A>, a: A): boolean {
    return false
  }
  /**
   * Returns `true` if the option is `None`, `false` otherwise
   * @obsolete
   */
  isNone(): this is None<A> {
    return true
  }
  /**
   * Returns `true` if the option is an instance of `Some`, `false` otherwise
   * @obsolete
   */
  isSome(): this is Some<A> {
    return false
  }
  /**
   * Returns `true` if this option is non empty and the predicate `p` returns `true` when applied to this Option's value
   * @obsolete
   */
  exists(p: (a: A) => boolean): boolean {
    return false
  }
  /**
   * Returns this option if it is non empty and the predicate `p` return `true` when applied to this Option's value.
   * Otherwise returns `None`
   * @obsolete
   */
  filter<B extends A>(p: Refinement<A, B>): Option<B>
  filter(p: Predicate<A>): Option<A>
  filter(p: Predicate<A>): Option<A> {
    return none
  }
  /**
   * Use `filter` instead.
   * Returns this option refined as `Option<B>` if it is non empty and the `refinement` returns `true` when applied to
   * this Option's value. Otherwise returns `None`
   * @since 1.3.0
   * @deprecated
   */
  refine<B extends A>(refinement: Refinement<A, B>): Option<B> {
    return none
  }
}

/**
 * @since 1.0.0
 */
export const none: Option<never> = None.value

export class Some<A> {
  readonly _tag: 'Some' = 'Some'
  readonly _A!: A
  readonly _URI!: URI
  constructor(readonly value: A) {}
  map<B>(f: (a: A) => B): Option<B> {
    return new Some(f(this.value))
  }

  mapNullable<B>(f: (a: A) => B | null | undefined): Option<B> {
    return fromNullable(f(this.value))
  }
  ap<B>(fab: Option<(a: A) => B>): Option<B> {
    return fab.isNone() ? none : new Some(fab.value(this.value))
  }
  ap_<B, C>(this: Option<(b: B) => C>, fb: Option<B>): Option<C> {
    return fb.ap(this)
  }
  chain<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.value)
  }
  reduce<B>(b: B, f: (b: B, a: A) => B): B {
    return f(b, this.value)
  }
  alt(fa: Option<A>): Option<A> {
    return this
  }
  orElse(fa: Lazy<Option<A>>): Option<A> {
    return this
  }
  extend<B>(f: (ea: Option<A>) => B): Option<B> {
    return new Some(f(this))
  }
  fold<B>(b: B, onSome: (a: A) => B): B {
    return onSome(this.value)
  }
  foldL<B>(onNone: () => B, onSome: (a: A) => B): B {
    return onSome(this.value)
  }
  getOrElse(a: A): A {
    return this.value
  }
  getOrElseL(f: () => A): A {
    return this.value
  }
  toNullable(): A | null {
    return this.value
  }
  toUndefined(): A | undefined {
    return this.value
  }
  inspect(): string {
    return this.toString()
  }
  toString(): string {
    // tslint:disable-next-line: deprecation
    return `some(${toString(this.value)})`
  }
  contains(E: Eq<A>, a: A): boolean {
    return E.equals(this.value, a)
  }
  isNone(): this is None<A> {
    return false
  }
  isSome(): this is Some<A> {
    return true
  }
  exists(p: (a: A) => boolean): boolean {
    return p(this.value)
  }
  filter<B extends A>(p: Refinement<A, B>): Option<B>
  filter(p: Predicate<A>): Option<A>
  filter(p: Predicate<A>): Option<A> {
    return this.exists(p) ? this : none
  }
  refine<B extends A>(refinement: Refinement<A, B>): Option<B> {
    return this.filter(refinement)
  }
}

/**
 * @since 1.17.0
 */
export const getShow = <A>(S: Show<A>): Show<Option<A>> => {
  return {
    show: oa => oa.fold('none', a => `some(${S.show(a)})`)
  }
}

/**
 * Use `getEq`
 *
 * @since 1.0.0
 * @deprecated
 */
export const getSetoid: <A>(E: Eq<A>) => Eq<Option<A>> = getEq

/**
 * @example
 * import { none, some, getEq } from 'fp-ts/lib/Option'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * const S = getEq(eqNumber)
 * assert.strictEqual(S.equals(none, none), true)
 * assert.strictEqual(S.equals(none, some(1)), false)
 * assert.strictEqual(S.equals(some(1), none), false)
 * assert.strictEqual(S.equals(some(1), some(2)), false)
 * assert.strictEqual(S.equals(some(1), some(1)), true)
 *
 * @since 1.19.0
 */
export function getEq<A>(E: Eq<A>): Eq<Option<A>> {
  return fromEquals((x, y) => (x.isNone() ? y.isNone() : y.isNone() ? false : E.equals(x.value, y.value)))
}

/**
 * The `Ord` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Ord` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 *
 * @example
 * import { none, some, getOrd } from 'fp-ts/lib/Option'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * const O = getOrd(ordNumber)
 * assert.strictEqual(O.compare(none, none), 0)
 * assert.strictEqual(O.compare(none, some(1)), -1)
 * assert.strictEqual(O.compare(some(1), none), 1)
 * assert.strictEqual(O.compare(some(1), some(2)), -1)
 * assert.strictEqual(O.compare(some(1), some(1)), 0)
 *
 * @since 1.2.0
 */
export const getOrd = <A>(O: Ord<A>): Ord<Option<A>> => {
  return fromCompare((x, y) => (x.isSome() ? (y.isSome() ? O.compare(x.value, y.value) : 1) : -1))
}

/**
 * @since 1.0.0
 */
export const some = <A>(a: A): Option<A> => {
  return new Some(a)
}

/**
 * `Apply` semigroup
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | none               |
 * | none    | some(a) | none               |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getApplySemigroup, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const S = getApplySemigroup(semigroupSum)
 * assert.deepStrictEqual(S.concat(none, none), none)
 * assert.deepStrictEqual(S.concat(some(1), none), none)
 * assert.deepStrictEqual(S.concat(none, some(1)), none)
 * assert.deepStrictEqual(S.concat(some(1), some(2)), some(3))
 *
 * @since 1.7.0
 */
export const getApplySemigroup = <A>(S: Semigroup<A>): Semigroup<Option<A>> => {
  return {
    concat: (x, y) => (x.isSome() && y.isSome() ? some(S.concat(x.value, y.value)) : none)
  }
}

/**
 * @since 1.7.0
 */
export const getApplyMonoid = <A>(M: Monoid<A>): Monoid<Option<A>> => {
  return {
    ...getApplySemigroup(M),
    empty: some(M.empty)
  }
}

/**
 * Monoid returning the left-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(a)      |
 *
 * @example
 * import { getFirstMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getFirstMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(1))
 *
 * @since 1.0.0
 */
export const getFirstMonoid = <A = never>(): Monoid<Option<A>> => {
  return {
    concat: option.alt,
    empty: none
  }
}

/**
 * Monoid returning the right-most non-`None` value
 *
 * | x       | y       | concat(x, y) |
 * | ------- | ------- | ------------ |
 * | none    | none    | none         |
 * | some(a) | none    | some(a)      |
 * | none    | some(a) | some(a)      |
 * | some(a) | some(b) | some(b)      |
 *
 * @example
 * import { getLastMonoid, some, none } from 'fp-ts/lib/Option'
 *
 * const M = getLastMonoid<number>()
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(2))
 *
 * @since 1.0.0
 */
export const getLastMonoid = <A = never>(): Monoid<Option<A>> => {
  return getDualMonoid(getFirstMonoid())
}

/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * appended using the provided `Semigroup`
 *
 * | x       | y       | concat(x, y)       |
 * | ------- | ------- | ------------------ |
 * | none    | none    | none               |
 * | some(a) | none    | some(a)            |
 * | none    | some(a) | some(a)            |
 * | some(a) | some(b) | some(concat(a, b)) |
 *
 * @example
 * import { getMonoid, some, none } from 'fp-ts/lib/Option'
 * import { semigroupSum } from 'fp-ts/lib/Semigroup'
 *
 * const M = getMonoid(semigroupSum)
 * assert.deepStrictEqual(M.concat(none, none), none)
 * assert.deepStrictEqual(M.concat(some(1), none), some(1))
 * assert.deepStrictEqual(M.concat(none, some(1)), some(1))
 * assert.deepStrictEqual(M.concat(some(1), some(2)), some(3))
 *
 * @since 1.0.0
 */
export const getMonoid = <A>(S: Semigroup<A>): Monoid<Option<A>> => {
  return {
    concat: (x, y) => (x.isNone() ? y : y.isNone() ? x : some(S.concat(x.value, y.value))),
    empty: none
  }
}

/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromNullable } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @since 1.0.0
 */
export const fromNullable = <A>(a: A | null | undefined): Option<A> => {
  return a == null ? none : new Some(a)
}

/**
 * @example
 * import { none, some, fromPredicate } from 'fp-ts/lib/Option'
 *
 * const positive = fromPredicate((n: number) => n >= 0)
 *
 * assert.deepStrictEqual(positive(-1), none)
 * assert.deepStrictEqual(positive(1), some(1))
 *
 * @since 1.0.0
 */
export function fromPredicate<A, B extends A>(predicate: Refinement<A, B>): (a: A) => Option<B>
export function fromPredicate<A>(predicate: Predicate<A>): (a: A) => Option<A>
export function fromPredicate<A>(predicate: Predicate<A>): (a: A) => Option<A> {
  return a => (predicate(a) ? some(a) : none)
}

/**
 * Transforms an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in
 * `Some`
 *
 * @example
 * import { none, some, tryCatch } from 'fp-ts/lib/Option'
 *
 * assert.deepStrictEqual(
 *   tryCatch(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(tryCatch(() => 1), some(1))
 *
 * @since 1.0.0
 */
export const tryCatch = <A>(f: Lazy<A>): Option<A> => {
  try {
    return some(f())
  } catch (e) {
    return none
  }
}

/**
 * Constructs a new `Option` from a `Either`. If the value is a `Left`, returns `None`, otherwise returns the inner
 * value wrapped in a `Some`
 *
 * @example
 * import { none, some, fromEither } from 'fp-ts/lib/Option'
 * import { left, right } from 'fp-ts/lib/Either'
 *
 * assert.deepStrictEqual(fromEither(left(1)), none)
 * assert.deepStrictEqual(fromEither(right(1)), some(1))
 *
 * @since 1.0.0
 */
export const fromEither = <L, A>(fa: Either<L, A>): Option<A> => {
  return fa.isLeft() ? none : some(fa.value)
}

/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise
 *
 * @since 1.0.0
 */
export const isSome = <A>(fa: Option<A>): fa is Some<A> => {
  return fa.isSome()
}

/**
 * Returns `true` if the option is `None`, `false` otherwise
 *
 * @since 1.0.0
 */
export const isNone = <A>(fa: Option<A>): fa is None<A> => {
  return fa.isNone()
}

/**
 * Use `fromPredicate` instead.
 * Refinement version of `fromPredicate`
 *
 * @since 1.3.0
 * @deprecated
 */
export const fromRefinement = <A, B extends A>(refinement: Refinement<A, B>) => (a: A): Option<B> => {
  return refinement(a) ? some(a) : none
}

/**
 * Returns a refinement from a prism.
 * This function ensures that a custom type guard definition is type-safe.
 *
 * ```ts
 * import { some, none, getRefinement } from 'fp-ts/lib/Option'
 *
 * type A = { type: 'A' }
 * type B = { type: 'B' }
 * type C = A | B
 *
 * const isA = (c: C): c is A => c.type === 'B' // <= typo but typescript doesn't complain
 * const isA = getRefinement<C, A>(c => (c.type === 'B' ? some(c) : none)) // static error: Type '"B"' is not assignable to type '"A"'
 * ```
 *
 * @since 1.7.0
 */
export const getRefinement = <A, B extends A>(getOption: (a: A) => Option<B>): Refinement<A, B> => {
  return (a: A): a is B => getOption(a).isSome()
}

const defaultSeparate = { left: none, right: none }

/**
 * @since 1.0.0
 */
export const option: Monad1<URI> &
  Foldable2v1<URI> &
  Plus1<URI> &
  Traversable2v1<URI> &
  Alternative1<URI> &
  Extend1<URI> &
  Compactable1<URI> &
  Filterable1<URI> &
  Witherable1<URI> &
  MonadThrow1<URI> = {
  URI,
  map: (ma, f) => (isNone(ma) ? none : some(f(ma.value))),
  of: some,
  ap: (mab, ma) => (isNone(mab) ? none : isNone(ma) ? none : some(mab.value(ma.value))),
  chain: (ma, f) => (isNone(ma) ? none : f(ma.value)),
  reduce: (fa, b, f) => (isNone(fa) ? b : f(b, fa.value)),
  foldMap: M => (fa, f) => (isNone(fa) ? M.empty : f(fa.value)),
  foldr: (fa, b, f) => (isNone(fa) ? b : f(fa.value, b)),
  traverse: <F>(F: Applicative<F>) => <A, B>(ta: Option<A>, f: (a: A) => HKT<F, B>): HKT<F, Option<B>> => {
    return isNone(ta) ? F.of(none) : F.map(f(ta.value), some)
  },
  sequence: <F>(F: Applicative<F>) => <A>(ta: Option<HKT<F, A>>): HKT<F, Option<A>> => {
    return isNone(ta) ? F.of(none) : F.map(ta.value, some)
  },
  zero: () => none,
  alt: (mx, my) => (isNone(mx) ? my : mx),
  extend: (wa, f) => (isNone(wa) ? none : some(f(wa))),
  compact: ma => option.chain(ma, identity),
  separate: <RL, RR>(ma: Option<Either<RL, RR>>): Separated<Option<RL>, Option<RR>> => {
    const o = option.map(ma, e => ({
      left: getLeft(e),
      right: getRight(e)
    }))
    return isNone(o) ? defaultSeparate : o.value
  },
  filter: <A>(fa: Option<A>, predicate: Predicate<A>): Option<A> => {
    return isNone(fa) ? none : predicate(fa.value) ? fa : none
  },
  filterMap: (ma, f) => (isNone(ma) ? none : f(ma.value)),
  partition: <A>(fa: Option<A>, predicate: Predicate<A>): Separated<Option<A>, Option<A>> => {
    return {
      left: option.filter(fa, a => !predicate(a)),
      right: option.filter(fa, predicate)
    }
  },
  partitionMap: (fa, f) => option.separate(option.map(fa, f)),
  wither: <F>(F: Applicative<F>) => <A, B>(fa: Option<A>, f: (a: A) => HKT<F, Option<B>>): HKT<F, Option<B>> =>
    isNone(fa) ? F.of(none) : f(fa.value),
  wilt: <F>(F: Applicative<F>) => <RL, RR, A>(
    fa: Option<A>,
    f: (a: A) => HKT<F, Either<RL, RR>>
  ): HKT<F, Separated<Option<RL>, Option<RR>>> => {
    const o = option.map(fa, a =>
      F.map(f(a), e => ({
        left: getLeft(e),
        right: getRight(e)
      }))
    )
    return isNone(o)
      ? F.of({
          left: none,
          right: none
        })
      : o.value
  },
  throwError: () => none,
  fromEither,
  fromOption: identity
}

//
// backporting
//

/**
 * Returns an `L` value if possible
 *
 * @since 1.19.0
 */
export function getLeft<L, A>(ma: Either<L, A>): Option<L> {
  return ma._tag === 'Right' ? none : some(ma.value)
}

/**
 * Returns an `A` value if possible
 *
 * @since 1.19.0
 */
export function getRight<L, A>(ma: Either<L, A>): Option<A> {
  return ma._tag === 'Left' ? none : some(ma.value)
}

/**
 * @since 1.19.0
 */
export function fold<A, R>(onNone: () => R, onSome: (a: A) => R): (ma: Option<A>) => R {
  return ma => ma.foldL(onNone, onSome)
}

/**
 * @since 1.19.0
 */
export function toNullable<A>(ma: Option<A>): A | null {
  return ma.toNullable()
}

/**
 * @since 1.19.0
 */
export function toUndefined<A>(ma: Option<A>): A | undefined {
  return ma.toUndefined()
}

/**
 * @since 1.19.0
 */
export function getOrElse<A>(f: () => A): (ma: Option<A>) => A {
  return ma => ma.getOrElseL(f)
}

/**
 * @since 1.19.0
 */
export function elem<A>(E: Eq<A>): (a: A) => (ma: Option<A>) => boolean {
  return a => ma => ma.contains(E, a)
}

/**
 * @since 1.19.0
 */
export function exists<A>(predicate: Predicate<A>): (ma: Option<A>) => boolean {
  return ma => ma.exists(predicate)
}

/**
 * @since 1.19.0
 */
export function mapNullable<A, B>(f: (a: A) => B | null | undefined): (ma: Option<A>) => Option<B> {
  return ma => ma.mapNullable(f)
}

const {
  alt,
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  duplicate,
  extend,
  filter,
  filterMap,
  flatten,
  foldMap,
  map,
  partition,
  partitionMap,
  reduce,
  reduceRight,
  compact,
  separate
} = pipeable(option)

export {
  alt,
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  duplicate,
  extend,
  filter,
  filterMap,
  flatten,
  foldMap,
  map,
  partition,
  partitionMap,
  reduce,
  reduceRight,
  compact,
  separate
}
