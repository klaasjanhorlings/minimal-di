"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../container");
const dependency_metadata_1 = require("../dependency-metadata");
/**
 * Notifies that the class has dependencies. Wraps the constructor in an automatically resolving wrapper.
 * @param container The container used to resolve dependencies for this. Defaults to DefaultContainer.
 */
exports.inject = (container) => ((constructor) => (class extends constructor {
    constructor(...args) {
        container = container || container_1.DefaultContainer.getInstance();
        const metadata = dependency_metadata_1.default.fromObject(constructor);
        const ctorArgs = Array.prototype.slice.call(arguments, 0);
        if (typeof metadata !== "undefined") {
            metadata.methods.forEach((dependencies, methodName) => {
                if (methodName === "constructor") {
                    resolveDependencies(dependencies, ctorArgs, container);
                }
                else {
                    const method = constructor.prototype[methodName];
                    const wrapper = function () {
                        const args = Array.prototype.slice.call(arguments, 0);
                        resolveDependencies(dependencies, args, container);
                        method.apply(this, args);
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
