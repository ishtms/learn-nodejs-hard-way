# Learn Node.js by building a backend framework

I've found that one of the best ways to get a handle on a new concept is to start from scratch. Begin with nothing, and build it up yourself. This approach lets you not only learn how it works, but also understand _why_ it works that way.

This isn't your average Node.js tutorial or guide. It's a detailed walkthrough that shows you how to create a backend framework from the ground up while getting a solid grasp of Node.js's inner workings and it’s standard library.

In this guide, we will not only build a web framework, but also focus on designing a powerful and optimized end product that is ready for use in production applications (somewhat). Our goal is to create a modular backend framework that can be easily extended with new features as needed.

We will cover topics like error handling, security, and testing to ensure that our framework is reliable and secure. We will explore different approaches to modularity and demonstrate how to create reusable components that can be shared across multiple projects. By the end of this guide, you will have a solid understanding of Node.js and it’s tough parts.

I highly recommend coding along with this guide rather than just reading it.

# What the hell is a web server any way?

If you do not wish to read about the basics of web/http, you can safely jump to the **coding section**.

Before diving straight into writing JavaScript code to create web servers, it's essential to grasp the fundamental concepts that are the basic building blocks of web server. Web servers are like the traffic controllers of the internet. They manage requests from users (like you!) and send back the right information. But what makes up a web server, and how does it even work? Let's break it down into simple terms.

## **Parts of a Web Server:**

Web servers are like friendly translators that help computers understand each other. Imagine if you and a friend speak different languages. To have a conversation, you'd need a common language that both of you understand. In the same way, web servers and computers need a common set of rules to talk to each other effectively. These rules are called protocols, which are like languages specifically designed for computers. When you type a website address in your browser and hit "Enter," your computer sends a message to the web server. This message follows the web's language rules, known as the HTTP protocol (Hypertext Transfer Protocol).

HTTP is like a code that tells the web server what you want (e.g., a webpage or an image) and how to respond. The web server reads your message, understands it because it knows the HTTP protocol too, and then sends back the information you requested using the same rules. This information could be a webpage, a picture, or any other content.

Just like you need to speak the same language to have a successful conversation with someone, computers and web servers need to use the same protocol to communicate effectively. This way, they can understand each other's requests and provide the right responses, allowing you to enjoy the content you're looking for on the internet. HTTP establishes a standardised set of rules for how your computer's request (like asking for a webpage) should be structured and how the server's response (the webpage itself) should be formatted. This ensures seamless communication between different devices, regardless of their underlying technologies.

Think of HTTP as a detailed script for a play. It outlines every step, from introducing characters (your request) to their dialogues (data transmission) and the grand finale (the server's response). This structured script eliminates misunderstandings and ensures that both sides know what to expect at each stage of the conversation.

But the protocol game isn't limited to HTTP. The web's secure version, HTTPS (Hypertext Transfer Protocol Secure), adds an extra layer of protection through encryption. This way, even if someone tries to [eavesdrop](https://en.wikipedia.org/wiki/Eavesdropping) on your conversation, they'll only hear garbled nonsense.

Protocols extend beyond web browsing too. Email, file sharing, and even the way your phone connects to Wi-Fi rely on various protocols to ensure reliable and efficient communication. Each protocol serves a specific purpose, just like different languages for different scenarios in real life.

### **Navigating the World of Protocols: A Quick Overview**

Like I explained above, to re-iterate - Protocols are like the rules that enable devices to communicate effectively on the internet. They define how data is formatted, transmitted, and understood by different systems. Just as people follow social etiquette during conversations, devices follow protocols to ensure smooth communication. Here's a glimpse into some major types of protocols:

- **TCP/IP (Transmission Control Protocol/Internet Protocol):** a set of rules for exchanging data over a network.
- **HTTP (Hypertext Transfer Protocol):** a protocol for transmitting data between a web server and a web client.
- **HTTPS (Hypertext Transfer Protocol Secure):** an extension of HTTP that encrypts data in transit.
- **UDP (User Datagram Protocol):** a protocol for transmitting data between networked devices without requiring a connection or reliability guarantees.
- **FTP (File Transfer Protocol):** a protocol for transferring files between computers on a network.
- **SMTP (Simple Mail Transfer Protocol):** a protocol for sending email messages between servers.
- **POP3 (Post Office Protocol 3) and IMAP (Internet Message Access Protocol):** protocols for retrieving email messages from a server.
- **DNS (Domain Name System):** a protocol for translating domain names into IP addresses.
- **DHCP (Dynamic Host Configuration Protocol):** a protocol for automatically assigning IP addresses to devices on a network.

In order to become a proficient backend engineer, it is important to have a solid understanding of different networking protocols. While HTTP(s) is the main focus of this guide, having knowledge of other protocols such as FTP, SMTP, and DNS can prove beneficial in the long run. FTP (File Transfer Protocol) is commonly used for transferring files between servers, while SMTP (Simple Mail Transfer Protocol) is used for sending emails. DNS (Domain Name System) is responsible for translating domain names into IP addresses.

> If you're programming game servers, it's important to have a solid understanding of UDP. UDP is faster but less reliable than TCP, making it ideal for applications that can tolerate occasional data loss, such as video streaming or online gaming. Unlike TCP, UDP is a "fire and forget" protocol, meaning data is sent without any error-checking or acknowledgment mechanisms.

### **The Relationship Between HTTP and TCP: Ensuring Reliable Web Communication**

HTTP (Hypertext Transfer Protocol) and TCP (Transmission Control Protocol) form a strong partnership when it comes to web communication. The reason HTTP prefers TCP lies in the very nature of their roles and responsibilities within the world of networking.

### 1. **Data Integrity and Order**

HTTP is used to send web content, like web pages, images, and videos, from a server to a user's browser. Imagine if you requested a webpage and the images were missing or the text was scrambled. That wouldn't be a good experience, right? HTTP has to make sure that the data is delivered correctly and in order.

TCP helps with this. It was designed to make sure that data is delivered in the right order and without errors. TCP breaks up the data into small pieces called packets, sends them to the destination, and makes sure they arrive in the correct order. If any packet is lost during the process, TCP asks for it to be sent again. This is important for web pages because everything needs to be presented in a way that makes sense.

> A packet is a small unit of data that is sent over a network. In the context of web communication, TCP breaks up the data into small pieces called packets, sends them to the destination, and makes sure they arrive in the correct order. If any packet is lost during the process, TCP asks for it to be sent again.

### 2. **Acknowledgment Mechanism**

HTTP is a way to request a webpage, and the server sends back the content you asked for. To make sure the data is received correctly, an [acknowledgment mechanism](<https://en.wikipedia.org/wiki/Acknowledgement_(data_networks)>) is needed.

TCP provides this mechanism by waiting for your browser to confirm that it has received each packet of data sent from the server. If your browser does not confirm, TCP sends the packet again, so that both the server and browser can be sure that the data is being received properly.

### 3. **Complex Interactions**

HTTP transactions involve multiple steps, like requesting a webpage, receiving the HTML structure, fetching linked assets (images, stylesheets), and more. These interactions require precise data handling and sequencing.

TCP works well with HTTP for handling complex interactions. TCP's mechanisms guarantee that every piece of data reaches its intended destination and fits into the bigger interaction. For instance, when you visit a webpage, your browser makes several HTTP requests for different assets. TCP helps ensure that these requests and responses occur in an orderly and dependable manner.

### 4. **Transmission Overhead**

TCP adds some extra information to every message to make sure it gets to its destination without errors. This extra information includes acknowledgments, sequence numbers, and error-checking. Even though it adds a little more data to every message, it's still worth it because it helps make sure the data is accurate and in the right order. This is especially important when communicating over the web.

## **Asking and Getting: How Web Servers Respond to Your Requests**

Imagine you're at home, sitting in front of your computer, and you decide to visit a website, let's say "**[www.example.com](http://www.example.com/)**." This simple action initiates a series of events that highlight the "Asking and Getting" process in web communication.

### The Request:

1. **Your Request:** You type "**[www.example.com](http://www.example.com/)**" into your browser's address bar and hit Enter. This is like you telling your computer, "Hey, I want to see what's on this website!"
2. **Finding the Address:** Your computer knows the basics of websites, but it needs the exact address of "**[www.example.com](http://www.example.com/)**" to connect to it. So, it reaches out to a special helper called a DNS resolver.
3. **Resolving the Address:** The DNS resolver is like a digital address book. It takes "**[www.example.com](http://www.example.com/)**" and looks up the actual IP address associated with it. This IP address is like the specific coordinates of the website's location on the internet.

> A website URL like https://google.com also be referred to as a **domain name**

### The Response:

1. **Return Address:** The DNS resolver finds the IP address linked to "**[www.example.com](http://www.example.com/)**" and sends it back to your computer. It's like the DNS resolver telling your computer, "The website is located at this IP address."
2. **Sending the Request:** Now that your computer knows the IP address, it can send a request to the web server that holds the website's content. This request includes the IP address and a message saying, "Hey, can you please give me the content of your website?"
3. **Preparing the Content:** The web server receives your request and understands that you want to see the content of "**[www.example.com](http://www.example.com/)**." It then gathers the necessary files – HTML, images, stylesheets, scripts – to create the webpage.
4. **Sending the Response:** The web server packages the content into a response and sends it back to your computer through the internet. It's like the server sending a digital package to your doorstep.
5. **Enjoying the Content:** Your computer receives the response from the web server. Your browser interprets the HTML, displays images, and applies styles, creating a complete webpage. This is what you see on your screen – the final result of your request.

> A quick disclaimer: our learning approach will prioritize clarity and thoroughness. I will introduce a topic, break it down, and if we come across any unfamiliar concepts, we will explore them until everything is fully understood.

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

- A `Console` class with methods like `console.log()`, `console.error()`, and `console.warn()`. These can be used to write to any Node.js **stream**.
- A global `console` instance that is set up to write to `process.stdout` and `process.stderr`.

(Note that `Console` is not `console` (lowercase). `console` is a special instance of `Console`)

<aside>
💡 You can use the global `console` without having to call `require('node:console')` or `require('console')`.  This global availability is a feature provided by the Node.js runtime environment. When your Node.js application starts running, certain objects and modules are automatically available in the global scope without the need for explicit importing.

Here are some of the examples of globally available objects/modules in Node.js - `console`, `setTimeout`, `setInterval`, `__dirname`, `__filename`, `process`, `module`, `Buffer`, `exports`, and the `global` object.

</aside>

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

> **_Warning_**: The methods of the global console object are not consistently synchronous like the browser APIs they resemble, nor are they consistently asynchronous like all other Node.js streams. For more information, see the [note on process I/O](https://nodejs.org/api/process.html#a-note-on-process-io).

## Working with files

Now that we've covered the basics of logging in Node.js, let's explore a real-world example. In this section, we'll build a logging library (`loggify`) that writes logs to a log file. We’ll use this library as the central mechanism of logging for our web framework, that we build further into this guide.

### What will the logging library do

- Log messages to a file
- Choose log location, or simply generate a new file
- Support for log levels (debug, info, warning, error, critical)
- Timestamps on log messages
- Customizable log message format
- Automatic log rotation based on file size or time interval
- Support for console output in addition to log files
- Simple and easy-to-use API for logging messages

### How do you work with files anyway?

A file in Node.js is represented by a JavaScript object. This object has properties that describe the file, such as its name, size, and last modified date. The object also has methods that can be used to read, write, and delete the file.

In order to work with files and access file-related helper methods, you can import the `fs` **_module_** from the Node.js standard library.

**Wait, what exactly is a `module`?**

In Node.js, every JavaScript file is like a little package, called a module. Each module has its own space, and anything you write in a module can only be used in that module, unless you specifically share it with others.

When you make a **`.js`** file in Node.js, it can be a module right away. This means you can put your code in that file, and if you want to use that code in other parts of your application, you can share it using the **`module.exports`** object. On the other hand, you can take code from other modules and use it in your file using the **`require`** function.

This modular approach is important for keeping your code organized and separate, and making it easy to reuse parts of your code in different places. It also helps keep your code safe from errors that can happen when different parts of your code interact in unexpected ways.

Let’s see an example by creating a module called `calculate`

Create a file `calculator.js` and add the following contents inside it

```jsx
// calculator.js

function add(num_one, num_two) {
  return num_one + num_two;
}

function subtract(num_one, num_two) {
  return num_one - num_two;
}

function multiply(num_one, num_two) {
  return num_one * num_two;
}

function divide(num_one, num_two) {
  return num_one / num_two;
}

// Only export add and subtract
module.exports = {
  add,
  subtract,
};
```

By specifying the `exports` property on the global `module` object, we declare which specific methods or properties should be publicly exposed and made accessible from all other modules/files during runtime.

Note, we haven’t exported `multiply` and `divide` and we’ll see in a moment what happens when we try to access them and invoke/call those functions.

> Note: Provide the relative path to `calculator.js`. In my case, it is located in the same directory and at the same folder level.

In your `index.js` file, you can import the exported functions as shown below.

```jsx
const { add, divide, multiply, subtract } = require("./calculator");

// You may also write it this way, but it's preferred to omit the `.js` extension
const { add, divide, multiply, subtract } = require("./calculator.js");
```

Notice that we're importing the functions `multiply` and `subtract` even though we're not exporting them from the `calculator` module. This won't cause any issues until we try to use them. If you run the code above with `node index`, it runs fine but produces no output. Let’s try to understand why it doesn't fail.

The `module.exports` is basically a javascript `Object`, and when you `require` it from another file, it tries to evaluate the fields with the names provided (destructuring in short).

So, you can think of it as something like this:

```jsx
const my_module = {
	fn_one: function fn_one() {...},
	fn_two: function fn_two() {...}
}

const { fn_one, fn_two, fn_three } = my_module;
fn_one;   // fn_one() {}
fn_two;   // fn_two() {}
fn_three; // undefined

```

This may clear up why we don't get an error if we try to include a function/property that is not being explicitly exported from a module. If that identifier isn't found, it's simply `undefined`.

So, the `multiply` and `subtract` identifiers above are just `undefined`. However, if we try to add this line:

```jsx
// index.js

let num_two = multiply(1, 2);
```

the program crashes:

```jsx
/Users/ishtmeet/Code/intro-to-node/index.js:5
let num_two = multiply(1, 2);
              ^

TypeError: multiply is not a function
    at Object.<anonymous> (/Users/ishtmeet/Code/intro-to-node/index.js:5:15)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47

```

We cannot invoke an `undefined` value as a function. `undefined()` doesn't make any sense.

Let’s export all the functions from the `calculator` module.

```jsx
// calculator.js

function add(num_one, num_two) {...}

function subtract(num_one, num_two) {...}

function multiply(num_one, num_two) {...}

function divide(num_one, num_two) {...}

// Only export add and subtract
module.exports = {
  add,
  subtract,
  multiply,
  divide,
};
```

In the `index.js` file, call all those functions to see if everything’s working as expected.

```jsx
// index.js

const { add, divide, multiply, subtract } = require("./calculator");

console.log(add(1, 2));
console.log(subtract(1, 2));
console.log(multiply(1, 2));
console.log(divide(1, 2));

// outputs
3 - 1;
2;
0.5;
```

Recall what was just stated above: `module.exports` is simply an object. We only add fields to that object that we wish to export.

So instead of doing `module.exports = { add, subtract, .. }`, you could also do this

```jsx
// calculator.js

module.exports.add = function add(num_one, num_two) {
  return num_one + num_two;
};

module.exports.subtract = function subtract(num_one, num_two) {
  return num_one - num_two;
};

module.exports.multiply = function multiply(num_one, num_two) {
  return num_one * num_two;
};

module.exports.divide = function divide(num_one, num_two) {
  return num_one / num_two;
};
```

It’s a matter of preference. But there’s a big downside and nuance to this approach. You cannot use these functions in the same file.

_We’ll use the term `file` and `module` interchangeably, even though they’re not actually the same in theory_

```jsx
// calculator.js
module.exports.add = function add(num_one, num_two) {..}
module.exports.subtract = function subtract(num_one, num_two) {..}
module.exports.multiply = function multiply(num_one, num_two) {..}
module.exports.divide = function divide(num_one, num_two) {..}

divide(1,2)

// Outputs
/Users/ishtmeet/Code/intro-to-node/calculator.js:16
divide(1, 2);
^

ReferenceError: divide is not defined
    at Object.<anonymous> (/Users/ishtmeet/Code/intro-to-node/calculator.js:16:1)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Module.require (node:internal/modules/cjs/loader:1143:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.<anonymous> (/Users/ishtmeet/Code/intro-to-node/index.js:1:45)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
```

This is because `divide` and all the other functions declared in this module are a part of `module.exports` object, and they’re not available in the scope. Let’s break it down into an easy example

```jsx
let person = {};
person.get_age = funtion get_age() {...}

// `get_age` is not defined as it can only be accessed using
// `person.get_age()`
get_age();
```

I hope this makes it clear. Instead you could do something like this

```jsx
// calculator.js

...

// Can do this
module.exports.add = add;
module.exports.subtract = subtract;
module.exports.multiply = multiply;
module.exports.divide = divide;

// Or this
module.exports = {
  add,
  subtract,
  multiply,
  divide,
};
```

But this isn’t the best way to create your library’s API. The second option is more concise and easier to read. It clearly shows that you're exporting a group of functions as properties of an object. This can be particularly useful when you have many functions to export. Also, everything is nicely placed at a single place. You don’t have to keep searching for `module.exports.export_name` to find out what this module exports.

### Let’s get back to `files`

In Node.js, a `file` is a way to interact with the data in a file. The **`fs`** module is used to handle file operations. It works by using unique identifiers assigned by the operating system to each file, called [file descriptors](https://en.wikipedia.org/wiki/File_descriptor).

With the **`fs`** module, you can perform several operations on files, such as reading, writing, updating, and deleting. Node.js provides both synchronous and asynchronous methods for these operations. The synchronous methods can slow down your application's responsiveness, while the asynchronous methods allow non-blocking execution.

Node.js interacts (indirectly, through ) with the operating system's I/O subsystem to manage file operations, making system calls such as **`open`**, **`read`**, **`write`**, and **`close`**. When you open a file, Node.js requests the operating system to allocate a file descriptor, which is used to read or write data from the file. Once the operation is complete, the file descriptor is released.

> A file descriptor is a way of representing an open file in a computer operating system. It's like a special number that identifies the file, and the operating system uses it to keep track of what's happening to the file. You can use the file descriptor to read, write, move around in the file, and close it.

### A little more about file descriptors

When a file is opened by a process, the operating system assigns a unique file descriptor to that open file. This descriptor is essentially an integer value that serves as an identifier for the open file within the context of that process. File descriptors are used in various [system calls](https://en.wikipedia.org/wiki/System_call) and APIs to perform operations like reading, writing, seeking, and closing files.

In Unix-like systems, including Linux, file descriptors are often managed using a data structure called a [file table](https://man7.org/linux/man-pages/man5/table.5.html) or [file control block](https://en.wikipedia.org/wiki/File_Control_Block#:~:text=A%20File%20Control%20Block%20(FCB,not%20in%20operating%20system%20memory.). This table keeps track of the properties and status of each open file, such as the file's current position, permissions, and other relevant information. The file descriptor acts as an **_index_** or key into this table, allowing the operating system to quickly look up the details of the open file associated with a particular descriptor, which is more efficient, and more performant than to iterate over a vector/array of files and find a particular file.

When you interact with files or file descriptors, you're typically dealing with numeric values. For instance, in C, the **`open()`** system call returns a file descriptor, and other functions like **`read()`**, **`write()`**, and **`close()`** require this descriptor to operate on the corresponding file. In a runtime like Node.js, the **`fs`** module abstracts the direct use of file descriptors by providing a more user-friendly API, but it still relies on them behind the scenes to manage file operations.

> A file descriptor is a small, non-negative integer that serves as an index to an entry in the process's table of open file descriptors. This integer is used in subsequent system calls (such as read, write, lseek, fcntl, etc.) to refer to the open file. The successful call will **_return the lowest-numbered file_** descriptor that is not currently open for the process.

### Creating our first file

The `node:fs` module lets you work with the file system using standard [POSIX](https://en.wikipedia.org/wiki/POSIX) functions. Node.js provides multiple ways to work with files. It exposes many flavours of its FileSystem API. A _promise-based asynchronous_ _API_, a _callback-based API_ and a _synchronous API._

Let’s create a new module, `files.js`, in the same folder where your `calculator` module and the `index.js` file lives. Let’s import the `fs` module to start working with files.

```jsx
// Promise based API
const fs = require("node:fs/promises");

// Sync/Callback based API
const fs = require("node:fs");
```

A general rule of thumb is - always prefer asynchronous API, unless you’re dealing with a situation that specifically demands synchronous behaviour.

Asynchronous APIs have two main benefits: they make your code more responsive and scalable. These APIs let your code keep running while it waits for slow tasks like I/O operations or network requests. By not blocking other operations, these APIs allow your application to handle many tasks at once, which improves its overall performance.

Asynchronous code is better for managing multiple tasks happening at the same time than traditional callback-based approaches. With callbacks, it can be hard to keep track of what's going on, leading to a **callback hell**. Using promises and async/await helps make the code easier to read and manage, making it less likely to have issues with complex nested callbacks.

> I will be using the promise-based API of Node.js. However, you may use other options to see what issues arise when your code becomes more complex.

Inside `files.js` add this snippet of code

```jsx
// files.js
const fs = require("node:fs/promises");

async function openFile() {
  const fileHandle = await fs.open("calculator.js", "r", fs.constants.O_RDONLY);
  console.log(fileHandle);
}

module.exports = openFile;
```

and in `index.js`

```jsx
// index.js
const openFile = require("./files");

openFile();

/*
FileHandle {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  close: [Function: close],
  ..
}
 */
```

Let’s break this down.

```jsx
const fs = require("node:fs/promises");
```

This line brings in the **`fs`** module from Node.js. It specifically imports the **`fs/promises`** sub-module, which provides file system operations that can be executed asynchronously and are wrapped in Promises.

```jsx
fs.open("calculator.js", "r", fs.constants.O_RDONLY);
```

The **`fs.open`** function is used to open a file. It takes three arguments - file’s `path`, `flag`, and a `mode`.

The `path` takes an argument of type **`PathLike`** which is a type that represents a file path. It's a concept used in Node.js API to indicate that a value should be a string representing a valid file path. Let’s the see type definition of `PathLike`

```jsx
export type PathLike = string | Buffer | URL;
```

1.  String **Paths:**
    The most common way to represent file paths is as strings. A string path can be either a relative or an absolute path. It's simply a sequence of characters that specifies the location of a file on the computer.
    Example relative string path: **`"calculator.js"`**
    Example absolute string path: **`"/Users/ishtmeet/Code/intro-to-node/calculator.js"`**
2.  **Buffer Paths:**
    While strings are the most common way to represent paths, Node.js also allows you to use **`Buffer`** objects to represent paths. A **`Buffer`** is a low-level data structure that can hold binary data. In reality, using **`Buffer`** objects for paths is less common.
3.  **URL Paths:**
    With the **`URL`** module in Node.js, you can also represent file paths using URLs. The URL must be of scheme file.
    Example URL path:

    ```jsx
    const url_path = new URL("file:///home/user/projects/calculator.js");
    ```

The `flag` argument indicates the mode in which you wish to open the file. Here are the supported values as a `flag` -

- `'a'`: Open file for appending. The file is created if it does not exist.
- `'ax'`: Like `'a'` but fails if the path exists.
- `'a+'`: Open file for reading and appending. The file is created if it does not exist.
- `'ax+'`: Like `'a+'` but fails if the path exists.
- `'as'`: Open file for appending in synchronous mode. The file is created if it does not exist.
- `'as+'`: Open file for reading and appending in synchronous mode. The file is created if it does not exist.
- `'r'`: Open file for reading. An exception occurs if the file does not exist.
- `'rs'`: Open file for reading in synchronous mode. An exception occurs if the file does not exist.
- `'r+'`: Open file for reading and writing. An exception occurs if the file does not exist.
- `'rs+'`: Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
- `'w'`: Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
- `'wx'`: Like `'w'` but fails if the path exists.
- `'w+'`: Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
- `'wx+'`: Like `'w+'` but fails if the path exists.

> You do not need to remember all of these, but it can be useful to write consistent APIs to ensure that no undefined behavior occurs.

Let’s use `wx+` to show a small example. `wx+` will fail to open a file if it already exists, but if it doesn’t it will create a file and work just fine.

```jsx
// calculator.js
const fileHandle = await fs.open(
    "calculator.js",
    "wx+",
    fs.constants.O_RDONLY
  );

// Outputs
node:internal/process/promises:288
            triggerUncaughtException(err, true /* fromPromise */);
            ^

[Error: EEXIST: file already exists, open 'calculator.js'] {
  errno: -17,
  code: 'EEXIST',
  syscall: 'open',
  path: 'calculator.js'
}
```

It’s a good practice to specify the `flag` argument.

The `mode` argument specifies the permissions to set for the file. In our case, the permissions are specified as `fs.constants.O_RDONLY`.
