import "reflect-metadata";

export const metadataKey = "dependencies";

export class DependencyMetadata {
    static fromObject(target: object): DependencyMetadata {
        return Reflect.getMetadata(metadataKey, target);
    }

    properties: Map<string, string> = new Map();
    methods: Map<string, Map<number, string>> = new Map();

    store(target: object): void {
        Reflect.defineMetadata(metadataKey, this, target);
    }

    addConstructorParameter(parameterIndex: number, dependency: string): void {
        this.addMethodParameter("constructor", parameterIndex, dependency);
    }

    addMethodParameter(methodName: string, parameterIndex: number, dependency: string): void {
        const method = this.methods.get(methodName) || new Map<number, string>();
        method.set(parameterIndex, dependency);
        this.methods.set(methodName, method);
    }

    addProperty(propertyName: string, dependency: string): void {
        this.properties.set(propertyName, dependency);
    }
}

export type Dependency = {
    name: string;
    options: {
        required: boolean;
    };
};
