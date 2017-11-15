import { expect } from "chai";
import "mocha";
import { stub } from "sinon";
import { DefaultContainer } from "../../src/container";
import { register } from "../../src/decorators/register";

/* tslint:disable:max-classes-per-file */

class MockContainer extends DefaultContainer {}
const registerStub = stub(MockContainer.prototype, "registerConstructor");
const getStub = stub(MockContainer.prototype, "get");
class Mock {}

describe("@register decorator", function() {
    beforeEach(function() {
        registerStub.reset();
        getStub.reset();
        DefaultContainer.setInstance(new MockContainer());
    });

    after(function() {
        DefaultContainer.setInstance(undefined);
    });

    it("should register on the DefaultContainer if no container argument is passed", function() {
        // Act
        register("dependencyName")(Mock);

        // Assert
        expect(registerStub.callCount).
            to.be.equal(1);
    });

    it("should register on the passed container if passed", function() {
        // Arrange
        const container = new MockContainer();

        // Act
        register("dependencyName", container)(Mock);

        // Assert
        expect(registerStub.firstCall.thisValue).
            to.be.equal(container);
    });

    it("should pass a get method that returns a new instance of the registered class", function() {
        // Act
        register("dependencyName")(Mock);

        // Assert
        const factory = registerStub.firstCall.args[1];
        expect(factory).
            to.be.instanceof(Function);
        expect(factory).
            to.be.equal(Mock);
    });
});
