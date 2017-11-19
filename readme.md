# minimal-di

## What is minimal-di
*Todo*

## Changelog
*Todo*

## Examples
```Javascript
// @inject wraps the class' constructor so that future instantiations will automatically be injected
@inject

// @register registers a dependency with the DefaultContainer. You can also supply an alternative  container
@register("Example")
class Example {
    // This property will automatically be injected after the main constructor has run
    @inject("DependencyA")
    private property: DependencyA;

    constructor(
        // This parameter will automatically replaced before the main constructor is called
        @inject("DependencyB")
        private ctorParam: DependencyB = null;
    ) {}

    method(
        // This parameter will automatically replaced every time before the method is called
        @inject("DependencyB")
        private ctorParam: DependencyB = null;
    ) {}
}
```