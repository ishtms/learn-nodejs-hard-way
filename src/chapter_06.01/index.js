const http = require("node:http");

const PORT = 5255;

const server = http.createServer((request, response) => {
  const { headers, data, statusCode } = handleRequest(request);
  response.writeHead(statusCode, headers);
  response.end(data);
});

// The header that needs to be sent on every response.
const baseHeader = {
  "Content-Type": "text/plain",
};

const routeHandlers = {
  "GET /": () => ({ statusCode: 200, data: "Hello World!", headers: { "My-Header": "Hello World!" } }),
  "POST /echo": () => ({ statusCode: 201, data: "Yellow World!", headers: { "My-Header": "Yellow World!" } }),
};

const handleRequest = ({ method, url }) => {
  const handler =
    routeHandlers[`${method} ${url}`] ||
    (() => ({ statusCode: 404, data: "Not Found", headers: { "My-Header": "Not Found" } }));

  const { statusCode, data } = handler();
  const headers = { ...baseHeader, "Content-Length": Buffer.byteLength(data) };

  return { headers, statusCode, data };
};

server.listen(PORT, () => {
  console.log(`Server is listening at :${PORT}`);
});
