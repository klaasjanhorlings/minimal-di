import { DefaultContainer, IContainer } from "../container";
import { Dependency, DependencyMetadata } from "../dependency-metadata";

/**
 * Notifies that the class has dependencies. Wraps the constructor in an automatically resolving wrapper.
 * @param container The container used to resolve dependencies for this. Defaults to DefaultContainer.
 */
export const inject = (options?: Partial<InjectOptions>) => (
    // tslint:disable-next-line:no-any
    <TClass extends { new(...args: any[]): any }>(constructor: TClass) => (
        class extends constructor {
            // tslint:disable-next-line:no-any
            constructor(...ctorArgs: any[]) {
                const mergedOptions = mergeDefaultOptions(options);
                const metadata = DependencyMetadata.fromObject(constructor);

                if (typeof metadata !== "undefined") {
                    metadata.methods.forEach((dependencies, methodName) => {
                        if (methodName === "constructor") {
                            resolveDependencies(dependencies, ctorArgs, mergedOptions.container as IContainer);
                        } else {
                            // tslint:disable-next-line:ban-types
                            const method = constructor.prototype[methodName] as Function;
                            const wrapper = function(this: TClass): any {
                                const methodArgs = Array.prototype.slice.call(arguments, 0);
                                resolveDependencies(dependencies, methodArgs, mergedOptions.container as IContainer);
                                method.apply(this, methodArgs);
                            };
                            constructor.prototype[methodName] = wrapper;
                        }
                    });
                }

                super(...ctorArgs);

                if (typeof metadata !== "undefined") {
                    resolveDependencies(metadata.properties, this, mergedOptions.container);
                }
            }
        }
    )
);

const mergeDefaultOptions: (options?: Partial<InjectOptions>) => InjectOptions = (options) => ({
    container: DefaultContainer.getInstance(),
    ...options,
});

export type InjectOptions = {
    container: IContainer;
};

const resolveDependencies = (
        dependencies: Map<number | string, Dependency>,
        // tslint:disable-next-line:no-any
        dest: { [key: number]: any; [key: string]: any },
        container: IContainer,
    ) => {
    dependencies.forEach((dependencyRef, index) => {
        dest[index] = (typeof dest[index] !== "undefined") ? dest[index] : container.get(dependencyRef.name);
    });
};
