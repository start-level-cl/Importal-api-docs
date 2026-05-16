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
