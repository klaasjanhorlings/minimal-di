import { expect } from "chai";
import "mocha";
import { DefaultContainer } from "../../src/container";
import { dependency } from "../../src/decorators/dependency";
import { DependencyMetadata } from "../../src/dependency-metadata";

describe("@dependency decorator", function() {
    describe("PropertyDecorator", function() {
        it("should create and store a new DependencyMetadata object when first encountered", function() {
            // Arrange
            const target = {};

            // Act
            dependency("dependencyName")(target, "propertyName");

            // Assert
            const metadata = DependencyMetadata.fromObject(target);
            // tslint:disable-next-line:no-unused-expression
            expect(metadata).
                to.not.be.equal(undefined);
            expect(metadata.properties).
                to.have.key("propertyName");
            expect(metadata.properties.get("propertyName")).
                to.be.equal("dependencyName");
        });
    });

    describe("ConstructorParameterDecorator", function() {
        it("should create and store a new DependencyMetadata object when first encountered", function() {
            // Arrange
            const target = {};

            // Act
            dependency("dependencyName")(target, undefined, 0);

            // Assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata).
                to.not.be.equal(undefined);
            expect(metadata.methods).
                to.have.key("constructor");
            expect(metadata.methods.get("constructor").get(0)).
                to.be.equal("dependencyName");
        });

        it("should support multiple dependencies per method", function() {
            // Arrange
            const target = {};

            // Act
            dependency("dependencyName")(target, undefined, 0);
            dependency("altDependency")(target, undefined, 3);

            // Assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata.methods.get("constructor").get(0)).
                to.be.equal("dependencyName");
            expect(metadata.methods.get("constructor").get(3)).
                to.be.equal("altDependency");
        });
    });

    describe("MethodParameterDecorator", function() {
        it("should create and store a new DependencyMetadata object when first encountered", function() {
            // Arrange
            const target = {};

            // Act
            dependency("dependencyName")(target, "methodName", 0);

            // Assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata).
                to.not.be.equal(undefined);
            expect(metadata.methods).
                to.have.key("methodName");
            expect(metadata.methods.get("methodName").get(0)).
                to.be.equal("dependencyName");
        });

        it("should support multiple dependencies per method", function() {
            // Arrange
            const target = {};

            // Act
            dependency("dependencyName")(target, "methodName", 0);
            dependency("altDependency")(target, "methodName", 3);

            // Assert
            const metadata = DependencyMetadata.fromObject(target);
            expect(metadata.methods.get("methodName").get(0)).
                to.be.equal("dependencyName");
            expect(metadata.methods.get("methodName").get(3)).
                to.be.equal("altDependency");
        });
    });
});
