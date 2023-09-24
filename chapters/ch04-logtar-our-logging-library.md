[![Read Prev](/assets/imgs/prev.png)](/chapters/ch03-working-with-files.md)

# [`logtar`](https://github.com/ishtms/logtar) our own logging library

> Note: The entire code we write here can be found [at the code/chapter_04.0 directory](/code/chapter_04.0). This will be a single file, and we'll refactor in subsequent chapters.

Logging is an important part of creating robust and scaleable application. It helps developers find and fix problems, keep an eye on how the application is working, and see what users are doing.

## Initializing a new project

Let’s create a new project. Close your current working directory, or scrap it.

```bash
# Create a new directory, and cd into it
mkdir logtar && cd logtar

# Initializes a new package
npm init -y
```

This creates a new npm package/project, creates a `package.json` file and sets up some basic config inside it. This should be the contents of your `package.json`

```jsx
{
  "name": "logtar",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Let's change the version from `1.0.0` to `0.0.1`.

## A little about `SemVer`

Starting versioning from **`0.0.1`** is a good practice in software development because version numbers have semantic meaning. Using **`0.0.1`** as the initial version indicates that the software is in its initial development stages or that it's undergoing rapid changes and improvements. This convention aligns with Semantic Versioning ([SemVer](https://semver.org/)), which is a widely adopted versioning scheme that helps developers understand the compatibility and significance of changes in software releases.

Starting with **`0.0.1`** is particularly beneficial for a few reasons:

1. **Clarity of Development Stage**: Starting with **`0.0.1`** clearly communicates that the software is in its early stages of development. This helps other developers and users understand that the API and features might change more rapidly and might not yet be stable.
2. **Semantic Versioning**: Semantic Versioning consists of three numbers separated by dots: **`MAJOR.MINOR.PATCH`**. Starting from **`0.0.1`** indicates that you're in the process of making minor patches and potentially significant changes as you develop the software.
3. **Incremental Progress**: Starting with **`0.0.1`** allows for a clear sequence of version increments as development progresses. Each release can follow the rules of [SemVer](https://semver.org/): incrementing the **`MAJOR`** version for backward-incompatible changes, the **`MINOR`** version for backward-compatible additions, and the **`PATCH`** version for backward-compatible bug fixes.
4. **User Expectations**: When users or other developers encounter a software version that starts with **`0.0.1`**, they'll understand that the software might not be feature-complete or entirely stable. This helps manage expectations and reduces confusion.
5. **Preventing Confusion**: If you started with version **`1.0.0`**, there might be an expectation of stability and feature completeness that could lead to confusion if the software is actually in an early stage of development.

## Creating a `LogLevel` class

Log level is a basic concept in logging libraries. It helps control how much detail the application's log messages show. Developers use log levels to filter and manage the output. This is especially useful when debugging issues or dealing with complex systems.

Usually logging libraries have these 5 log levels (from least to most severe):

1. **Debug**: Detailed debugging information. Usually not used in production environments because it generates too much data.
2. **Info**: Informative messages about the regular flow of the application. Shows what the application is doing.
3. **Warning**: Indicates potential issues that might require attention. Warnings suggest that something might be going wrong.
4. **Error**: Reports errors or exceptional conditions that need to be addressed. These messages indicate that something has gone wrong and might affect the application's functionality.
5. **Critical/Fatal**: For severe errors that might crash the application or cause major malfunctions. These messages require immediate attention as they indicate critical failures.

> I prefer using `Class` over functions or objects to provide a better API. It's a powerful system in JavaScript, and I find it superior to factory functions. `Class` do have some draw backs but for our use case, they’re the best possible solution. If you’re un-aware of how classes work in javascript, just [go through this](https://github.com/ishtms/learn-javascript-easy-way/blob/master/chapters/14_classes.js) and [this page](https://github.com/ishtms/learn-javascript-easy-way/blob/master/chapters/15_inheritance_classes.js) on my another javascript learning resource.

When building a complex system or anticipating scalability, it's best to start simply and refactor as necessary. You don't need to use best practices from day one.

The process should be: write code, make it work, test it, and then refactor it.

Let’s create a new file `index.js` inside the `logtar` directory, and add a new class `LogLevel`

```jsx
// index.js

class LogLevel {
    static Debug = 0;
    static Info = 1;
    static Warn = 2;
    static Error = 3;
    static Critical = 4;
}

module.exports = {
    LogLevel,
};
```

You might be wondering about the use of a class `LogLevel` instead of an object, or maybe some constants that can be easily exported, like this -

```jsx
module.exports.LogLevel = {
    Debug: 0
    ...
}

// or

module.exports.Debug = 0
...
```

You could do something like this too, and that’s totally fine. But instead, I chose a different method i.e using a utility class `LogLevel` which encapsulates all log levels within a class, you create a clear namespace for these constants. This helps avoid potential naming conflicts with other variables or constants in your application. There’s more to this!

You will see another powerful feature by using this method, in a bit.

Let’s add a helper method to our `LogLevel` class which checks and verifies whether the `LogLevel` provided by our client (user of our library) is correct and supported.

```jsx
// index.js

class LogLevel {
    ...

    static assert(log_level) {
       if (
            log_level !== LogLevel.Debug ||
            log_level !== LogLevel.Info ||
            log_level !== LogLevel.Warn ||
            log_level !== LogLevel.Error ||
            log_level !== LogLevel.Critical
        ) {
            throw new Error(
            `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`);
        }
     }
}
```

What is this `assert` method going to do? `assert` will be a method used inside our library, which verifies that the value of type `LogLevel` provided as an argument is valid and supported.

However, we can refactor the code above to look more readable, and not repeat too much.

```jsx
// index.js

static assert(log_level) {
    if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Critical].includes(log_level)) {
        throw new Error(`log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`);
    }
 }
```

This way, if we wish to add more log levels, we can simply add them to the array. This is another powerful use-case of classes over normal object values. Everything is namespace’d. Even without typescript, we can tell the client (someone who uses our library) what arguments are we expecting. If they fail to provide an invalid argument, our `assert` method will throw an error.

Also, even if the user is unaware of the values we’re using for each log level, it does not matter as long as they’re using the `LogLevel.any_level` syntax. If we in future change the internals of the library, as long as the public API is consistent, everyone will be good. This is a key to build reliable APIs.

> I am going to use the terms `client` and `user` interchangeably. A `client` is someone who uses our library’s API.

The `LogLevel` looks fine for now. Let’s introduce a new class `Logger` which will be the backbone of our logging library.

## The `Logger` class

```jsx
// index.js

class LogLevel {...}

class Logger {
    /* Set the default value of `level` to be `LogLevel.Debug` for every
    * new instance of the `Logger` class
    */
    level = LogLevel.Debug;

    // Sets the log level to whatever user passed as an argument to `new Logger()`
    constructor(log_level) {
      this.level = log_level;
    }
}
```

There’s an issue. The user may construct the `Logger` with whatever value they want. This can be some useless value like `100000` or `“Hello”` and that’s not what we would expect.

For example

```jsx
// makes no sense
const my_logger = new Logger("test");
```

Let’s make use of the `LogLevel.assert()` static method that we just defined.

```jsx
// index.js

class LogLevel {...}

class Logger {
    level = LogLevel.Debug;

    constructor(log_level) {
        // Throw an error if the `log_level` is an unsupported value.
        LogLevel.assert(log_level);
        this.level = log_level;
    }
}
```

Now if we try to pass an invalid argument to the construction of `Logger` we get an error. Exactly what we want

```jsx
const logger = new Logger(6);

// outputs
Error: log_level must be an instance of LogLevel. Unsupported param "6"
    at LogLevel.assert (/Users/ishtmeet/Code/logtar/index.js:10:13)
    at new __Logger (/Users/ishtmeet/Code/logtar/index.js:86:14)
    at Object.<anonymous> (/Users/ishtmeet/Code/logtar/index.js:91:16)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47
```

Everything looks good! No, not yet. What if we try to do

```jsx
const logger = new Logger(LogLevel.Error);
logger.level = 1000;
```

Again, this breaks our whole library’s functionality. How do we prevent this? Seems like Javascript has us covered.

### Encapsulation with `private` fields

Class fields are public by default, which means anyone can change it from anywhere in the code. Even the clients of our library can change it too. However, you can create private class features by adding a hash `#` prefix. JavaScript enforces the privacy encapsulation of these class features.

Before this syntax existed, private members were not native to the language. In prototypical inheritance, their behavior can be emulated with `WeakMap` objects or closures. But using `#` syntax is more ergonomic than these methods.

> `members` of a class mean any thing that is defined inside the `class` block. That includes variables, static variables, or even methods. Note that if a function is defined inside a class, it's referred to as a `method` and not a `function`

Let's update the code above by incorporating `encapsulation`.

```javascript
// index.js

class LogLevel {...}

class Logger {
    // introduce a new `private` variable `#level`
    #level;

    constructor(log_level) {
        // You refer to private variables using the `#` prefix.
        this.#level = log_level;
    }
}

const logger = new Logger(LogLevel.Debug);
console.log(logger.#level); // Error: Private field '#level' must be declared in an enclosing class
logger.#level = LogLevel.Info; // Error: Private field '#level' must be declared in an enclosing class
```

This is looking good. We can refer to `#level` member variable only inside the class. No one can change it. But we do need to provide a way to know the current log level of our logger. Let's add a `getter` method.

```js
// index.js

class LogLevel {...}

class Logger {
    ...

    get level() {
        return this.#level;
    }
}

const logger = new Logger(LogLevel.Debug);
console.log(logger.#level); // Error: Private field '#level' must be declared in an enclosing class
console.log(logger.level); // Good. Calls the `get level()` method
```

> Note: If you create a getter using `get()`, you do not need to specify the parenthesis after `level`. Javascript knows that we're referring to the `get level()` getter.

Now, add the `LogLevel.assert` method inside the constructor, to make sure the clients pass in a correct value for the `log_level` constructor parameter.

```js
// index.js
class Logger {
    ..
    constructor(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
    }
    ..
}

const logger = new Logger(100); // Throws an error
const logger  = new Logger(3); // Good
const logger = new Logger(LogLevel.Debug); // Best practice
```

It's always a good practice to allow clients create an object without specifying a value in the constructor, in that case we should use some set defaults. The full code of the `index.js` should look like this

```js
// index.js

class LogLevel {
    static Debug = 0;
    static Info = 1;
    static Warn = 2;
    static Error = 3;
    static Critical = 4;

    static assert(log_level) {
        if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Critical].includes(log_level)) {
            throw new Error(
                `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`
            );
        }
    }
}

class Logger {
    // set a default value for the log level
    #level = LogLevel.Info;

    constructor(log_level) {
        // only set/check the log level if the client has provided it
        // otherwise use the default value, i.e `LogLevel.Info`
        if (arguments.length > 0) {
            LogLevel.assert(log_level);
            this.#level = log_level;
        }
    }

    get level() {
        return this.#level;
    }
}

module.exports = {
    Logger,
    LogLevel,
};
```

Let's try to test this.

```js
new Logger("OK"); // throws error
new Logger(LogLevel.Debug); // works fine
new Logger(); // works fine

let logger = new Logger(LogLevel.Warn);
logger.level; // returns the `level` because of the getter `level()`
logger.#level; // throws error
logger.#level = LogLevel.Warning; // throws error
logger.level = 10; // throws error
```

Perfect! This all looks really good. We are confident that neither clients nor our own library's code will affect the internals of the library. Please note that only the `#level` member variable can be changed from within the class Logger's scope, which is exactly what we want.

## The `LogConfig` class

We have a bare bones `Logger` setup, which isn't helpful at all. Let's make it a bit more useful.

You see, setting the log level inside the logger is fine until we start adding a lot of config settings. For example, we may add a `file_prefix` member variable, as well as some other configuration related variables. In that case, the `Logger` class will get cluttered too much, and that's not what we want.

Let's start refactoring now. Create a new class `LogConfig` that will contain all the utility helpers to deal with log config. Everything that take cares about the configuration will live inside it.

```js
// index.js

class LogConfig {
    /** Define necessary member variables, and make them private. */

    // log level will live here, instead of the `Logger` class.
    #level = LogLevel.Info;

    // We do not initialise it here, we'll do it inside the constructor.
    #rolling_config;

    // the prefix to be added to new files.
    #file_prefix = "Logtar_";

    /**
     * We're going to follow the convention of creating a static assert
     * method wherver we deal with objects. This is one way to write
     * safe code in vanilla javascript.
     */
    static assert(log_config) {
        // if there's an argument, check whether the `log_config` is an instance
        // of the `LogConfig` class? If there's no argument, no checks required
        // as we'll be using defaults.
        if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
            throw new Error(
                `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(log_config)}`
            );
        }
    }

    get level() {
        return this.#level;
    }

    get rolling_config() {
        return this.#rolling_config;
    }

    get file_prefix() {
        return this.#file_prefix;
    }
}
```

All looks okay. We have a `LogConfig` class setup. Now, instead of using `#level` for storing the log level inside the `Logger` class, let's replace it with `#config`

```js
// before

class Logger {
    ...

    #level = LogLevel.Info;

    constructor(log_level) {
        // only set/check the log level if the client has provided it
        // otherwise use the default value, i.e `LogLevel.Info`
        if (arguments.length > 0) {
            LogLevel.assert(log_level);
            this.#level = log_level;
        }
    }

    ...
}

// now

class Logger {
    #config;
    ...

    constructor(log_config) {
        // we'll create the `with_defaults()` static method in just a bit.
        log_config = log_config || LogConfig.with_defaults();
        LogConfig.assert(log_config);
        this.#config = log_config;
    }
}
```

Awesome. Let's pause for a moment before adding further functionality inside the `LogConfig` class. Let me quickly introduce you to a very important topic in software engineering.

## Design patterns

Software design patterns are a solution to a common problem that software engineers face while writing code. It's like a blueprint that shows how to solve a couple problem that can be used in many different situations. Those problems are - maintainability and organizing code.

This is a vast topic, and people have dedicated books for explaining the use of these patterns. However, we aren't going to explain each one of those. We'll use the one that suits best for our project. Always find the right tool for the right job. For us, the most reasonable design pattern to build our web framework, as well as our logging library will be the [`Builder pattern`](https://en.wikipedia.org/wiki/Builder_pattern)

### The `Builder` pattern

Think of the Builder Pattern as a way to create complex objects step by step. Imagine you're building a house. Instead of gathering all the materials and putting them together at once, you start by laying the foundation, then building the walls, adding the roof, and so on. The Builder Pattern lets you do something similar. It helps you construct objects by adding parts or attributes one by one, ultimately creating a complete and well-structured object.

Just for a minute think that you're creating a web application where users can create personal profiles. Each profile has a `name`, an `age`, and a `description`. The Builder Pattern would be a great fit here because users might not provide all the information at once. Here's how it could work

```js
const user = new ProfileBuilder().with_name("Alice").with_age(25).with_description("Loves hiking and painting").build();
```

Doesn't this look so natural? Having to specify steps, without any specific order, and you get what you desired. Compare this to a traditional way of building using an object

```js
const user = create_profile({
    name: "Alice",
    age: 25,
    description: "Loves hiking and painting",
});
```

The object solution looks fine, and even has less characters. Then why the builder pattern? Imagine your library in a future update changes the `name` property to `first_name` and include a secondary `last_name` property. The code with object will fail to work properly. But in our builder pattern, it's obvious that the `name` means full name. That might not sound convincing. Let's see at a different example.

In a language like javascript (typescript solves this) you need to make sure that the params you pass as an argument are valid.

Here's a common way you'll write the function `create_profile`

```js
function create_profile({ name, age, description }) {
    let profile = {
        name: Defaults.name,
        age: Defaults.age
        description: Defaults.description
    }
    if (typeof name === 'string') { profile.name = name }
    if (typeof age === 'number' && age > 0) { profile.age = age }
    if (typeof description === 'string') { profile.description = description }
}
```

Notice how cluttered this code becomes if there are 10 fields? The function `create_profile` should not be responsible for testing. Its role is to create a profile. We could group other functions, such as `validate_name` and `validate_email`, and call them inside the `create_profile` function. However, this code would not be reusable. I have made this mistake in the past and ended up with code that was difficult to refactor.

Instead, let's use the builder pattern to validate whether the fields are valid:

```js
class ProfileBuilder {
    name = Defaults.name;
    age = Defaults.age;
    description = Defaults.description;

    with_name(name) {
        validate_name(name);
        this.name = name;
        return this;
    }

     with_age(age) {
        validate_age(age);
        this.age = age;
        return this;
    }

    with_description(description) {...}
}
```

Do you notice the difference? All of the related validations and logic for each field are separated and placed in their respective locations. This approach is much easier to maintain over time, and reason about.

## Using `builder` pattern with the `LogConfig` class

Here's what I'd like the API of `LogConfig` to look like

```js
const config = LogConfig.with_defaults().with_file_prefix("LogTar_").with_log_level(LogLevel.Critical);
```

Our current `LogConfig` class looks like this

```js
// index.js

class LogConfig {
    #level = LogLevel.Info;

    // We'll talk about rolling config in just a bit.
    #rolling_config = RollingConfig.Hourly;
    #file_prefix = "Logtar_";

    static assert(log_config) {
        if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
            throw new Error(
                `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(log_config)}`
            );
        }
    }
}
```

Add the required methods

```js
// index.js

class LogConfig {
    ...
    // This can be called without a `LogConfig` object
    // eg. `LogConfig.with_defaults()`
    static with_defaults() {
        return new LogConfig();
    }

    // Validate the `log_level` argument, set it to the private `#level` variable
    // and return this instance of the class back. So that other methods can mutate
    // the same object, instead of creating a new one.
    with_log_level(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
        return this;
    }

    // We'll talk about rolling config in just a bit, bare with me for now.
    with_rolling_config(rolling_config) {
       this.#rolling_config = RollingConfig.from_json(config);
       return this;
    }

    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(`file_prefix must be a string. Unsupported param ${JSON.stringify(file_prefix)}`);
        }

        this.#file_prefix = file_prefix;
        return this;
    }
    ...
}
```

> Static methods in JavaScript are methods that belong to a class instead of an instance of the class. They can be used without creating an instance of the class and are often used for utility functions or operations that don't need any state. To create a static method in a class, use the `static` keyword before the method definition. For example:
>
> ```jsx
> class MyClass {
>     static my_static_method() {
>         console.log("This is a static method.");
>     }
> }
>
> MyClass.my_static_method();
> ```
>
> One thing to keep in mind is that you cannot access the `this` keyword inside a static method. This is because `this` refers to the instance of the class, and static methods are not called on an instance.

Subclasses can also inherit static methods, but they cannot be used on instances of the subclass. They are useful for organizing code and providing a namespace for related utility functions.

You may notice a difference now. Every method that we added is only responsible to validate a single input/argument. It does not care about any other options, whether they are correct or not.

## jsdoc comments

If you're writing vanilla javascript, you may have trouble with the auto-completion or intellisense feature that most IDE provide, when working with multiple files. This is because javascript has no types (except primitives). Everything is an object. But don't we deserve those quality of life features if we're writing vanilla JS? Of course, we do. That's where `jsdoc` saves us.

We will not cover the entire feature set of `jsdoc`, but only focus on what we need for this particular purpose. We are concerned with two things: the parameter and the return type. This is because if a function returns a type, our auto-completion feature will not work across multiple files and will not display other associated methods of that return type in the dropdown.

Let's fix it.

```js
   /**
     * @param {string} file_prefix The file prefix to be set.
     * @returns {LogConfig} The current instance of LogConfig.
     * @throws {Error} If the file_prefix is not a string.
     */
    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(`file_prefix must be a string. Unsupported param ${JSON.stringify(file_prefix)}`);
        }

        this.#file_prefix = file_prefix;
        return this;
    }
```

We create `jsdoc` comments with multi-line comment format using `/** ... */`. Then specify a tag using `@`. In the code snippet above, we specified three tags - `@params`, `@returns` and `@throws`. The tags have the following syntax

```textile
@tag {Type} <argument> <description>
```

The `Type` is the actual type of the `argument` that you're referring to. In our case it's the argument `file_prefix` in the method `with_file_prefix`. The type for that is `string`. The description is the documentation part for that particular parameter.

Here's the `jsdoc` comments with `with_log_level` method

```js
    /**
     * @param {LogLevel} log_level The log level to be set.
     * @returns {LogConfig} The current instance of LogConfig.
     */
    with_log_level(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
        return this;
    }
```

I'll be not including the `jsdoc` comments to make the code snippets short, and easier to read. However, if you're writing vanilla javascript, it's a good practice to start incorporating these into your work flow. They'll save you a lot of time! There's much more than this that `jsdoc` helps us with. You can go through the documentation of `jsdoc` [here](https://jsdoc.app/).

## The `RollingConfig` class

The **`RollingConfig`** class is going to be a vital part of our logging system that helps manage log files. It does this by rotating or rolling log files based on a set time interval or the size of file. This ensures that log files don't become too large and hard to handle.

The **`RollingConfig`** class's main purpose is to define settings for the log file's rolling process. This includes how often log files should be rolled, the maximum size of log files before they are rolled, and other relevant settings. By doing this, it helps keep log files organized and manageable while still preserving the historical data needed for analysis, debugging, and monitoring.

The **`RollingConfig`** class typically includes the two key features:

1. **Rolling Time Interval:** This setting determines how frequently log files are rolled. For example, you might set the logger to roll log files every few minutes, hours, or days, depending on how detailed you need your logs to be.
2. **Maximum File Size:** In addition to time-based rolling, the **`RollingConfig`** class may also support size-based rolling. When a log file exceeds a certain size limit, a new log file is created, with a new prefix to let you distinguish between different log files.

Before creating the `RollingConfig` class. Let's create 2 utility helper classes - `RollingSizeOptions` and `RollingTimeOptions`. As the name suggests, they are only going to support the `RollingConfig` class.

### The `RollingSizeOptions` class

```js
// index.js

class RollingSizeOptions {
    static OneKB = 1024;
    static FiveKB = 5 * 1024;
    static TenKB = 10 * 1024;
    static TwentyKB = 20 * 1024;
    static FiftyKB = 50 * 1024;
    static HundredKB = 100 * 1024;

    static HalfMB = 512 * 1024;
    static OneMB = 1024 * 1024;
    static FiveMB = 5 * 1024 * 1024;
    static TenMB = 10 * 1024 * 1024;
    static TwentyMB = 20 * 1024 * 1024;
    static FiftyMB = 50 * 1024 * 1024;
    static HundredMB = 100 * 1024 * 1024;

    static assert(size_threshold) {
        if (typeof size_threshold !== "number" || size_threshold < RollingSizeOptions.OneKB) {
            throw new Error(
                `size_threshold must be at-least 1 KB. Unsupported param ${JSON.stringify(size_threshold)}`
            );
        }
    }
}
```

I've set some defaults, to make it easy for the clients of our library to use them. Instead of them having to declare an extra constant, they can quickly use `RollingSizeOptions.TenKB` or whatever they wish. However, they can also specify a number as a value, and that's where our `RollingSizeOptions.assert()` helper is going to do the validation for us.

### The `RollingTimeOptions` class

```js
// index.js

class RollingTimeOptions {
    static Minutely = 60; // Every 60 seconds
    static Hourly = 60 * this.Minutely;
    static Daily = 24 * this.Hourly;
    static Weekly = 7 * this.Daily;
    static Monthly = 30 * this.Daily;
    static Yearly = 12 * this.Monthly;

    static assert(time_option) {
        if (![this.Minutely, this.Hourly, this.Daily, this.Weekly, this.Monthly, this.Yearly].includes(time_option)) {
            throw new Error(
                `time_option must be an instance of RollingConfig. Unsupported param ${JSON.stringify(time_option)}`
            );
        }
    }
}
```

## Finishing up the `RollingConfig` class

It's time to create our `RollingConfig` class. Let's add some basic functionality in it for now.

```js
// index.js
class RollingConfig {
    #time_threshold = RollingTimeOptions.Hourly;
    #size_threshold = RollingSizeOptions.FiveMB;

    static assert(rolling_config) {
        if (!(rolling_config instanceof RollingConfig)) {
            throw new Error(
                `rolling_config must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
                    rolling_config
                )}`
            );
        }
    }

    // Provide a helper method for the clients, so instead of doing `new RollingConfig()`
    // they can simply use `RollingConfig.with_defaults()` that too without specifying the
    // `new` keyword.
    static with_defaults() {
        return new RollingConfig();
    }

    // Utilizing the `Builder` pattern here, to first verify that the size is valid.
    // If yes, set the size, and return the current instance of the class.
    // If it's not valid, throw an error.
    with_size_threshold(size_threshold) {
        RollingSizeOptions.assert(size_threshold);
        this.#size_threshold = size_threshold;
        return this;
    }

    // Same like above, but with `time`.
    with_time_threshold(time_threshold) {
        RollingTimeOptions.assert(time_threshold);
        this.#time_threshold = time_threshold;
        return this;
    }

    // Build from a `json` object instead of the `Builder`
    static from_json(json) {
        let rolling_config = new RollingConfig();

        Object.keys(json).forEach((key) => {
            switch (key) {
                case "size_threshold":
                    rolling_config = rolling_config.with_size_threshold(json[key]);
                    break;
                case "time_threshold":
                    rolling_config = rolling_config.with_time_threshold(json[key]);
                    break;
            }
        });

        return rolling_config;
    }
}
```

The `RollingConfig` class is ready to be used. It has no functionality, and is merely a configuration for our logger. It's useful to add a suffix like `Config`, `Options` for things that have no business logic inside them. It's generally a good design practice to stay focused on your naming conventions.

### Let's recap

-   `RollingConfig` - A class that maintains the configuration on how often a new log file file should be rolled out. It is based on the `RollingTimeOptions` and `RollingSizeOptions` utility classes which define some useful constants as well as an `assert()` method for the validation.

-   `LogConfig` - A class that groups all other configurations into one giant class. This has a couple of private member variables - `#level` which is going to be of type `LogLevel` and keeps track of what logs should be written and what ignored; `#rolling_config` which is going to store the `RolllingConfig` for our logger; `#file_prefix` will be used to prefix log files.

    -   `with_defaults` constructs and returns a new `LogConfig` object with some default values.

    -   `with_log_level`, `with_file_prefix` and `with_rolling_config` mutates the current object after testing whether the input provided is valid. The example of what we learnt above - a `Builder` pattern.

    -   `assert` validation for the `LogConfig` class.

-   `Logger` - The backbone of our logger. It hardly has any functionality now, but this is the main class of our library. This is responsible to do all the hard work.

## Adding more useful methods in the `LogConfig` class

The `LogConfig` class looks fine. But it's missing out on a lot of other features. Let's add them one by one.

Firstly, not everyone is a fan of builder pattern, many people would like to pass in an object and ask the library to parse something useful out of it. It's generally a very good practice to expose various ways to do a particular task.

We are going to provide an ability to create a `LogConfig` object from a json object.

```js
// index.js

...

class LogConfig {
    ...

    with_rolling_config(config) {
        this.#rolling_config = RollingConfig.from_json(config);
        return this;
    }

    static from_json(json) {
        // Create an empty LogConfig object.
        let log_config = new LogConfig();

        // ignore the keys that aren't needed for our purposes.
        // if a key matches, let's set it to the provided value.
        Object.keys(json).forEach((key) => {
            switch (key) {
                case "level":
                    log_config = log_config.with_log_level(json[key]);
                    break;
                case "rolling_config":
                    log_config = log_config.with_rolling_config(json[key]);
                    break;
                case "file_prefix":
                    log_config = log_config.with_file_prefix(json[key]);
                    break;
            }
        });

        // return the mutated log_config object
        return log_config;
    }

    ...
}

...
```

Now we can call it like this -

```js
const json_config = { level: LogLevel.Debug };
const config = LogConfig.from_json(json_config).with_file_prefix("Testing");

// or

const config = LogConfig.from_json({ level: LogLevel.Debug }).with_file_prefix('Test');

// or

const config = LogConfig.with_defaults().with_log_level(LogLevel.Critical);

// Try to add an invalid value
const config = LogConfig.from_json({ level: 'eh?' }); // fails

Error: log_level must be an instance of LogLevel. Unsupported param "eh?"
    at LogLevel.assert (/Users/ishtmeet/Code/logtar/index.js:251:19)
    at LogConfig.with_log_level (/Users/ishtmeet/Code/logtar/index.js:177:18)
    at /Users/ishtmeet/Code/logtar/index.js:143:45
```

The API of our library is already looking solid. But there's one last thing that we wish to have as a convenience method to build `LogConfig` from. It's from a config file. Let's add that method

```js
// import the `node:fs` module to use the `readFileSync`
const fs = require('node:fs')

class LogConfig {
    ...

    /**
     * @param {string} file_path The path to the config file.
     * @returns {LogConfig} A new instance of LogConfig with values from the config file.
     * @throws {Error} If the file_path is not a string.
     */
    static from_file(file_path) {
        // `fs.readFileSync` throws an error if the path is invalid.
        // It takes care of the OS specific path handling for us. No need to
        // validate paths by ourselves.
        const file_contents = fs.readFileSync(file_path);

        // Send this over to our `from_json` method to do the rest
        return LogConfig.from_json(JSON.parse(file_contents));
    }

    ...
}
```

Do you notice how we reused the `from_json` method to parse the json into a `LogConfig` object? This is one thing you have to keep in mind while building good and maintainable APIs. Avoid code duplication, and make the methods/helpers re-usable. As much as you can.

### Why `readFileSync`?

Loggers are usually initialized once when the program starts, and are not usually created after the initialization phase. As such, using `readFileSync` over the asynchronous version (readFile) can provide several benefits in this specific case.

`readFileSync` operates synchronously, meaning it blocks the execution of the code until the file reading is complete. For logger configuration setup, this is often desired because the configuration is needed to initialize the logger properly before any logging activity begins, since our application will be using the logger internally.

We cannot let the application start before initializing the logger. Using asynchronous operations like `readFile` could introduce complexities in managing the timing of logger initialization.

Let's test using a config file. Create a `config.demo.json` file with the following contents

```json
{
    "level": 3,
    "file_prefix": "My_Prefix_",
    "rolling_config": {
        "size_threshold": 1024,
        "time_threshold": 3600
    }
}
```

Since we have added the support for files, the following code will work now

```js
const config = LogConfig.from_file("./config.demo.json");
const logger = Logger.with_config(config);
```

Everything works as expected.

> Note: The entire code we write here can be found [at the code/chapter_04.0 directory](/code/chapter_04.0). This will be a single file, and we'll refactor in subsequent chapters.

[![Read Next](/assets/imgs/next.png)](/chapters/ch04.1-refactoring-the-code.md)

![](https://uddrapi.com/api/img?page=ch04)
