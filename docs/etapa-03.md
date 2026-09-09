# Etapa 03 — Interface Responsiva com CSS

## 1. Objetivo

A Etapa 03 adapta o protótipo semântico da Etapa 02 para diferentes tamanhos de tela. O trabalho concentra-se em CSS, composição responsiva, legibilidade e usabilidade, sem acrescentar persistência, API ou novas regras de negócio.

## 2. Interfaces utilizadas nas evidências

### 2.1 Dashboard

**Tela 01 — Dashboard (`/`).** Representa indicadores, ação principal e lista de próximas atividades.

### 2.2 Atividades

**Tela 02 — Atividades (`/atividades`).** Representa pesquisa, filtros, metadados e ações associadas às atividades.

### 2.3 Criar/Editar Atividade

**Tela 03 — Criar atividade (`/atividades/nova`).** Representa os sete campos do formulário e suas ações. O mesmo componente continua disponível para a representação estrutural da edição.

A interface Disciplinas (`/disciplinas`) não integra as nove capturas principais, mas também foi auditada nos três viewports.

## 3. Estratégia de responsividade

Foi mantida a abordagem mobile-friendly já iniciada na Etapa 02. A largura do conteúdo é fluida e limitada no desktop; os componentes reorganizam suas colunas nos breakpoints existentes; textos podem quebrar sem expandir a página; e ações preservam áreas de interação adequadas.

Não foi utilizado `overflow-x: hidden` para ocultar falhas. A navegação permite rolagem horizontal controlada somente se o conteúdo ultrapassar o espaço disponível.

## 4. Flexbox

Flexbox é utilizado nos agrupamentos unidimensionais da interface, incluindo navegação, cabeçalhos de página e seção, metadados, ações das atividades, ações do formulário e rodapé. No smartphone, o cabeçalho, o rodapé e as ações do formulário mudam de direção para preservar leitura e área de toque.

## 5. CSS Grid

CSS Grid organiza estruturas bidimensionais: cabeçalho global, indicadores do Dashboard, formulário de filtros, campos do formulário e itens de disciplinas. O formulário de filtros utiliza seis colunas no desktop, duas no tablet e uma no smartphone. Os indicadores e campos também passam para uma única coluna no breakpoint mobile quando necessário.

## 6. Breakpoints

Os dois breakpoints existentes mostraram-se adequados e foram preservados:

- breakpoint intermediário: `980px`;
- breakpoint mobile: `680px`.

As media queries permanecem agrupadas ao final de `frontend/src/styles/global.css`, em ordem decrescente de largura.

## 7. Desktop — 1440 × 900

O conteúdo utiliza largura máxima de `1120px`, com exceção do formulário, limitado a `900px`. Cabeçalho, indicadores, filtros e campos aproveitam o espaço horizontal sem criar linhas de leitura excessivamente longas. As quatro interfaces foram verificadas sem overflow horizontal.

## 8. Tablet — 768 × 1024

O cabeçalho passa a ocupar duas linhas, mantendo a ação principal visível. A pesquisa ocupa a largura completa e os filtros são distribuídos em duas colunas. O formulário mantém duas colunas em Identificação e três controles de planejamento, pois cada controle permanece com largura legível. As quatro interfaces foram verificadas sem sobreposição ou overflow.

## 9. Smartphone — 390 × 844

O cabeçalho é reorganizado em três linhas; navegação e ação principal permanecem acessíveis. Indicadores, filtros, formulário e disciplinas passam para uma coluna. Os campos recebem altura mínima maior e as ações do formulário são empilhadas com largura total. Os espaçamentos verticais são reduzidos sem comprometer a leitura.

## 10. Principais decisões responsivas

- preservação da identidade visual azul e da hierarquia da Etapa 02;
- manutenção dos breakpoints `980px` e `680px` após validação nos viewports exigidos;
- impedimento de quebra de linha nos rótulos dos botões e links de ação;
- reorganização do cabeçalho em tablet e smartphone;
- mudança dos filtros de seis para duas e uma coluna;
- empilhamento de indicadores, formulários e itens de disciplinas no smartphone;
- aumento das áreas de toque de navegação e controles;
- empilhamento e largura total das ações do formulário no smartphone;
- uso de `min-width: 0` em filhos de layouts para permitir quebra de textos longos sem overflow.

## 11. Arquivos CSS responsáveis

Toda a apresentação e a responsividade permanecem centralizadas em:

```text
frontend/src/styles/global.css
```

O tamanho atual do projeto não justifica fragmentar os estilos em múltiplos arquivos.

## 12. Evidências

As capturas foram produzidas em viewport real, com fator de escala 1. O navegador integrado foi usado na auditoria visual e Playwright com o Chrome instalado foi empregado somente como ferramenta de desenvolvimento para salvar os PNGs, sem ser adicionado às dependências do projeto.

| Viewport | Tela | Arquivo |
| --- | --- | --- |
| Desktop 1440×900 | Dashboard | `evidencias/etapa-03/desktop-tela-01.png` |
| Desktop 1440×900 | Atividades | `evidencias/etapa-03/desktop-tela-02.png` |
| Desktop 1440×900 | Nova atividade | `evidencias/etapa-03/desktop-tela-03.png` |
| Tablet 768×1024 | Dashboard | `evidencias/etapa-03/tablet-tela-01.png` |
| Tablet 768×1024 | Atividades | `evidencias/etapa-03/tablet-tela-02.png` |
| Tablet 768×1024 | Nova atividade | `evidencias/etapa-03/tablet-tela-03.png` |
| Smartphone 390×844 | Dashboard | `evidencias/etapa-03/smartphone-tela-01.png` |
| Smartphone 390×844 | Atividades | `evidencias/etapa-03/smartphone-tela-02.png` |
| Smartphone 390×844 | Nova atividade | `evidencias/etapa-03/smartphone-tela-03.png` |

## 13. Validações

- 12 combinações auditadas: quatro interfaces em três viewports;
- nove capturas verificadas visualmente e programaticamente;
- dimensões reais dos PNGs confirmadas;
- nenhum arquivo vazio, inválido ou duplicado;
- ausência de overflow horizontal nas 12 combinações;
- console sem erros ou avisos relevantes;
- `npm run typecheck` aprovado;
- `npm run build` aprovado;
- lint e testes permanecem não configurados, conforme o estado da Etapa 02.

## 14. Limitações atuais

Os dados continuam mockados. Pesquisa e filtros são apenas estruturais; o formulário não salva; exclusão e cadastro de disciplinas não executam operações; e não existem API, banco de dados ou persistência. Essas limitações são deliberadas e compatíveis com uma etapa dedicada a CSS.

## 15. Evolução prevista

As próximas etapas poderão acrescentar comportamento funcional e integração com o backend conforme os requisitos acadêmicos futuros. A evolução deverá preservar a responsividade, os elementos semânticos e os conceitos de domínio já documentados.
