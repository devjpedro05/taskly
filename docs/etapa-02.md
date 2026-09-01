# Etapa 02 — Protótipo Estrutural com HTML Semântico

## 1. Objetivo da etapa

Transformar a proposta definida na Etapa 01 em uma primeira interface Web navegável, utilizando React e elementos HTML semanticamente adequados. A entrega representa o domínio do Taskly sem antecipar API, banco de dados ou persistência.

## 2. Funcionalidades representadas

### Funcionalidades estruturalmente representadas

- navegação entre as quatro interfaces;
- visualização do resumo acadêmico no Dashboard;
- visualização das atividades demonstrativas;
- controles visuais de pesquisa e filtros;
- formulário estrutural de criação e edição;
- visualização de disciplinas e suas quantidades associadas;
- ações visuais de edição, exclusão e cadastro.

### Funcionalidades ainda não funcionais

- persistência do formulário;
- aplicação real de pesquisa e filtros;
- exclusão de atividades;
- cadastro de disciplinas;
- cálculo automático de atrasos e prazos próximos;
- integração com API ou banco de dados.

## 3. Páginas criadas

### 3.1 Dashboard

Disponível em `/`. Apresenta três indicadores demonstrativos e uma seleção de próximas atividades. Os números são estáticos e identificados na interface como dados de protótipo.

### 3.2 Atividades

Disponível em `/atividades`. Contém pesquisa, filtros visuais e uma lista de atividades mockadas com disciplina, categoria, prazo, prioridade e status.

### 3.3 Criar/Editar Atividade

Disponível em `/atividades/nova` e, estruturalmente, em `/atividades/:activityId/editar`. O mesmo componente apresenta o formulário de criação e reutiliza os dados mockados ao representar uma edição.

### 3.4 Disciplinas

Disponível em `/disciplinas`. Apresenta disciplinas demonstrativas, professores e quantidades de atividades totais e pendentes.

## 4. Estrutura HTML utilizada

Cada rota possui um único `<main>` identificado. O layout compartilhado contém `<header>`, `<nav>` e `<footer>`. Dentro do conteúdo principal, `<section>` agrupa assuntos relacionados e `<article>` representa unidades independentes, como atividades, disciplinas e indicadores.

## 5. Elementos semânticos adotados

- `<header>`: cabeçalho global, cabeçalhos de página e de conteúdos independentes;
- `<nav>`: navegação principal entre Dashboard, Atividades e Disciplinas;
- `<main>`: conteúdo principal único de cada interface;
- `<section>`: agrupamento dos resumos, filtros, listas e formulário;
- `<article>`: atividade, disciplina ou indicador que faz sentido de modo independente;
- `<footer>`: informações complementares do projeto e grupos de ações;
- `<form>`: pesquisa/filtros e dados de atividade;
- `<fieldset>` e `<legend>`: agrupamento dos campos de identificação e planejamento;
- `<label>`: identificação programática dos campos;
- `<button>`: ações, incluindo as que permanecem desabilitadas nesta etapa;
- `<a>` por meio de `Link` e `NavLink`: navegação entre rotas;
- `<time>`: representação semântica dos prazos;
- listas, headings e listas de descrição: navegação, hierarquia e metadados.

## 6. Formulários e labels

O formulário de atividade possui sete campos: título, disciplina, categoria, descrição, prazo, prioridade e status. Todos usam `htmlFor` associado ao `id` correspondente. O formulário de pesquisa e filtros segue a mesma regra para seus cinco controles.

O envio do formulário apenas impede o recarregamento da página. Uma mensagem visível informa que os dados não serão salvos nesta etapa.

## 7. Organização dos arquivos

```text
frontend/src/
├── components/    # layout compartilhado e atividade reutilizável
├── data/          # dados estáticos identificados como mock
├── pages/         # uma responsabilidade principal por interface
├── styles/        # CSS global simples e responsivo
├── types/         # conceitos tipados do domínio
├── App.tsx        # rotas
└── main.tsx       # inicialização da aplicação
```

Foram criados somente dois componentes compartilhados: o layout comum e o item de atividade. As páginas permanecem explícitas para evitar fragmentação excessiva.

## 8. Decisões técnicas

- React Router foi adotado para manter URLs distintas e navegação real com pouca configuração.
- CSS convencional concentra a apresentação em um arquivo, suficiente para o tamanho atual.
- Não foi adicionada biblioteca de componentes, ícones, estado global ou animação.
- Links representam navegação; botões representam ações.
- Ações indisponíveis, como excluir e cadastrar disciplina, permanecem desabilitadas e explicadas por texto auxiliar.
- O backend reservado na Etapa 01 não foi expandido.

## 9. Dados de demonstração

O arquivo `src/data/mockData.ts` contém três atividades, três disciplinas e indicadores do Dashboard. Esses dados existem somente para representar o domínio da Etapa 01 e não constituem persistência.

## 10. Limitações da Etapa 02

- não há API ou banco de dados;
- o formulário não salva dados;
- filtros e pesquisa não alteram a lista;
- exclusão e cadastro de disciplina não são executados;
- o status de atraso não é calculado;
- não há autenticação, notificações ou integrações externas.

## 11. Como executar

Pré-requisito: Node.js 20.19+ ou 22.12+.

```bash
cd frontend
npm install
npm run dev
```

Para validar tipagem e build:

```bash
npm run typecheck
npm run build
```

## 12. Evidências

As evidências verificadas da entrega estão registradas em [`docs/evidencias.md`](evidencias.md). A inspeção visual foi realizada no navegador local; capturas não são necessárias para executar ou avaliar o protótipo.

## 13. Evolução prevista

Etapas futuras poderão implementar regras funcionais, comunicação HTTP, API REST, persistência SQLite e testes automatizados. Essas evoluções deverão preservar os elementos semânticos e os conceitos definidos na proposta inicial.
