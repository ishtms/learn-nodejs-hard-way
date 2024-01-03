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

O JavaScript foi criado para tornar páginas web mais interativas e dinâmicas. Foi pensado para criar interfaces de usuário e responder a ações de usuário do lado do cliente, **dentro do navegador**. No entanto, à medida que as aplicações web se tornaram mais complexas, depender do JavaScript somente do lado do cliente não foi o suficiente. Isso levou ao desenvolvimento do Node.js, que permite que o JavaScript seja executado do lado do servidor. O Node.js amplia os recursos do JavaScript, introduzindo APIs para operações de sistemas de arquivos, comunicação de rede, criação de servidores web e muito mais. Isso significa que os desenvolvedores podem usar uma linguagem de programação em todas as partes de uma aplicação, tornando o desenvolvimento mais simples.

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

O módulo exporta dois componentes específicos:

-   A classe `Console` com métodos como `console.log()`, `console.error()`, e `console.warn()`. Eles podem ser utilizados para escrita em qualquer **stream** do Node.js.
-   Uma instância global `console` que é configurada para escrever no `process.stdout` e no `process.stderr`.

(Note que `Console` não é o mesmo que `console` (em minúsculo). `console` é uma instância especial de `Console`)

> Você pode usar a global `console` sem precisar chamá-la através de `require('node:console')` ou `require('console')`. Essa disponibilidade global é um recurso fornecido pelo ambiente de execução Node.js. Quando sua aplicação em Node.js começa a rodar, certos objetos e módulos ficam automaticamente disponíveis no escopo global sem a necessidade de importá-los explicitamente.
>
> Aqui estão alguns exemplos de objetos/módulos disponíveis globalmente no Node.js - `console`, `setTimeout`, `setInterval`, `__dirname`, `__filename`, `process`, `module`, `Buffer`, `exports`, e o objeto `global`.

Como mencionei anteriormente, o Node.js oferece a instância global `console` para imprimir texto no `process.stdout` e no `process.stderr`. Então, se você está escrevendo isso aqui:

```jsx
console.log("Alguma coisa")
```

O código acima é apenas uma abstração do código a seguir:

```jsx
process.stdout.write("Alguma coisa\n");
```

No entando, mesmo depois de ler isto, o código acima ainda pode parecer confuso. Talvez você ainda não esteja familiarizado com o objeto `process`, ou com o `stdout` e o `stderr`.

### O **objeto `process`**:

O objeto **`process`** do Node.js fornece informações sobre o ambiente onde a aplicação Node.js está sendo executada. Ele tem várias propriedades, métodos e escutadores de eventos (event listeners) para ajudar a trabalhar com o processo e acessar informações sobre o ambiente de execução.

Essas são algumas das propriedades e funções úteis fornecidas pelo objeto `process`. Copie o código abaixo e cole no seu arquivo `index.js`. Tente executá-lo usando o comando, `node caminho/para/arquivo/index.js`.

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

> Nós vamos discutir sobre a maioria dessas propriedades/funções mais adiante, quando estivermos falando sobre a implementação do nosso próprio framework.

### A **propriedade `stdout` do objeto `process`**:

No Node.js, a propriedade `stdout` é parte do objeto `process`. Essa propriedade representa a **_stream_** de saída (o output) padrão, que é utilizada para imprimir dados no console ou em outra saída definida. Qualquer coisa escrita na stream `stdout` é exibida no console quando você executa o seu programa.

Agora você deve estar se perguntando, o que é uma `stream`?

**_Streams_** são utilizadas na programação para lidar com o fluxo de dados de maneira eficiente, especialmente quando estamos trabalhando com um grande conjunto de dados ou comunicações de rede. Uma stream é uma sequência de elementos de dados que são disponibilizados com o passar do tempo. Ao invés de carregar todos os dados na memória, as streams permitem processar e transmitir dados em menor escala, em pedaços mais manejáveis.

Streams também podem ser classificadas como streams de entrada (input) ou streams de saída (output). Streams de entrada são utilizadas para receber dados de uma fonte, enquanto streams de saída são utilizadas para enviar dados para um destino.

Streams possuem a importante vantagem de suportar paralelismo. Ao invés de processar dados um depois do outro, streams podem processar dados em paralelismo e simultaneamente. Isso ajuda quando estamos trabalhando com grandes bancos de dados, porque acelera o tempo de processamento de maneira significativa.

O Node.js fornece uma implementação abrangente de streams, que podem ser categorizadas em vários tipos:

1. **Streams de Leitura (Readable Streams)**: Essas streams representam uma fonte de dados que pode ser lida. Os exemplos incluem leitura de arquivos, leitura de dados de uma solicitação HTTP ou até mesmo a geração de dados de maneira programada.
2. **Streams de Escrita (Writable Streams)**: Streams de escrita são destinos nos quais você pode gravar dados. Os exemplos incluem gravação de dados em arquivos, na saída padrão (`stdout`), na saída de erro padrão (`stderr`) e muito mais.
3. **Streams Duplex (Duplex Streams)**: Streams Duplex representam ambas as coisas, um lado para leitura e outro para gravação. Isso significa que você pode ler e gravar nessas streams simultaneamente. Um socket TCP é um exemplo de stream Duplex. Ele pode receber e enviar dados de volta para o cliente simultaneamente.
4. **Streams Transform (Transform Streams)**: Esse é um tipo específico de stream Duplex que permite transformar ou modificar dados conforme eles estão sendo lidos ou gravados. Elas são normalmente utilizadas para tarefas de manipulação de dados, como compressão e criptografia.

> Streams são incrivelmente versáteis e eficientes porque trabalham com pequenos pedaços de dados de cada vez, o que é particularmente útil quando estamos lidando com dados que não cabem de uma vez na memória ou quando queremos processar dados em tempo real. Elas também possibilitam iniciar o processamento de dados antes do conjunto total de dados estar disponível, reduzindo o consumo de memória e melhorando a performance.

Agora que você sabe o que são streams, e o que é a saída padrão (standard output - `stdout`), podemos simplificar o código abaixo:

```jsx
process.stdout.write("Um olá do Node.js");
```

Estamos simplesmente escrevendo no **`stdout`** ou na stream de saída padrão que o Node.js oferece, o que significa que estamos enviando dados ou mensagens para o console onde você vê a saída do programa. Os dados que escrevemos no **`stdout`** são exibidos na ordem que foram escritos, nos fornecendo um forma de comunicação com desenvolvedores ou usuários e de prover insights para a execução do programa em tempo real.

Trabalhar com o **`process.stdout`** pode ser bastante complicado, e na prática, você tende a usar com moderação. No lugar dele, os desenvolvedores normalmente optam pelo método mais amigável **`console.log`**. Instâncias de código que empregam o uso do **`process.stdout`** são normalmente encontradas quando há necessidade de um maior nível de controle sobre a formatação de saída ou ao integrar com mecanismos de registro mais complexos.

> **_Aviso_**: O comportamento do objeto global console nem sempre é síncrono como nas APIs do navegador, com as quais se assemelham, e nem sempre é assíncrono como todas as outras streams do Node.js. Para mais informações, por favor, veja a [nota sobre o I/O do process](https://nodejs.org/api/process.html#a-note-on-process-io).

[![Read Next](/assets/imgs/next.png)](/chapters/ch03-working-with-files.md)

![](https://uddrapi.com/api/img?page=ch02)