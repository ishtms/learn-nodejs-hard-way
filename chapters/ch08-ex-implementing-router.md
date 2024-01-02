[![Read Prev](/assets/imgs/prev.png)](/chapters/ch07-ex-implementing-a-trie.md)

# Exercício 2 - Implementando Nosso `Router` Baseado em Trie

> Este desafio foi projetado para ultrapassar seus limites e é considerado mais avançado que o normal. Está totalmente okay se você não decifrá-lo na primeira tentativa. A chave é persistir, revisite sua lógica e não hesite em iterar pelas suas soluções.

Já que acabamos de construir uma estrutura de dados Trie, que pode inserir e buscar palavras de maneira eficiente, podemos seguir aprimorando suas capacidades ao extendê-la para implementar um roteador baseado em Trie, para corresponder padrões de URL. Essa poderosa aplicação da estrutura de dados `Trie` é comumente utilizada em frameworks web, onde exerce um papel crucial ao rotear requisições HTTP que estão chegando às suas respectivas funções handler de maneira eficiente.

Ao construir um roteador baseado em `Trie`, nosso framework pode atingir escalabilidade e performance otimizada, garantindo que cada requisição seja eficientemente direcionada ao handler apropriado para processamento.

## Desafio 1: Implementando o Método `addRoute`

### Requisitos

Crie uma nova classe, `TrieRouter`, similar ao que tínhamos anteriormente - `Trie`. Adicione um método, `addRoute`, que recebe um modelo de URL (tipo `/home` ou `/user/status/play`) como primeiro parâmetro e uma função handler como segundo parâmetro. Então, insira o modelo de URL em `TrieRouter`, associando a função handler com o último nó daquele modelo.

### Mais Detalhes

1. **Definição de Classe**: Defina uma classe chamada `TrieRouter`. Essa classe deve conter:

    - Um nó root, que é o ponto inicial de uma Trie.
    - Um método chamado `addRoute`.

2. **Nós de Rota**: Defina uma classe chamada `RouteNode`, que vai representar todos os nós.

    1. `RouteNode` deve conter a função handler, que será `null` ou `undefined`, para todos os nós, exceto para os nós finais de cada modelo de URL.

    2. `RouteNode` também deve conter um `Map` para armazenar os nós filhos, onde a chave será o segmento de URL, como "home" ou "user", e o valor será outro `RouteNode`.

3. **Nó Raiz**: O nó raiz é um nó vazio do tipo `RouteNode`, que serve como o ponto inicial para inserção de novos modelos de URL na Trie. Inicialize-o no constructor de `TrieRouter`.

4. **Método - `addRoute`**: Esse método recebe dois parâmetros:

    - `path`: Uma string representando o modelo de URL para adicionar na Trie. O modelo de URL será segmentado por barras `/`.

    - `handler`: Uma função que deve ser chamada quando um modelo de URL corresponder.

    - Remova a barra final `/` do `path` se existir.

    - O método deve inserir o `path` em `TrieRouter`, associando a função `handler` com o último nó daquele modelo.

5. **Barras Finais**: Você deve tratar rotas que terminam com uma barra `/` da mesma forma que aquelas que não terminam, para que `/home/` e `/home` apontem para o mesmo handler.

6. **Barras Repetidas**: Você deve remover todas as `/` repetidas do path.

    1. `/user//hello////` deve resultar em `/user/hello`

    2. `/user//////////` deve resultar em `/user`

7. **Remova Espaços em Branco** antes e depois de todos os segmentos de URL. Por exemplo, `/   user/ node  /` deve resultar em `/user/node`

8. **Rejeite URLs** que não começam com `/`

    1. Se alguém usar `trieRouter.addRoute("hi/something")`, seu código deve exibir um erro.

Assim que implementado, deveríamos ser capazes de fazer algo desse tipo:

```js
const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});

// /home -> válido
// /user/status/play -> válido
// /user/status -> inválido
// /user -> inválido
// /home/ -> válido
// /user/status/play/ -> inválido
```

Você não precisa se preocupar em fazer requisições HTTP ainda. Um `TrieRouter` implementado corretamente, deve ficar assim depois de adicionar ambas as rotas mencionadas acima -

```bash
                (Root)
                  |
      -----------------------
      |           |          |
    "home"      "user"     (other segments)
      |           |
function ref   "status"
                  |
                  |
               "play"
                  |
         function inline
```

Vá em frente e implemente sua versão de `TrieRouter`, `RouteNode` e `addRoute`. Aqui está um modelo inicial para o desafio. Você pode prosseguir sem usar o modelo de código se estiver confortável.

Você pode então compartilhar o seu código para ajudar outros ou para receber um feedback na seção de [Discussões do Github](https://github.com/ishtms/learn-nodejs-hard-way/discussions). Tentarei revisar todos os códigos de resposta e fornecer feedback se necessário.

```js
class TrieRouter {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        /* O código para adicionar rotas vai aqui */
    }
}

class RouteNode {
    constructor() {
        /** Define o handler e os nós filhos **/
    }
}
```

### Dicas

1. Lembre-se que uma Trie é uma estrutura do tipo árvore, onde cada nó representa um pedaço/segmento de uma URL. Entender a hierarquia pode simplificar o processo.

2. Antes de mergulhar na implementação de todas as condições, como remover barras finais ou espaços, garanta que sua Trie esteja funcionando com o mais simples caso, como adicionar uma rota única.

3. Considere quebrar o caminho da URL em segmentos utilizando o `split("/")` e iterar através dos segmentos para atravessar a Trie.

4. Tenha em mente que a função handler é associada com o nó final do modelo de URL. Garanta que o handler seja colocado somente no nó correto.

5. Use o `Map` em cada nó para armazenar seus filhos. Ao adicionar uma nova rota, confira se um nó para o segmento já existe; se existir, atravesse para ele. Caso contrário, crie um novo nó.

6. Para lidar com barras finais, barras repetidas e espaços em branco, você pode escrever funções utilitárias que normalizem o path antes de processá-lo.

### Solução

Parabéns aos que implementaram a função `addRoute` na classe `TrieRouter` com sucesso. Você acabou de completar o primeiro exercício difícil neste livro, demonstrando não somente suas habilidades em codar, mas também sua capacidade de resolver problemas.

Aos que acharam esse desafio particularmente desafiador, não fique desencorajado. As complexidades que você enfrentou são o que vão aprofundar seu conhecimento e aprimorar suas habilidades de código. Considere revisitar este exercício depois de olhar a solução ou descartá-lo e começar novamente do zero.

```js
class RouteNode {
    constructor() {
        this.handler = null;
        this.children = new Map();
    }
}

class TrieRouter {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        if (typeof path != "string" || typeof handler != "function") {
            throw new Error(
                "Invalid params sent to the `addRoute` method. `path` should be of the type `string` and `handler` should be of the type `function`"
            );
        }

        let routeParts = path
            .replace(/\/{2,}/g, "/")
            .split("/")
            .map((curr) => curr.toLowerCase().trim());

        if (routeParts[routeParts.length - 1] == "") {
            routeParts = routeParts.slice(0, routeParts.length - 1);
        }

        this.addRouteParts(routeParts, handler);
    }

    addRouteParts(routeParts, handler) {
        let node = this.rootNode;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) {
                nextNode = new RouteNode();
                node.children.set(currPart, nextNode);
            }

            if (idx === routeParts.length - 1) {
                nextNode.handler = handler;
            }

            node = nextNode;
        }
    }
}

const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", ref);
```

Vamos visualizar nossa árvore. Criei um novo método dentro da classe `TrieRouter`, que imprime todos os nós do nosso `TrieRouter` recursivamente:

```js
class TrieRouter {
    ...

    printTree(node = this.rootNode, indentation = 0) {
        const indent = "-".repeat(indentation);

        node.children.forEach((childNode, segment) => {
            console.log(`${indent}${segment}`);
            this.printTree(childNode, indentation + 1);
        });
    }

    ...
}
```

Para checar nosso output, vamos executar nosso arquivo:

```js
const trieRouter = new TrieRouter();

function ref() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", ref);
trieRouter.printTree();
```

Saída:

```bash
$node trie_router.js

# SAÍDA
-home
--id
-user
--status
---play
```

Parece perfeito. Vamos passar pelo código e entender o que está acontecendo.

### Explicação

```js
class RouteNode {
    constructor() {
        // Inicializa o handler como null
        this.handler = null;

        // Cria um Map para armazenar os nós filhos
        this.children = new Map();
    }
}
```

Na classe `RouteNode`, cada nó é inicializado com um `handler` definido como `null`. Esse handler vai hospedar uma referência para a função que queremos executar quando uma rota corresponder ao modelo de URL requisitado. Juntamente com o handler, criamos um `children` Map. Esse Map vai conter referências aos próximos nós na Trie, nos permitindo navegar através da Trie utilizando segmentos de URL como chaves.

```js
class TrieRouter {
    constructor() {
        // Cria um rootNode quando o TrieRouter é instanciado.
        this.rootNode = new RouteNode();
    }
}
```

A classe `TrieRouter` age como um gerente para a estrutura de dados Trie. Quando uma instância dessa classe é criada, um `rootNode` é inicializado. Esse nó root age como o ponto de entrada para qualquer operação que necessite atravessar a Trie, representando essencialmente a raiz da estrutura Trie.

```js
addRoute(path, handler) {
    // Valida os tipos de entrada
    if (typeof path != "string" || typeof handler != "function") {
        throw new Error("Invalid params ...");
    }
}
```

O método `addRoute` é responsável por adicionar modelos de URL e seus handlers correspondentes à Trie. O método começa ao validar os inputs, garantindo que `path` é uma string e que `handler` é uma função. Se uma dessas condições não for correspondida, um erro é exibido.

```js
addRoute(path, handler) {
    ...
    // Normaliza o path ao remover barras consecutivas
    // e o divide em segmentos
    let routeParts = path.replace(/\/{2,}/g, "/").split("/").map((curr) => curr.toLowerCase().trim());
    if (routeParts[routeParts.length - 1] == "") {
        routeParts = routeParts.slice(0, routeParts.length - 1);
    }
}
```

A próxima parte do método pré-processa o path. Primeiramente, barras consecutivas são substituídas por uma única barra. Então, o path é dividido em segmentos (partes entre as barras), e cada segmento é convertido em caixa baixa e quaisquer espaços são retirados. Finalmente, se o último segmento está vazio, o que pode acontecer se o path tem uma barra final, ele é removido do array de segmentos.

```js
addRoute(path, handler) {
    ...
    // Delega a real inserção na Trie para um método auxiliar
    this.addRouteParts(routeParts, handler);
}
```

A ação final no método `addRoute` é chamar uma função auxiliar chamada `addRouteParts`, passando os segmentos pré-processados (`routeParts`) e o `handler`. Isso modulariza o código, separando o pré-processamento e a lógica de validação da lógica de inserção da Trie.

```js
addRouteParts(routeParts, handler) {
    // Começa no rootNode da Trie
    let node = this.rootNode;

    // Itera por todos os segmentos da rota
    for (let idx = 0; idx < routeParts.length; idx++) {
        let currPart = routeParts[idx];

        // Tenta encontrar o próximo nó na Trie
        let nextNode = node.children.get(currPart);
        ...
}
```

O método `addRouteParts` inicia ao definir o `node` como o `rootNode` da Trie. Então, um loop `for` itera através de cada segmento do array `routeParts`. Para cada segmento, o código confere se um nó filho com aquele segmento como chave já existe no `children` Map do nó atual.

```js
addRouteParts(routeParts, handler) {
    ...

    // Se o próximo nó não existir, ele é criado
    if (!nextNode) {
        nextNode = new RouteNode();
        node.children.set(currPart, nextNode);
    }

    // Se esse for o último segmento, atribui o handler a este nó
    if (idx === routeParts.length - 1) {
        nextNode.handler = handler;
    }
    
    // Se move para o próximo nó para a próxima iteração
    node = nextNode;
}
```

Se um nó filho para o segmento atual não existir, um novo `RouteNode` é instanciado e adicionado ao `children` Map do nó atual, com o segmento como a chave. Então, se o atual segmento for o último no array `routeParts`, a função handler é associada com esse novo nó. Finalmente, o nó atual é atualizado para esse novo nó, pronto para a próxima iteração ou para o fim do loop.

É isso. Agora temos uma implementação do nosso roteador funcionando, mas ela suporta apenas adicionar rotas. O próximo desafio envolve encontrar a rota e retornar o handler associado com ela.

## Desafio 2: Implementando o Método `findRoute`

### Requisitos

Você implementou o método `addRoute` com sucesso para construir nosso roteador baseado em `Trie`. Agora, vamos extender nossa classe `TrieRouter` adicionando outro método, `findRoute`. Esse método deve receber um modelo de URL ( tipo `/home` ou `/user/status/play`) como parâmetro. Buscar no `TrieRouter` e encontrar a função handler associada com o último nó que corresponda ao modelo.

### Mais Detalhes

1. **Método - `findRoute`**: Adicione um método chamado `findRoute` à sua classe `TrieRouter`.

-   Esse método deve receber um único parâmetro, o `path`, que é uma string, representando o modelo de URL para encontrar na Trie.

-   Retorne a função handler associada com o último nó do modelo de URL correspondente.

-   Se o modelo de URL não for encontrado, retorne `null` ou alguma indicação de que a rota não existe.

1. **Normalização de Path**: Antes de buscar pela rota na Trie, normalize o path de maneira similar ao que você fez em `addRoute`.

-   Remova as barras finais.

-   Remova barras repetidas.

-   Remova espaços em branco antes e depois de cada segmento de URL.

1. **Travessia**: Comece do nó raiz e atravesse a Trie com base nos segmentos de URL. Recupere a função handler do último nó se o path existir.

2. **Correspondência de Rotas**: Agora a Trie deve permitir uma correspondência parcial. Por exemplo, se um handler está definido para `/user/status`, uma requisição para `/user/status/play` deve retornar null se `/user/status/play` não tiver sido definido!

3. **Case Sensitivity**: Tenha certeza de converter os caminhos da URL para minúsculo antes da correspondência. Dessa forma, `/AbC` e `/abc` devem resultar no mesmo handler.

Uma vez implementado, devemos ser capazes de fazer algo desse tipo:

```js
const trieRouter = new TrieRouter();

function homeHandler() {}
function userHandler() {}

trieRouter.addRoute("/home", homeHandler);
trieRouter.addRoute("/user/status", userHandler);

console.log(trieRouter.findRoute("/home")); // Deve retornar homeHandler
console.log(trieRouter.findRoute("/user/status")); // Deve retornar userHandler
console.log(trieRouter.findRoute("/user/status/play")); // Deve retornar null
```

Sinta-se livre para compartilhar sua implementação ou solicitar um feedback na seção de [Discussões do Github](https://github.com/ishtms/learn-nodejs-hard-way/discussions). Tentarei revisar todas os códigos de resposta e fornecer feedback se necessário.

### Modelo Inicial

Sinta-se livre para usar o modelo inicial a seguir. Se você estiver confortável, você pode prosseguir sem ele.

```js
class TrieRouter {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        /* Seu código para addRoute */
    }

    findRoute(path) {
        /* Seu código para findRoute vem aqui */
    }
}

class RouteNode {
    constructor() {
        /* Defina o handler e o children map */
    }
}
```

### Dicas

1. Ao atravessar a Trie, você pode achar benéfico quebrar o modelo de URL em segmentos, como você acabou de fazer ao inserir a rota.

2. Seja cuidadoso com os valores de retorno. Garanta que você vai retornar a função handler se uma correspondência for encontrada, e um indicador adequado (como `null`) se nenhuma correspondência existir.

3. Para a normalização de path, você pode querer reutilizar a funcionalidade que escrevemos para o método `addRoute`, para lidar com coisas como barras finais e barras repetidas. Ainda melhor - extraia isso para uma função auxiliar (não um método).

4. Ao atravessar a Trie, sempre confira se você já atingiu o nó-folha (nó final) ou se a travessia precisa continuar para encontrar o handler apropriado.

### Solução

Aqui está a solução que trouxe:

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        .map((curr) => curr.toLowerCase().trim());
}

class Router {
    constructor() {
        this.rootNode = new RouteNode();
    }

    addRoute(path, handler) {
        ...

        let routeParts = getRouteParts(path);
        /** O resto está inalterado **/
    }

    addRouteParts(routeParts, handler) {
        /** Nada alterado **/
    }

    findRoute(path) {
        if (path.endsWith("/")) path = path.substring(0, path.length - 1);

        let routeParts = getRouteParts(path);
        let node = this.rootNode;
        let handler = null;

        for (let idx = 0; idx < routeParts.length; idx++) {
            let currPart = routeParts[idx];

            let nextNode = node.children.get(currPart);

            if (!nextNode) break;

            if (idx == routeParts.length - 1) {
                handler = nextNode.handler;
            }

            node = nextNode;
        }

        return handler;
    }

    printTree(node = this.rootNode, indentation = 0) {
       /** Nada alterado **/
    }
}

class RouteNode {
    /** o mesmo de antes **/
}
```

### Explicação

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        .map((curr) => curr.toLowerCase().trim());
}
```

Extrai a lógica de normalização de path para sua própria função auxiliar. Já que precisaríamos utilizar essa funcionalidade no método `findRoute` também, pareceu uma boa ideia removê-la do método `addRoute`.

```js
addRoute(path, handler) {
    ...

    let routeParts = getRouteParts(path);
    /** O resto está inalterado **/
}
```

Estamos utilizando a recém criada função `getRouteParts` para normalizar e segmentar o path em `routeParts`. O resto da implementação permanece como antes.

```js
    findRoute(path) {
        // remove a barra final
        if (path.endsWith("/")) path = path.substring(0, path.length - 1);

        // Inicializa as variáveis routeParts, node e handler.
        let routeParts = getRouteParts(path);
        let node = this.rootNode;
        let handler = null;
        ...
    }
```

Inicializamos três variáveis chave. A variável `routeParts` armazena os segmentos de URL normalizados, obtidos ao chamar `getRouteParts()`. A variável `node` monitora nossa posição atual na Trie e é inicializada como o nó root. A variável `handler` é inicializada como `null` e mais tarde armazenará a função handler se uma correspondência for encontrada.

```js
findRoute(path) {
    ...

    // Atravessa a Trie com base nos segmentos de URL
    for (let idx = 0; idx < routeParts.length; idx++) {
        let currPart = routeParts[idx];

        // Recupera o nó filho correspondente ao segmento de URL atual
        let nextNode = node.children.get(currPart);
    ...
}
```

Iteramos através de cada segmento do array `routeParts`. Dentro do loop, `currPart` armazena o segmento de URL atual e `nextNode` é obtido através do `children` map no `node` atual com base neste segmento. Essa parte é crucial, porque estamos determinando se um nó filho já existe em nossa Trie para o atual segmento de URL.

```js
findRoute(path) {
    ...
    // Se o próximo nó não existir, sai do loop
    if (!nextNode) break;

    // Se esse for o último segmento, pega o handler se existir
    if (idx == routeParts.length - 1) {
        handler = nextNode ? nextNode.handler : null;
    }
    ...
}
```

Primeiro o método confere se `nextNode` já existe. Se não existir, o loop é terminado imediatamente utilizando `break`. Isso significa que a Trie não contém uma rota correspondente para a URL fornecida, e não há necessidade de continuar procurando.

Então, checamos se o loop já atingiu o último segmento (nó-folha) da URL (`routeParts.length - 1`). Se tiver atingido, tentamos recuperar a função `handler` associada com o `nextNode`. Se o `nextNode` não existir, o `handler` permanece null.

```js
findRoute(path) {
    ...
    for(...) {
        ...
        // Atualiza o nó atual da Trie para a próxima iteração
        node = nextNode;
    }

    // Retorna o handler se encontrado, caso contrário será retornado null
    return handler;
}
```

Primeiramente, atualizamos nosso `node` como `nextNode` para a próxima iteração. Isso permite que o loop se mova mais profundamente na Trie conforme itera através de cada segmento de URL. Depois do loop, o método retorna o `handler` se for encontrado. Se nenhum handler for encontrado durante a travessia da Trie, o valor de retorno será `null`.

Vamos testar nosso código:

```js
const trieRouter = new TrieRouter();

function ref() {}
function refs() {}

trieRouter.addRoute("/home/", ref);
trieRouter.addRoute("/  user/  status/play", function inline() {});
trieRouter.addRoute("/home/id", refs);

console.log(trieRouter.findRoute("/home/"));
console.log(trieRouter.findRoute("/home"));
console.log(trieRouter.findRoute("/home/id/"));
console.log(trieRouter.findRoute("/home/id/1"));
console.log(trieRouter.findRoute("/user/status/play"));
console.log(trieRouter.findRoute("/user/status/play/"));
```

Isso exibe:

```bash
[Function: ref]
[Function: ref]
[Function: refs]
null
[Function: inline]
[Function: inline]
```

Tudo parece estar funcionando bem. E é só isso para o método `findRoute`. Isso foi muito mais fácil do que a nossa implementação de `addRoute`, já que nos importamos apenas com a busca. Excelente, entendemos bem o básico! Agora vamos partir para funcionalidades mais avançadas no próximo capítulo, como implementar métodos HTTP com nosso roteador.

[![Read Next](/assets/imgs/next.png)](/chapters/ch09-ex-adding-http-methods.md)

![](https://uddrapi.com/api/img?page=ex2)
