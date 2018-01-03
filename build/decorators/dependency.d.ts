/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
export declare const dependency: (dependencyName: string, options?: Partial<DependencyOptions> | undefined) => (target: object, propertyKey?: string | undefined, parameterIndex?: number | undefined) => void;
export declare type DependencyOptions = {
    required: boolean;
};
