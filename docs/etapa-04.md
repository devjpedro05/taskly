# Etapa 04 — Interatividade com JavaScript

## 1. Objetivo

A Etapa 04 adiciona comportamento dinâmico ao frontend do Taskly com recursos básicos de React e TypeScript. O escopo está limitado à pesquisa de atividades, aos filtros da listagem e à validação manual do formulário de atividade. Não há backend, persistência ou autenticação.

## 2. Funcionalidades interativas implementadas

### 2.1 Pesquisa de atividades

O campo **Buscar atividade** pesquisa parte do título sem diferenciar letras maiúsculas e minúsculas. O evento `onChange` atualiza `searchTerm`; em seguida, `filter()` produz `filteredActivities` e `map()` renderiza os resultados.

Para testar, acesse `/atividades` e digite `API`. Somente **Trabalho API REST** deve permanecer visível, e o contador deve mostrar **1 item**. A implementação está em `frontend/src/pages/ActivitiesPage.tsx` e demonstra evento, estado, função, array, `filter()`, `map()` e alteração dinâmica da interface.

### 2.2 Filtros de atividades

Os filtros de status, disciplina, categoria e prioridade são controlados por estados simples. Cada critério com valor `all` não restringe a lista; os demais são combinados entre si e com a pesquisa. O botão **Limpar filtros** restaura a pesquisa e os quatro filtros.

Para testar, acesse `/atividades`, selecione **Pendente** em status e **Alta** em prioridade. Somente **Trabalho API REST** deve ser exibida. A implementação está em `frontend/src/pages/ActivitiesPage.tsx` e utiliza eventos, estados, condições, funções, arrays e renderização dinâmica.

### 2.3 Validação do formulário

O evento `onSubmit` chama `handleSubmit`, impede o envio padrão e cria um `FormData`. A função `validateForm` verifica título, disciplina, categoria e prazo. Os erros são armazenados em estado e exibidos abaixo dos respectivos campos. Uma submissão válida apresenta uma mensagem de sucesso, sem salvar dados.

Para testar, acesse `/atividades/nova` e envie o formulário vazio para visualizar os quatro erros. Depois, preencha os quatro campos obrigatórios e envie novamente. A implementação está em `frontend/src/pages/ActivityFormPage.tsx`, com estilos de apoio em `frontend/src/styles/global.css`, e demonstra eventos, funções, condições, estado, validação e alteração dinâmica.

## 3. Conceitos de programação utilizados

- `useState` para pesquisa, filtros, erros e mensagem de sucesso;
- funções nomeadas para tratar eventos, validar dados, limpar filtros e formatar o contador;
- condições para aplicar filtros e decidir quais mensagens renderizar;
- arrays derivados sem alterar os dados mockados originais;
- tipos explícitos e simples do TypeScript para os erros do formulário.

## 4. Manipulação da interface com React

O React é utilizado como mecanismo equivalente à manipulação direta do DOM. Alterações de estado provocam nova renderização declarativa. Assim, a lista e o contador mudam após pesquisa ou filtro; o estado sem resultados surge condicionalmente; e mensagens de erro ou sucesso aparecem de acordo com a validação.

Não foram utilizados `document.querySelector`, `getElementById` ou `innerHTML`.

## 5. Tratamento de eventos

- `onChange` atualiza a pesquisa e cada filtro;
- `onClick` executa `clearFilters`;
- `onSubmit` impede o comportamento padrão dos formulários;
- `handleSubmit` coordena a validação do formulário de atividade.

## 6. Uso de arrays e iteração

O array `activities`, definido em `frontend/src/data/mockData.ts`, permanece como fonte de dados demonstrativos. `filter()` cria `filteredActivities` a partir dos critérios selecionados. `map()` renderiza cada atividade resultante e também continua sendo usado nas opções de disciplinas.

## 7. Validações implementadas

| Campo | Regra | Mensagem |
| --- | --- | --- |
| Título | valor após `trim()` não pode estar vazio | `Título é obrigatório.` |
| Disciplina | uma opção deve ser selecionada | `Selecione uma disciplina.` |
| Categoria | uma opção deve ser selecionada | `Selecione uma categoria.` |
| Prazo | a data não pode estar vazia | `Informe o prazo.` |

Descrição permanece opcional. Prioridade e status possuem valores padrão e não receberam validações artificiais.

## 8. Situações inválidas tratadas

- pesquisa ou combinação de filtros sem correspondência exibe **Nenhuma atividade encontrada.**;
- formulário vazio exibe quatro mensagens de erro e não apresenta sucesso;
- formulário parcialmente preenchido mantém apenas os erros ainda aplicáveis;
- nova submissão inválida remove uma eventual mensagem de sucesso;
- após a correção dos campos, erros anteriores deixam de ser exibidos.

## 9. Arquivos envolvidos

- `frontend/src/pages/ActivitiesPage.tsx`: pesquisa, filtros, contador, limpeza e estado sem resultados;
- `frontend/src/pages/ActivityFormPage.tsx`: validação, erros e sucesso;
- `frontend/src/styles/global.css`: estilos mínimos para erros, estado vazio e sucesso;
- `frontend/src/components/AppLayout.tsx`: identificação da etapa atual no rodapé;
- `frontend/src/data/mockData.ts`: dados demonstrativos preservados;
- `docs/evidencias/etapa-04/`: capturas reais do funcionamento.

## 10. Matriz de evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
| --- | --- | --- | --- |
| Manipulação do DOM ou equivalente | Pesquisa, filtros e validação | `ActivitiesPage.tsx`; `ActivityFormPage.tsx` | Estados do React atualizam lista, contador, erros e sucesso |
| Tratamento de eventos | Pesquisa, filtros, limpeza e formulário | `ActivitiesPage.tsx`; `ActivityFormPage.tsx` | Uso de `onChange`, `onClick` e `onSubmit` |
| Validação de formulários | Validação do formulário | `ActivityFormPage.tsx` | Mensagens aparecem abaixo dos quatro campos obrigatórios |
| Alteração dinâmica da interface | As três funcionalidades | `ActivitiesPage.tsx`; `ActivityFormPage.tsx` | Lista, contador, estado vazio, erros e sucesso mudam conforme o estado |
| Uso de funções | As três funcionalidades | `ActivitiesPage.tsx`; `ActivityFormPage.tsx` | `handleSearchChange`, `clearFilters`, `getItemsLabel`, `handleSubmit` e `validateForm` |
| Uso de arrays | Pesquisa e filtros | `mockData.ts`; `ActivitiesPage.tsx` | Uso de `activities` e do array derivado `filteredActivities` |
| Métodos de iteração | Pesquisa, filtros e renderização | `ActivitiesPage.tsx` | `filter()` seleciona registros e `map()` renderiza os resultados |
| Tratamento de situações inválidas | Estado sem resultados e formulário inválido | `ActivitiesPage.tsx`; `ActivityFormPage.tsx` | Mensagem sem resultados e erros de campos obrigatórios |

## 11. Evidências do funcionamento

As capturas reais estão em `docs/evidencias/etapa-04/`:

- `01-pesquisa.png`: termo `API`, um resultado e contador no singular;
- `02-filtros.png`: combinação **Pendente + Alta**, um resultado correspondente;
- `03-sem-resultados.png`: pesquisa inexistente e estado vazio;
- `04-formulario-invalido.png`: quatro campos obrigatórios com erros visíveis;
- `05-formulario-valido.png`: campos preenchidos e confirmação de validação sem persistência.

## 12. Como executar

Pré-requisito: Node.js 20.19+ ou 22.12+.

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço informado pelo Vite no navegador.

## 13. Como testar as funcionalidades

1. Em `/atividades`, pesquise `API`, pesquise um texto inexistente e clique em **Limpar filtros**.
2. Teste separadamente os filtros **Pendente**, **Concluída**, **Alta**, **Banco de Dados** e **Projeto**.
3. Combine **Pendente** e **Alta** e confirme que somente **Trabalho API REST** aparece.
4. Em `/atividades/nova`, envie o formulário vazio e confirme os quatro erros.
5. Preencha somente o título e confirme que permanecem três erros.
6. Preencha disciplina, categoria e prazo, envie novamente e confirme a mensagem de sucesso.
7. Confirme que a página não é redirecionada e que nenhuma atividade é persistida.

Para validar o código:

```bash
cd frontend
npm run typecheck
npm run build
npm audit
```

## 14. Limitações atuais

- os dados continuam mockados e são reiniciados com a aplicação;
- o formulário valida, mas não salva nem edita atividades;
- excluir e alterar status permanecem sem comportamento;
- não existe backend, API, banco de dados ou autenticação;
- o Dashboard continua demonstrativo e não reage aos filtros.
