# Evidências

## Etapa 01

Nesta etapa, a entrega é composta pela proposta e especificação inicial do projeto.

### Evidências

- estrutura inicial do repositório criada;
- pastas `frontend`, `backend` e `tests` reservadas, sem implementação;
- README criado;
- proposta documentada;
- arquitetura inicial definida em nível conceitual;
- repositório versionado com Git;
- entrega identificada pela tag `etapa-01`.

Não existem arquivos de código, dependências, builds ou banco de dados nesta etapa. Evidências visuais da aplicação serão adicionadas quando a implementação começar nas próximas etapas.

## Etapa 02 — Protótipo Estrutural com HTML Semântico

Nesta etapa, a proposta foi transformada em um frontend navegável com dados estáticos de demonstração.

### Evidências

- Dashboard criado e validado na rota `/`;
- página de atividades criada e validada em `/atividades`;
- formulário estrutural criado e validado em `/atividades/nova`;
- página de disciplinas criada e validada em `/disciplinas`;
- navegação entre as quatro interfaces verificada no navegador;
- elementos `header`, `nav`, `main`, `section`, `article`, `footer`, `form`, `label` e `button` utilizados conforme o conteúdo;
- sete de sete campos do formulário de atividade associados aos respectivos labels;
- dados de atividades e disciplinas identificados como mockados;
- responsividade verificada em largura de smartphone, sem overflow horizontal;
- frontend compilado com sucesso;
- typecheck aprovado;
- console do navegador sem erros ou avisos durante a validação.

Persistência, API, filtros reais, exclusão e cadastro permanecem fora do escopo desta etapa.

## Etapa 03 — Interface Responsiva com CSS

Nesta etapa, as quatro interfaces foram auditadas em desktop, tablet e smartphone. O CSS foi refinado sem alterar rotas, semântica ou dados mockados.

As nove capturas acadêmicas obrigatórias estão em [`docs/evidencias/etapa-03/`](evidencias/etapa-03/), com os nomes e dimensões definidos para a entrega. A relação completa entre viewports, interfaces e arquivos está documentada em [`docs/etapa-03.md`](etapa-03.md).

## Etapa 04 — Interatividade com JavaScript

Nesta etapa, pesquisa e filtros passaram a atualizar dinamicamente a listagem, e o formulário de atividade recebeu validação manual sem persistência.

As cinco capturas reais estão em [`docs/evidencias/etapa-04/`](evidencias/etapa-04/):

- `01-pesquisa.png`: pesquisa por título com lista e contador atualizados;
- `02-filtros.png`: filtros combinados de status e prioridade;
- `03-sem-resultados.png`: tratamento da pesquisa sem correspondência;
- `04-formulario-invalido.png`: mensagens dos quatro campos obrigatórios;
- `05-formulario-valido.png`: confirmação de validação e aviso de ausência de persistência.

O detalhamento dos eventos, estados, funções, validações e evidências está em [`docs/etapa-04.md`](etapa-04.md).
