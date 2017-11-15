"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_metadata_1 = require("../dependency-metadata");
/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
exports.dependency = (dependency) => ((target, propertyKey, parameterIndex) => {
    //target = (typeof target === "function") ? target : target.constructor;
    const metadata = dependency_metadata_1.default.fromObject(target) || new dependency_metadata_1.default();
    if (typeof parameterIndex === "undefined") {
        // Called on a property
        metadata.addProperty(propertyKey, dependency);
    }
    else if (typeof propertyKey === "undefined") {
        // Called on the constructor
        metadata.addConstructorParameter(parameterIndex, dependency);
    }
    else {
        // Called on a method parameter
        metadata.addMethodParameter(propertyKey, parameterIndex, dependency);
    }
    metadata.store(target);
});
