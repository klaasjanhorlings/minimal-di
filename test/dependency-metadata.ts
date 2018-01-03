import { expect } from "chai";
import "mocha";
import { DependencyMetadata } from "../src/dependency-metadata";

// tslint:disable:no-unused-expression typedef

describe("DependencyMetadata", function() {
    let metadata: DependencyMetadata;
    beforeEach(function() {
        metadata = new DependencyMetadata();
    });

    describe("addConstructorParameter()", function() {
        it("should create a new entry named \"constructor\" in the methods map", function() {
            // Act
            metadata.addConstructorParameter(0, "dependencyName", { required: true });

            // Assert
            expect(metadata.methods).
                to.have.key("constructor");
        });

        it("should add the dependencies at the expected index", function() {
            // Act
            metadata.addConstructorParameter(0, "firstDependencyName", { required: false });
            metadata.addConstructorParameter(3, "secondDependencyName", { required: true });

            // Assert
            const ctorEntries = metadata.methods.get("constructor");
            expect(ctorEntries.get(0)).
                to.be.deep.equal({ name: "firstDependencyName", options: { required: false }});
            expect(ctorEntries.get(3)).
                to.be.deep.equal({ name: "secondDependencyName", options: { required: true }});
        });
    });

    describe("addMethodParameter()", function() {
        it("should create a new entry in the methods map", function() {
            // Act
            metadata.addMethodParameter("methodName", 0, "dependencyName", { required: true });

            // Assert
            expect(metadata.methods).
                to.have.key("methodName");
        });

        it("should add the dependencies at the expected index", function() {
            // Act
            metadata.addMethodParameter("methodName", 0, "firstDependencyName", { required: true });
            metadata.addMethodParameter("methodName", 3, "secondDependencyName", { required: false });

            // Assert
            const ctorEntries = metadata.methods.get("methodName");
            expect(ctorEntries.get(0)).
                to.be.deep.equal({ name: "firstDependencyName", options: { required: true }});
            expect(ctorEntries.get(3)).
                to.be.deep.equal({ name: "secondDependencyName", options: { required: false }});
        });
    });

    describe("addProperty()", function() {
        it("should create a new entry in the methods map with the passed value", function() {
            // Act
            metadata.addProperty("propertyName", "dependencyName", { required: true });

            // Assert
            expect(metadata.properties).
                to.be.have.key("propertyName");
            expect(metadata.properties.get("propertyName")).
                to.be.deep.equal({ name: "dependencyName", options: { required: true }});
        });
    });

    describe("store() and load()", function() {
        it("should retrieve the same object as is stored", function() {
            // Arrange
            metadata.addConstructorParameter(1, "firstDependencyName", { required: true });
            metadata.addProperty("propertyName", "secondDependencyName", { required: true });
            const target = {};

            // Act
            metadata.store(target);

            // Assert
            expect(DependencyMetadata.fromObject(target)).
                to.be.equal(metadata);
        });
    });
});
