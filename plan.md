# Plan de Implementacion de Documentacion API

## Objetivo

Centralizar la documentacion OpenAPI de `Importal-auth`, `Importal-backend` y `Importal-registration-lambda` en un solo flujo versionado, verificable y consumible por frontend.

## Estado implementado

- Inventario automatico de rutas desde el codigo fuente.
- Especificacion unificada en `generated/openapi.json` y `generated/openapi.yaml`.
- Vista HTML local en `docs/index.html`.
- Tipos TypeScript generados en `generated/api-types.d.ts`.
- Validacion para detectar rutas del codigo que no quedaron en el spec.
- Reporte de colisiones en `generated/duplicate-routes.json`.

## Fuente de verdad

- `Importal-auth/src/modules/**/*controller.ts`
- `Importal-backend/src/modules/**/*controller.ts`
- `Importal-registration-lambda/src/index.ts`
- Metadata central y schemas enriquecidos en `spec/documentacion/scripts/lib/spec-config.mjs`

## Estructura

```text
spec/documentacion
├─ package.json
├─ README.md
├─ plan.md
├─ scripts
│  ├─ build-openapi.mjs
│  ├─ generate-types.mjs
│  ├─ validate-openapi.mjs
│  ├─ serve-docs.mjs
│  └─ lib
│     ├─ route-extractor.mjs
│     ├─ spec-config.mjs
│     └─ typegen.mjs
├─ generated
│  ├─ openapi.json
│  ├─ openapi.yaml
│  ├─ api-types.d.ts
│  ├─ source-routes.json
│  └─ duplicate-routes.json
└─ docs
   └─ index.html
```

## Comandos

```bash
cd Importal/spec/documentacion
npm run build
npm run validate
npm run serve
```

## Flujo

1. `npm run build`
   Genera el inventario de rutas, el OpenAPI unificado, el YAML, la vista HTML y los tipos TS.

2. `npm run validate`
   Falla si existe alguna ruta en el codigo que no este reflejada en `openapi.json`.

3. `npm run serve`
   Sirve `docs/index.html` y los artefactos generados para revision local.

## Convenciones de ruteo reflejadas

- Auth: `/auth/api/...`
- Backend: `/api/...`
- Registration lambda publica: `/registration-requests...`

## Observaciones actuales

- Existe una colision de ruta en backend:
  `DELETE /api/v1/vendedor/productos/{id}`
  aparece tanto en `ProductsController` como en `OrdersController`.
  El pipeline la deja registrada en `generated/duplicate-routes.json`.

## Siguiente paso recomendado

Consumir `generated/api-types.d.ts` desde `Importal-frontend` y `Importal-login` para reemplazar contratos manuales en login, registro y flujos administrativos.
