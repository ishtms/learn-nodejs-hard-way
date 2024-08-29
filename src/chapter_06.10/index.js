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
    /** @type {Map<String, RouteNode>} */
    this.children = new Map();

    /** @type {Map<String, Function>} */
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
   * @param {Function} handler
   */
  #verifyParams(path, method, handler) {
    if (typeof path !== "string" || path[0] !== "/") throw new Error("Malformed path provided.");
    if (typeof handler !== "function") throw new Error("Handler should be a function");
    if (!HTTP_METHODS[method]) throw new Error("Invalid HTTP Method");
  }

  /**
   * @param {String} path
   * @param {HttpMethod } method
   * @param {Function} handler
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
   * @returns { { params: Object, handler: Function } | null }
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
   * @param {Function} handler
   */
  get(path, handler) {
    this.#addRoute(path, HTTP_METHODS.GET, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  post(path, handler) {
    this.#addRoute(path, HTTP_METHODS.POST, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  put(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PUT, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  delete(path, handler) {
    this.#addRoute(path, HTTP_METHODS.DELETE, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  patch(path, handler) {
    this.#addRoute(path, HTTP_METHODS.PATCH, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  head(path, handler) {
    this.#addRoute(path, HTTP_METHODS.HEAD, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  options(path, handler) {
    this.#addRoute(path, HTTP_METHODS.OPTIONS, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
   */
  connect(path, handler) {
    this.#addRoute(path, HTTP_METHODS.CONNECT, handler);
  }

  /**
   * @param {String} path
   * @param {Function} handler
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

const router = new Router();

const { createServer } = require("node:http");

/**
 * Run the server on the specified port
 * @param {Router} router - The router to use for routing requests
 * @param {number} port - The port to listen on
 */
function run(router, port) {
  if (!(router instanceof Router)) {
    throw new Error("`router` argument must be an instance of Router");
  }
  if (typeof port !== "number") {
    throw new Error("`port` argument must be a number");
  }

  createServer(function _create(req, res) {
    const route = router.findRoute(req.url, req.path);

    if (route?.handler) {
      req.params = route.params || {};
      route.handler(req, res);
    } else {
      res.writeHead(404, null, { "content-length": 9 });
      res.end("Not Found");
    }
  }).listen(port);
}

run(router, 8000);
