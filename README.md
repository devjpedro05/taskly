# Taskly

Sistema Web para organização e gerenciamento de atividades acadêmicas.

## Sobre o projeto

Projeto incremental da disciplina Tecnologia de Construção de Software I. A Etapa 07 transforma a API Express em uma aplicação com SQLite, autenticação e registros separados por estudante.

## Etapa atual

**Etapa 07 — Persistência e CRUD com Banco de Dados.**

## Funcionalidades e telas

- Cadastro de usuário, login e logout por cookie HttpOnly.
- Dashboard com pendências, conclusões, atrasos e próximas atividades reais.
- Pesquisa e filtros por status, disciplina, categoria e prioridade.
- Cadastro, edição e exclusão de atividades.
- Gerenciamento de disciplinas e categorias.
- Detalhes de atividades com criação, conclusão e exclusão de subtarefas.
- Proteção das rotas e isolamento de dados por usuário.

As quatro novas telas são Login, Cadastro, Categorias e Detalhes da atividade. A justificativa funcional e acadêmica de cada uma está em [docs/etapa-07.md](docs/etapa-07.md#justificativa-das-novas-telas-e-alterações-na-interface).

## Tecnologias e banco de dados

Frontend: React, TypeScript, Vite, React Router, Fetch API e CSS convencional.

Backend: Node.js, TypeScript, Express, SQLite via better-sqlite3, bcryptjs e JWT em cookie HttpOnly. Não há ORM.

Cinco tabelas relacionadas: **users, subjects, categories, activities e subtasks**. O esquema está em [backend/schema.sql](backend/schema.sql). O banco local é criado em `backend/data/taskly.sqlite` e preserva os dados depois de reiniciar.

## Execução local

Pré-requisito: **Node.js 22.12+**. A instalação e o driver SQLite foram validados com Node.js 24.3.0.

Terminal 1, a partir da raiz do repositório:

```powershell
cd backend
npm install
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Copie o valor gerado para `JWT_SECRET` no arquivo `.env`. Preserve o arquivo se já houver configuração local. As demais variáveis são `FRONTEND_ORIGIN=http://localhost:5173` e `DB_PATH=data/taskly.sqlite`.

```powershell
npm run db:init
npm run dev
```

A inicialização cria as tabelas quando necessário, sem apagar registros. O primeiro usuário deve ser criado na tela de cadastro; não há senha padrão.

Terminal 2, também a partir da raiz:

```powershell
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173**. A API usa http://localhost:3001. Use o hostname e porta configurados em FRONTEND_ORIGIN. Não execute JSON Server junto com Express na porta 3001.

Para compilar, execute `npm run typecheck` e `npm run build` em cada pasta. `npm start`, em backend, inicia o código compilado usando o mesmo `.env`.

## Estrutura

```text
backend/
├── schema.sql
├── .env.example
├── data/                   # banco local ignorado pelo Git
└── src/
    ├── database/           # conexão e SQL por entidade
    ├── routes/             # validação e contratos HTTP
    ├── auth.ts
    ├── validation.ts
    ├── types.ts
    └── server.ts
frontend/src/
├── components/
├── pages/
├── services/               # Fetch com credenciais
├── styles/
└── types/
docs/
├── etapa-07.md
├── arquitetura.md
├── postman/
└── evidencias/etapa-07/
tests/stage07.cjs
```

## API e testes

| Recurso | Endpoints |
| --- | --- |
| Auth | POST /auth/register, POST /auth/login, GET /auth/me, POST /auth/logout |
| Atividades | GET/POST /activities; GET/PATCH/DELETE /activities/:id |
| Disciplinas | GET/POST /subjects; PATCH/DELETE /subjects/:id |
| Categorias | GET/POST /categories; PATCH/DELETE /categories/:id |
| Subtarefas | GET/POST /activities/:activityId/subtasks; PATCH/DELETE /activities/:activityId/subtasks/:subtaskId |

Recursos exigem sessão. Nas escritas, envie Origin igual ao frontend configurado; no navegador isso é feito automaticamente. Erros seguem `{"error":"Mensagem."}`.

Importe a [coleção Postman da Etapa 07](docs/postman/Taskly-Etapa-07.postman_collection.json), configure email e password e execute os grupos na ordem. O Postman mantém o cookie. O [guia da etapa](docs/etapa-07.md) descreve os corpos, status, SQL e reprodução dos testes.

O script [tests/stage07.cjs](tests/stage07.cjs) verifica HTTP, SQLite e interface com um banco temporário. A parte de navegador requer Playwright disponibilizado no NODE_PATH do ambiente de teste e Chrome; não é necessário para executar o Taskly. Compile o backend, inicie o frontend e deixe a porta 3001 livre antes de executar `node tests/stage07.cjs`.

## Documentação e histórico

- [Proposta](docs/proposta.md)
- [Arquitetura atual](docs/arquitetura.md)
- [Etapa 02 — HTML semântico](docs/etapa-02.md)
- [Etapa 03 — CSS responsivo](docs/etapa-03.md)
- [Etapa 04 — Interatividade](docs/etapa-04.md)
- [Etapa 05 — Comunicação assíncrona](docs/etapa-05.md)
- [Etapa 06 — API REST em memória](docs/etapa-06.md)
- [Etapa 07 — SQLite, autenticação e CRUD](docs/etapa-07.md)
- [Evidências e validações](docs/evidencias.md)

O JSON Server, o array demonstrativo e as coleções anteriores permanecem como histórico; a aplicação atual não usa esses dados como fonte.

## Roadmap

- Etapa 01: proposta e especificação.
- Etapa 02: interfaces e navegação semântica.
- Etapa 03: responsividade.
- Etapa 04: pesquisa, filtros e validação.
- Etapa 05: comunicação HTTP com serviço simulado.
- Etapa 06: API Express e CRUD em memória.
- Etapa 07: SQLite, relacionamentos, autenticação e CRUD persistente.

## Limitações

Demonstração acadêmica local, sem preparação para produção. Não há OAuth, recuperação de senha, notificações ou organizações. O logout remove o cookie, mas não revoga cópias do JWT antes de sua expiração. A edição de título de subtarefa está disponível somente pela API. Revisões adicionais de segurança e operação seriam necessárias para produção.

## Licença

A licença será definida em etapa futura.
