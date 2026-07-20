# Mensajería (Chats)

El módulo de mensajería de Pascalle Store permite la comunicación en tiempo real entre los participantes del ecosistema (Clientes, Vendedores, Bodegueros y Administradores) a través de canales de chat organizados por sala de transporte.

---

## Resumen de Endpoints

| Método | Ruta | Roles Permitidos | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/chats` | Todos los roles | Listar chats disponibles para el usuario. |
| `GET` | `/api/v1/chats/:id` | Todos los roles | Obtener detalle de un chat con información de WebSocket. |
| `GET` | `/api/v1/chats/:id/mensajes` | Todos los roles | Listar mensajes paginados de un chat. |
| `POST` | `/api/v1/chats/:id/mensajes` | Todos los roles | Enviar un mensaje a un chat. |

---

## 1. Canales de Chat

### 1.1 Listar Chats Disponibles

Devuelve los canales de chat a los que tiene acceso el usuario autenticado, filtrados según su rol y los tipos de sala/transporte habilitados en su token.

- **Método:** `GET`
- **Ruta:** `/api/v1/chats`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Respuesta Exitosa (200 OK):** Array de chats accesibles.

> [!NOTE]
> **Filtrado por Transporte:**
> El backend extrae los tipos de transporte autorizados tanto del payload del JWT como del header `Authorization`. El chat solo se muestra si el tipo de transporte del canal coincide con al menos uno de los transportes habilitados para ese usuario.

### 1.2 Detalle del Chat

Obtiene los metadatos de un chat específico, incluyendo los datos de conexión WebSocket para unirse al canal en tiempo real.

- **Método:** `GET`
- **Ruta:** `/api/v1/chats/:id`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID del chat.
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 3,
    "transport_type": "AEREA",
    "name": "Sala Aérea - Julio 2026",
    "created_at": "2026-07-01T10:00:00.000Z",
    "websocket": {
      "url": "wss://api.pascallestore.com/v1",
      "path": "/socket.io",
      "namespace": "/v1",
      "event": "join_chat",
      "room": "chat_3"
    }
  }
  ```

> [!IMPORTANT]
> **Conexión WebSocket (Socket.IO):**
> Para enviar y recibir mensajes en tiempo real, el cliente frontend debe conectarse al servidor Socket.IO usando los datos retornados por este endpoint:
> 1. Conectarse a la URL `websocket.url` con la librería `socket.io-client`.
> 2. Emitir el evento `join_chat` con el identificador `chat_{id}` para unirse a la sala.
> 3. Escuchar el evento `message` para recibir nuevos mensajes en tiempo real.

---

## 2. Mensajes

### 2.1 Listar Mensajes del Chat

Obtiene el historial de mensajes de un canal de chat, paginados en orden cronológico.

- **Método:** `GET`
- **Ruta:** `/api/v1/chats/:id/mensajes`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID del chat.
- **Query Parameters:**
  - `page` (opcional, default `1`): Número de página (mensajes más recientes primero).
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "data": [
      {
        "id": 101,
        "chat_id": 3,
        "message": "¿Cuándo llega la próxima carga aérea?",
        "sender_name": "María",
        "sender_id": "18",
        "created_at": "2026-07-15T14:30:00.000Z",
        "referenced_message_id": null
      }
    ],
    "meta": {
      "page": 1,
      "total": 50
    }
  }
  ```

### 2.2 Enviar Mensaje

Publica un nuevo mensaje en el canal de chat especificado.

- **Método:** `POST`
- **Ruta:** `/api/v1/chats/:id/mensajes`
- **Roles Permitidos:** `ADMIN`, `CLIENT`, `VENDOR`, `BODEGUERO`, `ROOT`
- **Path Parameters:**
  - `id` (número, requerido): ID del chat.
- **Cuerpo de la Petición (JSON):**
  ```json
  {
    "message": "El pedido #145 ya fue revisado en bodega.",
    "referenced_message_id": 100
  }
  ```
  - `message` (string, requerido): Contenido del mensaje.
  - `referenced_message_id` (número, opcional): ID del mensaje al que se responde (para hilos de conversación).
- **Respuesta Exitosa (201 Created):** Devuelve el mensaje creado.

> [!NOTE]
> **Identidad del Remitente:**
> El nombre del remitente se extrae automáticamente del token JWT (`app_full_name`, `app_username` o `name`). El ID del remitente también se obtiene del token, por lo que no es necesario enviarlo en el cuerpo de la petición.

---

## 3. Arquitectura del Sistema de Mensajería

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant HTTP as REST API
    participant WS as Socket.IO Server
    participant DB as Base de Datos

    Usuario->>HTTP: GET /api/v1/chats/:id
    HTTP-->>Usuario: { websocket: { url, namespace, event, room } }

    Usuario->>WS: connect(url, { path: '/socket.io' })
    WS-->>Usuario: connected

    Usuario->>WS: emit('join_chat', 'chat_{id}')
    WS-->>Usuario: joined room

    Usuario->>HTTP: POST /api/v1/chats/:id/mensajes
    HTTP->>DB: Guardar mensaje
    HTTP->>WS: broadcast a room 'chat_{id}'
    WS-->>Usuario: event 'message' (tiempo real)
```
