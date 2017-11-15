import { DefaultContainer, IContainer } from "../container";
import { DependencyMetadata } from "../dependency-metadata";

/**
 * Notifies that the class has dependencies. Wraps the constructor in an automatically resolving wrapper.
 * @param container The container used to resolve dependencies for this. Defaults to DefaultContainer.
 */
export const inject = (container?: IContainer) => (
    // tslint:disable-next-line:no-any
    <T extends { new(...args: any[]): any }>(constructor: T) => (
        class extends constructor {
            // tslint:disable-next-line:no-any
            public constructor(...args: any[]) {
                container = container || DefaultContainer.getInstance();

                const metadata = DependencyMetadata.fromObject(constructor);
                const ctorArgs = Array.prototype.slice.call(arguments, 0);

                if (typeof metadata !== "undefined") {
                    metadata.methods.forEach((dependencies, methodName) => {
                        if (methodName === "constructor") {
                            resolveDependencies(dependencies, ctorArgs, container);
                        } else {
                            // tslint:disable-next-line:ban-types
                            const method = constructor.prototype[methodName] as Function;
                            const wrapper = function() {
                                const methodArgs = Array.prototype.slice.call(arguments, 0);
                                resolveDependencies(dependencies, methodArgs, container);
                                method.apply(this, methodArgs);
                            };
                            constructor.prototype[methodName] = wrapper;
                        }
                    });
                }

                super(...ctorArgs);

                if (typeof metadata !== "undefined") {
                    resolveDependencies(metadata.properties, this, container);
                }
            }
        }
    )
);

const resolveDependencies = (dependencies: Map<number | string, string>, dest: {}, container: IContainer) => {
    dependencies.forEach((dependencyRef, index) => {
        dest[index] = (typeof dest[index] !== "undefined") ? dest[index] : container.get(dependencyRef);
    });
};
