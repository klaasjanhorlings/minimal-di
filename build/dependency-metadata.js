"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.metadataKey = "dependencies";
class DependencyMetadata {
    constructor() {
        this.properties = new Map();
        this.methods = new Map();
    }
    static fromObject(target) {
        return Reflect.getMetadata(exports.metadataKey, target);
    }
    store(target) {
        Reflect.defineMetadata(exports.metadataKey, this, target);
    }
    addConstructorParameter(parameterIndex, dependency, options) {
        this.addMethodParameter("constructor", parameterIndex, dependency, options);
    }
    // tslint:disable-next-line:max-line-length
    addMethodParameter(methodName, parameterIndex, dependency, options) {
        const method = this.methods.get(methodName) || new Map();
        method.set(parameterIndex, { name: dependency, options });
        this.methods.set(methodName, method);
    }
    addProperty(propertyName, dependency, options) {
        this.properties.set(propertyName, { name: dependency, options });
    }
}
exports.DependencyMetadata = DependencyMetadata;
