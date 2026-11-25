# Taskly — Arquitetura

## Evolução

A Etapa 05 utilizou JSON Server. A Etapa 06 introduziu Express com array em memória. A Etapa 07 mantém Express e substitui o array por SQLite, adicionando usuários, autenticação, isolamento e entidades relacionadas.

```text
React + TypeScript
        ↓↑ HTTP / JSON + cookie HttpOnly
Node.js + Express
        ↓↑ módulos database/ com SQL parametrizado
SQLite: users, subjects, categories, activities, subtasks
```

## Frontend

App.tsx verifica a sessão por /auth/me e protege as rotas. A sessão é compartilhada por propriedades simples, sem Context API global. O layout recebe o usuário e a ação de logout. Cada serviço contém o Fetch do recurso correspondente e utiliza credentials: include.

As páginas apresentam carregamento, sucesso e erro. Atividades mantém pesquisa e filtros locais; Dashboard calcula os indicadores com as atividades recebidas. Nova/Editar utiliza IDs de disciplina e categoria. Disciplinas, Categorias e Detalhes oferecem as operações dos registros relacionados.

## Backend e banco

As rotas validam parâmetros e corpos. O módulo auth.ts verifica JWT e a origem das escritas. O ID do usuário vem da sessão. Os arquivos database/ executam INSERT, SELECT, UPDATE e DELETE com parâmetros vinculados.

db.ts abre o arquivo configurado em DB_PATH, ativa foreign_keys e executa schema.sql com CREATE TABLE IF NOT EXISTS. Nenhum usuário é pré-cadastrado. O cadastro do usuário e suas quatro categorias iniciais ocorre em uma transação.

A atividade referencia usuário, disciplina e categoria. Chaves estrangeiras compostas garantem o mesmo proprietário. Subtarefas referenciam a atividade e são removidas em cascata; disciplinas e categorias em uso não podem ser excluídas. Os dados permanecem após reiniciar.

## Comunicação e sessão

Frontend padrão em http://localhost:5173; API em http://localhost:3001. CORS aceita somente FRONTEND_ORIGIN com credenciais. O servidor exige o mesmo Origin nas escritas para proteção básica contra CSRF.

O cookie é HttpOnly e SameSite=Lax, com Secure quando a origem configurada usa HTTPS. O segredo JWT vem do ambiente; o token expira em duas horas. Nenhuma senha, token ou banco local deve ser versionado. A autenticação é voltada à demonstração local e requer revisões adicionais antes de uso em produção.

## Referências

- [Modelo e esquema SQL](../backend/schema.sql)
- [Contratos e justificativa das interfaces](etapa-07.md)
- [Coleção Postman](postman/Taskly-Etapa-07.postman_collection.json)
- [Evidências](evidencias.md)
