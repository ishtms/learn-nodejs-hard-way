# Node.js is way faster than you think

> For people who came here to read the book, you can safely skip to the [first chapter of this book](/chapters/ch01-what-is-a-web-server-anyway.md). If you still wish to read this, you may not understand a lot of terms mentioned here. Don't get overwhelmed, and take it as a small motivation on why "Learning Node.js is worth it".
> 
> If you are here to read the book, you can safely skip to the [first chapter of this book](/chapters/ch01-what-is-a-web-server-anyway.md). If you choose to continue reading this section, you may encounter unfamiliar terms. Don't get overwhelmed, and take this post as a motivation for why "Learning Node.js is worth it".

**"Node.js is slow."** This is a statement you may have heard often, perhaps whispered in developer circles or debated on online forums. Node.js has been unfairly criticized for not being suitable for high-performance applications. This chapter aims to disprove that myth permanently.

The tech community often praises languages like Go or Rust for their ***blazing fast*** ™ execution, and often doubt whether JavaScript and its server-side partner, Node.js, can keep up. Common criticisms range from Node.js being single-threaded to the fundamental limitations of JavaScript itself. But what if I told you that these critiques are not just overly simplistic, but often misleading?

Why is Node.js perceived as slow? Is it the single-threaded architecture? Or perhaps the fact that it uses JavaScript - a language originally designed for client-side web development - as its backbone? These are just a couple of the many misconceptions that contribute to the underestimation of Node.js. But as you'll soon discover, Node.js can not only stand toe-to-toe with competing backend technologies but, under the right circumstances, can even perform as good as other "fast" languages.

## Contenders for the test

We'll be comparing a couple of "fast" frameworks and putting them against Node.js.

### Elysia - Bun

Elysia claims to be 18x faster than Express.

![](/assets/imgs/elysia-claim.png)

### Axum - Rust

I personally love [Axum](https://lib.rs/axum). It's one of the fastest and the most developer-friendly server side framework for Rust.

### Express - Node.js

This library is always used to establish the baseline for any benchmarks. I would love to be proven wrong, but I do not believe Elysia can be 18 times faster than Express. Maybe 18x faster at "waiting for IO".

### Velocy - Node.js

Velocy is a HTTP library that I am building as part of this book. For context, this github repo serves as a book that I am writing - [Learn Node.js the hard way](https://github.com/ishtms/learn-nodejs-hard-way). Velocy is still an unfinished product as it was started just 7 days ago. I have managed to build a performant `Router` class that uses the Radix Tree data structure to manage routes and extract path params. Our current router provides enough functionality for Velocy to be able to compete in this benchmark. You can find the source of Velocy - [here](https://github.com/ishtms/velocy)

## The benchmark

The question is, how are we going to benchmark? Let's take `bun`'s approach. If you're not aware, `bun` uses [uWebsockets](https://github.com/uNetworking/uWebSockets) under the hood for their web server. Let us see what the creator of `uWebsockets` [has to say about benchmarking](https://github.com/uNetworking/uWebSockets/tree/master/benchmarks#why-hello-world-benchmarking):

```tex
Why "hello world" benchmarking?

Contrary to popular belief, "hello world benchmarks" are the most accurate and realistic gauges of performance 
for the kind of applications µWebSockets is designed for:

IO-gaming (latency)
Signalling (memory overhead)
Trading (latency)
Finance (latency)
Chatting (memory overhead)
Notifications (memory overhead)
```

According to them, hello world benchmarks give a real world result. However, I don't think that is true. Real-world applications often involve much more than just sending a "hello world" message. There are usually additional layers of complexity like security, data access, business logic, etc., that these benchmarks do not account for. In all the examples above, there is a layer in between - i.e a database, which should not be ignored when talking about "real world benchmarks".

Since "hello world" benchmarks test the absolute bare minimum, they can sometimes give a false perception of performance. For example, a framework might excel at basic tasks but falter when handling more complex operations.

But nevertheless, we're going to use the elysia/`bun`'s way of benchmarking -

- Get the path parameter i.e extracting `name` from the endpoint `/bench/:name`

- Get the query parameter i.e extracting `id` from the endpoint `/bench/:name?id=10`

- Set a couple of headers on the response.

- Set a custom header on the response.

- Set the `content-type`, `connection` and `keep-alive` headers explicitly, so the response headers are the same for every framework.

- Serializing. It is a bit more cpu-intensive task than doing something like IO. For that reason, instead of returning an Javascript object, we're going to return a JSON response (serialized) back to the client. Bun claims that the [JSON.stringify() in bun is 3.5x faster than Node.js](https://twitter.com/jarredsumner/status/1552409321245265920/photo/1). That should also give our Node.js servers a significant performance hit, right?

## Source code

We will examine the source of all frameworks that are going to be used for benchmarking. I will also provide necessary information such as their versions, etc. if required.

### Elysia - Bun

Bun version - `0.8.1`

```js
import { Elysia } from "elysia";

const headers = {
    "x-powered-by": "benchmark",
    "content-type": "application/json",
    connection: "keep-alive",
    "keep-alive": "timeout=5",
};

const app = new Elysia().get("/bench/:name", (c) => {
    c.set.headers = headers;

    return JSON.stringify({
        name: c.params.name,
        id: c.query.id,
    });
});

app.listen(3000);
```

### Axum - Rust

rustc version - `1.73.0-nightly`

axum version - `0.6.20`

Release flags:

```toml
[profile.release]
opt-level = 3
codegen-units = 1
panic = 'abort'
lto = "thin"
debug = false
incremental = false
overflow-checks = false
```

Code:

```rust
use axum::{
    extract::{Path, Query},  response::IntoResponse,  routing::get,  Router,
};
use serde_json::json;
use std::{collections::HashMap, net::SocketAddr};

const HEADERS: [(&'static str, &'static str); 4] = [
    ("x-powered-by", "benchmark"),
    ("content-type", "application/json"),
    ("connection", "keep-alive"),
    ("keep-alive", "timeout=5"),
];

async fn handle_request(
    Path(name): Path<String>,
    Query(query): Query<HashMap<String, String>>,
) -> impl IntoResponse {
    (
        HEADERS,
        json!({
            "name": name,
            "id": query.get("id")
        })
        .to_string(),
    )
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/bench/:name", get(handle_request));
    let port_number: u16 = str::parse("3000").unwrap();

    let addr = SocketAddr::from(([127, 0, 0, 1], port_number));
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

```

### Express - Node.js

`express` version - `4.18.2`

```js
const express = require("express");
const app = express();

const headers = {
        "x-powered-by": "benchmark",
        "content-type": "application/json",
        connection: "keep-alive",
        "keep-alive": "timeout=5",
}

// We want to make sure that the the response body is same, to make it fair.
app.disable("x-powered-by");
app.disable("etag");

app.get("/bench/:name", (req, res) => {
    const { name } = req.params;
    const id = req.query.id;
    
    // res.end() does not set the content-length implicitly, so the `transfer-encoding: chunked` is assumed.
    // Manually setting the `content-length` to get rid of it.
    const response = JSON.stringify({ name, id });
    headers["content-length"] = response.length;

    res.writeHead(200, headers);

    res.end(response);
});

app.listen(3000);
```

### Velocy - Node.js

`velocy` version - `0.0.12`

```js
const { createServer, Router } = require("velocy");
const router = new Router();

const headers = {
    "x-powered-by": "benchmark",
    "content-type": "application/json",
    connection: "keep-alive",
    "keep-alive": "timeout=5",
};

router.get("/bench/:name", (req, res) => {
    const { name } = req.params;
    const id = req.queryParams.get("id");

    // Same, setting content-length to get rid of `transfer-encoding: chunked`.
    const response = JSON.stringify({ name, id });
    headers["content-length"] = response.length;

    res.writeHead(200, headers);
    res.end(response);
});

createServer(router).listen(3000);
```

## Results - Typical benchmark

For this round, we're only going to test single-instance performance of all the servers. This will be an example of typical benchmarks that are produced to say - Node.js is slower than X technology.

Testing machine - Macbook, M1 Max

Testing tool - [`wrk`](https://github.com/wg/wrk)

Testing method - 

```bash
wrk -t1 -c256 -d30s --latency http://localhost:3000/bench/testing?id=10
```

### Result: Elysia - Bun/Zig (149,047 req/s)

```bash
Running 30s test @ http://localhost:3000/bench/testing?id=10
  1 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.67ms  387.30us  18.15ms   89.67%
    Req/Sec   149.89k     5.24k  155.66k    93.67%
  Latency Distribution
     50%    1.56ms
     75%    1.62ms
     90%    2.07ms
     99%    3.18ms
  4472519 requests in 30.01s, 0.87GB read
  Socket errors: connect 6, read 92, write 0, timeout 0
Requests/sec: 149047.56
Transfer/sec:     29.57MB

```

### Result: Axum - Rust (208,938 req/s)

```bash
Running 30s test @ http://localhost:3000/bench/testing?id=10
  1 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   631.35us  211.19us  11.70ms   95.24%
    Req/Sec   210.04k    11.71k  225.95k    75.00%
  Latency Distribution
     50%  592.00us
     75%  625.00us
     90%  676.00us
     99%    1.49ms
  6271071 requests in 30.01s, 1.21GB read
  Socket errors: connect 6, read 90, write 0, timeout 0
Requests/sec: 208938.22
Transfer/sec:     41.45MB
```

### Result: Express - Node.js (28,923 req/s)

```bash
Running 30s test @ http://localhost:3000/bench/testing?id=10
  1 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.65ms    1.12ms  50.16ms   93.79%
    Req/Sec    29.08k     1.68k   30.70k    96.33%
  Latency Distribution
     50%    8.29ms
     75%    8.97ms
     90%    9.26ms
     99%   12.29ms
  867945 requests in 30.01s, 172.17MB read
  Socket errors: connect 6, read 115, write 0, timeout 0
Requests/sec:  28923.88
Transfer/sec:      5.74MB
```

A little mathematical calculation leads us to an obvious conclusion - Express is **~5.1** times slower than Elysia, **not 18** as they claimed.

## Result: Velocy - Node.js (83,689)

```bash
Running 30s test @ http://localhost:3000/bench/testing?id=10
  1 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.00ms  610.89us  36.12ms   98.97%
    Req/Sec    84.12k     4.43k   86.08k    97.33%
  Latency Distribution
     50%    2.95ms
     75%    3.00ms
     90%    3.10ms
     99%    3.65ms
  2511165 requests in 30.01s, 498.13MB read
  Socket errors: connect 6, read 117, write 0, timeout 0
Requests/sec:  83689.19
Transfer/sec:     16.60MB
```

## Graphs

### Latency

![](/assets/imgs/max_latency.png)

### Requests/sec

![](/assets/imgs/rps.png)

### Idle memory

![](/assets/imgs/idle_memory.png)

### Memory under constant load

![](/assets/imgs/mem_const_load.png)

### Verdict - Typical benchmark

Axum is clearly the fastest server framework out of the four we looked at. Elysia is fast too, but not as fast as it claims to be. Many people think Express is slow, but that's not really true. Express only slows down if you add more features or middlewares, which can be said for any other web framework as well.

My own web framework, [Velocy](https://github.com/ishtms/velocy), did really well! Plus, it only uses 10 MB of memory when it's idle. Many people assume that Node.js uses a lot of memory, but that's not always true. It's mostly software that are built on top of Electron, use a lot of memory, not server-side apps if written properly. My goal with Velocy is to create a backend framework, without every doing `npm install` - i.e no dependencies. That is what this book is all about.

Now, it's time to test our app as if we were actually using it in the production ready environment.

## The real benchmark

Often, developers make bold claims about the speed of their web server frameworks, touting metrics like "8.5 times faster than Fastify" or "20 times quicker than Express." However, these claims often lack context - faster at doing what? Running `console.log` statements? Handling HTTP requests? Brewing virtual coffee? Sending emojis blazingly fast? Additionally, many of these benchmarks are skewed, tailored to conditions that favor their particular framework.

For instance, a frequent argument is, "My framework uses only one process, while yours uses two. Therefore, double my framework's performance numbers." This sort of reasoning neglects the real-world conditions under which these frameworks would operate in a production environment.

Now, let's consider a practical scenario: Imagine you have a multi-core AWS instance. Using just a single core would be a waste of resources. Node.js inherently provides the capability to create a "cluster," allowing you to take full advantage of multi-core processors. So why not utilize it? We are not using any external tools, we're utilizing the Node.js standard library.

The significant critique against Bun's benchmark numbers is its lack of support for clustering. As a result, Bun can only be marginally faster than a Node.js application configured with clustering capabilities. Bun's primary selling point is its "speed," but that comes with the caveat of not supporting multi-core utilization, making it less practical for production settings.

While you could run multiple Bun instances and set up a load balancer, that's not the point. Node.js offers a seamless interface for clustering, which is one of its major advantages. Bun may claim to be fast, but without support for multi-core optimization, it falls short of being a fully scalable solution (for me) for production environments, without the added hassle of setting up a load balancer.

### Updating our code

#### Axum

Axum remains unchanged. Axum runs on top of the tokio runtime which by default creates a thread-pool, and work on with new connections/request using a work-stealing algorithm. 

### Elysia

Unfortunately, bun does not support working with `node`'s cluster module. When you try to fork, it throws an error:

```bash
NotImplementedError: node:cluster is not yet implemented in Bun. Track the status & thumbs up the issue: https://github.com/oven-sh/bun/issues/2428
 code: "ERR_NOT_IMPLEMENTED"
```

So elysia's code remains unchanged as well.

### Express

The cluster module provides a utility function: **fork** that spawns a new **worker process**. When a new connection comes in, the master process can distribute the connection to one of the workers, in a [round-robin fashion](https://en.wikipedia.org/wiki/Round-robin_scheduling).

```js
const express = require("express");
const cluster = require("cluster");

if (cluster.isMaster) {
    for (let i = 0; i < 2; i++) {
        cluster.fork();
    }
} else {
    const headers = {
        "x-powered-by": "benchmark",
        "content-type": "application/json",
        connection: "keep-alive",
        "keep-alive": "timeout=5",
    };

    const app = express();

    app.disable("x-powered-by");
    app.disable("etag");

    app.get("/bench/:name", (req, res) => {
        const { name } = req.params;
        const id = req.query.id;

        const response = JSON.stringify({ name, id });
        headers["content-length"] = response.length;

        res.writeHead(200, headers);

        res.end(response);
    });

    app.listen(3000);
}

```

## Velocy

```js
const { createServer, Router } = require("velocy");

const cluster = require("cluster");

if (cluster.isMaster) {
    for (let i = 0; i < 2; i++) {
        cluster.fork();
    }
} else {
    const router = new Router();

    const headers = {
        "x-powered-by": "benchmark",
        "content-type": "application/json",
        connection: "keep-alive",
        "keep-alive": "timeout=5",
    };

    router.get("/bench/:name", (req, res) => {
        const { name } = req.params;
        const id = req.queryParams.get("id");

        const response = JSON.stringify({ name, id });
        headers["content-length"] = response.length;

        res.writeHead(200, headers);
        res.end(response);
    });

    createServer(router).listen(3000);
}
```

## Results - A real-world use-case

**Axum** and **Elysia**'s results remain unchanged. We'll look at the new numbers for express and velocy.

> Note, I am only spawning 2 workers for both express and velocy.

### Result: Express - Node (50,275 req/sec)

```bash
Running 30s test @ http://localhost:3000/bench/testing?id=10
  1 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.13ms    2.10ms 176.20ms   97.84%
    Req/Sec    50.56k     1.27k   52.55k    82.00%
  Latency Distribution
     50%    4.92ms
     75%    5.15ms
     90%    5.80ms
     99%    7.78ms
  1508700 requests in 30.01s, 299.27MB read
  Socket errors: connect 0, read 92, write 0, timeout 0
Requests/sec:  50275.21
Transfer/sec:      9.97MB
```

### Result: Velocy - Node (138,956 req/sec)

```bash
Running 30s test @ http://localhost:3000/bench/testing?id=10
  1 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.08ms    5.39ms 148.18ms   99.66%
    Req/Sec   139.68k     7.99k  146.00k    96.68%
  Latency Distribution
     50%    1.71ms
     75%    1.97ms
     90%    2.21ms
     99%    3.49ms
  4183269 requests in 30.10s, 829.81MB read
  Socket errors: connect 0, read 131, write 0, timeout 0
Requests/sec: 138956.60
Transfer/sec:     27.56MB
```

Graphs

### Latency

![](/assets/imgs/latency_2.png)

Too high `max` latency due to the fact that the requests have to be distributed to the workers and all worker processes in a cluster share the same server ports, and the OS scheduler decides which worker process will handle an incoming request. This can cause contention and variability in response time. Some workers may get stuck with long-running requests, thereby delaying other incoming requests.

Let's ignore `max. latency` and zoom in for some exciting results -

### Latency without `max latency` bar

![](/assets/imgs/latency_without_max.png)

Velocy, our young, immature Node.js framework (in yellow) is performing almost the same as the super fast bun server (in blue)!

### Requests/sec

![](/assets/imgs/rps_2.png)

### Idle memory

This is due to 3 separate processes consuming the memory - One master node, and two workers. Still, not much difference.

![](/assets/imgs/mem_idle_2.png)

### Memory under constant load

![](/assets/imgs/mem_const_load_2.png)

## Final verdict

If you need speed - for both - CPU and IO/resource intensive tasks, you're better off working with languages like Rust, GoLang, C++ (Drogon) or Zig (bun's source is written in Zig). Node.js is perfect for demanding IO workloads and is not slow at all. We just saw, how a small, immature web framework, almost achieved the same speed of Bun, that claimed to be orders of magnitude faster than Node.js counterparts. Stop looking at benchmarks. They're hardly a valid reason to choose a particular tool.

The things that's important is - the tooling, the community, library ecosystem, job market and the list goes on. Node.js can be thought of as #1 on this list as far as server side programming is concerned. Axum is my go-to framework if I want to build something which involves security heavy things like managing a wallet system, or sub microsecond latency - and that is it. 

On the other hand, you can work both on server and client applications by knowing just one language. This is the most under-rated part of working with Node.js.

Node.js does use a threadpool internally, through **libuv**. Libuv is the underlying C library that powers Node.js's event loop and non-blocking I/O operations. The use of a thread pool in Node.js is primarily for tasks that are not suitable for non-blocking, asynchronous processing. These tasks include, but are not limited to, file I/O, DNS queries, and certain types of network operations. 

> TBD: Create benchmarks using `rewrk` too.

[![Read Prev](/assets/imgs/next.png)](/chapters/ch01-what-is-a-web-server-anyway.md)

<!-- ![](https://uddrapi.com/api/img?page=nodejs_way_faster) -->
