[![Read Prev](/assets/imgs/prev.png)](/Readme.md)

# Afinal, o que diabos é um Servidor Web?

> Nota: Este capítulo te dará uma breve visão geral do básico sobre Servidores Web e HTTP. Nós vamos aprender sobre o HTTP com mais detalhes em um [capítulo mais adiante](/chapters/ch05.0-http-deep-dive.md).

Se você não deseja ler sobre o básico de web/http, você pode pular tranquilamente para a [sessão de códigos](/chapters/ch02-your-first-nodejs-server.md).

Antes de mergulhar diretamente na escrita de código Javascript para criação de Servidores Web, é essencial compreender os conceitos fundamentais, eles são os blocos básicos na construção de um Servidor Web. Servidores Web são como os controladores de tráfego da internet. Eles gerenciam requisições de usuários (como você!) e nos devolvem a informação correta. Mas do que é formado um Servidor Web e como ele funciona? Vamos dividir isso em termos simples.

## Partes de um Servidor Web:

Servidores Web são como amigos tradutores que ajudam computadores a entenderem uns aos outros. Imagine que você e um amigo falam línguas diferentes. Para ter uma conversa, vocês precisariam de uma língua em comum que ambos entendam. Do mesmo jeito, Servidores Web e Computadores precisam de uma série de regras em comum para falar uns com os outros efetivamente. Essas regras são chamadas de protocolos, são como linguagens criadas especificamente para computadores. Quando você digita o endereço de um site em seu navegador e aperta "Enter", o seu computador envia uma mensagem para o Servidor Web. Essa mensagem segue as regras da linguagem da web, conhecida como protocolo HTTP (Hypertext Transfer Protocol).

O HTTP é como um código que diz ao Servidor Web o que você quer (por exemplo, um site ou uma imagem) e como responder. O Servidor Web lê a sua mensagem, entende ela porquê também conhece o protocolo HTTP, e então envia de volta a informação solicitada utilizando as mesmas regras. Essa informação pode ser um site, uma foto ou qualquer outro conteúdo.

Assim como você precisa falar a mesma língua para ter uma conversa bem sucedida com alguém, computadores e servidores web precisam utilizar o mesmo protocolo para se comunicarem efetivamente. Dessa forma, eles podem entender as requisições uns dos outros e fornecerem as respostas corretas, permitindo que você consuma o conteúdo que estava procurando na internet. O HTTP estabelece um conjunto padronizado de regras sobre como a requisição do seu computador (como visitar um site) deve ser estruturada e como a resposta do servidor (o próprio site) deve ser formatada. Isso garante uma comunicação sem ruídos entre diferentes dispositivos, independente das tecnologias de cada um.

Pense no HTTP como sendo um roteiro detalhado de uma peça. Ele descreve cada passo, desde a introdução dos personagens (sua requisição) aos seus diálogos (transmissão de dados) e o grand finale (a resposta do servidor). Esse roteiro estruturado elimina a possibilidade de mal-entendidos e garante que ambos os lados saibam o que esperar a cada etapa da comunicação.

Mas o mundo dos protocolos não está limitado ao HTTP. A versão segura da web, o HTTPS (Hypertext Transfer Protocol Secure), adiciona uma camada extra de proteção através da criptografia. Dessa forma, mesmo se alguém tentar [bisbilhotar](https://en.wikipedia.org/wiki/Eavesdropping) o que está na sua conversa, eles só conseguiriam ver informações distorcidas e sem sentido.

Os protocolos também se extendem além da navegação na web. Email, transferência de arquivos e até mesmo a forma como seu celular se conecta ao Wi-Fi, dependem de vários protocolos que garantem uma comunicação confiável e eficiente. Cada protocolo tem um propósito específico, assim como diferentes formas da linguagem para diferentes cenários da vida real.

### Navegando pelo Mundo dos Protocolos: Um rápido panorama

Como explicado nos parágrafos acima, os protocolos são como regras que possibilitam que dispositivos se comuniquem efetivamente na internet. Eles definem como os dados serão formatados, transmitidos e compreendidos por diferentes sistemas. Assim como as pessoas seguem regras sociais de etiqueta durante uma conversa, dispositivos seguem protocolos para garantir a comunicação sem dificuldades. Segue uma visão geral de alguns dos principais tipos de protocolos:

- **TCP/IP (Transmission Control Protocol/Internet Protocol):** conjunto de regras para a troca de dados através de uma rede.
- **HTTP (Hypertext Transfer Protocol):** protocolo para a transmissão de dados entre um servidor web e um cliente web.
- **HTTPS (Hypertext Transfer Protocol Secure):** extensão do HTTP que criptografa os dados em tráfego.
- **UDP (User Datagram Protocol):** protocolo para transmissão de dados entre dispositivos em rede que não exige conexão ou garantias de confiabilidade.
- **FTP (File Transfer Protocol):** protocolo para transferência de arquivos entre computadores em uma rede.
- **SMTP (Simple Mail Transfer Protocol):** protocolo para envio de mensagens de email entre servidores.
- **POP3 (Post Office Protocol 3) and IMAP (Internet Message Access Protocol):** protocolos para recuperação de mensagens de email de um servidor.
- **DNS (Domain Name System):** protocolo para a tradução de nomes de domínios em endereços de IP.
- **DHCP (Dynamic Host Configuration Protocol):** protocolo para atribuir automaticamente endereços IP a dispositivos em uma rede.

Para se tornar um bom engenheiro back-end, é importante ter um entendimento sólido dos diferentes protocolos de rede. Apesar do HTTP(s) ser o principal foco deste guia, ter conhecimento dos outros protocolos, como FTP, SMTP e DNS, podem te trazer benefícios a longo prazo. É muito comum que o FTP (File Transfer Protocol) seja utilizado para transferir arquivos entre servidores, enquanto o SMTP (Simple Mail Transfer Protocol) é utilizado para envio de emails. O DNS (Domain Name System) é responsável pela tradução de nomes de domínios para endereços de IP.

> Se você está programando servidores de jogos, é importante ter um entendimento sólido de UDP. O UDP é mais rápido mas menos confiável que o TCP, tornando-o ideal para aplicações que podem tolerar uma perda ocasional de dados, como streaming de vídeos ou jogos online. Diferente do TCP, o UDP é um protocolo do tipo "envia e esquece”, o que significa que os dados são enviados sem qualquer mecanismo de verificação ou confirmação de erros.

### A Relação entre HTTP e TCP: Garantindo uma comunicação confiável na web

O HTTP (Hypertext Transfer Protocol) e o TCP (Transmission Control Protocol) formam uma forte parceria quando o assunto é comunicação web. A razão pela qual o HTTP prefere o TCP está na própria natureza de suas funções e responsabilidades no mundo das redes.

### 1. Integridade e Ordenamento de dados

O HTTP é usado para transportar conteúdo através da web, como sites, imagens, vídeos, de um servidor para o navegador de um usuário. Imagine se você fosse acessar um site e as imagens estivessem com pedaços faltando ou o texto embaralhado. Isso não seria uma boa experiência, certo? O HTTP garante que os dados sejam entregues corretamente e na ordem.

O TCP ajuda com isso. Ele foi desenvolvido para garantir que os dados sejam entregues na ordem correta e sem erros. O TCP quebra a informação em pequenos pedaços chamados de pacotes, envia esses pacotes ao destino e garante que eles cheguem na ordem certa. Se algum dos pacotes se perder durante o processo, o TCP solicita que seja enviado novamente. Isso é importante para as páginas web, porque tudo precisa ser apresentado de uma maneira que faça sentido.

> Um pacote é um pequeno pedaço de informação enviado através de uma rede. No contexto de comunicação web, O TCP quebra a informação em pequenos pedaços chamados de pacotes, envia esses pacotes ao destino e garante que eles cheguem na ordem certa. Se algum dos pacotes se perder durante o processo, o TCP solicita que seja enviado novamente.

### 2. Mecanismo de Confirmação

O HTTP é uma forma de solicitar uma página web e em seguida o servidor nos retorna o conteúdo que solicitamos. Para ter certeza que os dados serão recebidos corretamente, um [mecanismo de confirmação](<https://en.wikipedia.org/wiki/Acknowledgement_(data_networks)>) é necessário.

O TCP fornece esse mecanismo aguardando que seu navegador confirme o recebimento de cada pacote enviado pelo servidor. Se o seu navegador não confirmar, o TCP envia o pacote novamente para que, tanto o servidor quanto o navegador, possam ter certeza que os dados estão sendo recebidos corretamente.

### 3. Interações Complexas

As transações do HTTP envolvem várias etapas, como solicitar uma página web, receber a estrutura HTML, buscar pelos componentes vinculados (imagens, folhas de estilo) e muito mais. Essas interações exigem manipulação e ordenamento de dados de maneira precisa.

O TCP funciona bem com o HTTP para lidar com interações complexas. Os mecanismos do TCP garantem que cada dado chegue ao destino pretendido e se encaixe na interação maior. Por exemplo, quando você visita um site, seu navegador faz diversas solicitações HTTP para diferentes ativos. O TCP ajuda a garantir que essas solicitações e respostas ocorram de maneira ordenada e confiável.

### 4. Sobrecarga de Transmissão

O TCP adiciona algumas informações extras para cada mensagem a fim de garantir que ela chegue ao destino sem erros. Essas informações extras incluem confirmações, números de sequência e verificações de erros. Mesmo que isso adicione mais dados para cada mensagem, ainda é válido porque garante a integridade e ordenamento dos dados. Isso é especialmente importante ao se comunicar através da web.

## Pedindo e Recebendo: Como Servidores Web respondem às suas requisições

Imagine que você está em casa, sentando em frente ao seu computador e então você decide visitar um site, vamos supor "exemplo.com". Esse ato simples inicia uma série de eventos que marcam o processo de "Pedir e Receber" na comunicação web.

### A Requisição:

#### Sua Requisição:

Você digita "exemplo.com" na barra de endereços do seu navegador e aperta Enter. Isso é como dizer ao seu computador, "Ei, eu quero ver o que tem nesse site!"

#### Encontrando o endereço:

Seu computador só conhece o básico de sites, mas precisa do endereço exato de “example.com” para se conectar a ele. Então, ele recorre a um ajudante especial chamado de [DNS resolver](https://en.wikipedia.org/wiki/Domain_Name_System#Address_resolution_mechanism).

#### Resolvendo o endereço:

O DNS Resolver é como uma agenda de endereços digital. Ele pega o "exemplo.com" e procura pelo endereço de IP real associado a ele. Esse endereço de IP são como as coordenadas para o local do site na internet.

> Uma URL de um site, como https://google.com, também é chamada de **nome de domínio**

### A Resposta:

#### Endereço de retorno:

O DNS resolver encontra o endereço IP associado ao site "exemplo.com" e envia de volta ao seu computador. É como se o DNS resolver estivesse dizendo ao seu computador, "O site está localizado neste endereço IP".

#### Enviando a requisição:

Agora que o seu computador conhece o endereço IP, ele pode enviar uma requisição ao servidor web que hospeda o conteúdo do site. Essa requisição contém o endereço IP e uma mensagem dizendo, "Ei, você pode me dar o conteúdo do seu site, por favor?"

#### Preparando o conteúdo:

O servidor web recebe a sua requisição e entende que você quer ver o conteúdo de "exemplo.com". Em seguida, reúne os arquivos necessários – HTML, imagens, folhas de estilo, scripts – para criar a página web.

#### Enviando a resposta:

O servidor web empacota o conteúdo em uma resposta e o envia de volta ao seu computador pela Internet. É como se o servidor enviasse um pacote digital à sua porta.

#### Aproveitando o conteúdo:

O seu computador recebe a resposta do servidor web. Seu navegador interpreta o HTML, exibe as imagens e aplica os estilos criando uma página web completa. Isso é o que você vê na sua tela - o resultado final da sua requisição.

> Um aviso rápido: nossa abordagem de aprendizado prioriza a clareza e o rigor. Vou apresentar um tema, decompô-lo e, se encontrarmos algum conceito desconhecido, iremos explorá-lo até que tudo seja totalmente compreendido.

[![Read Prev](/assets/imgs/next.png)](/chapters/ch02-your-first-nodejs-server.md)

![](https://uddrapi.com/api/img?page=ch01)
