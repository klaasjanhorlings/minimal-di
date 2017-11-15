import { IContainer, DefaultContainer } from "../container";

/**
 * Register this class as a dependency solution.
 * @param identifier The identifier used when referencing this class as a dependency.
 * @param container The container used to register this dependency on. Defaults to DefaultContainer.
 * @param isSingleton If true the same instance is object is returned every time. Defaults to false.
 */
export const register = (identifier: string, container?: IContainer, isSingleton?: boolean) => (
    (constructor: Function) => {
        container = container || DefaultContainer.getInstance();
        container.registerConstructor(identifier, constructor as FunctionConstructor, isSingleton);
    }
)