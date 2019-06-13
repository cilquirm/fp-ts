"use strict";
/**
 * @file The `Eq` type class represents types which support decidable equality.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Reflexivity: `E.equals(a, a) === true`
 * 2. Symmetry: `E.equals(a, b) === E.equals(b, a)`
 * 3. Transitivity: if `E.equals(a, b) === true` and `E.equals(b, c) === true`, then `E.equals(a, c) === true`
 *
 * See [Getting started with fp-ts: Eq](https://dev.to/gcanti/getting-started-with-fp-ts-eq-39f3)
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 2.0.0
 */
function fromEquals(equals) {
    return {
        equals: function (x, y) { return x === y || equals(x, y); }
    };
}
exports.fromEquals = fromEquals;
/**
 * @since 2.0.0
 */
function strictEqual(a, b) {
    return a === b;
}
exports.strictEqual = strictEqual;
var eqStrict = { equals: strictEqual };
/**
 * @since 2.0.0
 */
exports.eqString = eqStrict;
/**
 * @since 2.0.0
 */
exports.eqNumber = eqStrict;
/**
 * @since 2.0.0
 */
exports.eqBoolean = eqStrict;
/**
 * @since 2.0.0
 */
function getStructEq(eqs) {
    return fromEquals(function (x, y) {
        for (var k in eqs) {
            if (!eqs[k].equals(x[k], y[k])) {
                return false;
            }
        }
        return true;
    });
}
exports.getStructEq = getStructEq;
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { getTupleEq, eqString, eqNumber, eqBoolean } from 'fp-ts/lib/Eq'
 *
 * const E = getTupleEq(eqString, eqNumber, eqBoolean)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @since 2.0.0
 */
function getTupleEq() {
    var eqs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eqs[_i] = arguments[_i];
    }
    return fromEquals(function (x, y) { return eqs.every(function (E, i) { return E.equals(x[i], y[i]); }); });
}
exports.getTupleEq = getTupleEq;
/**
 * Returns the `Eq` corresponding to the partitions of `B` induced by `f`
 *
 * @since 2.0.0
 */
function contramap(E, f) {
    return fromEquals(function (x, y) { return E.equals(f(x), f(y)); });
}
exports.contramap = contramap;
/**
 * @since 2.0.0
 */
exports.eqDate = contramap(exports.eqNumber, function (date) { return date.valueOf(); });
