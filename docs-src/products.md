# Productos y Catálogo

Esta sección documenta los endpoints para la gestión del catálogo de productos en la plataforma Pascalle Store. Incluye rutas para que los clientes exploren el catálogo disponible y para que los vendedores administren sus productos publicados.

---

## Resumen de Endpoints

| Módulo | Método | Ruta | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Catálogo** | `GET` | `/api/v1/cliente/productos` | `CLIENT`, `ADMIN`, `ROOT` | Listar productos disponibles para compra con filtros. |
| **Catálogo** | `GET` | `/api/v1/productos/:id` | Todos los roles | Obtener el detalle de un producto por su ID. |
| **Vendedor** | `GET` | `/api/v1/vendedor/productos` | `VENDOR`, `ADMIN`, `ROOT` | Listar productos publicados por el vendedor autenticado. |
| **Vendedor** | `POST` | `/api/v1/vendedor/productos` | `VENDOR` | Crear un nuevo producto con fotos. |
| **Vendedor** | `PUT` | `/api/v1/vendedor/productos/:id` | `VENDOR`, `ADMIN`, `ROOT` | Actualizar los datos de un producto existente. |
| **Vendedor** | `DELETE` | `/api/v1/vendedor/productos/:id` | `VENDOR`, `ADMIN`, `ROOT` | Eliminar (dar de baja) un producto. |
| **Público** | `GET` | `/api/v1/publico/productos/:id` | Ninguno (sin sesión) | Proyección pública de un producto para previews de "compartir por redes sociales". |

---

## 1. Catálogo de Productos (Cliente)

### 1.1 Listar Productos Disponibles

Devuelve el catálogo de productos disponibles para compra, filtrado automáticamente según los tipos de transporte autorizados para el cliente.

- **Método:** `GET`
- **Ruta:** `/api/v1/cliente/productos`
- **Roles Permitidos:** `CLIENT`, `ADMIN`, `ROOT`
- **Query Parameters:**
  - `sala` (opcional, string): Filtrar por sala de transporte (`AEREA`, `MARITIMA`).
  - `transport_type` (opcional, string): Tipo de transporte del producto.
  - `vendor` (opcional, string): Filtrar por vendedor específico.
  - `page` (opcional, default `1`): Número de página.
  - `limit` (opcional, default `20`): Cantidad de resultados por página.

> [!NOTE]
> **Filtrado por Transporte Autorizado y Ordenamiento por Stock:**
> - **Filtrado por Transporte:** Cuando el solicitante es un `CLIENT`, el backend aplica automáticamente un filtro basado en los tipos de sala/transporte a los que tiene acceso (extraídos del token JWT). Esto garantiza que cada cliente solo vea los productos compatibles con sus salas habilitadas.
> - **Orden de Productos:** Los productos con stock disponible (`stock > 0`) se priorizan al inicio. Los productos con stock igual a cero (`stock = 0` / sin stock) se ordenan automáticamente al final de los resultados.

### 1.2 Obtener Producto por ID

Devuelve el detalle completo de un producto específico, incluyendo sus tallas y stock disponible.

- **Método:** `GET`
- **Ruta:** `/api/v1/productos/:id`
- **Roles Permitidos:** `CLIENT`, `VENDOR`, `BODEGUERO`, `ADMIN`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID del producto.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 42,
    "marca": "Nike",
    "price_usd": 35.00,
    "status": "AVAILABLE",
    "transport_type": "AEREA",
    "photo_urls": [
      "https://s3.amazonaws.com/bucket/producto-42-front.jpg"
    ],
    "sizes": [
      { "talla": "S", "stock": 10 },
      { "talla": "M", "stock": 5 },
      { "talla": "L", "stock": 0 }
    ],
    "vendor": {
      "id": 7,
      "name": "Proveedor Ejemplo"
    }
  }
  ```

---

## 2. Gestión de Productos (Vendedor)

### 2.1 Listar Mis Productos

Devuelve todos los productos publicados por el vendedor autenticado.

- **Método:** `GET`
- **Ruta:** `/api/v1/vendedor/productos`
- **Roles Permitidos:** `VENDOR`, `ADMIN`, `ROOT`
- **Query Parameters:**
  - `transport_type` (opcional, string): Filtrar por tipo de transporte (`AEREA`, `MARITIMA`).
  - `status` (opcional, string): Filtrar por estado (`AVAILABLE`, `UNAVAILABLE`, `DRAFT`).

> [!NOTE]
> **Ordenamiento por Stock:** Los productos publicados con stock total igual a cero (`stock = 0`) se desplazan automáticamente al final del listado de resultados.

### 2.2 Crear Producto

Publica un nuevo producto con fotos en el catálogo de la plataforma. La petición debe enviarse obligatoriamente como `multipart/form-data`.

- **Método:** `POST`
- **Ruta:** `/api/v1/vendedor/productos`
- **Roles Permitidos:** `VENDOR`
- **Content-Type:** `multipart/form-data`

- **Campos Obligatorios:**
  - `photos` (archivos binarios, mínimo 1 y máximo 4): Imágenes del producto en formato de archivo binario.
  - `transport_type` (string, `AEREA` | `MARITIMA` | `BOTH`): Tipo de transporte asignado al producto.
  - `sizes` (JSON string o array de `{talla, stock}`): Listado de tallas y stock. Debe contener al menos una talla válida. Cada elemento debe ser un objeto con `talla` (string no vacío) y `stock` (número entero ≥ 0).

- **Campos Opcionales:**
  - `marca` (string, opcional): Nombre de la marca o descripción del producto.
  - `price_usd` (número, opcional): Precio unitario en dólares estadounidenses (USD).
  - `cargaId` (número, opcional): ID de la carga específica a la que se ancla el producto (para `AEREA` o `MARITIMA`).
  - `cargaAereaId` (número, opcional): ID de la carga aérea específica donde se publica el producto (para `BOTH` o `AEREA`).
  - `cargaMaritimaId` (número, opcional): ID de la carga marítima específica donde se publica el producto (para `BOTH` o `MARITIMA`).

- **Ejemplo de `sizes` (JSON String / Array):**
  ```json
  [
    { "talla": "S", "stock": 20 },
    { "talla": "M", "stock": 15 },
    { "talla": "L", "stock": 10 }
  ]
  ```

- **Respuesta Exitosa (201 Created):**
  Retorna el objeto `Product` creado con las URLs firmadas/públicas de S3 (`photo_urls`), `id`, `status` (`AVAILABLE`), `transport_type`, `sizes`, `carga_id`, `carga_aerea_id`, `carga_maritima_id`, etc.

  ```json
  {
    "id": 42,
    "marca": "Nike",
    "price_usd": 35.00,
    "status": "AVAILABLE",
    "transport_type": "BOTH",
    "carga_id": null,
    "carga_aerea_id": 4,
    "carga_maritima_id": 8,
    "photo_urls": [
      "https://s3.amazonaws.com/bucket/producto-42-front.jpg"
    ],
    "sizes": [
      { "id": 1, "talla": "S", "stock": 20 },
      { "id": 2, "talla": "M", "stock": 15 }
    ],
    "vendorId": 7,
    "createdAt": "2026-07-29T12:00:00.000Z",
    "updatedAt": "2026-07-29T12:00:00.000Z"
  }
  ```

> [!IMPORTANT]
> **Validaciones y Asociación Dual de Cargas en Productos BOTH (Opción 1):**
> - **Fotos (`photos`)**: Debe adjuntarse **al menos 1 archivo** (campo `photos`). Máximo 4 archivos.
> - **Tipo de Transporte (`transport_type`)**: Campo **obligatorio** (`AEREA`, `MARITIMA` o `BOTH`).
> - **Listado de Tallas (`sizes`)**: Campo **obligatorio**.
> - **Asociación Dual de Cargas en Productos `BOTH`**: Cuando un producto se publica con `transport_type = BOTH`, el sistema le asigna simultáneamente una carga aérea activa (`carga_aerea_id`) y una carga marítima activa (`carga_maritima_id`). El campo `carga_id` queda en `null`. Se pueden especificar `cargaAereaId` y `cargaMaritimaId` en la solicitud; de lo contrario, se asignan por defecto las cargas activas vigentes del vendedor para cada tipo de transporte.
> - **Coincidencia de Tipo de Transporte con Carga (`cargaId`)**: Si se envía un `cargaId` opcional en productos de transporte simple (`AEREA` o `MARITIMA`), el `tipo_carga` de la carga asignada debe coincidir con el `transport_type` del producto. De lo contrario, retorna `400 BadRequestException`.

### 2.3 Actualizar Producto

Modifica los datos de un producto existente.

- **Método:** `PUT`
- **Ruta:** `/api/v1/vendedor/productos/:id`
- **Roles Permitidos:** `VENDOR`, `ADMIN`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID del producto a actualizar.
- **Cuerpo de la Petición (JSON):** `UpdateProductDto` (campos parciales: `marca`, `price_usd`, `status`, `sizes`, etc.)
- **Respuesta Exitosa (200 OK):** Devuelve el producto actualizado.

> [!NOTE]
> Los `ADMIN` y `ROOT` pueden actualizar productos de cualquier vendedor. Los `VENDOR` solo pueden editar sus propios productos.

### 2.4 Eliminar Producto

Da de baja un producto del catálogo.

- **Método:** `DELETE`
- **Ruta:** `/api/v1/vendedor/productos/:id`
- **Roles Permitidos:** `VENDOR`, `ADMIN`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID del producto a eliminar.
- **Respuesta Exitosa (200 OK):** Confirmación de eliminación.

> [!WARNING]
> Los vendedores solo pueden eliminar sus propios productos. `ADMIN` y `ROOT` pueden eliminar productos de cualquier vendedor.

---

## 3. Vista Pública para Compartir en Redes Sociales

Cuando alguien comparte el link de un producto por WhatsApp, Facebook, Twitter, Telegram, LinkedIn, Slack o Discord, quien lo recibe ve un preview con foto, nombre y precio (Open Graph), **sin necesidad de sesión**.

### 3.1 Obtener Producto Público por ID

- **Método:** `GET`
- **Ruta:** `/api/v1/publico/productos/:id`
- **Roles Permitidos:** Ninguno — endpoint público, sin JWT.
- **Path Parameters:**
  - `id` (número, requerido): ID del producto.
- **Headers de Respuesta:** `Cache-Control: public, max-age=300`.
- **Respuesta Exitosa (200 OK)** — `PublicProductDto`:
  ```json
  {
    "id": 42,
    "nombre": "Nike",
    "fotos": [
      "https://d111111abcdef8.cloudfront.net/portal/productos/foto1.webp"
    ],
    "precioClp": 31500,
    "proveedorNombre": "Comercializadora Vendedor SpA",
    "tipo": "aereo",
    "tallas": ["S", "M"],
    "disponible": true
  }
  ```
- **Errores:**
  - `404 Not Found`: el producto no existe o su `status` no es `AVAILABLE`.

> [!IMPORTANT]
> **Lista blanca de datos deliberada.** `PublicProductDto` expone únicamente `id`, `nombre` (= `product.marca`, no existe un campo "nombre" separado en la entidad `Product`), `fotos` (URLs de CloudFront ya resueltas, sin firma), `precioClp`, `proveedorNombre`, `tipo` (`"aereo" | "maritimo"`; `BOTH` se expone como `"aereo"`), `tallas` (solo etiquetas con stock > 0, sin cantidades) y `disponible` (`true` si `tallas.length > 0`). **No** expone `proveedorCodigo`/`external_id` del vendor, `vendor_id`, costos internos, comisiones, IDs de carga ni el `status` del producto — a propósito, por seguridad y privacidad de datos de negocio.
>
> `precioClp` = `price_usd * tipo de cambio vigente`, redondeado al peso. Usa la misma fuente que `BillingService.getLatestExchangeRate()` (tabla `exchange_rates`, más reciente por fecha; fallback 950 CLP/USD sin registros). `ProductsService` consulta el repo de `ExchangeRate` directo en vez de inyectar `BillingService`, para evitar una dependencia circular entre módulos (`BillingModule` ya importa `ProductsModule`).

### 3.2 Renderer de Open Graph (Lambda@Edge)

La ruta pública `/p/:productId` (creada por el frontend) se sirve a través de un behavior dedicado de la distribución CloudFront (`Importal-iac`). Un Lambda@Edge (`ProductShareRenderer`, `us-east-1`, Node 20) intercepta la petición en `origin-request`:

- Si el `User-Agent` es un crawler conocido (`facebookexternalhit`, `WhatsApp`, `Twitterbot`, `TelegramBot`, `LinkedInBot`, `Slackbot`, `Discordbot`), consulta `GET /api/v1/publico/productos/:id` y devuelve un HTML con meta tags Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type=product`) y Twitter Card (`summary_large_image`), más `<meta name="robots" content="noindex">` — el producto se comparte, pero no se indexa en buscadores.
- Para cualquier otro `User-Agent`, deja pasar el request normal y se carga la SPA.
- Si el producto no existe (`404`) o el API no responde `200`, sirve una preview genérica de "Importal" en vez de propagar el error.

> [!WARNING]
> **Requisito de despliegue:** este Lambda no admite variables de entorno (limitación de Lambda@Edge), así que la URL base del API público se resuelve al momento del `cdk synth`/`deploy` desde `DEV_PUBLIC_API_BASE_URL` / `PROD_PUBLIC_API_BASE_URL`. Si la variable no está definida, el synth de `Importal-iac` emite un warning y **no crea el renderer** (el behavior `/p/*` igual se crea, pero sin Lambda asociada, y sirve la SPA para cualquier visitante). Ver `Importal-iac/README.md` para el detalle del paso de deploy.
