[![Read Prev](/assets/imgs/prev.png)](/chapters/ch01-what-is-a-web-server-anyway.md)

# Your first web server with [node.js](https://nodejs.org)

The following section assumes that you have nodejs installed locally and are ready to follow along. You can check whether you have nodejs installed by running this command on your terminal -

```bash
node --version

# Outputs
# v18.17.0
```

If you see a `Command not found` error, that means you do not have nodejs installed. Follow the instructions [here to download and install it](https://nodejs.org/en/download).

## What exactly is node or nodejs?

From the official website -

> Node.js® is an open-source, cross-platform JavaScript runtime environment.

What does a “runtime” mean?

Simply put, when you write code in a programming language like JavaScript, you need something to execute that code. For compiled languages like C++ or Rust, you use a compiler. The runtime environment takes care of executing the code, ensuring that it works well with the computer's hardware and other software components.

For Node.js, being a JavaScript runtime environment means it has everything needed to execute JavaScript code **_outside of a web browser_**. It includes the V8 JavaScript engine (which compiles and executes JavaScript code), libraries, APIs for file, network, and other system-related tasks, and an event loop for asynchronous, non-blocking operations.

> We’ll discuss what exactly an event loop means, and implement our own version of event loop to understand how it works, later on in the guide.

## Your first node.js program

Let’s begin by writing some code. Let’s create a new folder, and name it whatever you wish. I’ve named it `intro-to-node`. Inside it, create a new file `index.js` and add the following content inside it.

```jsx
// Write the string `Let's learn Nodejs` to the standard output.
process.stdout.write("Let's learn Node.js");
```

To execute the code, open your terminal and `cd` into the folder containing the `index.js` file, and run `node index.js` or `node index`. You may alternatively run the command by specifying the relative or absolute path of the `index.js` file -

```bash
node ../Code/intro-to-node/index.js

#or

node /Users/ishtmeet/Code/intro-to-node/index.js
```

This should output

```
Let's learn Node.js
```

> You might also see a trailing `%` at the end due to the absence of a newline character (**`\n`**) at the end of the string you're writing to the standard output (stdout). You can modify the code as `process.stdout.write("Let's learn Node.js\n");` to get rid of that trailing modulo.

**What is the code above doing?**

There’s too much going on in the code above, and I simply chose it over `console.log()` to explain a huge difference between the Javascript API and the Nodejs API.

JavaScript and Node.js are closely related, but they serve different purposes and have different environments, which leads to some differences in their APIs (Application Programming Interfaces).

JavaScript was created to make web pages more interactive and dynamic. It was meant for creating user interfaces and responding to user actions on the client side, **inside the browser**. However, as web applications became more complex, relying only on client-side JavaScript was not enough. This led to the development of Node.js, which allows JavaScript to be executed on the server side. Node.js extends JavaScript's capabilities, introducing APIs for file system operations, network communication, creating web servers, and more. This means developers can use one programming language throughout the entire web application stack, making development simpler.

So let’s jump back to the code above, and understand why did I use `process.stdout.write` instead of `console.log`.

Simply put, `console.log` is a method that outputs a message to the web console or the browser console. However, Node.js does not run on the web, which means it does not recognize what a console is.

But if you change your code inside `index.js` to this

```jsx
console.log("Let's learn Node.js");

// Outputs -> Let's learn Node.js
```

It works. However, isn't it the case that I just mentioned Node.js being unfamiliar with the concept of a browser console? Indeed, that's correct. However, Node.js has made it easier for developers who are only used to working with JavaScript in a web context. It has included all the important features of browser-based JavaScript in its framework.

Expanding upon this topic, it's important to understand that Node.js, despite its roots in server-side development, strives to bridge the gap between traditional web development and server-side scripting. By incorporating features commonly associated with browser-based JavaScript, Node.js has made it more accessible for developers who are already well-versed in the language but might be new to server-side programming.

### How does `console.log()` work in Node.js?

The **`node:console`** module offers a wrapper around the standard console functionalities that javascript provides. This wrapper aims to provide a consistent and familiar interface for logging and interacting with the Node.js environment, just as developers would in a web browser's developer console.

The module exports two specific components:

-   A `Console` class with methods like `console.log()`, `console.error()`, and `console.warn()`. These can be used to write to any Node.js **stream**.
-   A global `console` instance that is set up to write to `process.stdout` and `process.stderr`.

(Note that `Console` is not `console` (lowercase). `console` is a special instance of `Console`)

> You can use the global `console` without having to call `require('node:console')` or `require('console')`. This global availability is a feature provided by the Node.js runtime environment. When your Node.js application starts running, certain objects and modules are automatically available in the global scope without the need for explicit importing.
>
> Here are some of the examples of globally available objects/modules in Node.js - `console`, `setTimeout`, `setInterval`, `__dirname`, `__filename`, `process`, `module`, `Buffer`, `exports`, and the `global` object.

As I mentioned earlier, Node.js provides the global `console` instance to output text to `process.stdout` and `process.stderr`. So if you’re writing this

```jsx
console.log("Something");
```

the above code is just an abstraction of the code below.

```jsx
process.stdout.write("Something\n");
```

However, even after reading this, the code above may still be confusing. You may not yet be familiar with the `process` object, or with `stdout` and `stderr`.

### The **`process` Object**:

The **`process`** object in Node.js tells you about the environment where the Node.js app is running. It has various properties, methods, and event listeners to help you work with the process and access info about the runtime environment.

These are some of the useful properties and functions that are provided by the `process` object. Copy paste the code below and paste it inside your `index.js` file. Try to execute it, using `node path/to/index/file`.

```jsx
console.log(process.version);
// v18.17.0

console.log(process.platform);
// darwin

console.log(process.uptime());
// 0.023285791

console.log(process.cpuUsage());
// { user: 31466, system: 6772 }

console.log(process.resourceUsage().systemCPUTime);
// 6865

console.log(process.memoryUsage());
// {
//  rss: 39239680,
//  heapTotal: 6406144,
//  heapUsed: 5388408,
//  external: 425804,
//  arrayBuffers: 17694
// }

console.log(process.cwd());
// /Users/ishtmeet/Code/intro-to-node

console.log(process.title);
// node

console.log(process.argv);
// [
//  '/usr/local/bin/node',
//  '/Users/ishtmeet/Code/intro-to-node/index.js'
// ]

console.log(process.pid);
// 39328
```

> We will discuss most of these properties/functions further down the line when we talk about implementing our own framework.

### The `stdout` **property of the `process` object**:

In Node.js, the `stdout` property is a part of the `process` object. This property represents the standard output **_stream_**, which is used for writing data to the console or other output destinations. Anything written to the `stdout` stream is displayed in the console when you run your program.

Now you may ask, what is a `stream`?

**_Streams_** are used in programming to efficiently handle data flow, especially when working with large datasets or network communication. A stream is a sequence of data elements that is made available over time. Instead of loading all the data into memory, streams allow you to process and transmit data in smaller, more manageable pieces.

Streams can also be classified as input streams and output streams. Input streams are used to take in data from a source, while output streams are used to send data to a destination.

Streams have an important advantage of supporting parallelism. Instead of processing data one after the other, streams can process data in parallel and concurrently. This is helpful when working with large datasets because it speeds up processing time significantly.

Node.js provides a comprehensive implementation of streams, which can be categorized into several types:

1. **Readable Streams**: These streams represent a source of data from which you can read. Examples include reading files, reading data from an HTTP request, or even generating data programmatically.
2. **Writable Streams**: Writable streams are destinations where you can write data. Examples include writing data to files, standard output (`stdout`), standard error output (`stderr`) and many more.
3. **Duplex Streams**: Duplex streams represent both a readable and a writable side. This means you can both read from and write to these streams concurrently. An example of a Duplex stream is a TCP socket. It can both receive data from the client and send data back to the client concurrently.
4. **Transform Streams**: These are a specific type of duplex stream that allow you to modify or transform data as it's being read or written. They are often used for data manipulation tasks, like compression or encryption.

> Streams are incredibly versatile and efficient because they work with small chunks of data at a time, which is particularly useful when dealing with data that doesn't fit entirely into memory or when you want to process data in real-time. They also make it possible to start processing data before the entire dataset is available, reducing memory consumption and improving performance.

Now you know what streams are, and what is the standard output (`stdout`), we can simplify the code below.

```jsx
process.stdout.write("Hello from Node.js");
```

We're simply writing to **`stdout`** or the standard output stream which Node.js provides, which means that we're sending data or messages from our program to the console where you see the program's output. The data we write to **`stdout`** is displayed in the order it's written, giving us a way to communicate with developers or users and provide insights into the program's execution in real-time.

Working with **`process.stdout`** can be rather cumbersome, and in practice, you tend to use it sparingly. Instead, developers frequently opt for the more user-friendly **`console.log`** method. Instances of code employing **`process.stdout`** are typically encountered when there's a need for a greater level of control over output formatting or when integrating with more complex logging mechanisms.

> **_Warning_**: The ways of the global console object are not always synchronous like the browser APIs they resemble, nor are they always asynchronous like all other Node.js streams. For more information, please see the [note on process I/O](https://nodejs.org/api/process.html#a-note-on-process-io).

[![Read Next](/assets/imgs/next.png)](/chapters/ch03-working-with-files.md)
