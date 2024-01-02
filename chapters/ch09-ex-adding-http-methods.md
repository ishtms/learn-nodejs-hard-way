# Exercício 3 - Adicionando Suporte a Métodos `HTTP`

Até agora, construímos um roteador capaz de corresponder paths de URL para handlers específicos. Esse é um bom ponto inicial, mas até o momento, nosso roteador não diferencia entre diferentes métodos como GET, POST, PUT, DELETE, etc. Em aplicações do mundo real, o mesmo path de URL pode se comportar de maneira diferente baseado no método HTTP utilizado, tornando nosso atual roteador praticamente inútil para esses cenários.

## Requisitos

Para tornar nosso roteador mais útil e versátil, precisamos extender as classes existentes `TrieRouter` e `RouteNode` para suportar diferentes métodos HTTP (GET, POST, PUT, DELETE, etc.). Isso significa que cada nó na Trie poderia potencialmente ter múltiplas funções handler, uma para cada método HTTP.

## Mais Detalhes

1. Continue com a classe roteadora existente `TrieRouter`. Adicione novas funcionalidades nela.

2. Modifique a variável membro `handler` da classe `RouteNode`. Agora ela deveria ser um `Map` ao invés de uma função, que vai armazenar métodos HTTP e suas funções handler correspondentes.

3. A chave no `Map` `handler` será o método HTTP como uma string (tipo "GET", "POST") e o valor será a função handler para aquele método HTTP.

4. Modifique o método `addRoute` da classe `TrieRouter` para receber um parâmetro adicional `method`.

-   `method`: Uma string representando o método HTTP. Poderia ser "GET", "POST", "PUT", "DELETE", etc.

1. Também atualize o método `findRoute`. Agora ele terá outro parâmetro - `method`, para buscar rotas com base no método HTTP e no path também.

2. Se um handler para um path e método HTTP específicos já está presente, o novo handler deve substituir o antigo.

## Exemplo

Uma vez implementado, o uso deve parecer algo desse tipo:

```js
const trieRouter = new TrieRouter();

function getHandler() {}
function postHandler() {}

trieRouter.addRoute("/home", "GET", getHandler);
trieRouter.addRoute("/home", "POST", postHandler);

console.log(trieRouter.findRoute("/home", "GET")); // -> fn getHandler() {..}
console.log(trieRouter.findRoute("/home", "PATCH")); // -> null ou undefined
console.log(trieRouter.findRoute("/home", "POST")); // -> fn postHanlder() {..}
```

Vá em frente e adicione a funcionalidade a nossa classe `TrieRouter`. Isso vai envolver a realização de muitas mudanças no código anterior. Sinta-se livre para compartilhar a sua implementação ou solicitar por um feedback na seção de [Discussões do Github](https://github.com/ishtms/learn-nodejs-hard-way/discussions).

## Dicas

1. Quando você estiver adicionando ou buscando por uma rota, tenha certeza de considerar ambos, o path e o método HTTP.

2. Tenha cuidado ao lidar com o case-insensitive do método HTTP (prefira caixa alta). É comum receber nomes de métodos HTTP em diferentes caixas, alta e baixa.

3. Seja cuidadoso com sua lógica de tratamento de erros, a fim de gerenciar corretamente situações onde o cliente não fornece um método HTTP válido.

4. Assim como no Desafio 1, comece garantindo que a Trie funcione para um caso simples antes de mergulhar em funcionalidades mais complexas.

5. Não se esqueça de atualizar suas funções utilitárias e outros métodos para ficarem compatíveis com estes novos requisitos.

## Solução

Aqui está a solução que eu trouxe:

```js
function getRouteParts(path) {
    /** continua o mesmo **/
}

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
        this.rootNode = new RouteNode();
    }

    addRoute(path, method, handler) {
        if (typeof path != "string" || typeof handler != "function" || typeof method != "string") {
            throw new Error(
                "Invalid params sent to the `addRoute` method. `path` should be of the type `string`, `method` should be a valid HTTP verb and of type `string` and `handler` should be of the type `function`"
            );
        }

        method = method.toUpperCase();

        let routeParts = getRouteParts(path);

        if (routeParts[routeParts.length - 1] == "") {
            routeParts = routeParts.slice(0, routeParts.length - 1);
        }

        this.#addRouteParts(routeParts, method, handler);
    }

    #addRouteParts(routeParts, method, handler) {
        let node = this.rootNode;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) {
                nextNode = new RouteNode();
                node.children.set(currPart, nextNode);
            }

            if (idx == routeParts.length - 1) {
                nextNode.handler.set(method, handler);
            }

            node = nextNode;
        }
    }

    findRoute(path, method) {
        if (path.endsWith("/")) path = path.substring(0, path.length - 1);

        let routeParts = getRouteParts(path);
        let node = this.rootNode;
        let handler = null;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) break;

            if (idx == routeParts.length - 1) {
                handler = nextNode.handler.get(method);
            }

            node = nextNode;
        }

        return handler;
    }

    printTree(node = this.rootNode, indentation = 0) {
        /** inalterado **/
    }
}

class RouteNode {
    constructor() {
        this.handler = new Map();
        this.children = new Map();
    }
}
```

A nova implementação dos métodos HTTP introduziu várias mudanças chaves para extender a implementação existente do roteador, dando suporte a métodos HTTP. A seguir estão os detalhes do que foi alterado e porque:

```js
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
```

Primeiramente, definimos um objeto constante chamado `HTTP_METHODS` para representar os diferentes métodos HTTP. Isso serve como uma referência para os métodos HTTP que nossa classe `TrieRouter` dará suporte. Podemos ainda fazer algumas validações, mas isso não é necessário (vamos dar uma olhada nisso em um capítulo mais adiante, do porque a validação não é necessária aqui).

```js
class TrieRouter {
    addRoute(path, method, handler) { ... }
    ...
}
```

Em nossa classe `TrieRouter`, atualizamos o método `addRoute`. Ele agora recebe um argumento adicional, `method`, que especifica o método HTTP para a rota.

```js
if (typeof path != "string" || typeof handler != "function" || typeof method != "string") { ... }
```

O tratamento de erros foi atualizado para garantir que o `method` também é uma string.

```js
method = method.toUpperCase();
```

A string `method` é convertida para maiúsculo para padronizar os métodos HTTP.

```js
this.handler = new Map();
```

O `handler` em `RouteNode` foi alterado de uma referência à uma única função para um `Map`. Isso permite que você armazene múltiplos handlers para o mesmo path, mas com diferentes métodos HTTP.
