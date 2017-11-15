import "reflect-metadata";

export const metadataKey = "dependencies";

export class DependencyMetadata {
    public static fromObject(target: object): DependencyMetadata {
        return Reflect.getMetadata(metadataKey, target);
    }

    public properties: Map<string, string> = new Map();
    public methods: Map<string, Map<number, string>> = new Map();

    public store(target: object) {
        Reflect.defineMetadata(metadataKey, this, target);
    }

    public addConstructorParameter(parameterIndex: number, dependency: string) {
        this.addMethodParameter("constructor", parameterIndex, dependency);
    }

    public addMethodParameter(methodName: string, parameterIndex: number, dependency: string) {
        const method = this.methods.get(methodName) || new Map<number, string>();
        method.set(parameterIndex, dependency);
        this.methods.set(methodName, method);
    }

    public addProperty(propertyName: string, dependency: string) {
        this.properties.set(propertyName, dependency);
    }
}
