# Trier

`Trier` is a JavaScript/TypeScript utility class that simplifies the process of error handling and recovery in your application. By encapsulating your error-prone code within `try` and `catch` blocks, and specifying appropriate callback functions, you can easily manage and recover from errors without cluttering your code with verbose error handling.

## Getting Started

To use `Trier`, simply import it into your project:

```js
import { Trier } from "simple-trier";
```

or

```js
const { Trier } = require("simple-trier");
```

## Usage

To create a new instance of `Trier`, you can pass an optional `callerName` and `options` object to the constructor:

```js
const myTrier = new Trier("myFunction", { canPrintError: false });
```

You can then chain together a series of callbacks using the `try`, `catch`, `executeIfNoError`, and `finally` methods. These callbacks will be executed in the order that they are chained, and can be either synchronous or asynchronous.

```js
myTrier
  .try(() => {
    // your error-prone code here
  })
  .catch((err) => {
    console.error(`An error occurred: ${err.message}`);
  })
  .executeIfNoError(() => {
    console.log("The code executed without any errors");
  })
  .finally(() => {
    console.log(
      "This will always execute, regardless of whether there was an error or not"
    );
  })
  .run();
```

If you have any asynchronous code, you can use the `tryAsync` method instead:

```js
myTrier
  .tryAsync(async () => {
    // your asynchronous error-prone code here
  })
  .catch((err) => {
    console.error(`An error occurred: ${err.message}`);
  })
  .executeIfNoError(() => {
    console.log("The code executed without any errors");
  })
  .finally(() => {
    console.log(
      "This will always execute, regardless of whether there was an error or not"
    );
  })
  .runAsync();
```

## Options

When creating a new instance of `Trier`, you can pass an optional options object that contains the following properties:

- `callerName`: a string that identifies the name of the caller function or module. This is useful for logging purposes when there are multiple Trier instances in your application.
- `canPrintError`: a boolean that specifies whether to log error messages to the console. The default value is `true`.
- `shouldThrowError`: a boolean that specifies whether to re-throw errors after they have been caught by `Trier`. The default value is `false`.

```js
const myTrier = new Trier("myFunction", {
  canPrintError: false,
  shouldThrowError: true,
});
```

## Static Methods

`Trier` also contains a static method that allows you to change the global configuration options for all instances of `Trier`. This can be useful if you have a lot of `Trier` instances in your application and you want to change their default behavior.

```js
Trier.changeGlobalConfigs({ canPrintError: false, shouldThrowError: true });
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
