import { Applicative2C } from './Applicative';
import { Apply2C } from './Apply';
import { Contravariant2 } from './Contravariant';
import { Functor2 } from './Functor';
import { Monoid } from './Monoid';
import { Semigroup } from './Semigroup';
import { Eq } from './Eq';
import { Show } from './Show';
declare module './HKT' {
    interface URI2HKT2<L, A> {
        Const: Const<L, A>;
    }
}
/**
 * @since 2.0.0
 */
export declare const URI = "Const";
/**
 * @since 2.0.0
 */
export declare type URI = typeof URI;
/**
 * @since 2.0.0
 */
export declare type Const<L, A> = L & {
    readonly _A: A;
};
/**
 * @since 2.0.0
 */
export declare const make: <L>(l: L) => Const<L, never>;
/**
 * @since 2.0.0
 */
export declare function getShow<L, A>(S: Show<L>): Show<Const<L, A>>;
/**
 * @since 2.0.0
 */
export declare const getEq: <L, A>(E: Eq<L>) => Eq<Const<L, A>>;
/**
 * @since 2.0.0
 */
export declare function getApply<L>(S: Semigroup<L>): Apply2C<URI, L>;
/**
 * @since 2.0.0
 */
export declare function getApplicative<L>(M: Monoid<L>): Applicative2C<URI, L>;
/**
 * @since 2.0.0
 */
export declare const const_: Functor2<URI> & Contravariant2<URI>;
declare const contramap: <A, B>(f: (b: B) => A) => <L>(fa: Const<L, A>) => Const<L, B>, map: <A, B>(f: (a: A) => B) => <L>(fa: Const<L, A>) => Const<L, B>;
export { contramap, map };
