"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_metadata_1 = require("../dependency-metadata");
/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
exports.dependency = (dependencyName) => ((target, propertyKey, parameterIndex) => {
    const metadata = dependency_metadata_1.DependencyMetadata.fromObject(target) || new dependency_metadata_1.DependencyMetadata();
    if (typeof parameterIndex === "undefined" && typeof propertyKey !== "undefined") {
        // Called on a property
        metadata.addProperty(propertyKey, dependencyName);
    }
    else if (typeof propertyKey === "undefined" && typeof parameterIndex !== "undefined") {
        // Called on the constructor
        metadata.addConstructorParameter(parameterIndex, dependencyName);
    }
    else if (typeof propertyKey !== "undefined" && typeof parameterIndex !== "undefined") {
        // Called on a method parameter
        metadata.addMethodParameter(propertyKey, parameterIndex, dependencyName);
    }
    metadata.store(target);
});
