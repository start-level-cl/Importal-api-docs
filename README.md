# Documentacion API Importal

Este directorio centraliza la documentacion OpenAPI de `Importal-auth`, `Importal-backend` y `Importal-registration-lambda`.

## Artefactos generados

- `generated/openapi.json`
- `generated/openapi.yaml`
- `generated/api-types.d.ts`
- `generated/source-routes.json`
- `generated/duplicate-routes.json`
- `docs/index.html`

## Comandos

```bash
cd Importal/spec/documentacion
npm run build
npm run validate
npm run serve
```

## Como funciona

1. Extrae el inventario de endpoints desde los controladores NestJS y la lambda de registro.
2. Lo cruza con una capa central de metadata y schemas.
3. Genera un `openapi.json` y `openapi.yaml` versionados.
4. Genera tipos TypeScript para consumo en frontend.
5. Publica una vista HTML simple que no depende de Swagger UI en runtime.

## Notas

- La extraccion es automatica para el inventario de rutas.
- Las descripciones, cuerpos y schemas mas relevantes se mantienen en `scripts/lib/spec-config.mjs`.
- `npm run validate` falla si el codigo expone rutas que no quedaron reflejadas en la especificacion central.

## Deploy estatico en Vercel

Vercel publica la documentacion desde `docs/`.

Configuracion esperada del proyecto en Vercel:

- Framework preset: `Other`.
- Root directory: raiz de `importal-api-docs`.
- Install command: vacio o `echo "No install required"`.
- Build command: vacio o `echo "Static docs ready"`.
- Output directory: `docs`.
- Production branch: `main`.

El deploy lo ejecuta Vercel directamente mediante su integracion con GitHub:

- cada pull request hacia `main` genera un preview deployment;
- cada merge o push a `main` genera un deployment productivo;
- no hay workflow de GitHub Actions para desplegar;
- no se ejecuta `npm install`, `npm run build`, `npm run validate` ni generacion OpenAPI durante el deploy;
- Vercel solo publica el HTML y artefactos estaticos versionados dentro de `docs/`.

Este deploy no ejecuta generacion ni validacion profunda en CI. Cuando se trabaje con los repos fuente disponibles, seguir usando:

```bash
npm run build
npm run validate
```

La URL publica final de Vercel debe registrarse aqui despues del primer deploy productivo.
