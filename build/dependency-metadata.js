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
    addConstructorParameter(parameterIndex, dependency) {
        this.addMethodParameter("constructor", parameterIndex, dependency);
    }
    addMethodParameter(methodName, parameterIndex, dependency) {
        const method = this.methods.get(methodName) || new Map();
        method.set(parameterIndex, dependency);
        this.methods.set(methodName, method);
    }
    addProperty(propertyName, dependency) {
        this.properties.set(propertyName, dependency);
    }
}
exports.DependencyMetadata = DependencyMetadata;
