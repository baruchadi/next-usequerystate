import type { Router } from 'next/router';
export type TransitionOptions = Parameters<Router['push']>[2];
export type HistoryOptions = 'replace' | 'push';
export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
export type Serializers<T> = {
    parse: (value: string) => T | null;
    serialize?: (value: T) => string;
};
export type SerializersWithDefaultFactory<T> = Serializers<T> & {
    withDefault: (defaultValue: T) => Serializers<T> & {
        readonly defaultValue: T;
    };
};
export type QueryTypeMap = Readonly<{
    string: SerializersWithDefaultFactory<string>;
    integer: SerializersWithDefaultFactory<number>;
    float: SerializersWithDefaultFactory<number>;
    boolean: SerializersWithDefaultFactory<boolean>;
    /**
     * Querystring encoded as the number of milliseconds since epoch,
     * and returned as a Date object.
     */
    timestamp: SerializersWithDefaultFactory<Date>;
    /**
     * Querystring encoded as an ISO-8601 string (UTC),
     * and returned as a Date object.
     */
    isoDateTime: SerializersWithDefaultFactory<Date>;
    /**
     * String-based enums provide better type-safety for known sets of values.
     * You will need to pass the stringEnum function a list of your enum values
     * in order to validate the query string. Anything else will return `null`,
     * or your default value if specified.
     *
     * Example:
     * ```ts
     * enum Direction {
     *   up = 'UP',
     *   down = 'DOWN',
     *   left = 'LEFT',
     *   right = 'RIGHT'
     * }
     *
     * const [direction, setDirection] = useQueryState(
     *   'direction',
     *   queryTypes
     *     .stringEnum<Direction>(Object.values(Direction))
     *     .withDefault(Direction.up)
     * )
     * ```
     *
     * Note: the query string value will be the value of the enum, not its name
     * (example above: `direction=UP`).
     *
     * @param validValues The values you want to accept
     */
    stringEnum<Enum extends string>(validValues: Enum[]): SerializersWithDefaultFactory<Enum>;
    /**
     * Encode any object shape into the querystring value as JSON.
     * Value is URI-encoded for safety, so it may not look nice in the URL.
     * Note: you may want to use `useQueryStates` for finer control over
     * multiple related query keys.
     */
    json<T>(): SerializersWithDefaultFactory<T>;
    /**
     * A comma-separated list of items.
     * Items are URI-encoded for safety, so they may not look nice in the URL.
     *
     * @param itemSerializers Serializers for each individual item in the array
     * @param separator The character to use to separate items (default ',')
     */
    array<ItemType>(itemSerializers: Serializers<ItemType>, separator?: string): SerializersWithDefaultFactory<ItemType[]>;
}>;
export declare const queryTypes: QueryTypeMap;
