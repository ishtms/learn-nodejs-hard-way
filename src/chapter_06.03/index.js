const http = require("node:http");

const PORT = 5255;

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
    this.routes = {};
  }

  #addRoute(method, path, handler) {
    if (typeof path !== "string" || typeof handler !== "function") {
      throw new Error("Invalid argument types: path must be a string and handler must be a function");
    }
    this.routes[`${method} ${path}`] = handler;
  }

  handleRequest(request, response) {
    const { url, method } = request;
    const handler = this.routes[`${method} ${url}`];

    if (!handler) {
      return console.log("404 Not found");
    }

    handler(request, response);
  }

  get(path, handler) {
    this.#addRoute(HTTP_METHODS.GET, path, handler);
  }

  post(path, handler) {
    this.#addRoute(HTTP_METHODS.POST, path, handler);
  }

  put(path, handler) {
    this.#addRoute(HTTP_METHODS.PUT, path, handler);
  }

  delete(path, handler) {
    this.#addRoute(HTTP_METHODS.DELETE, path, handler);
  }

  patch(path, handler) {
    this.#addRoute(HTTP_METHODS.PATCH, path, handler);
  }

  head(path, handler) {
    this.#addRoute(HTTP_METHODS.HEAD, path, handler);
  }

  options(path, handler) {
    this.#addRoute(HTTP_METHODS.OPTIONS, path, handler);
  }

  connect(path, handler) {
    this.#addRoute(HTTP_METHODS.CONNECT, path, handler);
  }

  trace(path, handler) {
    this.#addRoute(HTTP_METHODS.TRACE, path, handler);
  }

  printRoutes() {
    console.log(Object.entries(this.routes));
  }
}

const router = new Router();

router.get("/", function handleGetBasePath(req, res) {
  console.log("Hello from GET /");
  res.end();
});

router.post("/", function handlePostBasePath(req, res) {
  console.log("Hello from POST /");
  res.end();
});

// Note: We're using an arrow function instead of a regular function now
let server = http.createServer((req, res) => router.handleRequest(req, res));
server.listen(PORT);
