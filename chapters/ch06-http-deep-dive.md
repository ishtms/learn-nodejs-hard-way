# HTTP Deep dive

> This chapter gives an overview of how the web functions today, discussing important concepts that are fundamental for understanding the rest of the book. Although some readers may already be familiar with the material, this chapter provides a valuable opportunity to revisit the basics.

All the browsers, servers and other web related technologies talk to each other through HTTP, or Hypertext Transfer Protocol. HTTP is the common language used on the internet today. 

Web content is stored on servers that communicate using the HTTP protocol, often called HTTP servers. They hold the Internet data and provide it when requested by HTTP clients. Clients ask for data by sending HTTP requests to servers. Servers then respond with the data in HTTP responses.

![](/Users/ishtmeet/Library/Application%20Support/marktext/images/2023-08-23-10-23-15-image.png)

The message that was sent from your browser is called a **Request** or an **HTTP request**. The message received by your browser, which was sent by a server is called an **HTTP Response** or just **Response**. The response and the request is collectively called an **HTTP Message**.

## A small web server

Before introducing more components of HTTP, let's build a basic HTTP server using Node.js.

Create a new project, name it whatever you like. Inside the directory create a new file `index.js`

```js
// file: index.js

// Import the built in http module, used to create servers
const http = require('node:http')

function handle_request(request, response) {
    response.end("Hello world");
}

const server = http.createServer(handle_request);

server.listen(3000, "localhost");

// or 

server.listen(3000, "127.0.0.1");
```





































![](https://uddrapi.com/api/img?page=http_deep_dive)