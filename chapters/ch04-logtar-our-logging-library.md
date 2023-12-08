[![Read Prev](/assets/imgs/prev.png)](/chapters/ch03-working-with-files.md)

# [`logtar`](https://github.com/ishtms/logtar) nossa própria biblioteca de logs

> Nota: Todo código que escrevermos aqui pode ser encontrado [no diretório code/chapter_04.0](/code/chapter_04.0). Será um único arquivo e vamos refatorá-lo nos capítulos seguintes.

O logging, ato de registrar logs (registros), é uma parte importante na criação de uma aplicação robusta e escalável. Ajuda desenvolvedores a encontrar e solucionar problemas, monitorar o funcionamento da aplicação e o que os usuários estão fazendo.

## Iniciando um novo projeto

Vamos criar um novo projeto. Feche o seu diretório de trabalho atual ou se livre dele.

```bash
# Cria um novo diretório e usa `cd` para se mover até ele
mkdir logtar && cd logtar

# Inicializa um novo pacote
npm init -y
```

Isso cria um novo pacote/projeto do npm, um arquivo `package.json` e define algumas configurações básicas dentro dele. Esse deve ser o conteúdo do seu `package.json`

```jsx
{
  "name": "logtar",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Vamos mudar a versão de `1.0.0` para `0.0.1`.

## Um pouco sobre o `SemVer`

Começar o versionamento pelo **`0.0.1`** é uma boa prática no desenvolvimento de software, pois os números de versões possuem significado semântico. Usar **`0.0.1`** como versão inicial, indica que o software está no seu estágio inicial de desenvolvimento ou que está passando por mudanças e melhorias rápidas. Essa convenção está alinhada com a Semantic Versioning ([SemVer](https://semver.org/)), que é um esquema de versionamento amplamente adotado, que ajuda desenvolvedores a entender a compatibilidade e relevância das mudanças a cada release do software.

Começar com **`0.0.1`** é particularmente benéfico por algumas razões:

1. **Clareza do Estágio de Desenvolvimento**: Começar com **`0.0.1`** claramente comunica que o software está em seu estágio inicial de desenvolvimento. Isso ajuda que desenvolvedores e outros usuários entendam que a API e outros recursos podem mudar rapidamente ou não serem estáveis ainda.
2. **Versionamento Semântico**: O Versionamento Semântico (Semantic Versioning) consiste de 3 números separados por pontos: **`MAJOR.MINOR.PATCH`**. Começar com **`0.0.1`** indica que você está no processo de fazer patchs menores e mudanças significativas em potencial conforme o software é desenvolvido.
3. **Progresso Incremental**: Começar com **`0.0.1`** permite uma sequência limpa de versões incrementais com o progresso do desenvolvimento. Cada release pode seguir as regras do [SemVer](https://semver.org/): Acrescentando versões **`MAJOR`** para mudanças incompatíveis com versões anteriores, versões **`MINOR`** para adições que mantém a compatibilidade e versões **`PATCH`** para correções de bug mantendo a compatibilidade.
4. **Expectativa do Usuário**: Quando usuários ou outros desenvolvedores encontram um software com uma versão que começa com **`0.0.1`**, eles vão entender que o software pode não estar com os recursos completos ou inteiramente estável. Isso ajuda a gerenciar a expectativa e diminuir a confusão.
5. **Prevenindo Confusão**: Se você começou com a versão **`1.0.0`**, deve haver uma expectativa de estabilidade e riqueza de recursos que pode levar a confusão se o software na verdade está em um estágio inicial de desenvolvimento.

## Criando uma classe `LogLevel`

O Log level (nível de registro) é um conceito básico das bibliotecas de logging. Ele ajuda a controlar a quantidade de detalhes que as mensagens de log de uma aplicação exibem. Desenvolvedores usam log levels para filtrar e gerenciar saídas. Isso é especialmente útil quando estamos debugando problemas ou lidando com sistemas complexos.

Normalmente as bibliotecas de logging possuem estes 5 log levels (do menos para o mais grave):

1. **Debug**: Informação detalhada de debug. Normalmente não utilizado em ambientes de produção porque gera muitos dados.
2. **Info**: Mensagens informativas sobre o fluxo regular da aplicação. Exibe o que a aplicação está fazendo.
3. **Warning**: Indica potenciais problemas que podem precisar de atenção. Alertas sugerindo que alguma coisa pode estar errada.
4. **Error**: Reportes de erro ou condições excepcionais que precisam ser resolvidas. Essas mensagens indicam que alguma coisa deu errado e pode estar afetando a funcionalidade da aplicação.
5. **Critical/Fatal**: Para erros graves que podem quebrar a aplicação ou causar um grande mal funcionamento. Essas mensagens precisam de atenção imediata, já que indicam falhas críticas.

> Eu prefiro usar `Class` em vez de funções ou objetos para fornecer uma melhor API. É um sistema potente no JavaScript e eu acho superior as factory functions. A `Class` tem algumas desvantagens, mas para o nosso caso de uso, elas são a melhor solução possível. Se você não está a par de como as classes funcionam no javascript, [vá direto para esta](https://github.com/ishtms/learn-javascript-easy-way/blob/master/chapters/14_classes.js) e para [esta página](https://github.com/ishtms/learn-javascript-easy-way/blob/master/chapters/15_inheritance_classes.js) em minha outra fonte de aprendizado javascript.

Ao construir um sistema complexo ou antecipar escalabilidade, é melhor começar de maneira simples e refatorar quando necessário. Você não precisa começar usando as melhores práticas desde o primeiro dia.

O processo deve ser: escreva código, faça funcionar, teste, e então refatore.

Vamos criar um novo arquivo `index.js` dentro do diretório `logtar` e adicionar uma nova classe `LogLevel`

```jsx
// index.js

class LogLevel {
    static Debug = 0;
    static Info = 1;
    static Warn = 2;
    static Error = 3;
    static Critical = 4;
}

module.exports = {
    LogLevel,
};
```

Você deve estar pensando sobre o uso de uma classe `LogLevel` em vez de um objeto ou talvez de algumas constantes que poderiam ser exportadas facilmente, desse jeito -

```jsx
module.exports.LogLevel = {
    Debug: 0
    ...
}

// or

module.exports.Debug = 0
...
```

Você poderia fazer algo desse tipo também e estaria totalmente ok. Mas em vez disso, eu escolho um método diferente, como usar uma classe utilitária `LogLevel` que encapsula todos os log levels dentro de uma classe, isso cria um namespace limpo para essas constantes. Ajuda a evitar potenciais conflitos de nomes com outras variáveis ou constantes na sua aplicação. Há mais coisa além disso!

Você verá outro recurso potente por usar este método, um pouco mais adiante.

Vamos adicionar um método auxiliar para nossa classe `LogLevel`, que verifica se o `LogLevel` fornecido pelo nosso cliente (usuário da nossa biblioteca) é correto e suportado.

```jsx
// index.js

class LogLevel {
    ...

    static assert(log_level) {
       if (
            log_level !== LogLevel.Debug ||
            log_level !== LogLevel.Info ||
            log_level !== LogLevel.Warn ||
            log_level !== LogLevel.Error ||
            log_level !== LogLevel.Critical
        ) {
            throw new Error(
            `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`);
        }
     }
}
```

O que esse método `assert` vai fazer? O `assert` será um método utilizado dentro da nossa biblioteca, que vai verificar se o valor do tipo `LogLevel` fornecido como argumento é válido e suportado.

No entanto, podemos refatorar o código acima para parecer mais legível e menos repetitivo.

```jsx
// index.js

static assert(log_level) {
    if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Critical].includes(log_level)) {
        throw new Error(`log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`);
    }
 }
```

Dessa forma, se a gente quiser acrescentar mais log levels, podemos simplesmente adicioná-los ao array. Esse é mais um poderoso caso de uso ao utilizar classes em vez de objetos. Tudo tem seu próprio namespace. Mesmo sem o typescript, podemos informar ao cliente (alguém que usa nossa biblioteca) quais argumentos são esperados. Se eles falharem em fornecer um argumento válido, nosso método `assert` vai exibir um erro.

Além disso, mesmo se o usuário não estiver a par dos valores que estamos usando para cada log level, isso não importa desde que estejam usando a sintaxe `LogLevel.qualquer_level`. Se no futuro modificarmos o interior da biblioteca, desde que a API pública seja consistente, todos ficarão bem. Isso é um ponto chave na construção de APIs confiáveis.

> Vou usar os termos `cliente` e `usuário` de forma alternada. Um `cliente` é alguém que usa a API da nossa biblioteca.

O `LogLevel` parece bom por agora. Vamos introduzir uma nova classe `Logger` (registrador), que será a espinha dorsal da nossa biblioteca de logging.

## A classe `Logger`

```jsx
// index.js

class LogLevel {...}

class Logger {
    /* Define o valor padrão de `level` como `LogLevel.Debug` para
     * toda nova instância da classe `Logger`
     */
    level = LogLevel.Debug;

    // Define o log level para qualquer um passado pelo usuário através de `new Logger()`
    constructor(log_level) {
      this.level = log_level;
    }
}
```

Há um problema. O usuário pode construir o `Logger` com qualquer valor que ele queira. Podem ser valores sem utilidade como `100000` ou `“Hello”` e isso não é o que esperamos.

Por exemplo

```jsx
// não faz sentido
const my_logger = new Logger("test");
```

Vamos fazer uso do método estático `LogLevel.assert()` que acabamos de definir.

```jsx
// index.js

class LogLevel {...}

class Logger {
    level = LogLevel.Debug;

    constructor(log_level) {
        // Exibe um erro se o `log_level` for um valor não suportado.
        LogLevel.assert(log_level);
        this.level = log_level;
    }
}
```

Agora, se tentarmos passar um argumento inválido na construção de um `Logger`, vamos obter um erro. Exatamente o que queremos

```jsx
const logger = new Logger(6);

// saída
Error: log_level must be an instance of LogLevel. Unsupported param "6"
    at LogLevel.assert (/Users/ishtmeet/Code/logtar/index.js:10:13)
    at new __Logger (/Users/ishtmeet/Code/logtar/index.js:86:14)
    at Object.<anonymous> (/Users/ishtmeet/Code/logtar/index.js:91:16)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47
```

Tudo parece ótimo! Não, ainda não. E se tentarmos fazer isso?

```jsx
const logger = new Logger(LogLevel.Error);
logger.level = 1000;
```

Novamente, isso quebra toda funcionalidade da nossa biblioteca. Como previnimos isso? Parece que o Javascript nos resguardou.

### Encapsulamento com campos `privados`

Campos de classe são públicos por padrão, o que significa que qualquer um pode mudá-los de qualquer lugar do código. Até mesmo os clientes da nossa biblioteca podem mudar isso também. Mas, é possível criar recursos de classes privadas adicionando uma hash `#` de prefixo. O JavaScript impõe o encapsulamento privado desses recursos da classe.

Antes dessa sintaxe existir, membros privados não faziam parte da linguagem. Na herança de protótipos, o comportamento deles pode ser emulado através de objetos `WeakMap` ou closures. Mas usar a sintaxe `#` é mais ergonômico que esses métodos.

> `membros` de uma classe significa qualquer coisa que está definida dentro do bloco da `classe`. Isso inclui variáveis, variáveis estáticas ou até mesmo métodos. Note que se uma função é definida dentro de uma classe, ela passa a ser chamada de `método` e não de `função`.

Vamos atualizar o código acima incorporando o `encapsulamento`.

```javascript
// index.js

class LogLevel {...}

class Logger {
    // introduz uma nova variável privada `#level`
    #level;

    constructor(log_level) {
        // você se refere a variáveis privadas utilizando o prefixo `#`
        this.#level = log_level;
    }
}

const logger = new Logger(LogLevel.Debug);
console.log(logger.#level); // Error: Private field '#level' must be declared in an enclosing class
logger.#level = LogLevel.Info; // Error: Private field '#level' must be declared in an enclosing class
```

Está parecendo bom. Podemos nos referir à variável membro `#level` somente dentro da classe. Ninguém pode alterá-la. Mas precisamos oferecer uma maneira de saber o log level atual do nosso logger. Vamos adicionar um método `getter`.

```js
// index.js

class LogLevel {...}

class Logger {
    ...

    get level() {
        return this.#level;
    }
}

const logger = new Logger(LogLevel.Debug);
console.log(logger.#level); // Error: Private field '#level' must be declared in an enclosing class
console.log(logger.level); // Bom. Chama o método `get level()`
```

> Nota: Se você criar um getter usando `get()`, você não precisa especificar o parênteses após o `level`. O Javascript sabe que estamos nos referindo ao getter `get level()`.

Agora, adicione o método `LogLevel.assert` dentro do constructor, para ter certeza que os clientes vão passar um valor correto para o parâmetro `log_level` do constructor.

```js
// index.js
class Logger {
    ..
    constructor(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
    }
    ..
}

const logger = new Logger(100); // Exibe um erro
const logger  = new Logger(3); // Bom
const logger = new Logger(LogLevel.Debug); // Melhor prática
```

É sempre uma boa prática permitir que os clientes possam criar um objeto sem especificar um valor no constructor, nesse caso deveríamos usar algumas definições padrão. O código completo do arquivo `index.js` deve ficar assim

```js
// index.js

class LogLevel {
    static Debug = 0;
    static Info = 1;
    static Warn = 2;
    static Error = 3;
    static Critical = 4;

    static assert(log_level) {
        if (![LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error, LogLevel.Critical].includes(log_level)) {
            throw new Error(
                `log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`
            );
        }
    }
}

class Logger {
    // define um valor padrão para o log level
    #level = LogLevel.Info;

    constructor(log_level) {
        // apenas define/checa o log level se o cliente o tiver fornecido,
        // caso contrário usa o valor padrão, ou seja, `LogLevel.Info`
        if (arguments.length > 0) {
            LogLevel.assert(log_level);
            this.#level = log_level;
        }
    }

    get level() {
        return this.#level;
    }
}

module.exports = {
    Logger,
    LogLevel,
};
```

Vamos tentar testar isso.

```js
new Logger("OK"); // exibe um erro
new Logger(LogLevel.Debug); // funciona
new Logger(); // funciona

let logger = new Logger(LogLevel.Warn);
logger.level; // retorna o `level` por causa do getter `level()`
logger.#level; // exibe um erro
logger.#level = LogLevel.Warn; // exibe um erro
logger.level = 10; // exibe um erro
```

Perfeito! Parece realmente bom. Estamos confiantes que nem o código do cliente e nem o da nossa biblioteca irá afetá-la internamente. Repare que a variável membro `#level` pode ser alterada apenas de dentro do escopo da classe Logger, que é exatamente o que queremos.

## A classe `LogConfig`

Temos uma configuração básica do `Logger`, o que não ajuda em nada. Vamos tornar isso um pouco mais útil.

Como você vê, não há problema em definir o log level dentro do logger até começarmos a adicionar muitas configurações. Por exemplo, podemos adicionar uma variável membro `file_prefix`, assim como outras configurações relacionadas a variáveis. Nesse caso, a classe `Logger` vai ficar muito confusa e não é o que queremos.

Vamos começar a refatorar agora. Crie uma nova classe chamada `LogConfig` que vai conter todos os utilitários auxiliares para lidar com as configurações de log. Tudo que for tomar conta das configurações vai ficar aí dentro.

```js
// index.js

class LogConfig {
    /** Define variáveis membros necessárias e as torna privadas. */

    // O log level vai ficar aqui em vez de na classe `Logger`.
    #level = LogLevel.Info;

    // Não vamos inicializa-lo aqui, faremos isso dentro do constructor.
    #rolling_config;

    // O prefixo a ser adicionado em novos arquivos.
    #file_prefix = "Logtar_";

    /**
     * Vamos seguir a convenção de criar um método estático assert
     * sempre que estivermos lidando com objetos. Essa é uma forma
     * de escrever código seguro em javascript puro.
     */
    static assert(log_config) {
        // se houver um argumento, checa se `log_config` é
        // uma instância da classe `LogConfig`. Se não houver argumento,
        // não será necessário checar já que usaremos valores padrões.
        if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
            throw new Error(
                `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(log_config)}`
            );
        }
    }

    get level() {
        return this.#level;
    }

    get rolling_config() {
        return this.#rolling_config;
    }

    get file_prefix() {
        return this.#file_prefix;
    }
}
```

Tudo parece bom. Temos uma classe `LogConfig` configurada. Agora, em vez de usar o `#level` para  guardar o log level dentro da classe `Logger`, vamos repor com `#config`. E também adicionar um método auxiliar `with_config`.

```js
// antes

class Logger {
    ...

    #level = LogLevel.Info;

    constructor(log_level) {
        // apenas define/checa o log level se o cliente o tiver fornecido
        // caso contrário, usa o valor padrão, ou seja, `LogLevel.info`
        if (arguments.length > 0) {
            LogLevel.assert(log_level);
            this.#level = log_level;
        }
    }

    ...
}

// agora

class Logger {
    #config;
    ...

    constructor(log_config) {
        // vamos criar o método estático `with_defaults()` a seguir.
        log_config = log_config || LogConfig.with_defaults();
        LogConfig.assert(log_config);
        this.#config = log_config;
    }

     static with_config(log_config) {
        return new Logger(log_config);
    }
}
```

Sensacional. Vamos fazer uma pausa antes de adicionarmos mais funcionalidades dentro da classe `LogConfig`. Deixe-me apresentar uma rápida introdução a um tópico muito importante na engenharia de software.

## Design patterns

Design patterns (padrões de design) são uma solução para um problema comum encontrado na engenharia de software quando estamos escrevendo código. É como uma planta que mostra como solucionar alguns problemas e que pode ser usada em diferentes situações. Esses problemas são - manutenibilidade e organização de código.

Esse é um tópico vasto e pessoas dedicaram livros para explicar o uso desses padrões. No entanto, não vamos explicar cada um deles. Vamos usar aquele que se encaixa melhor em nosso projeto. Sempre encontre a ferramenta certa para o trabalho certo. Para nós, o design pattern mais razoável para construir nosso framework, assim como nossa biblioteca de logging, é o [`Builder pattern`](https://en.wikipedia.org/wiki/Builder_pattern)

### O pattern `Builder`

Pense no Builder Pattern como uma maneira de criar objetos complexos passo a passo. Imagine que você está construindo uma casa. Em vez de reunir todos os materiais e juntá-los de uma vez, você começa fixando os alicerces, depois construindo as paredes, acrescentando o telhado e assim por diante. O Builder Pattern te permite fazer algo similar. Ele ajuda a construir objetos adicionando partes ou atributos um a um, criando enfim um objeto completo e bem estruturado.

Imagine por um minuto que você está construindo uma aplicação onde usuários podem criar um perfil pessoal. Cada perfil tem um `name`, uma `age` e uma `description`. O Builder Pattern se encaixaria muito bem aqui, porque os usuários podem não fornecer todas as informações de uma vez. Veja como isso funcionaria

```js
const user = new ProfileBuilder().with_name("Alice").with_age(25).with_description("Loves hiking and painting").build();
```

Isso não fica bem natural? Especificar os passos, sem uma ordem específica e obter o que deseja. Compare essa forma com o jeito tradicional de construção utilizando um objeto

```js
const user = create_profile({
    name: "Alice",
    age: 25,
    description: "Loves hiking and painting",
});
```

O objeto como solução parece bom e até possui menos caracteres. Então por que o builder pattern? Imagine que em uma atualização futura, sua biblioteca mude a propriedade `name` para `first_name` e inclua uma propriedade secundária `last_name`. O código com o objeto não vai funcionar apropriadamente. Mas com o builder pattern, é óbvio que `name` significa nome completo. Isso pode não soar convincente. Vamos ver um exemplo diferente.

Em uma linguagem como javascript (o typescript soluciona isso) você precisa ter certeza que os parâmetros que você passa como um argumento são válidos.

Aqui está o jeito comum para você escrever a função `create_profile`

```js
function create_profile({ name, age, description }) {
    let profile = {
        name: Defaults.name,
        age: Defaults.age
        description: Defaults.description
    }
    if (typeof name === 'string') { profile.name = name }
    if (typeof age === 'number' && age > 0) { profile.age = age }
    if (typeof description === 'string') { profile.description = description }
}
```

Reparou como esse código ficaria confuso se houvessem 10 campos? A função `create_profile` não deveria ser responsável por testar. O seu papel é criar um perfil. Nós poderíamos agrupar outras funções, como `validate_name` e `validate_email` e chamá-las dentro da função `create_profile`. Mas, esse código não seria reutilizável. Eu cometi esse erro no passado e acabei tendo um código que era difícil de refatorar.

Em vez disso, vamos usar o builder pattern para identificar quais campos são válidos:

```js
class ProfileBuilder {
    name = Defaults.name;
    age = Defaults.age;
    description = Defaults.description;

    with_name(name) {
        validate_name(name);
        this.name = name;
        return this;
    }

     with_age(age) {
        validate_age(age);
        this.age = age;
        return this;
    }

    with_description(description) {...}
}
```

Você notou a diferença? Todas as validações relacionadas e a lógica de cada campo estão separadas em seus respectivos lugares. Essa abordagem é muito mais fácil de racionalizar e manter com o tempo.

## Usando o pattern `Builder` com a classe `LogConfig`

Aqui está como eu gostaria que ficasse a API do `LogConfig`

```js
const config = LogConfig.with_defaults().with_file_prefix("LogTar_").with_log_level(LogLevel.Critical);
```

Nossa atual classe `LogConfig` está assim

```js
// index.js

class LogConfig {
    #level = LogLevel.Info;

    // Falaremos sobre config de rotação (rolling config) um pouco mais adiante.
    #rolling_config = RollingConfig.Hourly;
    #file_prefix = "Logtar_";

    static assert(log_config) {
        if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
            throw new Error(
                `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(log_config)}`
            );
        }
    }
}
```

Adicione os métodos necessários

```js
// index.js

class LogConfig {
    ...
    // Isso pode ser chamado sem um objeto `LogConfig`.
    // Como, `LogConfig.with_defaults()`
    static with_defaults() {
        return new LogConfig();
    }

    // Valida o argumento `log_level`, o atribui a variável privada `#level`
    // e retorna essa instância da classe de volta. Para que outros métodos
    // possam alterar o mesmo objeto em vez de criar um novo.
    with_log_level(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
        return this;
    }

    // Vamos falar sobre config de rotação (rolling config) daqui a pouco, me acompanhe por enquanto.
    with_rolling_config(rolling_config) {
       this.#rolling_config = RollingConfig.from_json(config);
       return this;
    }

    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(`file_prefix must be a string. Unsupported param ${JSON.stringify(file_prefix)}`);
        }

        this.#file_prefix = file_prefix;
        return this;
    }
    ...
}
```

> No JavaScript, métodos estáticos são métodos que pertencem a uma classe ao invés de uma instância de uma classe. Eles podem ser utilizados sem criar uma instância da classe e normalmente são usados para funções utilitárias ou operações que não precisam de nenhum estado. Para criar um método estático em uma classe, use a palavra-chave `static` antes da declaração do método. Por exemplo:
>
> ```jsx
> class MyClass {
>     static my_static_method() {
>         console.log("Esse é um método estático.");
>     }
> }
>
> MyClass.my_static_method();
> ```
>
> Uma coisa a ter em mente é que você não pode acessar a palavra-chave `this` dentro de um método estático. Isso é porque o `this` se refere a instância da classe e métodos estáticos não são chamados em uma instância.

Subclasses também podem herdar métodos estáticos, mas eles não podem ser usados em instâncias da subclasse. Eles são úteis para organizar o código e fornecer um namespace para funções utilitárias relacionadas.

Você deve notar uma diferença agora. Todo método que adicionamos só é responsável por validar uma única entrada/argumento. Ele não se preocupa com nenhuma outra opção, estejam corretas ou não.

## Comentários em jsdoc

Se você está escrevendo javascript puro, pode ter problemas com o auto-completar ou com o recurso de intellisense que a maioria das IDEs fornecem ao trabalhar com múltiplos arquivos. Isso é porque o javascript não possui tipos (exceto os primitivos). Tudo é um objeto. Então não merecemos esses recursos de qualidade de vida quando estamos escrevendo javascript puro? Claro, merecemos. É aqui que o `jsdoc` nos salva.

Não vamos cobrir toda a gama de recursos que o `jsdoc` oferece, apenas focar naquilo que precisamos para esse propósito em particular. Estamos preocupados com duas coisas: o parâmetro e o tipo de retorno. Isso ocorre porque se uma função retornar um tipo, nosso auto-completar não funcionará em vários arquivos e não exibirá outros métodos associados desse tipo de retorno no menu dropdown.

Vamos consertar isso.

```js
   /**
     * @param {string} file_prefix Prefixo a ser definido para o arquivo.
     * @returns {LogConfig} Instância atual de LogConfig.
     * @throws {Error} Se o file_prefix não for uma string.
     */
    with_file_prefix(file_prefix) {
        if (typeof file_prefix !== "string") {
            throw new Error(`file_prefix must be a string. Unsupported param ${JSON.stringify(file_prefix)}`);
        }

        this.#file_prefix = file_prefix;
        return this;
    }
```

Criamos comentários em `jsdoc` com o formato de comentário multi linha usando `/** ... */`. Então, especificamos uma tag usando o `@`. No trecho de código acima, especificamos três tags - `@params`, `@returns` e `@throws`. As tags possuem a sintaxe a seguir

```textile
@tag {Type} <argument> <description>
```

O `type` é o tipo do `argument` a qual você está se referindo. No nosso caso, é o argumento `file_prefix` no método `with_file_prefix`. O tipo para esse argumento é `string`. A descrição é a parte da documentação para esse parâmetro em particular.

Aqui estão os comentários em `jsdoc` com o método `with_log_level`

```js
    /**
     * @param {LogLevel} log_level Log level a ser definido.
     * @returns {LogConfig} Instância atual do LogConfig.
     */
    with_log_level(log_level) {
        LogLevel.assert(log_level);
        this.#level = log_level;
        return this;
    }
```

Eu não vou ficar incluindo os comentários `jsdoc` para deixar os trechos de código curtos e mais fáceis de ler. Porém, se você está escrevendo javascript puro, é uma boa prática começar a incorporá-los no seu fluxo de trabalho. Eles vão te economizar muito tempo! O `jsdoc` pode nos ajudar em muito mais do que isso. Você pode navegar pela documentação do `jsdoc` [aqui](https://jsdoc.app/).

## A classe `RollingConfig`

A classe **`RollingConfig`** será uma parte vital do nosso sistema de logging que ajudará a gerenciar arquivos de log. Fará isso rotacionando arquivos de log baseando-se em um intervalo de tempo definido ou no tamanho do arquivo. Isso garante que arquivos de log não se tornem muito grandes e difíceis de gerenciar.

O propósito principal da classe **`RollingConfig`** é definir configurações para o processo de rotação dos arquivos de log. Isso inclui a frequência na qual serão rotacionados, o tamanho máximo que podem adquirir antes que sejam rotacionados e outras configurações relevantes. Fazer isso ajuda a manter os arquivos de log organizados e gerenciáveis, enquanto ainda preserva os dados históricos para análise, debugging e monitoramento.

A classe **`RollingConfig`** tipicamente inclui dois recursos-chave:

1. **Intervalo de Rotação:** Essas configurações determinam com que frequência os arquivos de log são rotacionados. Por exemplo, você pode configurar o logger para rotacionar os arquivos em uma determinada quantidade de minutos, horas ou dias, dependendo do nível de detalhamento que você precisa nos seus logs.
2. **Tamanho Máximo de Arquivo:** Além da rotação baseada em tempo, a classe **`RollingConfig`** também pode suportar a rotação baseada em tamanho. Quando um arquivo de log excede um certo limite de tamanho, um novo arquivo de log é criado com um prefixo que permite diferenciar arquivos de log distintos.

Antes de criar a classe `RollingConfig`, vamos criar 2 classes auxiliares - `RollingSizeOptions` e `RollingTimeOptions`. Como o nome sugere, elas vão apenas dar suporte a classe `RollingConfig`.

### A classe `RollingSizeOptions`

```js
// index.js

class RollingSizeOptions {
    static OneKB = 1024;
    static FiveKB = 5 * 1024;
    static TenKB = 10 * 1024;
    static TwentyKB = 20 * 1024;
    static FiftyKB = 50 * 1024;
    static HundredKB = 100 * 1024;

    static HalfMB = 512 * 1024;
    static OneMB = 1024 * 1024;
    static FiveMB = 5 * 1024 * 1024;
    static TenMB = 10 * 1024 * 1024;
    static TwentyMB = 20 * 1024 * 1024;
    static FiftyMB = 50 * 1024 * 1024;
    static HundredMB = 100 * 1024 * 1024;

    static assert(size_threshold) {
        if (typeof size_threshold !== "number" || size_threshold < RollingSizeOptions.OneKB) {
            throw new Error(
                `size_threshold must be at-least 1 KB. Unsupported param ${JSON.stringify(size_threshold)}`
            );
        }
    }
}
```

Eu defini alguns padrões para tornar o uso mais fácil para os clientes da nossa biblioteca. Ao invés da necessidade de declarar uma constante extra, eles podem usar o `RollingSizeOptions.TenKB` de maneira rápida ou qualquer outra opção que quiserem. No entanto, eles também podem especificar um número como valor e é aonde o nosso auxiliar `RollingSizeOptions.assert()` fará a validação para nós.

### A classe `RollingTimeOptions`

```js
// index.js

class RollingTimeOptions {
    static Minutely = 60; // A cada 60 segundos
    static Hourly = 60 * this.Minutely;
    static Daily = 24 * this.Hourly;
    static Weekly = 7 * this.Daily;
    static Monthly = 30 * this.Daily;
    static Yearly = 12 * this.Monthly;

    static assert(time_option) {
        if (![this.Minutely, this.Hourly, this.Daily, this.Weekly, this.Monthly, this.Yearly].includes(time_option)) {
            throw new Error(
                `time_option must be an instance of RollingConfig. Unsupported param ${JSON.stringify(time_option)}`
            );
        }
    }
}
```

## Finalizando a classe `RollingConfig`

É hora de criar nossa classe `RollingConfig`. Por agora, vamos adicionar algumas funcionalidades básicas.

```js
// index.js
class RollingConfig {
    #time_threshold = RollingTimeOptions.Hourly;
    #size_threshold = RollingSizeOptions.FiveMB;

    static assert(rolling_config) {
        if (!(rolling_config instanceof RollingConfig)) {
            throw new Error(
                `rolling_config must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
                    rolling_config
                )}`
            );
        }
    }

    // Fornece um método auxiliar aos clientes, dessa forma, ao invés do uso de `new RollingConfig()`,
    // eles podem simplesmente usar `RollingConfig.with_defaults()` sem especificar
    // a palavra-chave `new`.
    static with_defaults() {
        return new RollingConfig();
    }

    // Utilizando o `Builder` pattern aqui, primeiro para verificar se o tamanho é válido.
    // Se sim, define o tamanho e retorna a instância atual da classe.
    // Se não for válido, exibe um erro.
    with_size_threshold(size_threshold) {
        RollingSizeOptions.assert(size_threshold);
        this.#size_threshold = size_threshold;
        return this;
    }

    // O mesmo do trecho acima, mas com o tempo.
    with_time_threshold(time_threshold) {
        RollingTimeOptions.assert(time_threshold);
        this.#time_threshold = time_threshold;
        return this;
    }

    // Configura através de um objeto 'json' em vez de utilzar o `Builder` padrão.
    static from_json(json) {
        let rolling_config = new RollingConfig();

        Object.keys(json).forEach((key) => {
            switch (key) {
                case "size_threshold":
                    rolling_config = rolling_config.with_size_threshold(json[key]);
                    break;
                case "time_threshold":
                    rolling_config = rolling_config.with_time_threshold(json[key]);
                    break;
            }
        });

        return rolling_config;
    }
}
```

A classe `RollingConfig` está pronta para ser usada. Ela não tem funcionalidade e é meramente a configuração para nosso logger. É útil para adicionar sufixos como `Config` ou `Options` para coisas que não possuem lógica de negócio. É geralmente uma boa prática de design prestar atenção às suas convenções de nomeação.

### Vamos recapitular

-   `RollingConfig` - É uma classe que mantém a configuração de como arquivos de log devem ser rotacionados. É baseada nas classes utilitárias `RollingTimeOptions` e `RollingSizeOptions` que definem algumas constantes úteis assim, como um método `assert()` para validação.

-   `LogConfig` - Uma classe que agrupa todas as outras configurações em uma única classe gigante. Ela possui algumas variáveis membros privadas - a `#level` será do tipo `LogLevel` e define quais logs devem ser gravados e quais devem ser ignorados; `#rolling_config`, que vai armazenar a `RolllingConfig` para o nosso logger; e `#file_prefix`, que será usada para dar prefixo aos arquivos de log.

    -   `with_defaults` constrói e retorna um novo objeto `LogConfig` com alguns valores padrões.

    -   `with_log_level`, `with_file_prefix` e `with_rolling_config` alteram o objeto atual depois de testarem se o input fornecido é válido. O exemplo do que aprendemos acima - um `Builder` pattern.

    -   `assert` faz a validação para a classe `LogConfig`.

-   `Logger` - A espinha dorsal do nosso logger. Quase não tem nenhuma funcionalidade agora, mas é a classe principal da nossa biblioteca. Ela é responsável por fazer todo trabalho duro.

## Adicionando mais métodos úteis na classe `LogConfig`

A classe `LogConfig` parece boa. Mas estão faltando muitos outros recursos. Vamos adicioná-los um por um.

Primeiramente, nem todo mundo é fã do builder pattern, muitas pessoas gostariam de passar um objeto e pedir à biblioteca para tirar algo útil dele. Geralmente é uma boa prática fornecer várias maneiras de realizar uma tarefa em particular.

Vamos providenciar a possibilidade de criar um objeto `LogConfig` a partir de um objeto json.

```js
// index.js

...

class LogConfig {
    ...

    with_rolling_config(config) {
        this.#rolling_config = RollingConfig.from_json(config);
        return this;
    }

    static from_json(json) {
        // Cria um objeto LogConfig vazio.
        let log_config = new LogConfig();

        // ignora as chaves que não são necessárias para nossos propósitos.
        // se uma chave for aceita, vamos atribuir o valor fornecido a ela.
        Object.keys(json).forEach((key) => {
            switch (key) {
                case "level":
                    log_config = log_config.with_log_level(json[key]);
                    break;
                case "rolling_config":
                    log_config = log_config.with_rolling_config(json[key]);
                    break;
                case "file_prefix":
                    log_config = log_config.with_file_prefix(json[key]);
                    break;
            }
        });

        // retorna o objeto log_config alterado
        return log_config;
    }

    ...
}

...
```

Agora podemos chamá-la desse jeito -

```js
const json_config = { level: LogLevel.Debug };
const config = LogConfig.from_json(json_config).with_file_prefix("Testing");

// ou

const config = LogConfig.from_json({ level: LogLevel.Debug }).with_file_prefix('Test');

// ou

const config = LogConfig.with_defaults().with_log_level(LogLevel.Critical);

// Tenta adicionar um valor inválido
const config = LogConfig.from_json({ level: 'eh?' }); // falha

Error: log_level must be an instance of LogLevel. Unsupported param "eh?"
    at LogLevel.assert (/Users/ishtmeet/Code/logtar/index.js:251:19)
    at LogConfig.with_log_level (/Users/ishtmeet/Code/logtar/index.js:177:18)
    at /Users/ishtmeet/Code/logtar/index.js:143:45
```

A API da nossa biblioteca já está parecendo sólida. Mas há uma última coisa que gostaríamos de ter, um método conveniente para construir o `LogConfig` a partir de um lugar. A partir de um arquivo de configuração. Vamos adicionar esse método.

```js
// importa o módulo `node:fs` para usar o `readFileSync`
const fs = require('node:fs')

class LogConfig {
    ...

    /**
     * @param {string} file_path O path para o arquivo de configuração.
     * @returns {LogConfig} Uma nova instância de LogConfig com os valores do arquivo de configuração.
     * @throws {Error} Se o file_path não for uma string.
     */
    static from_file(file_path) {
        // `fs.readFileSync` exibe um erro se o path for inválido.
        // Cuida do gerenciamento de path do sistema operacional em específico para nós.
        // Não precisamos validar os paths por nós mesmos.
        const file_contents = fs.readFileSync(file_path);

        // Envia para o nosso método `from_json` fazer o resto
        return LogConfig.from_json(JSON.parse(file_contents));
    }

    ...
}
```

Você reparou como reutilizamos o método `from_json` para quebrar o json em um objeto `LogConfig`? Essa é uma coisa que você deve ter em mente para construir APIs boas e sustentáveis. Evite duplicação de código e torne métodos/auxiliares reutilizáveis. O máximo que você puder.

### Porque o `readFileSync`?

Loggers normalmente são inicializados uma vez quando o programa começa e geralmente não são criados depois da fase de inicialização. Dessa forma, usar o `readFileSync` em vez da versão assíncrona pode fornecer vários benefícios nesse caso específico.

O `readFileSync` opera de maneira síncrona, o que significa que ele bloqueia a execução do código até que a leitura do arquivo esteja completa. Para estabelecer a configuração do logger, isso é geralmente desejado, porque a configuração é necessária para inicializa-lo apropriadamente antes de qualquer atividade de logging (registro) começar, já que nossa aplicação estará usando o logger internamente.

Não podemos deixar a aplicação começar antes da inicialização do logger. Usar operações assíncronas como `readFile` poderia gerar complexidades no gerenciamento do tempo de inicialização do logger.

Vamos testar usando um arquivo de configuração. Crie um arquivo `config.demo.json` com o seguinte conteúdo

```json
{
    "level": 3,
    "file_prefix": "My_Prefix_",
    "rolling_config": {
        "size_threshold": 1024,
        "time_threshold": 3600
    }
}
```

Já que adicionamos o suporte para arquivos, o código a seguir vai funcionar agora

```js
const config = LogConfig.from_file("./config.demo.json");
const logger = Logger.with_config(config);
```

Tudo funcionando como esperado.

> Nota: Todo código que escrevemos aqui pode ser encontrado [no diretório code/chapter_04.0](/code/chapter_04.0). Será um único arquivo e vamos refatorá-lo nos capítulos seguintes.

[![Read Next](/assets/imgs/next.png)](/chapters/ch04.1-refactoring-the-code.md)

![](https://uddrapi.com/api/img?page=ch04)
