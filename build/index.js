"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependency_1 = require("./decorators/dependency");
exports.dependency = dependency_1.dependency;
var inject_1 = require("./decorators/inject");
exports.inject = inject_1.inject;
var register_1 = require("./decorators/register");
exports.register = register_1.register;
var container_1 = require("./container");
exports.DefaultContainer = container_1.DefaultContainer;
