import "reflect-metadata";
import { DependencyOptions } from "./decorators/dependency";
export declare const metadataKey = "dependencies";
export declare class DependencyMetadata {
    static fromObject(target: object): DependencyMetadata;
    properties: Map<string, Dependency>;
    methods: Map<string, Map<number, Dependency>>;
    store(target: object): void;
    addConstructorParameter(parameterIndex: number, dependency: string, options: DependencyOptions): void;
    addMethodParameter(methodName: string, parameterIndex: number, dependency: string, options: DependencyOptions): void;
    addProperty(propertyName: string, dependency: string, options: DependencyOptions): void;
}
export declare type Dependency = {
    name: string;
    options: DependencyOptions;
};
