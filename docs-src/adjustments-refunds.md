# Ajustes de Pedidos y Reembolsos

El sistema de Importal cuenta con un ciclo estructurado para manejar diferencias de stock o incidencias en los pedidos a través de **Ajustes y Reembolsos**. Permite a los vendedores reducir las unidades de un pedido y a los clientes elegir cómo ser compensados.

---

## Flujo del Proceso de Ajustes

El flujo de vida de un ajuste de orden consta de tres fases principales: **Creación, Resolución y Cierre**.

```mermaid
stateDiagram-v2
    [*] --> PENDING_CLIENT : Vendedor crea ajuste (adjustOrder)
    
    state PENDING_CLIENT {
        [*] --> Acepta_Parcial : Cliente acepta (accept_partial = true)
        [*] --> Rechaza_Parcial : Cliente rechaza (accept_partial = false)
    }
    
    Acepta_Parcial --> COMPLETED : Si elige CREDIT_NEXT_BILL o PARTIAL_DEDUCTION
    Acepta_Parcial --> RESOLVED : Si elige FULL_REFUND
    Acepta_Parcial --> BARTER_WAITING : Si elige BARTER_NEGOTIATION
    
    Rechaza_Parcial --> COMPLETED : Si elige CREDIT_NEXT_BILL o PARTIAL_DEDUCTION
    Rechaza_Parcial --> RESOLVED : Si elige FULL_REFUND
    Rechaza_Parcial --> BARTER_WAITING : Si elige BARTER_NEGOTIATION
    
    BARTER_WAITING --> COMPLETED : Acepta propuesta trueque (cliente)
    BARTER_WAITING --> PENDING_CLIENT : Rechaza o cancela trueque (cliente/admin)
    
    RESOLVED --> COMPLETED : Administrador procesa (completeRefund)
    COMPLETED --> [*]
```

### 1. Solicitud de Ajuste (Vendedor)
Cuando un vendedor no puede cumplir con la cantidad total de un pedido, solicita un ajuste desde su panel:
* **Endpoint:** `PUT /api/v1/vendedor/pedidos/{id}/ajustar`
* **Acción:** Se define una cantidad ajustada (`adjusted_quantity`) menor que la original.
* **Cálculo de Reembolsos (Si el pedido ya fue cobrado):**
  * **Inversión (Inversión en CLP):** Se calcula sobre la diferencia de ítems.
    $$\text{Diferencia} = \text{Cant. Original} - \text{Cant. Ajustada}$$
    $$\text{Reembolso Inversión} = \text{Diferencia} \times \text{Precio USD} \times \text{Tasa de Cambio} \times (1 + \text{Impuesto \%})$$
    *(Por defecto el impuesto es 8.25%)*
  * **Comisión de Logística:** Se recalcula la comisión del cliente en la carga. Al cambiar la base del pedido, el porcentaje de la comisión puede variar según los tramos de la tabla `CommissionTier`. La diferencia entre la comisión original y la nueva comisión es el reembolso para el cliente.
* **Estado inicial:** El ajuste queda en estado `PENDING_CLIENT`.

### 2. Resolución del Ajuste (Cliente)
El cliente visualiza sus ajustes pendientes y decide cómo resolverlos:
* **Endpoint:** `POST /api/v1/cliente/ajustes/{id}/resolver`
* **Opciones del Cliente:**
  * **Aceptar Parcial (`accept_partial: true`):** El pedido continúa pero con la cantidad ajustada.
  * **Rechazar Parcial (`accept_partial: false`):** Se anula el pedido por completo y se reembolsa el 100% cobrado.
* **Métodos de Compensación (`compensation_method`):**
  * `CREDIT_NEXT_BILL`: Genera un abono o nota de crédito (`ClientCredit`) aplicable al siguiente cobro del cliente. El ajuste pasa a `COMPLETED`.
  * `PARTIAL_DEDUCTION`: Deduce el dinero directamente de la factura (Cobro) actual si esta se encuentra pendiente (`PENDING`, `OVERDUE`, `RETRY`, `IN_REVIEW`), regenerando su PDF de cobro. El ajuste pasa a `COMPLETED`.
  * `FULL_REFUND`: Solicita una transferencia bancaria de devolución. El ajuste pasa a `RESOLVED` (en espera de pago administrativo).
  * `BARTER_NEGOTIATION`: Solicita un trueque (cambio por producto de igual valor). Genera automáticamente un ticket `BARTER_NEGOTIATION` para el admin, bloqueando el ajuste original hasta que el cliente acepte (completa el ajuste) o rechace/cancele (reconvierte a `PENDING_CLIENT`).

> [!IMPORTANT]
> En todos los casos resueltos, el sistema genera y sube un comprobante en PDF del reembolso a un bucket de S3.

### 3. Cierre de Reembolso (Administrador)
Si el cliente opta por `FULL_REFUND` (transferencia), el administrador debe procesar la devolución manual:
* **Endpoint:** `POST /api/v1/admin/ajustes/{id}/completar-reembolso`
* **Acción:** El administrador realiza la transferencia bancaria y registra el comprobante en el sistema.
* **Estado final:** El ajuste se marca como `COMPLETED` y se notifica al usuario final.

---

## Referencia de Endpoints Relacionados

### Vendedor
* **Solicitar Ajuste:** `PUT /api/v1/vendedor/pedidos/{id}/ajustar`
  * Body: `AdjustOrderDto` (`adjusted_quantity`, `reason`)

### Cliente
* **Listar Ajustes Pendientes:** `GET /api/v1/cliente/ajustes/pendientes`
* **Resolver Ajuste:** `POST /api/v1/cliente/ajustes/{id}/resolver`
  * Body: `ResolveAdjustmentDto` (`accept_partial`, `compensation_method`)
* **Listar Notas de Crédito:** `GET /api/v1/cliente/creditos`

### Administrador
* **Listar Reembolsos Pendientes:** `GET /api/v1/admin/reembolsos/pendientes`
* **Completar Reembolso Manual:** `POST /api/v1/admin/ajustes/{id}/completar-reembolso`
  * Body: `CompleteRefundDto` (`comment`, `payment_proof_url`)
