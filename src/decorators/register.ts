import { DefaultContainer, IContainer } from "../container";

/**
 * Register this class as a dependency solution.
 * @param identifier The identifier used when referencing this class as a dependency.
 * @param container The container used to register this dependency on. Defaults to DefaultContainer.
 * @param isSingleton If true the same instance is object is returned every time. Defaults to false.
 */
export const register = (identifier: string, options?: Partial<RegisterOptions>) => (
    // tslint:disable-next-line:ban-types
    (constructor: Function) => {
        const mergedOptions: RegisterOptions = {
            ...mergeDefaultOptions(),
            ...options,
        };
        mergedOptions.container.registerConstructor(identifier,
                                                    constructor as FunctionConstructor,
                                                    (mergedOptions.isSingleton));
    }
);

const mergeDefaultOptions: (options?: Partial<RegisterOptions>) => RegisterOptions = (options) => ({
    container: DefaultContainer.getInstance(),
    isSingleton: false,
    ...options,
});

export type RegisterOptions = {
    container: IContainer;
    isSingleton: boolean;
};
