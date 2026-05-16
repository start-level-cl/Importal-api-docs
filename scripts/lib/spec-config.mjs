const stringEnum = values => ({ type: 'string', enum: values })
const objectSchema = (properties, required = []) => ({
  type: 'object',
  properties,
  ...(required.length > 0 ? { required } : {}),
  additionalProperties: false,
})

const genericObject = {
  type: 'object',
  additionalProperties: true,
}

export const info = {
  title: 'Importal Unified API',
  version: '1.0.0',
  description:
    'Especificacion OpenAPI centralizada para Importal-auth, Importal-backend y el flujo publico de registro.',
}

export const servers = [
  {
    url: 'https://{host}',
    description: 'API publica de Importal',
    variables: {
      host: {
        default: 'api.importal.example',
      },
    },
  },
]

export const tags = [
  { name: 'Auth', description: 'Autenticacion y OTP internos/externos del servicio auth' },
  { name: 'Registration', description: 'Registro publico y revision administrativa de solicitudes' },
  { name: 'Admin', description: 'Dashboards y operaciones administrativas' },
  { name: 'Orders', description: 'Cargas, pedidos y tracking' },
  { name: 'Products', description: 'Catalogo y CRUD de productos' },
  { name: 'Billing', description: 'Cobros, tarifas y pagos' },
  { name: 'Notifications', description: 'Notificaciones del usuario' },
  { name: 'Messaging', description: 'Chats y mensajes' },
  { name: 'System', description: 'Monitoreo y auditoria' },
]

export const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
}

export const schemas = {
  ErrorResponse: objectSchema(
    {
      message: { type: 'string' },
      error: { type: 'string' },
      statusCode: { type: 'integer' },
    },
    ['message'],
  ),
  GenericMessage: objectSchema({ message: { type: 'string' } }, ['message']),
  GenericOk: objectSchema(
    {
      ok: { type: 'boolean' },
      message: { type: 'string' },
    },
    ['ok'],
  ),
  LoginRequest: objectSchema(
    {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 1 },
    },
    ['email', 'password'],
  ),
  LoginResponse: objectSchema(
    {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
    ['accessToken', 'refreshToken'],
  ),
  ValidateResponse: objectSchema({ valid: { type: 'boolean' } }, ['valid']),
  RegisterUserRequest: objectSchema(
    {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      phone: { type: 'string' },
      role: { type: 'string' },
      rut: { type: 'string' },
      transporte: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
    },
    ['name', 'email', 'password', 'phone', 'role', 'rut', 'transporte'],
  ),
  RegisterUserResponse: objectSchema(
    {
      userId: { type: 'string' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      role: { type: 'string' },
    },
    ['userId', 'email', 'name', 'role'],
  ),
  SendCodeRequest: objectSchema(
    {
      type: stringEnum(['email', 'phone']),
      target: { type: 'string' },
    },
    ['type', 'target'],
  ),
  SendCodeResponse: objectSchema({ message: { type: 'string' } }, ['message']),
  VerifyCodeRequest: objectSchema(
    {
      target: { type: 'string' },
      code: { type: 'string', minLength: 6, maxLength: 6 },
    },
    ['target', 'code'],
  ),
  VerifyCodeResponse: objectSchema(
    {
      verified: { type: 'boolean' },
      target: { type: 'string' },
    },
    ['verified', 'target'],
  ),
  RegistrationRequestCreate: {
    oneOf: [
      {
        allOf: [
          objectSchema(
            {
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              rut: { type: 'string' },
              phone: { type: 'string' },
              password: { type: 'string' },
              consentimiento: { type: 'boolean' },
              profileType: { const: 'cliente', type: 'string' },
              transporte: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
              comprobante: { type: 'string', description: 'Archivo en base64 opcional' },
              comprobanteFileName: { type: 'string' },
              comprobanteContentType: { type: 'string' },
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType', 'transporte'],
          ),
        ],
      },
      {
        allOf: [
          objectSchema(
            {
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              rut: { type: 'string' },
              phone: { type: 'string' },
              password: { type: 'string' },
              consentimiento: { type: 'boolean' },
              profileType: { const: 'proveedor', type: 'string' },
              transporte: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
              pais: { type: 'string' },
              ciudad: { type: 'string' },
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType', 'transporte', 'pais', 'ciudad'],
          ),
        ],
      },
      {
        allOf: [
          objectSchema(
            {
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              rut: { type: 'string' },
              phone: { type: 'string' },
              password: { type: 'string' },
              consentimiento: { type: 'boolean' },
              profileType: { const: 'bodequero', type: 'string' },
              bodega: { type: 'string' },
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType', 'bodega'],
          ),
        ],
      },
    ],
  },
  RegistrationRequest: objectSchema(
    {
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      rut: { type: 'string' },
      phone: { type: 'string' },
      profileType: stringEnum(['cliente', 'proveedor', 'bodeguero']),
      status: stringEnum(['PENDING', 'APPROVED', 'REJECTED']),
      is_verified: { type: 'boolean' },
      consentimiento: { type: 'boolean' },
      requestedAt: { type: 'string', format: 'date-time' },
      reviewedBy: { type: 'string' },
      notes: { type: 'string' },
      transporte: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
      pais: { type: 'string' },
      ciudad: { type: 'string' },
      bodega: { type: 'string' },
      comprobanteKey: { type: 'string' },
    },
    ['email', 'name', 'rut', 'phone', 'profileType', 'status', 'requestedAt'],
  ),
  RegistrationListResponse: objectSchema(
    {
      items: { type: 'array', items: { $ref: '#/components/schemas/RegistrationRequest' } },
      count: { type: 'integer' },
    },
    ['items', 'count'],
  ),
  RegistrationApproveRequest: objectSchema(
    {
      reviewedBy: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string' },
      notes: { type: 'string' },
    },
    ['reviewedBy'],
  ),
  RegistrationRejectRequest: objectSchema(
    {
      reviewedBy: { type: 'string' },
      notes: { type: 'string' },
    },
    ['reviewedBy'],
  ),
  RegistrationApprovalResponse: objectSchema(
    {
      request: { $ref: '#/components/schemas/RegistrationRequest' },
      user: { $ref: '#/components/schemas/RegisterUserResponse' },
    },
    ['request', 'user'],
  ),
  RegistrationVerifyRequest: objectSchema({ code: { type: 'string' } }, ['code']),
  CreateAdminRequest: objectSchema(
    {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string' },
      rut: { type: 'string' },
    },
    ['name', 'email', 'phone', 'rut'],
  ),
  CreateProductRequest: objectSchema(
    {
      marca: { type: 'string' },
      price_usd: { type: 'number' },
      photo_urls: { type: 'array', items: { type: 'string' } },
      status: { type: 'string' },
    },
    ['marca', 'price_usd'],
  ),
  UpdateProductRequest: objectSchema(
    {
      marca: { type: 'string' },
      price_usd: { type: 'number' },
      photo_urls: { type: 'array', items: { type: 'string' } },
      status: { type: 'string' },
    },
  ),
  Product: objectSchema(
    {
      id: { type: 'integer' },
      marca: { type: 'string' },
      price_usd: { type: 'number' },
      photo_urls: { type: 'array', items: { type: 'string' } },
      status: { type: 'string' },
    },
    ['id', 'marca', 'price_usd'],
  ),
  ProductArray: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
  Notification: objectSchema(
    {
      id: { type: 'integer' },
      type: { type: 'string' },
      title: { type: 'string' },
      body: { type: 'string' },
      is_read: { type: 'boolean' },
      created_at: { type: 'string', format: 'date-time' },
    },
    ['id', 'type', 'title', 'body'],
  ),
  NotificationArray: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
  Chat: objectSchema(
    {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      transport_type: { type: 'string' },
      provider_code: { type: 'string' },
    },
    ['id'],
  ),
  ChatArray: { type: 'array', items: { $ref: '#/components/schemas/Chat' } },
  ChatMessage: objectSchema(
    {
      id: { type: 'integer' },
      chat_id: { type: 'integer' },
      message: { type: 'string' },
      created_at: { type: 'string', format: 'date-time' },
    },
    ['id', 'message'],
  ),
  ChatMessageArray: { type: 'array', items: { $ref: '#/components/schemas/ChatMessage' } },
  DashboardSummary: genericObject,
  Cobro: genericObject,
  CobroArray: { type: 'array', items: { $ref: '#/components/schemas/Cobro' } },
  CreateOrderRequest: objectSchema(
    {
      productId: { type: 'integer' },
      quantity: { type: 'integer' },
      cargaId: { type: 'integer' },
    },
    ['productId', 'quantity', 'cargaId'],
  ),
  UpdateOrderStatusRequest: objectSchema({ status: { type: 'string' } }, ['status']),
  CreateCargaRequest: objectSchema({ tipo_carga: stringEnum(['AEREA', 'MARITIMA']) }, ['tipo_carga']),
  UpdateCargaStatusRequest: objectSchema(
    {
      status: { type: 'string' },
      notes: { type: 'string' },
    },
    ['status'],
  ),
  InitiateTransbankRequest: objectSchema(
    {
      cobro_id: { type: 'integer' },
      amount_clp: { type: 'number' },
    },
    ['cobro_id', 'amount_clp'],
  ),
  ConfirmTransbankRequest: objectSchema(
    {
      transaction_id: { type: 'string' },
      token: { type: 'string' },
    },
    ['transaction_id', 'token'],
  ),
  ConfirmCobroRequest: objectSchema({ approved: { type: 'boolean' } }),
  UpdateCommissionTierRequest: objectSchema(
    {
      id: { type: 'integer' },
      commission_pct: { type: 'number' },
    },
    ['id', 'commission_pct'],
  ),
  UpdateLogisticsRateRequest: objectSchema(
    {
      id: { type: 'integer' },
      rate_value: { type: 'number' },
    },
    ['id', 'rate_value'],
  ),
  GenericObject: genericObject,
  GenericObjectArray: { type: 'array', items: genericObject },
}

function jsonRequest(schemaRef, required = true) {
  return {
    required,
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${schemaRef}` },
      },
    },
  }
}

function jsonResponse(status, description, schemaRef) {
  return [
    status,
    {
      description,
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${schemaRef}` },
        },
      },
    },
  ]
}

function noContentResponse(status, description) {
  return [status, { description }]
}

export const operationOverrides = {
  'post /auth/api/v1/auth/login': {
    summary: 'Autenticar usuario y emitir JWT',
    requestBody: jsonRequest('LoginRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Login exitoso', 'LoginResponse'),
      jsonResponse('401', 'Credenciales invalidas', 'ErrorResponse'),
    ]),
  },
  'get /auth/api/v1/auth/validate': {
    summary: 'Validar JWT emitido por auth',
    responses: Object.fromEntries([
      jsonResponse('200', 'Token valido', 'ValidateResponse'),
      jsonResponse('401', 'Token invalido o expirado', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/auth/register-user': {
    summary: 'Registrar usuario desde servicios internos',
    requestBody: jsonRequest('RegisterUserRequest'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Usuario registrado', 'RegisterUserResponse'),
      jsonResponse('403', 'Acceso restringido a VPC', 'ErrorResponse'),
      jsonResponse('409', 'Usuario ya existe', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/auth/send-code': {
    summary: 'Enviar OTP via auth service',
    requestBody: jsonRequest('SendCodeRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'OTP enviado', 'SendCodeResponse')]),
  },
  'post /auth/api/v1/auth/verify-code': {
    summary: 'Validar OTP via auth service',
    requestBody: jsonRequest('VerifyCodeRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'OTP verificado', 'VerifyCodeResponse'),
      jsonResponse('400', 'OTP invalido', 'ErrorResponse'),
    ]),
  },
  'post /registration-requests': {
    summary: 'Crear solicitud publica de registro',
    requestBody: jsonRequest('RegistrationRequestCreate'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Solicitud creada', 'RegistrationRequest'),
      jsonResponse('400', 'Payload invalido', 'ErrorResponse'),
      jsonResponse('403', 'Consentimiento requerido', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud duplicada', 'ErrorResponse'),
    ]),
  },
  'get /registration-requests': {
    summary: 'Listar solicitudes pendientes desde la lambda',
    responses: Object.fromEntries([jsonResponse('200', 'Listado de solicitudes', 'RegistrationListResponse')]),
  },
  'post /registration-requests/{email}/send-code': {
    summary: 'Generar OTP para una solicitud',
    responses: Object.fromEntries([
      jsonResponse('200', 'OTP generado', 'GenericMessage'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud ya procesada', 'ErrorResponse'),
      jsonResponse('429', 'Rate limit de OTP excedido', 'ErrorResponse'),
    ]),
  },
  'post /registration-requests/{email}/verify': {
    summary: 'Verificar OTP de una solicitud',
    requestBody: jsonRequest('RegistrationVerifyRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud marcada como verificada', 'GenericMessage'),
      jsonResponse('400', 'Codigo invalido', 'ErrorResponse'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud ya procesada', 'ErrorResponse'),
    ]),
  },
  'get /api/v1/registration-requests': {
    summary: 'Listar solicitudes pendientes para aprobacion',
    responses: Object.fromEntries([jsonResponse('200', 'Listado de solicitudes', 'RegistrationListResponse')]),
  },
  'post /api/v1/registration-requests/{email}/approve': {
    summary: 'Aprobar solicitud y crear usuario en auth',
    requestBody: jsonRequest('RegistrationApproveRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud aprobada', 'RegistrationApprovalResponse'),
      jsonResponse('400', 'Solicitud no verificada o payload invalido', 'ErrorResponse'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud ya procesada o usuario existente', 'ErrorResponse'),
    ]),
  },
  'post /api/v1/registration-requests/{email}/reject': {
    summary: 'Rechazar solicitud de registro',
    requestBody: jsonRequest('RegistrationRejectRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud rechazada', 'RegistrationRequest'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud ya procesada', 'ErrorResponse'),
    ]),
  },
  'post /api/v1/admin/users/create-admin': {
    summary: 'Crear administrador desde root',
    requestBody: jsonRequest('CreateAdminRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Administrador creado', 'GenericObject')]),
  },
  'get /api/v1/notificaciones': {
    responses: Object.fromEntries([jsonResponse('200', 'Notificaciones del usuario', 'NotificationArray')]),
  },
  'put /api/v1/notificaciones/{id}/leer': {
    responses: Object.fromEntries([jsonResponse('200', 'Notificacion marcada como leida', 'GenericObject')]),
  },
  'get /api/v1/chats': {
    responses: Object.fromEntries([jsonResponse('200', 'Listado de chats', 'ChatArray')]),
  },
  'get /api/v1/chats/{id}/mensajes': {
    responses: Object.fromEntries([jsonResponse('200', 'Mensajes del chat', 'ChatMessageArray')]),
  },
  'get /api/v1/cliente/productos': {
    responses: Object.fromEntries([jsonResponse('200', 'Catalogo disponible', 'ProductArray')]),
  },
  'get /api/v1/vendedor/productos': {
    responses: Object.fromEntries([jsonResponse('200', 'Productos del vendedor', 'ProductArray')]),
  },
  'post /api/v1/vendedor/productos': {
    requestBody: jsonRequest('CreateProductRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Producto creado', 'Product')]),
  },
  'put /api/v1/vendedor/productos/{id}': {
    requestBody: jsonRequest('UpdateProductRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Producto actualizado', 'Product')]),
  },
  'delete /api/v1/vendedor/productos/{id}': {
    responses: Object.fromEntries([jsonResponse('200', 'Producto inactivado', 'GenericObject')]),
  },
  'post /api/v1/cliente/pedidos': {
    requestBody: jsonRequest('CreateOrderRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Pedido creado', 'GenericObject')]),
  },
  'put /api/v1/vendedor/pedidos/{id}/estado': {
    requestBody: jsonRequest('UpdateOrderStatusRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Estado de pedido actualizado', 'GenericObject')]),
  },
  'post /api/v1/admin/cargas': {
    requestBody: jsonRequest('CreateCargaRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Carga creada', 'GenericObject')]),
  },
  'put /api/v1/bodeguero/cargas/{id}/status': {
    requestBody: jsonRequest('UpdateCargaStatusRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Estado de carga actualizado', 'GenericObject')]),
  },
  'put /api/v1/bodeguero/tracking/actualizar': {
    requestBody: jsonRequest('UpdateOrderStatusRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Tracking actualizado', 'GenericOk')]),
  },
  'post /api/v1/admin/cobros/{id}/confirmar': {
    requestBody: jsonRequest('ConfirmCobroRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Cobro confirmado', 'GenericObject')]),
  },
  'put /api/v1/admin/tarifas/comisiones': {
    requestBody: jsonRequest('UpdateCommissionTierRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Comision actualizada', 'GenericObject')]),
  },
  'put /api/v1/admin/tarifas/logisticas': {
    requestBody: jsonRequest('UpdateLogisticsRateRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Tarifa actualizada', 'GenericObject')]),
  },
  'post /api/v1/cliente/pagos/transbank/iniciar': {
    requestBody: jsonRequest('InitiateTransbankRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Pago iniciado', 'GenericObject')]),
  },
  'post /api/v1/cliente/pagos/transbank/confirmar': {
    requestBody: jsonRequest('ConfirmTransbankRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Pago confirmado', 'GenericObject')]),
  },
}

export function createDefaultOperation(route) {
  const pathParams = [...route.path.matchAll(/\{([^}]+)\}/g)].map(match => ({
    name: match[1],
    in: 'path',
    required: true,
    schema: { type: 'string' },
  }))

  return {
    tags: route.tags.length > 0 ? route.tags : [route.tag],
    operationId: route.operationId,
    summary: route.summary || route.methodName || `${route.method.toUpperCase()} ${route.path}`,
    parameters: pathParams,
    'x-service': route.service,
    'x-role-group': route.roleGroup || 'publico',
    'x-source': route.source,
    responses: {
      [(route.method === 'post' && route.path.includes('/create')) || route.path === '/registration-requests'
        ? '201'
        : String(route.responseStatus || '200')]: {
        description: route.responseDescription || 'Operacion exitosa',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/GenericObject' },
          },
        },
      },
    },
    ...(route.security ? { security: [{ bearerAuth: [] }] } : {}),
  }
}
