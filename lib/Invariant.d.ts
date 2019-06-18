import { HKT, HKT2, HKT3, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from './HKT';
/**
 * @since 2.0.0
 */
export interface Invariant<F> {
    readonly URI: F;
    readonly imap: <A, B>(fa: HKT<F, A>, f: (a: A) => B, g: (b: B) => A) => HKT<F, B>;
}
/**
 * @since 2.0.0
 */
export interface Invariant1<F extends URIS> {
    readonly URI: F;
    readonly imap: <A, B>(fa: HKT<F, A>, f: (a: A) => B, g: (b: B) => A) => Kind<F, B>;
}
/**
 * @since 2.0.0
 */
export interface Invariant2<F extends URIS2> {
    readonly URI: F;
    readonly imap: <E, A, B>(fa: HKT2<F, E, A>, f: (a: A) => B, g: (b: B) => A) => Kind2<F, E, B>;
}
/**
 * @since 2.0.0
 */
export interface Invariant2C<F extends URIS2, E> {
    readonly URI: F;
    readonly _E: E;
    readonly imap: <A, B>(fa: HKT2<F, E, A>, f: (a: A) => B, g: (b: B) => A) => Kind2<F, E, B>;
}
/**
 * @since 2.0.0
 */
export interface Invariant3<F extends URIS3> {
    readonly URI: F;
    readonly imap: <R, E, A, B>(fa: HKT3<F, R, E, A>, f: (a: A) => B, g: (b: B) => A) => Kind3<F, R, E, B>;
}