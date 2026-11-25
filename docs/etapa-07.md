# Etapa 07 — Persistência e CRUD com Banco de Dados

## Objetivo e evolução

A Etapa 05 usou JSON Server, e a Etapa 06 implementou a API Express com um array temporário. Nesta etapa, o Express passa a usar SQLite. Usuários, disciplinas, categorias, atividades e subtarefas ficam em tabelas relacionadas, e cada estudante acessa somente os próprios dados.

Sair do array evita perder os cadastros quando o processo é encerrado. Separar as entidades permite relacionar várias atividades à mesma disciplina ou categoria sem repetir seus dados em cada registro. Os documentos e a coleção anteriores continuam como registros das entregas passadas; os contratos atuais exigem autenticação.

## Escolha do SQLite e tecnologias

SQLite é relacional, funciona em arquivo local e não exige um servidor de banco separado. É adequado à execução acadêmica e ao estudo de SQL, chaves e relacionamentos. A aplicação usa SQL parametrizado com `better-sqlite3`, sem ORM.

O backend utiliza Express, TypeScript, bcryptjs e jsonwebtoken. O frontend mantém React, Vite, React Router, Fetch e CSS convencional. A versão instalada do better-sqlite3 requer Node.js 22 ou superior; o projeto exige **Node.js 22.12+**, e foi desenvolvido neste ambiente com Node.js 24.3.0.

## Modelo do banco e entidades

O esquema completo está em [backend/schema.sql](../backend/schema.sql). Há exatamente cinco tabelas principais:

| Tabela | Campos | Responsabilidade |
| --- | --- | --- |
| users | id, name, email, password_hash | Identifica o estudante; e-mail único e senha representada por hash. |
| subjects | id, user_id, name, professor | Disciplinas de cada usuário. |
| categories | id, user_id, name | Classificações das atividades de cada usuário. |
| activities | id, user_id, subject_id, category_id, title, description, due_date, priority, status | Obrigações acadêmicas relacionadas a usuário, disciplina e categoria. |
| subtasks | id, activity_id, title, completed | Etapas menores de uma atividade. |

SQLite também mantém sua tabela interna `sqlite_sequence` para IDs AUTOINCREMENT; ela não é uma sexta entidade do domínio.

## Relacionamentos e integridade

```text
users 1 ── N subjects
users 1 ── N categories
users 1 ── N activities
subjects 1 ── N activities
categories 1 ── N activities
activities 1 ── N subtasks
```

`id` é a chave primária de cada registro. As chaves estrangeiras representam os vínculos acima. Os pares `(subject_id, user_id)` e `(category_id, user_id)` das atividades referenciam pares únicos nas tabelas de origem. Assim, o próprio banco rejeita relacionamentos entre proprietários diferentes, além da verificação feita pela API.

`PRAGMA foreign_keys = ON` é aplicado ao abrir cada conexão. `NOT NULL`, `UNIQUE` e `CHECK` protegem obrigatoriedade, e-mails, prioridade, status e o valor 0/1 das subtarefas. Excluir uma atividade remove as subtarefas por CASCADE. Disciplinas e categorias em uso possuem RESTRICT e retornam HTTP 409 quando sua exclusão é tentada.

## Organização do código

- `backend/src/database/db.ts`: abre a conexão, ativa as chaves estrangeiras e executa o esquema.
- `backend/src/database/users.ts`, `subjects.ts`, `categories.ts`, `activities.ts` e `subtasks.ts`: concentram as consultas SQL.
- `backend/src/routes/`: valida os corpos e parâmetros, chama o módulo de banco e responde por HTTP.
- `backend/src/auth.ts`: verifica o cookie JWT e a origem das operações de escrita.
- `backend/src/validation.ts`: pequenas funções compartilhadas para texto, IDs e datas.
- `frontend/src/services/`: Fetch por funcionalidade; `api.ts` inclui credenciais e traduz erros HTTP.

O SQL fica fora das rotas para permitir entender separadamente o contrato HTTP e o acesso ao banco. Não foram adicionadas camadas de controllers, serviços de negócio ou ORM.

## Criação do banco e execução local

Na raiz do projeto, abra dois terminais. No primeiro:

```powershell
cd backend
npm install
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Copie o valor aleatório exibido para `JWT_SECRET` no arquivo `.env`. Não execute novamente o comando de cópia sobre uma configuração já existente.

```dotenv
JWT_SECRET=cole_aqui_o_valor_aleatorio_gerado
FRONTEND_ORIGIN=http://localhost:5173
DB_PATH=data/taskly.sqlite
```

O segredo deve ter pelo menos 32 caracteres. O arquivo `.env.example` versionado não contém um segredo. `.env`, o banco e seus auxiliares são ignorados pelo Git.

```powershell
npm run db:init
npm run dev
```

`db:init` cria a pasta, o arquivo e as tabelas com `CREATE TABLE IF NOT EXISTS`. A abertura normal do servidor também inicializa o esquema. Não há DROP nem limpeza dos dados. O banco padrão é `backend/data/taskly.sqlite`; DB_PATH pode indicar outro arquivo, inclusive um caminho absoluto para testes.

No segundo terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173**. Use o mesmo hostname configurado em FRONTEND_ORIGIN; não misture localhost e 127.0.0.1. Se alterar a origem ou porta do frontend, atualize a variável e reinicie a API. O backend permanece em http://localhost:3001. JSON Server não deve ser iniciado na mesma porta.

Para compilar, execute `npm run typecheck` e `npm run build` em cada pasta. No backend, `npm start` executa a versão compilada, carregando o mesmo `.env`.

O banco novo não recebe usuário ou senha padrão. Cadastre o primeiro estudante pela aplicação. O cadastro cria quatro categorias iniciais; disciplinas e atividades começam vazias.

## Autenticação e isolamento

O cadastro valida nome, e-mail e senha (mínimo de oito caracteres, máximo de 72 bytes, limite do bcrypt). O e-mail é normalizado para minúsculas. bcryptjs produz o hash com custo 12; o hash não é retornado pela API.

O login compara a senha e gera JWT HS256 com identificação do usuário e expiração de duas horas. O cookie `taskly_session` usa HttpOnly, SameSite=Lax e, quando a origem configurada utiliza HTTPS, Secure. O React não guarda o token em localStorage. As chamadas Fetch incluem `credentials: "include"`.

O servidor verifica a assinatura, a expiração, o emissor e a existência do usuário antes de atender os recursos. As consultas usam o usuário da sessão, nunca um user_id do corpo. Um registro de outro estudante responde 404. O acesso a subtarefas verifica primeiro a propriedade da atividade.

Nas escritas, inclusive cadastro e login, a API exige que o cabeçalho Origin seja exatamente FRONTEND_ORIGIN. Essa verificação e SameSite fornecem proteção básica contra CSRF na demonstração local. Postman e curl também precisam enviar esse cabeçalho. CORS permite somente essa origem com credenciais.

O logout limpa o cookie. Não há lista de revogação no servidor; uma cópia de um JWT continua válida até expirar. Não há rate limiting, recuperação de senha, confirmação de e-mail ou exclusão de conta. Revisões adicionais seriam necessárias para produção.

## Endpoints e contratos

Todas as respostas de erro seguem `{"error":"Mensagem."}`.

| Recurso | Operações |
| --- | --- |
| Auth | POST /auth/register (201), POST /auth/login (200), GET /auth/me (200), POST /auth/logout (204) |
| Activities | GET /activities, GET /activities/:id (200), POST /activities (201), PATCH /activities/:id (200), DELETE /activities/:id (204) |
| Subjects | GET /subjects (200), POST /subjects (201), PATCH /subjects/:id (200), DELETE /subjects/:id (204) |
| Categories | GET /categories (200), POST /categories (201), PATCH /categories/:id (200), DELETE /categories/:id (204) |
| Subtasks | GET /activities/:activityId/subtasks (200), POST na mesma rota (201), PATCH e DELETE /activities/:activityId/subtasks/:subtaskId (200/204) |

Erros: 400 para dados inválidos; 401 sem sessão; 403 para origem de escrita incorreta; 404 para recurso inexistente ou inacessível; 409 para e-mail duplicado ou conflito de integridade; 500 para falha inesperada de persistência. JSON malformado retorna 400 e corpos excessivos retornam 413.

No cadastro, envie `{"name":"Estudante","email":"estudante@example.com","password":"uma_senha_definida_por_voce"}`. No login, envie apenas email e password. /auth/me retorna id, name e email.

Disciplinas recebem `{"name":"Banco de Dados","professor":"Professora Ana"}`; categorias recebem `{"name":"Trabalho"}`; subtarefas recebem `{"title":"Criar modelo ER"}`. O PATCH de uma subtarefa aceita title e completed (boolean).

Uma atividade recebe:

```json
{
  "title": "Projeto de Banco de Dados",
  "description": "Criar e consultar as tabelas",
  "subjectId": 1,
  "categoryId": 4,
  "dueDate": "2026-12-10",
  "priority": "HIGH",
  "status": "PENDING"
}
```

Use IDs retornados para o usuário atual, não valores fixos presumidos. A resposta inclui os mesmos dados mais id, subject, category e dueDateLabel. Os nomes vêm de JOINs; o rótulo é derivado da data. O PATCH aceita parte dos campos de entrada. A API rejeita corpos vazios, campos desconhecidos, IDs de relações inacessíveis, título vazio, data impossível e enumerações inválidas.

## Exemplos CRUD com SQL e HTTP

Os comandos abaixo representam as operações parametrizadas nos módulos database. Os parâmetros são vinculados pela biblioteca, não interpolados com texto do usuário.

```sql
-- POST /subjects
INSERT INTO subjects(user_id, name, professor) VALUES (?, ?, ?);

-- GET /activities
SELECT a.id, a.title, s.name AS subject, c.name AS category
FROM activities a
JOIN subjects s ON s.id = a.subject_id AND s.user_id = a.user_id
JOIN categories c ON c.id = a.category_id AND c.user_id = a.user_id
WHERE a.user_id = ?;

-- PATCH /categories/:id
UPDATE categories SET name = ? WHERE id = ? AND user_id = ?;

-- DELETE /activities/:id
DELETE FROM activities WHERE id = ? AND user_id = ?;
```

Para curl, faça login com cookie jar (`-c cookies.txt`) e envie-o nas operações seguintes (`-b cookies.txt`). Use `-H "Origin: http://localhost:5173"` e `-H "Content-Type: application/json"` em cada escrita. Não versione o cookie jar.

## Justificativa das novas telas e alterações na interface

Na Etapa 06 existiam Dashboard, Atividades, Nova/Editar atividade e Disciplinas. A edição e os indicadores ainda eram demonstrativos. A existência de usuários e tabelas relacionadas tornou necessário oferecer entrada para autenticação e gerenciamento dos registros persistidos.

| Tela | Tipo | Justificativa |
| --- | --- | --- |
| Login | Nova | Identifica o estudante para acessar somente os próprios registros. |
| Cadastro | Nova | Cria usuários e hashes de senha no SQLite. |
| Categorias | Nova | Gerencia as classificações relacionadas às atividades. |
| Detalhes da atividade | Nova | Consulta dados completos e gerencia subtarefas. |
| Dashboard | Atualizada | Calcula os indicadores com atividades reais do usuário. |
| Atividades | Atualizada | Consulta e filtra os registros persistidos da sessão. |
| Nova/Editar atividade | Atualizada | Cadastra e altera atividades reais vinculadas por IDs. |
| Disciplinas | Atualizada | Permite CRUD das disciplinas com nome e professor. |

**Login.** Foi necessário identificar o estudante porque os registros passaram a ter proprietário. A página envia credenciais ao servidor; a sessão determina quais linhas das tabelas são acessíveis, evitando misturar dados de diferentes usuários.

**Cadastro.** Permite que o primeiro estudante crie a própria conta, sem senha padrão. Os dados são gravados em users com hash de senha, e a transação cria as categorias iniciais associadas ao novo usuário.

**Categorias.** O formulário de atividade precisa de categorias reais, não de textos fixos. Uma única página oferece criação, alteração e exclusão dos registros de categories; a API impede a exclusão de uma classificação em uso.

**Detalhes da atividade.** Reúne as informações da atividade e suas etapas menores. Cada subtarefa está ligada por activity_id, pode ser criada, concluída e excluída. A página também permite abrir a edição ou excluir a atividade.

No Dashboard, pendentes e concluídas usam status, atrasadas são pendentes com prazo anterior ao dia local atual, e próximas atividades são as cinco pendências futuras mais próximas. Não existe endpoint de estatísticas adicional. A listagem mantém pesquisa, filtros por status, disciplina, categoria e prioridade, contador e estado vazio.

O formulário de atividade carrega disciplinas/categorias reais e usa subjectId/categoryId; a edição consulta a atividade pelo ID e envia PATCH. Disciplinas mostra contagens reais. O layout identifica o usuário e oferece Sair. App.tsx consulta /auth/me na abertura e protege todas as rotas, exceto /login e /cadastro.

Essas mudanças tornam possível utilizar o CRUD e os relacionamentos sem ferramentas externas e demonstram como os mesmos registros permanecem disponíveis depois de reiniciar o backend. O design e os breakpoints anteriores foram mantidos, com ajustes de largura para os novos links de navegação.

## Testes e evidências

O script [tests/stage07.cjs](../tests/stage07.cjs) usa Node, requisições HTTP reais, um SQLite temporário e um navegador de teste. Ele não toca o banco de uso normal. Primeiro compile o backend e inicie o frontend em localhost:5173; a porta 3001 precisa estar livre.

Para executar os testes HTTP e de interface, disponibilize Playwright no NODE_PATH do ambiente de teste, com Chrome instalado, e execute `node tests/stage07.cjs`. Playwright não é dependência da aplicação; nesta entrega foi utilizada a biblioteca disponibilizada pelo ambiente de desenvolvimento.

O teste cria dois usuários, verifica hashes, e-mails duplicados, login/logout, CSRF, CRUD, relações inválidas, cascata/restrição e isolamento. Também bloqueia temporariamente o banco de teste para verificar o erro de persistência. A sequência cadastrar → consultar → reiniciar → consultar novamente demonstra a persistência. No navegador, cobre os fluxos completos e as resoluções 1440×1000, 768×1024 e 390×844.

A [coleção Postman](postman/Taskly-Etapa-07.postman_collection.json) mantém cinco grupos: Auth, Subjects, Categories, Activities e Subtasks. Importe o JSON, defina email e password nas variáveis e execute os grupos na ordem. O cookie é mantido automaticamente. IDs retornados são guardados pelas requisições. Os registros descartáveis permitem demonstrar DELETE sem destruir os relacionamentos necessários às requisições seguintes. A coleção da Etapa 06 foi preservada.

As capturas e o resultado efetivamente verificado são descritos em [evidências](evidencias.md). Não existe alegação de teste gráfico do Postman quando apenas as requisições da coleção foram executadas por HTTP.

## Limitações

Aplicação acadêmica local, sem preparação para produção. Não há recuperação de senha, OAuth, anexos, notificações, organizações ou administração. A subtarefa pode ter seu título alterado pela API; na interface são oferecidas criação, conclusão e exclusão. Não há migração automática dos arrays históricos: o banco começa vazio, e os exemplos das etapas anteriores continuam preservados no Git.
