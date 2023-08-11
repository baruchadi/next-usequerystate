import { HistoryOptions, Serializers, TransitionOptions } from './defs';
export interface UseQueryStateOptions<T> extends Serializers<T> {
    /**
     * The operation to use on state updates. Defaults to `replace`.
     */
    history?: HistoryOptions;
}
export type UseQueryStateReturn<Parsed, Default> = [
    Default extends undefined ? Parsed | null : Parsed,
    (value: null | Parsed | ((old: Default extends Parsed ? Parsed : Parsed | null) => Parsed | null), transitionOptions?: TransitionOptions) => Promise<boolean>
];
/**
 * React state hook synchronized with a URL query string in Next.js
 *
 * This variant is used when providing a default value. This will make
 * the returned state non-nullable when the query is not present in the URL.
 * (the default value will be returned instead).
 *
 * _Note: the URL will **not** be updated with the default value if the query
 * is missing._
 *
 * Setting the value to `null` will clear the query in the URL, and return
 * the default value as state.
 *
 * Example usage:
 * ```ts
 *   const [count, setCount] = useQueryState(
 *     'count',
 *     queryTypes.integer.defaultValue(0)
 *   )
 *
 *   const increment = () => setCount(oldCount => oldCount + 1)
 *   const decrement = () => setCount(oldCount => oldCount - 1)
 *   const clearCountQuery = () => setCount(null)
 * ```
 * @param key The URL query string key to bind to
 * @param options - Serializers (defines the state data type), default value and optional history mode.
 */
export declare function useQueryState<T>(key: string, options: UseQueryStateOptions<T> & {
    defaultValue: T;
}): UseQueryStateReturn<NonNullable<ReturnType<typeof options.parse>>, typeof options.defaultValue>;
/**
 * React state hook synchronized with a URL query string in Next.js
 *
 * If the query is missing in the URL, the state will be `null`.
 *
 * Example usage:
 * ```ts
 *   // Blog posts filtering by tag
 *   const [tag, selectTag] = useQueryState('tag')
 *   const filteredPosts = posts.filter(post => tag ? post.tag === tag : true)
 *   const clearTag = () => selectTag(null)
 * ```
 * @param key The URL query string key to bind to
 * @param options - Serializers (defines the state data type), and optional history mode.
 */
export declare function useQueryState<T>(key: string, options: UseQueryStateOptions<T>): UseQueryStateReturn<NonNullable<ReturnType<typeof options.parse>>, undefined>;
/**
 * Default type string, limited options & default value
 */
export declare function useQueryState(key: string, options: {
    history?: HistoryOptions;
    defaultValue: string;
}): UseQueryStateReturn<string, typeof options.defaultValue>;
/**
 * React state hook synchronized with a URL query string in Next.js
 *
 * If the query is missing in the URL, the state will be `null`.
 *
 * Note: by default the state type is a `string`. To use different types,
 * check out the `queryTypes` helpers:
 * ```ts
 *   const [date, setDate] = useQueryState(
 *     'date',
 *     queryTypes.isoDateTime.withDefault(new Date('2021-01-01'))
 *   )
 *
 *   const setToNow = () => setDate(new Date())
 *   const addOneHour = () => {
 *     setDate(oldDate => new Date(oldDate.valueOf() + 3600_000))
 *   }
 * ```
 * @param key The URL query string key to bind to
 * @param options - Serializers (defines the state data type), and optional history mode.
 */
export declare function useQueryState(key: string, options: Pick<UseQueryStateOptions<string>, 'history'>): UseQueryStateReturn<string, undefined>;
/**
 * React state hook synchronized with a URL query string in Next.js
 *
 * If the query is missing in the URL, the state will be `null`.
 *
 * Note: by default the state type is a `string`. To use different types,
 * check out the `queryTypes` helpers:
 * ```ts
 *   const [date, setDate] = useQueryState(
 *     'date',
 *     queryTypes.isoDateTime.withDefault(new Date('2021-01-01'))
 *   )
 *
 *   const setToNow = () => setDate(new Date())
 *   const addOneHour = () => {
 *     setDate(oldDate => new Date(oldDate.valueOf() + 3600_000))
 *   }
 * ```
 * @param key The URL query string key to bind to
 */
export declare function useQueryState(key: string): UseQueryStateReturn<string, undefined>;
