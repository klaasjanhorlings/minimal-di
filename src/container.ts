export interface IContainer {
    registerConstructor(identifier: string, constructor: FunctionConstructor, isSingleton?: boolean): void;
    registerFactory(identifier: string, get: () => {}, isSingleton?: boolean): void;
    get<TDependency>(identifier: string): TDependency;
}

interface DependencyDefinitionConstructor<TDependency> {
    new (...args: Array<{}>): TDependency;
}

interface DependencyDefinition<TDependency> {
    identifier: string;
    ctor?: DependencyDefinitionConstructor<TDependency>;
    isSingleton: boolean;
    instance?: TDependency;
    factory?(): TDependency;
}

export class DefaultContainer implements IContainer {
    private readonly initStack: string[] = [];
    private readonly definitions: Map<string, DependencyDefinition<{}>> = new Map();
    private static instance: IContainer;

    static getInstance(): IContainer {
        if (!DefaultContainer.instance) {
            DefaultContainer.instance = new DefaultContainer();
        }

        return DefaultContainer.instance;
    }

    static setInstance(instance: IContainer): void {
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
    registerConstructor(identifier: string, constructor: FunctionConstructor, isSingleton?: boolean): void {
        this.definitions.set(identifier, {
            ctor: constructor,
            identifier,
            isSingleton: !!isSingleton,
        });
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
    registerFactory<TDependency>(identifier: string, factory: () => TDependency, isSingleton?: boolean): void {
        this.definitions.set(identifier, {
            factory,
            identifier,
            isSingleton: !!isSingleton,
        });
    }

    get<TDependency>(identifier: string): TDependency {
        if (!this.definitions.has(identifier)) {
            throw new Error(`Unknown dependency "${identifier}"`);
        }
        this.throwOnLoop(identifier);
        const definition = this.definitions.get(identifier) as DependencyDefinition<TDependency>;
        this.initStack.push(identifier);
        const instance = getObjectInstance<TDependency>(definition);
        this.initStack.pop();

        return instance;
    }

    private throwOnLoop(identifier: string): void {
        const idx = this.initStack.indexOf(identifier);
        if (idx >= 0) {
            const route = this.initStack.map((depName) =>
                depName === identifier ? `[${depName}]` : depName).join(" -> ");

            throw new Error(`Loop detected, ${identifier} (indirectly) depends on itself ${route} -> [${identifier}]`);
        }
    }
}

const getObjectInstance = <TDependency>(definition: DependencyDefinition<TDependency>): TDependency => {
    if (definition.isSingleton) {
        if (definition.instance === void(0)) {
            definition.instance = createObjectInstance(definition);
        }

        return definition.instance;
    }

    return createObjectInstance(definition);
};

const createObjectInstance = <TDependency>(definition: DependencyDefinition<TDependency>): TDependency => {
    if (definition.ctor !== void(0)) {
        return new definition.ctor();
    } else if (definition.factory !== void(0)) {
        return definition.factory();
    }
    throw new Error("Definition object should either contain a ctor or factory property, neither found.");
};
