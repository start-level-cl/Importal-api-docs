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

## Flujos de Carga para Vendedores

En Importal, la gestión de cargas y pedidos para los vendedores está sujeta a las siguientes reglas de negocio y flujos técnicos:

### 1. Visualización de Pedidos en la Carga Activa
El vendedor puede listar los pedidos asociados a su asignación de carga activa llamando a:
- **Endpoint:** `GET /api/v1/vendedor/pedidos`
- **Parámetros:** `active_carga` (obligatorio: `true`), `tipo_carga` (opcional: `AEREA` o `MARITIMA`)
- **Comportamiento:** Retorna la lista de pedidos paginados que se consolidarán en la carga abierta actual asignada a dicho vendedor.

### 2. Transición Individual de Pedidos a la Siguiente Carga
Si un vendedor no puede enviar un producto específico en la carga actual (por ejemplo, por falta de stock temporal o retraso logístico), puede enviar una solicitud de transición para esa orden específica:
- **Endpoint:** `POST /api/v1/vendedor/pedidos/{id}/solicitar-transicion`
- **Comportamiento:** Registra una solicitud de transición. El administrador del sistema (`ADMIN` o `ROOT`) debe aprobar o rechazar esta solicitud en los endpoints correspondientes de administración. Si se aprueba, la orden pasa a la siguiente carga abierta disponible.

### 3. Solicitud de Tránsito de Carga Anticipada
Si un vendedor desea avanzar voluntariamente a la siguiente carga antes de que cierre la actual:
- **Endpoint:** `POST /api/v1/vendedor/solicitudes-carga` (cuerpo: `{ "tipo_carga": "AEREA" | "MARITIMA" }`)
- **Comportamiento:** Genera una solicitud que requiere aprobación del administrador. Al aprobarse, el vendedor queda asignado a la nueva carga abierta del tipo de transporte seleccionado.

### 4. Transición por Carga Cerrada
Cuando el administrador cierra oficialmente una carga (`POST /api/v1/admin/cargas/{id}/close`), los vendedores que estaban asignados a ella tienen que migrar su flujo a la nueva carga.
- **Endpoint:** `POST /api/v1/vendedor/cargas/transicion-cierre`
- **Comportamiento:** Si el vendedor no tiene pedidos pendientes (`PENDING`) en la carga cerrada anterior, su asignación se actualiza automáticamente a la nueva carga abierta.

### 5. Bloqueo de Publicación por Pedidos Pendientes en Cargas Cerradas
Para asegurar que los vendedores resuelvan y entreguen a tiempo los pedidos de cargas pasadas:
- **Regla:** Si un vendedor tiene algún pedido con estado `PENDING` asociado a una carga cerrada (`status = 'CLOSED'`), **se le bloqueará la posibilidad de publicar nuevos productos**.
- **Comportamiento:** El endpoint `POST /api/v1/vendedor/productos` arrojará un error `400 BadRequestException` con el detalle del bloqueo.

## Flujo de Aprobación de Registro para Nuevos Usuarios (Clientes/Inversores)

Cuando un nuevo usuario solicita ingresar a la plataforma, se sigue el siguiente flujo de validación y revisión por parte del administrador:

### 1. Creación de Solicitud y Carga de Comprobante
El usuario crea su solicitud de registro y sube un comprobante de transferencia o validación. La solicitud queda almacenada temporalmente en DynamoDB en estado `PENDING`.

### 2. Listado de Solicitudes Pendientes (Admin)
El administrador visualiza todas las solicitudes pendientes que han verificado su correo o teléfono:
- **Endpoint:** `GET /api/v1/registration-requests`
- **Roles permitidos:** `ADMIN`, `ROOT`

### 3. Visualización del Comprobante (Admin)
Para validar la veracidad de la información de pago o verificación cargada por el usuario:
- **Endpoint:** `GET /api/v1/registration-requests/{email}/comprobante`
- **Roles permitidos:** `ADMIN`, `ROOT`
- **Comportamiento:** Retorna el comprobante cargado por el usuario codificado en formato Base64 Data URL, permitiendo al administrador previsualizarlo directamente en el panel.

### 4. Resolución de la Solicitud (Aprobación/Rechazo)
Una vez validado el comprobante, el administrador procede a resolver la solicitud:
- **Aprobación:** `POST /api/v1/registration-requests/{email}/approve` (Crea al usuario en la base de datos local y en el servicio de autenticación auth, asignándole su rol correspondiente).
- **Rechazo:** `POST /api/v1/registration-requests/{email}/reject` (Marca la solicitud como rechazada).

