import { expect } from "chai";
import "mocha";
import { spy } from "sinon";
import { DefaultContainer } from "../src/container";

describe("DefaultContainer", function() {
    beforeEach(function() {
        DefaultContainer.setInstance(undefined);
    });

    describe("getInstance()", function() {
        it("should return an instance of DefaultContainer", function() {
            // Arrange
            const container = DefaultContainer.getInstance();

            // Assert
            expect(container).
                to.be.instanceof(DefaultContainer);
        });

        it("should always return the same instance", function() {
            // Arrange
            const containerA = DefaultContainer.getInstance();
            const containerB = DefaultContainer.getInstance();

            // Assert
            expect(containerA).
                to.be.equal(containerB);
        });
    });

    describe("get()", function() {
        it("should throw when passed identifier is unknown", function() {
            // Arrange
            const container = DefaultContainer.getInstance();

            // Assert
            expect(() => container.get("unknownIdentifier")).
                to.throw();
        });

        describe("transient behaviour", function() {
            it("should call the passed get method to get an instance", function() {
                // Arrange
                const container = DefaultContainer.getInstance();
                const cb = spy();
                container.registerFactory("dep", cb);

                // Act
                container.get("dep");

                // Assert
                expect(cb.callCount).
                    to.be.equal(1);
            });

            it("should call the passed get method each time it's called", function() {
                // Arrange
                const container = DefaultContainer.getInstance();
                const cb = spy();
                container.registerFactory("dep", cb);

                // Act
                container.get("dep");
                container.get("dep");

                // Assert
                expect(cb.callCount).
                    to.be.equal(2);
            });
        });

        describe("singleton behaviour", function() {
            it("should call the passed method to get an instance", function() {
                // Arrange
                const container = DefaultContainer.getInstance();
                const cb = spy();
                container.registerFactory("dep", cb, true);

                // Act
                container.get("dep");

                // Assert
                expect(cb.callCount).
                    to.be.equal(1);
            });

            it("should call the passed get method only once", function() {
                // Arrange
                const container = DefaultContainer.getInstance();
                const cb = spy(() => ({}));
                container.registerFactory("dep", cb, true);

                // Act
                container.get("dep");
                container.get("dep");

                // Assert
                expect(cb.callCount).
                    to.be.equal(1);
            });

            it("should always return the same instance", function() {
                // Arrange
                const container = DefaultContainer.getInstance();
                const instance = {};
                const cb = spy(() => instance);
                container.registerFactory("dep", cb, true);

                // Act
                const instanceA = container.get("dep");
                const instanceB = container.get("dep");

                // Assert
                expect(instanceA).
                    to.be.equal(instanceB);
            });
        });
    });
});
