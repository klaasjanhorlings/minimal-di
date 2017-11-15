import "mocha";
import { register, dependency, inject, DefaultContainer } from "../src/index";
import { spy } from "sinon";
import { expect } from "chai";
import DependencyMetadata from "../src/dependency-metadata";

describe("Integration tests", function() {
    describe("Dependency chain", function() {
        beforeEach(function() {
            DefaultContainer.setInstance(null);
        });

        it(`should initialize all dependencies`, function() {
            // arrange            
            @register("RootDependency")
            class RootDependency { }
            
            @register("DependencyA")
            @inject()
            class DependencyA {
                constructor(
                    @dependency("RootDependency") public rootDependency?
                ) { }
            }
            
            @inject()
            class DependencyB {
                constructor(
                    @dependency("DependencyA") public dependencyA?
                ) { }
            }

            // act
            const depB = new DependencyB();

            // assert
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

        it(`throws an error with a clear explanation when an loop is detected`, function() {
            @register("DependencyA")
            @inject()
            class DependencyA {
                constructor(
                    @dependency("DependencyB") public dependencyB?
                ) { }
            }
            
            @register("DependencyB")
            @inject()
            class DependencyB {
                constructor(
                    @dependency("DependencyC") public dependencyC?
                ) { }
            }

            @register("DependencyC")
            @inject()
            class DependencyC {
                constructor(
                    @dependency("DependencyA") public dependencyA?
                ) { }
            }

            @register("Dependency")
            @inject()
            class Dependency {
                constructor(
                    @dependency("DependencyA") public dependencyA?
                ) { }
            }

            expect(() => DefaultContainer.getInstance().get("Dependency")).
                to.throw(`Loop detected, DependencyA (indirectly) depends on itself Dependency -> [DependencyA] -> DependencyB -> DependencyC -> [DependencyA]`);
        })
    });
});