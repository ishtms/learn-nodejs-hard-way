[![Read Prev](/assets/imgs/prev.png)](/chapters/ch07-ex-implementing-a-trie.md)

# Exercise 2 - Implementing our Trie based `Router`

> This challenge is designed to push your boundaries and is considered to be more advanced than usual. It's completely okay if you don't crack it on your first attempt. The key is to persist, revisit your logic, and don't hesitate to iterate on your solutions.

Since we just built a Trie data structure that can efficiently insert and search words, we can further enhance its capabilities by extending it to implement a Trie-based router for matching URL patterns. This powerful application of `Trie` data structure is commonly utilized in web frameworks, where it plays a crucial role in efficiently routing incoming HTTP requests to their respective handler functions.

By building a `Trie`-based router, our framework can achieve optimal performance and scalability, ensuring that each request is efficiently directed to the appropriate handler for processing.

## Challenge 1: Implementing the `addRoute` method

### Requirements

Create a new class, `TrieRouter`, similar to what we had earlier - `Trie`. Add a method, `addRoute`, that takes in a URL pattern (like `/home` or `/user/status/play`) as a first parameter and a handler function as second parameter. Then insert the URL pattern into the `TrieRouter`, associating the handler function with the last node of that pattern.

### More details

1. **Class Definition**: Define a class named `TrieRouter`. This class should contain:

    - A root node, which is the starting point of the Trie.
    - A method called `addRoute`.

2. **Route Node**: Define a class named `RouteNode` which will represent all the nodes.

    1. `RouteNode` should contain the handler function, which will be `null` or `undefined` for all nodes except the end nodes of each URL pattern.

    2. `RouteNode` should also contain a `Map` to store its children nodes, where the key will be the URL segment eg "home" or "user", and the value will be another `RouteNode`

3. **Root Node**: The root node is an empty node of the type `RouteNode`, that serves as the starting point for inserting new URL patterns into the Trie. Initialize it in the constructor of `TrieRouter`.

4. **Method - `addRoute`**: This method takes in two parameters:

    - `path`: A string representing the URL pattern to add to the Trie. The URL pattern will be segmented by forward slashes `/`.

    - `handler`: A function that should be called when the URL pattern is matched.

    - Remove the trailing slash `/` from the `path` if it exists.

    - The method should insert the `path` into the `TrieRouter`, associating the `handler` function with the last node of that pattern.

5. **Trailing forward-slashes**: You should treat routes that end with a forward slash `/` the same as those that don't, so that `/home/` and `/home` point to the same handler.

6. **Repeated forward-slashes**: You should remove all the repeated `/` in the path.

    1. `/user//hello////` should resolve as `/user/hello`

    2. `/user//////////` should resolve as `/user`

7. **Remove whitespaces** before and after all the url segments. For example `/   user/ node  /` should resolve as `/user/node`

8. **Reject URLs** that do not start with `/`

    1. If someone uses `trieRouter.addRoute("hi/something")`, your code should throw an error.

Once implemented, we should be able to do something like this:

```js
const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});

// /home -> valid
// /user/status/play -> valid
// /user/status -> invalid
// /user -> invalid
// /home/ -> valid
// /user/status/play/ -> invalid
```

You don't need to worry about making HTTP requests just yet. A correctly implemented `TrieRouter` should look like this after adding both the routes mentioned above -

```bash
                (Root)
                  |
      -----------------------
      |           |          |
    "home"      "user"     (other segments)
      |           |
function ref   "status"
                  |
                  |
               "play"
                  |
         function inline
```

Go ahead and implement your version of the `TrieRouter`, `RouteNode` and `addRoute`. Here's a starting boilerplate for the challenge. You may proceed without using the boilerplate code if you're comfortable.

You may then share your code to help others or to receive feedback in the [Github discussions](https://github.com/ishtms/learn-nodejs-hard-way/discussions) section. I'll try to review all the code submissions and provide feedback if required.

```js
class TrieRouter {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        /* Add route code goes here */
    }
}

class RouteNode {
    constructor() {
        /** Define handler and children map **/
    }
}
```

### Hints

1. Remember that a Trie is a tree-like structure where each node represents a piece/segment of a URL. Understanding the hierarchy can simplify the process.

2. Before diving into implementing all the conditions like removing trailing slashes or spaces, make sure your Trie works with the simplest case, such as adding a single route.

3. Consider breaking the URL path into segments using `split("/")` and loop through the segments to traverse the Trie.

4. Keep in mind that the handler function is associated with the end node of the URL pattern. Make sure you place the handler only at the right node.

5. Use the `Map` in each node to store its children. When adding a new route, check if a node for a segment exists; if it does, traverse to it. Otherwise, create a new node.

6. To deal with trailing slashes, repeated slashes, and whitespaces, you could write utility functions that normalize the path before processing it.

### Solution

Kudos to those who successfully implemented the `addRoute` function in the `TrieRouter` class. You've just completed the first difficult exercise in this book, showcasing not only your coding abilities but also your problem-solving skills.

For those who found this challenge particularly challenging, don't get discouraged. The complexities you faced are what deepen your understanding and enhance your coding skills. Consider revisiting this exercise after looking at the solution or scraping and starting again from scratch.

```js
class RouteNode {
    constructor() {
        this.handler = null;
        this.children = new Map();
    }
}

class TrieRouter {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        if (typeof path != "string" || typeof handler != "function") {
            throw new Error(
                "Invalid params sent to the `addRoute` method. `path` should be of the type `string` and `handler` should be of the type `function`"
            );
        }

        let routeParts = path
            .replace(/\/{2,}/g, "/")
            .split("/")
            .map((curr) => curr.toLowerCase().trim());

        if (routeParts[routeParts.length - 1] == "") {
            routeParts = routeParts.slice(0, routeParts.length - 1);
        }

        this.addRouteParts(routeParts, handler);
    }

    addRouteParts(routeParts, handler) {
        let node = this.rootNode;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) {
                nextNode = new RouteNode();
                node.children.set(currPart, nextNode);
            }

            if (idx === routeParts.length - 1) {
                nextNode.handler = handler;
            }

            node = nextNode;
        }
    }
}

const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", ref);
```

Let's visualize our tree. I've created a new method inside the `TrieRouter` class, which prints all the nodes of our `TrieRouter` recursively:

```js
class TrieRouter {
    ...

    printTree(node = this.rootNode, indentation = 0) {
        const indent = "-".repeat(indentation);

        node.children.forEach((childNode, segment) => {
            console.log(`${indent}${segment}`);
            this.printTree(childNode, indentation + 1);
        });
    }

    ...
}
```

To check our output, let's execute our file:

```js
const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", ref);
trieRouter.printTree();
```

Output:

```bash
$node trie_router.js

# OUTPUT
-home
--id
-user
--status
---play
```

Looks perfect. Let's go through the code and understand what's going on.

### Explanation

```js
class RouteNode {
    constructor() {
        // Initialize the handler to null
        this.handler = null;

        // Create a Map to store children nodes
        this.children = new Map();
    }
}
```

In the `RouteNode` class, each node is initialized with a `handler` set to `null`. This handler will hold a reference to the function we want to execute when a route matching the URL pattern is requested. Alongside the handler, we created a `children` Map. This Map will contain references to the next nodes in the Trie, allowing us to navigate through the Trie using URL segments as keys.

```js
class TrieRouter {
    constructor() {
        // Create a rootNode upon TrieRouter instantiation
        this.rootNode = new RouteNode();
    }
}
```

The `TrieRouter` class acts as a manager for the Trie data structure. When an instance of this class is created, a `rootNode` is initialized. This root node acts as the entry point for any operation that needs to traverse the Trie, essentially representing the root of the Trie structure.

```js
addRoute(path, handler) {
    // Validate input types
    if (typeof path != "string" || typeof handler != "function") {
        throw new Error("Invalid params ...");
    }
}
```

The `addRoute` method is responsible for adding URL patterns and their corresponding handlers to the Trie. The method starts by validating the inputs, ensuring that `path` is a string and `handler` is a function. If either of these conditions isn't met, an error is thrown.

```js
addRoute(path, handler) {
    ...
    // Normalize the path by removing consecutive slashes
    // and breaking it down into its segments
    let routeParts = path.replace(/\/{2,}/g, "/").split("/").map((curr) => curr.toLowerCase().trim());
    if (routeParts[routeParts.length - 1] == "") {
        routeParts = routeParts.slice(0, routeParts.length - 1);
    }
}
```

The next part of the `addRoute` method preprocesses the path. First, consecutive slashes are replaced with a single slash. Then, the path is split into its segments (parts between slashes), and each segment is converted to lowercase and trimmed of any leading or trailing spaces. Finally, if the last segment is empty, which can happen if the path has a trailing slash, it's removed from the array of segments.

```js
addRoute(path, handler) {
    ...
    // Delegate the actual Trie insertion to a helper method
    this.addRouteParts(routeParts, handler);
}
```

The final action in the `addRoute` method is to call a helper function named `addRouteParts`, passing the preprocessed segments (`routeParts`) and the `handler`. This modularizes the code, separating the preprocessing and validation logic from the Trie insertion logic.

```js
addRouteParts(routeParts, handler) {
    // Start at the rootNode of the Trie
    let node = this.rootNode;

    // Loop through all segments of the route
    for (let idx = 0; idx < routeParts.length; idx++) {
        let currPart = routeParts[idx];

        // Attempt to find the next node in the Trie
        let nextNode = node.children.get(currPart);
        ...
}
```

The `addRouteParts` method starts by setting `node` to the `rootNode` of the Trie. A `for` loop then iterates through each segment in the `routeParts` array. For each segment, the code checks if a child node with that segment as the key already exists in the `children` Map of the current node.

```js
addRouteParts(routeParts, handler) {
    ...

    // If the next node doesn't exist, create it
    if (!nextNode) {
        nextNode = new RouteNode();
        node.children.set(currPart, nextNode);
    }

    // If this is the last segment, assign the handler to this node
    if (idx === routeParts.length - 1) {
        nextNode.handler = handler;
    }
    
    // Move to the next node for the next iteration
    node = nextNode;
}
```

If a child node for the current segment does not exist, a new `RouteNode` is instantiated, and it's added to the `children` Map of the current node with the segment as the key. Then, if the current segment is the last in the `routeParts` array, the handler function is associated with this new node. Finally, the current node is updated to this new node, ready for the next iteration or to end the loop.

That's it. We now have a working implementation of our router, but does only support adding routes. The next challenge involves finding route and returning the handler associated with it

## Challenge 2: Implementing the `findRoute` method

### Requirements

You've successfully implemented the `addRoute` method to build our `Trie`-based router. Now, lets extend our `TrieRouter` class by adding another method, `findRoute`. This method should take a URL pattern (e.g., `/home` or `/user/status/play`) as its parameter. Search the `TrieRouter` and find the handler function associated with the last node that matches the pattern.

### More details

1. **Method - `findRoute`**: Add a method to your `TrieRouter` class called `findRoute`.

-   This method should take a single parameter, `path`, which is a string representing the URL pattern to find in the Trie.

-   Return the handler function associated with the last node of the matching URL pattern.

-   If the URL pattern is not found, return `null` or some indication that the route does not exist.

2. **Path Normalization**: Before searching for the route in the Trie, normalize the path similar to what you did in `addRoute`.

-   Remove trailing slashes.

-   Handle repeated slashes.

-   Remove whitespaces before and after each URL segment.

3. **Traversal**: Start from the root node and traverse the Trie based on the URL segments. Retrieve the handler function from the last node if the path exists.

4. **Route Matching**: The Trie should now allow for a partial match. For instance, if a handler is set for `/user/status`, a request for `/user/status/play` should return null if `/user/status/play` has not been set!

5. **Case Sensitivity**: Make sure to convert the url paths into lower-case before matching. So `/AbC` and `/abc` should result to the same handler.

Once implemented, we should be able to do something like this:

```js
const trieRouter = new TrieRouter();

function homeHandler() {}
function userHandler() {}

trieRouter.addRoute("/home", homeHandler);
trieRouter.addRoute("/user/status", userHandler);

console.log(trieRouter.findRoute("/home")); // Should return homeHandler
console.log(trieRouter.findRoute("/user/status")); // Should return userHandler
console.log(trieRouter.findRoute("/user/status/play")); // Should return null
```

Feel free to share your implementation or ask for feedback in the [Github discussions](https://github.com/ishtms/learn-nodejs-hard-way/discussions) section. I'll try to review all code submissions and provide feedback if required.

### Starting Boilerplate

Feel free to use the starting boilerplate below. If you are comfortable, you may proceed without it.

```js
class TrieRouter {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        /* Your addRoute code */
    }

    findRoute(path) {
        /* Your findRoute code goes here */
    }
}

class RouteNode {
    constructor() {
        /* Define handler and children map */
    }
}
```

### Hints

1. When traversing the Trie, you may find it beneficial to break down the URL pattern into segments just like you did while inserting the route.

2. Be careful about the return values. Ensure you return the handler function if a match is found and a suitable indicator (like `null`) if no match exists.

3. For path normalization, you might want to reuse the functionality that we wrote for the `addRoute` method to handle things like trailing slashes and repeated slashes. Even better - extract it into it's own helper function (not method).

4. While traversing, always check if you have reached a leaf node (the end node) or if the traversal needs to continue to find the appropriate handler.

### Solution

Here's the solution that I came up with:

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        .map((curr) => curr.toLowerCase().trim());
}

class Router {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        ...

        let routeParts = getRouteParts(path);
        /** Rest unchanged **/
    }

    addRouteParts(routeParts, handler) {
        /** Nothing changed **/
    }

    findRoute(path) {
        if (path.endsWith("/")) path = path.substring(0, path.length - 1);

        let routeParts = getRouteParts(path);
        let node = this.rootNode;
        let handler = null;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) break;

            if (idx == routeParts.length - 1) {
                handler = nextNode.handler;
            }

            node = nextNode;
        }

        return handler;
    }

    printTree(node = this.rootNode, indentation = 0) {
       /** Nothing changed **/
    }
}

class RouteNode {
    /** same as before **/
}
```

### Explanation

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        .map((curr) => curr.toLowerCase().trim());
}
```

I've extracted the path normalization logic into it's own helper function. Since we would need to use this functionality in the `findRoute` method as well, it seemed like a good idea to remove it from the `addRoute` method.

```js
addRoute(path, handler) {
    ...

    let routeParts = getRouteParts(path);
    /** Rest unchanged **/
}
```

We're using the newly created `getRouteParts` function to normalize and segment the path into `routeParts`. The rest of the implementation remains the same as before.

```js
    findRoute(path) {
        // removes the trailing forward slash
        if (path.endsWith("/")) path = path.substring(0, path.length - 1);

        // Initialize variables for route parts, current Trie node, and handler
        let routeParts = getRouteParts(path);
        let node = this.rootNode;
        let handler = null;
        ...
    }
```

We've initialized three key variables. The `routeParts` variable stores the normalized URL segments obtained from calling `getRouteParts()`. The `node` variable keeps track of our current position in the Trie and is initialized to the root node. The `handler` variable is initialized to `null` and will later store the handler function if a match is found.

```js
findRoute(path) {
    ...

    // Traverse the Trie based on the URL segments
    for (let idx = 0; idx < routeParts.length; idx++) {
        let currPart = routeParts[idx];

        // Retrieve the child node corresponding to the current URL segment
        let nextNode = node.children.get(currPart);
    ...
}
```

We loop through each segment of the `routeParts` array. Within the loop, `currPart` holds the current URL segment, and `nextNode` is obtained from the `children` map of the current `node` based on this segment. This part is crucial because we're determining if a child node exists for the current URL segment in our Trie.

```js
findRoute(path) {
    ...
    // If the next node doesn't exist, exit the loop
    if (!nextNode) break;

    // If this is the last segment, grab the handler if exists
    if (idx == routeParts.length - 1) {
        handler = nextNode ? nextNode.handler : null;
    }
    ...
}
```

First, the method checks whether `nextNode` exists. If it doesn't, the loop is immediately exited using `break`. This means that the Trie doesn't contain a matching route for the given URL, and there's no need to continue searching.

Then, we check whether the loop has reached the last segment (leaf node) of the URL (`routeParts.length - 1`). If it has, we attempt to retrieve the `handler` function associated with the `nextNode`. If `nextNode` doesn't exist, `handler` remains null.

```js
findRoute(path) {
    ...
    for(...) {
        ...
        // Update the current Trie node for the next iteration
        node = nextNode;
    }

    // Return the handler if found, otherwise null will be returned
    return handler;
}
```

Firstly, we update `node` to `nextNode` for the next iteration. This allows the loop to move deeper into the Trie as it iterates through each URL segment. After the loop, the method returns the `handler` that was found. If no handler is found during the Trie traversal, the return value will be `null`.

Let's test our code:

```js
const trieRouter = new TrieRouter();

function ref() {}
function refs() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", refs);

console.log(trieRouter.findRoute("/home/"));
console.log(trieRouter.findRoute("/home"));
console.log(trieRouter.findRoute("/home/id/"));
console.log(trieRouter.findRoute("/home/id/1"));
console.log(trieRouter.findRoute("/user/status/play"));
console.log(trieRouter.findRoute("/user/status/play/"));
```

This outputs:

```bash
[Function: ref]
[Function: ref]
[Function: refs]
null
[Function: inline]
[Function: inline]
```

Everything seems to be working well. This is it for the `findRoute` method. This was much easier than our `addRoute` implementation, since we only cared about searching. Excellent, we've grasped the basics well! Now let's move on to the more advanced features in the next chapter, ie Implementing HTTP methods with our router.
