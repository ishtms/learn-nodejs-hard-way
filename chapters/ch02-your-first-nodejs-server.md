[![Read Prev](/assets/imgs/prev.png)](/chapters/ch01-what-is-a-web-server-anyway.md)

# Seu primeiro servidor web com [node.js](https://nodejs.org)

A sessão a seguir assume que você tenha o nodejs instalado localmente e está pronto para seguir adiante. Você pode conferir se possui o nodejs instalado digitando o seguinte comando no seu terminal:

```bash
node --version

# Outputs
# v18.17.0
```

Se o erro `Command not found` for exibido, isso significa que você não possui o nodejs instalado. Siga as instruções que estão [aqui para baixar e instalar](https://nodejs.org/en/download).

## O que é exatamente node ou nodejs?

De acordo com o site oficial -

> Node.js® é um ambiente de execução JavaScript open-source e cross-plataform.

O que significa ambiente de execução (runtime environment) ?

Simplificando, quando você escreve código em uma linguagem de programação como JavaScript, você precisa de algo para executar esse código. Para linguagens compiladas como C++ ou Rust, você usa um compilador. O ambiente de execução cuida da execução do código, garantindo que ele funcione bem com o hardware do computador e outros componentes de software.

Para o Node.js, ser um ambiente de execução JavaScript significa ter tudo que é preciso para executar código JavaScript **_fora de um navegador web_**. Isso inclui o motor V8 JavaScript (que compila e executa o código JavaScript), bibliotecas, APIs para tarefas de arquivo, de rede e para outras tarefas relacionadas ao sistema, além de um loop de eventos para operações assíncronas e sem bloqueio.

> Nós vamos discutir exatamente o que um loop de eventos significa, e implementar nossa própria versão de um loop de eventos para entender como isso funciona, mais tarde neste guia.

## Seu primeiro programa em node.js

Vamos começar a escrever alguns códigos. Vamos criar uma nova pasta e dar o nome que você quiser. Eu coloquei o nome de `intro-to-node`. Dentro da pasta, crie um novo arquivo chamado `index.js` e adicione o seguinte conteúdo nele.

```jsx
// Escrevendo a string `Vamos aprender Nodejs` na saída (output) padrão.
process.stdout.write("Vamos aprender Node.js");
```

Para executar o código, abra seu terminal e digite o comando `cd` seguido do caminho da pasta contendo o arquivo `index.js`. Isso vai mover o seu terminal para o diretório informado. Em seguida, execute `node index.js` ou `node index`. De maneira alternativa, você pode executar o comando especificando o caminho relativo ou absoluto do arquivo `index.js` -

```bash
node ../Code/intro-to-node/index.js

#ou

node /Users/ishtmeet/Code/intro-to-node/index.js
```

A execução deve exibir:

```
Vamos aprender Node.js
```

> Você também deve ver o símbolo de `%` no fim devido a ausência de um caracter para quebra de linha (**`\n`**) no final da string que você está escrevendo na saída padrão (stdout). Você pode modificar o código para `process.stdout.write("Vamos aprender Node.js\n");` para se livrar do símbolo de porcentagem.

**O que o código acima está fazendo?**

Há muita coisa acontecendo por trás do código acima, eu simplesmente o escolhi no lugar de `console.log` para explicar a grande diferença entre a API Javascript e a API Nodejs.

Javascript e Node.js estão extremamente relacionados, mas eles servem a propositos diferentes e possuem ambientes distintos, o que leva a algumas diferenças entre suas APIs (Application Programming Interfaces).

O JavaScript foi criado para tornar páginas web mais interativas e dinâmicas. Foi pensada para criar interfaces de usuário e responder a ações de usuário no lado do cliente, **dentro do navegador**. No entanto, à medida que as aplicações web se tornaram mais complexas, depender do JavaScript somente do lado do cliente não foi o suficiente. Isso levou ao desenvolvimento do Node.js, que permite que o JavaScript seja executado do lado do servidor. O Node.js amplia os recursos do JavaScript, introduzindo APIs para operações de sistemas de arquivos

O Node.js amplia os recursos do JavaScript, introduzindo APIs para operações de sistemas de arquivos, comunicação de rede, criação de servidores web e muito mais. Isso significa que os desenvolvedores podem usar uma linguagem de programação em todas as partes de uma aplicação, tornando o desenvolvimento mais simples.

Então vamos voltar ao código acima e entender o porque eu utilizei `process.stdout.write` no lugar de `console.log`.

Simplificando, `console.log` é um método que exibe a mensagem para o web console ou console do navegador. No entando, o Node.js não roda na web, o que significa que ele não reconhece o que é um console.

Mas se você mudar o seu código no arquivo `index.js` para:

```jsx
console.log("Vamos aprender Node.js");

// Saída -> Vamos aprender Node.js
```

Funciona. Mas eu não havia mencionado que o Node.js não é familiarizado com o conceito de web console? Na verdade, está correto. No entanto, o Node.js facilitou isso para os desenvolvedores que estavam habituados a trabalhar com o JavaScript somente no contexto da web. Ele incluiu todos os recursos importantes do JavaScript baseado no navegador dentro do framework.

Expandindo este tópico, é importante entender que o Node.js, apesar de ter suas raízes no desenvolvimento do lado do servidor, tenta preencher a lacuna entre o desenvolvimento web tradicional e os scripts server-side. Ao incorporar recursos comumente associados ao JavaScript baseado no navegador, o Node.js se tornou mais acessível para desenvolvedores que possuem habilidades com a linguagem, mas podem ser novos na programação do lado do servidor.

### Como o `console.log()` funciona no Node.js?

O módulo **`node:console`** oferece um pacote com as principais funcionalidades do console padrão que o Javascript fornece. Este pacote visa fornecer uma interface consistente e familiar para registrar e interagir com o ambiente do Node.js, assim como os desenvolvedores fariam em um console de navegador.

(Continuar daqui)

The module exports two specific components:

-   A `Console` class with methods like `console.log()`, `console.error()`, and `console.warn()`. These can be used to write to any Node.js **stream**.
-   A global `console` instance that is set up to write to `process.stdout` and `process.stderr`.

(Note that `Console` is not `console` (lowercase). `console` is a special instance of `Console`)

> You can use the global `console` without having to call `require('node:console')` or `require('console')`. This global availability is a feature provided by the Node.js runtime environment. When your Node.js application starts running, certain objects and modules are automatically available in the global scope without the need for explicit importing.
>
> Here are some of the examples of globally available objects/modules in Node.js - `console`, `setTimeout`, `setInterval`, `__dirname`, `__filename`, `process`, `module`, `Buffer`, `exports`, and the `global` object.

As I mentioned earlier, Node.js provides the global `console` instance to output text to `process.stdout` and `process.stderr`. So if you’re writing this

```jsx
console.log("Something");
```

the above code is just an abstraction of the code below.

```jsx
process.stdout.write("Something\n");
```

However, even after reading this, the code above may still be confusing. You may not yet be familiar with the `process` object, or with `stdout` and `stderr`.

### The **`process` Object**:

The **`process`** object in Node.js tells you about the environment where the Node.js app is running. It has various properties, methods, and event listeners to help you work with the process and access info about the runtime environment.

These are some of the useful properties and functions that are provided by the `process` object. Copy paste the code below and paste it inside your `index.js` file. Try to execute it, using `node path/to/index/file`.

```jsx
console.log(process.version);
// v18.17.0

console.log(process.platform);
// darwin

console.log(process.uptime());
// 0.023285791

console.log(process.cpuUsage());
// { user: 31466, system: 6772 }

console.log(process.resourceUsage().systemCPUTime);
// 6865

console.log(process.memoryUsage());
// {
//  rss: 39239680,
//  heapTotal: 6406144,
//  heapUsed: 5388408,
//  external: 425804,
//  arrayBuffers: 17694
// }

console.log(process.cwd());
// /Users/ishtmeet/Code/intro-to-node

console.log(process.title);
// node

console.log(process.argv);
// [
//  '/usr/local/bin/node',
//  '/Users/ishtmeet/Code/intro-to-node/index.js'
// ]

console.log(process.pid);
// 39328
```

> We will discuss most of these properties/functions further down the line when we talk about implementing our own framework.

### The `stdout` **property of the `process` object**:

In Node.js, the `stdout` property is a part of the `process` object. This property represents the standard output **_stream_**, which is used for writing data to the console or other output destinations. Anything written to the `stdout` stream is displayed in the console when you run your program.

Now you may ask, what is a `stream`?

**_Streams_** are used in programming to efficiently handle data flow, especially when working with large datasets or network communication. A stream is a sequence of data elements that is made available over time. Instead of loading all the data into memory, streams allow you to process and transmit data in smaller, more manageable pieces.

Streams can also be classified as input streams and output streams. Input streams are used to take in data from a source, while output streams are used to send data to a destination.

Streams have an important advantage of supporting parallelism. Instead of processing data one after the other, streams can process data in parallel and concurrently. This is helpful when working with large datasets because it speeds up processing time significantly.

Node.js provides a comprehensive implementation of streams, which can be categorized into several types:

1. **Readable Streams**: These streams represent a source of data from which you can read. Examples include reading files, reading data from an HTTP request, or even generating data programmatically.
2. **Writable Streams**: Writable streams are destinations where you can write data. Examples include writing data to files, standard output (`stdout`), standard error output (`stderr`) and many more.
3. **Duplex Streams**: Duplex streams represent both a readable and a writable side. This means you can both read from and write to these streams concurrently. An example of a Duplex stream is a TCP socket. It can both receive data from the client and send data back to the client concurrently.
4. **Transform Streams**: These are a specific type of duplex stream that allow you to modify or transform data as it's being read or written. They are often used for data manipulation tasks, like compression or encryption.

> Streams are incredibly versatile and efficient because they work with small chunks of data at a time, which is particularly useful when dealing with data that doesn't fit entirely into memory or when you want to process data in real-time. They also make it possible to start processing data before the entire dataset is available, reducing memory consumption and improving performance.

Now you know what streams are, and what is the standard output (`stdout`), we can simplify the code below.

```jsx
process.stdout.write("Hello from Node.js");
```

We're simply writing to **`stdout`** or the standard output stream which Node.js provides, which means that we're sending data or messages from our program to the console where you see the program's output. The data we write to **`stdout`** is displayed in the order it's written, giving us a way to communicate with developers or users and provide insights into the program's execution in real-time.

Working with **`process.stdout`** can be rather cumbersome, and in practice, you tend to use it sparingly. Instead, developers frequently opt for the more user-friendly **`console.log`** method. Instances of code employing **`process.stdout`** are typically encountered when there's a need for a greater level of control over output formatting or when integrating with more complex logging mechanisms.

> **_Warning_**: The ways of the global console object are not always synchronous like the browser APIs they resemble, nor are they always asynchronous like all other Node.js streams. For more information, please see the [note on process I/O](https://nodejs.org/api/process.html#a-note-on-process-io).

[![Read Next](/assets/imgs/next.png)](/chapters/ch03-working-with-files.md)

![](https://uddrapi.com/api/img?page=ch02)