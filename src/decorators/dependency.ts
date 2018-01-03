import { DependencyMetadata } from "../dependency-metadata";

/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
export const dependency = (dependencyName: string, options?: Partial<DependencyOptions>) => (
    (target: object, propertyKey?: string, parameterIndex?: number) => {
        const metadata = DependencyMetadata.fromObject(target) || new DependencyMetadata();
        const mergedOptions = mergeDefaultOptions(options);

        if (typeof parameterIndex === "undefined" && typeof propertyKey !== "undefined") {
            // Called on a property
            metadata.addProperty(propertyKey, dependencyName, mergedOptions);
        } else if (typeof propertyKey === "undefined" && typeof parameterIndex !== "undefined") {
            // Called on the constructor
            metadata.addConstructorParameter(parameterIndex, dependencyName, mergedOptions);
        } else if (typeof propertyKey !== "undefined" && typeof parameterIndex !== "undefined") {
            // Called on a method parameter
            metadata.addMethodParameter(propertyKey, parameterIndex, dependencyName, mergedOptions);
        }

        metadata.store(target);
    }
);

const mergeDefaultOptions: (options?: Partial<DependencyOptions>) => DependencyOptions = (options) => ({
    required: true,
    ...options,
});

export type DependencyOptions = {
    required: boolean;
};
