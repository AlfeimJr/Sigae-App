# ViceriTest

## Descrição

O **ViceriTest** é uma aplicação web desenvolvida com Angular para gerenciar diferentes funcionalidades, como planos de ação, agendas, cadastro de pessoas e autenticação de usuários. O objetivo principal é criar uma solução modular e escalável que atenda a múltiplas necessidades organizacionais.

---

## Estrutura do Projeto

### Diretórios Principais

- **`.vscode/`**: Configurações específicas para o Visual Studio Code.
- **`public/`**: Contém recursos públicos como favicon e imagens.
- **`src/`**: Diretório principal do código-fonte do projeto, com subdiretórios como:
  - **`app/`**: Contém os módulos, componentes, serviços e rotas da aplicação.
  - **`environments/`**: Configurações de ambiente (desenvolvimento, produção, etc.).

---

## Funcionalidades

1. **Autenticação**:
   - Login com autenticação via `AuthGuard` e interceptor para autenticação de requisições.

2. **Gerenciamento de Pessoas**:
   - Cadastro, listagem e edição de informações de usuários.

3. **Planos de Ação**:
   - Módulo completo para gerenciar etapas de um plano de ação.

4. **Agenda**:
   - Gerenciamento de eventos com funcionalidades de criação e visualização.

---

## Configuração do Ambiente

### Pré-requisitos

- **Node.js**: Certifique-se de que o Node.js (v14 ou superior) está instalado.
- **Angular CLI**: Instale a CLI do Angular globalmente:
  ```bash
  npm install -g @angular/cli
