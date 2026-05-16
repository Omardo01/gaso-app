# GasoApp

App web para registrar cargas de gasolina y monitorear el rendimiento (km/L) de tu vehículo.

Construida con **Next.js 14 (App Router) + HeroUI v2 + Tailwind CSS + Recharts**. La persistencia es 100% local (`localStorage`, clave `gasoapp_v2`) — no hay backend.

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## PWA

Incluye `manifest.json`, meta tags `apple-mobile-web-app` y `theme-color` morado. En iPhone: Compartir → "Agregar a pantalla de inicio".

## Estructura

- `app/page.tsx` — Dashboard principal
- `components/` — HeroCard, RecordCard, AddRecordModal, EfficiencyChart, EmptyState, Toast
- `lib/storage.ts` — wrapper de `localStorage` y recalculo de derivados (km recorridos, eficiencia)
- `lib/calculations.ts` — stats, clasificación de eficiencia, formateadores MXN/fecha
