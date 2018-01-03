import "reflect-metadata";
import { DependencyOptions } from "./decorators/dependency";

export const metadataKey = "dependencies";

export class DependencyMetadata {
    static fromObject(target: object): DependencyMetadata {
        return Reflect.getMetadata(metadataKey, target);
    }

    properties: Map<string, Dependency> = new Map();
    methods: Map<string, Map<number, Dependency>> = new Map();

    store(target: object): void {
        Reflect.defineMetadata(metadataKey, this, target);
    }

    addConstructorParameter(parameterIndex: number, dependency: string, options: DependencyOptions): void {
        this.addMethodParameter("constructor", parameterIndex, dependency, options);
    }

    // tslint:disable-next-line:max-line-length
    addMethodParameter(methodName: string, parameterIndex: number, dependency: string, options: DependencyOptions): void {
        const method = this.methods.get(methodName) || new Map<number, Dependency>();
        method.set(parameterIndex, { name: dependency, options });
        this.methods.set(methodName, method);
    }

    addProperty(propertyName: string, dependency: string, options: DependencyOptions): void {
        this.properties.set(propertyName, { name: dependency, options });
    }
}

export type Dependency = {
    name: string;
    options: DependencyOptions;
};
