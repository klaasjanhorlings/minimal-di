import "reflect-metadata";
export declare const metadataKey = "dependencies";
export declare class DependencyMetadata {
    static fromObject(target: object): DependencyMetadata;
    properties: Map<string, string>;
    methods: Map<string, Map<number, string>>;
    store(target: object): void;
    addConstructorParameter(parameterIndex: number, dependency: string): void;
    addMethodParameter(methodName: string, parameterIndex: number, dependency: string): void;
    addProperty(propertyName: string, dependency: string): void;
}
