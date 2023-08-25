[![Read Prev](/assets/imgs/prev.png)](/chapters/ch02-your-first-nodejs-server.md)

## Working with files

Now that we've covered the basics of logging in Node.js, let's explore a real-world example. Let us understand the low level of files and how to interact with them. After that, we'll build a logging library [logtar](https://github.com/ishtms/logtar) that writes logs to a log file. It also has a support for tracing and rolling file creation. We’ll use this library as the central mechanism of logging for our web framework, that we build further into this guide.

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

Notice that we're importing the functions `multiply` and `divide` even though we're not exporting them from the `calculator` module. This won't cause any issues until we try to use them. If you run the code above with `node index`, it runs fine but produces no output. Let’s try to understand why it doesn't fail.

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

So, the `multiply` and `divide` identifiers above are just `undefined`. However, if we try to add this line:

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
person.get_age = function get_age() {...}

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

In Unix-like systems, including Linux, file descriptors are often managed using a data structure called a [file table](https://man7.org/linux/man-pages/man5/table.5.html) or [file control block](https://en.wikipedia.org/wiki/File_Control_Block). This table keeps track of the properties and status of each open file, such as the file's current position, permissions, and other relevant information. The file descriptor acts as an **_index_** or key into this table, allowing the operating system to quickly look up the details of the open file associated with a particular descriptor, which is more efficient, and more performant than to iterate over a vector/array of files and find a particular file.

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

async function open_file() {
    const file_handle = await fs.open("calculator.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle);
}

module.exports = open_file;
```

and in `index.js`

```jsx
// index.js
const open_file = require("./files");

open_file();

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

### `path` argument

1. String **Paths:**
   The most common way to represent file paths is as strings. A string path can be either a relative or an absolute path. It's simply a sequence of characters that specifies the location of a file on the computer.
   - Example of relative string path: **`"./calculator.js"`**
   - Example of absolute string path: **`"/Users/ishtmeet/Code/intro-to-node/calculator.js"`**
2. **Buffer Paths:**
   While strings are the most common way to represent paths, Node.js also allows you to use **`Buffer`** objects to represent paths. A **`Buffer`** is a low-level data structure that can hold binary data. In reality, using **`Buffer`** objects for paths is less common. Read about [Buffers](#buffers) here
3. **URL Paths:**
   With the **`URL`** module in Node.js, you can also represent file paths using URLs. The URL must be of scheme file.
   Example URL path:

```jsx
const url_path = new URL("file:///home/user/projects/calculator.js");
```

### `flag` argument

The `flag` argument indicates the mode (not to confused by `mode` argument) in which you wish to open the file. Here are the supported values as a `flag` -

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

Let’s use `wx+` to show a small example. `wx+` will open a file for read and write, but fail to open a file if it already exists. If teh file doesn’t exists it will create a file and work just fine.

```jsx
// calculator.js
const file_handle = await fs.open(
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

### `mode` argument

The `mode` argument specifies the permissions to set for the file when its created. `mode`s are always interpreted **in octal.** For example,

- **`0o400`** (read-only for the owner)
- **`0o600`** (read and write for the owner)
- **`0o644`** (read for everyone, write only for the owner)

You don’t need to remember the octal representation. Simply use the `fs.constants.your_mode` to access it.

In our case, the permissions are specified as `fs.constants.O_RDONLY`. Here is a list of available `modes` that can be used. Notice the `O_` prefix, which is short for `Open`. This prefix tells us that it will only work when used with `fs.open()`.

**Modes to use with `fs.open()`**

```jsx
/** Flag indicating to open a file for read-only access. */
const O_RDONLY: number;

/** Flag indicating to open a file for write-only access. */
const O_WRONLY: number;

/** Flag indicating to open a file for read-write access. */
const O_RDWR: number;

/** Flag indicating to create the file if it does not already exist. */
const O_CREAT: number;

/** Flag indicating that opening a file should fail if the O_CREAT flag is set and the file already exists. */
const O_EXCL: number;

/** Flag indicating that if the file exists and is a regular file, and the file is opened successfully for write access, its length shall be truncated to zero. */
const O_TRUNC: number;

/** Flag indicating that data will be appended to the end of the file. */
const O_APPEND: number;

/** Flag indicating that the open should fail if the path is not a directory. */
const O_DIRECTORY: number;

/** Flag indicating that the open should fail if the path is a symbolic link. */
const O_NOFOLLOW: number;

/** Flag indicating that the file is opened for synchronous I/O. */
const O_SYNC: number;

/** Flag indicating that the file is opened for synchronous I/O with write operations waiting for data integrity. */
const O_DSYNC: number;

/** Flag indicating to open the symbolic link itself rather than the resource it is pointing to. */
const O_SYMLINK: number;

/** When set, an attempt will be made to minimize caching effects of file I/O. */
const O_DIRECT: number;

/** Flag indicating to open the file in nonblocking mode when possible. */
const O_NONBLOCK: number;
```

Going back to the code we wrote in the `files` module

```jsx
// files.js
const fs = require("node:fs/promises");

async function open_file() {
    const file_handle = await fs.open("calculator.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle);
}

module.exports = open_file;
```

The return type of `fs.open()` is a `FileHandle`. A file handle is like a connection between the application and the file on the storage device. It lets the application work with files without worrying about the technical details of how files are stored on the device.

We previously discussed **file descriptors**. You can check which descriptor is assigned to an opened file.

```jsx
// files.js

..

async function open_file() {
    const file_handle = await fs.open("calculator.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle.fd); // Print the value of the file descriptor `fd`
}

..

// Outputs -> 20
```

You may get the same integer value for the file descriptor if you try to run the program multiple times. But if you try to create another file handle, it should have a different file descriptor

```jsx
// files.js

..

async function open_file() {
    const file_handle     = await fs.open("calculator.js", "r", fs.constants.O_RDONLY);
    const file_handle_two = await fs.open("calculator.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle.fd);
    console.log(file_handle_two.fd);
}

..

// Outputs ->
20
21
```

> Note that if a `FileHandle` is not closed using the `file_handle.close()` method, it will try to automatically close the file descriptor and emit a process warning, helping to prevent memory leaks. It’s always good practice to call `file_handle.close()` to explicitly close it. However, in our case, the program exits just after running the `open_file` function, so it doesn't matter in our case.

One import thing to note is, `open`ing a file can fail, and will throw an exception.

`fs.open()` can throw errors in various scenarios, including:

- `EACCES`: Access to the file is denied or permission is lacking, or the file doesn't exist and parent directory isn't writable.
- `EBADF`: The directory file descriptor is invalid.
- `EBUSY`: The file is a block device in use or mounted.
- `EDQUOT`: Disk quota for user is exceeded when creating a file.
- `EEXIST`: File already exists while trying to create it exclusively.
- `EFAULT`: Path is outside accessible memory.
- `EFBIG` / `EOVERFLOW`: File is too large to open.
- `EINTR`: Opening a slow device is interrupted by a signal.
- `EINVAL`: Invalid flags or unsupported operations.
- `EISDIR`: Attempting to write to a directory, or using `O_TMPFILE` on a version that doesn't support it.
- `ELOOP`: Too many symbolic links encountered.
- `EMFILE`: Process reached its limit of open file descriptors.
- `ENAMETOOLONG`: Pathname is too long.
- `ENFILE`: System-wide limit on open files is reached.
- `ENOENT`: File or component in path doesn't exist.
- `ENOMEM`: Insufficient memory for FIFO buffer or kernel memory.
- `ENOSPC`: No space left on device.
- `ENOTDIR`: Component in path is not a directory.
- `ENXIO`: File doesn't correspond to device, socket, or FIFO.
- `EOPNOTSUPP`: Filesystem doesn't support `O_TMPFILE`.
- `EROFS`: File is on read-only filesystem.
- `ETXTBSY`: File is being executed, used as swap, or read by kernel.
- `EPERM`: Operation prevented by file seal or mismatched privileges.
- `EWOULDBLOCK`: `O_NONBLOCK` specified, incompatible lease held on the file.

Make sure to handle errors gracefully. There may be cases where you don't need to handle the errors and want the program to fail, exit, or throw an error to the client. For example, if you're writing a CLI application that compresses an image using the `path/to/image` provided as an argument, you want it to fail to let the user know that there is an issue with the file/path provided.

To catch errors, wrap the code inside a `try/catch` block.

```jsx
// files.js

..

async function open_file() {
  try {
    const file_handle = await fs.open("config", "r", fs.constants.O_WRONLY);
        // do something with the `file_handle`
  } catch (err) {
    // Do somethign with the `err` object
  }
}

..
```

## Reading from a file

Too much of the theory. We’ll work on a real example now. Let’s try to read from a file. We’ll create a `log_config.json` file, in the `config` folder. The directory structure will look something like this (get rid of the `calculator` module)

```
.
├── config
│   └── log_config.json
├── files.js
└── index.js
```

Add these content inside the `log_config.json` file

```jsx
// log_config.json

{
  "log_prefix": "[LOG]: "
}
```

Node.js provides many utility methods for reading from a specific file using the `file_handle`. There are different ways to handle interactions with the files from the `node:fs` and the `node:fs/promises` modules. But we’re specifically going to use a `file_handle` for now.

```jsx
// files.js

const fs = require("node:fs/promises");

// This function asynchronously opens a file, reads it line by line
// and logs each line on the console.
async function read_file() {
    try {
        // open the file in read-only mode.
        const file_handle = await fs.open("./index.js", "r", fs.constants.O_RDONLY);

        // create a stream to read the lines of the file.
        let stream = file_handle.readLines({
            // start reading from the beginning of the file.
            start: 0,

            // read till the end of the file.
            end: Infinity,

            // specify the encoding to be utf8, or else the stream
            // will emit buffer objects instead of strings.
            encoding: "utf8",

            /**
             * If autoClose is false, then the file descriptor won't be closed,
             * even if there's an error. It is the application's responsibility
             * to close it and make sure there's no file descriptor leak. If
             * autoClose is set to true (default behavior), on 'error' or 'end' the
             * file descriptor will be closed automatically.
             */
            autoClose: true,

            /**
             * If emitClose is true, then the `close` event will be emitted
             * after reading is finished. Default is `true`.
             */
            emitClose: true,
        });

        // The 'close' event is emitted when the file_handle has been closed
        // and can no longer be used.
        stream.on("close", () => {
            console.log("File handle %d closed", file_handle.fd);
        });

        // The 'line' event be fired whenver a line is read from the file.
        stream.on("line", (line) => {
            console.log("Getting line -> %s", line);
        });
    } catch (err) {
        console.error("Error occurred while reading file: %o", err);
    }
}

module.exports = read_file;
```

This outputs

```
Getting line -> const open_file = require("./files");
Getting line ->
Getting line -> open_file();
File handle 20 closed
```

The code above has a function called `open_file` that does three things: open a file, read each line, and show each line on the console.

This function uses the `fs` module. It opens a read-only file and creates a stream to read it. The function can read only some lines using the `start` and `end` options. The function also needs to know the file's characters using the `encoding` option.

This function also sets two options to handle the file descriptor automatically when the reading is finished. Finally, this function creates two listeners to handle two events: `close` and `line`. The `close` event tells the function that the file handle has been closed. The `line` event tells the function that it has read a line from the file.

If there's an error while reading the file, the function shows an error message on the console.

One thing to note is that we used string substitution `%s` instead of template literals. When passing a string to one of the methods of the `console` object that accepts a string, you may use these substitution strings:

- `%o` or `%O`: Outputs a JavaScript object. Clicking the object name opens more information about it in the inspector (browser).
- `%d`: Outputs an integer. Number formatting is supported. For example, `console.log("Foo %d", 1)` will output the number as an number (will retain floating point value).
- `%i`: Outputs an integer. Number formatting is supported. For example, `console.log("Foo %i", 1.1)` will output the number as an integer (will truncate the floating point value).
- `%s`: Outputs a string.
- `%f`: Outputs a floating-point value. Formatting is supported. For example, `console.log("Foo %f", 1.1)` will output "Foo 1.1".

> Using `%o` to show the output on terminal, just prints the whole object as a string, this is something that the string substitution has an advantage over template literals.

We can simplify the above code. I included all possible option keys previously just to show that they exist, and you could use them if you want to have more control over what you’re doing.

The simplified version looks like this

```jsx
// files.js

...

async function read_file() {
  try {
    const file_handle = await fs.open("./index.js");
    const stream = file_handle.readLines();

    // we'll get to this syntax in a bit
    for await (const line of stream) {
      console.log("Reading line of length %d -> %s", line.length, line);
    }
  } catch (err) {
    console.error("Error occurred while reading file: %o", err);
  }
}

...
```

This outputs

```
Reading line of length 59 -> const { read_entire_file, read_file } = require("./files");
Reading line of length 0 ->
Reading line of length 12 -> read_file();
```

Notice that we get rid of all those options since they are already set to default values for our convenience. Only specify them if you wish to choose values other than the defaults.

## A small primer on `for..of` and `for await..of` in javascript

### `for..of`

The **`for..of`** loop is a JavaScript feature that provides an easy and straightforward way to go through elements in an array, string, or other [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) objects. It makes it simpler to iterate through each item without the need to manage the loop's index or length manually.

Let's look at the syntax:

```js
for (const element of iterable) {
  // Code to be executed for each element
}
```

Here's an overview of how the **`for..of`** loop works:

1. **`for`**: This is the keyword that indicates the start of the loop structure.
2. **`element`**: This is a variable that you define to represent the current element of the iterable in each iteration of the loop. In each iteration, the **`element`** variable will hold the value of the current element in the iterable.
3. **`of`**: This is a keyword that signifies the relationship between the **`element`** variable and the **`iterable`** you're looping through.
4. **`iterable`**: This is the collection or object you want to iterate over. It can be an array, a string, a set, a map, or any other object that has a collection of items.

Here's an example of using **`for..of`** to loop through an array:

```jsx
const fruits = ['apple', 'banana', 'orange', 'grape'];

for (const fruit of fruits) {
  console.log(fruit);
}
```

The loop will iterate through each element in the **`fruits`** array, and in each iteration, the **`fruit`** variable will contain the value of the current fruit. The loop will log:

```
apple
banana
orange
grape
```

The **`for..of`** loop is particularly useful when you don't need to access the index of the elements directly. It provides a cleaner and more concise way to work with iterable objects.

Note that the **`for..of`** loop can't be used to directly loop over properties of an object. It's specifically designed for iterating over values in iterable collections. If you need to loop through object properties, the traditional **`for..in`** loop or using **`Object.keys()`**, **`Object.values()`**, or **`Object.entries()`** would be more appropriate.

### `for await..of`

The **`for await..of`** loop is an extension of the **`for..of`** loop. It is used for asynchronous operations and iterables. It can iterate over asynchronous iterable objects like those returned by asynchronous [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) or promises. The loop is useful when dealing with asynchronous operations like fetching data from APIs or reading from streams, just like we did above!

Here's how the **`for await..of`** loop works:

```jsx
for await (const element of async_iterable) {
  // Asynchronous code to be executed for each element
}
```

Let's break down the key components:

1. **`for await`**: These keywords start the asynchronous loop structure.
2. **`element`**: This variable represents the current element of the asynchronous iterable in each iteration of the loop.
3. **`async_iterable`**: This is an asynchronous iterable object, such as an asynchronous generator, a promise that resolves to an iterable, or any other object that implements the asynchronous [iteration protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

Here's an example of using **`for await..of`** to loop through an asynchronous iterable:

```jsx
async function fetch_fruits() {
  const fruits = ['apple', 'banana', 'orange', 'grape'];

  for await (const fruit of fruits) {
    console.log(fruit);

    // a dummy async operation simulation
    await new Promise(resolve => setTimeout(resolve, 1000)); 
  }
}

fetch_fruits();
```

Here, the **`fetchFruits`** function uses the **`for await..of`** loop to iterate through the **`fruits`** array asynchronously. For each fruit, it logs the fruit name and then simulates an asynchronous operation using **`setTimeout`** to pause for a second.

The **`for await..of`** loop is a handy tool when working with asynchronous operations. It allows us to iterate over the results of promises or asynchronous generators in a more readable and intuitive way. It ensures that the asynchronous operations within the loop are executed sequentially, one after the other, even if they have varying completion times.

## Reading the `json` file

However, reading a json file line by line isn’t the best way. The `readLine` is a very memory-efficient way to read files. It does not load all the contents of the file into memory, which is usually what we want. But if the file is small, and you know before hand, that the file is not really big, it’s usually quicker, and more performant to load the entire file at once into the memory.

> If you're dealing with large files, it's usually better to use a buffered version, i.e `createReadStream()` or `readLines()`

Let’s update the code

```jsx
...

async function read_file() {
  try {
    const file_handle = await fs.open("./config/log_config.json");
    const stream = await file_handle.readFile();

    console.log("[File contents] ->\n %s", stream);
  } catch (err) {
    console.error("Error occurred while reading file: %o", err);
  }
}

...
```

Outputs

```jsx
[File contents] ->
 {
  "log_prefix": "[LOG]: "
}
```

Nice. But what happens, if we do not use the string substitution with `%s`?

```jsx
console.log("[File contents] ->\n", stream);
```

Strangely, this outputs some weird looking stuff

```
[File contents] ->
 <Buffer 7b 0a 20 20 22 6c 6f 67 5f 70 72 65 66 69 78 22 3a 20 22 5b 4c 4f 47 5d 3a 20 22 0a 7d 0a>
```

Why is it so? And what is a `Buffer`? This is one of the most unvisited topic of programming. Let’s take a minute to understand it.

# Buffers

`Buffer` objects are used to represent a fixed-length sequence of bytes, in memory. **`Buffer`** objects are more memory-efficient compared to JavaScript strings when dealing with data, especially very large datasets. This is because strings in JavaScript are UTF-16 encoded, which can lead to higher memory consumption for certain types of data.

Q: But why does the `readLines()` method returned strings if it’s not “efficient”?

Well turns out, they do indeed use buffers internally to efficiently read and process data from files or streams. `readLines()` is a special variant of `createReadStream()` which is designed to provide a convenient interface for working with lines of text content, making it easier for developers to interact with the data without needing to handle low-level buffer operations directly.

So, what you're looking at when you see the value of a buffer is just a raw representation of binary data in **_hexadecimal format_**. This raw data might not make much sense to us as humans because it's not in a readable format like text.

To print the json file to the console, we have 3 ways.

**First method**

```jsx
console.log("[File contents] ->\n", stream.toString("utf-8"));
```

**Second method**

String substitution to the rescue again

```jsx
console.log("[File contents] ->\n %s", stream);
```

The second method is much more user friendly. They automatically serialize the binary content into a string. But, to use and manipulate the string contents, we’ll have to fall back to the first method.

**Third method**

Set the `encoding` option to `utf-8`

```jsx
const stream = await file_handle.readFile({ encoding: "utf-8" });
console.log("[File contents] ->\n", stream);
```

### Parsing the `json` file

To read the `log_prefix` property that we specified into the `config/log_config.json` file, let’s parse the contents of the file.

> Many people use the `require('file.json')` way, but there are several drawbacks to it. First, the entire file is loaded into memory when your program encounters the require statement. Second, if you update the json file during runtime, the program will still refer to the old data. It is recommended to use `require()` only when you expect the file not to change, and it is not excessively large; otherwise, it will always remain in memory.

```jsx
// files.js

...

const stream = await (await fs.open("./config/log_config.json")).readFile();
const config = JSON.parse(stream);

console.log('Log prefix is: "%s"', config.log_prefix);

...

// Outputs ->
// Log prefix is: "[LOG]: "
```

This looks fine, but it is not a very good practice to specify paths like this. Using **`"./config/log_config.json"`** assumes that the **`config`** directory is located in the same directory as the current working directory of the terminal. This might not always be the case, especially if your script is being run from a different working directory, eg. from the config folder. To test this behavior, `cd config` and run `node ../index.js`

```jsx
Error occurred while reading file: [Error: ENOENT: no such file or directory, open './config/log_config.json'] {
  [stack]: "Error: ENOENT: no such file or directory, open './config/log_config.json'",
  [message]: "ENOENT: no such file or directory, open './config/log_config.json'",
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: './config/log_config.json'
}
```

This expects the path is relative to the current working directory, hence not what we expect. We should be able to run the script from anywhere, no matter what folder we are in. This is very useful for large projects having folders multiple levels deep.

Update the code to include the `path` module in scope

```jsx
// files.js

const path = require('path');

...

const log_path = path.join(__dirname , 'config' , 'log_config.json');
const stream = await (await fs.open(log_path)).readFile();

...
```

Using **`__dirname`** and the **`path`** module ensures that you are referencing the correct path regardless of the current working directory you’re in.

`__dirname` is a special (module-level) variable that represents the absolute path of the directory containing the current JavaScript file. Isn’t it magic?

`path.join()` method joins all given `path` segments together using the **platform-specific separator** as a delimiter, then normalizes the resulting path. Zero-length `path` segments are ignored. If the joined path string is a zero-length string then `'.'` will be returned, representing the current working directory.

The full code of `files.js` looks like this now.

```jsx
const fs = require("node:fs/promises");
const path = require("path");
async function read_file() {
    try {
        const log_path = path.join(__dirname, "config", "log_config.json");
        const stream = await (await fs.open(log_path)).readFile();
        const config = JSON.parse(stream);

        console.log('Log prefix is: "%s"', config.log_prefix);
    } catch (err) {
        console.error("Error occurred while reading file: %o", err);
    }
}
```

Now you can run the code from whatever directory, no matter how much deeply nested it is, it is going to work fine unless you move the `files.js` file to a different location.

[![Read Next](/assets/imgs/next.png)](/chapters/ch04-logtar-our-logging-library.md)

![](https://uddrapi.com/api/img?page=ch03)
