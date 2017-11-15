import { expect } from "chai";
import "mocha";
import { spy } from "sinon";
import { DefaultContainer } from "../../src/container";
import { dependency } from "../../src/decorators/dependency";
import { inject } from "../../src/decorators/inject";

/* tslint:disable:max-classes-per-file */

class MockBase {
    // tslint:disable-next-line:no-any
    public constructor(...args: any[]) {
        watch.constructor.apply(this, arguments);
    }

    // tslint:disable-next-line:no-any
    public testMethod(...args: any[]) {
        watch.testMethod.apply(this, arguments);

        return "test";
    }
}

const watch = {
    constructor: spy(),
    testMethod: spy(),
};

describe("@inject decorator", function() {
    beforeEach(function() {
        // tslint:disable-next-line:forin
        for (const key in watch) {
            watch[key].reset();
        }
        DefaultContainer.setInstance(undefined);
    });

    describe("constructor", function() {
        it("should call the parent constructor and return an instance of the parent object", function() {
            // Arrange
            class Mock extends MockBase {}

            // Act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();

            // Assert
            expect(instance).
                to.be.instanceof(Mock);
            expect(watch.constructor.callCount).
                to.be.equal(1);
        });

        it("should pass any arguments to the parent constructor", function() {
            // Arrange
            class Mock extends MockBase {}

            // Act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock(1, 2, 3);

            // Assert
            expect(watch.constructor.firstCall.args).
                to.be.deep.equal([1, 2, 3]);
        });

        it("should replace dependency constructor parameters if not provided", function() {
            // Arrange
            class Mock extends MockBase {}
            DefaultContainer.getInstance().registerFactory("dependencyA", () => "injectionA");
            DefaultContainer.getInstance().registerFactory("dependencyB", () => "injectionB");
            dependency("dependencyA")(Mock, undefined, 0);
            dependency("dependencyB")(Mock, undefined, 1);

            // Act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock("paramA");

            // Assert
            expect(watch.constructor.firstCall.args).
                to.be.deep.equal(["paramA", "injectionB"]);
        });
    });

    describe("properties", function() {
        it("should inject dependency properties on creation", function() {
            // Arrange
            class Mock extends MockBase {}
            DefaultContainer.getInstance().registerFactory("dependencyA", () => "injectionA");
            DefaultContainer.getInstance().registerFactory("dependencyB", () => "injectionB");
            dependency("dependencyA")(Mock, "propertyA");
            dependency("dependencyB")(Mock, "propertyB");

            // Act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();

            // Assert
            expect(instance).
                to.have.property("propertyA", "injectionA");
            expect(instance).
                to.have.property("propertyB", "injectionB");
        });
    });

    describe("methods", function() {
        it("should call and pass any arguments to the parent method", function() {
            // Arrange
            class Mock extends MockBase {}
            const injectedMock = inject()(Mock);

            // Act
            const instance = new injectedMock();
            instance.testMethod(1, 2, 3);

            // Assert
            expect(watch.testMethod.firstCall.args).
                to.be.deep.equal([1, 2, 3]);
        });

        it("should replace dependency method parameters if not provided", function() {
            // Arrange
            class Mock extends MockBase {}
            DefaultContainer.getInstance().registerFactory("dependencyA", () => "injectionA");
            DefaultContainer.getInstance().registerFactory("dependencyB", () => "injectionB");
            dependency("dependencyA")(Mock, "testMethod", 0);
            dependency("dependencyB")(Mock, "testMethod", 1);

            // Act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();
            instance.testMethod("paramA");

            // Assert
            expect(watch.testMethod.firstCall.args).
                to.be.deep.equal(["paramA", "injectionB"]);
        });

        it("should return the return value of the wrapped method", function() {
            // Arrange
            class Mock extends MockBase {}

            // Act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();

            // Assert
            expect(instance.testMethod("paramA", "paramB")).
                to.be.equal("test");
        });
    });
});
