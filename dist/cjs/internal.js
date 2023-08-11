"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathname = void 0;
function getPathname(asPath) {
    return asPath.split(/\?|#/, 1)[0];
}
exports.getPathname = getPathname;
