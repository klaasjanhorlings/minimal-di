import "mocha";
import { expect } from "chai";
import { inject } from "../../src/decorators/inject";
import { spy } from "sinon";
import { DefaultContainer } from "../../src/container";
import { dependency } from "../../src/decorators/dependency";

class MockBase {
    constructor(...args: any[]) {
        watch.constructor.apply(this, arguments);
    }

    testMethod(...args: any[]) {
        watch.testMethod.apply(this, arguments);
    }
};

const watch = {
    constructor: spy(),
    testMethod: spy()
};

describe(`@inject decorator`, function() {
    beforeEach(function() {
        for (let key in watch) {
            watch[key].reset();
        }
        DefaultContainer.setInstance(null);
    })

    describe(`constructor`, function() {
        it("should call the parent constructor and return an instance of the parent object", function() {
            // arrange
            class Mock extends MockBase {}
            
            // act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();

            // assert
            expect(instance).
                to.be.instanceof(Mock);
            expect(watch.constructor.callCount).
                to.be.equal(1)
        });

        it("should pass any arguments to the parent constructor", function() {
            // arrange
            class Mock extends MockBase {}

            // act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock(1, 2, 3);
            
            // assert
            expect(watch.constructor.firstCall.args).
                to.be.deep.equal([1, 2, 3]);
        });

        it("should replace dependency constructor parameters if not provided", function() {
            // arrange
            class Mock extends MockBase {}
            DefaultContainer.getInstance().registerFactory("dependencyA", () => "injectionA");
            DefaultContainer.getInstance().registerFactory("dependencyB", () => "injectionB");
            dependency("dependencyA")(Mock, undefined, 0);
            dependency("dependencyB")(Mock, undefined, 1);
            
            // act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock("paramA");

            // assert
            expect(watch.constructor.firstCall.args).
                to.be.deep.equal(["paramA", "injectionB"]);
        });
    });

    describe(`properties`, function() {
        it("should inject dependency properties on creation", function() {
            // arrange
            class Mock extends MockBase {}
            DefaultContainer.getInstance().registerFactory("dependencyA", () => "injectionA");
            DefaultContainer.getInstance().registerFactory("dependencyB", () => "injectionB");
            dependency("dependencyA")(Mock, "propertyA");
            dependency("dependencyB")(Mock, "propertyB");

            // act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();
            
            // assert
            expect(instance).
                to.have.property("propertyA", "injectionA");
            expect(instance).
                to.have.property("propertyB", "injectionB");
        });
    });

    describe(`methods`, function() {
        it("should call and pass any arguments to the parent method", function() {
            // arrange
            class Mock extends MockBase {}
            const injectedMock = inject()(Mock);

            // act
            const instance = new injectedMock();
            instance.testMethod(1, 2, 3);
            
            // assert
            expect(watch.testMethod.firstCall.args).
                to.be.deep.equal([1, 2, 3]);
        });

        it("should replace dependency method parameters if not provided", function() {
            // arrange
            class Mock extends MockBase {}
            DefaultContainer.getInstance().registerFactory("dependencyA", () => "injectionA");
            DefaultContainer.getInstance().registerFactory("dependencyB", () => "injectionB");
            dependency("dependencyA")(Mock, "testMethod", 0);
            dependency("dependencyB")(Mock, "testMethod", 1);

            // act
            const injectedMock = inject()(Mock);
            const instance = new injectedMock();
            instance.testMethod("paramA");

            // assert
            expect(watch.testMethod.firstCall.args).
                to.be.deep.equal(["paramA", "injectionB"]);
        });
    });
})