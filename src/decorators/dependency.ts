import { DefaultContainer, IContainer } from "../container";
import { DependencyMetadata } from "../dependency-metadata";

/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
export const dependency = (dependencyName: string) => (
    (target: object, propertyKey?: string, parameterIndex?: number) => {
        const metadata = DependencyMetadata.fromObject(target) || new DependencyMetadata();

        if (typeof parameterIndex === "undefined") {
            // Called on a property
            metadata.addProperty(propertyKey, dependencyName);
        } else if (typeof propertyKey === "undefined") {
            // Called on the constructor
            metadata.addConstructorParameter(parameterIndex, dependencyName);
        } else {
            // Called on a method parameter
            metadata.addMethodParameter(propertyKey, parameterIndex, dependencyName);
        }

        metadata.store(target);
    }
);
