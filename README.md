# Taskly

Sistema Web para organização e gerenciamento de atividades acadêmicas.

## Sobre o projeto

O Taskly é um projeto acadêmico incremental da disciplina Tecnologia de Construção de Software I. As primeiras etapas definiram a proposta e construíram o frontend navegável, responsivo e interativo. A Etapa 05 introduziu a comunicação HTTP com um serviço simulado; a Etapa 06 implementa a API REST de atividades com Express.

## Problema

Informações acadêmicas costumam ficar distribuídas entre anotações, mensagens, agendas e diferentes plataformas. Essa dispersão dificulta acompanhar pendências, prioridades, prazos e atividades de cada disciplina.

## Objetivo

Permitir que estudantes cadastrem, organizem, acompanhem e consultem suas atividades acadêmicas de maneira centralizada.

## Interfaces representadas

- Dashboard com resumo e próximas atividades;
- listagem de atividades com pesquisa e filtros funcionais;
- formulário com validação dos campos obrigatórios e cadastro pela API;
- listagem de disciplinas e suas quantidades demonstrativas.

A listagem consulta atividades por GET e o cadastro envia por POST à API Express. A interface apresenta carregamento, sucesso e erro e aplica pesquisa e filtros no navegador. Dashboard, Disciplinas e edição demonstrativa continuam utilizando dados locais. PATCH e DELETE estão disponíveis pela API.

## Tecnologias

### Frontend implementado

- React;
- TypeScript;
- Vite;
- React Router;
- CSS convencional;
- Fetch API para enviar e receber JSON por HTTP.

### Backend e banco de dados

Node.js, TypeScript e Express implementam o servidor; CORS permite acesso pelo frontend local e `tsx` executa TypeScript em desenvolvimento. Os dados ficam em memória e voltam às três atividades iniciais ao reiniciar a API. SQLite continua previsto para uma etapa futura.

## Estrutura do projeto

```text
taskly/
├── backend/
│   ├── src/               # servidor, rotas, tipos e dados em memória
│   └── package.json
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   ├── etapa-04.md
│   ├── etapa-05.md
│   ├── etapa-06.md
│   ├── postman/
│   ├── evidencias/
│   │   ├── etapa-03/       # nove capturas responsivas
│   │   ├── etapa-04/       # cinco capturas de interatividade
│   │   └── etapa-05/       # cinco capturas de comunicação assíncrona
│   └── evidencias.md
├── frontend/
│   ├── mock-api/db.json    # base histórica da Etapa 05
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── tests/                 # reservado para testes futuros
├── .gitignore
└── README.md
```

## Documentação

- [Proposta e especificação inicial](docs/proposta.md)
- [Arquitetura atual](docs/arquitetura.md)
- [Etapa 02 — Protótipo estrutural](docs/etapa-02.md)
- [Etapa 03 — Interface responsiva](docs/etapa-03.md)
- [Etapa 04 — Interatividade com JavaScript](docs/etapa-04.md)
- [Etapa 05 — Modularização e Comunicação Assíncrona](docs/etapa-05.md)
- [Etapa 06 — API REST da Aplicação](docs/etapa-06.md)
- [Coleção Postman da Etapa 06](docs/postman/Taskly-Etapa-06.postman_collection.json)
- [Evidências](docs/evidencias.md)

## Execução

Pré-requisito: Node.js 20.19 ou superior na linha 20, ou 22.12 ou superior. Abra dois terminais na raiz `taskly`.

Terminal 1 — API Express:

```bash
cd backend
npm install
npm run dev
```

Terminal 2 — interface:

```bash
cd frontend
npm install
npm run dev
```

Mantenha os dois terminais ativos. O Vite informa o endereço da interface. A API está em `http://localhost:3001`. O JSON Server foi preservado para reproduzir a Etapa 05; não execute `npm run mock-api` com o Express na mesma porta.

Para validar a tipagem e gerar o build, execute em cada pasta (`backend` e `frontend`):

```bash
npm run typecheck
npm run build
```

A partir de `backend`, `npm start` executa a versão compilada.

## Endpoints

| Método | Rota | Sucesso |
| --- | --- | --- |
| GET | `/activities` | `200` — lista de atividades |
| GET | `/activities/:id` | `200` — atividade encontrada |
| POST | `/activities` | `201` — atividade criada |
| PATCH | `/activities/:id` | `200` — atividade atualizada |
| DELETE | `/activities/:id` | `204` — exclusão sem corpo |

Importe a [coleção Postman](docs/postman/Taskly-Etapa-06.postman_collection.json) ou consulte os [exemplos HTTP](docs/etapa-06.md#exemplos-de-requisições-e-respostas).

## Status do projeto

API Express com cinco operações sobre atividades. O frontend usa lista e cadastro; alteração e exclusão são demonstradas pela API. Sem banco de dados ou autenticação. O Dashboard e a página de Disciplinas permanecem demonstrativos.

## Etapa atual

Etapa 06 — API REST da Aplicação.

## Roadmap

- Etapa 01: proposta, especificação e arquitetura inicial;
- Etapa 02: interfaces estruturais, navegação e HTML semântico;
- Etapa 03: CSS responsivo comprovado em desktop, tablet e smartphone;
- Etapa 04: pesquisa, filtros e validação manual de formulário;
- Etapa 05: modularização, Fetch API, GET/POST e estados da comunicação com serviço simulado;
- Etapa 06: API REST Express com consulta, cadastro, alteração e exclusão de atividades em memória;
- próximas etapas: persistência e demais incrementos conforme os requisitos da disciplina.

## Licença

A licença do projeto será definida em etapa futura.
