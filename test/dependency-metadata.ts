import "mocha";
import { expect } from "chai";
import DependencyMetadata from "../src/dependency-metadata";

describe("DependencyMetadata", function() {
    let metadata: DependencyMetadata;
    beforeEach(function() {
        metadata = new DependencyMetadata();
    })
    
    describe("addConstructorParameter()", function() {
        it("should create a new entry named \"constructor\" in the methods map", function() {
            // act
            metadata.addConstructorParameter(0, "dependencyName");

            // assert
            expect(metadata.methods).
                to.have.key("constructor");
        });

        it("should add the dependencies at the expected index", function() {
            // act
            metadata.addConstructorParameter(0, "firstDependencyName");
            metadata.addConstructorParameter(3, "secondDependencyName");

            // assert
            const ctorEntries = metadata.methods.get("constructor");
            expect(ctorEntries.get(0)).
                to.be.equal("firstDependencyName");
            expect(ctorEntries.get(3)).
                to.be.equal("secondDependencyName");
        });
    });

    describe("addMethodParameter()", function() {
        it("should create a new entry in the methods map", function() {
            // act
            metadata.addMethodParameter("methodName", 0, "dependencyName");

            // assert
            expect(metadata.methods).
                to.have.key("methodName");
        });

        it("should add the dependencies at the expected index", function() {
            // act
            metadata.addMethodParameter("methodName", 0, "firstDependencyName");
            metadata.addMethodParameter("methodName", 3, "secondDependencyName");

            // assert
            const ctorEntries = metadata.methods.get("methodName");
            expect(ctorEntries.get(0)).
                to.be.equal("firstDependencyName");
            expect(ctorEntries.get(3)).
                to.be.equal("secondDependencyName");
        });
    });

    describe("addProperty()", function() {
        it("should create a new entry in the methods map with the passed value", function() {
            // act
            metadata.addProperty("propertyName", "dependencyName");

            // assert
            expect(metadata.properties).
                to.be.have.key("propertyName");
            expect(metadata.properties.get("propertyName")).
                to.be.equal("dependencyName");
        });
    });

    describe("store() and load()", function() {
        it("should retrieve the same object as is stored", function() {
            // arrange
            metadata.addConstructorParameter(1, "firstDependencyName");
            metadata.addProperty("propertyName", "secondDependencyName");
            const target = {};

            // store
            metadata.store(target);

            // assert
            expect(DependencyMetadata.fromObject(target)).
                to.be.equal(metadata);
        });
    });
});
