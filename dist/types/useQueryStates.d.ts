import type { HistoryOptions, Nullable, Serializers, TransitionOptions } from './defs';
type KeyMapValue<Type> = Serializers<Type> & {
    defaultValue?: Type;
};
export type UseQueryStatesKeysMap<Map = any> = {
    [Key in keyof Map]: KeyMapValue<Map[Key]>;
};
export interface UseQueryStatesOptions {
    /**
     * The operation to use on state updates. Defaults to `replace`.
     */
    history: HistoryOptions;
}
export type Values<T extends UseQueryStatesKeysMap> = {
    [K in keyof T]: T[K]['defaultValue'] extends NonNullable<ReturnType<T[K]['parse']>> ? NonNullable<ReturnType<T[K]['parse']>> : ReturnType<T[K]['parse']> | null;
};
type UpdaterFn<T extends UseQueryStatesKeysMap> = (old: Values<T>) => Partial<Nullable<Values<T>>>;
export type SetValues<T extends UseQueryStatesKeysMap> = (values: Partial<Nullable<Values<T>>> | UpdaterFn<T>, transitionOptions?: TransitionOptions) => Promise<boolean>;
export type UseQueryStatesReturn<T extends UseQueryStatesKeysMap> = [
    Values<T>,
    SetValues<T>
];
/**
 * Synchronise multiple query string arguments to React state in Next.js
 *
 * @param keys - An object describing the keys to synchronise and how to
 *               serialise and parse them.
 *               Use `queryTypes.(string|integer|float)` for quick shorthands.
 */
export declare function useQueryStates<KeyMap extends UseQueryStatesKeysMap>(keys: KeyMap, { history }?: Partial<UseQueryStatesOptions>): UseQueryStatesReturn<KeyMap>;
export {};
