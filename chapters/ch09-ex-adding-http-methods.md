# Exercise 3 - Adding `HTTP` method support

So far, we've built a router capable of matching URL paths to specific handlers. This is a good starting point, but as of now, our router does not differentiate between different HTTP methods like GET, POST, PUT, DELETE, etc. In real-world applications, the same URL path can behave differently based on the HTTP method used, making our current router almost useless for such scenarios.

## Requirements

To make our router more useful and versatile, we need to extend the existing `TrieRouter` and `RouteNode` classes to support different HTTP methods (GET, POST, PUT, DELETE, etc.). This means that each node in the Trie could potentially have multiple handler functions, one for each HTTP method.

## More details

1. Continue with the existing router class `TrieRouter`. Add new functionalities to it.

2. Modify the `RouteNode` class's `handler` member variable. It should now be a `Map` instead of a function, that will store HTTP methods and their corresponding handler functions.

3. The key in the `handler` `Map` will be the HTTP method as a string (like "GET", "POST") and the value will be the handler function for that HTTP method.

4. Modify the `addRoute` method of the `TrieRouter` class to take an additional parameter `method`.

-   `method`: A string representing the HTTP method. This could be "GET", "POST", "PUT", "DELETE", etc.

5. Also update the `findRoute` method. Now it will have another parameter - `method`, to search for routes based on the HTTP method as well as the path.

6. If a handler for a specific path and HTTP method is already present, the new handler should override the old one.

## Example

Once implemented, the usage might look like this:

```js
const trieRouter = new TrieRouter();

function getHandler() {}
function postHandler() {}

trieRouter.addRoute("/home", "GET", getHandler);
trieRouter.addRoute("/home", "POST", postHandler);

console.log(trieRouter.findRoute("/home", "GET")); // -> fn getHandler() {..}
console.log(trieRouter.findRoute("/home", "PATCH")); // -> null or undefined
console.log(trieRouter.findRoute("/home", "POST")); // -> fn postHanlder() {..}
```

Go ahead and add the functionality to our `TrieRouter` class. This will involve making a lot of changes to the previous code. Feel free to share your implementation or ask for feedback in the [Github discussions](https://github.com/ishtms/learn-nodejs-hard-way/discussions) section.

## Hints

1. When you're adding or searching for a route, make sure to consider both the path and the HTTP method.

2. Take care to handle the HTTP method case-insensitively (prefer uppercase). It's common to receive HTTP method names in different cases.

3. Be careful with your error-handling logic to correctly manage the situation where the client does not provide a valid HTTP method.

4. As with Challenge 1, start by making sure the Trie works for a simple case before diving into the more complex functionalities.

5. Don't forget to update your utility functions and other methods to be compatible with these new requirements.

## Solution

Here's the solution I came up with:

```js
function getRouteParts(path) {
    /** stays the same **/
}

const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    CONNECT: "CONNECT",
    TRACE: "TRACE",
};

class Router {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, method, handler) {
        if (typeof path != "string" || typeof handler != "function" || typeof method != "string") {
            throw new Error(
                "Invalid params sent to the `addRoute` method. `path` should be of the type `string`, `method` should be a valid HTTP verb and of type `string` and `handler` should be of the type `function`"
            );
        }

        method = method.toUpperCase();

        let routeParts = getRouteParts(path);

        if (routeParts[routeParts.length - 1] == "") {
            routeParts = routeParts.slice(0, routeParts.length - 1);
        }

        this.#addRouteParts(routeParts, method, handler);
    }

    #addRouteParts(routeParts, method, handler) {
        let node = this.rootNode;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) {
                nextNode = new RouteNode();
                node.children.set(currPart, nextNode);
            }

            if (idx == routeParts.length - 1) {
                nextNode.handler.set(method, handler);
            }

            node = nextNode;
        }
    }

    findRoute(path, method) {
        if (path.endsWith("/")) path = path.substring(0, path.length - 1);

        let routeParts = getRouteParts(path);
        let node = this.rootNode;
        let handler = null;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) break;

            if (idx == routeParts.length - 1) {
                handler = nextNode.handler.get(method);
            }

            node = nextNode;
        }

        return handler;
    }

    printTree(node = this.rootNode, indentation = 0) {
        /** unchanged **/
    }
}

class RouteNode {
    constructor() {
        this.handler = new Map();
        this.children = new Map();
    }
}
```

The new HTTP method implementation introduces several key changes to extend the existing router implementation to support HTTP methods. Below are the details of what was changed and why:

```js
const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    HEAD: "HEAD",
    OPTIONS: "OPTIONS",
    CONNECT: "CONNECT",
    TRACE: "TRACE",
};
```

Firstly, we've defined a constant object named `HTTP_METHODS` to represent the different HTTP methods. This serves as a reference for the HTTP methods that our `TrieRouter` class will support. We might even do some validation, but that is not necessary (we'll look at it in a later chapter why validation isn't required here)

```js
class TrieRouter {
    addRoute(path, method, handler) { ... }
    ...
}
```

In our `TrieRouter` class, we updated the `addRoute` method. It now takes an additional argument, `method`, which specifies the HTTP method for the route.

```js
if (typeof path != "string" || typeof handler != "function" || typeof method != "string") { ... }
```

The error handling has been updated to ensure the `method` is also a string.

```js
method = method.toUpperCase();
```

The `method` string is converted to uppercase to standardize the HTTP methods.

```js
this.handler = new Map();
```

The `handler` in `RouteNode` has changed from a single function reference to a `Map`. This allows you to store multiple handlers for the same path but with different HTTP methods.
