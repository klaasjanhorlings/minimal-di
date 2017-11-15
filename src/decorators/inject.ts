import { IContainer, DefaultContainer } from "../container";
import DependencyMetadata from "../dependency-metadata";

/**
 * Notifies that the class has dependencies. Wraps the constructor in an automatically resolving wrapper.
 * @param container The container used to resolve dependencies for this. Defaults to DefaultContainer.
 */
export const inject = (container?: IContainer) => (
    <T extends { new(...args: any[]): any }>(constructor: T) => (
        class extends constructor {
            constructor(...args: any[]) {
                container = container || DefaultContainer.getInstance();

                const metadata = DependencyMetadata.fromObject(constructor);
                const ctorArgs = Array.prototype.slice.call(arguments, 0);

                if (typeof metadata !== "undefined") {
                    metadata.methods.forEach((dependencies, methodName) => {
                        if (methodName === "constructor") {
                            resolveDependencies(dependencies, ctorArgs, container);
                        } else {
                            const method = constructor.prototype[methodName] as Function;
                            const wrapper = function() {
                                const args = Array.prototype.slice.call(arguments, 0);
                                resolveDependencies(dependencies, args, container);
                                method.apply(this, args);
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

const resolveDependencies = (dependencies: Map<number | string, string>, dest: any, container: IContainer) => {
    dependencies.forEach((dependencyRef, index) => {
        dest[index] = (typeof dest[index] !== "undefined") ? dest[index] : container.get(dependencyRef);
    });
}