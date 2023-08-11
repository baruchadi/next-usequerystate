"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueryState = void 0;
const router_1 = require("next/compat/router");
const react_1 = __importDefault(require("react"));
/**
 * React state hook synchronized with a URL query string in Next.js
 *
 * If used without a `defaultValue` supplied in the options, and the query is
 * missing in the URL, the state will be `null`.
 *
 * ### Behaviour with default values:
 *
 * _Note: the URL will **not** be updated with the default value if the query
 * is missing._
 *
 * Setting the value to `null` will clear the query in the URL, and return
 * the default value as state.
 *
 * Example usage:
 * ```ts
 *   // Blog posts filtering by tag
 *   const [tag, selectTag] = useQueryState('tag')
 *   const filteredPosts = posts.filter(post => tag ? post.tag === tag : true)
 *   const clearTag = () => selectTag(null)
 *
 *   // With default values
 *
 *   const [count, setCount] = useQueryState(
 *     'count',
 *     queryTypes.integer.defaultValue(0)
 *   )
 *
 *   const increment = () => setCount(oldCount => oldCount + 1)
 *   const decrement = () => setCount(oldCount => oldCount - 1)
 *   const clearCountQuery = () => setCount(null)
 *
 *   // --
 *
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
 * @param options - Serializers (defines the state data type), optional default value and history mode.
 */
function useQueryState(key, { history = 'replace', parse = x => x, serialize = String, defaultValue = undefined } = {
    history: 'replace',
    parse: x => x,
    serialize: String,
    defaultValue: undefined
}) {
    var _a;
    const router = (0, router_1.useRouter)();
    // Memoizing the update function has the advantage of making it
    // immutable as long as `history` stays the same.
    // It reduces the amount of reactivity needed to update the state.
    const updateUrl = react_1.default.useMemo(() => (history === 'push' ? router === null || router === void 0 ? void 0 : router.push : router === null || router === void 0 ? void 0 : router.replace), [history]);
    const getValue = react_1.default.useCallback(() => {
        if (typeof window === 'undefined') {
            // Not available in an SSR context
            return null;
        }
        const query = new URLSearchParams(window.location.search);
        const value = query.get(key);
        return value !== null ? parse(value) : null;
    }, []);
    // Update the state value only when the relevant key changes.
    // Because we're not calling getValue in the function argument
    // of React.useMemo, but instead using it as the function to call,
    // there is no need to pass it in the dependency array.
    const value = react_1.default.useMemo(getValue, [router === null || router === void 0 ? void 0 : router.query[key]]);
    const update = react_1.default.useCallback((stateUpdater, // todo: This is wrong now
    transitionOptions) => {
        var _a, _b;
        const isUpdaterFunction = (input) => {
            return typeof input === 'function';
        };
        // Resolve the new value based on old value & updater
        const oldValue = (_b = (_a = getValue()) !== null && _a !== void 0 ? _a : defaultValue) !== null && _b !== void 0 ? _b : null;
        const newValue = isUpdaterFunction(stateUpdater)
            ? stateUpdater(oldValue)
            : stateUpdater;
        // We can't rely on router.query here to avoid causing
        // unnecessary renders when other query parameters change.
        // URLSearchParams is already polyfilled by Next.js
        const query = new URLSearchParams(window.location.search);
        if (newValue === null) {
            // Don't leave value-less keys hanging
            query.delete(key);
        }
        else {
            query.set(key, serialize(newValue));
        }
        const search = query.toString();
        const hash = window.location.hash;
        return updateUrl === null || updateUrl === void 0 ? void 0 : updateUrl.call(router, {
            pathname: router === null || router === void 0 ? void 0 : router.pathname,
            hash,
            search
        }, {
            pathname: window.location.pathname,
            hash,
            search
        }, transitionOptions);
    }, [key, updateUrl]);
    return [(_a = value !== null && value !== void 0 ? value : defaultValue) !== null && _a !== void 0 ? _a : null, update];
}
exports.useQueryState = useQueryState;
