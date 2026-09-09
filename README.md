# Taskly

Sistema Web para organização e gerenciamento de atividades acadêmicas.

## Sobre o projeto

O Taskly é um projeto acadêmico incremental da disciplina Tecnologia de Construção de Software I. A Etapa 01 definiu a proposta e o domínio; a Etapa 02 transformou essa base em um protótipo Web navegável com HTML semântico; e a Etapa 03 comprovou sua adaptação responsiva em desktop, tablet e smartphone.

## Problema

Informações acadêmicas costumam ficar distribuídas entre anotações, mensagens, agendas e diferentes plataformas. Essa dispersão dificulta acompanhar pendências, prioridades, prazos e atividades de cada disciplina.

## Objetivo

Permitir que estudantes cadastrem, organizem, acompanhem e consultem suas atividades acadêmicas de maneira centralizada.

## Interfaces representadas

- Dashboard com resumo e próximas atividades;
- listagem de atividades com pesquisa e filtros visuais;
- formulário estrutural para criar ou editar uma atividade;
- listagem de disciplinas e suas quantidades demonstrativas.

A navegação entre páginas está funcional. Os dados são estáticos e as operações de salvar, excluir, pesquisar e filtrar ainda não possuem persistência ou regras reais.

## Tecnologias

### Frontend implementado

- React;
- TypeScript;
- Vite;
- React Router;
- CSS convencional.

### Backend e banco de dados

Node.js, Express e SQLite permanecem previstos para etapas futuras. Não há API ou banco de dados funcional nesta entrega.

## Estrutura do projeto

```text
taskly/
├── backend/               # reservado para etapas futuras
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   ├── evidencias/
│   │   └── etapa-03/       # nove capturas responsivas
│   └── evidencias.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
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
- [Evidências](docs/evidencias.md)

## Execução

Pré-requisito: Node.js 20.19+ ou 22.12+.

```bash
cd frontend
npm install
npm run dev
```

O Vite informará o endereço local no terminal. Para validar tipagem e gerar o build:

```bash
npm run typecheck
npm run build
```

## Status do projeto

Frontend responsivo concluído e validado nas quatro interfaces. As nove capturas acadêmicas representativas estão disponíveis em `docs/evidencias/etapa-03/`.

## Etapa atual

Etapa 03 — Interface Responsiva com CSS.

## Roadmap

- Etapa 01: proposta, especificação e arquitetura inicial;
- Etapa 02: interfaces estruturais, navegação e HTML semântico;
- Etapa 03: CSS responsivo comprovado em desktop, tablet e smartphone;
- próximas etapas: comportamento funcional, API, persistência e testes conforme os requisitos da disciplina.

## Licença

A licença do projeto será definida em etapa futura.
