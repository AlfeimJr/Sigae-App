ViceriTest
Descrição
O ViceriTest é uma aplicação web desenvolvida com Angular para gerenciar diferentes funcionalidades, como planos de ação, agendas, cadastro de pessoas e autenticação de usuários. O objetivo principal é criar uma solução modular e escalável que atenda a múltiplas necessidades organizacionais.

Estrutura do Projeto
Diretórios Principais
.vscode/: Configurações específicas para o Visual Studio Code.
public/: Contém recursos públicos como favicon e imagens.
src/: Diretório principal do código-fonte do projeto, com subdiretórios como:
app/: Contém os módulos, componentes, serviços e rotas da aplicação.
environments/: Configurações de ambiente (desenvolvimento, produção, etc.).
Principais Funcionalidades
Autenticação:

Login com autenticação via AuthGuard e interceptor para autenticação de requisições.
Gerenciamento de Pessoas:

Cadastro, listagem e edição de informações de usuários.
Planos de Ação:

Módulo completo para gerenciar etapas de um plano de ação.
Agenda:

Gerenciamento de eventos com funcionalidades de criação e visualização.
Configuração do Ambiente
Pré-requisitos
Node.js: Certifique-se de que o Node.js (v14 ou superior) está instalado.
Angular CLI: Instale a CLI do Angular globalmente:
bash
Copiar código
npm install -g @angular/cli
Instalação
Clone o Repositório:

bash
Copiar código
git clone <URL-DO-REPOSITORIO>
cd ViceriTest
Instale as Dependências:

bash
Copiar código
npm install
Execute o Servidor de Desenvolvimento:

bash
Copiar código
ng serve
Acesse a aplicação em http://localhost:4200.

Estrutura Modular
A aplicação é organizada em módulos que dividem a lógica por responsabilidades. Principais módulos:

Core: Contém guardas, interceptadores e serviços gerais.
Features: Cada funcionalidade principal está encapsulada em seu módulo, como:
action-plan: Gerenciamento de planos de ação.
agenda: Gerenciamento de eventos.
peoples: Cadastro e gerenciamento de pessoas.
login: Autenticação de usuários.
Principais Arquivos
app.module.ts: Arquivo principal para registro de módulos e configurações globais.
app.routes.ts: Gerenciamento das rotas da aplicação.
styles.scss: Estilo global da aplicação.
environment.ts: Configuração de ambiente.
Tecnologias Utilizadas
Angular: Framework para desenvolvimento web SPA.
PrimeNG: Biblioteca de componentes UI para Angular.
TypeScript: Linguagem principal para desenvolvimento.
SCSS: Estilização avançada da aplicação.
