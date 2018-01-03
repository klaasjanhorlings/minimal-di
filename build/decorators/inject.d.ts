import { IContainer } from "../container";
/**
 * Notifies that the class has dependencies. Wraps the constructor in an automatically resolving wrapper.
 * @param container The container used to resolve dependencies for this. Defaults to DefaultContainer.
 */
export declare const inject: (options?: Partial<InjectOptions> | undefined) => <TClass extends new (...args: any[]) => any>(constructor: TClass) => {
    new (...ctorArgs: any[]): {
        [x: string]: any;
    };
} & TClass;
export declare type InjectOptions = {
    container: IContainer;
};
