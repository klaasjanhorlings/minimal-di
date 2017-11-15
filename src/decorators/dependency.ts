import DependencyMetadata from "../dependency-metadata";
import { IContainer, DefaultContainer } from "../container";

/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
export const dependency = (dependency: string) => (
    (target: object, propertyKey?: string, parameterIndex?: number) => {
        //target = (typeof target === "function") ? target : target.constructor;
        const metadata = DependencyMetadata.fromObject(target) || new DependencyMetadata();

        if (typeof parameterIndex === "undefined") {
            // Called on a property
            metadata.addProperty(propertyKey, dependency);
        } else if (typeof propertyKey === "undefined") {
            // Called on the constructor
            metadata.addConstructorParameter(parameterIndex, dependency);
        } else {
            // Called on a method parameter
            metadata.addMethodParameter(propertyKey, parameterIndex, dependency);
        }

        metadata.store(target);
    }
);