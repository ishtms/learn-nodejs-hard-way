const { createServer } = require("node:http");
const Router = require("./router");

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
    const route = router.findRoute(req.url, req.method);

    if (route?.handler) {
      req.params = route.params || {};
      route.handler(req, res);
    } else {
      res.writeHead(404, null, { "content-length": 9 });
      res.end("Not Found");
    }
  }).listen(port);
}

module.exports = { Router, run };
