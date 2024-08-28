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

class RouteNode {
  constructor() {
    this.children = new Map();
    this.handler = new Map();
    this.params = [];
  }
}

class TrieRouter {
  constructor() {
    this.root = new RouteNode();
  }

  #verifyParams(path, method, handler) {
    if (typeof path !== "string" || path[0] !== "/") throw new Error("Malformed path provided.");
    if (typeof handler !== "function") throw new Error("Handler should be a function");
    if (!HTTP_METHODS[method]) throw new Error("Invalid HTTP Method");
  }

  #addRoute(path, method, handler) {
    this.#verifyParams(path, method, handler);

    let currentNode = this.root;
    let routeParts = path.split("/").filter(Boolean);
    let dynamicParams = [];

    for (const segment of routeParts) {
      if (segment.includes(" ")) throw new Error("Malformed `path` parameter");

      const isDynamic = segment[0] === ":";
      const key = isDynamic ? ":" : segment.toLowerCase();

      if (isDynamic) {
        dynamicParams.push(segment.substring(1));
      }

      if (!currentNode.children.has(key)) {
        currentNode.children.set(key, new RouteNode());
      }

      currentNode = currentNode.children.get(key);
    }

    currentNode.handler.set(method, handler);
    currentNode.params = dynamicParams;
  }

  findRoute(path, method) {
    let segments = path.split("/").filter(Boolean);
    let currentNode = this.root;
    let extractedParams = [];

    for (let idx = 0; idx < segments.length; idx++) {
      const segment = segments[idx];

      let childNode = currentNode.children.get(segment.toLowerCase());
      if (childNode) {
        currentNode = childNode;
      } else if ((childNode = currentNode.children.get(":"))) {
        extractedParams.push(segment);
        currentNode = childNode;
      } else {
        return null;
      }
    }

    let params = Object.create(null);

    for (let idx = 0; idx < extractedParams.length; idx++) {
      let key = currentNode.params[idx];
      let value = extractedParams[idx];

      params[key] = value;
    }

    return {
      params,
      handler: currentNode.handler.get(method),
    };
  }

  get(path, handler) {
    this.#addRoute(path, HTTP_METHODS.GET, handler);
  }

  post(path, handler) {
    this.#addRoute(path, HTTP_METHODS.POST, handler);
  }

  put(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PUT, handler);
  }

  delete(path, handler) {
    this.#addRoute(path, HTTP_METHODS.DELETE, handler);
  }

  patch(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PATCH, handler);
  }

  head(path, handler) {
    this.#addRoute(path, HTTP_METHODS.HEAD, handler);
  }

  options(path, handler) {
    this.#addRoute(path, HTTP_METHODS.OPTIONS, handler);
  }

  connect(path, handler) {
    this.#addRoute(path, HTTP_METHODS.CONNECT, handler);
  }

  trace(path, handler) {
    this.#addRoute(path, HTTP_METHODS.TRACE, handler);
  }

  printTree(node = this.root, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}(${segment}) Dynamic: ${childNode.params}`);
      this.printTree(childNode, indentation + 1);
    });
  }
}

const trieRouter = new TrieRouter();
trieRouter.get("/users/:id/hello/there/:some/:hello", function get1() {});
trieRouter.post("/users/:some/hello/there/:id/none", function post1() {});

console.log("Printing Tree:");
trieRouter.printTree();

console.log("Finding Handlers:");

console.log(trieRouter.findRoute("/users/e/hello/there/2/3", HTTP_METHODS.GET));
console.log(trieRouter.findRoute("/users/1/hello/there/2/none", HTTP_METHODS.GET));
console.log(trieRouter.findRoute("/users", HTTP_METHODS.PUT));
console.log(trieRouter.findRoute("/users", HTTP_METHODS.TRACE));
