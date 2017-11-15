export interface IContainer {
    registerConstructor(identifier: string, constructor: FunctionConstructor, isSingleton?: boolean);
    registerFactory(identifier: string, get: () => any, isSingleton?: boolean);
    get<TDependency>(identifier: string): TDependency;
}

type DependencyDefinition<TDependency> = {
    identifier: string;
    factory?: () => TDependency;
    ctor?: FunctionConstructor;
    isSingleton: boolean;
    instance?: TDependency;
}

export class DefaultContainer implements IContainer {
    private readonly initStack = [];
    private readonly definitions = new Map<string, DependencyDefinition<any>>();
    private static instance: IContainer;

    public static getInstance() {
        if (!DefaultContainer.instance) {
            DefaultContainer.instance = new DefaultContainer();
        }

        return DefaultContainer.instance;
    }

    public static setInstance(instance: IContainer) {
        DefaultContainer.instance = instance;
    }

    /**
     * Register a new constructor to be instantiated as requested. 
     * 
     * This is preferential to registerFactory() because you can check your 
     * dependencies without instantiating them.
     * 
     * @param identifier The identifier by which the dependency is refered to.
     * @param constructor The constructor function or class to be created and returned.
     * @param isSingleton Always return the same instance? Defaults to false.
     */
    public registerConstructor(identifier: string, constructor: FunctionConstructor, isSingleton?: boolean) {
        this.definitions.set(identifier, {
            identifier,
            ctor: constructor,
            isSingleton: !!isSingleton
        })
    }

    /**
     * Register a new object factory which returns a new object as requested.
     * 
     * Because we can't know what type of object will be returned before the
     * factory method is called we can't check dependencies before instantiating.
     * 
     * @param identifier The identifier by which the dependency is refered to.
     * @param factory Callback to return an object instance for this dependency.
     * @param isSingleton Always return the same instance? Defaults to false.
     */
    public registerFactory(identifier: string, factory: () => any, isSingleton?: boolean) {
        this.definitions.set(identifier, {
            identifier,
            factory,
            isSingleton: !!isSingleton
        });
    }

    public get<TDependency>(identifier: string): TDependency {
        if (!this.definitions.has(identifier)) {
            throw new Error(`Unknown dependency "${identifier}"`);
        }
        this.throwOnLoop(identifier);

        const definition = this.definitions.get(identifier);

        this.initStack.push(identifier);
        const instance = this.getObjectInstance(definition);
        this.initStack.pop();
        
        return instance;
    }

    private getObjectInstance(definition: DependencyDefinition<any>) {
        if (definition.isSingleton) {
            if (definition.instance === void(0)) {
                definition.instance = this.createObjectInstance(definition);
            }
            return definition.instance;
        }
        return this.createObjectInstance(definition);
    }

    private createObjectInstance(definition: DependencyDefinition<any>) {
        if (definition.ctor !== void(0)) {
            return new definition.ctor;
        } else if (definition.factory !== void(0)) {
            return definition.factory();
        }
    }

    private throwOnLoop(identifier: string) {
        const idx = this.initStack.indexOf(identifier);
        if (idx >= 0) {
            const route = this.initStack.map(depName => depName === identifier ? `[${depName}]` : depName).join(" -> ");
            throw new Error(`Loop detected, ${identifier} (indirectly) depends on itself ${route} -> [${identifier}]`);
        }
    }
}