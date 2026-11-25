# Evidências

## Etapa 07 — Persistência e CRUD com Banco de Dados

O script `tests/stage07.cjs` executou **82 requisições HTTP reais** contra um banco SQLite temporário, além dos testes de interface no Chrome. O banco de uso normal não recebeu usuários nem dados de teste.

Foram verificados: cinco tabelas principais, foreign_keys, hashes bcrypt, cadastro/login/logout, e-mail normalizado/duplicado, sessão por cookie HttpOnly, CSRF por Origin, CRUD de atividades/disciplinas/categorias/subtarefas, restrição e cascata, isolamento entre dois estudantes e erro controlado com o banco bloqueado.

A persistência foi comprovada na sequência **cadastrar → consultar → encerrar backend → reiniciar → consultar os mesmos IDs**. Atividade, subtarefa concluída, disciplina, categoria e usuário permaneceram no arquivo SQLite. A mesma sequência foi repetida pela interface.

### Capturas reais

| Arquivo em `docs/evidencias/etapa-07/` | O que comprova |
| --- | --- |
| 01-cadastro.png | Formulário para criar o usuário, sem exibir senhas. |
| 02-login.png | Login e confirmação de cadastro concluído. |
| 03-dashboard.png | Dashboard com sessão e atividades reais. |
| 04-disciplinas.png | Disciplina gravada e consultada pelo usuário. |
| 05-categorias.png | Categorias iniciais e nova categoria persistida. |
| 06-atividades.png | Atividade real após edição pela API. |
| 07-detalhes-subtarefas.png | Detalhes relacionados e subtarefa concluída. |
| 09-persistencia-reinicio.png | Mesmo registro e subtarefa após reiniciar o backend. |

Não foi gerada a captura 08 no Postman: o aplicativo não estava instalado. Em substituição à demonstração gráfica, todas as requisições e scripts de IDs da coleção foram executados por HTTP, na ordem dos cinco grupos. Não foi simulada uma imagem do Postman.

### Validação técnica

- Backend: instalação, typecheck, build e npm audit aprovados, sem vulnerabilidades.
- Frontend: instalação, typecheck e build aprovados; auditoria da instalação sem vulnerabilidades.
- Node.js 24.3.0, better-sqlite3 compatível e criação automática do banco confirmados.
- Chrome: cadastro, erro de login, login, logout, proteção de rotas, CRUD real, validação e mensagens.
- Responsividade verificada em 1440×1000, 768×1024 e 390×844. Ajustado o mínimo de largura da navegação para os novos links.
- Testes usam um banco temporário próprio e o removem ao terminar. As imagens são capturas reais, sem composição ou alteração para simular estados.

As etapas anteriores abaixo foram preservadas como histórico.

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

## Etapa 05 — Modularização e Comunicação Assíncrona

A listagem consulta o JSON Server local por GET, e o cadastro envia dados válidos por POST. A comunicação está no módulo `frontend/src/services/activityService.ts`, separado das páginas e dos tipos.

### Capturas reais

As cinco imagens foram capturadas no navegador Chrome executando o build pelo preview do Vite, com o JSON Server local. Estão em [`docs/evidencias/etapa-05/`](evidencias/etapa-05/):

- `01-consulta-sucesso.png`: GET concluído e três atividades iniciais exibidas;
- `02-consulta-loading.png`: consulta pendente com **Carregando atividades...**;
- `03-consulta-erro.png`: serviço realmente desligado, mensagem de erro e botão de nova tentativa;
- `04-envio-loading.png`: formulário válido com envio pendente e botão **Enviando...** desabilitado;
- `05-envio-sucesso.png`: confirmação após resposta POST 201 do serviço simulado.

O carregamento da consulta foi capturado com limitação de rede via CDP. Para o envio, o navegador de teste reteve a requisição temporariamente e a liberou após a captura. Não houve edição das imagens nem atraso adicionado ao código da aplicação.

### Validações realizadas

- GET 200 com as três atividades e IDs numéricos;
- pesquisa, quatro filtros, combinação de critérios, contador, limpeza e estado sem resultados preservados;
- formulário vazio, parcial e título contendo somente espaços rejeitados, sem executar POST;
- POST 201, data formatada corretamente, ID numérico e registro confirmado tanto por GET quanto no arquivo JSON;
- erros de GET e POST com o serviço desligado, recuperação da consulta pelo botão e nova tentativa de envio;
- respostas HTTP 503 de consulta e envio tratadas, simuladas apenas no navegador de teste;
- edição demonstrativa validada sem enviar POST, PUT ou PATCH;
- navegação da edição para novo cadastro sem reaproveitar os dados do formulário anterior;
- cinco rotas verificadas em 1440×900, 768×1024 e 390×844: 15 combinações sem overflow horizontal;
- zero erros inesperados de console ou JavaScript nos fluxos normais; as falhas de rede provocadas nos testes de erro são esperadas;
- `npm install`, `npm run typecheck` e `npm run build` concluídos;
- `npm audit` final com zero vulnerabilidades, após atualização compatível de Vite e `source-map-js` no lockfile; JSON Server mantido em 0.17.4;
- base do JSON Server restaurada para as três atividades iniciais após os testes.

As rotas verificadas foram `/`, `/atividades`, `/atividades/nova`, `/atividades/1/editar` e `/disciplinas`. Lint e testes automatizados permanentes continuam sem configuração. A explicação do fluxo, a matriz dos oito requisitos e as instruções para reproduzir os testes estão em [`docs/etapa-05.md`](etapa-05.md).
