export function getPathname(asPath) {
    return asPath.split(/\?|#/, 1)[0];
}
