# Taskly

Sistema Web para organização e gerenciamento de atividades acadêmicas.

## Sobre o projeto

O Taskly é um projeto acadêmico incremental da disciplina Tecnologia de Construção de Software I. A Etapa 01 definiu a proposta e o domínio; a Etapa 02 transforma essa base em um protótipo Web navegável com HTML semântico.

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

Protótipo estrutural do frontend concluído, com quatro interfaces navegáveis, dados mockados, HTML semântico e formulário com labels associados.

## Etapa atual

Etapa 02 — Protótipo Estrutural com HTML Semântico.

## Roadmap

- Etapa 01: proposta, especificação e arquitetura inicial;
- Etapa 02: interfaces estruturais, navegação e HTML semântico;
- próximas etapas: comportamento funcional, API, persistência e testes conforme os requisitos da disciplina.

## Licença

A licença do projeto será definida em etapa futura.
