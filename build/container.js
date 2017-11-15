"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultContainer {
    constructor() {
        this.initStack = [];
        this.definitions = new Map();
    }
    static getInstance() {
        if (!DefaultContainer.instance) {
            DefaultContainer.instance = new DefaultContainer();
        }
        return DefaultContainer.instance;
    }
    static setInstance(instance) {
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
    registerConstructor(identifier, constructor, isSingleton) {
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
    registerFactory(identifier, factory, isSingleton) {
        this.definitions.set(identifier, {
            factory,
            identifier,
            isSingleton: !!isSingleton,
        });
    }
    get(identifier) {
        if (!this.definitions.has(identifier)) {
            throw new Error(`Unknown dependency "${identifier}"`);
        }
        this.throwOnLoop(identifier);
        const definition = this.definitions.get(identifier);
        this.initStack.push(identifier);
        const instance = getObjectInstance(definition);
        this.initStack.pop();
        return instance;
    }
    throwOnLoop(identifier) {
        const idx = this.initStack.indexOf(identifier);
        if (idx >= 0) {
            const route = this.initStack.map((depName) => depName === identifier ? `[${depName}]` : depName).join(" -> ");
            throw new Error(`Loop detected, ${identifier} (indirectly) depends on itself ${route} -> [${identifier}]`);
        }
    }
}
exports.DefaultContainer = DefaultContainer;
const getObjectInstance = (definition) => {
    if (definition.isSingleton) {
        if (definition.instance === void (0)) {
            definition.instance = createObjectInstance(definition);
        }
        return definition.instance;
    }
    return createObjectInstance(definition);
};
const createObjectInstance = (definition) => {
    if (definition.ctor !== void (0)) {
        return new definition.ctor();
    }
    else if (definition.factory !== void (0)) {
        return definition.factory();
    }
};
