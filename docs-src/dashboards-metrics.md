# Dashboards y Métricas

Esta sección documenta los endpoints de resumen operativo (dashboards) y métricas analíticas disponibles para cada rol dentro de la plataforma Pascalle Store.

---

## Resumen de Endpoints

| Módulo | Método | Ruta | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/v1/admin/dashboard` | `ADMIN`, `ROOT` | Panel de control administrativo con resumen financiero. |
| **Dashboard** | `GET` | `/api/v1/cliente/dashboard` | `CLIENT` | Panel de resumen del cliente (cargas activas, deuda). |
| **Dashboard** | `GET` | `/api/v1/vendedor/dashboard` | `VENDOR` | Panel de resumen del vendedor (ventas y pedidos). |
| **Dashboard** | `GET` | `/api/v1/bodeguero/dashboard` | `BODEGUERO`, `ADMIN`, `ROOT` | Panel operativo de bodega. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/orders` | `ADMIN`, `ROOT` | Métricas de órdenes en el tiempo. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/revenue` | `ADMIN`, `ROOT` | Métricas de ingresos por moneda. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/users` | `ADMIN`, `ROOT` | Métricas de usuarios activos y nuevos. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/performance` | `ADMIN`, `ROOT` | Métricas de rendimiento del sistema. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/transactions` | `ADMIN`, `ROOT` | Métricas de transacciones financieras. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/compliance` | `ADMIN`, `ROOT` | Métricas de cumplimiento y riesgo. |
| **Métricas** | `GET` | `/api/v1/admin/metrics/carga/:id` | `ADMIN`, `ROOT` | Métricas de una carga de importación. |
| **Métricas** | `GET` | `/api/v1/vendedor/metrics/carga/:id` | `VENDOR` | Métricas de carga del vendedor. |
| **Admin** | `POST` | `/api/v1/admin/users/create-admin` | `ROOT` | Crear un nuevo usuario administrador. |

---

## 1. Dashboards por Rol

### 1.1 Dashboard Administrador

Devuelve un resumen financiero y operativo de la plataforma para el período especificado.

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/dashboard`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:**
  - `startDate` (opcional, string ISO): Fecha de inicio del período a consultar.
  - `endDate` (opcional, string ISO): Fecha de fin del período a consultar.
- **Respuesta:** Incluye totales de cobros, pagos, usuarios activos, cargas en tránsito y métricas financieras del período.

> [!NOTE]
> **Minimización de PII en `ultimos_morosos`:**
> El listado `ultimos_morosos` retornado por el dashboard administrativo recorta `client_name` a solo el primer nombre (`name.trim().split(' ')[0]`) y reemplaza el RUT personal (`client_rut`) por el RUT de facturación empresarial (`rut_empresa`), el cual retorna `null` si no existe.

### 1.2 Dashboard Cliente

Devuelve el resumen del estado financiero y operativo del cliente autenticado.

- **Método:** `GET`
- **Ruta:** `/api/v1/cliente/dashboard`
- **Roles Permitidos:** `CLIENT`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "active_loads": 2,
    "pending_cobros": 1,
    "total_deuda_clp": 145000
  }
  ```

### 1.3 Dashboard Vendedor

Devuelve el resumen de ventas, pedidos activos e ingresos del vendedor autenticado.

- **Método:** `GET`
- **Ruta:** `/api/v1/vendedor/dashboard`
- **Roles Permitidos:** `VENDOR`
- **Respuesta:** Totales de pedidos por estado, ingresos USD/CLP del período activo.

### 1.4 Dashboard Bodeguero

Devuelve un resumen operativo del estado actual de bodega: cargas por procesar, entregas pendientes y pedidos en revisión.

- **Método:** `GET`
- **Ruta:** `/api/v1/bodeguero/dashboard`
- **Roles Permitidos:** `BODEGUERO`, `ADMIN`, `ROOT`

---

## 2. Métricas Analíticas (Admin)

Todos los endpoints de métricas reciben un parámetro opcional `timeRange` que acepta los siguientes valores: `1d`, `7d`, `30d`, `24h`. El valor por defecto varía según el endpoint.

### 2.1 Métricas de Órdenes

Estadísticas de pedidos creados, confirmados y cancelados en el período.

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/metrics/orders`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:**
  - `timeRange` (opcional, default `30d`): Rango de tiempo a analizar.

### 2.2 Métricas de Ingresos

Análisis de ingresos totales, desglosados por moneda y período.

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/metrics/revenue`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:**
  - `timeRange` (opcional, default `30d`)
  - `currency` (opcional, enum `CLP` | `USD`, default `CLP`)

### 2.3 Métricas de Usuarios

Usuarios nuevos, activos y métricas de crecimiento de la base de clientes.

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/metrics/users`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:**
  - `timeRange` (opcional, default `30d`)

### 2.4 Métricas de Rendimiento

Métricas operativas del sistema: tiempos de respuesta, throughput de pedidos y KPIs de servicio.

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/metrics/performance`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:**
  - `timeRange` (opcional, default `24h`)

### 2.5 Métricas de Transacciones

Volumen y valor de transacciones financieras procesadas (cobros, pagos, reembolsos).

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/metrics/transactions`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:**
  - `timeRange` (opcional, default `30d`)

### 2.6 Métricas de Cumplimiento

Indicadores de cumplimiento regulatorio y gestión de riesgos: usuarios en mora, solicitudes pendientes y alertas activas.

- **Método:** `GET`
- **Ruta:** `/api/v1/admin/metrics/compliance`
- **Roles Permitidos:** `ADMIN`, `ROOT`
- **Query Parameters:** Ninguno.

### 2.7 Métricas por Carga

Consulta métricas consolidadas de una carga de importación específica (ingresos, peso, pedidos por estado).

> [!NOTE]
> Estos endpoints están también documentados en la [Guía de Admin API](./admin-api#52-métricas-por-carga-de-importación).

- `GET /api/v1/admin/metrics/carga/:id` — Para `ADMIN` y `ROOT`.
- `GET /api/v1/vendedor/metrics/carga/:id` — Para `VENDOR` (solo sus métricas dentro de la carga).

---

## 3. Administración de Usuarios (Root)

### 3.1 Crear Administrador

Crea un nuevo usuario con rol `ADMIN` en la plataforma.

- **Método:** `POST`
- **Ruta:** `/api/v1/admin/users/create-admin`
- **Roles Permitidos:** `ROOT` (exclusivo)
- **Cuerpo de la Petición (JSON):** `CreateAdminDto`
  ```json
  {
    "name": "Nombre Administrador",
    "email": "admin@pascallestore.com",
    "password": "contraseña-temporal-segura"
  }
  ```
- **Respuesta Exitosa (201 Created):** Objeto del usuario administrador creado.

> [!CAUTION]
> Este endpoint es exclusivo para el rol `ROOT`. Cualquier intento de acceso con un rol diferente resultará en `403 Forbidden`. El nuevo administrador recibirá una notificación por correo (`ADMIN_CREDENTIALS_CREATED`) con sus credenciales de acceso.
