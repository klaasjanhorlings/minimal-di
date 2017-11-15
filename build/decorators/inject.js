"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../container");
const dependency_metadata_1 = require("../dependency-metadata");
/**
 * Notifies that the class has dependencies. Wraps the constructor in an automatically resolving wrapper.
 * @param container The container used to resolve dependencies for this. Defaults to DefaultContainer.
 */
exports.inject = (container) => (
// tslint:disable-next-line:no-any
(constructor) => (class extends constructor {
    // tslint:disable-next-line:no-any
    constructor(...args) {
        container = container || container_1.DefaultContainer.getInstance();
        const metadata = dependency_metadata_1.DependencyMetadata.fromObject(constructor);
        const ctorArgs = Array.prototype.slice.call(arguments, 0);
        if (typeof metadata !== "undefined") {
            metadata.methods.forEach((dependencies, methodName) => {
                if (methodName === "constructor") {
                    resolveDependencies(dependencies, ctorArgs, container);
                }
                else {
                    // tslint:disable-next-line:ban-types
                    const method = constructor.prototype[methodName];
                    const wrapper = function () {
                        const methodArgs = Array.prototype.slice.call(arguments, 0);
                        resolveDependencies(dependencies, methodArgs, container);
                        method.apply(this, methodArgs);
                    };
                    constructor.prototype[methodName] = wrapper;
                }
            });
        }
        super(...ctorArgs);
        if (typeof metadata !== "undefined") {
            resolveDependencies(metadata.properties, this, container);
        }
    }
}));
const resolveDependencies = (dependencies, dest, container) => {
    dependencies.forEach((dependencyRef, index) => {
        dest[index] = (typeof dest[index] !== "undefined") ? dest[index] : container.get(dependencyRef);
    });
};
