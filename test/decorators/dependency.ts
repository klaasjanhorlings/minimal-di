import "mocha";
import { expect } from "chai";
import DependencyMetadata from "../../src/dependency-metadata";
import { DefaultContainer } from "../../src/container";
import { dependency } from "../../src/decorators/dependency";

describe("@dependency decorator", function() {
    describe("PropertyDecorator", function() {
        it("should create and store a new DependencyMetadata object when first encountered", function() {
            // arrange
            const target = {};

            // act
            dependency("dependencyName")(target, "propertyName");

            // assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata).
                to.not.be.undefined;
            expect(metadata.properties).
                to.have.key("propertyName");
            expect(metadata.properties.get("propertyName")).
                to.be.equal("dependencyName");
        });
    });
    
    describe("ConstructorParameterDecorator", function() {
        it("should create and store a new DependencyMetadata object when first encountered", function() {
            // arrange
            const target = {};
            
            // act
            dependency("dependencyName")(target, undefined, 0);

            // assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata).
                to.not.be.undefined;
            expect(metadata.methods).
                to.have.key("constructor");
            expect(metadata.methods.get("constructor").get(0)).
                to.be.equal("dependencyName");
        });

        it("should support multiple dependencies per method", function() {
            // arrange
            const target = {};

            // act
            dependency("dependencyName")(target, undefined, 0);
            dependency("altDependency")(target, undefined, 3);

            // assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata.methods.get("constructor").get(0)).
                to.be.equal("dependencyName");
            expect(metadata.methods.get("constructor").get(3)).
                to.be.equal("altDependency");
        });
    });

    describe("MethodParameterDecorator", function() {
        it("should create and store a new DependencyMetadata object when first encountered", function() {
            // arrange
            const target = {};
            
            // act
            dependency("dependencyName")(target, "methodName", 0);

            // assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata).
                to.not.be.undefined;
            expect(metadata.methods).
                to.have.key("methodName");
            expect(metadata.methods.get("methodName").get(0)).
                to.be.equal("dependencyName");
        });

        it("should support multiple dependencies per method", function() {
            // arrange
            const target = {};

            // act
            dependency("dependencyName")(target, "methodName", 0);
            dependency("altDependency")(target, "methodName", 3);

            // assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata.methods.get("methodName").get(0)).
                to.be.equal("dependencyName");
            expect(metadata.methods.get("methodName").get(3)).
                to.be.equal("altDependency");
        });
    });
});