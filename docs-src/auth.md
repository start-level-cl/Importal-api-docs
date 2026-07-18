# Autenticación y Autorización (Auth)

El servicio `Importal-auth` es el encargado de validar la identidad de los usuarios y emitir las credenciales para la navegación en el resto de los microservicios.

## Estrategia de Tokens JWT

Para equilibrar seguridad y rendimiento, la plataforma implementa una estrategia de **doble token**:

```mermaid
sequenceDiagram
    actor Cliente
    participant Auth as Importal-auth
    participant API as Importal-backend

    Cliente->>Auth: POST /auth/api/v1/auth/login
    Note over Auth: Valida contraseña y firma JWT
    Auth-->>Cliente: 200 OK (AccessToken en JSON + RefreshToken en Cookie HttpOnly)
    
    Cliente->>API: GET /api/v1/cliente/productos (Authorization: Bearer <AccessToken>)
    Note over API: Valida firma de AccessToken
    API-->>Cliente: 200 OK (Catálogo)
    
    Note over Cliente: AccessToken Expira (1 hora)
    
    Cliente->>API: GET /api/v1/cliente/productos (Bearer caducado)
    API-->>Cliente: 401 Unauthorized
    
    Cliente->>Auth: POST /auth/api/v1/auth/refresh (Cookie HttpOnly enviada automáticamente)
    Note over Auth: Valida RefreshToken en DB/Redis
    Auth-->>Cliente: 200 OK (Nuevo AccessToken en JSON)
```

### 1. Access Token (Token de Acceso)
* **Ubicación:** Se devuelve directamente en el cuerpo JSON tras el login.
* **Formato:** JWT firmado con algoritmo RS256 / HS256.
* **Duración:** Corta duración (generalmente 1 hora).
* **Uso:** Debe adjuntarse en las cabeceras HTTP de cada petición al backend:
  ```http
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### 2. Refresh Token (Token de Refresco)
* **Ubicación:** Se inyecta en una cookie de respuesta HTTP (`Set-Cookie`).
* **Seguridad:**
  * `HttpOnly`: Impide el acceso al token mediante Javascript (`document.cookie`), protegiendo de ataques XSS.
  * `Secure`: Obliga al navegador a transmitir la cookie únicamente a través de canales cifrados HTTPS.
  * `SameSite=Strict/Lax`: Mitiga ataques CSRF (Cross-Site Request Forgery).
* **Duración:** Larga duración (generalmente 7 días).
* **Uso:** El frontend consulta el endpoint `/auth/api/v1/auth/refresh` enviando la cookie de forma nativa para obtener un nuevo Access Token válido cuando este último caduque.

---

## Roles y Niveles de Acceso

El sistema maneja un control de acceso basado en roles (RBAC) propagado en el payload del JWT:

| Rol | Descripción | Permisos Clave |
|---|---|---|
| `root` | Superadministrador del sistema. | Bypass de validaciones, visualización completa, logs. |
| `admin` | Administrador operacional de Importal. | Aprobar registros, cerrar cargas, conciliar transferencias bancarias. |
| `cliente` | Compradores o inversores finales. | Comprar catálogo, realizar reservas, subir comprobantes de pago. |
| `vendedor` | Sellers y proveedores del marketplace. | Cargar catálogo propio, procesar despachos, solicitar tránsitos de carga. |
| `bodeguero`| Operadores físicos de bodega de destino. | Validar recepción de bultos físicos, registrar arribo de cargas. |

---

## Invalidación de Sesión (Logout)

Al llamar a `/auth/api/v1/auth/logout`:
1. El backend de Auth invalida la sesión correspondiente en la base de datos o almacenamiento en caché (Redis).
2. Se reescribe la cookie del navegador expirándola inmediatamente (`Max-Age=0`).
3. El frontend desecha el Access Token cargado en memoria.

---

## Flag `active` y Bloqueo Manual de Cuentas (desde `Importal-backend`)

Además del logout explícito, `Importal-auth` soporta desactivar una cuenta de forma remota mediante el campo `active` (booleano) del ítem de usuario en DynamoDB:

* **Origen:** `Importal-backend` invoca `PUT /auth/api/v1/users/:userId` cuando un `ADMIN`/`ROOT` bloquea o desbloquea manualmente a un usuario (ver "Bloqueo Manual de Usuarios" en la guía de Admin API). El DTO `UpdateUserRequestDto` acepta el campo opcional `active?: boolean` (`false` = cuenta bloqueada), además de los campos preexistentes `email`, `phone`, `transporte` y `name`.
* **Efecto en login:** `DynamoAuthService.validateUserPassword()` verifica `isActive(user)` antes de emitir tokens. Si `active === false`, el login falla con `401` aunque la contraseña sea correcta.
* **Efecto en sesiones activas:** `AuthService.verifyAndValidateUserToken()` (invocado por `GET /auth/api/v1/validate`, que a su vez llama `RolesGuard` de `Importal-backend` en **cada** request autenticado) también verifica `isActive(user)`. Esto revoca de forma casi inmediata la sesión de un usuario que fue bloqueado mientras tenía un Access Token todavía vigente, sin esperar a que expire por TTL.
* **Retrocompatibilidad:** `isActive(user)` retorna `true` por defecto si el campo `active`/`activo` no está seteado en el ítem de DynamoDB, por lo que usuarios existentes no se ven afectados hasta que se les bloquee explícitamente.

> [!NOTE]
> Este mecanismo `active` es genérico (no exclusivo del bloqueo manual): cualquier servicio interno con acceso a `PUT /auth/api/v1/users/:userId` puede usarlo para desactivar una cuenta sin necesidad de eliminarla.
