export const queryTypes = {
    string: {
        parse: v => v,
        serialize: v => `${v}`,
        withDefault(defaultValue) {
            return Object.assign(Object.assign({}, this), { defaultValue });
        }
    },
    integer: {
        parse: v => parseInt(v),
        serialize: v => Math.round(v).toFixed(),
        withDefault(defaultValue) {
            return Object.assign(Object.assign({}, this), { defaultValue });
        }
    },
    float: {
        parse: v => parseFloat(v),
        serialize: v => v.toString(),
        withDefault(defaultValue) {
            return Object.assign(Object.assign({}, this), { defaultValue });
        }
    },
    boolean: {
        parse: v => v === 'true',
        serialize: v => (Boolean(v) ? 'true' : 'false'),
        withDefault(defaultValue) {
            return Object.assign(Object.assign({}, this), { defaultValue });
        }
    },
    timestamp: {
        parse: v => new Date(parseInt(v)),
        serialize: (v) => v.valueOf().toString(),
        withDefault(defaultValue) {
            return Object.assign(Object.assign({}, this), { defaultValue });
        }
    },
    isoDateTime: {
        parse: v => new Date(v),
        serialize: (v) => v.toISOString(),
        withDefault(defaultValue) {
            return Object.assign(Object.assign({}, this), { defaultValue });
        }
    },
    stringEnum(validValues) {
        return {
            parse: (query) => {
                const asEnum = query;
                if (validValues.includes(asEnum)) {
                    return asEnum;
                }
                return null;
            },
            serialize: (value) => value.toString(),
            withDefault(defaultValue) {
                return Object.assign(Object.assign({}, this), { defaultValue });
            }
        };
    },
    json() {
        return {
            parse: query => {
                try {
                    return JSON.parse(decodeURIComponent(query));
                }
                catch (_a) {
                    return null;
                }
            },
            serialize: value => encodeURIComponent(JSON.stringify(value)),
            withDefault(defaultValue) {
                return Object.assign(Object.assign({}, this), { defaultValue });
            }
        };
    },
    array(itemSerializers, separator = ',') {
        return {
            parse: query => {
                if (query === '') {
                    // Empty query should not go through the split/map/filter logic,
                    // see https://github.com/47ng/next-usequerystate/issues/329
                    return [];
                }
                return query
                    .split(separator)
                    .map(item => decodeURIComponent(item))
                    .map(itemSerializers.parse)
                    .filter(value => value !== null && value !== undefined);
            },
            serialize: values => values
                .map(value => {
                if (itemSerializers.serialize) {
                    return itemSerializers.serialize(value);
                }
                return `${value}`;
            })
                .map(encodeURIComponent)
                .join(separator),
            withDefault(defaultValue) {
                return Object.assign(Object.assign({}, this), { defaultValue });
            }
        };
    }
};
