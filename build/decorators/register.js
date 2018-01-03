"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../container");
/**
 * Register this class as a dependency solution.
 * @param identifier The identifier used when referencing this class as a dependency.
 * @param container The container used to register this dependency on. Defaults to DefaultContainer.
 * @param isSingleton If true the same instance is object is returned every time. Defaults to false.
 */
exports.register = (identifier, options) => (
// tslint:disable-next-line:ban-types
(constructor) => {
    const mergedOptions = Object.assign({}, mergeDefaultOptions(), options);
    mergedOptions.container.registerConstructor(identifier, constructor, (mergedOptions.isSingleton));
});
const mergeDefaultOptions = (options) => (Object.assign({ container: container_1.DefaultContainer.getInstance(), isSingleton: false }, options));
