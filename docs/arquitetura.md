# Taskly — Arquitetura

## Visão geral

Na Etapa 06, o frontend React consulta e cadastra atividades na API REST do Taskly. O Express valida as entradas e manipula um array de atividades em memória.

```text
Navegador: React + TypeScript + Vite
                 ↓↑ Fetch / HTTP / JSON
API: Node.js + Express + TypeScript
                 ↓↑
Array de atividades em memória
```

## Frontend

O módulo `frontend/src/services/activityService.ts` concentra as chamadas GET e POST à API local. As páginas cuidam dos estados de carregamento, sucesso e erro, da validação do formulário, da pesquisa e dos filtros. Dashboard, Disciplinas e o formulário de edição demonstrativa ainda usam dados locais.

## Backend

| Arquivo | Responsabilidade |
| --- | --- |
| `backend/src/server.ts` | Configura Express, CORS e leitura de JSON, monta as rotas e inicia o servidor local. |
| `backend/src/routes/activities.ts` | Implementa o CRUD REST de atividades, valida IDs e corpos e produz as respostas HTTP. |
| `backend/src/data/activities.ts` | Inicializa o array com três atividades. |
| `backend/src/types.ts` | Define o formato de uma atividade e os valores de status e prioridade. |

O servidor atende em `http://localhost:3001`. O CORS permite que o frontend aberto em `localhost` ou `127.0.0.1` com uma porta de desenvolvimento leia as respostas. O [guia da API](etapa-06.md) descreve o contrato.

## Armazenamento e evolução

Os dados existem somente no processo do Express. Os três registros iniciais retornam a cada reinício. SQLite segue como possibilidade de evolução. Não há autenticação nesta etapa.

O [serviço simulado da Etapa 05](etapa-05.md) permanece no histórico com a sua base JSON. Ele não participa da arquitetura atual e ocupa a mesma porta da API quando iniciado.
