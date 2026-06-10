# Arraia Show 🌽🔥

O **Arraia Show** é um ecossistema completo para a gestão de festas juninas e eventos similares. A plataforma permite o controle total de eventos, desde a gestão de barracas e produtos até o acompanhamento financeiro em tempo real por meio de um dashboard para organizadores.

## 🚀 Funcionalidades

### Gestão de Eventos e Usuários
*   **Controle de Acesso:** Hierarquia de usuários incluindo `participante`, `barraqueiro`, `organizador` e `admin`.
*   **Gestão de Eventos:** Criação, atualização e listagem de eventos ativos.
*   **Vínculo de Usuários:** Possibilidade de associar participantes a eventos específicos.

### Operação de Barracas e Produtos
*   **Barracas:** Cadastro de barracas vinculadas a eventos, com atribuição de responsáveis.
*   **Cardápio Digital:** Gestão de produtos por barraca, incluindo controle de preços e estoque.
*   **Alertas de Estoque:** Notificações automáticas no dashboard para produtos com estoque crítico (abaixo de 5 unidades).

### Dashboard do Organizador
*   **Métricas Financeiras:** Visualização de faturamento total, lucro estimado (baseado em taxa operacional) e repasse para as barracas.
*   **Performance:** Ranking das barracas em destaque por volume de vendas.
*   **Monitoramento:** Acompanhamento de pedidos recentes e alertas operacionais (barracas sem responsável ou estoque baixo).

## 🛠️ Tecnologias Utilizadas

### Backend
*   **Node.js** com **Express**
*   **MySQL** (Banco de dados relacional)
*   **Dotenv** (Gestão de variáveis de ambiente)
*   **Middleware de Autenticação** para proteção de rotas administrativas.

### Frontend
*   **React**
*   **Componentização** (Stat, Hero Cards, Progress Bars customizadas)
*   **Gestão de Estado** para dados de pedidos, usuários e produtos.

## 📂 Estrutura do Projeto

```text
ArraiaShow/
├── backend/
│   ├── config/          # Configuração de banco de dados
│   ├── controllers/     # Lógica de negócio (Eventos, Produtos, Usuários...)
│   ├── middleware/      # Validação de permissões e autenticação
│   └── routes/          # Definição dos endpoints da API
├── front/
│   └── src/
│       ├── profiles/    # Telas específicas por perfil (Organizador, etc)
│       ├── components/  # Componentes reutilizáveis de UI
│       └── utils.js     # Helpers de formatação e cálculos
└── README.md
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
*   Node.js instalado
*   Instância de banco de dados MySQL

### Passo a Passo

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/tiago-costacs/ArraiaShow-master.git
    ```

2.  **Configurar o Backend:**
    *   Acesse a pasta `backend`.
    *   Instale as dependências: `npm install`.
    *   Crie um arquivo `.env` na raiz do backend seguindo o padrão do módulo `dotenv`:
        ```ini
        DB_HOST=localhost
        DB_USER=seu_usuario
        DB_PASS=sua_senha
        DB_NAME=arraia_show
        ```
    *   Inicie o servidor: `npm start`.

3.  **Configurar o Frontend:**
    *   Acesse a pasta `front`.
    *   Instale as dependências: `npm install`.
    *   Inicie a aplicação: `npm start`.

## 📡 Endpoints Principais

| Rota | Método | Descrição |
| :--- | :--- | :--- |
| `/eventos` | GET/POST | Listagem e criação de eventos |
| `/barracas` | GET/POST | Gestão de barracas (Filtro por evento) |
| `/produtos` | GET/POST | Gestão de itens e estoque |
| `/usuarios/tipo/:id` | PUT | Alteração de perfil de acesso (Admin) |

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---
Desenvolvido para facilitar a alegria das festas juninas! 🌽🚀# 🌽 Arraia Show

> Plataforma completa para gerenciamento de festas juninas, eventos e barracas, oferecendo controle operacional, financeiro e administrativo em um único ambiente.

---

## 📖 Sobre o Projeto

O **Arraia Show** é uma plataforma desenvolvida para simplificar a organização e administração de festas juninas e eventos similares.

O sistema centraliza a gestão de eventos, barracas, produtos, usuários e vendas, além de disponibilizar um **dashboard inteligente** para que os organizadores acompanhem indicadores financeiros e operacionais em tempo real.

---

## ✨ Principais Funcionalidades

### 🎉 Gestão de Eventos

* Cadastro e gerenciamento de eventos
* Controle de eventos ativos
* Associação de participantes aos eventos
* Organização centralizada das informações

### 👥 Gestão de Usuários

* Controle de permissões por perfil
* Hierarquia de acesso:

  * 👤 Participante
  * 🏪 Barraqueiro
  * 🎯 Organizador
  * ⚙️ Administrador

### 🏪 Gestão de Barracas

* Cadastro de barracas por evento
* Vinculação de responsáveis
* Controle individual de funcionamento
* Monitoramento operacional

### 🍔 Gestão de Produtos

* Cadastro de produtos
* Controle de preços
* Controle de estoque
* Cardápio digital por barraca

### 📊 Dashboard do Organizador

* Faturamento total do evento
* Estimativa de lucro
* Valor de repasse para barracas
* Ranking das barracas com melhor desempenho
* Pedidos recentes
* Alertas de estoque baixo
* Identificação de barracas sem responsável

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express
* MySQL
* Dotenv
* Middleware de autenticação
* API REST

### Frontend

* React
* JavaScript
* Componentização reutilizável
* Gerenciamento de estado
* Interface responsiva

---

## 📁 Estrutura do Projeto

```text
ArraiaShow/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
├── front/
│   └── src/
│       ├── components/
│       ├── profiles/
│       ├── pages/
│       └── utils/
│
└── README.md
```

---

## 🚀 Como executar o projeto

### Pré-requisitos

* Node.js
* MySQL
* Git

### 1. Clone o repositório

```bash
git clone https://github.com/tiago-costacs/ArraiaShow.git
```

### 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=arraia_show
```

Execute:

```bash
npm start
```

ou

```bash
npm run dev
```

---

### 3. Frontend

```bash
cd front
npm install
npm start
```

---

## 📡 Principais Endpoints

| Método | Endpoint             | Descrição                  |
| ------ | -------------------- | -------------------------- |
| GET    | `/eventos`           | Lista eventos              |
| POST   | `/eventos`           | Cria um evento             |
| GET    | `/barracas`          | Lista barracas             |
| POST   | `/barracas`          | Cadastra barraca           |
| GET    | `/produtos`          | Lista produtos             |
| POST   | `/produtos`          | Cadastra produto           |
| PUT    | `/usuarios/tipo/:id` | Atualiza perfil do usuário |

---

## 🎯 Objetivo

O projeto foi desenvolvido para oferecer uma solução moderna para a gestão de eventos, permitindo que organizadores acompanhem toda a operação de forma simples, centralizada e eficiente.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Tiago Costa**.

Se este projeto foi útil para você, considere deixar uma ⭐ no repositório para apoiar o desenvolvimento.
🌽🔥
