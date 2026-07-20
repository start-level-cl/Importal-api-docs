# Flujo de Trabajo de Bodega (Bodeguero Workflow)

El rol de **Bodeguero** (`UserRole.BODEGUERO`) en Importal es el encargado de la recepción física, inspección técnica, cubicación, empaque y despacho final de los productos. Este documento describe de manera exhaustiva el ciclo de vida del flujo de bodega, las validaciones de base de datos implementadas en el backend y el nuevo sistema de conciliación de diferencias financieras.

---

## Arquitectura de Código de Referencia

La lógica del flujo de bodega está implementada y coordinada en los siguientes componentes principales:

*   **Controlador de Órdenes y Entregas:** [orders.controller.ts](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/controllers/orders.controller.ts)
*   **Servicio de Órdenes:** [orders.service.ts](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/orders.service.ts)
*   **Entidades del Modelo de Datos:**
    *   [Carga](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/carga.entity.ts): Carga consolidada en tránsito o arribada.
    *   [Order](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/order.entity.ts): Pedidos individuales de los clientes.
    *   [OrderAdjustment](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/order-adjustment.entity.ts): Ajustes financieros por diferencias.
    *   [Caja](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/caja.entity.ts): Contenedores físicos para carga marítima.
    *   [Delivery](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/delivery.entity.ts): Despacho consolidado de un cliente en una carga.
    *   [Bulto](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/bulto.entity.ts) y [BultoPhoto](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/bulto-photo.entity.ts): Paquetes físicos despachados con pesos e imágenes de evidencia.
    *   [Cobro](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/billing/entities/cobro.entity.ts): Estado de cuenta y cobros financieros de los clientes.

---

## Flujo del Proceso de Bodega

A continuación se muestra el flujo secuencial que sigue una carga y sus pedidos asociados desde su arribo hasta su despacho:

```mermaid
sequenceDiagram
    autonumber
    actor B as Bodeguero
    actor C as Cliente
    participant API as Importal Backend
    participant DB as Base de Datos

    Note over B, API: Paso 1: Arribo de Carga
    B->>API: PUT /api/v1/bodeguero/cargas/:id/status (ARRIVED)
    API->>DB: Actualiza estado y arrived_at
    Note over API: Genera Cobros de Inversión Marítima si corresponde

    Note over B, API: Paso 2: Auditoría y Revisión
    B->>API: PUT /api/v1/bodeguero/pedidos/:id/revisar (reviewOrder)
    Note over API: Valida Arribado y Cuadratura (Llegaron + Faltaron + Dañados)
    alt Hay Diferencias (Faltantes/Dañados)
        API->>DB: Genera OrderAdjustment (PENDING_CLIENT)
        API->>DB: Marca Order.has_pending_adjustment = true
        API->>C: Envía Notificación ORDER_ADJUSTMENT_PENDING
        Note over API: Se bloquea la generación automática de cobro de Flete y Aduana
    else Sin Diferencias
        API->>DB: Marca revisado = true
        Note over API: Genera Cobros de Flete y Aduana si todos están revisados
    end

    Note over C, API: Paso 3: Resolución de Ajustes (Cliente)
    C->>API: POST /api/v1/cliente/ajustes/:adjId/resolver
    API->>DB: Resuelve ajuste, order.has_pending_adjustment = false
    Note over API: Genera Cobros de Flete y Aduana para la carga del cliente

    Note over B, API: Paso 4: Empaque e Inspección Financiera
    B->>API: GET /api/v1/bodeguero/cajas/:id (Auditoría de empaque)
    Note over B, API: Paso 5: Registrar Auditoría y Empaque (auditarEmpaque)
    B->>API: POST /api/v1/bodeguero/deliveries/:id/auditar-empaque
    Note over API: Valida que cobros de INVERSION, LOGISTICA_COMISION y FLETE_SEGURO_ADUANA estén pagados
    alt Hay Cobros Pendientes
        API-->>B: Error HTTP 400 (Bloqueado por deuda)
    else Pagos al día
        API->>DB: Cambia Delivery a READY_TO_SHIP
        API->>DB: Guarda Bultos y BultoPhotos
    end

    Note over B, API: Paso 6: Confirmar Salida Física (shipDelivery)
    B->>API: POST /api/v1/bodeguero/deliveries/:id/ship
    API->>DB: Cambia Delivery & Orders a SHIPPED
    API->>C: Envía Notificación DELIVERY_CONFIRMED
    end
```

---

## 1. Recepción y Arribo de la Carga

La carga logística se origina en estado `IN_TRANSIT`. Cuando el transporte físico arriba a la bodega, el Bodeguero o Administrador actualiza su estado.

*   **Endpoint:** `PUT /api/v1/bodeguero/cargas/:id/status`
*   **Método del Servicio:** `updateCargaStatus`
*   **Lógica de Negocio y Efectos:**
    1.  La carga pasa a estado `CargaStatus.ARRIVED` y se registra la marca de tiempo `arrived_at`.
    2.  Si la carga es de tipo **Marítima** (`TipoCarga.MARITIMA`), el backend ejecuta automáticamente el cálculo de inversión marítima:
        ```typescript
        await this.billingService.generateMaritimeInvestmentCharges(cargaId);
        ```
        Esto genera los cobros tipo `INVERSION` a los clientes que poseen productos de inversión marítima en dicha carga.

> [!IMPORTANT]
> **Bloqueo de Seguridad en Tránsito:**
> Para evitar errores de cuadratura en inventarios que físicamente no han llegado, el backend valida estrictamente en `reviewOrder` que la carga asociada al pedido tenga el estado `ARRIVED` o poseer un valor no nulo en su columna `arrived_at`. De lo contrario, se retorna un error `HTTP 400 Bad Request`.

---

## 2. Revisión Física y Auditoría (`reviewOrder`)

Una vez que la carga ha arribado, los productos se descargan y se auditan contra el manifiesto digital usando el método `reviewOrder`.

*   **Endpoint:** `PUT /api/v1/bodeguero/pedidos/:id/revisar`
*   **Parámetros:** `ReviewOrderDto` (`llegaron`, `faltaron`, `dañados`, `peso_cobrado_kg`, `caja_ids: number[]`)

### 2.1 Ecuación de Cuadratura Física
El backend valida estrictamente que la suma de las cantidades física e incidencias coincida con la cantidad original solicitada:
$$\text{Llegaron} + \text{Faltaron} + \text{Dañados} == \text{order.total\_items}$$
Si esta ecuación no se cumple, el backend arroja un error de validación impidiendo guardar el registro.

### 2.2 Reglas de Cubicación y Peso (Aéreo vs Marítimo)

| Vía de Transporte | Campo de Peso (`peso_cobrado_kg`) | Campo de Cajas (`caja_ids`) | Regla Excluyente del Backend |
| :--- | :--- | :--- | :--- |
| **AÉREO** | Opcional | Opcional (una o más cajas) | Debe ingresarse el Peso **o** las Cajas, pero **nunca ambos** simultáneamente. |
| **MARÍTIMO** | **Prohibido** | **Obligatorio** | Debe asociarse obligatoriamente a una o más cajas físicas existentes. El peso manual no aplica en marítimo. |

---

### 2.3 NUEVA LÓGICA: Conciliación de Diferencias y Ajustes

Anteriormente, cuando existían diferencias físicas severas se permitía el rechazo directo del pedido. **Actualmente, el rechazo directo de órdenes por el Bodeguero está deshabilitado ante diferencias.** En su lugar, el sistema opera con el siguiente flujo automatizado:

1.  **Detección de Incidencias:** Si el pedido se marca como revisado pero presenta faltantes o daños (`faltaron > 0 || dañados > 0`):
    *   Se marca la orden con `has_pending_adjustment = true`.
    *   La orden guarda temporalmente `order.llegaron` como la nueva cantidad física.
2.  **Generación del Ajuste (`OrderAdjustment`):** Se genera automáticamente un registro en [OrderAdjustment](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/order-adjustment.entity.ts) en estado `PENDING_CLIENT`.
3.  **Recálculo Financiero Automático:** El backend calcula de forma preventiva los reembolsos en CLP:
    *   **Inversión Reembolsable:** Calculada sobre la diferencia física:
        $$\text{Diferencia} = \text{Original} - \text{Llegaron}$$
        $$\text{Reembolso Inversión} = \text{Diferencia} \times \text{Precio USD} \times \text{Tasa de Cambio} \times (1 + \text{Tasa Impuesto \%})$$
    *   **Logística/Comisión Recalculada:** Se evalúa el nuevo total de compra del cliente en la carga y se recalcula su porcentaje de comisión a través de los tramos de la tabla `CommissionTier`. La diferencia entre la comisión original cobrada y la nueva comisión ajustada se asigna como `refund_comision_clp`.
4.  **Bloqueo de Cobro de Flete y Aduana:**
    *   En condiciones normales, cuando todos los pedidos de un cliente en una carga han sido marcados como `revisado = true`, se genera automáticamente el cobro logístico final (`FLETE_SEGURO_ADUANA`) llamando a `generateFleteYAduanaCobro()`.
    *   **Con la nueva lógica:** Si al verificar la carga del cliente, existe **al menos una orden** con `has_pending_adjustment = true`, **la generación del cobro de flete y aduana se pospone**.
5.  **Resolución por el Cliente:** El cliente recibe la alerta `ORDER_ADJUSTMENT_PENDING` y decide cómo resolverlo (Nota de Crédito, Deducción Directa, Reembolso por Transferencia o Trueque). Al resolverlo:
    *   El backend restablece `order.has_pending_adjustment = false`.
    *   Se reevalúan todos los pedidos de la carga para el cliente. Si ya no existen ajustes pendientes y todos están revisados, se genera y emite de inmediato el cobro de `FLETE_SEGURO_ADUANA`.

---

## 3. Bloqueo Financiero de Despacho (Anti-Mora)

Antes de autorizar el empaque y preparación de cualquier pedido de bodega, el backend implementa una validación restrictiva de pagos pendientes en el método `auditarEmpaque`.

> [!WARNING]
> **Política de Cero Deuda en Despacho:**
> Al intentar auditar y empacar una entrega (`Delivery`), el sistema consulta todos los cobros vigentes del cliente asociados a la carga actual.
> *   **Tipos de Cobro Auditados:** `INVERSION`, `LOGISTICA_COMISION` y `FLETE_SEGURO_ADUANA`.
> *   **Criterio de Bloqueo:** Si **al menos uno** de estos cobros posee un estado distinto de `CobroStatus.CONFIRMED` (por ejemplo, `PENDING`, `OVERDUE` o `RETRY`), la transacción es cancelada arrojando un error `HTTP 400 Bad Request`:
>     > *"El cliente tiene cobros pendientes en esta carga: [Tipos]. Debe estar pagado para poder despachar."*

---

## 4. Empaque en Cajas (Carga Marítima)

Para el transporte marítimo, es obligatorio el uso de cajas físicas para consolidar la carga de los clientes. 

*   **Relación Many-to-Many (`order_cajas`):** una orden puede asociarse a **múltiples cajas simultáneamente**, y una caja puede contener múltiples órdenes. La asignación se hace vía `reviewOrder` enviando `caja_ids: number[]`. **Importante — semántica de reemplazo:** cada llamada a `revisar` con `caja_ids` reemplaza por completo el set de cajas del pedido (no es acumulativo); para agregar una caja a un pedido que ya tiene otras asignadas, el frontend debe reenviar el array completo (las anteriores + la nueva). El backend valida que **todas** las cajas del array existan (`404` listando las faltantes) y que cada tamaño de caja tenga tarifa de flete activa (`400` si falta alguna) antes de guardar.
*   **Creación de Cajas:** El bodeguero registra las cajas en la base de datos (`POST /api/v1/bodeguero/cajas`) asociándolas al cliente y la carga correspondiente, especificando el tamaño de la caja (`caja_size`: S, M, L, XL).
*   **Costos Logísticos Proporcionales:** El flete no se cobra dos veces por estar el pedido en múltiples cajas; en su lugar, se prorratea el costo total de cada caja entre todos los pedidos asignados a ella. El flete final del pedido es la sumatoria de sus porciones prorrateadas (ver detalle de la fórmula en [Ajustes de Pedidos y Reembolsos](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/importal-api-docs/docs-src/adjustments-refunds.md)).
*   **Auditoría de Cajas:** A través del endpoint `GET /api/v1/bodeguero/cajas/:id`, el bodeguero audita el contenido real, las órdenes asignadas y el peso de una caja específica para proceder con su sellado.

## 5. Registrar Auditoría y Empaque (`auditarEmpaque`)

Una vez que se han verificado los pagos y los productos están embalados, se realiza el registro de bultos y auditoría de la entrega, lo que la coloca en estado `READY_TO_SHIP` (Lista para envío).

*   **Endpoint:** `POST /api/v1/bodeguero/deliveries/:id/auditar-empaque`
*   **Controlador:** `auditarEmpaque(req, id, dto)` en `orders.controller.ts`
*   **Payload de Entrada (`ConfirmDespachoDto`):**
    ```json
    {
      "video_ref_info": "Cámara principal - Grabación de Sellado",
      "camera_id": "CAM-04-DESPACHO",
      "carrier_proof_url": "https://s3.amazonaws.com/importal-proofs/guia-transportista-9812.pdf",
      "bultos": [
        {
          "bulto_number": 1,
          "weight_kg": 14.5,
          "photos": [
            "https://s3.amazonaws.com/importal-proofs/bulto-1-photo1.jpg"
          ]
        }
      ]
    }
    ```

### 5.1 Cambios en Base de Datos tras Registrar Auditoría y Empaque
Cuando se procesa exitosamente la auditoría:
1.  **Estado de Entrega:** El registro de [Delivery](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/delivery.entity.ts) cambia su estado a `DeliveryStatus.READY_TO_SHIP`.
2.  **Registro de Bultos:** Se registran los elementos en [Bulto](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/bulto.entity.ts) y sus respectivas evidencias fotográficas en [BultoPhoto](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/bulto-photo.entity.ts).
3.  **Notificación al Cliente:** Se dispara un evento asíncrono que consume la lambda de notificaciones (`Importal-notification-lambda`) enviando una alerta de tipo `DELIVERY_READY` al cliente:
    > *"Su envío para la carga #XX ha sido auditado y empacado exitosamente. Está listo para despacho."*

---

## 5.2 Confirmar Salida Física (`shipDelivery`)

Cuando el transportista o courier retira físicamente la mercancía de la bodega, se realiza el despacho definitivo.

*   **Endpoint:** `POST /api/v1/bodeguero/deliveries/:id/ship`
*   **Controlador:** `shipDelivery(req, id)` en `orders.controller.ts`
*   **Cambios en Base de Datos tras la Salida Física:**
    1.  **Estado de Entrega:** El registro de [Delivery](file:///C:/Users/joyta/OneDrive/Desktop/repos/startup/Importal/Importal-backend/src/modules/orders/entities/delivery.entity.ts) cambia su estado a `DeliveryStatus.SHIPPED` y se guardan metadatos como `dispatched_at` y `dispatched_by_id`.
    2.  **Estado de Pedidos:** Todas las órdenes del cliente en esa carga específica que no estén canceladas o rechazadas cambian su estado a `OrderStatus.SHIPPED` y se vinculan al primer bulto físico generado (`order.bulto_id`).
    3.  **Notificación al Cliente:** Se envía una notificación de despacho en tránsito al cliente.

> [!IMPORTANT]
> **Validación Estricta de Datos de Envío:**
> Al intentar confirmar la salida física, el backend realiza una validación estricta de los datos de despacho. Si la entrega no tiene completos los datos de dirección de envío (`shipping_address`) y el método de envío (`shipping_method`), el servidor arrojará de inmediato un error **`HTTP 400 Bad Request`** bloqueando la salida física.

---

## 6. Dashboard de Bodega y Control de Clientes

Para agilizar la operación y el control diario del bodeguero, se incorporaron vistas clave en la interfaz del bodeguero sustentadas por endpoints específicos:

### 6.1 Dashboard General (`/bodeguero/dashboard`)
Permite visualizar un resumen de métricas clave y desempeño operativo de la bodega:
*   **Endpoint:** `GET /api/v1/bodeguero/dashboard`
*   **Información provista:**
    *   **Lotes por verificar:** Cargas activas que han arribado pero no han completado su revisión física.
    *   **Pedidos listos para enviar:** Entregas consolidadas en estado de preparación o despachadas.
    *   **Incidencias sin resolver:** Pedidos con reportes de daños o faltantes aún no resueltos por los clientes.
    *   **Indicadores de Desempeño:** Tasa de precisión de inventario y volumen histórico de lotes verificados.

### 6.2 Control de Estado de Clientes por Carga (`/bodeguero/cargas/:id/clientes-status`)
Permite al bodeguero auditar individualmente a los clientes asociados a una carga y verificar si están listos (liberados de deuda y con revisión física concluida) para el despacho físico.
*   **Endpoint:** `GET /api/v1/bodeguero/cargas/:id/clientes-status`
*   **Servicio:** `getCargaClientesStatus(id)` en `orders.service.ts`
*   **Detalles Retornados por Cliente:**
    *   `client_id`: ID del cliente (`number`).
    *   `client_name`: Nombre del cliente (`string`).
    *   `email`: Correo electrónico del cliente (`string`).
    *   `is_free`: Bandera booleana que indica si el cliente ha pagado el 100% de los cobros obligatorios de esta carga (`INVERSION`, `LOGISTICA_COMISION` y `FLETE_SEGURO_ADUANA`), liberándolo de deudas para el despacho.
    *   `delivery_id`: ID del despacho asociado (`number` o `null`).
    *   `delivery_status`: Estado de la entrega/despacho asociado (`DeliveryStatus` o `null`). Valores posibles: `PENDING`, `IN_REVISION`, `READY_TO_SHIP`, `SHIPPED`, `DELIVERED`.
    *   `orders_total`: Cantidad total de pedidos del cliente en esta carga (`number`).
    *   `orders_reviewed`: Cantidad de pedidos que ya fueron revisados físicamente (`number`).
    *   `all_orders_reviewed`: Bandera booleana que confirma que todos los pedidos del cliente en esta carga han sido revisados físicamente (`orders_reviewed == orders_total`).
    *   `unpaid_cobros` y `blocking_cobros_summary`: Listados de cobros pendientes de confirmación que bloquean la entrega.
*   **Ejemplo de Respuesta:**
    ```json
    [
      {
        "client_id": 1,
        "client_name": "María González Pérez",
        "email": "maria@gmail.com",
        "is_free": true,
        "delivery_id": 12,
        "delivery_status": "READY_TO_SHIP",
        "orders_total": 5,
        "orders_reviewed": 5,
        "all_orders_reviewed": true,
        "blocking_cobros_summary": [
          {
            "cobro_id": 101,
            "tipo_cobro": "INVERSION",
            "total_clp": 450000,
            "status": "CONFIRMED"
          }
        ],
        "unpaid_cobros": []
      }
    ]
    ```

### 6.3 Listado de Entregas por Despachar (`GET /api/v1/bodeguero/deliveries`)
Permite obtener la lista paginada de entregas de bodega con opciones de paginación y filtros por cliente, carga y estado.
*   **Endpoint:** `GET /api/v1/bodeguero/deliveries`
*   **Campos de Retorno Adicionales por Entrega:**
    *   `total_weight`: Peso total en kg, calculado como la sumatoria del peso de todos sus bultos (`number`).
    *   `cajas`: Array de cajas físicas asociadas a las órdenes del cliente en la entrega.
*   **Filtro Automático de Dirección y Método de Envío:** Al solicitar entregas en estado `READY_TO_SHIP` (que es el valor predeterminado si el parámetro `status` no es enviado en la query), el backend filtra de forma automática las entregas omitiendo aquellas que no cuenten con datos de dirección (`shipping_address`) y método de envío (`shipping_method`) confirmados por el cliente. Esto previene que el bodeguero intente preparar o despachar bultos que carecen de destino final definido.

### 6.3.1 Detalle de Entrega por ID (`GET /api/v1/bodeguero/deliveries/:id`)
Permite obtener el detalle completo de una entrega específica por su ID.
*   **Endpoint:** `GET /api/v1/bodeguero/deliveries/:id`
*   **Servicio:** `getDeliveryById(id)` en `orders.service.ts`
*   **Campos Retornados:** Incluye toda la estructura de la entrega (`client`, `carga`, `bultos`) complementada con:
    *   `total_weight`: Peso total en kg de los bultos asociados.
    *   `cajas`: Colección desduplicada de las cajas físicas asociadas a las órdenes de este cliente.

### 6.4 Listado de Órdenes Físicas en Bodega (`/bodeguero/pedidos?excludeDelivered=true`)
Permite consultar en tiempo real qué pedidos se encuentran almacenados físicamente en la bodega de destino (Chile) y que aún no han sido despachados ni cancelados. Este caso de uso se sirve ahora desde el endpoint unificado `GET /bodeguero/pedidos` (el antiguo `GET /bodeguero/ordenes-fisicas` fue removido por tener lógica duplicada).
*   **Endpoint:** `GET /api/v1/bodeguero/pedidos?excludeDelivered=true`
*   **Lógica de Selección:**
    1. Filtra las órdenes cuya carga asociada se encuentra en estado `CargaStatus.ARRIVED`.
    2. Con `excludeDelivered=true`, excluye de forma estricta los estados finales de salida física (`OrderStatus.DELIVERED`, `OrderStatus.CANCELLED` y `OrderStatus.REJECTED`). Sin el flag, solo excluye `CANCELLED`/`REJECTED` (comportamiento histórico de `/bodeguero/pedidos`, útil para búsquedas que también deben incluir entregados).
    3. Retorna las órdenes con sus relaciones completas (`product`, `carga`, `cajas`, `client`) para auditar qué cajas tienen asignadas y si ya han sido marcadas como revisadas (`revisado: boolean`).
    4. También admite los filtros `clientId` y `cargaId` para acotar la búsqueda a un cliente o carga específicos.

---

## 7. Inventario Operativo Interno de Bodega (No Ventas) y su Uso en Trueques

Para optimizar la logística y ofrecer soluciones rápidas a incidencias de quiebre de stock, se habilitó el registro de inventario operativo interno.

### 7.1 Registro de Ítems Operativos de Bodega
*   **Endpoints:**
    *   `POST /api/v1/bodeguero/inventario` (Registrar ítem, siempre creado en `status: ACTIVE`. `multipart/form-data`, admite hasta 4 `photos` opcionales — mismo mecanismo de subida que `POST /vendedor/productos`, pero sin exigir al menos una foto)
    *   `GET /api/v1/bodeguero/inventario` (Listar y buscar con filtros SKU, nombre y `status`; `photo_urls` viene resuelto a URLs firmadas de S3)
    *   `GET /api/v1/bodeguero/inventario/:id` (Detalle de un ítem individual; `404` si no existe)
    *   `PUT /api/v1/bodeguero/inventario/:id` (Actualizar stock y ubicación; no permite cambiar fotos)
    *   `DELETE /api/v1/bodeguero/inventario/:id` (Desactivar ítem — soft-delete, marca `status: INACTIVE`)
*   **Regla de Operación:** Estos productos se registran por el bodeguero indicando el nombre, SKU, marca, stock y su ubicación física (ej: "Pasillo 3, Estante B"). **No pertenecen al catálogo público de ventas** ni tienen precios al cliente, comisiones, ni asignaciones a vendedores.
*   **Lógica alineada con `vendedor/productos`:** mismo patrón de creador asignado vía JWT y `DELETE` como soft-delete (necesario porque `Order.warehouse_inventory_id` puede referenciar el ítem en un trueque, sin `ON DELETE CASCADE`/`SET NULL` configurado). A diferencia de `vendedor/productos`, `UPDATE`/`DELETE` **no** restringen por dueño: cualquier `BODEGUERO`/`ADMIN`/`ROOT` puede gestionar cualquier ítem, al ser un recurso compartido de la bodega.

### 7.2 Flujo en Trueques y Regla de Costo $0
1.  **Propuesta de Trueque:** Cuando ocurre una falta de stock, el administrador puede ingresar a los tickets de tipo `BARTER_NEGOTIATION` y proponer un cambio al cliente utilizando un ítem del catálogo o un ítem registrado en el inventario interno de bodega (`warehouse_inventory_id`).
2.  **Validación y Decremento de Stock:** Al aceptar el trueque el cliente (`aceptarTrueque`), el backend decrementa el stock directamente de la tabla `warehouse_inventory` según la cantidad propuesta.
3.  **Exclusión de Cobros de Comisión y Costo:**
    *   La orden generada a partir del trueque de bodega se vincula mediante `warehouse_inventory_id`, fijando su precio en dólares a cero (`price_usd = 0`) y la bandera `is_barter = true`.
    *   **Regla de Cobro:** En el proceso de facturación semanal, el motor de cobros en `BillingService` **excluye de forma estricta** a todas estas órdenes del cobro de comisiones logísticas e inversión de producto, asegurando un coste total de $0 para el cliente final y cero comisiones para el vendedor.
