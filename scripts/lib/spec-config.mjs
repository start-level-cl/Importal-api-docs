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
  ChangePasswordRequest: objectSchema(
    {
      token: { type: 'string', description: 'JWT de acceso del usuario' },
      password: { type: 'string', minLength: 1, description: 'Clave actual del usuario' },
      newPassword: { type: 'string', minLength: 6, description: 'Nueva clave para la cuenta' },
    },
    ['token', 'password', 'newPassword'],
  ),
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
              profileType: { const: 'inversor', type: 'string' },
              housingType: stringEnum(['casa', 'departamento', 'oficina']),
              streetAndNumber: { type: 'string' },
              deptOrOffice: { type: 'string' },
              region: { type: 'string' },
              comuna: { type: 'string' },
              reference: { type: 'string', maxLength: 120 },
              agency: { type: 'string' },
              transportType: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
              comprobante: { type: 'string', description: 'Archivo PDF/Imagen en Base64 (max 5MB)' },
              comprobanteFileName: { type: 'string' },
              comprobanteContentType: { type: 'string' },
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType', 'housingType', 'streetAndNumber', 'region', 'comuna', 'agency', 'transportType', 'comprobante', 'comprobanteFileName'],
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
              profileType: stringEnum(['cliente_antiguo', 'cliente']),
              housingType: stringEnum(['casa', 'departamento', 'oficina']),
              streetAndNumber: { type: 'string' },
              deptOrOffice: { type: 'string' },
              region: { type: 'string' },
              comuna: { type: 'string' },
              reference: { type: 'string', maxLength: 120 },
              agency: { type: 'string' },
              transportType: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType', 'housingType', 'streetAndNumber', 'region', 'comuna', 'agency', 'transportType'],
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
              profileType: stringEnum(['proveedor', 'vendedor']),
              city: { type: 'string' },
              transportType: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
              address: { type: 'string' },
              pickupCity: { type: 'string' },
              pickupState: { type: 'string' },
              zipCode: { type: 'string' },
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType', 'city', 'transportType', 'address', 'pickupCity', 'pickupState', 'zipCode'],
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
              profileType: stringEnum(['bodeguero', 'bedeguero']),
            },
            ['email', 'name', 'rut', 'phone', 'password', 'consentimiento', 'profileType'],
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
      profileType: stringEnum(['inversor', 'cliente_antiguo', 'cliente', 'proveedor', 'vendedor', 'bodeguero', 'bedeguero']),
      status: stringEnum(['PENDING', 'APPROVED', 'REJECTED']),
      is_verified: { type: 'boolean' },
      is_email_verified: { type: 'boolean' },
      is_phone_verified: { type: 'boolean' },
      consentimiento: { type: 'boolean' },
      requestedAt: { type: 'string', format: 'date-time' },
      reviewedBy: { type: 'string' },
      notes: { type: 'string' },
      transportType: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
      housingType: stringEnum(['casa', 'departamento', 'oficina']),
      streetAndNumber: { type: 'string' },
      deptOrOffice: { type: 'string' },
      region: { type: 'string' },
      comuna: { type: 'string' },
      reference: { type: 'string' },
      agency: { type: 'string' },
      city: { type: 'string' },
      address: { type: 'string' },
      pickupCity: { type: 'string' },
      pickupState: { type: 'string' },
      zipCode: { type: 'string' },
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
  RegistrationVerifyRequest: objectSchema({
    code: { type: 'string' },
    channel: stringEnum(['email', 'phone']),
  }, ['code']),
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
  DashboardSummary: objectSchema(
    {
      clientes_activos: { type: 'integer', description: 'Número de clientes activos no bloqueados' },
      clientes_en_mora: { type: 'integer', description: 'Número de clientes en mora' },
      deuda_pendiente_clp: { type: 'integer', description: 'Sumatoria de deudas totales pendientes' },
      recaudacion_periodo_clp: { type: 'integer', description: 'Recaudación total confirmada para el periodo' },
      periodo: objectSchema({
        inicio: { type: 'string', format: 'date-time' },
        fin: { type: 'string', format: 'date-time' },
      }, ['inicio', 'fin']),
      ultimos_morosos: {
        type: 'array',
        items: objectSchema(
          {
            cobro_id: { type: 'integer' },
            client_id: { type: 'integer' },
            client_name: { type: 'string' },
            client_rut: { type: 'string' },
            amount_clp: { type: 'integer' },
            due_date: { type: 'string', format: 'date' },
          },
          ['cobro_id', 'client_id', 'client_name', 'client_rut', 'amount_clp', 'due_date'],
        ),
      },
    },
    ['clientes_activos', 'clientes_en_mora', 'deuda_pendiente_clp', 'recaudacion_periodo_clp', 'periodo', 'ultimos_morosos'],
  ),
  Cobro: genericObject,
  CobroArray: { type: 'array', items: { $ref: '#/components/schemas/Cobro' } },
  CreateOrderRequest: objectSchema(
    {
      productId: { type: 'integer' },
      quantity: { type: 'integer' },
      talla: { type: 'string' },
      cargaId: { type: 'integer' },
    },
    ['productId', 'quantity', 'talla'],
  ),
  UpdateOrderStatusRequest: objectSchema({ status: { type: 'string' } }, ['status']),
  UpdateOrderShippingRequest: objectSchema(
    {
      can_ship: { type: 'boolean' },
      seller_order_number: { type: 'string' },
    },
    ['can_ship'],
  ),
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
  ConfirmCobroRequest: objectSchema({
    approved: { type: 'boolean' },
    admin_comment: { type: 'string' },
  }),
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
  'post /auth/api/v1/auth/change-password': {
    summary: 'Actualizar clave de usuario autenticado',
    requestBody: jsonRequest('ChangePasswordRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Clave actualizada exitosamente', 'GenericMessage'),
      jsonResponse('401', 'Token invalido o clave actual incorrecta', 'ErrorResponse'),
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
    summary: 'Generar OTP para una solicitud (email, phone o ambos)',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              channel: { type: 'string', enum: ['email', 'phone', 'both'] },
            },
            required: ['channel'],
          },
        },
      },
    },
    responses: Object.fromEntries([
      jsonResponse('200', 'OTP generado y notificacion encolada', 'GenericMessage'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud ya procesada', 'ErrorResponse'),
      jsonResponse('429', 'Rate limit de OTP excedido', 'ErrorResponse'),
    ]),
  },
  'post /registration-requests/{email}/verify': {
    summary: 'Verificar OTP y marcar canal como verificado',
    requestBody: jsonRequest('RegistrationVerifyRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud marcada como verificada', 'GenericMessage'),
      jsonResponse('400', 'Codigo invalido', 'ErrorResponse'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud ya procesada', 'ErrorResponse'),
    ]),
  },
  'put /registration-requests/{email}/update-contact': {
    summary: 'Actualizar email o telefono de una solicitud pendiente',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
            },
          },
        },
      },
    },
    responses: Object.fromEntries([
      jsonResponse('200', 'Contacto actualizado', 'GenericMessage'),
      jsonResponse('400', 'Payload invalido', 'ErrorResponse'),
      jsonResponse('404', 'Solicitud no encontrada', 'ErrorResponse'),
      jsonResponse('409', 'Solicitud no esta en estado PENDING', 'ErrorResponse'),
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
    summary: 'Inactivar un producto del catálogo (Vendedor/Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Producto inactivado', 'GenericObject')]),
  },
  'post /api/v1/cliente/pedidos': {
    requestBody: jsonRequest('CreateOrderRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Pedido creado con reserva de stock inmediata', 'GenericObject')]),
  },
  'put /api/v1/vendedor/pedidos/{id}/estado': {
    requestBody: jsonRequest('UpdateOrderStatusRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Estado de pedido actualizado. Si se cancela/rechaza se libera el stock.', 'GenericObject')]),
  },
  'post /api/v1/vendedor/pedidos/{id}/confirmar': {
    summary: 'Confirmar pedido y efectuar descuento final de stock (Vendedor)',
    responses: Object.fromEntries([jsonResponse('200', 'Pedido confirmado', 'GenericObject')]),
  },
  'put /api/v1/vendedor/pedidos/{id}/envio': {
    summary: 'Actualizar flag de envío y número de seguimiento del vendedor (Vendedor)',
    requestBody: jsonRequest('UpdateOrderShippingRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Datos de envío actualizados', 'GenericObject')]),
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
  'get /api/v1/admin/cobros': {
    summary: 'Listar todos los cobros del sistema (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Listado de cobros', 'GenericObjectArray')]),
  },
  'get /api/v1/admin/cobros/pendientes-validacion': {
    summary: 'Listar cobros que tienen un comprobante subido pendiente de revisión (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Listado de cobros pendientes de validación', 'GenericObjectArray')]),
  },
  'get /api/v1/admin/dashboard': {
    summary: 'Obtener métricas consolidadas del dashboard administrativo y últimos morosos (Admin/Root)',
    parameters: [
      { name: 'startDate', in: 'query', required: false, schema: { type: 'string', format: 'date-time' }, description: 'Fecha de inicio del periodo de recaudación' },
      { name: 'endDate', in: 'query', required: false, schema: { type: 'string', format: 'date-time' }, description: 'Fecha de fin del periodo de recaudación' },
    ],
    responses: Object.fromEntries([jsonResponse('200', 'Métricas del dashboard', 'DashboardSummary')]),
  },
  'post /api/v1/admin/cobros/{id}/confirmar': {
    summary: 'Confirmar o rechazar un cobro manual tras revisar el comprobante (Admin/Root)',
    requestBody: jsonRequest('ConfirmCobroRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Cobro confirmado', 'GenericObject')]),
  },
  'get /api/v1/admin/tarifas/comisiones': {
    summary: 'Obtener lista de comisiones configuradas (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Comisiones configuradas', 'GenericObjectArray')]),
  },
  'put /api/v1/admin/tarifas/comisiones': {
    summary: 'Actualizar porcentaje de comisión de un nivel (Admin/Root)',
    requestBody: jsonRequest('UpdateCommissionTierRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Comision actualizada', 'GenericObject')]),
  },
  'get /api/v1/admin/tarifas/logisticas': {
    summary: 'Obtener lista de tarifas logísticas configuradas (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Tarifas logísticas configuradas', 'GenericObjectArray')]),
  },
  'put /api/v1/admin/tarifas/logisticas': {
    summary: 'Actualizar valor de tarifa logística (Admin/Root)',
    requestBody: jsonRequest('UpdateLogisticsRateRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Tarifa actualizada', 'GenericObject')]),
  },
  'get /api/v1/cliente/cobros': {
    summary: 'Obtener cobros pendientes y facturados del cliente autenticado',
    responses: Object.fromEntries([jsonResponse('200', 'Cobros del cliente', 'GenericObjectArray')]),
  },
  'get /api/v1/cliente/cobros/{id}/pdf': {
    summary: 'Obtener PDF representativo de un cobro facturado',
    responses: Object.fromEntries([jsonResponse('200', 'Archivo PDF en base64 o metadatos de descarga', 'GenericObject')]),
  },
  'get /api/v1/cliente/estado-mora': {
    summary: 'Obtener estado e historial de moras del cliente autenticado',
    responses: Object.fromEntries([jsonResponse('200', 'Estado de mora', 'GenericObject')]),
  },
  'get /api/v1/cliente/cobros/pagados': {
    summary: 'Obtener historial de cobros pagados del cliente',
    responses: Object.fromEntries([jsonResponse('200', 'Cobros pagados', 'GenericObjectArray')]),
  },
  'post /api/v1/cliente/cobros/{id}/pagar': {
    summary: 'Subir comprobante de pago para un cobro (Multipart File)',
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary', description: 'Comprobante de pago (imagen/pdf)' },
            },
            required: ['file'],
          },
        },
      },
    },
    responses: Object.fromEntries([jsonResponse('200', 'Comprobante subido, cobro en revisión', 'GenericObject')]),
  },
  'post /api/v1/admin/cobros/trigger': {
    summary: 'Gatillar manualmente generación de cobros del periodo y cálculo de intereses de mora (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Gatillado de facturación exitoso', 'GenericObject')]),
  },
  'post /api/v1/vendedor/pagos/solicitar': {
    summary: 'Solicitar retiro de saldo o pago (Vendedor)',
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary', description: 'Comprobante de solicitud de pago (imagen/pdf)' },
              note: { type: 'string', description: 'Nota o comentario adicional para la solicitud' },
            },
            required: ['file'],
          },
        },
      },
    },
    responses: Object.fromEntries([jsonResponse('201', 'Solicitud de pago creada', 'GenericObject')]),
  },
  'get /api/v1/admin/solicitudes-carga': {
    summary: 'Listar solicitudes de tránsito de carga pendientes de aprobación (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Solicitudes de tránsito', 'GenericObjectArray')]),
  },
  'post /api/v1/admin/solicitudes-carga/{id}/aprobar': {
    summary: 'Aprobar una solicitud de tránsito y asignarle carga (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Solicitud de tránsito aprobada', 'GenericObject')]),
  },
  'post /api/v1/admin/solicitudes-carga/{id}/rechazar': {
    summary: 'Rechazar una solicitud de tránsito de carga (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Solicitud de tránsito rechazada', 'GenericObject')]),
  },
  'get /api/v1/bodeguero/cargas': {
    summary: 'Listar cargas asignadas a la bodega del bodeguero autenticado',
    responses: Object.fromEntries([jsonResponse('200', 'Cargas de bodega', 'GenericObjectArray')]),
  },
  'post /api/v1/vendedor/solicitudes-carga': {
    summary: 'Crear una nueva solicitud de tránsito de carga (Vendedor)',
    requestBody: jsonRequest('CreateCargaRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Solicitud de tránsito creada', 'GenericObject')]),
  },
  'get /api/v1/vendedor/solicitudes-carga': {
    summary: 'Listar solicitudes de tránsito de carga del vendedor autenticado',
    responses: Object.fromEntries([jsonResponse('200', 'Solicitudes de tránsito del vendedor', 'GenericObjectArray')]),
  },
  'post /api/v1/vendedor/cargas/transicion-cierre': {
    summary: 'Solicitar transición/cierre de carga por ventanas temporales o salida anticipada (Vendedor)',
    requestBody: jsonRequest('CreateCargaRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Transición procesada', 'GenericObject')]),
  },
  'get /api/v1/bodeguero/pedidos': {
    summary: 'Listar todos los pedidos para la bodega (Bodeguero/Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Pedidos de bodega', 'GenericObjectArray')]),
  },
  'get /api/v1/bodeguero/pedidos/{id}/auditoria': {
    summary: 'Consultar el historial de auditoría y transiciones de un pedido (Bodeguero/Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Historial de auditoría', 'GenericObjectArray')]),
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
