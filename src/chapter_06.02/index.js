const http = require("node:http");

const PORT = 5255;

class Router {
  constructor() {
    this.routes = {};
  }

  addRoute(method, path, handler) {
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

  printRoutes() {
    console.log(Object.entries(this.routes));
  }
}

const router = new Router();
router.addRoute("GET", "/", function handleGetBasePath(req, res) {
  console.log("Hello from GET /");
  res.end();
});

router.addRoute("POST", "/", function handlePostBasePath(req, res) {
  console.log("Hello from POST /");
  res.end();
});

// Note: We're using an arrow function instead of a regular function now
let server = http.createServer((req, res) => router.handleRequest(req, res));
server.listen(PORT);
