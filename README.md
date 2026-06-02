# HE Travels&Tuors

> Sistema premium de gestão de frotas e viagens — desenvolvido para HE Travels&Tuors com foco em excelência operacional, controle financeiro e design sofisticado.

**Status:** Em produção  
**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Supabase · Vercel

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Stack Detalhada](#stack-detalhada)
- [Modelo de Dados](#modelo-de-dados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Execução](#instalação-e-execução)
- [Scripts](#scripts)
- [Supabase](#supabase)
- [Deploy](#deploy)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [OpenCode](#opencode)

---

## Visão Geral

O HE Travels&Tuors é um sistema completo de gestão de transportes que permite:

- **Controlar a frota** com informações detalhadas de cada veículo (km, seguro, manutenção)
- **Gerenciar motoristas** com CNH, produtividade e histórico
- **Registrar viagens** com cálculo automático de margem (receita - custo)
- **Monitorar custos** por categoria (combustível, manutenção, pedágios, impostos)
- **Rastrear abastecimentos** com eficiência por veículo e histórico de preços
- **Gerenciar ordens de serviço** de manutenção preventiva e corretiva
- **Visualizar alertas** automáticos (manutenção atrasada, seguro vencendo, CNH expirando)

---

## Funcionalidades

### Dashboard Operacional
- KPIs financeiros (custo total, receita total, margem média, km rodados)
- Gráfico de distribuição de custos por categoria (PieChart)
- Alertas do sistema classificados por gravidade (perigo, aviso, informação)
- Últimas viagens registradas com placa e motorista
- Navegação rápida para frota ou motoristas pelos alertas

### Gestão de Frota
- Cards de veículos com placa, modelo, ano e status
- Barra de progresso de km rodados vs. limite de manutenção
- Status visual: ativo, manutenção, inativo, alerta
- Modal de detalhes com informações completas e alertas do veículo
- CRUD completo: cadastrar, editar, remover veículo
- Detecção automática de viagem em andamento

### Motoristas
- Cards com nome, CNH, produtividade e status
- Filtro por status (ativo, em viagem, férias, suspenso)
- Busca por nome
- CRUD completo
- Modal de histórico de viagens do motorista
- Confirmação de exclusão com segurança

### Viagens
- Cards com rota, logística e financeiro
- Origem → Destino com distância
- Cálculo automático de margem (receita - custo)
- Status: agendada, em andamento, concluída
- Dropdowns que respeitam disponibilidade (veículo sem manutenção, motorista ativo)
- Cadastro e edição de status

### Custos & Manutenção
- Aba Financeiro: gráficos (barra, linha, área), tabela de despesas
- Aba Manutenção: ordens de serviço ativas
- Cadastro de despesas por veículo ou geral
- Categorias: combustível, manutenção, pedágios, taxas, outros
- Ordens de serviço: preventiva e corretiva
- Transições de status: pendente → em andamento → concluído
- Criação automática de despesa ao concluir manutenção
- Atualização automática do status do veículo

### Combustível
- Gráfico de tendência de preços (LineChart)
- Barras de eficiência por veículo
- Tabela de abastecimentos com posto, litros, valor, km
- Cadastro com cálculo automático do total (litros × preço)

### Sistema de Alertas
Geração automática de alertas baseada em regras:

| Tipo | Condição | Gravidade |
|------|----------|-----------|
| Manutenção atrasada | Km atual > km revisão | 🔴 Perigo |
| Manutenção próxima | Menos de 2.000 km restantes | 🟡 Aviso |
| Seguro vencido | Data expirada | 🔴 Perigo |
| Seguro a vencer | Menos de 30 dias | 🟡 Aviso |
| Veículo em oficina | Status = manutenção | 🔵 Informação |
| CNH vencida | Data expirada | 🔴 Perigo |
| CNH a vencer | Menos de 30 dias | 🟡 Aviso |
| Ocorrências altas | 3+ ocorrências | 🔴 Perigo |
| Baixa produtividade | < 70% e ativo | 🟡 Aviso |

---

## Arquitetura

```
┌──────────────────────────────────────────────────┐
│                   Vercel (CDN)                    │
│  https://he-travels-tuors.vercel.app              │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│           React 19 + TypeScript + Vite            │
│                                                    │
│  App.tsx (estado central + CRUD handlers)          │
│    ├── DashboardView                               │
│    ├── FleetView                                   │
│    ├── DriversView                                 │
│    ├── TripsView                                   │
│    ├── CostsView                                   │
│    └── FuelView                                    │
│                                                    │
│  lib/                                              │
│    ├── supabase.ts   ← cliente Supabase            │
│    ├── alerts.ts     ← motor de alertas            │
│    └── utils.ts      ← formatadores                │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│              Supabase (PostgreSQL)                 │
│                                                    │
│  vehicles  ──┐                                     │
│  drivers   ──┤                                     │
│  trips     ──┤← chaves estrangeiras                │
│  expenses  ──┤                                     │
│  fuel_fillups ┘                                     │
│  maintenance_records                                │
└──────────────────────────────────────────────────┘
```

---

## Stack Detalhada

### Frontend
| Tecnologia | Versão | Finalidade |
|-----------|--------|------------|
| React | 19 | Biblioteca UI |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 6.4 | Bundler e dev server |
| Tailwind CSS | 4.1 | Estilização utilitária |
| Motion | 12 | Animações e transições |
| Recharts | 3.8 | Gráficos (barra, pizza, linha, área) |
| Lucide React | 0.546 | Ícones |
| clsx + tailwind-merge | — | Utilitários de classe |

### Backend
| Tecnologia | Finalidade |
|-----------|------------|
| Supabase | Banco PostgreSQL + API REST |
| Supabase MCP | Gerenciamento via IA |
| @supabase/supabase-js | Cliente JavaScript |

### Infraestrutura
| Serviço | Finalidade |
|---------|-----------|
| GitHub | Versionamento |
| Vercel | Deploy contínuo (CI/CD) |
| Cloudflare | CDN e proteção |

---

## Modelo de Dados

### `vehicles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| plate | TEXT UNIQUE | Placa do veículo |
| model | TEXT | Modelo (ex: Volvo FH 540) |
| year | INTEGER | Ano de fabricação |
| status | ENUM | active, maintenance, inactive, alert |
| current_km | NUMERIC | Km atual |
| cost_per_km | NUMERIC | Custo por km rodado |
| next_maintenance_km | NUMERIC | Km para próxima revisão |
| insurance_expiry | DATE | Vencimento do seguro |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Última atualização |

### `drivers`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| name | TEXT | Nome completo |
| cnh | TEXT UNIQUE | Número da CNH |
| cnh_expiry | DATE | Vencimento da CNH |
| status | ENUM | active, on-trip, vacation, suspended |
| productivity | NUMERIC(5,2) | Produtividade (0-100) |
| occurrences | INTEGER | Número de ocorrências |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Última atualização |

### `trips`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| vehicle_id | UUID FK → vehicles | Veículo utilizado |
| driver_id | UUID FK → drivers | Motorista responsável |
| origin | TEXT | Cidade de origem |
| destination | TEXT | Cidade de destino |
| distance | NUMERIC | Distância em km |
| cargo | TEXT | Descrição da carga |
| revenue | NUMERIC | Receita da viagem |
| cost | NUMERIC | Custo da viagem |
| margin | NUMERIC (generated) | Margem = revenue - cost |
| date | DATE | Data da viagem |
| status | ENUM | scheduled, in-progress, completed |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Última atualização |

### `expenses`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| vehicle_id | UUID FK → vehicles (nullable) | Veículo (ou geral) |
| category | ENUM | fuel, maintenance, toll, tax, other |
| amount | NUMERIC | Valor |
| date | DATE | Data |
| description | TEXT | Descrição |
| invoice_number | TEXT | Número da nota fiscal |
| created_at | TIMESTAMPTZ | Data de criação |

### `fuel_fillups`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| vehicle_id | UUID FK → vehicles | Veículo |
| date | DATE | Data do abastecimento |
| liters | NUMERIC | Litros |
| price_per_liter | NUMERIC | Preço por litro |
| total_amount | NUMERIC (generated) | Total = liters × price_per_liter |
| current_km | NUMERIC | Km no momento |
| station_name | TEXT | Nome do posto |
| created_at | TIMESTAMPTZ | Data de criação |

### `maintenance_records`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| vehicle_id | UUID FK → vehicles | Veículo |
| type | ENUM | preventive, corrective |
| description | TEXT | Descrição do serviço |
| cost | NUMERIC | Custo |
| date | DATE | Data |
| status | ENUM | pending, in-progress, completed |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Última atualização |

### Relacionamentos

```
vehicles 1 ──── N trips
vehicles 1 ──── N expenses
vehicles 1 ──── N fuel_fillups
vehicles 1 ──── N maintenance_records
drivers  1 ──── N trips
```

### Índices

- `trips`: vehicle_id, driver_id, status, date
- `expenses`: vehicle_id, category, date
- `fuel_fillups`: vehicle_id, date
- `maintenance_records`: vehicle_id, status
- `vehicles`: status
- `drivers`: status

### Triggers

Atualização automática de `updated_at` em: vehicles, drivers, trips, maintenance_records.

---

## Estrutura do Projeto

```
he-travels&tuors/
├── .opencode/
│   └── skills/
│       └── project-continuity/
│           └── SKILL.md          ← Handoff entre sessões
├── public/
├── src/
│   ├── components/
│   │   ├── Costs.tsx             ← Custos e manutenção
│   │   ├── Dashboard.tsx         ← Dashboard operacional
│   │   ├── Drivers.tsx           ← Motoristas
│   │   ├── Fleet.tsx             ← Gestão de frota
│   │   ├── Fuel.tsx              ← Combustível
│   │   ├── Navigation.tsx        ← Sidebar e header
│   │   ├── Trips.tsx             ← Viagens
│   │   └── UI.tsx                ← Componentes reutilizáveis
│   ├── lib/
│   │   ├── alerts.ts             ← Motor de alertas
│   │   ├── supabase.ts           ← Cliente Supabase
│   │   └── utils.ts              ← Utilitários (cn, formatadores)
│   ├── App.tsx                   ← Componente raiz + estado central
│   ├── constants.ts              ← Constantes de gráficos
│   ├── index.css                 ← Estilos Tailwind + tokens
│   ├── main.tsx                  ← Entry point
│   └── types.ts                  ← Tipos TypeScript
├── supabase/
│   └── migrations/
│       └── 00001_initial_schema.sql
├── opencode.json                 ← Config OpenCode + MCP Supabase
├── vercel.json                   ← Config Vercel
└── package.json
```

---

## Instalação e Execução

**Pré-requisitos:** Node.js 18+

```bash
# Clonar
git clone https://github.com/Victoreduardo104949/HE-frota-gestao.git
cd HE-frota-gestao

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com as credenciais do Supabase

# Iniciar em desenvolvimento
npm run dev
```

Acessar em http://localhost:3000

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação de tipos TypeScript |

---

## Supabase

O banco de dados PostgreSQL é gerenciado via Supabase no projeto `jazkuwjrnlkfaoqmuopl`.

### Gerenciamento via MCP

O OpenCode está configurado com o MCP do Supabase (`opencode.json`), permitindo gerenciar o banco diretamente por comandos de IA:

```bash
opencode mcp auth supabase    # Autenticar
opencode mcp list             # Listar servidores MCP
```

### Migrations

Toda alteração no schema deve ser versionada em `supabase/migrations/`.

---

## Deploy

O deploy é feito automaticamente pelo **Vercel** sempre que houver push na branch `master`.

**Produção:** [https://he-travels-tuors.vercel.app](https://he-travels-tuors.vercel.app)  
**Dashboard Vercel:** https://vercel.com/victoreduardo104949s-projects/he-travels-tuors

---

## Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://jazkuwjrnlkfaoqmuopl.supabase.co
VITE_SUPABASE_ANON_KEY=<sua_chave_anon>
```

---

## OpenCode

O projeto utiliza o [OpenCode](https://opencode.ai) como assistente de desenvolvimento com:

- **MCP Supabase** — gerenciamento do banco de dados
- **Skill project-continuity** — handoff de contexto entre sessões
- **Configuração** em `opencode.json`

---

## Licença

© 2026 HE Travels&Tuors. Todos os direitos reservados.
