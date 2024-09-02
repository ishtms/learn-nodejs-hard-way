const { HTTP_METHODS } = require("./constants");

class RouteNode {
  constructor() {
    /** @type {Map<String, RouteNode>} */
    this.children = new Map();

    /** @type {Map<String, RequestHandler>} */
    this.handler = new Map();

    /** @type {Array<String>} */
    this.params = [];
  }
}

class Router {
  constructor() {
    /** @type {RouteNode} */
    this.root = new RouteNode();
  }

  /**
   * @param {String} path
   * @param {HttpMethod} method
   * @param {RequestHandler} handler
   */
  #verifyParams(path, method, handler) {
    if (typeof path !== "string" || path[0] !== "/") throw new Error("Malformed path provided.");
    if (typeof handler !== "function") throw new Error("Handler should be a function");
    if (!HTTP_METHODS[method]) throw new Error("Invalid HTTP Method");
  }

  /**
   * @param {String} path
   * @param {HttpMethod } method
   * @param {RequestHandler} handler
   */
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

  /**
   * @param {String} path
   * @param {HttpMethod} method
   * @returns { { params: Object, handler: RequestHandler } | null }
   */
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

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  get(path, handler) {
    this.#addRoute(path, HTTP_METHODS.GET, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  post(path, handler) {
    this.#addRoute(path, HTTP_METHODS.POST, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  put(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PUT, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  delete(path, handler) {
    this.#addRoute(path, HTTP_METHODS.DELETE, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  patch(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PATCH, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  head(path, handler) {
    this.#addRoute(path, HTTP_METHODS.HEAD, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  options(path, handler) {
    this.#addRoute(path, HTTP_METHODS.OPTIONS, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  connect(path, handler) {
    this.#addRoute(path, HTTP_METHODS.CONNECT, handler);
  }

  /**
   * @param {String} path
   * @param {RequestHandler} handler
   */
  trace(path, handler) {
    this.#addRoute(path, HTTP_METHODS.TRACE, handler);
  }

  /**
   * @param {RouteNode} node
   * @param {number} indentation
   */
  printTree(node = this.root, indentation = 0) {
    const indent = "-".repeat(indentation);

    node.children.forEach((childNode, segment) => {
      console.log(`${indent}(${segment}) Dynamic: ${childNode.params}`);
      this.printTree(childNode, indentation + 1);
    });
  }
}

module.exports = Router;
