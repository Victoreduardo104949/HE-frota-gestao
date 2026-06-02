# HE Travels&Tuors

Sistema premium de gestão de frotas e viagens, com foco em excelência operacional e design sofisticado.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **UI:** Motion (framer-motion), Recharts, Lucide React
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Vercel

## Funcionalidades

- **Dashboard Operacional** — KPIs, gráficos de custos, alertas do sistema
- **Gestão de Frota** — CRUD de veículos, km, status, seguro, manutenção
- **Motoristas** — CRUD com CNH, produtividade, histórico de viagens
- **Viagens** — Registro com origem/destino, receita, custo, margem
- **Custos & Manutenção** — Despesas por categoria, ordens de serviço
- **Combustível** — Abastecimentos, eficiência, histórico de preços

## Scripts

```bash
npm run dev      # Iniciar em desenvolvimento (porta 3000)
npm run build    # Build de produção
npm run preview  # Preview do build
```

## Banco de Dados

O schema está em `supabase/migrations/00001_initial_schema.sql`:

- `vehicles` — Frota de veículos
- `drivers` — Motoristas
- `trips` — Viagens
- `expenses` — Despesas
- `fuel_fillups` — Abastecimentos
- `maintenance_records` — Ordens de manutenção

## Deploy

Conectado ao Vercel — pushes na branch `master` fazem deploy automático.

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://jazkuwjrnlkfaoqmuopl.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```
