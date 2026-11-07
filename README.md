# Taskly

Sistema Web para organização e gerenciamento de atividades acadêmicas.

## Sobre o projeto

O Taskly é um projeto acadêmico incremental da disciplina Tecnologia de Construção de Software I. A Etapa 01 definiu a proposta e o domínio; a Etapa 02 transformou essa base em um protótipo Web navegável com HTML semântico; a Etapa 03 comprovou sua adaptação responsiva; a Etapa 04 adicionou interatividade básica com React e TypeScript; e a Etapa 05 separou a comunicação HTTP em um módulo para consumir um serviço simulado local.

## Problema

Informações acadêmicas costumam ficar distribuídas entre anotações, mensagens, agendas e diferentes plataformas. Essa dispersão dificulta acompanhar pendências, prioridades, prazos e atividades de cada disciplina.

## Objetivo

Permitir que estudantes cadastrem, organizem, acompanhem e consultem suas atividades acadêmicas de maneira centralizada.

## Interfaces representadas

- Dashboard com resumo e próximas atividades;
- listagem de atividades com pesquisa e filtros funcionais;
- formulário com validação dos campos obrigatórios e cadastro no serviço simulado;
- listagem de disciplinas e suas quantidades demonstrativas.

A listagem consulta atividades por GET, e o cadastro envia por POST ao JSON Server. Carregamento, sucesso e erro são apresentados na interface. Pesquisa, filtros combináveis e validação manual continuam funcionais. Dashboard, Disciplinas e edição demonstrativa utilizam dados locais; a edição não envia alterações ao servidor, e a exclusão permanece desabilitada.

## Tecnologias

### Frontend implementado

- React;
- TypeScript;
- Vite;
- React Router;
- CSS convencional.
- JSON Server 0.17.4 para simular um serviço HTTP local durante o desenvolvimento.

### Backend e banco de dados

Node.js, Express e SQLite permanecem previstos para etapas futuras. Esta entrega utiliza somente JSON Server como API simulada, com gravação em arquivo JSON. Não existe backend Taskly próprio ou banco de dados real.

## Estrutura do projeto

```text
taskly/
├── backend/               # reservado para etapas futuras
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   ├── etapa-04.md
│   ├── etapa-05.md
│   ├── evidencias/
│   │   ├── etapa-03/       # nove capturas responsivas
│   │   ├── etapa-04/       # cinco capturas de interatividade
│   │   └── etapa-05/       # cinco capturas de comunicação assíncrona
│   └── evidencias.md
├── frontend/
│   ├── mock-api/db.json    # base inicial do serviço simulado
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
- [Arquitetura inicial](docs/arquitetura.md)
- [Etapa 02 — Protótipo estrutural](docs/etapa-02.md)
- [Etapa 03 — Interface responsiva](docs/etapa-03.md)
- [Etapa 04 — Interatividade com JavaScript](docs/etapa-04.md)
- [Etapa 05 — Modularização e Comunicação Assíncrona](docs/etapa-05.md)
- [Evidências](docs/evidencias.md)

## Execução

Pré-requisito: Node.js 20.19+ ou 22.12+. Abra dois terminais na raiz `taskly`. O `package.json` fica na pasta `frontend`.

Terminal 1 — serviço simulado:

```bash
cd frontend
npm install
npm run mock-api
```

Terminal 2 — interface:

```bash
cd frontend
npm run dev
```

Mantenha os dois terminais ativos. A coleção está em `http://localhost:3001/activities`, e o Vite informará o endereço da interface. Cadastros modificam `frontend/mock-api/db.json`. Para validar tipagem e gerar o build, em `frontend`:

```bash
npm run typecheck
npm run build
```

## Status do projeto

Frontend responsivo com listagem e cadastro assíncronos no serviço simulado, estados de carregamento/erro/sucesso, pesquisa, filtros e validação manual. Backend próprio e banco real permanecem previstos para etapas futuras. As evidências atuais estão em `docs/evidencias/etapa-05/`.

## Etapa atual

Etapa 05 — Modularização e Comunicação Assíncrona.

## Roadmap

- Etapa 01: proposta, especificação e arquitetura inicial;
- Etapa 02: interfaces estruturais, navegação e HTML semântico;
- Etapa 03: CSS responsivo comprovado em desktop, tablet e smartphone;
- Etapa 04: pesquisa, filtros e validação manual de formulário;
- Etapa 05: modularização, Fetch API, GET/POST e estados da comunicação com serviço simulado;
- próximas etapas: backend próprio, banco de dados e testes conforme os requisitos da disciplina.

## Licença

A licença do projeto será definida em etapa futura.
