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
  }
}

class TrieRouter {
  constructor() {
    this.root = new RouteNode();
  }

  #addRoute(path, method, handler) {
    if (typeof path !== "string" || path[0] !== "/") throw new Error("Malformed path provided.");
    if (typeof handler !== "function") throw new Error("Handler should be a function");
    if (!HTTP_METHODS[method]) throw new Error("Invalid HTTP Method");

    let currentNode = this.root;
    let routeParts = path.split("/").filter(Boolean);

    for (let idx = 0; idx < routeParts.length; idx++) {
      const segment = routeParts[idx].toLowerCase();
      if (segment.includes(" ")) throw new Error("Malformed `path` parameter");

      let childNode = currentNode.children.get(segment);
      if (!childNode) {
        childNode = new RouteNode();
        currentNode.children.set(segment, childNode);
      }

      currentNode = childNode;
    }
    currentNode.handler.set(method, handler); // Changed this line
  }

  findRoute(path, method) {
    let segments = path.split("/").filter(Boolean);
    let currentNode = this.root;

    for (let idx = 0; idx < segments.length; idx++) {
      const segment = segments[idx];

      let childNode = currentNode.children.get(segment);
      if (childNode) {
        currentNode = childNode;
      } else {
        return null;
      }
    }

    return currentNode.handler.get(method); // Changed this line
  }

  printTree(node = this.root, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}${segment}`);
      this.printTree(childNode, indentation + 1);
    });
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
}
