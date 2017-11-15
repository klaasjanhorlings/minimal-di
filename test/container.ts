import "mocha";
import { expect } from "chai";
import { spy } from "sinon";
import { DefaultContainer } from "../src/container";

describe("DefaultContainer", function() {
    beforeEach(function() {
        DefaultContainer.setInstance(null);
    });

    describe("getInstance()", function() {
        it("should return an instance of DefaultContainer", function() {
            // arrange
            const container = DefaultContainer.getInstance();

            // assert
            expect(container).
                to.be.instanceof(DefaultContainer);
        });

        it("should always return the same instance", function() {
            // arrange
            const containerA = DefaultContainer.getInstance();
            const containerB = DefaultContainer.getInstance();

            // assert
            expect(containerA).
                to.be.equal(containerB);
        });
    });

    describe("get()", function() {
        it("should throw when passed identifier is unknown", function() {
            // arrange
            const container = DefaultContainer.getInstance();

            // assert
            expect(() => container.get("unknownIdentifier")).
                to.throw();
        });

        describe("transient behaviour", function() {
            it("should call the passed get method to get an instance", function() {
                // arrange
                const container = DefaultContainer.getInstance();
                const cb = spy();
                container.registerFactory("dep", cb);

                // act
                container.get("dep");

                // assert
                expect(cb.callCount).
                    to.be.equal(1);
            });

            it("should call the passed get method each time it's called", function() {
                // arrange
                const container = DefaultContainer.getInstance();
                const cb = spy();
                container.registerFactory("dep", cb);

                // act
                container.get("dep");
                container.get("dep");

                // assert
                expect(cb.callCount).
                    to.be.equal(2);
            });
        });

        describe("singleton behaviour", function() {
            it("should call the passed method to get an instance", function() {
                // arrange
                const container = DefaultContainer.getInstance();
                const cb = spy();
                container.registerFactory("dep", cb, true);

                // act
                container.get("dep");

                // assert
                expect(cb.callCount).
                    to.be.equal(1);
            });
            
            it("should call the passed get method only once", function() {
                // arrange
                const container = DefaultContainer.getInstance();
                const cb = spy(() => ({}));
                container.registerFactory("dep", cb, true);

                // act
                container.get("dep");
                container.get("dep");

                // assert
                expect(cb.callCount).
                    to.be.equal(1);
            });
            
            it("should always return the same instance", function() {
                // arrange
                const container = DefaultContainer.getInstance();
                const instance = {};
                const cb = spy(() => instance);
                container.registerFactory("dep", cb, true);

                // act
                const instanceA = container.get("dep");
                const instanceB = container.get("dep");

                // assert
                expect(instanceA).
                    to.be.equal(instanceB);
            });
        });
    });
});