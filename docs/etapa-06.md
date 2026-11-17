# Etapa 06 — API REST da Aplicação

## Objetivo

Expor o recurso **Atividades** por uma API REST própria. O frontend continua listando atividades e enviando cadastros com Fetch. A API também oferece consulta individual, alteração parcial e exclusão para uso pelo Postman ou pelo terminal.

## Tecnologias e estrutura

Node.js executa o servidor, Express registra as rotas HTTP, TypeScript descreve os tipos e JSON representa os dados enviados e recebidos. `tsx` executa o TypeScript em modo de desenvolvimento. CORS permite o acesso pelo frontend local.

| Arquivo | Função |
| --- | --- |
| `backend/src/server.ts` | Inicia a API local na porta 3001 e configura rotas, CORS e erros de leitura do JSON. |
| `backend/src/routes/activities.ts` | Implementa os cinco endpoints e a validação manual. |
| `backend/src/data/activities.ts` | Guarda as três atividades iniciais em um array. |
| `backend/src/types.ts` | Define os dados de entrada e o recurso com ID numérico. |
| `backend/package.json` e `backend/package-lock.json` | Registram scripts e dependências e fixam as versões instaladas. |
| `backend/tsconfig.json` | Configura a verificação de tipos e a compilação para `dist/`. |
| `docs/postman/Taskly-Etapa-06.postman_collection.json` | Reúne as cinco requisições da demonstração. |

## Endpoints

Base: `http://localhost:3001`. Corpos de POST e PATCH usam `Content-Type: application/json`.

| Método | Rota | Finalidade | Sucesso | Principais erros |
| --- | --- | --- | --- | --- |
| GET | `/activities` | Listar os registros | `200 OK`, array JSON (ou `[]`) | `500` |
| GET | `/activities/:id` | Consultar um registro | `200 OK`, objeto JSON | `400`, `404`, `500` |
| POST | `/activities` | Criar uma atividade | `201 Created`, objeto JSON e cabeçalho `Location` | `400`, `500` |
| PATCH | `/activities/:id` | Alterar parte de um registro | `200 OK`, objeto atualizado | `400`, `404`, `500` |
| DELETE | `/activities/:id` | Excluir um registro | `204 No Content`, sem corpo | `400`, `404`, `500` |

## Exemplos de requisições e respostas

**GET da lista:** `curl -i http://localhost:3001/activities`. Responde `200 OK`. A seguir, um recorte com o primeiro objeto do array inicial:

```json
[
  {
    "id": 1,
    "title": "Trabalho API REST",
    "description": "Documentar os recursos e contratos previstos para a API do projeto.",
    "subject": "Tecnologia de Construção de Software I",
    "category": "Trabalho",
    "dueDate": "2026-09-05",
    "dueDateLabel": "05/09/2026",
    "priority": "HIGH",
    "status": "PENDING"
  }
]
```

**GET individual:** `curl -i http://localhost:3001/activities/1`. Responde `200 OK` com o mesmo objeto de ID 1, sem o array.

**POST:** envie este corpo para `POST /activities`:

```json
{
  "title": "Revisar API REST",
  "description": "",
  "subject": "Tecnologia de Construção de Software I",
  "category": "Exercício",
  "dueDate": "2026-11-30",
  "dueDateLabel": "30/11/2026",
  "priority": "MEDIUM",
  "status": "PENDING"
}
```

Em uma instância recém-iniciada, o POST devolve `201 Created`, `Location: /activities/4` e:

```json
{
  "id": 4,
  "title": "Revisar API REST",
  "description": "",
  "subject": "Tecnologia de Construção de Software I",
  "category": "Exercício",
  "dueDate": "2026-11-30",
  "dueDateLabel": "30/11/2026",
  "priority": "MEDIUM",
  "status": "PENDING"
}
```

**PATCH:** envie `{"status":"COMPLETED"}` para `PATCH /activities/4`, usando o ID retornado pelo POST. A resposta `200 OK` preserva os campos que não foram enviados:

```json
{
  "id": 4,
  "title": "Revisar API REST",
  "description": "",
  "subject": "Tecnologia de Construção de Software I",
  "category": "Exercício",
  "dueDate": "2026-11-30",
  "dueDateLabel": "30/11/2026",
  "priority": "MEDIUM",
  "status": "COMPLETED"
}
```

**DELETE:** `curl -i -X DELETE http://localhost:3001/activities/4`. Responde `204 No Content`, sem JSON. Uma consulta posterior ao mesmo ID retorna `404`.

Exemplos de erro:

| Requisição | HTTP | Corpo JSON |
| --- | --- | --- |
| `GET /activities/abc` | `400` | `{"error":"ID da atividade inválido."}` |
| `POST /activities` com campo obrigatório ausente | `400` | `{"error":"Dados da atividade inválidos."}` |
| `POST /activities` com JSON malformado | `400` | `{"error":"JSON malformado."}` |
| `GET /activities/9999`, se não existir | `404` | `{"error":"Atividade não encontrada."}` |

Falhas inesperadas retornam `500` com uma mensagem genérica, sem rastreamento interno.

## Validação

- O ID da rota deve ser um inteiro positivo seguro. No POST, o servidor gera um ID numérico e ignora o ID enviado pelo cliente.
- Título, disciplina e categoria devem ser textos não vazios após remover espaços das extremidades. Descrição deve ser texto e pode ser vazia.
- O prazo deve ser uma data de calendário válida em `YYYY-MM-DD`, e o rótulo deve corresponder a ela em `DD/MM/YYYY`.
- Prioridade aceita `LOW`, `MEDIUM` ou `HIGH`; status aceita `PENDING` ou `COMPLETED`.
- PATCH exige pelo menos um campo conhecido e rejeita alterações do ID. A API valida o resultado antes de salvar. Se apenas o prazo for enviado, o rótulo é recalculado; se um rótulo for enviado, ele deve corresponder à data.

## Como executar

Use Node.js 20.19 ou superior na linha 20, ou 22.12 ou superior. Na raiz do Taskly, abra dois terminais:

**Terminal 1 — backend**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — frontend**

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço indicado pelo Vite. Para iniciar a API compilada, execute `npm run build` e `npm start` em `backend`. O script `npm run mock-api` no frontend pertence à Etapa 05 e também usa a porta 3001; encerre-o antes de iniciar o Express.

## Testes no Postman

1. Com o Express ativo, use **Import** e escolha a [coleção Taskly Etapa 06](postman/Taskly-Etapa-06.postman_collection.json). A variável `baseUrl` já aponta para a API local.
2. Envie **01 Listar atividades** e **02 Consultar atividade inicial**. Confira `200`, o array e o registro de ID 1.
3. Envie **03 Criar atividade**. Confira `201`; o Postman guarda o ID retornado na variável `createdId`.
4. Envie **04 Alterar atividade criada** e confira `200` com status `COMPLETED`. Depois envie **05 Excluir atividade criada** e confira `204`, sem corpo.
5. Para testar erros, consulte um ID inválido e um inexistente, remova um campo do POST e tente enviar um PATCH com `{"id":1}`. As respostas devem ser JSON com a chave `error`.
6. Para demonstrar a reinicialização, faça um cadastro ou uma alteração, encerre o Express e inicie novamente. O GET deve voltar a retornar apenas os três registros originais.

## Validações da entrega

- Requisições reais confirmaram os cinco endpoints, os códigos `200`, `201`, `204`, `400` e `404`, o formato JSON dos erros, a validação de campos e datas, o PATCH parcial e a resposta vazia do DELETE. Após reiniciar o processo, o cadastro de teste desapareceu e os três registros iniciais voltaram.
- As cinco requisições do arquivo da coleção foram executadas em sequência contra a API local, usando o ID do cadastro para alterar e excluir.
- No Chrome, o frontend listou e cadastrou pela API, preservou pesquisa e filtros e apresentou erro de GET e POST com o Express desligado. **Tentar novamente** voltou a carregar a lista após reiniciar a API. As cinco rotas existentes foram verificadas em 1440×900, 768×1024 e 390×844, sem rolagem horizontal.
- `npm install`, `npm run typecheck` e `npm run build` passaram em backend e frontend com Node.js 24.3.0. `npm audit` no backend e `npm audit --omit=dev` no frontend retornaram zero vulnerabilidades. A auditoria completa do frontend reportou cinco entradas relacionadas a um aviso de `picomatch` na cadeia de desenvolvimento do Vite; as dependências existentes foram preservadas.

## Limitações

O armazenamento em memória perde as alterações ao reiniciar. Não há banco de dados real, autenticação, paginação ou filtros no servidor. O frontend usa GET da lista e POST. PATCH e DELETE podem ser executados pelo Postman ou terminal; a edição visual, o Dashboard e a página de Disciplinas permanecem demonstrativos.
