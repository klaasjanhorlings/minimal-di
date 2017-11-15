import { expect } from "chai";
import "mocha";
import { spy } from "sinon";
import { DependencyMetadata } from "../src/dependency-metadata";
import { DefaultContainer, dependency, inject, register } from "../src/index";

/* tslint:disable:max-classes-per-file */

describe("Integration tests", function() {
    describe("Dependency chain", function() {
        beforeEach(function() {
            DefaultContainer.setInstance(undefined);
        });

        it("should initialize all dependencies", function() {
            // Arrange
            @register("RootDependency")
            class RootDependency { }

            @register("DependencyA")
            @inject()
            class DependencyA {
                public constructor(
                    @dependency("RootDependency") public rootDependency?,
                ) { }
            }

            @inject()
            class DependencyB {
                public constructor(
                    @dependency("DependencyA") public dependencyA?,
                ) { }
            }

            // Act
            const depB = new DependencyB();

            // Assert
            expect(depB).
                to.have.property("dependencyA");
            expect(depB.dependencyA).
                to.be.instanceof(DependencyA);

            const depA = depB.dependencyA;
            expect(depA).
                to.have.property("rootDependency");
            expect(depA.rootDependency).
                to.be.instanceof(RootDependency);
        });

        it("throws an error with a clear explanation when an loop is detected", function() {
            @register("DependencyA")
            @inject()
            class DependencyA {
                public constructor(
                    @dependency("DependencyB") public dependencyB?,
                ) { }
            }

            @register("DependencyB")
            @inject()
            class DependencyB {
                public constructor(
                    @dependency("DependencyC") public dependencyC?,
                ) { }
            }

            @register("DependencyC")
            @inject()
            class DependencyC {
                public constructor(
                    @dependency("DependencyA") public dependencyA?,
                ) { }
            }

            @register("Dependency")
            @inject()
            class Dependency {
                public constructor(
                    @dependency("DependencyA") public dependencyA?,
                ) { }
            }

            expect(() => DefaultContainer.getInstance().get("Dependency")).
                to.throw("Loop detected, DependencyA (indirectly) depends on itself " +
                    "Dependency -> [DependencyA] -> DependencyB -> DependencyC -> [DependencyA]");
        });
    });
});
