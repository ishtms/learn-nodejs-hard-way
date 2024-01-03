# Node.js é muito mais rápido do que você pensa

> Para as pessoas que vieram aqui ler o livro, você seguramente pode pular para o [primeiro capítulo deste livro](/chapters/ch01-what-is-a-web-server-anyway.md). Mas se ainda sim você deseja ler esta parte, saiba que você pode não entender muitos termos mencionados aqui".

**"Node.js é lento."** Essa é uma afirmação que você deve ter escutado muitas vezes, talvez espalhada nos ciclos de desenvolvedores ou debatidas nos fóruns online. O Node.js tem sido injustamente criticado por não ser adequado para aplicações de alta performance.

A comunidade tech elogia frequentemente linguagens como Go ou Rust por sua execução ***extremamente rápida***, muitas vezes duvidando que o JavaScript e seu parceiro do lado do servidor, Node.js, consigam acompanhar. As críticas mais comuns vão desde o Node.js ser single-thread até as limitações fundamentais do JavaScript em si. Mas e se eu te dissesse que essas críticas não são somente superficiais, mas na maioria das vezes enganosas?

Por que o Node.js é considerado lento? Será a arquitetura single-thread? Ou talvez pelo fato de usar JavaScript - a linguagem originalmente desenvolvida para o lado do cliente - como sua espinha dorsal? Esses são apenas alguns dos muitos equívocos que contribuem para a subestimação do Node.js. Mas, como você descobrirá em breve, o Node.js pode não apenas ficar lado a lado com as tecnologias concorrentes de back-end, como também, nas circunstâncias certas, ter um desempenho tão bom quanto outras linguagens “rápidas”.

## Candidatos ao Teste

Vamos comparar alguns frameworks considerados rápidos e confrontá-los com o Node.js.

### Elysia - Bun

O Elysia afirma ser 18x mais rápido que o Express.

![](/assets/imgs/elysia-claim.png)

### Axum - Rust

Eu pessoalmente adoro o [Axum](https://lib.rs/axum). É um dos frameworks back-end mais rápidos e fáceis para desenvolver em Rust.

### Express - Node.js

Essa biblioteca sempre é usada como referência para qualquer benchmark. Eu adoraria que provassem que estou errado, mas não acredito que o Elysia consegue ser 18 vezes mais rápido que o Express. Talvez seja 18x vezes mais rápido em "waiting for I/O".

### Velocy - Node.js

Velocy é uma biblioteca HTTP que estou construindo como parte deste livro. Para contextualizar, este repositório do github funciona como um livro que estou escrevendo - [Learn Node.js the hard way](https://github.com/ishtms/learn-nodejs-hard-way). O Velocy ainda é um produto inacabado, pois foi iniciado há apenas 7 dias. Eu consegui construir uma classe `Router` de alto desempenho usando a estrutura de dados Radix Tree para gerenciar rotas e extrair parâmetros de path. Nosso roteador atual oferece funcionalidade suficiente para que o Velocy possa competir neste benchmark. Você pode encontrar a fonte do Velocy - [aqui](https://github.com/ishtms/velocy)

## O Benchmark

A questão é, como vamos realizar o benchmark? Vamos adotar a abordagem do `bun`. Caso você não saiba, o `bun` usa o [uWebsockets](https://github.com/uNetworking/uWebSockets) por baixo do capô do seu servidor web. Vamos ver o que o criador do `uWebsockets` [tem a dizer sobre benchmarking](https://github.com/uNetworking/uWebSockets/tree/master/benchmarks#why-hello-world-benchmarking):

```tex
Porque o benchmarking com "hello world"?

Ao contrário da crença popular, os "benchmarks de hello world" são os indicadores de desempenho mais precisos e realistas para o tipo de aplicativos para os quais o µWebSockets foi projetado:

I/O de Games (latency)
Sinalização (sobrecarga de memória)
Negociação (latência)
Finanças (latência)
Bate-papo (sobrecarga de memória)
Notificações (sobrecarga de memória)
```

De acordo com eles, os benchmarls de hello world dão um resultado do mundo real. No entanto, eu não acho que isso é real. Aplicações do mundo real normalmente envolvem muito mais do que só enviar uma mensagem de "hello world". Normalmente há camadas adicionais de complexidade, como segurança, acesso de dados, regras de negócio, etc..., que esses benchmarks não dão conta. Em todos os exemplos acima há uma camada intermediária - em outras palavras, um banco de dados - que não deveria ser ignorada quando falamos em "benchmarks do mundo real".

Já que os "benchmarks de hello world" testam absolutamente o mínimo, eles podem nos dar uma falsa percepção de performance às vezes. Por exemplo, um framework pode ser excelente em tarefas básicas, mas falhar ao lidar com operações mais complexas.

Ainda assim, vamos usar o método de benchmarking do elysia/`bun` - 

- Obtenha o parâmetro do path, ou seja, extraia o `name` do endpoint `/bench/:name`

- Obtenha o parâmetro da query (consulta), ou seja, extraia o `id` do endpoint `/bench/:name?id=10`

- Defina alguns cabeçalhos na resposta.

- Defina um cabeçalho personalizado na resposta.

- Defina os cabeçalhos de `content-type`, `connection` e `keep-alive` explicitamente, dessa forma, os cabeçalhos de resposta serão os mesmos para cada framework.

- Serializando. É uma tarefa que exige um pouco mais da CPU do que fazer algo como um I/O. Por esse motivo, ao invés de retornar um objeto Javascript, vamos retornar um JSON (serializado) de resposta ao cliente. O Bun afirma que o [JSON.stringify() no Bun é 3.5x mais rápido do que no Node.js](https://twitter.com/jarredsumner/status/1552409321245265920/photo/1). Isso também deveria proporcionar um impacto significativo em nossos servidores Node.js, certo? 

## Código Fonte

Vamos examinar a fonte de todos os frameworks que serão utilizados no benchmarking. Eu também fornecerei as informações necessárias, como suas versões, etc, caso necessário.

### Elysia - Bun

Bun versão - `0.8.1`

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

rustc versão - `1.73.0-nightly`

axum versão - `0.6.20`

Configurações do release:

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

Código:

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

`express` versão - `4.18.2`

```js
const express = require("express");
const app = express();

const headers = {
        "x-powered-by": "benchmark",
        "content-type": "application/json",
        connection: "keep-alive",
        "keep-alive": "timeout=5",
}

// Queremos ter certeza que o corpo da resposta será o mesmo para que seja justo.
app.disable("x-powered-by");
app.disable("etag");

app.get("/bench/:name", (req, res) => {
    const { name } = req.params;
    const id = req.query.id;
    
    // res.end() não define o `content-length` (comprimento do conteúdo)
    // implicitamente, então o `transfer-encoding: chunked` é assumido.
    // Definindo manualmente o `content-length` para se livrar disso.
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

    // A mesma coisa, definindo manualmente o `content-length`
    // para se livrar do `transfer-encoding: chunked`.
    const response = JSON.stringify({ name, id });
    headers["content-length"] = response.length;

    res.writeHead(200, headers);
    res.end(response);
});

createServer(router).listen(3000);
```

## Resultados - Típico Benchmark

Para essa rodada, vamos testar apenas a performance single-instance de todos os servidores. Esse será um exemplo de típicos benchmarks produzidos para dizer - O Node.js é mais lento que X tecnologia.

Máquina de teste - Macbook, M1 Max

Ferramenta de teste - [`wrk`](https://github.com/wg/wrk)

Método de teste - 

```bash
wrk -t1 -c256 -d30s --latency http://localhost:3000/bench/testing?id=10
```

### Resultado: Elysia - Bun/Zig (149,047 req/s)

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

### Resultado: Axum - Rust (208,938 req/s)

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

### Resultado: Express - Node.js (28,923 req/s)

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

Um pequeno cálculo matemático nos leva a uma óbvia conclusão - O Express é **~5.1** vezes mais lento que o Elysya, **não 18** como eles alegaram.

## Resultado: Velocy - Node.js (83,689)

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

## Gráficos

### Latência

![](/assets/imgs/max_latency.png)

### Requisições/seg

![](/assets/imgs/rps.png)

### Memória Ociosa

![](/assets/imgs/idle_memory.png)

### Memória Sob Carga Constante

![](/assets/imgs/mem_const_load.png)

### Veredito - Típico Benchmark

O Axum é claramente o framework de servidor mais rápido entre os quatro que analisamos. O Elysia é rápido também, mas não tanto quanto alega ser. Muitas pessoas pensam que o Express é lento, mas isso não é realmente verdade. O Express fica lento apenas se você adicionar mais recursos ou middlewares, o que pode ser dito para qualquer outro framework web também.

Meu próprio framework web, o [Velocy](https://github.com/ishtms/velocy), foi realmente bem! Além disso, usa apenas 10MB de memória quando está ocioso. Muitas pessoas assumem que o Node.js usa muita memória, mas isso não é sempre verdade. Em maioria, são softwares construídos em Electron que usam muita memória, e não aplicações server-side se escritas corretamente. O meu objetivo com o Velocy é criar um framework backend sem fazer nenhum `npm install` - ou seja, sem dependências. É disso que este livro se trata.

Agora, é hora de testar nossa aplicação como se estivéssemos realmente a usando no ambiente de produção pronto.

## O Benchmark Real

Com frequência, desenvolvedores fazem afirmações ousadas sobre a velocidade de seus frameworks de servidor web, divulgando métricas como “8.5 vezes mais rápido que o Fastify” ou “20 vezes mais rápido que o Express”. Porém, essas alegações geralmente carecem de contexto - mais rápido fazendo o que? Executando declarações `console.log`? Lidando com requisições HTTP? Preparando café virtual? Enviando emojis extremamente rápido? Em adição, muitos desses benchmarks estão distorcidos, adaptados às condições que favorecem seus frameworks em particular.

Por exemplo, um argumento frequente é, "Meu framework usa apenas um processo, enquanto o seu usa dois. Portanto, dobre os números de desempenho do meu framework." Esse típo de raciocínio negligencia as condições do mundo real sob qual esses frameworks operariam em um ambiente de produção.

Agora, vamos considerar um cenário prático: Imagine que você tem uma instância multi-core na AWS. Usar somente um core seria desperdício de recursos. O Node.js, de maneira inerente, fornece a capacidade de criar um "cluster", possibilitando tirar toda a vantagem de processadores multi-core. Então por que não utilizar? Não estamos usando quaisquer ferramentas externas, estamos utilizando a biblioteca padrão do Node.js.

A crítica significativa contra os números de benchmark do Bun, é sua falta de suporte para clustering. Como resultado, o Bun só pode ser ligeiramente mais rápido que uma aplicação Node.js se configurado com capacidades de clustering. O argumento de venda primário do Bun é a "velocidade", mas isso vem com a ressalva de não suportar multi-core, tornando-o menos prático para configurações de produção.

Claro que você poderia rodar múltiplas instâncias do Bun e definir um load balancer, mas esse não é o ponto. O Node.js oferece uma interface perfeita para o Clustering, que é uma das suas maiores vantagens. O Bun alega ser mais rápido, mas sem suporte para otimização multi-core, não chega a ser uma solução totalmente escalável (para mim) para ambientes de produção, sem o incômodo adicional de configurar um load balancer.

### Atualizando Nosso Código

#### Axum

O Axum permanece inalterado. O Axum roda sobre o runtime tokio que cria uma thread-pool por padrão, e trabalha com novas conexões/requisições utilizando um algoritmo work-stealing (roubo de trabalho).

### Elysia

Infelizmente, o Bun não suporta trabalhar com o módulo cluster do `node`. Quando você tenta realizar o fork, um erro é apresentado:

```bash
NotImplementedError: node:cluster is not yet implemented in Bun. Track the status & thumbs up the issue: https://github.com/oven-sh/bun/issues/2428
 code: "ERR_NOT_IMPLEMENTED"
```

Então o código do Elysia permanece inalterado também.

### Express

O módulo cluster oferece uma função utilitária: um **fork** que gera um novo **worker process** (processo de trabalho). Quando uma nova conexão é recebida, o processo master pode distribuir a conexão para um dos workers, ao [modo round-robin](https://en.wikipedia.org/wiki/Round-robin_scheduling).

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

## Resultados - Um Caso de Uso do Mundo Real

Os resultados do **Axum** e **Elysia** permaneceram inalterados. Vamos olhar os números do Express e do Velocy.

> Nota, estou gerando apenas 2 workers para ambos, express e velocy.

### Resultados: Express - Node (50,275 req/seg)

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

### Resultado: Velocy - Node (138,956 req/sec)

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

Gráficos

### Latência

![](/assets/imgs/latency_2.png)

Latência `máxima` muito alta devido ao fato das requisições precisarem ser distribuídas entre os workers, e por todos os processos de trabalho em um cluster compartilharem as mesmas portas. O scheduler do sistema operacional decide qual worker vai lidar com uma requisição recebida. Isso pode causar contenção e variação no tempo de resposta. Alguns workers podem ficar presos à requisições de longa duração, atrasando assim outras requisições recebidas.

Vamos ignorar a `latência máxima` (max latency) e ampliar a análise para alguns resultados interessantes -

### Latência Sem a Barra `max latency`

![](/assets/imgs/latency_without_max.png)

O Velocy, nosso jovem e imaturo framework Node.js (em amarelo), está performando quase a mesma coisa que o super rápido servidor Bun (em azul)!

### Requisições/seg

![](/assets/imgs/rps_2.png)

### Memória Ociosa

Isso é devido a 3 processos separados consumindo a memória - Um nó master e dois workers. Ainda assim, não há muita diferença.

![](/assets/imgs/mem_idle_2.png)

### Memória Sob Carga Constante

![](/assets/imgs/mem_const_load_2.png)

## Veredito Final

Se você precisa de velocidade - para ambos - CPU e tarefas intensas em IO/recursos, é melhor trabalhar diretamente com linguagens como Rust, GoLang, C++ (Drogon) ou Zig. O Node.js é perfeito para cargas de trabalho de I/O exigentes e não é nada lento. Acabamos de ver, como um pequeno e imaturo framework, quase atingiu a mesma velocidade do Bun, que alega ser ordens de grandeza mais rápido que o similar em Node.js. Pare de olhar para os benchmarks. Eles dificilmente são uma razão válida para escolher uma ferramenta em particular.

As coisas importantes são - as ferramentas, a comunidade, o ecossistema de bibliotecas, o mercado de trabalho e a lista continua. O Node.js pode ser considerado o #1 nesta lista em termos de programação do lado do servidor. O Axum é meu framework de escolha quando quero construir alguma coisa que envolve segurança pesada, como gerenciar um sistema de carteira digital ou latência sub microsegundos - e é isso.

Por outro lado, você pode trabalhar em ambos, aplicações do cliente e servidor, sabendo apenas uma linguagem. Essa é a parte mais subestimada em trabalhar com Node.js.

O Node.js usa uma thread pool internamente, através da **libuv**. Libuv é a biblioteca subjacente em C que alimenta o loop de eventos do Node.js e as operações não-bloqueantes de I/O. O uso de thread pool no Node.js é principalmente para tarefas que não são adequadas para processamento assíncrono, não-bloqueante. Essas tarefas incluem, mas não estão limitadas a: I/O de arquivos, consultas DNS e certos tipos de operações de rede.

> A Definir: Crie benchmarks usando `rewrk` também.

[![Read Prev](/assets/imgs/next.png)](/chapters/ch01-what-is-a-web-server-anyway.md)

![](https://uddrapi.com/api/img?page=nodejs_way_faster)
