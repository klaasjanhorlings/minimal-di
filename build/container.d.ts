export interface IContainer {
    registerConstructor(identifier: string, constructor: FunctionConstructor, isSingleton?: boolean): any;
    registerFactory(identifier: string, get: () => {}, isSingleton?: boolean): any;
    get<TDependency>(identifier: string): TDependency;
}
export declare class DefaultContainer implements IContainer {
    private readonly initStack;
    private readonly definitions;
    private static instance;
    static getInstance(): IContainer;
    static setInstance(instance: IContainer): void;
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
    registerConstructor(identifier: string, constructor: FunctionConstructor, isSingleton?: boolean): void;
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
    registerFactory<TDependency>(identifier: string, factory: () => TDependency, isSingleton?: boolean): void;
    get<TDependency>(identifier: string): TDependency;
    private throwOnLoop(identifier);
}
