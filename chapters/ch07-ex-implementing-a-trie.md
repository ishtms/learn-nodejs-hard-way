[![Read Prev](/assets/imgs/prev.png)](/chapters/ch06.4-the-need-for-a-trie.md)

# Exercício 1 - Implementando uma `Trie`

> Esse exercício vai te motivar a trabalhar implementando sua solução de maneira independente. Assim que você tiver completado o exercício, você pode partir para o próximo desafio ou ler a solução para encontrar uma abordagem diferente.
>
> Nesses exercícios, não estamos focando em performance, então o importante, é focar em fazer sua solução funcionar corretamente na primeira vez que você tenta resolver um problema.

Para reiterar, Trie (pronuncia-se "try") é uma estrutura de dados do tipo árvore que armazena um conjunto dinâmico de strings, tipicamente utilizada para facilitar operações como busca, inserção e deleção. Tries são particularmente úteis para tarefas que exigem pesquisas rápidas de strings com um prefixo em comum, como em um texto com autocompletar ou na implementação de um Router para achar os paths correspondentes.

Aqui está uma ilustração que mostra como uma `Trie` se parece na teoria:

![](/assets/imgs/trie-overview.png)

Aqui está como você pode visualizar a Trie acima, com base nas palavras "OK", "TO", "CAR", "CAT" e "CUP":

## Nó Root

A Trie começa com um nó root (raiz) que não armazena nenhum caracter. Ele serve como o ponto inicial de uma Trie.

```bash
      Root
     /  |  \
    T   O   C
```

- **Nível 1**: Você tem os caracteres "O", "T" e "C" como ramificações do nó root.
- **Nível 2 e Seguintes**: Esses nós se ramificam mais para formar as palavras.
    -   "O" se ramifica para "K", completando a palavra "OK".
    -   "T" se ramifica para "O", completando a palavra "TO".
    -   "C" se ramifica para "A" e "U":
        -   "A" se ramifica mais até "R" para "CAR" e até T para "CAT".
        -   "U" se ramifica para "P", completando a palavra "CUP".

## Fim de Palavra

O "fim de palavra" é geralmente representado por um marcador boleano em um nó, para significar que o path da raiz da Trie até aquele nó, corresponde a uma palavra completa. Esse marcador ajuda a distinguir entre uma string que é meramente um prefixo e uma que é uma palavra completa na árvore Trie.

Por exemplo, considere uma Trie que armazena as palavras "car", "cat" e "cup". O nó correspondendo ao 't' em "cat" e ao 'p' em "cup" teriam o marcador de fim de palavra, indicando que eles são palavras completas e não apenas prefixos. O mesmo para 'k' em "ok" e 'o' em "to".

Ao fazer isso, se alguém buscar por "ca" não será retornado true, já que armazenamos apenas "cat" e "car", e "ca" é somente um prefixo.

Aqui está outra ilustração para explicar o fim de palavra ("end-of-word", ou EOW):

![](/assets/imgs/trie-eow.png)

## Desafio 1: Trie Básica com o Método `insert`

Neste primeiro desafio, sua tarefa é implementar uma estrutura de dados Trie com apenas uma funcionalidade: inserir uma palavra na árvore Trie.

### Requisitos

1. Crie uma classe chamada `Trie`.
2. Implemente um método `insert(word)`, que recebe uma string `word` e a insere na Trie.

### Mais detalhes

1. **Inicialização**: Você vai começar com um nó root. Esse nó será o ponto inicial para todas as inserções de palavras e não vai armazenar nenhum caracter em si.

2. **Travessia**: Para cada caracter na palavra que você quer inserir, você atravessará a Trie partindo do nó root até onde a atual sequência de caracteres permitir.

3. **Criação de Nó**: Se um caracter da palavra não corresponder a nenhum nó filho do nó atual:

    - Crie um novo nó para aquele caracter.
    - Ligue esse novo nó ao nó atual.
    - Mova-se para esse novo nó e continue a partir do próximo caracter da palavra.

4. **Fim de Palavra**: Quando você tiver inserido todos os caracteres de uma palavra em particular, marque o último nó de alguma forma para indicar que é o fim de uma palavra válida. Pode ser uma propriedade boleana no objeto nó, por exemplo.

Aqui está o modelo padrão para você começar.

> Nota: Se você desejar, você pode codar tudo do zero, sem usar o modelo abaixo. Eu recomendo fazer desse jeito se você estiver confortável.

```js
class TrieNode {
    constructor() {
        this.children = {}; // Para armazenar os filhos de TrieNode com chaves de caracteres
        // this.children = new Map(); Você também pode usar um Map no lugar.
        this.isEndOfWord = false; // Para marcar o final de uma palavra.
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        // Seu código vem aqui
    }
}
```

Uma vez implementado, seu código deve permitir operações como:

```js
const trie = new Trie();
trie.insert("hello");
```

Vá em frente e implemente o método `insert`, e então compartilhe o seu código para ajudar outros ou para receber um feedback na seção de [Discussões do Github](https://github.com/ishtms/learn-nodejs-hard-way/discussions). Tentarei revisar todos os códigos de resposta e fornecer feedback se necessário.

Ótimo. Você acabou de implementar uma `Trie`, que é uma estrutura de dados em árvore. Você também escreveu código para atravessar uma árvore, o que é geralmente chamado de "travessia de árvore".

> No caso de você não ter conseguido descobrir o que fazer, eu ainda gostaria que você se desfizesse do código que escreveu e começasse de novo do zero. Pegue uma caneta, um papel e visualize. Dessa forma, você pode converter problemas difíceis em outros mais fáceis.

### Solução

```js
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(wordToInsert, node = this.root) {
        let length = wordToInsert.length;
        if (length == 0) return;

        const letters = wordToInsert.split("");

        const foundNode = node.children.get(wordToInsert[0]);

        if (foundNode) {
            this.insert(letters.slice(1).join(""), foundNode);
        } else {
            let insertedNode = node.add(letters[0], length == 1);
            this.insert(letters.slice(1).join(""), insertedNode);
        }
    }
}

class TrieNode {
    constructor() {
        /**
         * Os filhos serão Map<key(String), node(TrieNode)>
         */
        this.isEndOfWord = false;
        this.children = new Map();
    }

    add(letter, _isLastCharacter) {
        let newNode = new TrieNode();
        this.children.set(letter, newNode);

        if (_isLastCharacter) newNode.isEndOfWord = true;
        return newNode;
    }
}

const trie = new Trie();
trie.insert("node");
trie.insert("note");
trie.insert("not");
```

Vamos dar uma olhada no código:

```js
class TrieNode {
    constructor() {
        this.isEndOfWord = false;
        this.children = new Map();
    }
}
```

Inicializa uma instância da classe `TrieNode`. Uma TrieNode tem duas propriedades:

-   `isEndOfWord`: Um marcador boleano que denota quando um nó é o último caracter de uma palavra na Trie. Inicialmente definido como `false`.
-   `children`: Um Map para armazenar os nós filhos. As chaves são letras e os valores são objetos TrieNode.

```js
add(letter, _isLastCharacter) {
        let newNode = new TrieNode();
        this.children.set(letter, newNode);

        if (_isLastCharacter) newNode.isEndOfWord = true;
        return newNode;
}
```

Eu criei um método utilitário em `TrieNode` para extrair certa lógica do método `Trie.insert`. Isso adiciona um novo `TrieNode` como um filho do nó atual, correspondendo à letra fornecida.

```js
class Trie {
    insert(wordToInsert, node = this.root) {
        let length = wordToInsert.length;

        // Condição de saída: Se a palavra a ser inserida está vazia, termina a recursão.
        if (length == 0) return;

        // Converte a string em um array com seus caracteres individuais.
        const letters = wordToInsert.split("");

        // Tenta recuperar o TrieNode correspondente a primeira letra
        // da palavra a partir dos filhos do nó atual.
        const foundNode = node.children.get(wordToInsert[0]);

        if (foundNode) {
            // A primeira letra já existe como um filho do nó atual.
            // Continua inserindo a substring restante (sem a primeira letra)
            // começando por este nó encontrado.
            this.insert(letters.slice(1).join(""), foundNode);
        } else {
            // A primeira letra não existe nos filhos do nó atual.
            // Cria um novo TrieNode para essa letra e a insere como um filho do nó atual.
            // Também define o marcador 'isEndOfWord' do nó se esse for o último caracter da palavra.
            let insertedNode = node.add(letters[0], length == 1);

            // Continua inserindo a substring restante (sem a primeira letra)
            // começando a partir desse novo nó.
            this.insert(letters.slice(1).join(""), insertedNode);
        }
    }
}
```

## Desafio 2: Implemente o Método `search`

Agora que temos uma Trie com capacidades de inserção, vamos adicionar um método `search`.

### Requisitos

1. Adicione um método `search(word)` à classe `Trie`.
2. O método deve retornar `true` se a palavra existir na Trie e `false` caso contrário.

### Mais Detalhes

1. **Comece Pela Raiz**: Comece sua busca no nó root.
2. **Travessia**: Para cada caracter na palavra, atravesse a Trie, indo de um nó para o filho que corresponda ao próximo caracter.
3. **Existência de Palavra**: Se você atingir um nó que está marcado como o fim de uma palavra (`isEndOfWord = true`), e se esgotaram todos os caracteres na palavra que você estava buscando, então a palavra existe na Trie.

Uma vez implementado, seu código deve permitir:

```js
const trie = new Trie();
trie.insert("code");
trie.insert("coding");

let found = trie.search("code");
console.log(found); // true

found = trie.search("cod");
console.log(found); // false
```

Vá em frente e implemente o método `Trie.search`. Não leia nada abaixo antes de implementar por você mesmo.

Se você está tendo problemas ou está empacado, aqui estão algumas dicas para ajudar com sua implementação - 

### Dicas

1. **Ponto Inicial**: Similar ao método `insert`, você vai começar no nó raiz e atravessar a Trie com base nos caracteres da palavra pela qual está buscando.

2. **Conferência de Caracteres**: Para cada caracter na palavra, confira se existe um nó filho para aquele caracter a partir do nó atual no qual você está.

    - **Se Sim**: Mova-se para esse nó.
    - **Se Não**: Retorne `false`, já que não é possível que a palavra exista na Trie.

3. **Conferência do Fim de Palavra**: Se você atingiu o último caracter da palavra, confira a propriedade `isEndOfWord` do nó atual. Se for `true`, a palavra existe na Trie; ao contrário, não existe.

4. **Recursão ou Loop**: Você pode escolher implementar esse método de forma recursiva ou iterativa.

    - **Recursão**: Se você optar pela recursão, você pode querer incluir um parâmetro adicional no método `search` para o nó atual, similar a como você fez para o método `insert`.
    - **Loop**: Se você prefere loops, você pode usar um loop `for` para passar por cada caracter na palavra, atualizando o seu nó atual conforme avança.

5. **Valor de Retorno**: Não se esqueça de retornar `true` ou `false` para indicar quando a palavra existe na Trie.

Boa sorte!

### Solução

Escolhi implementar a travessia de árvore utilizando o loop for desta vez, para mostrar maneiras diferentes de fazer as coisas. Eu normalmente prefiro loops-for ao invés da recursão na maior parte do tempo, devido a sobrecarga de chamadas de funções.

```js
search(word) {
    // Inicializa o 'currentNode' para o nó raiz da Trie.
    let currentNode = this.root;

    // Executa um loop através de cada caracter na palavra inserida.
    for (let index = 0; index < word.length; index++) {

        // Confere se o caracter atual existe como um
        // nó filho de 'currentNode'.
        if (currentNode.children.has(word[index])) {

            // Se existir, atualiza o 'currentNode' para esse nó filho.
            currentNode = currentNode.children.get(word[index]);
        } else {

            // Se não, a palavra não está na Trie. Retorna false.
            return false;
        }
    }

    // Depois de iterar por todos os caracteres, confere se o 'currentNode'
    // marca o fim de uma palavra na Trie.
    return currentNode.isEndOfWord;
}
```

Excelente trabalho. Agora você conhece o básico de uma estrutura de dados `Trie` e como implementá-la. No próximo exercício, vamos implementar nosso `Router` do zero! O próximo exercício será mais desafiador e exaustivo.

[![Read Next](/assets/imgs/next.png)](/chapters/ch08-ex-implementing-router.md)

![](https://uddrapi.com/api/img?page=ch7.0_exer)
