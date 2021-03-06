/**
 * @file Data structure which represents non-empty arrays
 */
import * as A from './Array'
import { Comonad1 } from './Comonad'
import { FoldableWithIndex1 } from './FoldableWithIndex'
import { compose, Predicate, Refinement } from './function'
import { FunctorWithIndex1 } from './FunctorWithIndex'
import { Monad1 } from './Monad'
import { none, Option, some } from './Option'
import { Ord } from './Ord'
import { getJoinSemigroup, getMeetSemigroup, Semigroup } from './Semigroup'
import { Eq } from './Eq'
import { Show } from './Show'
import { TraversableWithIndex1 } from './TraversableWithIndex'
import { pipeable } from './pipeable'

declare module './HKT' {
  interface URItoKind<A> {
    NonEmptyArray2v: NonEmptyArray<A>
  }
}

export const URI = 'NonEmptyArray2v'

export type URI = typeof URI

/**
 * @since 1.15.0
 */
export interface NonEmptyArray<A> extends Array<A> {
  0: A
  map<B>(f: (a: A, index: number, nea: NonEmptyArray<A>) => B): NonEmptyArray<B>
  concat(as: Array<A>): NonEmptyArray<A>
}

/**
 * @since 1.17.0
 */
export const getShow = <A>(S: Show<A>): Show<NonEmptyArray<A>> => {
  const SA = A.getShow(S)
  return {
    show: arr => `make(${S.show(arr[0])}, ${SA.show(arr.slice(1))})`
  }
}

/**
 * Use `cons` instead
 *
 * @since 1.15.0
 * @deprecated
 */
export function make<A>(head: A, tail: Array<A>): NonEmptyArray<A> {
  return A.cons(head, tail)
}

/**
 * @since 1.15.0
 */
export function head<A>(nea: NonEmptyArray<A>): A {
  return nea[0]
}

/**
 * @since 1.15.0
 */
export function tail<A>(nea: NonEmptyArray<A>): Array<A> {
  return nea.slice(1)
}

/**
 * @since 1.17.3
 */
export const reverse: <A>(nea: NonEmptyArray<A>) => NonEmptyArray<A> = A.reverse as any

/**
 * @since 1.15.0
 */
export function min<A>(ord: Ord<A>): (nea: NonEmptyArray<A>) => A {
  const S = getMeetSemigroup(ord)
  return nea => nea.reduce(S.concat)
}

/**
 * @since 1.15.0
 */
export function max<A>(ord: Ord<A>): (nea: NonEmptyArray<A>) => A {
  const S = getJoinSemigroup(ord)
  return nea => nea.reduce(S.concat)
}

/**
 * Builds a `NonEmptyArray` from an `Array` returning `none` if `as` is an empty array
 *
 * @since 1.15.0
 */
export function fromArray<A>(as: Array<A>): Option<NonEmptyArray<A>> {
  return A.isNonEmpty(as) ? some(as) : none
}

/**
 * Builds a `NonEmptyArray` from a provably (compile time) non empty `Array`.
 *
 * @since 1.15.0
 */
export function fromNonEmptyArray<A>(as: Array<A> & { 0: A }): NonEmptyArray<A> {
  return as as any
}

/**
 * Builds a `Semigroup` instance for `NonEmptyArray`
 *
 * @since 1.15.0
 */
export const getSemigroup = <A = never>(): Semigroup<NonEmptyArray<A>> => {
  return {
    concat: (x, y) => x.concat(y)
  }
}

/**
 * Use `getEq`
 *
 * @since 1.15.0
 * @deprecated
 */
export const getSetoid: <A>(E: Eq<A>) => Eq<NonEmptyArray<A>> = getEq

/**
 * @example
 * import { fromNonEmptyArray, getEq, make } from 'fp-ts/lib/NonEmptyArray2v'
 * import { eqNumber } from 'fp-ts/lib/Eq'
 *
 * const S = getEq(eqNumber)
 * assert.strictEqual(S.equals(make(1, [2]), fromNonEmptyArray([1, 2])), true)
 * assert.strictEqual(S.equals(make(1, [2]), fromNonEmptyArray([1, 3])), false)
 *
 * @since 1.19.0
 */
export function getEq<A>(E: Eq<A>): Eq<NonEmptyArray<A>> {
  return A.getEq(E)
}

/**
 * Group equal, consecutive elements of an array into non empty arrays.
 *
 * @example
 * import { make, group } from 'fp-ts/lib/NonEmptyArray2v'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepStrictEqual(group(ordNumber)([1, 2, 1, 1]), [
 *   make(1, []),
 *   make(2, []),
 *   make(1, [1])
 * ])
 *
 * @since 1.15.0
 */
export const group = <A>(E: Eq<A>) => (as: Array<A>): Array<NonEmptyArray<A>> => {
  const len = as.length
  if (len === 0) {
    return A.empty
  }
  const r: Array<NonEmptyArray<A>> = []
  let head: A = as[0]
  let nea = fromNonEmptyArray([head])
  for (let i = 1; i < len; i++) {
    const x = as[i]
    if (E.equals(x, head)) {
      nea.push(x)
    } else {
      r.push(nea)
      head = x
      nea = fromNonEmptyArray([head])
    }
  }
  r.push(nea)
  return r
}

/**
 * Sort and then group the elements of an array into non empty arrays.
 *
 * @example
 * import { make, groupSort } from 'fp-ts/lib/NonEmptyArray2v'
 * import { ordNumber } from 'fp-ts/lib/Ord'
 *
 * assert.deepStrictEqual(groupSort(ordNumber)([1, 2, 1, 1]), [make(1, [1, 1]), make(2, [])])
 *
 * @since 1.15.0
 */
export const groupSort = <A>(O: Ord<A>): ((as: Array<A>) => Array<NonEmptyArray<A>>) => {
  // tslint:disable-next-line: deprecation
  return compose(
    group(O),
    A.sort(O)
  )
}

function _groupBy<A>(as: Array<A>, f: (a: A) => string): { [key: string]: NonEmptyArray<A> } {
  const r: { [key: string]: NonEmptyArray<A> } = {}
  for (const a of as) {
    const k = f(a)
    if (r.hasOwnProperty(k)) {
      r[k].push(a)
    } else {
      r[k] = cons(a, [])
    }
  }
  return r
}

/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * import { cons, groupBy } from 'fp-ts/lib/NonEmptyArray2v'
 *
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['foo', 'bar', 'foobar']), {
 *   '3': cons('foo', ['bar']),
 *   '6': cons('foobar', [])
 * })
 *
 * @since 1.15.0
 */
export function groupBy<A>(f: (a: A) => string): (as: Array<A>) => { [key: string]: NonEmptyArray<A> }
/** @deprecated */
export function groupBy<A>(as: Array<A>, f: (a: A) => string): { [key: string]: NonEmptyArray<A> }
export function groupBy(...args: Array<any>): any {
  return args.length === 1 ? <A>(as: Array<A>) => _groupBy(as, args[0]) : _groupBy(args[0], args[1])
}

/**
 * @since 1.15.0
 */
export function last<A>(nea: NonEmptyArray<A>): A {
  return nea[nea.length - 1]
}

/**
 * @since 1.15.0
 */
export function sort<A>(O: Ord<A>): (nea: NonEmptyArray<A>) => NonEmptyArray<A> {
  return A.sort(O) as any
}

/**
 * Use `Array`'s `findFirst`
 *
 * @since 1.15.0
 * @deprecated
 */
export function findFirst<A, B extends A>(nea: NonEmptyArray<A>, refinement: Refinement<A, B>): Option<B>
export function findFirst<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<A>
export function findFirst<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<A> {
  // tslint:disable-next-line: deprecation
  return A.findFirst(nea, predicate)
}

/**
 * Use `Array`'s `findLast`
 *
 * @since 1.15.0
 * @deprecated
 */
export function findLast<A, B extends A>(nea: NonEmptyArray<A>, refinement: Refinement<A, B>): Option<B>
export function findLast<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<A>
export function findLast<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<A> {
  // tslint:disable-next-line: deprecation
  return A.findLast(nea, predicate)
}

/**
 * Use `Array`'s `findIndex`
 *
 * @since 1.15.0
 * @deprecated
 */
export function findIndex<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<number> {
  // tslint:disable-next-line: deprecation
  return A.findIndex(nea, predicate)
}

/**
 * Use `Array`'s `findLastIndex`
 *
 * @since 1.15.0
 * @deprecated
 */
export function findLastIndex<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<number> {
  // tslint:disable-next-line: deprecation
  return A.findLastIndex(nea, predicate)
}

function _insertAt<A>(i: number, a: A, nea: NonEmptyArray<A>): Option<NonEmptyArray<A>> {
  // tslint:disable-next-line: deprecation
  return A.insertAt(i, a, nea) as any
}

/**
 * @since 1.15.0
 */
export function insertAt<A>(i: number, a: A): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/** @deprecated */
export function insertAt<A>(i: number, a: A, nea: NonEmptyArray<A>): Option<NonEmptyArray<A>>
export function insertAt(...args: Array<any>): any {
  return args.length === 2
    ? <A>(nea: NonEmptyArray<A>) => _insertAt(args[0], args[1], nea)
    : _insertAt(args[0], args[1], args[2])
}

function _updateAt<A>(i: number, a: A, nea: NonEmptyArray<A>): Option<NonEmptyArray<A>> {
  // tslint:disable-next-line: deprecation
  return A.updateAt(i, a, nea) as any
}

/**
 * @since 1.15.0
 */
export function updateAt<A>(i: number, a: A): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/** @deprecated */
export function updateAt<A>(i: number, a: A, nea: NonEmptyArray<A>): Option<NonEmptyArray<A>>
export function updateAt(...args: Array<any>): any {
  return args.length === 2
    ? <A>(nea: NonEmptyArray<A>) => _updateAt(args[0], args[1], nea)
    : _updateAt(args[0], args[1], args[2])
}

function _modifyAt<A>(nea: NonEmptyArray<A>, i: number, f: (a: A) => A): Option<NonEmptyArray<A>> {
  // tslint:disable-next-line: deprecation
  return A.modifyAt(nea, i, f) as any
}

/**
 * @since 1.17.0
 */
export function modifyAt<A>(i: number, f: (a: A) => A): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/** @deprecated */
export function modifyAt<A>(nea: NonEmptyArray<A>, i: number, f: (a: A) => A): Option<NonEmptyArray<A>>
export function modifyAt(...args: Array<any>): any {
  return args.length === 2
    ? <A>(nea: NonEmptyArray<A>) => _modifyAt(nea, args[0], args[1])
    : _modifyAt(args[0], args[1], args[2])
}

/**
 * @since 1.17.0
 */
export const copy = <A>(nea: NonEmptyArray<A>): NonEmptyArray<A> => {
  return A.copy(nea) as any
}

function _filter<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<NonEmptyArray<A>> {
  // tslint:disable-next-line: deprecation
  return filterWithIndex(nea, (_, a) => predicate(a))
}

/**
 * @since 1.15.0
 */
export function filter<A, B extends A>(
  refinement: Refinement<A, B>
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
export function filter<A>(predicate: Predicate<A>): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/** @deprecated */
export function filter<A, B extends A>(nea: NonEmptyArray<A>, refinement: Refinement<A, B>): Option<NonEmptyArray<A>>
/** @deprecated */
export function filter<A>(nea: NonEmptyArray<A>, predicate: Predicate<A>): Option<NonEmptyArray<A>>
export function filter(...args: Array<any>): any {
  return args.length === 1 ? <A>(nea: NonEmptyArray<A>) => _filter(nea, args[0]) : _filter(args[0], args[1])
}

function _filterWithIndex<A>(nea: NonEmptyArray<A>, predicate: (i: number, a: A) => boolean): Option<NonEmptyArray<A>> {
  return fromArray(nea.filter((a, i) => predicate(i, a)))
}

/**
 * @since 1.15.0
 */
export function filterWithIndex<A>(
  predicate: (i: number, a: A) => boolean
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
/** @deprecated */
export function filterWithIndex<A>(
  nea: NonEmptyArray<A>,
  predicate: (i: number, a: A) => boolean
): Option<NonEmptyArray<A>>
export function filterWithIndex(...args: Array<any>): any {
  return args.length === 1
    ? <A>(nea: NonEmptyArray<A>) => _filterWithIndex(nea, args[0])
    : _filterWithIndex(args[0], args[1])
}

/**
 * Append an element to the end of an array, creating a new non empty array
 *
 * @example
 * import { snoc } from 'fp-ts/lib/NonEmptyArray2v'
 *
 * assert.deepStrictEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 *
 * @since 1.16.0
 */
export const snoc: <A>(as: Array<A>, a: A) => NonEmptyArray<A> = A.snoc

/**
 * Append an element to the front of an array, creating a new non empty array
 *
 * @example
 * import { cons } from 'fp-ts/lib/NonEmptyArray2v'
 *
 * assert.deepStrictEqual(cons(1, [2, 3, 4]), [1, 2, 3, 4])
 *
 * @since 1.16.0
 */
export const cons: <A>(a: A, as: Array<A>) => NonEmptyArray<A> = A.cons

/**
 * @since 1.15.0
 */
export const nonEmptyArray: Monad1<URI> &
  Comonad1<URI> &
  TraversableWithIndex1<URI, number> &
  FunctorWithIndex1<URI, number> &
  FoldableWithIndex1<URI, number> = {
  URI,
  map: A.array.map as any,
  mapWithIndex: A.array.mapWithIndex as any,
  of: A.array.of as any,
  ap: A.array.ap as any,
  chain: A.array.chain as any,
  extend: A.array.extend as any,
  extract: head,
  reduce: A.array.reduce,
  foldMap: A.array.foldMap,
  foldr: A.array.foldr,
  traverse: A.array.traverse as any,
  sequence: A.array.sequence as any,
  reduceWithIndex: A.array.reduceWithIndex,
  foldMapWithIndex: A.array.foldMapWithIndex,
  foldrWithIndex: A.array.foldrWithIndex,
  traverseWithIndex: A.array.traverseWithIndex as any
}

//
// backporting
//

/**
 * @since 1.19.0
 */
export const of: <A>(a: A) => NonEmptyArray<A> = A.array.of as any

const {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  duplicate,
  extend,
  flatten,
  foldMap,
  foldMapWithIndex,
  map,
  mapWithIndex,
  reduce,
  reduceRight,
  reduceRightWithIndex,
  reduceWithIndex
} = pipeable(nonEmptyArray)

export {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  duplicate,
  extend,
  flatten,
  foldMap,
  foldMapWithIndex,
  map,
  mapWithIndex,
  reduce,
  reduceRight,
  reduceRightWithIndex,
  reduceWithIndex
}
