# Notificaciones

La plataforma Pascalle Store dispone de un sistema centralizado de notificaciones asíncronas para mantener informados a los distintos participantes del ecosistema (Administradores, Vendedores, Clientes y Operarios de Bodega) sobre eventos críticos del negocio.

---

## Clasificación de Canales

El envío de notificaciones se procesa a través de una cola de SQS y una función Lambda dedicada (`Importal-notification-lambda`), la cual clasifica y rutea los eventos según los siguientes canales:

### 1. Internas (In-App)
* **Destino:** Base de datos DynamoDB.
* **Consumo:** Consumidas directamente por las aplicaciones frontend de Pascalle Store mediante un endpoint dedicado.
* **Comportamiento:** **No** gatillan servicios de mensajería externos (como AWS SES o SNS), optimizando costos y evitando saturar los buzones del usuario.

### 2. Externas (Email / SMS)
* **Email:** Enviado de forma asíncrona a través de **AWS SES** (Simple Email Service). Utiliza plantillas HTML responsivas basadas en un diseño estándar de la marca.
* **SMS:** Enviado a través de **AWS SNS** (Simple Notification Service) para notificaciones rápidas y críticas que requieren lectura inmediata en dispositivos móviles.

---

## Notificaciones por Rol de Usuario

A continuación se detalla el catálogo estructurado de tipos de evento (`eventType`) configurados en el sistema:

### 1. Administradores (`Admin`)

Estas notificaciones alertan a los administradores de la plataforma sobre registros, conciliaciones bancarias, incidentes de productos y solicitudes de pago.

| Event Type Code | Canales | Asunto / Título | Propósito y Contenido |
| :--- | :--- | :--- | :--- |
| `ADMIN_CREDENTIALS_CREATED` | Email | 🔐 Tu cuenta de administrador está lista | Notifica a un nuevo administrador que su cuenta ha sido creada. Contiene el correo de acceso y una contraseña temporal en texto plano, con la sugerencia de cambiarla al iniciar sesión. |
| `ADMIN_NEW_REGISTRATION` | Email, SMS | 📋 Nueva solicitud de registro pendiente | Alerta sobre un nuevo registro de usuario que requiere aprobación manual. El correo incluye el nombre, email, RUT y tipo de perfil (vendedor, cliente, etc.) del solicitante. El SMS actúa como recordatorio corto. |
| `ADMIN_CARGA_TRANSITION_REQUEST` | Email | 📋 Nueva solicitud de cambio de carga | Se genera cuando un vendedor solicita asociar su cuenta a una carga distinta. Incluye el ID del vendedor, el tipo de carga y la carga actual de origen. |
| `ADMIN_VENDOR_PAYMENT_REQUEST` | Email | 💰 Nueva solicitud de pago de vendedor | Notifica que un vendedor ha solicitado retirar su saldo acumulado. Proporciona el ID de solicitud, nombre del vendedor, nota adjunta y un enlace directo al comprobante de cobro subido. |
| `ADMIN_PAYMENT_CONCILIATED` | Email | ✅ Pago conciliado exitosamente | Informa de la conciliación automática exitosa de un pago contra la cartola bancaria. Contiene el monto conciliado, la referencia y el nombre del cliente asociado. |
| `ADMIN_MOVEMENT_UNMATCHED` | Email | ⚠️ Movimiento bancario sin conciliación | Se dispara si se detecta un abono en la cartola bancaria que el sistema no pudo asociar a ninguna factura o cobro pendiente. Contiene monto, fecha y descripción para facilitar la conciliación manual. |
| `ADMIN_VENDOR_INVOICE` | Email | 🧾 Boleta de vendedor pendiente de aprobación | Notifica que un vendedor ha subido una boleta de honorarios o factura para respaldar un cobro. Incluye el nombre del vendedor, monto y número del documento para revisión. |
| `ADMIN_PRODUCT_ISSUE` | Email | 🚨 Reporte de productos dañados o faltantes | Notifica que se ha detectado una anomalía (faltante, merma o daño físico) durante la recepción de mercadería en bodega. Detalla el nombre de la bodega, el ID del lote y la descripción del incidente. |
| `ADMIN_BATCH_VERIFIED` | In-App | 📦 Lote verificado listo para despacho | Notificación únicamente interna en el panel que informa que el proceso de control de calidad y verificación física de un lote en bodega ha finalizado exitosamente. |

---

### 2. Vendedores (`Vendor`)

Dirigidas a los proveedores para informarles sobre ventas, pagos recibidos y mermas en bodega.

| Event Type Code | Canales | Asunto / Título | Propósito y Contenido |
| :--- | :--- | :--- | :--- |
| `VENDOR_NEW_ORDER` | In-App, SMS | 🛒 Nuevo pedido recibido | Avisa al vendedor que un cliente ha realizado un pedido. El SMS incluye el ID de la orden y el enlace para ingresar al portal a aceptarla o rechazarla. |
| `VENDOR_PAYMENT_APPROVED` | Email | 💰 Pago aprobado — Transferencia confirmada | Notifica al vendedor que su liquidación de saldo ha sido aprobada por la administración y la transferencia bancaria ha sido cursada. Detalla el monto liquidado y el código de referencia. |
| `VENDOR_WAREHOUSE_ISSUE` | Email | 📷 Reporte de daños en bodega | Se envía al vendedor cuando el personal de bodega detecta y documenta daños o roturas en sus productos pertenecientes a un lote específico. Adjunta el ID del lote y el detalle del incidente para su revisión en el panel. |
| `VENDOR_PURCHASE_CONFIRMED` | In-App | ✅ Compras confirmadas en la sesión | Notificación interna que informa al vendedor que se ha cerrado y confirmado la compra consolidada de una sesión de ventas activa. |

---

### 3. Clientes (`Client`)

Mantienen al comprador informado de sus pedidos, estados de facturación, alertas de mora y procesos de ajuste.

| Event Type Code | Canales | Asunto / Título | Propósito y Contenido |
| :--- | :--- | :--- | :--- |
| `CLIENT_PROMO_START` | Email, SMS | 🔥 ¡Las ventas comienzan pronto! | Campaña automática enviada a los clientes cuando un vendedor está por iniciar una sesión de ofertas programada. Informa el nombre del vendedor y el horario de inicio del evento. |
| `CLIENT_REG_OTP` | Email, SMS | 🔒 Código de verificación — Pascalle Store | Envía una clave única (One-Time Password) de verificación para el registro o doble factor de autenticación. Expira en 10 minutos. |
| `CLIENT_REG_APPROVED` | Email | 🎉 ¡Bienvenido a Pascalle Store! | Notifica la aprobación definitiva de la cuenta del cliente por parte del administrador. Proporciona su usuario y, en caso de aplicar, una contraseña temporal, junto con un botón de redirección al portal de login. |
| `CLIENT_BILL_GENERATED` | Email | 🧾 Tu factura está lista | Alerta que se ha emitido un nuevo cobro consolidado. Incluye el número de factura, el monto total y la fecha de vencimiento. |
| `CLIENT_BILL_OVERDUE` | Email | ⚠️ Aviso de Cobro en Mora — Pascalle Store | Notificación urgente que avisa al cliente de un saldo vencido sin pagar. Detalla el monto acumulado en mora y advierte sobre el riesgo de suspensión de servicios si no se regulariza. |
| `CLIENT_ORDER_CONFIRMED` | Email | ✅ Pedido confirmado por el vendedor | Informa al cliente que el vendedor ha aceptado procesar su pedido de compra. Contiene el ID del pedido y los datos de contacto del vendedor. |
| `CLIENT_BATCH_DISPATCHED` | Email | 🚚 Tu pedido ha sido despachado | Se envía cuando la mercadería del cliente ha sido cargada en el transporte para su entrega. Contiene el ID del pedido y el número de tracking de la empresa transportista. |
| `CLIENT_ORDER_REJECTED` | In-App | ❌ Pedido cancelado | Notificación únicamente visible in-app para informar que el vendedor ha declinado o cancelado el pedido realizado. |
| `CLIENT_REG_REJECTED` | In-App, Email | ⛔ Registro denegado | Informa al usuario que su solicitud para ingresar a la plataforma fue rechazada por la administración. Se detalla el motivo del rechazo en el cuerpo del correo. |
| `CLIENT_ORDER_ADJUSTMENT_PENDING` | Email | ⚠️ Diferencias físicas detectadas en tu pedido | > [!IMPORTANT]<br>**Alerta de Diferencias Críticas**<br>Informa al cliente que la revisión en bodega detectó discrepancias físicas (unidades dañadas o faltantes) en su pedido. Se detalla que los cobros de flete y aduana internacional para la carga quedan pausados hasta que el cliente ingrese al portal y resuelva el método de compensación (Dinero, Nota de Crédito o Trueque). |

---

### 4. Bodega (`Bodega` / Operario de Bodega)

Notificaciones de flujo operativo destinadas al personal encargado del almacenamiento y despacho.

| Event Type Code | Canales | Asunto / Título | Propósito y Contenido |
| :--- | :--- | :--- | :--- |
| `BODEGA_CARGO_READY` | Email | 📦 Carga lista para verificación | Notifica al personal del centro de distribución que ha ingresado físicamente un lote/carga. Proporciona el ID del lote, nombre del vendedor de origen y la cantidad estimada de ítems para iniciar el conteo de recepción. |
| `BODEGA_ORDER_DISPATCH` | In-App | 🚛 Pedido listo para despacho | Alerta interna para los operarios de picking indicando que un pedido aprobado ya cuenta con la documentación requerida y debe prepararse para su retiro por parte del courier. |
| `ACCOUNT_BLOCKED` | In-App, Email | 🔒 Tu cuenta ha sido suspendida | Notifica al usuario que su cuenta fue bloqueada manualmente por un administrador. Incluye el motivo del bloqueo. |
| `ACCOUNT_UNBLOCKED` | In-App, Email | ✅ Tu cuenta ha sido reactivada | Notifica al usuario que su cuenta fue desbloqueada manualmente. |
| `ADMIN_BLOCKED_BY_ROOT` | In-App, Email | 🔒 Administrador suspendido | Notifica a todo el equipo administrativo cuando el Root bloquea a un administrador. |
| `ADMIN_UNBLOCKED_BY_ROOT` | In-App, Email | ✅ Administrador reactivado | Notifica a todo el equipo administrativo cuando el Root desbloquea a un administrador. |

---

## 5. Endpoints REST de Notificaciones

### 5.1 Listar Notificaciones del Usuario

Obtiene las notificaciones in-app del usuario autenticado, paginadas y filtradas.

- **Método:** `GET`
- **Ruta:** `/api/v1/notificaciones`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Query Parameters:**
  - `page` (opcional, default `1`): Número de página.
  - `limit` (opcional, default `20`): Cantidad de notificaciones por página.
  - `all` (opcional, string `'true'`): Si se envía `true`, retorna todas las notificaciones sin filtrar por estado de lectura.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 55,
        "type": "CLIENT_BILL_GENERATED",
        "title": "🧾 Tu factura está lista",
        "body": "Se ha emitido un nuevo cobro por CLP $145,000. Fecha de vencimiento: 25/07/2026.",
        "read": false,
        "created_at": "2026-07-20T12:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "total": 12,
      "unread": 3
    }
  }
  ```

### 5.2 Marcar Notificación como Leída

Marca una notificación específica como leída para el usuario autenticado.

- **Método:** `PUT`
- **Ruta:** `/api/v1/notificaciones/:id/leer`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID de la notificación.
- **Respuesta Exitosa (200 OK):** Notificación actualizada con `read: true`.

### 5.3 Marcar Todas como Leídas

Marca en bloque todas las notificaciones no leídas del usuario autenticado.

- **Método:** `PUT`
- **Ruta:** `/api/v1/notificaciones/leer-todas`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):** Confirmación de actualización masiva.

---

## 6. Anuncio SMS Masivo y Cuota (Vendedor)

Los vendedores pueden enviar anuncios promocionales por SMS dirigidos exclusivamente a sus **compradores previos** (clientes que les han realizado compras en la plataforma), sujetos a reglas de cuota mensual y envío parcial.

> [!IMPORTANT]
> **Reglas de Negocio de SMS Marketing:**
> - **Límite Mensual (Cuota):** Cada vendedor tiene un límite de **100 SMS por mes** (`monthly_limit`). La cuota se lleva por periodo `year_month` (formato `YYYY-MM`) y se crea automáticamente en el primer uso del mes.
> - **Público Objetivo (Past Buyers):** Solo se consideran usuarios con rol `CLIENT`, con `phone_number` no vacío, que tengan consentimiento (`phone = true` o `concentimiento = true`) y que hayan comprado previamente a ese vendedor (órdenes que no estén en `CANCELLED` ni `REJECTED`).
> - **Envío Parcial por Cuota:** Si la cantidad de compradores previos supera la cuota restante, el sistema despacha solo hasta agotar la cuota disponible y descarta el resto.
> - **Cuota Agotada:** Si la cuota restante es `0`, el endpoint de envío responde `400 Bad Request` con el mensaje `Has alcanzado tu límite mensual de 100 SMS para marketing.`

### 6.1 Consultar Cuota Mensual de SMS

Permite al vendedor autenticado verificar su límite mensual de SMS, el consumo del periodo actual y los mensajes disponibles.

- **Método:** `GET`
- **Ruta:** `/api/v1/vendedor/notificar-sms/cuota`
- **Roles Permitidos:** `VENDOR`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "vendor_id": 7,
    "year_month": "2026-07",
    "monthly_limit": 100,
    "sent_count": 35,
    "remaining_quota": 65
  }
  ```
  - `year_month` (string): Periodo de la cuota en formato `YYYY-MM`.
  - `monthly_limit` (número): Límite mensual asignado al vendedor (por defecto `100`).
  - `sent_count` (número): SMS ya despachados en el periodo.
  - `remaining_quota` (número): `monthly_limit - sent_count`.

### 6.2 Enviar Anuncio SMS Masivo

Encola el envío de un anuncio masivo por SMS a los compradores previos del vendedor, respetando la cuota restante.

- **Método:** `POST`
- **Ruta:** `/api/v1/vendedor/notificar-sms`
- **Roles Permitidos:** `VENDOR`
- **Cuerpo de la Petición (JSON):** `SendSmsAnnouncementDto`
  ```json
  {
    "message": "¡Nuevos productos disponibles esta semana! Ingresa a la plataforma para ver el catálogo."
  }
  ```
  - `message` (string, requerido): Contenido del SMS a enviar. Se recomienda un máximo de 160 caracteres.
- **Respuesta Exitosa (200 OK):** Confirmación de procesamiento y encolado en AWS SQS.
  ```json
  {
    "message": "Anuncio SMS enviado con éxito.",
    "sent_count": 30,
    "remaining_quota": 35,
    "year_month": "2026-07"
  }
  ```
  - `sent_count` (número): Cantidad de SMS efectivamente encolados en esta operación.
  - `remaining_quota` (número): Cuota restante después de descontar `sent_count`.
- **Sin destinatarios:** Si el vendedor no tiene compradores previos que cumplan los criterios, responde `200 OK` sin consumir cuota:
  ```json
  {
    "message": "No se encontraron clientes que cumplan con los criterios de envío.",
    "sent_count": 0,
    "remaining_quota": 65,
    "year_month": "2026-07"
  }
  ```
- **Error (400 Bad Request):** Cuota mensual agotada (`remaining_quota <= 0`).

> [!NOTE]
> El SMS se encola en AWS SQS y se procesa de forma asíncrona por la Lambda de notificaciones. El endpoint confirma el encolado y la cuota consumida, no la entrega final al destinatario. Si `NOTIFICATION_QUEUE_URL` no está configurada, el envío físico se omite pero la cuota igualmente se descuenta.
