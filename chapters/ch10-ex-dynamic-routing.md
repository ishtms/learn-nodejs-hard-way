# Exercise 4 - Implementing Dynamic Routing

When we're building a server application, dynamic routing is an essential feature for creating flexible and scalable applications. To fully grasp its significance and how we can enhance our router to support dynamic routes like `/users/:id`, let's delve into the concept of dynamic routing.

## Why Dynamic Routing?

At its core, dynamic routing refers to the ability of a web application (not just server) to handle requests to URLs that are not predetermined but rather, are defined by patterns. It allows developers to create routes that can match a range of URL structures, often using parameters. For instance, a URL like `/users/:user_id` can handle requests for any user ID, where `:user_id` is a variable part of the URL.

### Flexibility

Dynamic routing introduces a level of flexibility that static routing cannot match. As applications grow and become more complex, new routes often need to be added. With dynamic routing, you can handle a vast number of routes with just a few route patterns, making the application more scalable and easier to maintain. For example, imagine having to define a route for every kind of asset your website serves.

You may do something like this

```js
// images
app.get('/static/imgs/img1.png', img_handler);
app.get('/static/imgs/img2.png', img_handler);
app.get('/static/imgs/img3.png', img_handler);
app.get('/static/imgs/img4.png', img_handler);

// javascript
app.get('/static/js/main.js', script_handler);
app.get('/static/js/third_party.js', script_handler);

/** And so on**/
```

This is quite tedious, and you cannot expect an application like this to scale. What if we had a dynamic route to serve all the assets?

```js
app.get('/static/img/:image_file_name', img_handler)
app.get('/static/js/:javascript_file_name', img_handler)
```

This is somewhat better than the previous. 

> However, this is still not the best way to handle assets. You may have subdirectories - i.e `/img/compressed/webps/img.webp`. You will get a route not found while doing the method above. To solve this issue, we have a concept of wildcards. You don't need to worry about wildcards just yet. We'll cover them in an upcoming challenge.

### Better User Experience

Dynamic routes allow for creating more personalized user experiences. For example, in a blog application, a dynamic route like `/posts/:postId` can display a specific post based on the ID in the URL. This approach makes it straightforward to link to specific content, improving the navigability and user engagement.

### Better Developer Experience

By using dynamic routes, developers of our framework can avoid the tedium of defining every possible URL path in their application. This not only saves time but also reduces the risk of errors. A single dynamic route can replace dozens, if not hundreds, of static routes, streamlining the development process.

### Better SEO

Dynamic routing can also contribute to better Search Engine Optimization (SEO). With the ability to generate clean and meaningful URLs (e.g., `/game/dota2` instead of `/game?uid=dota2`), dynamic routes make URLs more understandable to both users and search engines, potentially improving search rankings.

## Anatomy of a dynamic route

A dynamic route follows a structure where certain parts of the URL path are variable, known as dynamic segments. 

```
/[Static Path Segment]/[Dynamic Segment]/[More Static or Dynamic Segments]
```

Example URL: https://github.com/:user_id/repos

1. Static Path Segment: 'repos'
   
   - A fixed part of the URL path that doesn't change.

2. Dynamic Segment: `:user_id`
   
   - A variable part of the URL. The `user_id` can be any value, representing a specific user.

## Challenge 1: Update the `getRouteParts()` function

Initially, our `getRouteParts` function converted all parts of the route to lowercase. To support dynamic routes, we have to modify this function to keep dynamic segments (indicated by a colon `:`) as they are, without converting them to lowercase. This is crucial for recognizing dynamic parts in a route.

For example, we should give the developers the flexibility they want with naming their dynamic parameters. 

```js
/account/:UserId
/account/:user_id
```

### Requirement

Currently, the function normalizes the URL path and converts all segments to lowercase. Your goal is to modify the function to identify and preserve dynamic parameter placeholders marked with ":" (e.g., `:id`) while still normalizing other segments.

### More Details:

1. The `path` parameter passed to the `getRouteParts` function is a string representing a URL path.

2. The function should first replace any consecutive forward slashes (`//`) with a single forward slash (`/`) to ensure proper path normalization.

3. It should then split the path into segments based on the forward slashes (`/`).

4. For each segment:
   
   - If the segment starts with a ":" (e.g., `:id`), it should be treated as a dynamic parameter and preserved as is.
   - If the segment does not start with a ":", it should be converted to lowercase and trimmed of any leading or trailing whitespace.

5. The function should return an array of path segments with dynamic parameters intact and other segments normalized.

6. Example:
   
   - Input: `"/api/user/:id/profile"`
   - Output: `["api", "user", ":id", "profile"]`

7. Another example:
   
   - Input: `"/api/user/:ID/profile"`
   
   - Output: `["api", "user", ":ID", "profile"]`

8. Ensure that your solution is efficient and follows modern JavaScript programming practices.

9. Update the provided `getRouteParts` function to implement this behavior. Make changes only within the function while keeping the function signature the same.

### Solution

Here's the solution I came up with:

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        /* If the segment starts with a semi-colon, return as it is */
        .map((curr) => (curr.startsWith(":") ? curr : curr.toLowerCase().trim()));
}
```

## Challenge 2: Add the dynamic routing functionality in `Router` class

### Requirements

This one is going to be a challenging one. Enhance the `Router` class to support dynamic routing. Dynamic routes are identified by parts of the URL that begin with a colon (`:`) and represent variable segments of the route, such as `/users/:user_id`. The implementation should extract these dynamic parameters and make them accessible to the corresponding route handler.

#### More Details

1. **Router Class Modification**: Modify the `Router` class to handle dynamic routing. This includes:
   
   - Updating the `#addRouteParts` method to recognize and process dynamic route parts.
   - Adding logic to store dynamic route information separately within the `RouteNode` class.

2. **RouteNode Class Enhancement**: Adapt the `RouteNode` class to support dynamic routing. Changes include:
   
   - Adding a new property or structure within `RouteNode` to store information about dynamic children (i.e., the parts of the route that are dynamic).
   - Ensuring that the `RouteNode` class can differentiate between static and dynamic route parts.

3. **Dynamic Route Handling**: Implement logic within the `Router` class to correctly handle dynamic routes:
   
   - Modify the `#findRoute` method to detect dynamic route parts and extract their values.
   - Ensure that the extracted dynamic parameters are passed to the route handler.

#### Steps

1. **Update `#addRouteParts`**: Modify this method to identify dynamic parts of the route, represented by a leading colon (`:`). Store these parts in a special structure within the `RouteNode`.

2. **Enhance `RouteNode` for Dynamic Storage**: Adjust the `RouteNode` class to handle dynamic route parts. This might include adding a new property or modifying the existing structure to differentiate between static and dynamic children.

3. **Modify `#findRoute` for Dynamic Parameter Extraction**: Update the `#findRoute` method to correctly identify and extract dynamic route parameters. These parameters should then be made available to the route handler.

### Solution

Here's the solution for adding dynamic routing functionality:

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        .map((curr) => (curr.startsWith(":") ? curr : curr.toLowerCase().trim()));
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

        // Looping through each part of the route
        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];
            let children = node.children;
            let isDynamic = false;

            // Check if the part is a dynamic route parameter
            if (currPart.startsWith(":")) {
                // Removing ':' to extract the parameter name
                currPart = currPart.substring(1);

                // Initializing dynamicChild object to store dynamic route information
                // If the dynamicChild object already exists, it gets reused
                children = node.dynamicChild = node.dynamicChild || {};

                // Storing the dynamic parameter name in the dynamicChild object
                children["paramName"] = currPart;
                isDynamic = true;
            }

            // Choosing the appropriate key based on whether the route part is dynamic or not
            let key = isDynamic ? "node" : currPart;
            let nextNode = isDynamic ? children["node"] : children.get(key);

            // Creating a new RouteNode if the next node doesn't exist
            if (!nextNode) {
                nextNode = new RouteNode();
                if (isDynamic) {
                    // Storing the new node in the dynamicChild for dynamic routes
                    children["node"] = nextNode;
                } else {
                    // Adding the new node to the children map for static routes
                    children.set(key, nextNode);
                }
            }

            // Setting the handler for the route if this is the last part
            if (idx == routeParts.length - 1) {
                nextNode.handler.set(method, handler);
            }

            // Moving to the next node for the next iteration
            node = nextNode;
        }
    }

    findRoute(path, method) {
        let routeParts = getRouteParts(path.split("?")[0]);
        let node = this.rootNode;
        let handler = null;
        let dynamicParams = {};

        // Looping through each part of the route to find the handler
        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            // Checking for a dynamic child node when a direct match isn't found
            if (!nextNode && node.dynamicChild) {
                // Storing the dynamic parameter value in dynamicParams object
                dynamicParams[node.dynamicChild["paramName"]] = currPart;
                // Using the dynamic node for further processing
                nextNode = node.dynamicChild["node"];
            }

            // Breaking the loop if no matching node is found
            if (!nextNode) break;

            node = nextNode;

            // Setting the handler if this is the last part of the route
            if (idx == routeParts.length - 1) {
                handler = nextNode.handler.get(method);
            }
        }

        // Returning the handler along with any dynamic parameters found
        return { handler, params: dynamicParams };
    }
}

class RouteNode {
    constructor() {
        this.handler = new Map();

        // Introduced a property for dynamic child routes.
        // This is used to store information about dynamic parts of routes like '/users/:user_id'.
        this.dynamicChild = null;
        this.children = new Map();
    }
}

const trieRouter = new Router();

function getHandler(req) {
    console.log(req);
}

trieRouter.addRoute("/home/:user/test", "GET", getHandler);
trieRouter.addRoute("/home/testing/:user", "GET", getHandler);

console.log(trieRouter.findRoute("/home/hello/test", "GET")); 
console.log(trieRouter.findRoute("/home/testing/testing", "GET")); 
```

The `console.log` statements above output:

```bash
❯ node file.js
{ handler: [Function: getHandler], params: { user: 'hello' } }
{ handler: [Function: getHandler], params: { user: 'testing' } }
```

## Challenge 3: Adding Wildcard (Catch-All) Route Support

Now, we'll implement support for wildcard routes. A wildcard route is denoted by an asterisk `*` and matches any path that doesn't correspond to other defined routes. The wildcard route should be treated with the lowest priority, acting as a fallback mechanism.

#### More Details

1. **Wildcard Route Recognition**: Update the `Router` class to recognize and handle routes with a wildcard part. This involves modifications to:
   
   - The `#addRouteParts` method to detect and process a wildcard (`*`) in the route.
   - The `RouteNode` class to store a separate handler for wildcard routes.

2. **RouteNode Class Update for Wildcard Handling**: Enhance the `RouteNode` class to support storing a handler for wildcard routes, which should be separate from regular route handlers.

3. **Wildcard Route Matching**: Modify the route finding logic in the `Router` class to use the wildcard route handler as a fallback option when no other routes are matched.

#### Steps

1. **Update `#addRouteParts` for Wildcard Routes**: Modify this method to recognize a wildcard (`*`) in the route. Ensure that it is only valid as the last part of the route and store the associated handler in the `RouteNode` specifically for wildcard routes.

2. **Adjust `RouteNode` for Wildcard Handler**: Modify the `RouteNode` class to include a new property or structure for storing the handler of a wildcard route.

3. **Implement Fallback Logic in `#findRoute`**: Adapt the `#findRoute` method to check for a wildcard handler if no other routes match. Use this handler as a fallback mechanism.

### Solution

```js
const http = require("node:http");

function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        .map((curr) => curr.toLowerCase().trim());
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
            let children = node.children;
            let isDynamic = false;

            if (currPart == "*") {
                if (idx !== routeParts.length - 1) throw new Error("Catch all pattern `*` should be at the last.");
                node.wildcardHandlers.set(method, handler);
                break;
            }

            if (currPart.startsWith(":")) {
                currPart = currPart.substring(1);
                children = node.dynamicChild = {};

                children["paramName"] = currPart;
                isDynamic = true;
            }

            let key = isDynamic ? "node" : currPart;
            let nextNode = isDynamic ? children["node"] : children.get(key);

            if (!nextNode) {
                nextNode = new RouteNode();

                if (isDynamic) children["node"] = nextNode;
                else children.set(key, nextNode);
            }

            if (idx == routeParts.length - 1) {
                nextNode.handler.set(method, handler);
            }

            node = nextNode;
        }
    }

    findRoute(path, method) {
    let routeParts = getRouteParts(path.split("?")[0]);
    let node = this.rootNode;
    let handler = null;
    let dynamicParams = {};
    let isDynamicMatch = false; // Flag to track if a dynamic route match is found
    let fallbackHandler = null;

    for (let idx = 0; idx < routeParts.length; idx++) {
        let currPart = routeParts[idx];

        fallbackHandler = node.wildcardHandlers.get(method) || fallbackHandler;

        let nextNode = node.children.get(currPart);

        if (!nextNode && node.dynamicChild) {
            dynamicParams[node.dynamicChild["paramName"]] = currPart;
            nextNode = node.dynamicChild["node"];
            isDynamicMatch = true; // Marking that a dynamic match is found
        }

        if (!nextNode && fallbackHandler) {
            handler = fallbackHandler;
            break;
        }

        if (!nextNode) break;

        node = nextNode;

        if (idx == routeParts.length - 1) {
            handler = isDynamicMatch ? handler : nextNode.handler.get(method);
        }
    }

    // Only return dynamicParams if a dynamic match was found
    return isDynamicMatch ? { handler, params: dynamicParams } : { handler };
    }

}

class RouteNode {
    constructor() {
        this.handler = new Map();
        this.dynamicChild = null;
        this.children = new Map();
        this.wildcardHandlers = new Map();
    }
}

let trieRouter = new Router();

function getHandler(req) {
    cosnole.log(req)
}

function wildcardHandler(req) {
    console.log(req)
}

trieRouter.addRoute("/home/:user/test", "GET", getHandler);
trieRouter.addRoute("/home/*", "GET", wildcardHandler);

console.log(trieRouter.findRoute("/home/hello/test", "GET"));
console.log(trieRouter.findRoute("/home/testing/1/2/3", "GET"));

```
