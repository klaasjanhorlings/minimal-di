/**
 * Adds a dependency reference to this property or method parameter.
 * @param dependency Name of the required dependency.
 */
export declare const dependency: (dependency: string) => (target: object, propertyKey?: string, parameterIndex?: number) => void;
