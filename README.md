# Taskly

Sistema Web para organização e gerenciamento de atividades acadêmicas.

## Sobre o projeto

O Taskly é um projeto acadêmico incremental da disciplina Tecnologia de Construção de Software I. A aplicação pretende centralizar atividades, trabalhos, avaliações e prazos acadêmicos em uma interface Web simples.

## Problema

Informações acadêmicas costumam ficar distribuídas entre anotações, mensagens, agendas e diferentes plataformas. Essa dispersão dificulta acompanhar pendências, prioridades, prazos e atividades de cada disciplina.

## Objetivo

Permitir que estudantes cadastrem, organizem, acompanhem e consultem suas atividades acadêmicas de maneira centralizada.

## Funcionalidades previstas

- cadastrar, editar e excluir atividades;
- organizar atividades por disciplina e categoria;
- definir prioridade e marcar atividades como concluídas;
- pesquisar e filtrar atividades;
- identificar atrasos e prazos próximos;
- apresentar um resumo das atividades no Dashboard.

Estas funcionalidades constituem o escopo previsto. Na Etapa 01, apenas a fundação técnica e a especificação foram preparadas.

## Tecnologias

### Frontend

- React;
- TypeScript;
- Vite;
- CSS convencional.

### Backend

- Node.js;
- TypeScript;
- Express.

### Banco de dados

- SQLite, previsto para as próximas etapas.

## Estrutura do projeto

```text
taskly/
├── backend/          # API REST
├── docs/             # proposta, arquitetura e evidências
├── frontend/         # aplicação Web
├── tests/            # espaço para testes integrados futuros
├── .gitignore
├── LICENSE
└── README.md
```

## Documentação

- [Proposta e especificação inicial](docs/proposta.md)
- [Arquitetura inicial](docs/arquitetura.md)
- [Evidências](docs/evidencias.md)

## Execução

Pré-requisito: Node.js 20 ou versão superior.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite informará no terminal o endereço local da aplicação. Para gerar a versão de produção:

```bash
npm run build
```

### Backend

```bash
cd backend
npm install
npm run dev
```

A API utiliza por padrão a porta `3000`. Verificação de saúde:

```http
GET http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "application": "Taskly"
}
```

Para compilar e executar o código compilado:

```bash
npm run build
npm start
```

## Status do projeto

Fundação inicial executável, preparada para evolução incremental. O CRUD e a persistência ainda não fazem parte desta entrega.

## Etapa atual

Etapa 01 — Proposta e Especificação.

## Roadmap

- Etapa 01: proposta, especificação, arquitetura e scaffolds;
- próximas etapas: modelo de dados SQLite, operações da API, interfaces funcionais e testes automatizados.

O detalhamento das etapas seguintes será ajustado aos requisitos da disciplina.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
