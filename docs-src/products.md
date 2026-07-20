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
> **Filtrado por Transporte Autorizado:**
> Cuando el solicitante es un `CLIENT`, el backend aplica automáticamente un filtro basado en los tipos de sala/transporte a los que tiene acceso (extraídos del token JWT). Esto garantiza que cada cliente solo vea los productos compatibles con sus salas habilitadas.

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

### 2.2 Crear Producto

Publica un nuevo producto con fotos en la plataforma. La petición debe enviarse como `multipart/form-data`.

- **Método:** `POST`
- **Ruta:** `/api/v1/vendedor/productos`
- **Roles Permitidos:** `VENDOR`
- **Content-Type:** `multipart/form-data`
- **Campos del Formulario:**
  - `photos` (archivo, requerido, máximo 4): Imágenes del producto (campo de subida múltiple).
  - `marca` (string, requerido): Nombre de la marca o producto.
  - `price_usd` (número, requerido): Precio en dólares estadounidenses.
  - `transport_type` (string, requerido): Tipo de transporte (`AEREA` o `MARITIMA`).
  - `sizes` (JSON string, requerido): Array serializado de tallas y stock.
- **Ejemplo de `sizes` (JSON):**
  ```json
  [
    { "talla": "S", "stock": 20 },
    { "talla": "M", "stock": 15 },
    { "talla": "L", "stock": 10 },
    { "talla": "XL", "stock": 5 }
  ]
  ```
- **Respuesta Exitosa (201 Created):** Devuelve el producto creado con los URLs de S3.

> [!IMPORTANT]
> **Validaciones Obligatorias:**
> - Se debe subir **al menos una foto** (campo `photos`). Si no se adjunta ninguna imagen, se devuelve `400 BadRequestException`.
> - El campo `transport_type` es **obligatorio**.
> - El campo `sizes` debe ser un **JSON válido** con al menos una talla, y cada elemento debe contener `talla` (string no vacío) y `stock` (número ≥ 0).

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
