"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipeable_1 = require("./pipeable");
var Reader_1 = require("./Reader");
var ReaderT_1 = require("./ReaderT");
var TE = require("./TaskEither");
var T = ReaderT_1.getReaderM(TE.taskEither);
/**
 * @since 2.0.0
 */
exports.URI = 'ReaderTaskEither';
/**
 * @since 2.0.0
 */
function run(ma, r) {
    return ma(r)();
}
exports.run = run;
/**
 * @since 2.0.0
 */
function left(e) {
    return exports.fromTaskEither(TE.left(e));
}
exports.left = left;
/**
 * @since 2.0.0
 */
exports.right = T.of;
/**
 * @since 2.0.0
 */
function rightTask(ma) {
    return exports.fromTaskEither(TE.rightTask(ma));
}
exports.rightTask = rightTask;
/**
 * @since 2.0.0
 */
function leftTask(me) {
    return exports.fromTaskEither(TE.leftTask(me));
}
exports.leftTask = leftTask;
/**
 * @since 2.0.0
 */
exports.fromTaskEither = T.fromM;
/**
 * @since 2.0.0
 */
exports.rightReader = T.fromReader;
/**
 * @since 2.0.0
 */
function leftReader(me) {
    return function (r) { return TE.left(me(r)); };
}
exports.leftReader = leftReader;
/**
 * @since 2.0.0
 */
function fromIOEither(ma) {
    return exports.fromTaskEither(TE.fromIOEither(ma));
}
exports.fromIOEither = fromIOEither;
/**
 * @since 2.0.0
 */
function fromReaderEither(ma) {
    return function (r) { return TE.fromEither(ma(r)); };
}
exports.fromReaderEither = fromReaderEither;
/**
 * @since 2.0.0
 */
function rightIO(ma) {
    return exports.fromTaskEither(TE.rightIO(ma));
}
exports.rightIO = rightIO;
/**
 * @since 2.0.0
 */
function leftIO(me) {
    return exports.fromTaskEither(TE.leftIO(me));
}
exports.leftIO = leftIO;
/**
 * @since 2.0.0
 */
function fold(onLeft, onRight) {
    return function (ma) { return function (r) {
        return pipeable_1.pipe(ma(r), TE.fold(function (e) { return onLeft(e)(r); }, function (a) { return onRight(a)(r); }));
    }; };
}
exports.fold = fold;
/**
 * @since 2.0.0
 */
function getOrElse(onLeft) {
    return function (ma) { return function (r) { return TE.getOrElse(function (e) { return onLeft(e)(r); })(ma(r)); }; };
}
exports.getOrElse = getOrElse;
/**
 * @since 2.0.0
 */
function orElse(f) {
    return function (ma) { return function (r) { return TE.orElse(function (e) { return f(e)(r); })(ma(r)); }; };
}
exports.orElse = orElse;
/**
 * @since 2.0.0
 */
function swap(ma) {
    return function (e) { return TE.swap(ma(e)); };
}
exports.swap = swap;
/**
 * @since 2.0.0
 */
function getSemigroup(S) {
    return Reader_1.getSemigroup(TE.getSemigroup(S));
}
exports.getSemigroup = getSemigroup;
/**
 * @since 2.0.0
 */
function getApplySemigroup(S) {
    return Reader_1.getSemigroup(TE.getApplySemigroup(S));
}
exports.getApplySemigroup = getApplySemigroup;
/**
 * @since 2.0.0
 */
function getApplyMonoid(M) {
    return {
        concat: getApplySemigroup(M).concat,
        empty: exports.right(M.empty)
    };
}
exports.getApplyMonoid = getApplyMonoid;
/**
 * @since 2.0.0
 */
exports.ask = T.ask;
/**
 * @since 2.0.0
 */
exports.asks = T.asks;
/**
 * @since 2.0.0
 */
function local(f) {
    return function (ma) { return T.local(ma, f); };
}
exports.local = local;
/**
 * @since 2.0.0
 */
exports.readerTaskEither = {
    URI: exports.URI,
    map: T.map,
    of: exports.right,
    ap: T.ap,
    chain: T.chain,
    alt: function (fx, fy) { return function (r) { return TE.taskEither.alt(fx(r), function () { return fy()(r); }); }; },
    bimap: function (ma, f, g) { return function (e) { return TE.taskEither.bimap(ma(e), f, g); }; },
    mapLeft: function (ma, f) { return function (e) { return TE.taskEither.mapLeft(ma(e), f); }; },
    fromIO: rightIO,
    fromTask: rightTask,
    throwError: left
};
/**
 * Like `readerTaskEither` but `ap` is sequential
 * @since 2.0.0
 */
exports.readerTaskEitherSeq = __assign({}, exports.readerTaskEither, { ap: function (mab, ma) { return T.chain(mab, function (f) { return T.map(ma, f); }); } });
var _a = pipeable_1.pipeable(exports.readerTaskEither), alt = _a.alt, ap = _a.ap, apFirst = _a.apFirst, apSecond = _a.apSecond, bimap = _a.bimap, chain = _a.chain, chainFirst = _a.chainFirst, flatten = _a.flatten, map = _a.map, mapLeft = _a.mapLeft, fromOption = _a.fromOption, fromEither = _a.fromEither, fromPredicate = _a.fromPredicate, filterOrElse = _a.filterOrElse;
exports.alt = alt;
exports.ap = ap;
exports.apFirst = apFirst;
exports.apSecond = apSecond;
exports.bimap = bimap;
exports.chain = chain;
exports.chainFirst = chainFirst;
exports.flatten = flatten;
exports.map = map;
exports.mapLeft = mapLeft;
exports.fromOption = fromOption;
exports.fromEither = fromEither;
exports.fromPredicate = fromPredicate;
exports.filterOrElse = filterOrElse;