[![Read Prev](/assets/imgs/prev.png)](/chapters/ch02-your-first-nodejs-server.md)

## Trabalhando com arquivos

Agora que cobrimos os fundamentos sobre o registro de logs no Node.js, vamos explorar um exemplo do mundo real. Vamos entender o baixo nível dos arquivos e como interagir com eles. Depois disso, vamos construir uma biblioteca de logs (registros) chamada [logtar](https://github.com/ishtms/logtar), que grava registros em um arquivo de log. Ela também suporta rastreamento e criação contínua de arquivos. Vamos utilizar essa biblioteca como mecanismo central de logs para o nosso framework web, que será construído mais adiante neste guia.

### O que a biblioteca de logs vai fazer?

- Registrar mensagens em um arquivo
- Escolher o local de registro ou simplesmente gerar um novo arquivo
- Suporte para níveis de registro (debug, info, warning, error, critical)
- Registro de data nas mensagens de log
- Formato customizável de mensagens de log
- Rotação de logs automática baseada no tamanho do arquivo ou intervalo de tempo
- Suporte para output no console, além dos arquivos de log
- Uma API para mensagens de log simples e fácil de usar

### Afinal, como você trabalha com arquivos?

Um arquivo no Node.js é representado por um objeto JavaScript. Esse objeto possui propriedades que descrevem o arquivo, como o seu nome, tamanho e data da última modificação. O objeto também possui métodos que podem ser usados para ler, modificar e deletar o arquivo.

Para trabalhar com arquivos e acessar métodos auxiliares relacionados a eles, você pode importar o **_módulo_** `fs` da biblioteca padrão do Node.js.

**Espere, o que é exatamente um `módulo`?**

No Node.js, todo arquivo JavaScript é como um pequeno pacote, chamado módulo. Cada módulo tem seu próprio espaço, e qualquer coisa que você escreve naquele módulo só pode ser usada naquele módulo, a menos que você especificamente compartilhe ele com outros.

Quando você cria um arquivo **`.js`** no Node.js, ele pode se tornar um módulo na mesma hora. Isso significa que você pode colocar seu código naquele arquivo, e se você quiser utilizar esse código em outras partes da sua aplicação, você pode compartilhá-lo usando o objeto **`module.exports`**. Do outro lado, você pode pegar códigos de outros módulos e usá-los no seu arquivo utilizando a função **`require`**.

Essa abordagem modular é importante para manter seu código organizado e separado, tornando fácil a reutilização de partes do seu código em diferentes lugares. Isso também ajuda a manter seu código seguro contra erros que podem acontecer quando diferentes partes de código interagem de forma inesperada.

Vamos ver um exemplo criando um módulo chamado `calculadora`

Crie um arquivo chamado `calculadora.js` e adicione o conteúdo a seguir nele

```jsx
// calculadora.js

function adiciona(num_um, num_dois) {
    return num_um + num_dois;
}

function subtrai(num_um, num_dois) {
    return num_um - num_dois;
}

function multiplica(num_um, num_dois) {
    return num_um * num_dois;
}

function divide(num_um, num_dois) {
    return num_um / num_dois;
}

// Apenas exporta as funções adiciona e subtrai
module.exports = {
    adiciona,
    subtrai,
};
```

Ao especificar a propriedade `exports` no objeto global `module`, declaramos quais propriedades ou métodos específicos devem ser expostos publicamente e definidos como acessíveis a partir de todos os outros módulos/arquivos durante a execução.

Note, nós não exportamos `multiplica` e `divide` e veremos em breve o que acontece quando tentamos acessar e chamar essas funções.

> Nota: Forneça o caminho relativo para o arquivo `calculadora.js`. No meu caso, está localizado no mesmo diretório e no mesmo nível na hierarquia de pastas.

No seu arquivo `index.js`, você pode importar as funções exportadas como demonstrado a seguir.

```jsx
const { adiciona, divide, multiplica, subtrai } = require("./calculadora");

// Você também pode escrever desse jeito, mas é preferível omitir a extensão `.js`
const { adiciona, divide, multiplica, subtrai } = require("./calculadora.js");
```
Repare que estamos importando as funções `multiplica` e `divide` mesmo que não tenhamos exportado elas no módulo `calculadora.js`. Isso não causará nenhum problema até que a gente tente usar essas funções. Se você rodar o código acima com o comando `node index`, ele executará normalmente, mas não vai produzir nenhuma saída. Vamos tentar entender o porque a execução não falha.

O `module.exports` é basicamente um javascript `Object`, e quando você aplica um `require` a partir de outro arquivo, ele tenta avaliar os campos com os nomes fornecidos (resumindo, desestruturação).

Sendo assim, você pode pensar nesse processo como algo desse tipo:

```jsx
const my_module = {
    fn_um: function fn_um() {...},
    fn_dois: function fn_dois() {...}
}

const { fn_um, fn_dois, fn_tres } = my_module;
fn_um;   // fn_um() {}
fn_dois;   // fn_dois() {}
fn_tres; // undefined
```

Isso deve esclarecer o porque não são apresentados erros quando tentamos incluir uma função/propriedade que não está sendo explicitamente exportada por outro módulo. Se aquele identidicador não for encontrado, ele se torna simplesmente `undefined`.

Então, os identificadores acima, `multiplica` e `divide`, estão apenas como `undefined`. No entanto, se tentarmos adicionar essa linha:

```jsx
// index.js

let num_dois = multiplica(1, 2);
```

O programa quebra:

```jsx
/Users/ishtmeet/Code/intro-to-node/index.js:5
let num_dois = multiplica(1, 2);
              ^

TypeError: multiplica is not a function
    at Object.<anonymous> (/Users/ishtmeet/Code/intro-to-node/index.js:5:15)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47
```

Não podemos chamar um valor `undefined` como uma função. `undefined()` não faz nenhum sentido.

Vamos exportar todas as funções do módulo `calculadora`.

```jsx
// calculadora.js

function adiciona(num_um, num_dois) {...}

function subtrai(num_um, num_dois) {...}

function multiplica(num_um, num_dois) {...}

function divide(num_um, num_dois) {...}

// Exportando todas as funções
module.exports = {
  adiciona,
  subtrai,
  multiplica,
  divide,
};
```
No arquivo `index.js`, vamos chamar todas as funções para ver se tudo está funcionando como esperado.

```jsx
// index.js

const { adiciona, divide, multiplica, subtrai } = require("./calculadora");

console.log(adiciona(1, 2));
console.log(subtrai(1, 2));
console.log(multiplica(1, 2));
console.log(divide(1, 2));

// saída
3 - 1;
2;
0.5;
```
Recapitulando o que acabou de ser estabelecido acima: O `module.exports` é simplesmente um objeto. Adicionamos apenas o que queremos exportar nos campos deste objeto.

Então ao invés de fazer `module.exports = { adiciona, subtrai, .. }`, você pode fazer isso

```jsx
// calculadora.js

module.exports.adiciona = function adiciona(num_um, num_dois) {
    return num_um + num_dois;
};

module.exports.subtrai = function subtrai(num_um, num_dois) {
    return num_um - num_dois;
};

module.exports.multiplica = function multiplica(num_um, num_dois) {
    return num_um * num_dois;
};

module.exports.divide = function divide(num_um, num_dois) {
    return num_um / num_dois;
};
```

É uma questão de preferência. Mas há uma grande desvantagem e nuance nessa abordagem. Você não pode usar essas funções no mesmo arquivo.

_Vamos utilizar os termos `arquivo` e `módulo` de forma alternada, mesmo que em teoria eles não sejam a mesma coisa._

```jsx
// calculadora.js
module.exports.adiciona = function adiciona(num_um, num_dois) {..}
module.exports.subtrai = function subtrai(num_um, num_dois) {..}
module.exports.multiplica = function multiplica(num_um, num_dois) {..}
module.exports.divide = function divide(num_um, num_dois) {..}

divide(1,2)

// Saída
/Users/ishtmeet/Code/intro-to-node/calculadora.js:16
divide(1, 2);
^

ReferenceError: divide is not defined
    at Object.<anonymous> (/Users/ishtmeet/Code/intro-to-node/calculadora.js:16:1)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Module.require (node:internal/modules/cjs/loader:1143:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.<anonymous> (/Users/ishtmeet/Code/intro-to-node/index.js:1:45)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
```

Isso acontece porque `divide` e todas as outras funções declaradas nesse módulo são parte do objeto `module.exports`, e elas não estão disponíveis no escopo. Vamos analisar isso em um exemplo fácil

```jsx
let pessoa = {};
pessoa.obter_idade = function obter_idade() {...}

// `obter_idade` "is not defined" já que só pode ser acessada usando
// `pessoa.obter_idade()`
obter_idade();
```

Eu espero que tenha ficado claro. Você poderia fazer algo assim.

```jsx
// calculadora.js

...

// Você pode fazer isso
module.exports.adiciona = adiciona;
module.exports.subtrai = subtrai;
module.exports.multiplica = multiplica;
module.exports.divide = divide;

// Ou isso
module.exports = {
  adiciona,
  subtrai,
  multiplica,
  divide,
};
```

O primeiro método não é a melhor maneira de criar a biblioteca da sua API. A segunda opção é mais concisa e fácil de ler. Ela claramente demonstra que você está exportando um grupo de funções como propriedades de um objeto. Isso pode ser particularmente útil quando você tem muitas funções para exportar. Além disso, tudo fica bem acomodado em um único lugar. Você não precisa ficar procurando por `module.exports.nome_de_exportar` até encontrar qual módulo quer exportar.

### Vamos voltar aos `arquivos`

No Node.js, uma `file` é uma forma de interagir com os dados em um arquivo. O módulo **`fs`** é usado para lidar com operações de arquivos. Ele funciona usando identificadores únicos atribuídos a cada arquivo pelo sistema operacional, chamados de [descritores de arquivos](https://en.wikipedia.org/wiki/File_descriptor).

Com o módulo **`fs`**, você pode realizar diversas operações nos arquivos, como ler, gravar, atualizar e deletar. O Node.js fornece métodos síncronos e assíncronos para essas operações. Os métodos síncronos podem diminuir a capacidade de resposta do seu aplicativo, enquanto os métodos assíncronos permitem execução não bloqueante.

O Node.js interage (indiretamente, através) com o subsistema de entrada e saída (I/O) do sistema operacional para gerenciar operações de arquivos, realizando chamadas de sistema como **`open`**, **`read`**, **`write`** e **`close`**. Quando você abre um arquivo, o Node.js solicita ao sistema operacional para alocar um descritor de arquivo, que é usado para ler e gravar dados em um arquivo. Assim que a operação é concluída, o descritor de arquivo é liberado.

> Um descritor de arquivo é uma forma de representar um arquivo aberto no sistema operacional de um computador. É como um número especial que o identifica e que o sistema operacional usa para monitorar o que está acontecendo com o arquivo. Você pode utilizar o descritor de arquivo para ler, gravar, se mover pelo arquivo e para fechá-lo.

### Um pouco mais sobre descritores de arquivos

Quando um arquivo é aberto por um processo, o sistema operacional atribui um descritor de arquivo único para aquele arquivo aberto. Esse descritor é essencialmente um valor inteiro que serve como um identificador para o arquivo aberto dentro do contexto daquele processo. Descritores de arquivos são utilizados em várias [chamadas de sistema](https://en.wikipedia.org/wiki/System_call) e APIs para performar operações como ler, gravar, buscar e fechar arquivos.

Em sistemas do tipo Unix, incluindo o Linux, descritores de arquivos normalmente são gerenciados através de uma estrutura de dados chamada de [tabela de arquivos](https://man7.org/linux/man-pages/man5/table.5.html) ou [controle de bloqueio de arquivo](https://en.wikipedia.org/wiki/File_Control_Block). Essa tabela monitora as propriedades e status de cada aquivo aberto, assim como a posição atual do arquivo, permissões e outras informações relevantes. O descritor de arquivo age como um **_index_** ou chave para essa tabela, permitindo que o sistema operacional busque rapidamente pelos detalhes do arquivo aberto associado com aquele descritor de arquivo em particular, o que é mais eficiente e performático do que iterar sobre um vetor/matriz de arquivos e achar um arquivo específico.

Quando você interage com arquivos ou descritores de arquivos, normalmente você está lidando com valores numéricos. Por exemplo, em C, a chamada de sistema **`open()`** retorna um descritor de arquivo. Outras funções, como **`read()`**, **`write()`**, e **`close()`**, necessitam desse descritor para operar no arquivo correspondente. Em um ambiente de execução como o Node.js, o módulo **`fs`** abstrai o uso direto de descritores de arquivo oferecendo uma API mais amigável, mas ainda depende dele nos bastidores para gerenciar operações com arquivos.

> Um descritor de arquivo é pequeno, um inteiro não negativo que serve como um índice de entrada na tabela de descritores de arquivos abertos do processo. Esse inteiro é utilizado em chamadas de sistema subsequentes (como read, write, lseek, fcntl, etc.) para se referir ao arquivo aberto. Uma chamada bem-sucedida retornará para o processo **_o descritor de arquivo de menor número_** que não está aberto no momento.

### Criando nosso primeiro arquivo

O módulo `node:fs` te permite trabalhar com o sistema de arquivos utilizando funções [POSIX](https://en.wikipedia.org/wiki/POSIX) padrão. O Node.js oferece múltiplas maneiras de trabalhar com arquivos. Isso demonstra os diversos sabores que a FileSystem API dele possui. Uma _API assíncrona baseada em promises_, uma _API baseada em callbacks_ e uma _API síncrona._

Vamos criar um novo módulo, `files.js`, na mesma pasta que contém o seu módulo `calculadora` e o arquivo `index.js`. Vamos importar o módulo `fs` para começar a trabalhar com arquivos.

```jsx
// API baseada em Promise
const fs = require("node:fs/promises");

// API baseada em Callback/Síncrona
const fs = require("node:fs");
```

Uma regra geral é: sempre prefira API assíncrona, a menos que você esteja lidando com uma situação específica que necessite de comportamento síncrono.

APIs assíncronas possuem dois principais benefícios: elas aumentam a resposta do seu código e o tornam mais escalável. Essas APIs permitem que seu código continue rodando enquanto aguarda por tarefas mais lentas como operações de entrada e saída (I/O) ou requisições de rede. Por não bloquear outras operações, essas APIs possibilitam sua aplicação lidar com diversas tarefas ao mesmo tempo, o que aumenta a performance geral.

Código assíncrono é melhor para gerenciar múltiplas tarefas acontecendo ao mesmo tempo do que a tradicional abordagem baseada em callbacks. Com callbacks, pode ser difícil se manter a par do que está acontecendo, levando a um **callback hell**. Utilizar promises e async/await ajuda a tornar o código mais fácil de ler e gerenciar, tornando-o menos suscetível a sofrer com complexos callbacks aninhados.

> Vou utilizar a API baseada em promises do Node.js. No entanto, você pode usar outras opções para ver quais problemas aparecem quando seu código se torna mais complexo.

Adicione esse trecho de código no arquivo `files.js`

```jsx
// files.js
const fs = require("node:fs/promises");

async function open_file() {
    const file_handle = await fs.open("calculadora.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle);
}

module.exports = open_file;
```

E esse no arquivo `index.js`

```jsx
// index.js
const open_file = require("./files");

open_file();

/*
FileHandle {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  close: [Function: close],
  ..
}
 */
```

Vamos destrinchar isso aqui

```jsx
const fs = require("node:fs/promises");
```

Essa linha traz o módulo **`fs`** do Node.js. Ela importa especificamente o sub-módulo **`fs/promises`**, que oferece operações de sistema de arquivos que podem ser executadas de maneira assíncrona e envelopadas em Promises.

```jsx
fs.open("calculadora.js", "r", fs.constants.O_RDONLY);
```

A função **`fs.open`** é utilizada para abrir um arquivo. Ela recebe três argumentos: o `path` (caminho) do arquivo, uma `flag` e um `mode`.

O `path` recebe um argumento do tipo **`PathLike`**, que é um tipo que representa o caminho de um arquivo (path). É um conceito utilizado na API do Node.js para indicar que o valor deve ser uma string representando um caminho de arquivo válido. Vamos ver a definição do tipo `PathLike`

```jsx
export type PathLike = string | Buffer | URL;
```

### O argumento `path`

1. String **Paths:**
   A forma mais comum de representar o path de um arquivo é através de uma string. A string de um path pode representar o caminho de maneira relativa ou absoluta. É uma sequência simples de caracteres que especificam o local do arquivo no computador.
   - Exemplo de uma string passando um path relativo: **`"./calculadora.js"`**
   - Exemplo de uma string passando um path absoluto: **`"/Users/ishtmeet/Code/intro-to-node/calculadora.js"`**
2. **Buffer Paths:**
   Apesar de strings serem a maneira mais comum de representar paths, o Node.js também te permite usar objetos **`Buffer`** para representar paths. Um **`Buffer`** é uma estrutura de dados de baixo nível que pode armazenar dados binários. Na realidade, usar objetos **`Buffer`** para paths é pouco comum. Leia sobre [Buffers](#buffers) aqui.
3. **URL Paths:**
   Com o módulo **`URL`** do Node.js, você também pode representar paths de arquivo usando URLs. Precisa ser a URL do esquema de arquivos.
   Exemplo de URL Paths:

```jsx
const url_path = new URL("file:///home/user/projects/calculadora.js");
```

### O argumento `flag`

O argumento `flag` indica o modo (não confundir com o argumento `mode`) no qual você deseja abrir o arquivo. Aqui estão os valores suportados como argumento `flag` -

- `'a'`: Abre o arquivo para anexar dados. O arquivo é criado se não existir.
- `'ax'`: Funciona como a flag `'a'`, mas falha se o path existir.
- `'a+'`: Abre o arquivo para leitura e para anexar dados. O arquivo é criado se não existir.
- `'ax+'`: Funciona como a flag `'a+'`, mas falha se o path existir.
- `'as'`: Abre o arquivo para anexar dados de modo síncrono. O arquivo é criado se não existir.
- `'as+'`: Abre o arquivo para leitura e para anexar dados de modo síncrono. O arquivo é criado se não existir.
- `'r'`: Abre o arquivo para leitura. Uma exceção acontece se o arquivo não existir.
- `'rs'`: Abre o arquivo para leitura em modo síncrono. Uma exceção acontece se o arquivo não existir.
- `'r+'`: Abre o arquivo para leitura e gravação. Uma exceção acontece se o arquivo não existir.
- `'rs+'`: Abre o arquivo para leitura e gravação em modo síncrono. Instrui o sistema operacional a ignorar o cache do sistema de arquivos local.
- `'w'`: Abre o arquivo para gravação. O arquivo é criado (se não existir) ou truncado (se existir).
- `'wx'`: Funciona como a flag `'w'`, mas falha se o path existir.
- `'w+'`: Abre o arquivo para leitura e gravação. O arquivo é criado (se não existir) ou truncado (se existir).
- `'wx+'`: Funciona como a flag `'w+'`, mas falha se o path existir.

> Você não precisa lembrar de todos esses argumentos, mas pode ser útil para escrever APIs consistentes e garantir que nenhum comportamento não definido ocorra.

Vamos utilizar o `wx+` para demonstrar um pequeno exemplo. O `wx+` vai abrir um arquivo para leitura e gravação, mas falha em abrir o arquivo se ele já existir. Se o arquivo não existir, ele será criado e tudo funcionará corretamente.

```jsx
// files.js
const file_handle = await fs.open(
    "calculadora.js",
    "wx+",
    fs.constants.O_RDONLY
  );

// Saída
node:internal/process/promises:288
            triggerUncaughtException(err, true /* fromPromise */);
            ^

[Error: EEXIST: file already exists, open 'calculadora.js'] {
  errno: -17,
  code: 'EEXIST',
  syscall: 'open',
  path: 'calculadora.js'
}
```

Especificar o argumento `flag` é uma boa prática.

### O argumento `mode`

O argumento `mode` especifica as permissões definidas para o arquivo quando ele é criado. Os argumentos `mode` são sempre interpretados **em octal.**
Por exemplo:

- **`0o400`** (apenas leitura para o proprietário)
- **`0o600`** (leitura e gravação para o proprietário)
- **`0o644`** (leitura para todos, gravação apenas para o proprietário)

Você não precisa se lembrar da representação octal. Simplesmente utilize `fs.constants.seu_modo` para acessá-lo.

No nosso caso, as permissões estão especificadas como `fs.constants.O_RDONLY`. Aqui está uma lista de `modes` disponíveis para uso. Repare que o prefixo `O_` é uma abreviação para `Open`. Esse prefixo nos diz que isso só vai funcionar quando utilizado com `fs.open()`.

**Modes para usar com `fs.open()`**

```jsx
/** Modo que indica a abertura de um arquivo somente para leitura. */
const O_RDONLY: number;

/** Modo que indica a abertura de um arquivo somente para gravação. */
const O_WRONLY: number;

/** Modo que indica a abertura de um arquivo para leitura e gravação. */
const O_RDWR: number;

/** Modo que indica a criação de um arquivo se ele não existir. */
const O_CREAT: number;

/** Modo indicando que a abertura de um arquivo deve falhar se o mode O_CREAT estiver definido e o arquivo já existir. */
const O_EXCL: number;

/** Modo indicando que se o arquivo existir e for um arquivo normal, e o arquivo for aberto com sucesso para gravação, seu comprimento deverá ser truncado para zero. */
const O_TRUNC: number;

/** Modo indicando que dados serão adicionados ao final do arquivo. */
const O_APPEND: number;

/** Modo indicando que a abertura deve falhar se o path não for um diretório. */
const O_DIRECTORY: number;

/** Modo indicando que a abertura deve falhar se o path não for um link simbólico. */
const O_NOFOLLOW: number;

/** Modo indicando que o arquivo está aberto para entrada e saída (I/O) síncrona. */
const O_SYNC: number;

/** Modo indicando que o arquivo está aberto para entrada e saída (I/O) síncrona com operações de gravação aguardando a integridade dos dados. */
const O_DSYNC: number;

/** Modo indicando para abrir o próprio link simbólico ao invés do recurso para o qual está apontando. */
const O_SYMLINK: number;

/** Quando definido, será feita uma tentativa de minimizar os efeitos de cache da entrada e saída do arquivo. */
const O_DIRECT: number;

/** Modo que indica a abertura do arquivo em modo não bloqueante quando possível. */
const O_NONBLOCK: number;
```

Retornando ao código que escrevemos no módulo `files`

```jsx
// files.js
const fs = require("node:fs/promises");

async function open_file() {
    const file_handle = await fs.open("calculadora.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle);
}

module.exports = open_file;
```

O tipo de retorno de `fs.open()` é um `FileHandle`. Um file handle (manipulador de arquivos) é como uma conexão entre uma aplicação e o arquivo no dispositivo de armazenamento. Ele permite que a aplicação trabalhe com arquivos sem se preocupar com os detalhes técnicos de como os arquivos são armazenados no dispositivo.

Nós discutimos sobre **descritores de arquivo** anteriormente. Você pode checar qual descritor de arquivo está atribuído a um arquivo aberto.

```jsx
// files.js

..

async function open_file() {
    const file_handle = await fs.open("calculadora.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle.fd); // Imprime o valor do descritor de arquivo `fd` (file descriptor)
}

..

// Saída -> 20
```

Você deve obter o mesmo valor como descritor de arquivo se tentar rodar o programa várias vezes. Mas se você tentar criar outro file handle, ele deverá ter um descritor de arquivo diferente

```jsx
// files.js

..

async function open_file() {
    const file_handle     = await fs.open("calculadora.js", "r", fs.constants.O_RDONLY);
    const file_handle_two = await fs.open("calculadora.js", "r", fs.constants.O_RDONLY);
    console.log(file_handle.fd);
    console.log(file_handle_two.fd);
}

..

// Saída ->
20
21
```

> Note que se um `FileHandle` não for fechado utilizando o método `file_handle.close()`, ele tentará fechar o descritor de arquivo automaticamente e emitir um alerta do processo, ajudando a previnir vazamento de memória. É sempre uma boa prática chamar o método `file_handle.close()` para fechá-lo explicitamente. No entanto, no nosso caso, o programa só existe depois da função `open_file` ser executada, então isso não importa.

Uma coisa importante a ser notada é: a abertura (`open`) de um arquivo pode falhar e exibir uma exceção.

O `fs.open()` pode exibir erros em vários cenários, incluindo:

- `EACCES`: O acesso ao arquivo foi negado ou faltam permissões, ou o arquivo não existe e o diretório pai não é gravável.
- `EBADF`: O descritor de arquivo do diretório é inválido.
- `EBUSY`: O arquivo é um dispositivo de bloco em uso ou montado.
- `EDQUOT`: A cota de disco do usuário foi excedida ao criar o arquivo.
- `EEXIST`: O arquivo já existe ao tentar criá-lo exclusivamente.
- `EFAULT`: O path está fora da memória acessível
- `EFBIG` / `EOVERFLOW`: O arquivo é muito grande para abrir.
- `EINTR`: A abertura de um dispositivo lento é interrompida por um sinal.
- `EINVAL`: Modos inválidos ou operações não suportadas.
- `EISDIR`: Tentativa de gravar em um diretório ou de usar o `O_TMPFILE` em uma versão não suportada.
- `ELOOP`: Muitos links simbólicos encontrados.
- `EMFILE`: O processo atingiu o seu limite de abertura de descritores de arquivos.
- `ENAMETOOLONG`: O nome do path é muito longo.
- `ENFILE`: O limite de arquivos abertos no sistema foi atingido.
- `ENOENT`: O arquivo ou componente no path não existe.
- `ENOMEM`: Memória insuficiente para o buffer FIFO ou memória do kernel.
- `ENOSPC`: Não há mais espaço no dispositivo.
- `ENOTDIR`: O componente no path não é um diretório.
- `ENXIO`: O arquivo não corresponde ao dispositivo, socket ou FIFO.
- `EOPNOTSUPP`: O sistema de arquivos não suporta o `O_TMPFILE`.
- `EROFS`: O arquivo está em um sistema de arquivos somente leitura.
- `ETXTBSY`: O arquivo está sendo executado, usado como swap ou sendo lido pelo kernel.
- `EPERM`: Operação impedida por selo de arquivo ou privilégios incompatíveis.
- `EWOULDBLOCK`: `O_NONBLOCK` especificado, concessão incompatível mantida no arquivo.

Certifique-se de tratar os erros de maneira elegante. Haverá casos nos quais você não precisará tratar erros e vai querer que o programa falhe, feche ou exiba um erro ao usuário. Por exemplo, se você está escrevendo uma aplicação de linha de comando que comprime imagens utilizando o caminho `path/to/image` como argumento, você vai querer que o programa falhe para informar ao usuário que há um problema com o arquivo/caminho fornecido.

Para capturar erros, envelope o código com um bloco `try/catch`

```jsx
// files.js

..

async function open_file() {
  try {
    const file_handle = await fs.open("config", "r", fs.constants.O_WRONLY);
        // faz alguma coisa com o `file_handle`
  } catch (err) {
    // faz alguma coisa com o objeto `err`
  }
}

..
```

## Lendo de um arquivo

Já vimos muito teoria. Vamos trabalhar em um exemplo real agora. Tentaremos ler de um arquivo. Vamos criar um arquivo `log_config.json` dentro da pasta `config`. A estrutura do diretório vai ficar mais ou menos assim (se livre do módulo `calculadora`)

```
.
├── config
│   └── log_config.json
├── files.js
└── index.js
```

Adicione o seguinte conteúdo no arquivo `log_config.json`

```jsx
// log_config.json

{
  "log_prefix": "[LOG]: "
}
```

O Node.js fornece muitos métodos úteis para ler de um arquivo específico utilizando o `file_handle`. Há diferentes maneiras de lidar com as interações com os arquivos dos módulos `node:fs` e `node:fs/promises`. Mas no momento vamos utilizar um `file_handle` especificamente.

```jsx
// files.js

const fs = require("node:fs/promises");

// Essa função abre um arquivo de maneira assíncrona, lê ele linha por linha
// e registra cada linha no console.
async function read_file() {
    try {
        // abre o arquivo em modo somente leitura.
        const file_handle = await fs.open("./index.js", "r", fs.constants.O_RDONLY);

        // cria uma stream para ler as linhas do arquivo.
        let stream = file_handle.readLines({
            // começa a ler do início do arquivo.
            start: 0,

            // lê até o fim do arquivo.
            end: Infinity,

            // especifica a codificação como utf8, caso contrário,
            // a stream vai emitir objetos buffer em vez de strings.
            encoding: "utf8",

            /**
             * Se o autoClose for false, então o descritor de arquivo não será fechado,
             * mesmo se houver um erro. É responsabilidade da aplicação fechá-lo e
             * certificar-se de que não há vazamento de descritores de arquivo.
             * Se o autoClose for true (comportamento padrão), com um 'error' ou
             * com um 'end', o descritor de arquivo será fechado automaticamente.
             */
            autoClose: true,

            /**
             * Se emitClose for true, então o evento `close` será emitido 
             * depois que a leitura for finalizada. O comportamento padrão é true.
             */
            emitClose: true,
        });

        // O evento close é emitido quando um file_handle é fechado
        // e não pode mais ser usado.
        stream.on("close", () => {
            console.log("File handle %d closed", file_handle.fd);
        });

        // O evento 'line' é disparado sempre que uma linha é lida do arquivo.
        stream.on("line", (line) => {
            console.log("Getting line -> %s", line);
        });
    } catch (err) {
        console.error("Error occurred while reading file: %o", err);
    }
}

module.exports = read_file;
```

Vai gerar a saída

```
Getting line -> const open_file = require("./files");
Getting line ->
Getting line -> open_file();
File handle 20 closed
```

O código acima tem uma função chamada `read_file` que faz três coisas: abrir um arquivo, ler cada linha e mostrar cada linha no console.

Essa função usa o módulo `fs`. Ela abre um arquivo no modo somente leitura e cria uma stream para lê-lo. A função só pode ler alguma linha usando as opções `start` e `end`. A função também precisa saber quais são os caracteres do arquivo utilizando a opção `encoding`.

Essa função também define duas opções para manipular o descritor de arquivo automaticamente quando a leitura é finalizada. Finalmente, a função cria dois escutadores (listeners) para lidar com dois eventos: `close` e `line`. O evento `close` diz à função que o file handler foi fechado. O evento `line` diz à função que uma linha do arquivo foi lida.

Se houver um erro durante a leitura do arquivo, a função exibirá uma mensagem de erro no console.

Uma coisa a ser notada é que nós usamos a string substitution (substituição de strings) `%s` em vez de um template literals. Ao passar uma string para um dos métodos do objeto `console` que aceita uma string, você pode usar essas strings substitutas:

- `%o` ou `%O`: Exibe um objeto JavaScript. Clicar sobre o nome do objeto no inspetor (navegador), exibe mais informações sobre ele.
- `%d`: Exibe um inteiro. Formatação de números suportada. Por exemplo, `console.log("Exemplo %d", 1)` vai exibir o número como um número (manterá o valor do ponto flutuante).
- `%i`: Exibe um inteiro. Formatação de números suportada. Por exemplo, `console.log("Exemplo %i", 1.1)` vai exibir o número como um inteiro (vai truncar o valor do ponto flutuante).
- `%s`: Exibe uma string.
- `%f`: Exibe um valor flutuante. Formatação suportada. Por exemplo, `console.log("Exemplo %f", 1.1)` vai exibir "Exemplo 1.1".

> Utilizar `%o` ao exibir a saída no terminal, simplesmente imprime o objeto inteiro como uma string, isso é uma vantagem que as strings substitution possuem em comparação aos template literals.

Podemos simplificar o código acima. Eu incluí todas as chaves opcionais possíveis anteriormente apenas para mostrar que elas existem, e que você pode usá-las se quiser ter mais controle sobre o que está fazendo.

A versão simplificada fica assim

```jsx
// files.js

...

async function read_file() {
  try {
    const file_handle = await fs.open("./index.js");
    const stream = file_handle.readLines();

    // chegaremos nesta sintaxe daqui a pouco
    for await (const line of stream) {
      console.log("Reading line of length %d -> %s", line.length, line);
    }
  } catch (err) {
    console.error("Error occurred while reading file: %o", err);
  }
}

...
```

Vai gerar a seguinte saída

```
Reading line of length 59 -> const { read_entire_file, read_file } = require("./files");
Reading line of length 0 ->
Reading line of length 12 -> read_file();
```

Repare que nos livramos de todas aquelas opções, já que elas já estão definidas como o valor padrão por conveniência. Apenas especifique-as se quiser alterar o valor para outro que não seja o padrão.

## Uma pequena cartilha para o `for..of` e o `for await..of` no javascript

### `for..of`

O loop **`for..of`** é um recurso do JavaScript que fornece uma maneira fácil e direta de percorrer os elementos em um array, string ou outro objeto [iterável](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). Ele torna a iteração através de cada item mais simples, sem precisar controlar uma variável de índice ou de comprimento do array manualmente.

Vamos dar uma olhada na sintaxe:

```js
for (const element of iterable) {
  // Código que será executado para cada elemento
}
```

Aqui está uma visão geral de como o loop **`for..of`** funciona:

1. **`for`**: Essa é a palavra-chave que indica o início da estrutura de repetição (loop).
2. **`element`**: Essa é a variável que você define para representar o elemento atual de cada iteração do loop. A cada iteração, a variável **`element`** vai conter o valor do elemento atual do iterável.
3. **`of`**: Essa é uma palavra-chave que representa a relação entre a variável **`element`** e o **`iterável`** pelo qual você está percorrendo.
4. **`iterable`**: É uma coleção ou objeto pelo qual você quer percorrer. Pode ser um array, uma string, um set, um map ou qualquer outro objeto que possui uma coleção de itens.

Aqui está um exemplo de como usar o **`for..of`** para percorrer um array:

```jsx
const frutas = ['maçã', 'banana', 'laranja', 'uva'];

for (const fruta of frutas) {
  console.log(fruta);
}
```

O loop vai iterar através de cada elemento do array **`frutas`**, e a cada iteração, a variável **`fruta`** vai conter o valor da fruta atual. Saída do loop:

```
maçã
banana
laranja
uva
```

O loop **`for..of`** é particularmente útil quando você não precisa acessar o índice dos elementos diretamente. Ele fornece uma maneira mais limpa e concisa de trabalhar com objetos iteráveis.

Repare que o loop **`for..of`** não pode ser usado para iterar diretamente através das propriedades de um objeto. Foi feito especificamente para iteração através de valores em coleções iteráveis. Se você precisa percorrer através das propriedades de um objeto, o tradicional loop **`for..in`** ou usar **`Object.keys()`**, **`Object.values()`** ou **`Object.entries()`**, seria mais apropriado.

### `for await..of`

O loop **`for await..of`** é uma extensão do loop **`for..of`**. Ele é utilizado para operações assíncronas e iteráveis. Ele pode iterar através de objetos iteráveis assíncronos como aqueles retornados por [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) assíncronos ou promises. O loop é útil quando estamos lidando com operações assíncronas como buscar dados de APIs ou ler de streams, assim como fizemos acima!

Aqui está como o loop **`for await..of`** funciona:

```jsx
for await (const element of async_iterable) {
  // Código assíncrono a ser executado para cada elemento
}
```

Vamos analisar os componentes chave:

1. **`for await`**: Essas palavras-chave iniciam a estrutura de loop assíncrona.
2. **`element`**: Essa variável representa o elemento atual do iterável assíncrono em cada loop da iteração.
3. **`async_iterable`**: Esse é um objeto iterável assíncrono, como um generator assíncrono, uma promise que resulta em um iterável ou qualquer outro objeto que implementa o [protocolo de iteração](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) assíncrona.

Aqui está um exemplo do uso do loop **`for await..of`** para percorrer através de um iterável assíncrono:

```jsx
async function fetch_frutas() {
  const frutas = ['maçã', 'banana', 'laranja', 'uva'];

  for await (const fruta of frutas) {
    console.log(fruta);

    // simulação de uma operação assíncrona fictícia
    await new Promise(resolve => setTimeout(resolve, 1000)); 
  }
}

fetch_frutas();
```

Aqui, a função **`fetchFrutas`** usa o loop **`for await..of`** para iterar através do array frutas de maneira assíncrona. Para cada fruta, ele imprime o nome da fruta e então simula uma operação assíncrona usando o **`setTimeout`** para pausar por um segundo.

O loop **`for await..of`** é uma ferramenta útil quando estamos trabalhando com operações assíncronas. Ele nos permite percorrer através dos resultados de promises ou de generators assíncronos de uma maneira mais legível e intuitiva. Ele garante que as operações assíncronas dentro do loop sejam executadas sequencialmente, uma depois da outra, mesmo que elas possuam tempos de conclusão variados.

## Lendo o arquivo `json`

No entanto, ler um arquivo json linha por linha não é a melhor maneira. O `readLine` é uma maneira com muita eficiência de memória para ler arquivos. Ela não carrega todo o conteúdo do arquivo na memória, o que é normalmente o que queremos. Mas se o arquivo é pequeno, e você sabe de antemão que ele não é muito grande, é normalmente mais rápido e performático carregar o arquivo inteiro de uma vez na memória.

> Se você está lidando com arquivos grandes, é normalmente melhor usar uma versão em buffer, como `createReadStream()` ou `readLines()`

Vamos atualizar o código

```jsx
...

async function read_file() {
  try {
    const file_handle = await fs.open("./config/log_config.json");
    const stream = await file_handle.readFile();

    console.log("[File contents] ->\n %s", stream);
  } catch (err) {
    console.error("Error occurred while reading file: %o", err);
  }
}

...
```

Saída

```jsx
[File contents] ->
 {
  "log_prefix": "[LOG]: "
}
```

Legal. Mas o que acontece se a gente não usar a string substitution `%s`?

```jsx
console.log("[File contents] ->\n", stream);
```

Estranhamente, vai exibir um conteúdo meio esquisito

```
[File contents] ->
 <Buffer 7b 0a 20 20 22 6c 6f 67 5f 70 72 65 66 69 78 22 3a 20 22 5b 4c 4f 47 5d 3a 20 22 0a 7d 0a>
```

Por que isso é assim e o que é um `Buffer`? Esse é um dos tópicos menos visitados da programação. Vamos parar um minuto para entender.

# Buffers

Objetos `Buffer` são utilizados para representar uma sequência de tamanho fixo de bytes na memória. Objetos **`Buffer`** possuem mais eficiência de memória do que strings JavaScript ao lidar com dados, especialmente conjuntos de dados muito grandes. Isso é porque strings são codificadas em UTF-16 no JavaScript, o que pode levar a um maior consumo de memória para certos tipos de dados.

Pergunta: Mas por que o método `readLines()` retornou strings se não é "eficiente"?

O que acontece, é que na verdade o método usa buffers internamente para ler e processar dados de arquivos ou streams de maneira eficiente. O `readLines()` é uma variação especial do `createReadStream()`, que é feito para fornecer uma interface conveniente para trabalhar com linhas de conteúdo de texto, tornando a interação com dados mais fácil para desenvolvedores, sem a necessidade de lidar diretamente com operações de buffer de baixo nível.

Então, o que você está vendo ao olhar para o valor do buffer é apenas uma representação crua de dados binários no **_formato hexadecimal_**. Esses dados crus podem não fazer muito sentido para nós humanos porque não está em um formato legível como texto.

Para imprimir o arquivo json no console, temos 3 formas.

**Primeiro método**

```jsx
console.log("[File contents] ->\n", stream.toString("utf-8"));
```

**Segundo método**

Usando string substitution novamente

```jsx
console.log("[File contents] ->\n %s", stream);
```

O segundo método é muito mais amigável. Ele automaticamente serializa o conteúdo binário em uma string. Mas, para usar e manipular conteúdos de string, vamos precisar retornar ao primeiro método.

**Terceiro método**

Defina a opção `encoding` para `utf-8`

```jsx
const stream = await file_handle.readFile({ encoding: "utf-8" });
console.log("[File contents] ->\n", stream);
```

### Analisando o arquivo `json`

Para ler a propriedade `log_prefix` que especificamos dentro do arquivo `config/log_config.json`, vamos analisar o conteúdo do arquivo.

> Muitas pessoas usam a forma `require('file.json')`, mas há sérias desvantagens nela. Primeira, o arquivo inteiro é carregado na memória quando seu programa encontra a declaração de require. Segunda, se você atualizar o arquivo json durante a execução, o programa ainda vai fazer referência aos dados antigos. A utilização de `require()` é recomendada somente quando você espera que não haverá mudanças no arquivo e ele não for excessivamente grande; caso contrário, ele vai sempre permanecer na memória.

```jsx
// files.js

...

const stream = await (await fs.open("./config/log_config.json")).readFile();
const config = JSON.parse(stream);

console.log('Log prefix is: "%s"', config.log_prefix);

...

// Saída ->
// Log prefix is: "[LOG]: "
```

Isso parece bom, mas não é uma boa prática especificar paths dessa maneira. Usar **`"./config/log_config.json"`** assume que o diretório **`config`** está localizado no mesmo diretório de trabalho atual do terminal. Esse pode nem sempre ser o caso, especialmente se o seu script está sendo executado de um diretório de trabalho diferente, como da pasta config. Para testar esse comportamento, se mova usando o comando `cd config` e execute com o comando `node ../index.js`.

```jsx
Error occurred while reading file: [Error: ENOENT: no such file or directory, open './config/log_config.json'] {
  [stack]: "Error: ENOENT: no such file or directory, open './config/log_config.json'",
  [message]: "ENOENT: no such file or directory, open './config/log_config.json'",
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: './config/log_config.json'
}
```

Desse jeito, o esperado é que o path seja relativo ao diretório atual, mas não é o que nós esperamos. Deveríamos ser capazes de executar o nosso script de qualquer lugar, não importa em qual diretório estamos no momento. Isso é muito útil para projetos grandes contendo pastas com múltiplos níveis de profundidade.

Atualize o código para incluir o módulo `path` no escopo

```jsx
// files.js

const path = require('path');

...

const log_path = path.join(__dirname , 'config' , 'log_config.json');
const stream = await (await fs.open(log_path)).readFile();

...
```

Usar o **`__dirname`** e o módulo **`path`** garante que você está referenciando o caminho correto independente do diretório de trabalho no qual você está.

`__dirname` é uma variável especial (module-level) que representa o caminho absoluto do diretório contendo o arquivo JavaScript em questão. Não é mágico?

O método `path.join()` junta todos os segmentos de `path` fornecidos utilizando o **separador específico da plataforma** como um delimitador, retornando o caminho normalizado. Segmentos de `path` com comprimento zero são ignorados. Se a string do path já reunida for uma string de comprimento zero, então `'.'` será retornado, representando o diretório de trabalho atual.

O código completo do arquivo `files.js` ficou assim agora

```jsx
const fs = require("node:fs/promises");
const path = require("path");
async function read_file() {
    try {
        const log_path = path.join(__dirname, "config", "log_config.json");
        const stream = await (await fs.open(log_path)).readFile();
        const config = JSON.parse(stream);

        console.log('Log prefix is: "%s"', config.log_prefix);
    } catch (err) {
        console.error("Error occurred while reading file: %o", err);
    }
}
```

Agora você pode rodar o código de qualquer diretório, não importa o quão profundamente aninhado ele está, vai funcionar corretamente a menos que você mova o arquivo `files.js` para um local diferente.

[![Read Next](/assets/imgs/next.png)](/chapters/ch04-logtar-our-logging-library.md)

![](https://uddrapi.com/api/img?page=ch03)
