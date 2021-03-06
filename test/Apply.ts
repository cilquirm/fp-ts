import * as assert from 'assert'
import { applyFirst, applySecond, liftA2, liftA3, liftA4, sequenceT, sequenceS } from '../src/Apply'
import { either, left, right } from '../src/Either'
import { none, option, some, isSome, isNone } from '../src/Option'
import * as fc from 'fast-check'
import { getSome } from './property-test/Option'
import { nonEmptyArray } from './property-test/NonEmptyArray2v'
import { catOptions, getEq } from '../src/Array'
import { fromEquals } from '../src/Eq'

describe('Apply', () => {
  const r1 = right<string, number>(1)
  const r2 = right<string, number>(2)
  const foo = left<string, number>('foo')
  const bar = left<string, number>('bar')

  it('applyFirst', () => {
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(option)(some(5), some(6)), some(5))
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(option)(some(5), none), none)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(option)(none, some(6)), none)

    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(either)(r1, r2), r1)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(either)(foo, r1), foo)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(either)(r1, foo), foo)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applyFirst(either)(foo, bar), foo)
  })

  it('applySecond', () => {
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(option)(some(5), some(6)), some(6))
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(option)(some(5), none), none)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(option)(none, some(6)), none)

    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(either)(r1, r2), r2)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(either)(foo, r1), foo)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(either)(r1, foo), foo)
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(applySecond(either)(foo, bar), foo)
  })

  it('liftA2', () => {
    const f = (a: number) => (b: number) => a + b
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(liftA2(option)(f)(some(2))(some(3)), some(5))
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(liftA2(either)(f)(r2)(right(3)), right(5))
  })

  it('liftA3', () => {
    const f = (a: number) => (b: number) => (c: number) => a + b + c
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(liftA3(option)(f)(some(2))(some(3))(some(4)), some(9))
    // tslint:disable-next-line: deprecation
    assert.deepStrictEqual(liftA3(either)(f)(r2)(right(3))(right(4)), right(9))
  })

  it('liftA4', () => {
    const f = (a: number) => (b: number) => (c: number) => (d: number) => a + b + c + d
    // tslint:disable-next-line: deprecation
    const optionf = liftA4(option)(f)
    assert.deepStrictEqual(optionf(some(2))(some(3))(some(4))(some(5)), some(14))
    // tslint:disable-next-line: deprecation
    const eitherf = liftA4(either)(f)
    assert.deepStrictEqual(eitherf(r2)(right(3))(right(4))(right(5)), right(14))
  })

  it('ap_', () => {
    const f = (a: number) => (b: number) => a + b
    assert.deepStrictEqual(
      option
        .of(f)
        .ap_(some(2))
        .ap_(some(3)),
      some(5)
    )
  })

  it('sequenceT', () => {
    const sequenceTOption = sequenceT(option)
    assert.deepStrictEqual(sequenceTOption(some(1)), some([1]))
    assert.deepStrictEqual(sequenceTOption(some(1), some('2')), some([1, '2']))
    assert.deepStrictEqual(sequenceTOption(some(1), some('2'), none), none)

    const E = getEq(fromEquals((x, y) => x === y))
    const somes = getSome(fc.oneof<string | number>(fc.string(), fc.integer()))
    const allSomesInput = nonEmptyArray(somes)
    const maybeNoneInput = nonEmptyArray(fc.oneof(fc.constant(none), somes))
    const input = fc.oneof(allSomesInput, maybeNoneInput)
    fc.assert(
      fc.property(input, options => {
        const x = sequenceTOption(...(options as any))
        return (
          // tslint:disable-next-line: deprecation
          (options.every(isSome) && x.isSome() && E.equals(x.value as any, catOptions(options))) ||
          (options.some(isNone) && x.isNone())
        )
      })
    )
  })

  it('sequenceS', () => {
    const adoOption = sequenceS(option)
    assert.deepStrictEqual(adoOption({ a: some(1) }), some({ a: 1 }))
    assert.deepStrictEqual(adoOption({ a: some(1), b: some(2) }), some({ a: 1, b: 2 }))
    assert.deepStrictEqual(adoOption({ a: some(1), b: none }), none)

    const adoEither = sequenceS(either)
    assert.deepStrictEqual(adoEither({ a: right(1) }), right({ a: 1 }))
    assert.deepStrictEqual(adoEither({ a: right(1), b: right(2) }), right({ a: 1, b: 2 }))
    assert.deepStrictEqual(adoEither({ a: right(1), b: left('error') }), left('error'))
  })
})
