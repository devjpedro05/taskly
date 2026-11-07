# Etapa 05 — Modularização e Comunicação Assíncrona

## 1. Objetivo

Preparar o frontend do Taskly para consumir um serviço HTTP e organizar a comunicação em um módulo separado. A etapa demonstra consulta, submissão, Promises, `async/await` e estados de carregamento, sucesso e erro, preservando a pesquisa, os filtros e a validação manual da Etapa 04.

Este arquivo segue a convenção de documentação incremental do repositório.

## 2. Serviço utilizado

O JSON Server **0.17.4** é uma dependência de desenvolvimento e funciona como serviço simulado acadêmico. Ele lê e grava `frontend/mock-api/db.json`, que inicialmente contém as mesmas três atividades de `mockData.ts`.

- endereço: `http://localhost:3001`;
- coleção: `http://localhost:3001/activities`;
- IDs: numéricos, gerados pelo serviço ao cadastrar;
- os dados enviados ficam no arquivo JSON local, sem banco de dados real.

## 3. Modularização

| Pasta ou módulo | Responsabilidade |
| --- | --- |
| `pages/` | Eventos, estados React, validação e apresentação das interfaces |
| `services/activityService.ts` | Comunicação HTTP de atividades, sem JSX ou estado React |
| `types/domain.ts` | Contratos `Activity`, `NewActivity`, prioridade, status e disciplina |
| `data/mockData.ts` | Dados locais usados no Dashboard, em Disciplinas e na edição demonstrativa |
| `mock-api/db.json` | Coleção inicial do serviço simulado |

O módulo `activityService.ts` exporta apenas `getActivities(): Promise<Activity[]>` e `createActivity(activity: NewActivity): Promise<Activity>`. A interface explícita `NewActivity` representa os dados do cadastro antes de receber um ID.

## 4. Consulta assíncrona

```http
GET /activities
```

```text
ActivitiesPage → getActivities() → fetch() → JSON Server
              → resposta JSON → setActivities() → lista renderizada
```

Na montagem da página, `useEffect` chama `loadActivities`. Essa função limpa o erro anterior, ativa `isLoading` e usa `try/catch/finally` para carregar os dados. O serviço verifica `response.ok`; respostas HTTP sem sucesso lançam um erro. Falhas de rede ou leitura do JSON também chegam ao `catch` da página.

Após o carregamento, a pesquisa e os quatro filtros continuam usando `filter()` sobre o array recebido; `map()` renderiza as atividades. O contador considera os resultados filtrados. A mensagem sem resultados só aparece quando a consulta terminou com sucesso.

## 5. Submissão assíncrona

```http
POST /activities
Content-Type: application/json
```

```text
ActivityFormPage → preventDefault → FormData → validateForm
                → NewActivity → createActivity() → fetch() → JSON Server
```

O formulário mantém as quatro regras de obrigatoriedade: título após `trim()`, disciplina, categoria e prazo. Se houver erro de validação, o fluxo termina antes de executar o POST.

Com campos válidos, `handleSubmit` monta um `NewActivity` e aguarda `createActivity`. O corpo é enviado por `JSON.stringify`, com método POST e cabeçalho JSON. A função `formatDueDate` usa `split()` para converter, por exemplo, `2026-11-20` em `20/11/2026`, sem biblioteca de datas.

O `try` aguarda a resposta; o `catch` apresenta a falha; o `finally` reabilita o botão. O formulário permanece na página após o sucesso. Ao voltar à listagem, uma nova consulta inclui o cadastro realizado.

## 6. Promises e async/await

Uma Promise representa um resultado que estará disponível depois. `fetch()` retorna uma Promise; `await` aguarda a resposta dentro de uma função `async`, sem bloquear a interface.

O serviço retorna Promises tipadas. As páginas aguardam essas funções e tratam o resultado com `try/catch/finally`. O código HTTP fica no serviço; os estados visuais ficam nas páginas.

## 7. Estados

| Operação | Carregamento | Sucesso | Erro |
| --- | --- | --- | --- |
| GET | `isLoading`: **Carregando atividades...** na área da lista | Atividades e contador exibidos | `loadError`: **Não foi possível carregar as atividades.** e botão **Tentar novamente** |
| POST | `isSubmitting`: botão desabilitado com **Enviando...** | `successMessage`: **Atividade enviada com sucesso.** | `submitError`: **Não foi possível enviar a atividade.** |

Uma nova tentativa limpa as mensagens anteriores de erro e sucesso. O carregamento termina no `finally`, inclusive quando ocorre falha. A consulta em andamento e as mensagens de sucesso usam `role="status"`; erros de comunicação usam `role="alert"`. No envio, o botão informa **Enviando...** e fica desabilitado.

## 8. Situações inválidas

- **Serviço offline:** o GET ou POST falha, e a página apresenta a mensagem correspondente. O GET pode ser repetido pelo botão; o POST pode ser reenviado após religar o serviço.
- **Resposta HTTP sem sucesso:** o serviço verifica `response.ok` e lança erro, tratado pela página. Nos testes, respostas 503 foram simuladas apenas no navegador.
- **Formulário inválido:** os erros de título, disciplina, categoria e prazo aparecem junto aos campos; nenhuma requisição POST é feita.
- **Pesquisa sem correspondência:** a lista mostra **Nenhuma atividade encontrada.**, sem confundir esse estado com erro de comunicação.

## 9. Como executar

Pré-requisito: Node.js 20.19+ ou 22.12+. Os comandos abaixo partem da raiz `taskly`; o `package.json` está em `frontend`.

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

Mantenha os dois terminais abertos. A coleção fica em `http://localhost:3001/activities`; o Vite informa o endereço da interface, normalmente `http://localhost:5173`.

## 10. Como testar

1. Com os dois processos ativos, abra `/atividades`. Aguarde as três atividades iniciais. Na aba Network, confirme GET em `/activities` com resposta 200.
2. Pesquise `API`; confirme **Trabalho API REST**. Combine status **Pendente** e prioridade **Alta**. Teste também disciplina, categoria, limpar filtros e pesquisa inexistente.
3. Para observar o carregamento, selecione uma rede lenta na aba Network e recarregue a página. Confirme **Carregando atividades...**. Não há atraso artificial no código da aplicação.
4. Desligue o JSON Server com `Ctrl+C`, recarregue `/atividades` e confirme o erro. Religue-o e clique em **Tentar novamente**.
5. Em `/atividades/nova`, envie o formulário vazio. Confirme os quatro erros e a ausência de POST na aba Network. Preencha apenas o título e confirme os três erros restantes.
6. Preencha **Estudar TypeScript**, uma disciplina, categoria **Exercício**, descrição **Revisar async e await** e um prazo válido. Com rede lenta, envie e observe **Enviando...** e o botão desabilitado. Confirme a resposta POST 201 e a mensagem de sucesso.
7. Consulte `http://localhost:3001/activities` e `frontend/mock-api/db.json`: o registro criado deve aparecer com ID numérico. Volte à listagem e confirme sua presença.
8. Com formulário válido aberto, desligue o JSON Server e envie. Confirme erro de envio e ausência de sucesso. Religue o serviço e tente novamente.
9. Abra `/atividades/1/editar`: os dados locais continuam pré-preenchidos, e **Validar edição** apenas valida, sem POST, PUT ou PATCH.
10. Confira as cinco rotas em 1440×900, 768×1024 e 390×844. Nos fluxos normais não devem existir erros de console; ao desligar o serviço, o navegador registra as falhas de rede esperadas.

O POST altera o arquivo JSON. Para repetir a demonstração com a base inicial, encerre o mock server e restaure apenas `mock-api/db.json` a partir da tag `etapa-05`, desde que os cadastros locais possam ser descartados.

## 11. Limitações

- Não existe backend Taskly real ou SQLite; JSON Server é um serviço simulado acadêmico.
- A edição não envia PUT/PATCH. Apenas os três registros demonstrativos locais têm pré-preenchimento; para outros IDs, a interface informa essa limitação e desabilita o envio de edição.
- Dashboard e Disciplinas continuam com dados locais e não refletem os novos cadastros.
- Exclusão e atualização de status no servidor continuam fora do escopo.
- Não há autenticação, paginação, cache, tentativas automáticas ou gerenciamento global de estado.
- As URLs são locais e fixas, adequadas à execução acadêmica em dois terminais.

## 12. Matriz de atendimento

| Requisito | Implementação | Arquivo(s) | Como demonstrar |
| --- | --- | --- | --- |
| Separação em módulos | Serviço de atividades separado | `frontend/src/services/activityService.ts` | Inspecionar os exports de GET e POST |
| Evitar lógica em arquivo único | Páginas, serviço e tipos com responsabilidades distintas | `ActivitiesPage.tsx`, `ActivityFormPage.tsx`, `activityService.ts`, `domain.ts` | Inspecionar imports e responsabilidades |
| Chamadas assíncronas | Consulta e cadastro HTTP | `activityService.ts` | Observar GET 200 e POST 201 na aba Network |
| Fetch API | `fetch()` nativo, sem Axios | `activityService.ts` | Inspecionar método, cabeçalho e corpo da requisição |
| Promises / async-await | Retornos Promise e funções async com await | Serviço e páginas | Inspecionar `Promise<Activity[]>`, `Promise<Activity>` e chamadas aguardadas |
| Carregamento | `isLoading` e `isSubmitting` | `ActivitiesPage.tsx`, `ActivityFormPage.tsx` | Usar rede lenta e observar lista/botão |
| Erro de comunicação | `response.ok`, `try/catch/finally` e mensagens | Serviço e páginas | Desligar o mock server e tentar consultar/enviar |
| Dados externos/simulados | JSON Server 0.17.4 e coleção local | `frontend/mock-api/db.json`, `frontend/package.json` | Executar `npm run mock-api` e consultar `/activities` |

## 13. Demonstração da entrega

| Item | Demonstração |
| --- | --- |
| Consulta | GET `/activities` |
| Submissão | POST `/activities` após validação |
| Sucesso | Lista carregada e atividade criada no serviço simulado |
| Erro | Mock API indisponível e respostas HTTP sem sucesso |
| Loading | **Carregando atividades...** e **Enviando...** |

As capturas reais estão em `docs/evidencias/etapa-05/`: consulta com sucesso, carregamento da consulta, erro de consulta, carregamento do envio e envio com sucesso. Para a consulta, foi usada limitação de rede via CDP. Para capturar o envio pendente, a requisição POST foi retida temporariamente pelo navegador de teste e depois liberada para o JSON Server, que respondeu 201. Não foi adicionado atraso ao código da aplicação.

## 14. Validação técnica

```bash
cd frontend
npm install
npm run typecheck
npm run build
npm audit
```

Os resultados efetivamente obtidos na entrega estão registrados em `docs/evidencias.md`. Não foram adicionadas ferramentas de lint ou testes permanentes apenas para esta etapa.
