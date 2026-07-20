# Configuración de Perfil, Direcciones y Facturación

Este documento detalla los endpoints y las reglas de negocio del backend para la gestión del perfil del usuario, direcciones de despacho, información de facturación y la revocación del consentimiento para notificaciones.

---

## 1. Perfil de Usuario y Preferencias

### Obtener Perfil de Usuario
Permite al usuario autenticado obtener sus datos de perfil, incluyendo sus direcciones registradas y la información de facturación asociada.

- **Método:** `GET`
- **Ruta:** `/api/v1/users/me`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cabeceras:**
  ```http
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 12,
    "name": "Juan Pérez",
    "external_id": "auth0|123456",
    "email": true,
    "phone": false,
    "concentimiento": true,
    "email_address": "juan.perez@ejemplo.com",
    "phone_number": "+56912345678",
    "rut": "12.345.678-9",
    "bloqueo": false,
    "role": "client",
    "operacion_ciudad": null,
    "bodega_asignada": null,
    "status_mora": "LIBRE",
    "addresses": [
      {
        "id": 1,
        "user_id": 12,
        "alias": "Casa",
        "calle": "Av. Vitacura",
        "numero": "3568",
        "depto_oficina": "Of. 502",
        "comuna": "Vitacura",
        "region": "Región Metropolitana",
        "postal_code": "7630000",
        "is_default": true,
        "housing_type": "departamento",
        "despacho_agency": "FlowEx",
        "reference": "Esquina Vitacura con Alonso de Córdova",
        "pickup_instructions": null,
        "created_at": "2026-07-01T18:00:00.000Z"
      }
    ],
    "billing": {
      "id": 1,
      "razon_social": "Importaciones y Exportaciones SpA",
      "rut_empresa": "76.543.210-K",
      "giro": "Venta al por mayor de artículos electrónicos",
      "direccion_facturacion": "Av. Providencia 1234, Santiago",
      "correo": "facturacion@empresa.cl",
      "user_id": 12,
      "created_at": "2026-07-01T18:00:00.000Z",
      "updated_at": "2026-07-01T18:00:00.000Z"
    }
  }
  ```

### Actualizar Nombre del Perfil
Permite modificar el nombre de perfil del usuario en sesión.

- **Método:** `PUT`
- **Ruta:** `/api/v1/users/me`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cuerpo de la Petición (JSON):**
  ```json
  {
    "name": "Juan Pérez"
  }
  ```
- **Respuesta Exitosa (200 OK):** Retorna el objeto del usuario modificado.

### Actualizar Canales de Notificación
Permite configurar las preferencias para recibir notificaciones a través de correo electrónico y teléfono (SMS).

- **Método:** `PUT`
- **Ruta:** `/api/v1/users/me/notificaciones`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cuerpo de la Petición (JSON):**
  ```json
  {
    "email": true,
    "phone": false
  }
  ```
- **Respuesta Exitosa (200 OK):** Retorna el objeto del usuario actualizado con los nuevos valores.

---

## 2. Revocación de Consentimiento

Permite revocar el consentimiento general para el uso de datos y envío de notificaciones. Esta acción sincroniza el cambio con el servicio externo de consentimiento.

- **Método:** `POST`
- **Ruta:** `/api/v1/users/me/revocar-consentimiento`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Consentimiento revocado exitosamente"
  }
  ```

> [!IMPORTANT]
> **Efecto de la revocación en el sistema:**
> 1. Si está configurada la variable `CONSENT_SERVICE_URL`, se envían peticiones `DELETE` asíncronas para eliminar el consentimiento del usuario en el servicio externo (`/v1/consents/{externalId}/notifications_email` y `/v1/consents/{externalId}/notifications_sms`).
> 2. En la base de datos local, se modifican los campos `concentimiento = false`, `email = false` y `phone = false` del usuario.

---

## 3. Direcciones de Despacho del Cliente

Los clientes registrados pueden gestionar sus direcciones para la entrega de mercancías mediante el flujo estándar de CRUD.

### Listar Direcciones
- **Método:** `GET`
- **Ruta:** `/api/v1/cliente/direcciones`
- **Roles Permitidos:** `CLIENT`
- **Respuesta Exitosa (200 OK):** Retorna un arreglo de `UserAddress`.

### Crear Dirección
- **Método:** `POST`
- **Ruta:** `/api/v1/cliente/direcciones`
- **Roles Permitidos:** `CLIENT`
- **Cuerpo de la Petición (JSON):**
  ```json
  {
    "alias": "Oficina",
    "calle": "Av. Vitacura",
    "numero": "3568",
    "depto_oficina": "Of. 502",
    "comuna": "Vitacura",
    "region": "Región Metropolitana",
    "postal_code": "7630000",
    "is_default": true,
    "housing_type": "departamento",
    "despacho_agency": "FlowEx",
    "reference": "Esquina Vitacura con Alonso de Córdova"
  }
  ```
- **Respuesta Exitosa (201 Created):** Retorna la dirección creada con su `id` asignado.

### Editar Dirección
- **Método:** `PUT`
- **Ruta:** `/api/v1/cliente/direcciones/:id`
- **Roles Permitidos:** `CLIENT`
- **Cuerpo de la Petición (JSON):** Campos parciales de la dirección a actualizar.
- **Respuesta Exitosa (200 OK):** Retorna la dirección actualizada.

### Eliminar Dirección
- **Método:** `DELETE`
- **Ruta:** `/api/v1/cliente/direcciones/:id`
- **Roles Permitidos:** `CLIENT`
- **Respuesta Exitosa (204 No Content):** Sin cuerpo.

> [!WARNING]
> ### Reglas de Negocio Críticas para Direcciones
> 
> * **Asignación Automática de Favorito:** Si el usuario no tiene direcciones registradas, la primera que cree se marcará automáticamente como dirección predeterminada (`is_default = true`).
> * **Dirección Predeterminada Única:** Al marcar una dirección como predeterminada (`is_default = true`), el sistema limpia el flag `is_default` de todas las demás direcciones asociadas a ese usuario.
> * **Retirar Favorito Prohibido:** Si se intenta actualizar la dirección predeterminada actual pasando `is_default = false` sin designar otra como favorita en la misma petición, se lanzará un error `400 BadRequestException` con el mensaje: *"No puedes quitar el flag de principal de esta dirección sin designar otra como predeterminada."*
> * **Mínimo de una Dirección:** Un usuario no puede eliminar su última dirección. Si lo intenta, se lanzará una excepción `400 BadRequestException`: *"No puedes eliminar tu única dirección. Debes tener al menos una dirección registrada."*
> * **Prohibido Borrar Favorito Directamente:** No se puede borrar la dirección que tiene el flag `is_default = true`. Se debe marcar primero otra dirección como principal para luego poder eliminar la antigua. El error devuelto en este caso es: *"No puedes eliminar tu dirección predeterminada. Por favor, selecciona otra dirección como principal antes de borrar esta."*

---

## 4. Datos de Facturación de Empresa

Los clientes pueden registrar un conjunto único de datos de facturación para la emisión de documentos tributarios oficiales.

### Obtener Datos de Facturación
- **Método:** `GET`
- **Ruta:** `/api/v1/cliente/facturacion`
- **Roles Permitidos:** `CLIENT`
- **Respuesta Exitosa (200 OK):** Retorna el objeto `UserBilling` correspondiente o `null` si no se ha configurado.

### Actualizar o Crear Datos de Facturación
Crea los datos de facturación si no existen, o actualiza los existentes en caso contrario.

- **Método:** `PUT`
- **Ruta:** `/api/v1/cliente/facturacion`
- **Roles Permitidos:** `CLIENT`
- **Cuerpo de la Petición (JSON):**
  ```json
  {
    "razon_social": "Importaciones y Exportaciones SpA",
    "rut_empresa": "76.543.210-K",
    "giro": "Venta al por mayor de artículos electrónicos",
    "direccion_facturacion": "Av. Providencia 1234, Santiago",
    "correo": "facturacion@empresa.cl"
  }
  ```
- **Respuesta Exitosa (200 OK):** Retorna los datos de facturación guardados.

> [!CAUTION]
> **Validación de RUT Chileno:**
> El backend valida mediante algoritmo del dígito verificador que `rut_empresa` sea un RUT válido. Si no supera la validación, la petición fallará con una excepción `400 BadRequestException` con el mensaje: *"El RUT de la empresa no es válido."*

---

## 5. Gestión de Consentimiento

### Obtener Estado de Consentimiento

Devuelve el estado actual de consentimiento del usuario autenticado para el uso de datos y el envío de notificaciones.

- **Método:** `GET`
- **Ruta:** `/api/v1/users/me/consentimiento`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "concentimiento": true,
    "email": true,
    "phone": false
  }
  ```

### Aceptar Consentimiento

Permite al usuario aceptar los términos de uso de datos y consentimiento de notificaciones.

- **Método:** `POST`
- **Ruta:** `/api/v1/users/me/aceptar-consentimiento`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cuerpo de la Petición:** Ninguno.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Consentimiento aceptado exitosamente"
  }
  ```

> [!NOTE]
> Al aceptar el consentimiento, se activan los canales de notificación (`email` y `phone`) y se sincroniza el estado con el servicio externo de consentimiento (si está configurado `CONSENT_SERVICE_URL`).

---

## 6. Cambio de Datos de Contacto (Email / Teléfono)

El cambio de correo electrónico o número de teléfono requiere un flujo de verificación por código OTP para garantizar la autenticidad del cambio.

### 6.1 Solicitar Cambio de Contacto

Envía un código de verificación al nuevo correo o teléfono para confirmar el cambio.

- **Método:** `POST`
- **Ruta:** `/api/v1/users/change-contact/request`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cuerpo de la Petición (JSON):** `RequestContactChangeDto`
  ```json
  {
    "type": "email",
    "new_value": "nuevo.correo@ejemplo.com"
  }
  ```
  - `type` (string, requerido, enum `email` | `phone`): Tipo de dato de contacto a modificar.
  - `new_value` (string, requerido): Nuevo valor del correo o número de teléfono.
- **Respuesta Exitosa (200 OK):** Confirmación de envío del código de verificación.

### 6.2 Verificar y Confirmar Cambio

Verifica el código OTP recibido y aplica el cambio en la base de datos.

- **Método:** `POST`
- **Ruta:** `/api/v1/users/change-contact/verify`
- **Roles Permitidos:** `ROOT`, `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`
- **Cuerpo de la Petición (JSON):** `VerifyContactChangeDto`
  ```json
  {
    "type": "email",
    "code": "482910"
  }
  ```
  - `type` (string, requerido): Tipo de contacto que se está verificando.
  - `code` (string, requerido): Código OTP recibido en el nuevo correo o teléfono.
- **Respuesta Exitosa (200 OK):** Datos de contacto actualizados correctamente.

> [!IMPORTANT]
> **Flujo del Cambio de Contacto:**
> 1. El usuario llama a `request` indicando el nuevo valor.
> 2. El backend envía un código OTP al nuevo correo/teléfono.
> 3. El usuario llama a `verify` con el código recibido.
> 4. Si el código es válido, el cambio se persiste en la base de datos y se sincroniza con el servicio de autenticación.

