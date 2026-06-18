# Testes Funcionais (backend/tests/functional)

Este diretório contém os testes funcionais criados para validar fluxos principais (autenticação, permissões, eventos, barracas, produtos, estoque e vendas).

Pré-requisitos:

- MySQL rodando e base `arraia_show` acessível conforme `backend/config/db.js`.
- Contas demo existentes (o projeto usa alguns e-mails de demo): `admin@evento.com`, `organizador@evento.com`, `joao@barraca.com`, `maria@cliente.com`. Essas contas aceitam senha `123456` em ambiente de demonstração.
- Node.js 18+ (para suporte a `node:test`).

Como rodar os testes (Windows PowerShell):

```powershell
cd <caminho-do-projeto>
.\n+scripts\run-tests.ps1
```

Como rodar no Linux/macOS:

```bash
cd <caminho-do-projeto>
./scripts/run-tests.sh
```

Ou via npm diretamente:

```bash
npm run test:backend
```

Rodar testes individuais:

- Auth/permissões:
  - `npm run test:auth`
- Eventos:
  - `npm run test:eventos`
- Barracas:
  - `npm run test:barracas`
- Produtos:
  - `npm run test:produtos`
- Pedidos:
  - `npm run test:pedidos`

Resumo dos testes:

- `npm run test:auth`
  - Validar que Participante não pode acessar dashboard administrativo.
  - Validar que Admin pode alterar perfil de usuário.
- `npm run test:eventos`
  - Criar evento válido.
  - Tentar criar evento sem nome e verificar mensagem de erro.
- `npm run test:barracas`
  - Cadastrar barraca vinculada a um evento existente.
  - Tentar cadastrar barraca sem responsável e validar erro.
- `npm run test:produtos`
  - Cadastrar produto válido.
  - Impedir cadastro de produto com preço negativo.
  - Identificar produto com estoque crítico (estoque igual a 4).
  - Identificar produto com estoque normal (estoque igual a 10).
- `npm run test:pedidos`
  - Criar pedido de produto.
  - Validar atualização de estoque após venda.

Observações:

- Os testes usam a API real e irão inserir dados (usuários, eventos, barracas, produtos, pedidos) na base configurada. Recomenda-se ter um ambiente de testes separado do ambiente de produção.
- Caso precise, posso adaptar os testes para usar mocks ou um banco SQLite em memória.
