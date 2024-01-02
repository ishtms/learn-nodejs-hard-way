# Exercício 4 - Implementando o Roteamento Dinâmico

Quando estamos construindo uma aplicação de servidor, roteamento dinâmico é uma funcionalidade essencial para criar aplicações flexíveis e escaláveis. Para entender completamente o seu significado e como podemos aprimorar nosso roteador para dar suporte à rotas dinâmicas, como `/users/:id`, vamos nos aprofundar no conceito de roteamento dinâmico.

## Por Que Roteamento Dinâmico?

Em sua essência, roteamento dinâmico se refere a habilidade de uma aplicação web (não apenas de servidor) de lidar com requisições para URLs que não são pré-determinadas, mas ainda mais, são definidas por padrões. Isso permite que desenvolvedores criem rotas que podem corresponder a uma gama de estruturas URL, geralmente usando parâmetros. Por exemplo, uma URL como `/users/:user_id` pode lidar com requisições para qualquer ID de usuário, onde `:user_id` é a parte variável da URL.

### Flexibilidade

Roteamento dinâmico introduz um nível de flexibilidade que o roteamento estático não consegue oferecer. Conforme aplicações crescem e se tornam mais complexas, geralmente novas rotas precisam ser adicionadas. Com roteamento dinâmico, você pode lidar com um vasto número de rotas com apenas alguns padrões de rota, tornando a aplicação mais escalável e mais fácil de manter. Por exemplo, imagine ter que definir uma rota para todo tipo de asset que o seu site oferece.

Você teria que fazer algo assim:

```js
// imagens
app.get('/static/imgs/img1.png', img_handler);
app.get('/static/imgs/img2.png', img_handler);
app.get('/static/imgs/img3.png', img_handler);
app.get('/static/imgs/img4.png', img_handler);

// javascript
app.get('/static/js/main.js', script_handler);
app.get('/static/js/third_party.js', script_handler);

/** e assim por diante**/
```

Isso é bem entediante e você não pode esperar que uma aplicação como essa seja escalável. E se tivéssemos um roteamento dinâmico para servir todos os assets?

```js
app.get('/static/img/:image_file_name', img_handler)
app.get('/static/js/:javascript_file_name', img_handler)
```

Isso é algo muito melhor que o anterior.

> Porém, essa ainda não é a melhor maneira de lidar com assets. Você pode ter sub-diretórios, como `/img/compressed/webps/img.webp`. Você vai obter uma rota não encontrada (not found) ao realizar o método acima. Para solucionar esse problema, temos o conceito de curingas. Você ainda não precisa se preocupar com curingas. Vamos cobrir esse assunto no próximo capítulo.

### Melhor Experiência do Usuário

Rotas dinâmicas permitem a criação de experiências de usuário mais personalizadas. Por exemplo, em uma aplicação de um blog, um roteamento dinâmico como `/posts/:postId`, pode exibir um post específico com base no ID na URL. Essa abordagem torna direta a ligação com um conteúdo específico, aprimorando a navegabilidade e envolvimento do usuário.

### Melhor Experiência de Desenvolvimento

Ao usar rotas dinâmicas, desenvolvedores do nosso framework podem evitar o tédio de definir cada possível path de URL em suas aplicações. Isso não apenas economiza tempo, mas reduz o risco de erros. Uma única rota dinâmica pode substituir dezenas, se não centenas, de rotas estáticas, simplificando o processo de desenvolvimento.

### Melhor SEO

Roteamento dinâmico também pode contribuir para um melhor SEO (Search Engine Optimization). Com a habilidade de gerar URLs claras e com significado (por exemplo, `/game/dota2` ao invés de `/game?uid=dota2`), rotas dinâmicas tornam URLs mais compreensíveis para ambos, usuários e motores de busca, potencialmente aprimorando a colocação na busca.

## Anatomia de Uma Rota Dinâmica

Uma rota dinâmica segue uma estrutura, onde certas partes do caminho da URL são variáveis, conhecidas como segmentos dinâmicos.

```
/[Segmento de Path Estático]/[Segmento Dinâmico]/[Mais Segmentos Dinâmicos ou Estáticos]
```

Exemplo de URL: https://github.com/:user_id/repos

1. Segmento de Path Estático: 'repos'
   
   - Uma parte fixa do path da URL que não é alterada.

2. Segmento Dinâmico: `:user_id`
   
   - Uma parte variável da URL. O `user_id` pode ter qualquer valor, representando um usuário específico.

## Desafio 1: Atualize a Função `getRouteParts()`

Inicialmente, nossa função `getRouteParts` convertia todas as partes da rota para minúsculo. Para dar suporte à rotas dinâmicas, temos que modificar essa função para manter segmentos dinâmicos (indicados por um dois pontos `:`) da forma que estão, sem convertê-los para minúsculo. Isso é crucial para reconhecer partes dinâmicas em uma rota.

Por exemplo, devemos dar aos desenvolvedores a flexibilidade que eles querem para nomear seus parâmetros dinâmicos.

```js
/account/:UserId
/account/:user_id
```

### Requisitos

Atualmente, a função normaliza o path da URL e converte todos os segmentos para caixa baixa. Seu objetivo é modificar a função para identificar e preservar modelos de parâmetros dinâmicos marcados com ":" (como `:id`), enquanto ainda normaliza os outros segmentos.

**Mais Detalhes:**

1. O parâmetro `path`, passado para a função `getRouteParts`, é uma string representando um path de URL.

2. A função deve primeiro substituir quaisquer barras consecutivas (`/`) para garantir uma normalização de path apropriada.

3. Deve então dividir o path em segmentos com base nas barras (`/`).

4. Para cada segmento:
   
   - Se o segmento começar com um ":" (como `:id`), ele deve ser tratado como um parâmetro dinâmico e preservado como está.
   - Se o segmento não começar com um ":", deve ser convertido para minúsculo e ter quaisquer espaços em branco removidos.

5. A função deve retornar um array de segmentos de path, com os parâmetros dinâmicos intactos e com os outros segmentos normalizados.

6. Exemplo:
   
   - Input: `"/api/user/:id/profile"`
   - Output: `["api", "user", ":id", "profile"]`

7. Outro Exemplo:
   
   - Input: `"/api/user/:ID/profile"`
   - Output: `["api", "user", ":ID", "profile"]`

8. Garanta que sua solução seja eficiente e siga as práticas modernas de programação JavaScript.

9. Atualize a função `getRouteParts` para implementar esse comportamento. Faça mudanças apenas dentro da função, enquanto mantém a mesma assinatura para a função.

### Solução

Aqui está a solução que eu trouxe:

```js
function getRouteParts(path) {
    return path
        .replace(/\/{2,}/g, "/")
        .split("/")
        /* Se o segmento começar com um dois pontos, retorna ele do mesmo jeito */
        .map((curr) => (curr.startsWith(":") ? curr : curr.toLowerCase().trim()));
}
```

## Desafio 2: Adicione a Funcionalidade de Roteamento Dinâmico na Classe `Router`
