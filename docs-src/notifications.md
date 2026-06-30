# Notificaciones

La plataforma Importal dispone de un sistema centralizado de notificaciones asíncronas para mantener informados a los distintos participantes del ecosistema (Administradores, Vendedores, Clientes y Operarios de Bodega) sobre eventos críticos del negocio.

---

## Clasificación de Canales

El envío de notificaciones se procesa a través de una cola de SQS y una función Lambda dedicada (`Importal-notification-lambda`), la cual clasifica y rutea los eventos según los siguientes canales:

### 1. Internas (In-App)
* **Destino:** Base de datos DynamoDB.
* **Consumo:** Consumidas directamente por las aplicaciones frontend de Importal mediante un endpoint dedicado.
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
| `CLIENT_REG_OTP` | Email, SMS | 🔒 Código de verificación — Importal | Envía una clave única (One-Time Password) de verificación para el registro o doble factor de autenticación. Expira en 10 minutos. |
| `CLIENT_REG_APPROVED` | Email | 🎉 ¡Bienvenido a Importal! | Notifica la aprobación definitiva de la cuenta del cliente por parte del administrador. Proporciona su usuario y, en caso de aplicar, una contraseña temporal, junto con un botón de redirección al portal de login. |
| `CLIENT_BILL_GENERATED` | Email | 🧾 Tu factura está lista | Alerta que se ha emitido un nuevo cobro consolidado. Incluye el número de factura, el monto total y la fecha de vencimiento. |
| `CLIENT_BILL_OVERDUE` | Email | ⚠️ Aviso de Cobro en Mora — Importal | Notificación urgente que avisa al cliente de un saldo vencido sin pagar. Detalla el monto acumulado en mora y advierte sobre el riesgo de suspensión de servicios si no se regulariza. |
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
