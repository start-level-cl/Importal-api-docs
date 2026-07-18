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

const schemaExamples = {
  LoginRequest: { email: 'usuario@ejemplo.com', password: 'Password123!' },
  LoginResponse: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  ValidateResponse: { valid: true },
  ChangePasswordRequest: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    password: 'Password123!',
    newPassword: 'NewPassword123!',
  },
  RegisterUserRequest: {
    name: 'Juan Perez',
    email: 'juan.perez@ejemplo.com',
    password: 'Password123!',
    phone: '+56912345678',
    role: 'client',
    rut: '12.345.678-9',
    transporte: ['maritimo'],
  },
  RegisterUserResponse: {
    userId: 'u_123',
    email: 'juan.perez@ejemplo.com',
    name: 'Juan Perez',
    role: 'client',
  },
  SendCodeRequest: { type: 'email', target: 'juan.perez@ejemplo.com' },
  SendCodeResponse: { message: 'OTP enviado correctamente' },
  VerifyCodeRequest: { target: 'juan.perez@ejemplo.com', code: '123456' },
  VerifyCodeResponse: { verified: true, target: 'juan.perez@ejemplo.com' },
  RegistrationRequestCreate: {
    email: 'usuario@ejemplo.com',
    name: 'Juan Perez',
    rut: '12.345.678-9',
    phone: '+56912345678',
    password: 'Password123!',
    consentimiento: true,
    profileType: 'inversor',
    housingType: 'casa',
    streetAndNumber: 'Av. Ejemplo 123',
    region: 'Región Metropolitana',
    comuna: 'Providencia',
    agency: 'FlowEx',
    transportType: ['aereo'],
    comprobante: 'JVBERi0xLjQKJc...',
    comprobanteFileName: 'comprobante.pdf',
    comprobanteContentType: 'application/pdf',
  },
  RegistrationRequest: {
    email: 'usuario@ejemplo.com',
    name: 'Juan Perez',
    rut: '12.345.678-9',
    phone: '+56912345678',
    profileType: 'inversor',
    status: 'PENDING',
    is_verified: false,
    is_email_verified: false,
    is_phone_verified: false,
    consentimiento: true,
    requestedAt: '2026-05-25T12:00:00.000Z',
    reviewedBy: null,
    notes: null,
    transportType: ['aereo'],
    housingType: 'casa',
    streetAndNumber: 'Av. Ejemplo 123',
    region: 'Región Metropolitana',
    comuna: 'Providencia',
    agency: 'FlowEx',
    comprobanteKey: 'registrations/usuario@example.com/comprobante.pdf',
  },
  RegistrationListResponse: {
    items: [
      {
        email: 'usuario@ejemplo.com',
        name: 'Juan Perez',
        rut: '12.345.678-9',
        phone: '+56912345678',
        profileType: 'inversor',
        status: 'PENDING',
        is_verified: false,
        is_email_verified: false,
        is_phone_verified: false,
        consentimiento: true,
        requestedAt: '2026-05-25T12:00:00.000Z',
      },
    ],
    count: 1,
  },
  RegistrationApproveRequest: {
    reviewedBy: 'admin@importal.cl',
    password: 'Password123!',
    role: 'client',
    notes: 'Aprobado luego de validar documentos',
  },
  RegistrationRejectRequest: {
    reviewedBy: 'admin@importal.cl',
    notes: 'Faltó documentación de respaldo',
  },
  RegistrationApprovalResponse: {
    request: {
      email: 'usuario@ejemplo.com',
      name: 'Juan Perez',
      rut: '12.345.678-9',
      phone: '+56912345678',
      profileType: 'inversor',
      status: 'APPROVED',
      is_verified: true,
      is_email_verified: true,
      is_phone_verified: true,
      consentimiento: true,
      requestedAt: '2026-05-25T12:00:00.000Z',
      reviewedBy: 'admin@importal.cl',
      notes: 'Aprobado luego de validar documentos',
    },
    user: {
      userId: 'u_123',
      email: 'usuario@ejemplo.com',
      name: 'Juan Perez',
      role: 'client',
    },
  },
  RegistrationComprobanteResponse: {
    email: 'usuario@ejemplo.com',
    comprobante: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIA...',
  },
  RegistrationVerifyRequest: { code: '123456', channel: 'email' },
  CreateAdminRequest: {
    name: 'Admin Pascalle Store',
    email: 'admin@importal.cl',
    phone: '+56911112222',
    rut: '11.111.111-1',
  },
  BlockUserRequest: {
    motivo: 'Incumplimiento reiterado de políticas de la plataforma',
  },
  UnblockUserRequest: {
    motivo: 'Situación regularizada tras revisión manual',
  },
  BlockUserResponse: {
    id: 12,
    name: 'Juan Perez',
    role: 'client',
    bloqueo: true,
    bloqueo_origen: 'manual',
    bloqueo_motivo: 'Incumplimiento reiterado de políticas de la plataforma',
    bloqueado_en: '2026-07-18T18:00:00.000Z',
  },
  CreateProductRequest: {
    marca: 'Apple',
    price_usd: 999.99,
    photo_urls: ['https://cdn.importal.cl/products/iphone.jpg'],
    status: 'AVAILABLE',
  },
  UpdateProductRequest: {
    marca: 'Apple',
    price_usd: 949.99,
    photo_urls: ['https://cdn.importal.cl/products/iphone.jpg'],
    status: 'AVAILABLE',
  },
  Product: {
    id: 12,
    marca: 'Apple',
    price_usd: 999.99,
    photo_urls: ['https://cdn.importal.cl/products/iphone.jpg'],
    status: 'AVAILABLE',
  },
  ProductArray: [
    {
      id: 12,
      marca: 'Apple',
      price_usd: 999.99,
      photo_urls: ['https://cdn.importal.cl/products/iphone.jpg'],
      status: 'AVAILABLE',
    },
  ],
  Notification: {
    id: 42,
    type: 'ORDER_STATUS',
    title: 'Tu pedido fue confirmado',
    body: 'El vendedor confirmó tu pedido y será despachado pronto.',
    is_read: false,
    created_at: '2026-05-25T12:00:00.000Z',
  },
  NotificationArray: [
    {
      id: 42,
      type: 'ORDER_STATUS',
      title: 'Tu pedido fue confirmado',
      body: 'El vendedor confirmó tu pedido y será despachado pronto.',
      is_read: false,
      created_at: '2026-05-25T12:00:00.000Z',
    },
  ],
  Chat: { id: 7, user_id: 12, transport_type: 'AEREA', provider_code: 'AIR-01' },
  ChatDetails: {
    id: 7,
    user_id: 12,
    transport_type: 'AEREA',
    provider_code: 'AIR-01',
    messages: [
      { id: 1, chat_id: 7, message: '[Usuario-12]: Hola', created_at: '2026-05-25T12:00:00.000Z' }
    ],
    websocket: {
      url: 'ws://localhost:3000/v1',
      path: '/socket.io',
      namespace: '/v1',
      event: 'join_chat',
      room: 'chat_7'
    }
  },
  ChatArray: [
    { id: 7, user_id: 12, transport_type: 'AEREA', provider_code: 'AIR-01' },
  ],
  ChatMessage: {
    id: '99',
    usuario: 'Juan',
    mensaje: 'Hola, tu pedido está en tránsito.',
    timestamp: '2026-05-25T12:00:00.000Z',
    tipo: 'texto',
    sender_id: 15,
    sender_role: 'client',
    referenced_message_id: null,
  },
  ChatMessageArray: [
    {
      id: '99',
      usuario: 'Juan',
      mensaje: 'Hola, tu pedido está en tránsito.',
      timestamp: '2026-05-25T12:00:00.000Z',
      tipo: 'texto',
      sender_id: 15,
      sender_role: 'client',
      referenced_message_id: null,
    },
  ],
  DashboardSummary: {
    clientes_activos: 128,
    clientes_en_mora: 7,
    deuda_pendiente_clp: 1250000,
    recaudacion_periodo_clp: 8450000,
    periodo: {
      inicio: '2026-05-01T00:00:00.000Z',
      fin: '2026-05-25T23:59:59.000Z',
    },
    ultimos_morosos: [
      {
        cobro_id: 501,
        client_id: 12,
        client_name: 'Juan Perez',
        client_rut: '12.345.678-9',
        amount_clp: 250000,
        due_date: '2026-05-30',
      },
    ],
  },
  GenericObject: { ok: true, message: 'Operacion exitosa' },
  GenericObjectArray: [{ id: 1, message: 'Ejemplo de elemento retornado' }],
  CreateSupportTicketRequest: {
    title: 'Error al subir foto del producto',
    description: 'La plataforma arroja error 500 al intentar subir imágenes de 2MB.',
  },
  ResolveSupportTicketRequest: {
    status: 'RESOLVED',
    resolution: 'Se corrigió la cuota y almacenamiento en el bucket S3. Ya puedes volver a subir tus imágenes.',
  },
  SupportTicket: {
    id: 101,
    user_id: 12,
    title: 'Error al subir foto del producto',
    description: 'La plataforma arroja error 500 al intentar subir imágenes de 2MB.',
    status: 'RESOLVED',
    resolution: 'Se corrigió la cuota y almacenamiento en el bucket S3. Ya puedes volver a subir tus imágenes.',
    resolved_by: 1,
    resolved_at: '2026-06-04T15:45:00.000Z',
    created_at: '2026-06-04T15:40:00.000Z',
    updated_at: '2026-06-04T15:45:00.000Z',
  },
  SupportTicketArray: [
    {
      id: 101,
      user_id: 12,
      title: 'Error al subir foto del producto',
      description: 'La plataforma arroja error 500 al intentar subir imágenes de 2MB.',
      status: 'RESOLVED',
      resolution: 'Se corrigió la cuota y almacenamiento en el bucket S3. Ya puedes volver a subir tus imágenes.',
      resolved_by: 1,
      resolved_at: '2026-06-04T15:45:00.000Z',
      created_at: '2026-06-04T15:40:00.000Z',
      updated_at: '2026-06-04T15:45:00.000Z',
    },
  ],
  SupportTicketPaginated: {
    data: [
      {
        id: 101,
        user_id: 12,
        title: 'Error al subir foto del producto',
        description: 'La plataforma arroja error 500 al intentar subir imágenes de 2MB.',
        status: 'RESOLVED',
        resolution: 'Se corrigió la cuota y almacenamiento en el bucket S3. Ya puedes volver a subir tus imágenes.',
        resolved_by: 1,
        resolved_at: '2026-06-04T15:45:00.000Z',
        created_at: '2026-06-04T15:40:00.000Z',
        updated_at: '2026-06-04T15:45:00.000Z',
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  },
  ProponerTruequeRequest: {
    proposed_product_id: 45,
    proposed_quantity: 2,
    negotiation_notes: 'Ofrecido buzo Nike en reemplazo',
  },
  Ticket: {
    id: 102,
    user_id: 12,
    type: 'BARTER_NEGOTIATION',
    status: 'PENDING',
    title: 'Solicitud de Trueque por Ajuste de Pedido',
    description: 'El cliente solicita trueque para compensación de orden #120.',
    metadata: {
      source_adjustment_id: 10,
      proposed_product_id: 45,
      proposed_quantity: 2,
      negotiation_notes: 'Ofrecido buzo Nike en reemplazo',
      client_acceptance: 'PENDING',
    },
    related_id: 10,
    related_type: 'OrderAdjustment',
    resolved_by: null,
    resolved_at: null,
    created_at: '2026-06-24T04:50:00.000Z',
    updated_at: '2026-06-24T04:50:00.000Z',
  },
  TicketArray: [
    {
      id: 102,
      user_id: 12,
      type: 'BARTER_NEGOTIATION',
      status: 'PENDING',
      title: 'Solicitud de Trueque por Ajuste de Pedido',
      description: 'El cliente solicita trueque para compensación de orden #120.',
      metadata: {
        source_adjustment_id: 10,
        proposed_product_id: 45,
        proposed_quantity: 2,
        negotiation_notes: 'Ofrecido buzo Nike en reemplazo',
        client_acceptance: 'PENDING',
      },
      related_id: 10,
      related_type: 'OrderAdjustment',
      resolved_by: null,
      resolved_at: null,
      created_at: '2026-06-24T04:50:00.000Z',
      updated_at: '2026-06-24T04:50:00.000Z',
    },
  ],
  TicketPaginated: {
    data: [
      {
        id: 102,
        user_id: 12,
        type: 'BARTER_NEGOTIATION',
        status: 'PENDING',
        title: 'Solicitud de Trueque por Ajuste de Pedido',
        description: 'El cliente solicita trueque para compensación de orden #120.',
        metadata: {
          source_adjustment_id: 10,
          proposed_product_id: 45,
          proposed_quantity: 2,
          negotiation_notes: 'Ofrecido buzo Nike en reemplazo',
          client_acceptance: 'PENDING',
        },
        related_id: 10,
        related_type: 'OrderAdjustment',
        resolved_by: null,
        resolved_at: null,
        created_at: '2026-06-24T04:50:00.000Z',
        updated_at: '2026-06-24T04:50:00.000Z',
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  },
  CreateOrderRequest: {
    productId: 2,
    quantity: 1,
    talla: '128GB',
    cargaId: 4,
  },
  UpdateOrderStatusRequest: { status: 'CONFIRMED' },
  ReviewOrderRequest: {
    revisado: true,
    status: 'CONFIRMED',
    llegaron: 2,
    faltaron: 0,
    dañados: 0,
    peso_cobrado_kg: 1.2,
    caja_id: 14,
    video_ref_info: 'Cámara 02, Grabación 10:15 - 10:20, S3 Key: video_120.mp4',
  },
  RequestDeliveryShippingRequest: {
    shipping_address: 'Calle Limite 456, Santiago',
    shipping_method: 'SANTIAGO_LOCAL',
  },
  ConfirmDespachoRequest: {
    video_ref_info: 'Cámara 04, Grabación 15:30 - 15:35',
    camera_id: 'CAM-04',
    bultos: [
      {
        bulto_number: 1,
        weight_kg: 12.5,
        photos: ['(binary file)', '(binary file)']
      },
      {
        bulto_number: 2,
        weight_kg: 8.1,
        photos: ['(binary file)']
      }
    ],
    carrier_proof_url: 'https://s3.amazonaws.com/bucket/comprobante.jpg',
  },
  CargaClientesStatusResponse: [
    {
      client_id: 12,
      client_name: 'Juan Perez',
      email: 'juan.perez@ejemplo.com',
      is_free: false,
      unpaid_cobros: [
        {
          id: 501,
          tipo_cobro: 'FLETE_SEGURO_ADUANA',
          total_clp: 45000,
          status: 'PENDING'
        }
      ]
    }
  ],
  UpdateOrderShippingRequest: { can_ship: true, seller_order_number: 'SO-12345' },
  CreateCargaRequest: { tipo_carga: 'AEREA' },
  UpdateCargaStatusRequest: { status: 'ARRIVED', notes: 'Carga recibida en bodega' },
  InitiateTransbankRequest: { cobro_id: 501, amount_clp: 250000 },
  ConfirmTransbankRequest: { transaction_id: 'trx-123', token: 'token-abc' },
  ConfirmCobroRequest: { approved: true, admin_comment: 'Comprobante validado' },
  UpdateCommissionTierRequest: { id: 1, commission_pct: 20 },
  UpdateLogisticsRateRequest: { id: 1, rate_value: 30 },
  UpdateExchangeRateRequest: { rate: 980 },
  CreateMessageRequest: { message: 'Hola, ¿cómo estás?', referenced_message_id: null },
  RequestContactChangeRequest: { type: 'email', newValue: 'nuevo@correo.com', password: 'Password123!' },
  VerifyContactChangeRequest: { token: 'token-transaction-123', code: '123456' },
  UpdateUserRequest: { email: 'nuevo@correo.com', phone: '+56912345678' },
  RefreshRequest: { refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  RefreshResponse: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  CreateLogisticsRateRequest: {
    transport_type: 'AEREA',
    concept: 'Flete internacional aéreo',
    sub_type: 'Carga General',
    rate_value: 8.5,
    rate_unit: 'KG',
  },
  Carga: {
    id: 4,
    tipo_carga: 'AEREA',
    status: 'IN_TRANSIT',
    created_at: '2026-05-25T12:00:00.000Z',
    opens_at: '2026-05-25T12:00:00.000Z',
    closes_at: null,
  },
  CargasPaginatedResponse: {
    data: [
      {
        id: 4,
        tipo_carga: 'AEREA',
        status: 'IN_TRANSIT',
        created_at: '2026-05-25T12:00:00.000Z',
        opens_at: '2026-05-25T12:00:00.000Z',
        closes_at: null,
      }
    ],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      last_page: 1,
    },
  },
  UpdateCargaLlegadaRequest: {
    arrived_at: '2026-06-18T10:00:00.000Z',
  },
  ConfirmDeliveryRequest: {
    proof_url: 'https://cdn.importal.cl/proofs/delivery_123.jpg',
  },
  ResolveReturnRequestRequest: {
    status: 'APPROVED',
    option: 'FULL_REFUND',
  },
  CreateReturnRequestRequest: {
    delivery_id: 1,
    order_id: 5,
    reason: 'Producto dañado al recibir',
  },
  Delivery: {
    id: 1,
    client_id: 12,
    carga_id: 4,
    status: 'DELIVERED',
    delivered_at: '2026-06-18T12:00:00.000Z',
    delivered_by: 'CLIENT',
    proof_url: 'https://cdn.importal.cl/proofs/delivery_123.jpg',
    created_at: '2026-06-18T08:00:00.000Z',
  },
  DeliveryArray: [
    {
      id: 1,
      client_id: 12,
      carga_id: 4,
      status: 'DELIVERED',
      delivered_at: '2026-06-18T12:00:00.000Z',
      delivered_by: 'CLIENT',
      proof_url: 'https://cdn.importal.cl/proofs/delivery_123.jpg',
      created_at: '2026-06-18T08:00:00.000Z',
    }
  ],
  ReturnRequest: {
    id: 1,
    delivery_id: 1,
    order_id: 5,
    client_id: 12,
    reason: 'Producto dañado al recibir',
    status: 'APPROVED',
    admin_option: 'FULL_REFUND',
    resolved_by: 1,
    created_at: '2026-06-18T08:00:00.000Z',
    resolved_at: '2026-06-18T10:00:00.000Z',
  },
  ReturnRequestArray: [
    {
      id: 1,
      delivery_id: 1,
      order_id: 5,
      client_id: 12,
      reason: 'Producto dañado al recibir',
      status: 'APPROVED',
      admin_option: 'FULL_REFUND',
      resolved_by: 1,
      created_at: '2026-06-18T08:00:00.000Z',
      resolved_at: '2026-06-18T10:00:00.000Z',
    }
  ],
  UpdateProfileRequest: {
    name: 'Juan Pérez',
  },
  UpdateNotificationsRequest: {
    email: true,
    phone: false,
  },
  UserAddress: {
    id: 1,
    user_id: 12,
    alias: 'Casa',
    calle: 'Av. Vitacura',
    numero: '3568',
    depto_oficina: 'Of. 502',
    comuna: 'Vitacura',
    region: 'Región Metropolitana',
    postal_code: '7630000',
    is_default: true,
    housing_type: 'departamento',
    despacho_agency: 'FlowEx',
    reference: 'Esquina Vitacura con Alonso de Córdova',
    pickup_instructions: null,
    created_at: '2026-07-01T18:00:00.000Z',
  },
  UserAddressArray: [
    {
      id: 1,
      user_id: 12,
      alias: 'Casa',
      calle: 'Av. Vitacura',
      numero: '3568',
      depto_oficina: 'Of. 502',
      comuna: 'Vitacura',
      region: 'Región Metropolitana',
      postal_code: '7630000',
      is_default: true,
      housing_type: 'departamento',
      despacho_agency: 'FlowEx',
      reference: 'Esquina Vitacura con Alonso de Córdova',
      pickup_instructions: null,
      created_at: '2026-07-01T18:00:00.000Z',
    }
  ],
  CreateAddressRequest: {
    alias: 'Casa',
    calle: 'Av. Vitacura',
    numero: '3568',
    depto_oficina: 'Of. 502',
    comuna: 'Vitacura',
    region: 'Región Metropolitana',
    postal_code: '7630000',
    is_default: true,
    housing_type: 'departamento',
    despacho_agency: 'FlowEx',
    reference: 'Esquina Vitacura con Alonso de Córdova',
    pickup_instructions: null,
  },
  UpdateAddressRequest: {
    alias: 'Casa',
    calle: 'Av. Vitacura',
    numero: '3568',
    depto_oficina: 'Of. 503',
    comuna: 'Vitacura',
    region: 'Región Metropolitana',
    postal_code: '7630000',
    is_default: true,
    housing_type: 'departamento',
    despacho_agency: 'FlowEx',
    reference: 'Esquina Vitacura con Alonso de Córdova',
    pickup_instructions: null,
  },
  UserBilling: {
    id: 1,
    razon_social: 'Importaciones y Exportaciones SpA',
    rut_empresa: '76.543.210-K',
    giro: 'Venta al por mayor de artículos electrónicos',
    direccion_facturacion: 'Av. Providencia 1234, Santiago',
    correo: 'facturacion@empresa.cl',
    user_id: 12,
    created_at: '2026-07-01T18:00:00.000Z',
    updated_at: '2026-07-01T18:00:00.000Z',
  },
  UpdateBillingRequest: {
    razon_social: 'Importaciones y Exportaciones SpA',
    rut_empresa: '76.543.210-K',
    giro: 'Venta al por mayor de artículos electrónicos',
    direccion_facturacion: 'Av. Providencia 1234, Santiago',
    correo: 'facturacion@empresa.cl',
  },
  UserProfile: {
    id: 12,
    name: 'Juan Pérez',
    external_id: 'auth0|123456',
    email: true,
    phone: false,
    concentimiento: true,
    email_address: 'juan.perez@ejemplo.com',
    phone_number: '+56912345678',
    rut: '12.345.678-9',
    bloqueo: false,
    role: 'client',
    operacion_ciudad: null,
    bodega_asignada: null,
    status_mora: 'LIBRE',
    addresses: [
      {
        id: 1,
        user_id: 12,
        alias: 'Casa',
        calle: 'Av. Vitacura',
        numero: '3568',
        depto_oficina: 'Of. 502',
        comuna: 'Vitacura',
        region: 'Región Metropolitana',
        postal_code: '7630000',
        is_default: true,
        housing_type: 'departamento',
        despacho_agency: 'FlowEx',
        reference: 'Esquina Vitacura con Alonso de Córdova',
        pickup_instructions: null,
        created_at: '2026-07-01T18:00:00.000Z',
      }
    ],
    billing: {
      id: 1,
      razon_social: 'Importaciones y Exportaciones SpA',
      rut_empresa: '76.543.210-K',
      giro: 'Venta al por mayor de artículos electrónicos',
      direccion_facturacion: 'Av. Providencia 1234, Santiago',
      correo: 'facturacion@empresa.cl',
      user_id: 12,
      created_at: '2026-07-01T18:00:00.000Z',
      updated_at: '2026-07-01T18:00:00.000Z',
    },
  },
}

function getSchemaExample(schemaRef) {
  return schemaExamples[schemaRef]
}

function withExample(content, example) {
  return example === undefined ? content : { ...content, example }
}

export const info = {
  title: 'Pascalle Store Unified API',
  version: '1.0.0',
  description:
    'Especificación OpenAPI centralizada de Pascalle Store para autenticación, backend y el flujo público de registro.',
}

export const servers = [
  {
    url: 'https://{host}',
    description: 'API pública de Pascalle Store',
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
  cookieAccessAuth: {
    type: 'apiKey',
    in: 'cookie',
    name: 'access_token',
    description: 'Access Token en cookie HTTP-Only',
  },
  cookieRefreshAuth: {
    type: 'apiKey',
    in: 'cookie',
    name: 'refresh_token',
    description: 'Refresh Token en cookie HTTP-Only',
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
              profileType: stringEnum(['inversor', 'cliente']),
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
              profileType: { const: 'cliente_antiguo', type: 'string' },
              housingType: stringEnum(['casa', 'departamento', 'oficina']),
              streetAndNumber: { type: 'string' },
              deptOrOffice: { type: 'string' },
              region: { type: 'string' },
              comuna: { type: 'string' },
              reference: { type: 'string', maxLength: 120 },
              agency: { type: 'string' },
              transportType: { type: 'array', items: stringEnum(['maritimo', 'aereo']) },
              comprobante: { type: 'string', description: 'Archivo PDF/Imagen en Base64 (max 5MB) (Opcional)' },
              comprobanteFileName: { type: 'string' },
              comprobanteContentType: { type: 'string' },
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
      comprobanteUrl: { type: 'string', description: 'URL firmada de S3 para visualizar el comprobante (validez temporal)' },
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
  RegistrationComprobanteResponse: objectSchema(
    {
      email: { type: 'string', format: 'email' },
      comprobante: { type: 'string', description: 'Comprobante de registro codificado en base64' },
    },
    ['email', 'comprobante'],
  ),
  RegistrationCheckExistsResponse: objectSchema(
    {
      exists: { type: 'boolean', description: 'Si el usuario ya existe' },
      field: { type: 'string', enum: ['email', 'rut'] },
    },
    ['exists'],
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
  BlockUserRequest: objectSchema(
    {
      motivo: { type: 'string', maxLength: 500, description: 'Motivo del bloqueo (obligatorio)' },
    },
    ['motivo'],
  ),
  UnblockUserRequest: objectSchema(
    {
      motivo: { type: 'string', maxLength: 500, description: 'Motivo del desbloqueo (opcional)' },
    },
  ),
  BlockUserResponse: objectSchema(
    {
      id: { type: 'integer' },
      name: { type: 'string' },
      role: { type: 'string' },
      bloqueo: { type: 'boolean' },
      bloqueo_origen: stringEnum(['ninguno', 'financiero', 'manual']),
      bloqueo_motivo: { type: 'string', nullable: true },
      bloqueado_en: { type: 'string', format: 'date-time', nullable: true },
    },
    ['id', 'name', 'role', 'bloqueo', 'bloqueo_origen'],
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
  ChatDetails: objectSchema(
    {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      transport_type: { type: 'string' },
      provider_code: { type: 'string' },
      messages: { type: 'array', items: { $ref: '#/components/schemas/ChatMessage' } },
      websocket: objectSchema({
        url: { type: 'string' },
        path: { type: 'string' },
        namespace: { type: 'string' },
        event: { type: 'string' },
        room: { type: 'string' },
      }, ['url', 'path', 'namespace', 'event', 'room']),
    },
    ['id', 'websocket'],
  ),
  ChatMessage: objectSchema(
    {
      id: { type: 'string', description: 'ID del mensaje' },
      usuario: { type: 'string', description: 'Nombre del remitente' },
      mensaje: { type: 'string', description: 'Contenido del mensaje' },
      timestamp: { type: 'string', format: 'date-time', description: 'Fecha en formato ISO 8601' },
      tipo: { type: 'string', enum: ['texto', 'producto'], description: 'Tipo de mensaje' },
      sender_id: { type: 'integer', nullable: true, description: 'ID de base de datos del remitente' },
      sender_role: { type: 'string', nullable: true, description: 'Rol del remitente' },
      referenced_message_id: { type: 'integer', nullable: true, description: 'ID del mensaje al que hace referencia' },
      productoRef: objectSchema({
        productoId: { type: 'string' },
        proveedorId: { type: 'string' },
        nombre: { type: 'string' },
        precioUsd: { type: 'number' },
        foto: { type: 'string', description: 'Imagen de producto (Base64 data URL)' }
      }, ['productoId', 'proveedorId', 'nombre', 'precioUsd', 'foto'])
    },
    ['id', 'usuario', 'mensaje', 'timestamp', 'tipo'],
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
  ClienteCobrosGroupedResponse: objectSchema({
    data: {
      type: 'array',
      items: objectSchema({
        carga_id: { type: 'integer', nullable: true },
        carga: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'integer' },
            tipo_carga: { type: 'string' },
            status: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          }
        },
        cobros: {
          type: 'array',
          items: { $ref: '#/components/schemas/Cobro' }
        }
      })
    },
    pagination: {
      type: 'object',
      properties: {
        total: { type: 'integer' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        pages: { type: 'integer' }
      },
      required: ['total', 'page', 'limit', 'pages']
    }
  }, ['data', 'pagination']),
  CreateOrderRequest: {
    ...objectSchema(
      {
        productId: { type: 'integer' },
        quantity: { type: 'integer' },
        talla: { type: 'string' },
        cargaId: { type: 'integer' },
      },
      ['productId', 'quantity', 'talla'],
    ),
    example: {
      productId: 2,
      quantity: 1,
      talla: '128GB',
    },
  },
  VendorOrder: objectSchema(
    {
      id: { type: 'integer' },
      status: { type: 'string' },
      cantidad: { type: 'integer' },
      nombre_producto: { type: 'string', nullable: true },
      can_ship: { type: 'boolean', nullable: true },
      seller_order_number: { type: 'string', nullable: true },
      carga: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'integer' },
          tipo_carga: { type: 'string' },
          status: { type: 'string' },
        },
        required: ['id', 'tipo_carga', 'status'],
      },
    },
    ['id', 'status', 'cantidad', 'nombre_producto', 'carga'],
  ),
  VendorOrderArray: { type: 'array', items: { $ref: '#/components/schemas/VendorOrder' } },
  VendorOrdersPaginatedResponse: objectSchema(
    {
      data: { type: 'array', items: { $ref: '#/components/schemas/VendorOrder' } },
      meta: objectSchema(
        {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          last_page: { type: 'integer' },
        },
        ['total', 'page', 'limit', 'last_page'],
      ),
    },
    ['data', 'meta'],
  ),
  UpdateOrderStatusRequest: objectSchema({ status: { type: 'string' } }, ['status']),
  ReviewOrderRequest: objectSchema(
    {
      revisado: { type: 'boolean', nullable: true },
      status: { type: 'string', nullable: true },
      llegaron: { type: 'integer', nullable: true },
      faltaron: { type: 'integer', nullable: true },
      dañados: { type: 'integer', nullable: true },
      peso_cobrado_kg: { type: 'number', nullable: true },
      caja_id: { type: 'integer', nullable: true },
      video_ref_info: { type: 'string', nullable: true },
    },
    [],
  ),
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
  UpdateExchangeRateRequest: objectSchema(
    {
      rate: { type: 'number' },
    },
    ['rate'],
  ),
  RequestDeliveryShippingRequest: objectSchema(
    {
      shipping_address: { type: 'string', nullable: true },
      shipping_method: stringEnum(['SANTIAGO_LOCAL', 'SANTIAGO_COURIER', 'REGIONES_STARKEN']),
    },
    ['shipping_method'],
  ),
  ConfirmDespachoRequest: objectSchema(
    {
      video_ref_info: { type: 'string', nullable: true },
      camera_id: { type: 'string', nullable: true },
      carrier_proof_url: { type: 'string', nullable: true },
      bultos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            bulto_number: { type: 'integer' },
            weight_kg: { type: 'number', nullable: true },
            photos: {
              type: 'array',
              items: { type: 'string', format: 'binary' },
            },
          },
          required: ['bulto_number'],
        },
      },
    },
    [],
  ),
  CargaClientesStatusItem: objectSchema(
    {
      client_id: { type: 'integer' },
      client_name: { type: 'string' },
      email: { type: 'string' },
      is_free: { type: 'boolean' },
      unpaid_cobros: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            tipo_cobro: { type: 'string' },
            total_clp: { type: 'number' },
            status: { type: 'string' },
          },
          required: ['id', 'tipo_cobro', 'total_clp', 'status'],
        },
      },
      delivery_id: { type: 'integer', nullable: true },
      orders_total: { type: 'integer' },
      orders_reviewed: { type: 'integer' },
      all_orders_reviewed: { type: 'boolean' },
      blocking_cobros_summary: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            cobro_id: { type: 'integer' },
            tipo_cobro: { type: 'string' },
            total_clp: { type: 'number' },
            status: { type: 'string' },
          },
          required: ['cobro_id', 'tipo_cobro', 'total_clp', 'status'],
        },
      },
    },
    ['client_id', 'client_name', 'email', 'is_free', 'unpaid_cobros', 'orders_total', 'orders_reviewed', 'all_orders_reviewed', 'blocking_cobros_summary'],
  ),
  CargaClientesStatusResponse: {
    type: 'array',
    items: { '$ref': '#/components/schemas/CargaClientesStatusItem' },
  },
  CreateMessageRequest: objectSchema(
    {
      message: { type: 'string', description: 'Contenido del mensaje' },
      referenced_message_id: { type: 'integer', description: 'ID del mensaje al que responde', nullable: true },
    },
    ['message'],
  ),
  RequestContactChangeRequest: objectSchema(
    {
      type: stringEnum(['email', 'phone']),
      newValue: { type: 'string', description: 'Nuevo correo o número de teléfono' },
      password: { type: 'string', description: 'Contraseña actual del usuario' },
    },
    ['type', 'newValue', 'password'],
  ),
  VerifyContactChangeRequest: objectSchema(
    {
      token: { type: 'string', description: 'Token de transacción de la solicitud' },
      code: { type: 'string', minLength: 6, description: 'Código OTP recibido' },
    },
    ['token', 'code'],
  ),
  UpdateUserRequest: objectSchema(
    {
      email: { type: 'string', format: 'email', description: 'Nuevo correo electrónico' },
      phone: { type: 'string', description: 'Nuevo número de teléfono' },
    },
    [],
  ),
  GenericObject: genericObject,
  GenericObjectArray: { type: 'array', items: genericObject },
  RefreshRequest: objectSchema(
    {
      refreshToken: { type: 'string', description: 'Refresh token del usuario' },
    },
    [],
  ),
  RefreshResponse: objectSchema(
    {
      accessToken: { type: 'string', description: 'Nuevo access token de usuario' },
    },
    ['accessToken'],
  ),
  CreateLogisticsRateRequest: objectSchema(
    {
      transport_type: { type: 'string', enum: ['AEREA', 'MARITIMA'], description: 'Tipo de carga' },
      concept: { type: 'string', description: 'Concepto de cobro logístico' },
      sub_type: { type: 'string', description: 'Subtipo opcional del concepto' },
      rate_value: { type: 'number', description: 'Valor de la tarifa' },
      rate_unit: { type: 'string', description: 'Unidad de medida (ej. KG, CBM)' },
    },
    ['transport_type', 'concept', 'rate_value', 'rate_unit'],
  ),
  CreateSupportTicketRequest: objectSchema(
    {
      title: { type: 'string', minLength: 5, maxLength: 150, description: 'Título del ticket de soporte' },
      description: { type: 'string', minLength: 10, description: 'Detalle del problema reportado' },
    },
    ['title', 'description'],
  ),
  ResolveSupportTicketRequest: objectSchema(
    {
      status: stringEnum(['RESOLVED', 'REJECTED']),
      resolution: { type: 'string', minLength: 5, description: 'Respuesta o resolución dada por el administrador' },
    },
    ['status', 'resolution'],
  ),
  SupportTicket: objectSchema(
    {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      title: { type: 'string' },
      description: { type: 'string' },
      status: stringEnum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']),
      resolution: { type: 'string', nullable: true },
      resolved_by: { type: 'integer', nullable: true },
      resolved_at: { type: 'string', format: 'date-time', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' },
    },
    ['id', 'user_id', 'title', 'description', 'status', 'created_at', 'updated_at'],
  ),
  SupportTicketArray: {
    type: 'array',
    items: { $ref: '#/components/schemas/SupportTicket' },
  },
  SupportTicketPaginated: objectSchema(
    {
      data: { type: 'array', items: { $ref: '#/components/schemas/SupportTicket' } },
      total: { type: 'integer' },
      page: { type: 'integer' },
      limit: { type: 'integer' },
    },
    ['data', 'total', 'page', 'limit'],
  ),
  ProponerTruequeRequest: objectSchema(
    {
      proposed_product_id: { type: 'integer', description: 'ID del producto ofrecido' },
      proposed_quantity: { type: 'integer', description: 'Cantidad del producto ofrecido' },
      negotiation_notes: { type: 'string', description: 'Notas explicativas o de negociación', nullable: true },
    },
    ['proposed_product_id', 'proposed_quantity'],
  ),
  Ticket: objectSchema(
    {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      type: stringEnum(['SUPPORT', 'RETURN_WARRANTY', 'BARTER_NEGOTIATION', 'REFUND_TRANSFER']),
      status: stringEnum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']),
      title: { type: 'string' },
      description: { type: 'string' },
      metadata: { type: 'object', description: 'Campos y variables específicas del tipo', nullable: true },
      related_id: { type: 'integer', nullable: true },
      related_type: { type: 'string', nullable: true },
      resolved_by: { type: 'integer', nullable: true },
      resolved_at: { type: 'string', format: 'date-time', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' },
    },
    ['id', 'user_id', 'type', 'status', 'title', 'description', 'created_at', 'updated_at'],
  ),
  TicketArray: {
    type: 'array',
    items: { $ref: '#/components/schemas/Ticket' },
  },
  TicketPaginated: objectSchema(
    {
      data: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } },
      total: { type: 'integer' },
      page: { type: 'integer' },
      limit: { type: 'integer' },
    },
    ['data', 'total', 'page', 'limit'],
  ),
  Carga: objectSchema(
    {
      id: { type: 'integer' },
      tipo_carga: stringEnum(['AEREA', 'MARITIMA']),
      status: stringEnum(['OPEN', 'IN_TRANSIT', 'ARRIVED', 'CLOSED']),
      created_at: { type: 'string', format: 'date-time' },
      opens_at: { type: 'string', format: 'date-time', nullable: true },
      closes_at: { type: 'string', format: 'date-time', nullable: true },
    },
    ['id', 'tipo_carga', 'status', 'created_at'],
  ),
  CargasPaginatedResponse: objectSchema(
    {
      data: { type: 'array', items: { $ref: '#/components/schemas/Carga' } },
      meta: objectSchema(
        {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          last_page: { type: 'integer' },
        },
        ['total', 'page', 'limit', 'last_page'],
      ),
    },
    ['data', 'meta'],
  ),
  UpdateCargaLlegadaRequest: objectSchema(
    {
      arrived_at: { type: 'string', format: 'date-time' },
    },
    ['arrived_at'],
  ),
  ConfirmDeliveryRequest: objectSchema(
    {
      proof_url: { type: 'string' },
    },
    ['proof_url'],
  ),
  ResolveReturnRequestRequest: objectSchema(
    {
      status: { type: 'string' },
      option: { type: 'string', nullable: true },
      reject_reason: { type: 'string', nullable: true },
      reject_proof_url: { type: 'string', nullable: true },
    },
    ['status'],
  ),
  CreateReturnRequestRequest: objectSchema(
    {
      delivery_id: { type: 'integer' },
      order_id: { type: 'integer' },
      reason: { type: 'string' },
    },
    ['delivery_id', 'order_id', 'reason'],
  ),
  Delivery: objectSchema(
    {
      id: { type: 'integer' },
      client_id: { type: 'integer' },
      carga_id: { type: 'integer' },
      status: stringEnum(['PENDING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED']),
      delivered_at: { type: 'string', format: 'date-time', nullable: true },
      delivered_by: { type: 'string', enum: ['CLIENT', 'ADMIN'], nullable: true },
      proof_url: { type: 'string', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
    },
    ['id', 'client_id', 'carga_id', 'status', 'created_at'],
  ),
  DeliveryArray: { type: 'array', items: { $ref: '#/components/schemas/Delivery' } },
  ReturnRequest: objectSchema(
    {
      id: { type: 'integer' },
      delivery_id: { type: 'integer' },
      order_id: { type: 'integer' },
      client_id: { type: 'integer' },
      reason: { type: 'string' },
      status: stringEnum(['PENDING', 'APPROVED', 'REJECTED']),
      admin_option: { type: 'string', enum: ['CREDIT_NEXT_BILL', 'FULL_REFUND'], nullable: true },
      reject_reason: { type: 'string', nullable: true },
      reject_proof_url: { type: 'string', nullable: true },
      resolved_by: { type: 'integer', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
      resolved_at: { type: 'string', format: 'date-time', nullable: true },
    },
    ['id', 'delivery_id', 'order_id', 'client_id', 'reason', 'status', 'created_at'],
  ),
  ReturnRequestArray: { type: 'array', items: { $ref: '#/components/schemas/ReturnRequest' } },
  UpdateProfileRequest: objectSchema({
    name: { type: 'string', description: 'Nombre del usuario' }
  }, ['name']),
  UpdateNotificationsRequest: objectSchema({
    email: { type: 'boolean', description: 'Preferencia de notificación por correo' },
    phone: { type: 'boolean', description: 'Preferencia de notificación por teléfono' }
  }, ['email', 'phone']),
  UserAddress: objectSchema({
    id: { type: 'integer' },
    user_id: { type: 'integer' },
    alias: { type: 'string', nullable: true },
    calle: { type: 'string' },
    numero: { type: 'string' },
    depto_oficina: { type: 'string', nullable: true },
    comuna: { type: 'string' },
    region: { type: 'string' },
    postal_code: { type: 'string', nullable: true },
    is_default: { type: 'boolean' },
    housing_type: { type: 'string', nullable: true },
    despacho_agency: { type: 'string', nullable: true },
    reference: { type: 'string', nullable: true },
    pickup_instructions: { type: 'string', nullable: true },
    created_at: { type: 'string', format: 'date-time' }
  }, ['id', 'user_id', 'calle', 'numero', 'comuna', 'region', 'is_default']),
  UserAddressArray: {
    type: 'array',
    items: { $ref: '#/components/schemas/UserAddress' }
  },
  CreateAddressRequest: objectSchema({
    alias: { type: 'string' },
    calle: { type: 'string' },
    numero: { type: 'string' },
    depto_oficina: { type: 'string' },
    comuna: { type: 'string' },
    region: { type: 'string' },
    postal_code: { type: 'string' },
    is_default: { type: 'boolean' },
    housing_type: { type: 'string' },
    despacho_agency: { type: 'string' },
    reference: { type: 'string' },
    pickup_instructions: { type: 'string' }
  }, ['calle', 'numero', 'comuna', 'region']),
  UpdateAddressRequest: objectSchema({
    alias: { type: 'string' },
    calle: { type: 'string' },
    numero: { type: 'string' },
    depto_oficina: { type: 'string' },
    comuna: { type: 'string' },
    region: { type: 'string' },
    postal_code: { type: 'string' },
    is_default: { type: 'boolean' },
    housing_type: { type: 'string' },
    despacho_agency: { type: 'string' },
    reference: { type: 'string' },
    pickup_instructions: { type: 'string' }
  }),
  UserBilling: objectSchema({
    id: { type: 'integer' },
    razon_social: { type: 'string' },
    rut_empresa: { type: 'string' },
    giro: { type: 'string' },
    direccion_facturacion: { type: 'string' },
    correo: { type: 'string', format: 'email' },
    user_id: { type: 'integer' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }, ['id', 'razon_social', 'rut_empresa', 'giro', 'direccion_facturacion', 'correo', 'user_id']),
  UpdateBillingRequest: objectSchema({
    razon_social: { type: 'string' },
    rut_empresa: { type: 'string' },
    giro: { type: 'string' },
    direccion_facturacion: { type: 'string' },
    correo: { type: 'string', format: 'email' }
  }, ['razon_social', 'rut_empresa', 'giro', 'direccion_facturacion', 'correo']),
  UserProfile: objectSchema({
    id: { type: 'integer' },
    name: { type: 'string' },
    external_id: { type: 'string' },
    email: { type: 'boolean' },
    phone: { type: 'boolean' },
    concentimiento: { type: 'boolean' },
    email_address: { type: 'string', format: 'email', nullable: true },
    phone_number: { type: 'string', nullable: true },
    rut: { type: 'string', nullable: true },
    bloqueo: { type: 'boolean' },
    role: { type: 'string' },
    operacion_ciudad: { type: 'string', nullable: true },
    bodega_asignada: { type: 'string', nullable: true },
    status_mora: { type: 'string' },
    addresses: { type: 'array', items: { $ref: '#/components/schemas/UserAddress' } },
    billing: { $ref: '#/components/schemas/UserBilling', nullable: true }
  }, ['id', 'name', 'external_id', 'email', 'phone', 'concentimiento', 'bloqueo', 'role', 'status_mora']),
}

function jsonRequest(schemaRef, required = true) {
  return {
    required,
    content: {
      'application/json': {
        ...withExample(
          { schema: { $ref: `#/components/schemas/${schemaRef}` } },
          getSchemaExample(schemaRef),
        ),
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
          ...withExample(
            { schema: { $ref: `#/components/schemas/${schemaRef}` } },
            getSchemaExample(schemaRef),
          ),
        },
      },
    },
  ]
}

function noContentResponse(status, description) {
  return [status, { description }]
}

export const operationOverrides = {
  'post /auth/api/v1/login': {
    summary: 'Autenticar usuario y emitir JWT',
    requestBody: jsonRequest('LoginRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Login exitoso. Retorna JWT en JSON y configura cookies HTTP-Only, Secure y SameSite=None (access_token y refresh_token)', 'LoginResponse'),
      jsonResponse('401', 'Credenciales invalidas', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/change-password': {
    summary: 'Actualizar clave de usuario autenticado',
    requestBody: jsonRequest('ChangePasswordRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Clave actualizada exitosamente', 'GenericMessage'),
      jsonResponse('401', 'Token invalido o clave actual incorrecta', 'ErrorResponse'),
    ]),
  },
  'get /auth/api/v1/validate': {
    summary: 'Validar JWT emitido por auth',
    responses: Object.fromEntries([
      jsonResponse('200', 'Token valido', 'ValidateResponse'),
      jsonResponse('401', 'Token invalido o expirado', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/logout': {
    summary: 'Cerrar sesión e invalidar tokens',
    responses: Object.fromEntries([
      noContentResponse('200', 'Logout exitoso. Invalida tokens y elimina las cookies access_token y refresh_token'),
      jsonResponse('401', 'Token invalido o expirado', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/refresh': {
    summary: 'Refrescar token de acceso',
    requestBody: jsonRequest('RefreshRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Token refrescado. Retorna nuevo access token en JSON y actualiza la cookie access_token', 'RefreshResponse'),
      jsonResponse('401', 'Refresh token invalido o expirado', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/register-user': {
    summary: 'Registrar usuario desde servicios internos',
    requestBody: jsonRequest('RegisterUserRequest'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Usuario registrado', 'RegisterUserResponse'),
      jsonResponse('403', 'Acceso restringido a VPC', 'ErrorResponse'),
      jsonResponse('409', 'Usuario ya existe', 'ErrorResponse'),
    ]),
  },
  'post /auth/api/v1/send-code': {
    summary: 'Enviar OTP via auth service',
    requestBody: jsonRequest('SendCodeRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'OTP enviado', 'SendCodeResponse')]),
  },
  'post /auth/api/v1/verify-code': {
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
          example: {
            channel: 'both',
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
          example: {
            email: 'nuevo_correo@ejemplo.com',
            phone: '+56987654321',
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
  'get /api/v1/registration-requests/check-exists': {
    summary: 'Verificar si un email o RUT ya existe en el sistema',
    parameters: [
      { name: 'email', in: 'query', required: false, schema: { type: 'string' }, description: 'Correo a verificar' },
      { name: 'rut', in: 'query', required: false, schema: { type: 'string' }, description: 'RUT a verificar' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Resultado de la verificación', 'RegistrationCheckExistsResponse'),
    ]),
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
  'post /api/v1/admin/users/{id}/bloquear': {
    summary: 'Bloquear manualmente a un usuario CLIENT/VENDOR/BODEGUERO (Admin/Root)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del usuario a bloquear' },
    ],
    requestBody: jsonRequest('BlockUserRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Usuario bloqueado. Sincroniza active=false en Importal-auth (impide login y revoca la sesion activa en el siguiente request)', 'BlockUserResponse'),
      jsonResponse('400', 'El actor intenta bloquearse a si mismo', 'ErrorResponse'),
      jsonResponse('403', 'El usuario objetivo no tiene rol CLIENT, VENDOR o BODEGUERO (ADMIN/ROOT solo pueden bloquearse via /admin/admins/{id}/bloquear)', 'ErrorResponse'),
      jsonResponse('404', 'Usuario no encontrado', 'ErrorResponse'),
      jsonResponse('500', 'Fallo de sincronizacion con Importal-auth; no se persiste el cambio en Postgres', 'ErrorResponse'),
    ]),
  },
  'post /api/v1/admin/users/{id}/desbloquear': {
    summary: 'Desbloquear manualmente a un usuario CLIENT/VENDOR/BODEGUERO (Admin/Root)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del usuario a desbloquear' },
    ],
    requestBody: jsonRequest('UnblockUserRequest', false),
    responses: Object.fromEntries([
      jsonResponse('200', 'Usuario desbloqueado. Sincroniza active=true en Importal-auth', 'BlockUserResponse'),
      jsonResponse('403', 'El usuario objetivo no tiene rol CLIENT, VENDOR o BODEGUERO', 'ErrorResponse'),
      jsonResponse('404', 'Usuario no encontrado', 'ErrorResponse'),
      jsonResponse('500', 'Fallo de sincronizacion con Importal-auth', 'ErrorResponse'),
    ]),
  },
  'post /api/v1/admin/admins/{id}/bloquear': {
    summary: 'Bloquear manualmente a un usuario ADMIN (Root, exclusivo)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del administrador a bloquear' },
    ],
    requestBody: jsonRequest('BlockUserRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Administrador bloqueado. bloqueado_por_id queda NULL si el actor Root no tiene fila local en Postgres (comportamiento esperado)', 'BlockUserResponse'),
      jsonResponse('403', 'El usuario objetivo no tiene rol ADMIN (incluye intentar bloquear a otro ROOT)', 'ErrorResponse'),
      jsonResponse('404', 'Usuario no encontrado', 'ErrorResponse'),
      jsonResponse('500', 'Fallo de sincronizacion con Importal-auth', 'ErrorResponse'),
    ]),
  },
  'post /api/v1/admin/admins/{id}/desbloquear': {
    summary: 'Desbloquear manualmente a un usuario ADMIN (Root, exclusivo)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del administrador a desbloquear' },
    ],
    requestBody: jsonRequest('UnblockUserRequest', false),
    responses: Object.fromEntries([
      jsonResponse('200', 'Administrador desbloqueado', 'BlockUserResponse'),
      jsonResponse('403', 'El usuario objetivo no tiene rol ADMIN', 'ErrorResponse'),
      jsonResponse('404', 'Usuario no encontrado', 'ErrorResponse'),
      jsonResponse('500', 'Fallo de sincronizacion con Importal-auth', 'ErrorResponse'),
    ]),
  },
  'get /api/v1/notificaciones': {
    responses: Object.fromEntries([jsonResponse('200', 'Notificaciones del usuario', 'NotificationArray')]),
  },
  'put /api/v1/notificaciones/{id}/leer': {
    responses: Object.fromEntries([jsonResponse('200', 'Notificacion marcada como leida', 'GenericObject')]),
  },
  'put /api/v1/notificaciones/leer-todas': {
    summary: 'Marcar todas las notificaciones del usuario como leídas',
    responses: Object.fromEntries([jsonResponse('200', 'Todas las notificaciones marcadas como leídas', 'GenericObject')]),
  },
  'get /api/v1/chats': {
    responses: Object.fromEntries([jsonResponse('200', 'Listado de chats', 'ChatArray')]),
  },
  'get /api/v1/chats/{id}': {
    responses: Object.fromEntries([jsonResponse('200', 'Detalles del chat y configuración websocket', 'ChatDetails')]),
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
  'get /api/v1/vendedor/pedidos': {
    summary: 'Listar pedidos del vendedor autenticado (Vendedor)',
    parameters: [
      { name: 'can_ship', in: 'query', required: false, schema: { type: 'boolean' }, description: 'Filtrar por pedidos que se pueden enviar (true/false)' },
      { name: 'active_carga', in: 'query', required: false, schema: { type: 'boolean' }, description: 'Filtrar por pedidos asociados a la asignación de carga activa' },
      { name: 'tipo_carga', in: 'query', required: false, schema: { type: 'string', enum: ['AEREA', 'MARITIMA'] }, description: 'Filtrar por tipo de transporte (AEREA/MARITIMA)' },
      { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 }, description: 'Número de página' },
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 10 }, description: 'Límite de resultados por página' }
    ],
    responses: Object.fromEntries([jsonResponse('200', 'Pedidos del vendedor', 'VendorOrdersPaginatedResponse')]),
  },
  'put /api/v1/vendedor/pedidos/{id}/estado': {
    requestBody: jsonRequest('UpdateOrderStatusRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Estado de pedido actualizado. Si se cancela/rechaza se libera el stock.', 'GenericObject')]),
  },
  'post /api/v1/vendedor/pedidos/{id}/confirmar': {
    summary: 'Confirmar pedido y efectuar descuento final de stock (Vendedor)',
    responses: Object.fromEntries([jsonResponse('200', 'Pedido confirmado', 'GenericObject')]),
  },
  'post /api/v1/vendedor/pedidos/{id}/rechazar': {
    summary: 'Rechazar un pedido y liberar el stock reservado (Vendedor)',
    responses: Object.fromEntries([jsonResponse('200', 'Pedido rechazado', 'GenericObject')]),
  },
  'post /api/v1/vendedor/pedidos/{id}/envio': {
    summary: 'Marcar pedido como enviado y listo para tránsito (Vendedor)',
    responses: Object.fromEntries([jsonResponse('200', 'Pedido marcado como listo para envío', 'GenericObject')]),
  },
  'get /api/v1/cargas': {
    summary: 'Listar cargas con paginación y filtro de estado (Admin/Root/Client/Vendor/Bodeguero)',
    parameters: [
      { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 }, description: 'Número de página' },
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 10 }, description: 'Límite de resultados por página (máx 50)' },
      { name: 'status', in: 'query', required: false, schema: { type: 'string' }, description: 'Filtrar por estado (ej: OPEN, CLOSED, IN_TRANSIT, ARRIVED o lista separada por comas)' }
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de cargas paginado', 'CargasPaginatedResponse'),
    ]),
  },
  'get /api/v1/cargas/{id}': {
    summary: 'Obtener detalle de una carga específica (Admin/Root/Client/Vendor/Bodeguero)',
    responses: Object.fromEntries([jsonResponse('200', 'Detalle de la carga', 'Carga')]),
  },
  'post /api/v1/admin/cargas': {
    requestBody: jsonRequest('CreateCargaRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Carga creada', 'GenericObject')]),
  },
  'put /api/v1/bodeguero/cargas/{id}/status': {
    requestBody: jsonRequest('UpdateCargaStatusRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Estado de carga actualizado', 'GenericObject')]),
  },
  'put /api/v1/bodeguero/pedidos/{id}/revisar': {
    summary: 'Registrar la revisión física de un pedido por parte del bodeguero',
    requestBody: jsonRequest('ReviewOrderRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Pedido revisado exitosamente', 'GenericObject')]),
  },
  'get /api/v1/admin/cobros': {
    summary: 'Listar todos los cobros del sistema (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Listado de cobros', 'GenericObjectArray')]),
  },
  'get /api/v1/admin/cobros/pendientes-validacion': {
    summary: 'Listar cobros que tienen un comprobante subido pendiente de revisión (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Listado de cobros pendientes de validación', 'GenericObjectArray')]),
  },
  'get /api/v1/admin/cobros/{id}/comprobantes': {
    summary: 'Obtener los comprobantes de pago subidos para un cobro específico (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Lista de comprobantes del cobro', 'GenericObjectArray')]),
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
  'get /api/v1/tarifas/comisiones': {
    summary: 'Obtener lista de comisiones configuradas',
    responses: Object.fromEntries([jsonResponse('200', 'Comisiones configuradas', 'GenericObjectArray')]),
  },
  'put /api/v1/admin/tarifas/comisiones': {
    summary: 'Actualizar porcentaje de comisión de un nivel (Admin/Root)',
    requestBody: jsonRequest('UpdateCommissionTierRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Comision actualizada', 'GenericObject')]),
  },
  'get /api/v1/tarifas/logisticas': {
    summary: 'Obtener lista de tarifas logísticas configuradas',
    responses: Object.fromEntries([jsonResponse('200', 'Tarifas logísticas configuradas', 'GenericObjectArray')]),
  },
  'post /api/v1/admin/tarifas/logisticas': {
    summary: 'Crear nueva tarifa logística (Admin/Root)',
    requestBody: jsonRequest('CreateLogisticsRateRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Tarifa creada exitosamente', 'GenericObject')]),
  },
  'put /api/v1/admin/tarifas/logisticas': {
    summary: 'Actualizar valor de tarifa logística (Admin/Root)',
    requestBody: jsonRequest('UpdateLogisticsRateRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Tarifa actualizada', 'GenericObject')]),
  },
  'post /api/v1/admin/exchange-rate': {
    summary: 'Actualizar el tipo de cambio del dólar (Admin/Root)',
    requestBody: jsonRequest('UpdateExchangeRateRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Tipo de cambio actualizado exitosamente', 'GenericObject')]),
  },
  'get /api/v1/admin/exchange-rate/history': {
    summary: 'Obtener historial de cambios del dólar (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Historial del tipo de cambio', 'GenericObjectArray')]),
  },
  'get /api/v1/billing/exchange-rate': {
    summary: 'Obtener el tipo de cambio activo actual del dólar',
    responses: Object.fromEntries([jsonResponse('200', 'Tipo de cambio actual', 'GenericObject')]),
  },
  'get /api/v1/cliente/cobros': {
    summary: 'Obtener cobros pendientes y facturados del cliente autenticado agrupados por carga',
    parameters: [
      { name: 'carga_id', in: 'query', required: false, schema: { type: 'integer' }, description: 'Opcional: filtrar cobros asociados a una carga específica' },
      { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 }, description: 'Opcional: número de página para paginación de cargas' },
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 6 }, description: 'Opcional: límite de cargas por página' }
    ],
    responses: Object.fromEntries([jsonResponse('200', 'Cobros del cliente agrupados y paginados por carga', 'ClienteCobrosGroupedResponse')]),
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
          example: {
            file: '(binary file)',
          },
        },
      },
    },
    responses: Object.fromEntries([jsonResponse('200', 'Comprobante subido, cobro en revisión', 'GenericObject')]),
  },
  'delete /api/v1/cliente/cobros/{id}/comprobante': {
    summary: 'Eliminar el comprobante de pago subido de un cobro (Cliente)',
    responses: Object.fromEntries([jsonResponse('200', 'Comprobante eliminado con éxito', 'GenericObject')]),
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
          example: {
            file: '(binary file)',
            note: 'Solicitud de retiro semanal',
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
  'post /api/v1/admin/cargas/{id}/close': {
    summary: 'Cerrar una carga específica, desactivar productos de vendedores asignados y generar cobros de comisión (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Carga cerrada con éxito', 'GenericObject')]),
  },
  'get /api/v1/admin/pedidos-transicion': {
    summary: 'Listar todas las solicitudes de transición de pedidos individuales de vendedores (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Lista de solicitudes', 'GenericObjectArray')]),
  },
  'post /api/v1/admin/pedidos-transicion/{id}/aprobar': {
    summary: 'Aprobar la transición de un pedido a la siguiente carga abierta (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Transición aprobada con éxito', 'GenericObject')]),
  },
  'post /api/v1/admin/pedidos-transicion/{id}/rechazar': {
    summary: 'Rechazar la transición de un pedido (Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Transición rechazada con éxito', 'GenericObject')]),
  },

  'get /api/v1/vendedor/pedidos-carga/status': {
    summary: 'Obtener el estado consolidado de la asignación y cargas del vendedor (Vendedor)',
    parameters: [
      { name: 'tipo_carga', in: 'query', required: false, schema: { type: 'string', enum: ['AEREA', 'MARITIMA'] }, description: 'Filtrar por tipo de transporte' }
    ],
    responses: Object.fromEntries([jsonResponse('200', 'Estado de carga consolidado del vendedor', 'GenericObject')]),
  },
  'post /api/v1/vendedor/pedidos/{id}/solicitar-transicion': {
    summary: 'Solicitar transición de un pedido individual a la siguiente carga abierta (Vendedor)',
    responses: Object.fromEntries([jsonResponse('201', 'Solicitud creada con éxito', 'GenericObject')]),
  },
  'get /api/v1/bodeguero/pedidos': {
    summary: 'Listar pedidos en cargas cerradas para la bodega (Bodeguero/Admin/Root)',
    parameters: [
      { name: 'clientId', in: 'query', required: false, schema: { type: 'integer' }, description: 'Filtrar por cliente' },
      { name: 'cargaId', in: 'query', required: false, schema: { type: 'integer' }, description: 'Filtrar por carga' },
    ],
    responses: Object.fromEntries([jsonResponse('200', 'Pedidos de bodega', 'GenericObjectArray')]),
  },
  'get /api/v1/bodeguero/cargas/{cargaId}/pedidos': {
    summary: 'Listar todos los pedidos asociados a una carga específica',
    responses: Object.fromEntries([jsonResponse('200', 'Pedidos de la carga', 'GenericObjectArray')]),
  },
  'get /api/v1/bodeguero/cargas/{id}/verificar-revision': {
    summary: 'Verificar si todos los pedidos de una carga han sido revisados',
    responses: Object.fromEntries([jsonResponse('200', 'Estado de revisión de la carga', 'GenericObject')]),
  },
  'get /api/v1/bodeguero/cargas/{cargaId}/armar-pedidos': {
    summary: 'Obtener información consolidada de pedidos para armar una carga específica',
    responses: Object.fromEntries([jsonResponse('200', 'Información de armado de pedidos', 'GenericObjectArray')]),
  },
  'get /api/v1/bodeguero/pedidos/{id}/auditoria': {
    summary: 'Consultar el historial de auditoría y transiciones de un pedido (Bodeguero/Admin/Root)',
    responses: Object.fromEntries([jsonResponse('200', 'Historial de auditoría', 'GenericObjectArray')]),
  },
  'get /api/v1/bodeguero/cargas/{id}/clientes-status': {
    summary: 'Obtener estado de pago de clientes en una carga (Bodeguero/Admin/Root)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Estado de pago de clientes en la carga', 'CargaClientesStatusResponse'),
    ]),
  },
  'post /api/v1/bodeguero/deliveries/{id}/auditar-empaque': {
    summary: 'Confirmar despacho físico e ingreso de bultos (Bodeguero/Admin/Root)',
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            '$ref': '#/components/schemas/ConfirmDespachoRequest',
          },
        },
      },
    },
    responses: Object.fromEntries([
      jsonResponse('200', 'Despacho confirmado con éxito', 'Delivery'),
    ]),
  },
  'post /api/v1/bodeguero/deliveries/{id}/ship': {
    summary: 'Confirmar salida física de la entrega (Bodeguero/Admin/Root)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Salida física de la entrega confirmada con éxito', 'Delivery'),
      jsonResponse('400', 'Validación estricta fallida (dirección o método de envío faltantes, o estado inválido)', 'ErrorResponse'),
    ]),
  },
  'post /api/v1/cliente/pagos/transbank/iniciar': {
    requestBody: jsonRequest('InitiateTransbankRequest'),
    responses: Object.fromEntries([jsonResponse('201', 'Pago iniciado', 'GenericObject')]),
  },
  'post /api/v1/cliente/pagos/transbank/confirmar': {
    requestBody: jsonRequest('ConfirmTransbankRequest'),
    responses: Object.fromEntries([jsonResponse('200', 'Pago confirmado', 'GenericObject')]),
  },
  'post /api/v1/chats/{id}/mensajes': {
    summary: 'Enviar un nuevo mensaje en el chat',
    requestBody: jsonRequest('CreateMessageRequest'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Mensaje enviado exitosamente', 'ChatMessage'),
    ]),
  },
  'post /api/v1/users/change-contact/request': {
    summary: 'Solicitar cambio de correo o teléfono de contacto',
    requestBody: jsonRequest('RequestContactChangeRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud creada, OTP enviado al nuevo destino', 'GenericObject'),
    ]),
  },
  'post /api/v1/users/change-contact/verify': {
    summary: 'Verificar código OTP y completar el cambio de contacto',
    requestBody: jsonRequest('VerifyContactChangeRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Contacto actualizado exitosamente', 'GenericObject'),
    ]),
  },
  'put /auth/api/v1/users/{userId}': {
    summary: 'Actualizar email o teléfono de un usuario desde VPC',
    requestBody: jsonRequest('UpdateUserRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Usuario actualizado correctamente', 'GenericObject'),
    ]),
  },
  'post /api/v1/soporte/tickets': {
    summary: 'Registrar un nuevo ticket de soporte por problemas en la plataforma (Usuario)',
    requestBody: jsonRequest('CreateSupportTicketRequest'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Ticket registrado exitosamente', 'SupportTicket'),
    ]),
  },
  'get /api/v1/soporte/tickets': {
    summary: 'Listar todos los tickets de soporte creados por el usuario en sesión',
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de tickets de soporte', 'SupportTicketArray'),
    ]),
  },
  'get /api/v1/soporte/tickets/{id}': {
    summary: 'Obtener detalle de un ticket de soporte específico (Usuario / Admin)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Detalle del ticket de soporte', 'SupportTicket'),
    ]),
  },
  'get /api/v1/admin/soporte/tickets': {
    summary: 'Listar todos los tickets de soporte del sistema con filtros y paginación (Admin / Root)',
    parameters: [
      { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'] }, description: 'Filtrar por estado' },
      { name: 'page', in: 'query', required: false, schema: { type: 'integer' }, description: 'Número de página' },
      { name: 'limit', in: 'query', required: false, schema: { type: 'integer' }, description: 'Cantidad por página' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Bandeja de tickets de soporte paginada', 'SupportTicketPaginated'),
    ]),
  },
  'put /api/v1/admin/soporte/tickets/{id}/resolucion': {
    summary: 'Resolver o rechazar un ticket de soporte ingresando la respuesta del administrador (Admin / Root)',
    requestBody: jsonRequest('ResolveSupportTicketRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Ticket de soporte resuelto con éxito', 'SupportTicket'),
    ]),
  },
  'get /api/v1/cliente/tickets': {
    summary: 'Listar y filtrar bandeja de tickets/solicitudes del cliente (Cliente)',
    parameters: [
      { name: 'type', in: 'query', required: false, schema: { type: 'string', enum: ['SUPPORT', 'RETURN_WARRANTY', 'BARTER_NEGOTIATION', 'REFUND_TRANSFER'] }, description: 'Filtrar por tipo de ticket. Si se omite, por defecto es SUPPORT' },
      { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'] }, description: 'Filtrar por estado' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Bandeja de tickets filtrada', 'TicketArray'),
    ]),
  },
  'post /api/v1/cliente/tickets/{id}/aceptar-trueque': {
    summary: 'Aceptar una propuesta de trueque enviada por el administrador (Cliente)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del ticket' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Propuesta de trueque aceptada y procesada con éxito', 'Ticket'),
    ]),
  },
  'post /api/v1/cliente/tickets/{id}/rechazar-trueque': {
    summary: 'Rechazar una propuesta de trueque enviada por el administrador (Cliente)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del ticket' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Propuesta de trueque rechazada y ajuste revertido con éxito', 'Ticket'),
    ]),
  },
  'get /api/v1/admin/tickets': {
    summary: 'Listar solicitudes unificadas de tickets dirigidas al administrador con filtros (Admin / Root)',
    parameters: [
      { name: 'type', in: 'query', required: false, schema: { type: 'string', enum: ['SUPPORT', 'RETURN_WARRANTY', 'BARTER_NEGOTIATION', 'REFUND_TRANSFER'] }, description: 'Filtrar por tipo de ticket' },
      { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'] }, description: 'Filtrar por estado' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Bandeja de solicitudes filtrada', 'TicketArray'),
    ]),
  },
  'post /api/v1/admin/tickets/{id}/proponer-trueque': {
    summary: 'Enviar una propuesta formal de trueque con producto y cantidad al cliente (Admin / Root)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del ticket' },
    ],
    requestBody: jsonRequest('ProponerTruequeRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Propuesta de trueque registrada y enviada al cliente con éxito', 'Ticket'),
    ]),
  },
  'post /api/v1/admin/tickets/{id}/cancelar-trueque': {
    summary: 'Cancelar la negociación del trueque y revertir el ajuste (Admin / Root)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID del ticket' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Trueque cancelado y negociación cerrada con éxito', 'Ticket'),
    ]),
  },
  'put /api/v1/admin/cargas/{id}/llegada': {
    summary: 'Registrar la fecha de llegada de una carga en destino (Admin/Root)',
    requestBody: jsonRequest('UpdateCargaLlegadaRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Llegada de carga registrada con éxito', 'GenericObject'),
    ]),
  },
  'post /api/v1/admin/deliveries/{id}/confirmar-entrega': {
    summary: 'Confirmar entrega de un paquete a un cliente con comprobante (Admin/Root)',
    requestBody: jsonRequest('ConfirmDeliveryRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Entrega confirmada con éxito', 'GenericObject'),
    ]),
  },
  'post /api/v1/admin/devoluciones/{id}/resolver': {
    summary: 'Resolver una solicitud de devolución aprobándola o rechazándola (Admin/Root)',
    requestBody: jsonRequest('ResolveReturnRequestRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud de devolución resuelta con éxito', 'GenericObject'),
    ]),
  },
  'get /api/v1/admin/deliveries': {
    summary: 'Listar todas las entregas/despachos en el sistema (Admin/Root)',
    parameters: [
      { name: 'cargaId', in: 'query', required: false, schema: { type: 'integer' }, description: 'Filtrar por carga' },
      { name: 'clientId', in: 'query', required: false, schema: { type: 'integer' }, description: 'Filtrar por cliente' },
      { name: 'status', in: 'query', required: false, schema: { type: 'string' }, description: 'Filtrar por estado de entrega' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de entregas del sistema', 'DeliveryArray'),
    ]),
  },
  'get /api/v1/admin/devoluciones': {
    summary: 'Listar todas las solicitudes de devolución en el sistema (Admin/Root)',
    parameters: [
      { name: 'status', in: 'query', required: false, schema: { type: 'string' }, description: 'Filtrar por estado de devolución' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de devoluciones del sistema', 'ReturnRequestArray'),
    ]),
  },
  'post /api/v1/cliente/deliveries/{id}/confirmar-entrega': {
    summary: 'Confirmar recepción conforme de una entrega por parte del cliente (Cliente)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Entrega confirmada por el cliente', 'GenericObject'),
    ]),
  },
  'post /api/v1/cliente/deliveries/{id}/solicitar-envio': {
    summary: 'Solicitar envío a domicilio para una entrega lista (Cliente)',
    requestBody: jsonRequest('RequestDeliveryShippingRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Solicitud de despacho registrada', 'GenericObject'),
    ]),
  },
  'post /api/v1/cliente/devoluciones': {
    summary: 'Crear una solicitud de devolución para un producto entregado (Cliente)',
    requestBody: jsonRequest('CreateReturnRequestRequest'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Solicitud de devolución creada con éxito', 'ReturnRequest'),
    ]),
  },
  'get /api/v1/cliente/deliveries': {
    summary: 'Listar entregas/despachos del cliente autenticado (Cliente)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de entregas del cliente', 'DeliveryArray'),
    ]),
  },
  'get /api/v1/cliente/devoluciones': {
    summary: 'Listar solicitudes de devolución del cliente autenticado (Cliente)',
    parameters: [
      { name: 'status', in: 'query', required: false, schema: { type: 'string' }, description: 'Filtrar por estado de devolución' },
    ],
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de devoluciones del cliente', 'ReturnRequestArray'),
    ]),
  },
  'get /api/v1/users/me': {
    summary: 'Obtener el perfil del usuario autenticado (Común)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Perfil del usuario obtenido con éxito', 'UserProfile'),
    ]),
  },
  'put /api/v1/users/me': {
    summary: 'Actualizar el perfil del usuario autenticado (Común)',
    requestBody: jsonRequest('UpdateProfileRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Perfil del usuario actualizado con éxito', 'UserProfile'),
    ]),
  },
  'put /api/v1/users/me/notificaciones': {
    summary: 'Actualizar preferencias de notificaciones del usuario (Común)',
    requestBody: jsonRequest('UpdateNotificationsRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Preferencias de notificaciones actualizadas con éxito', 'UserProfile'),
    ]),
  },
  'post /api/v1/users/me/revocar-consentimiento': {
    summary: 'Revocar consentimiento de notificaciones del usuario (Común)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Consentimiento revocado con éxito', 'GenericMessage'),
    ]),
  },
  'get /api/v1/cliente/direcciones': {
    summary: 'Listar direcciones del cliente autenticado (Cliente)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Listado de direcciones obtenido con éxito', 'UserAddressArray'),
    ]),
  },
  'post /api/v1/cliente/direcciones': {
    summary: 'Crear una nueva dirección para el cliente (Cliente)',
    requestBody: jsonRequest('CreateAddressRequest'),
    responses: Object.fromEntries([
      jsonResponse('201', 'Dirección creada con éxito', 'UserAddress'),
    ]),
  },
  'put /api/v1/cliente/direcciones/{id}': {
    summary: 'Actualizar una dirección existente del cliente (Cliente)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID de la dirección' },
    ],
    requestBody: jsonRequest('UpdateAddressRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Dirección actualizada con éxito', 'UserAddress'),
    ]),
  },
  'delete /api/v1/cliente/direcciones/{id}': {
    summary: 'Eliminar una dirección del cliente (Cliente)',
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID de la dirección' },
    ],
    responses: Object.fromEntries([
      noContentResponse('204', 'Dirección eliminada con éxito'),
    ]),
  },
  'get /api/v1/cliente/facturacion': {
    summary: 'Obtener datos de facturación del cliente (Cliente)',
    responses: Object.fromEntries([
      jsonResponse('200', 'Datos de facturación obtenidos con éxito', 'UserBilling'),
    ]),
  },
  'put /api/v1/cliente/facturacion': {
    summary: 'Actualizar datos de facturación del cliente (Cliente)',
    requestBody: jsonRequest('UpdateBillingRequest'),
    responses: Object.fromEntries([
      jsonResponse('200', 'Datos de facturación actualizados con éxito', 'UserBilling'),
    ]),
  },
}

export function createDefaultOperation(route) {
  const pathParams = [...route.path.matchAll(/\{([^}]+)\}/g)].map(match => ({
    name: match[1],
    in: 'path',
    required: true,
    schema: { type: 'string' },
  }))
  const routeParameters = Array.isArray(route.parameters) ? route.parameters : []

  return {
    tags: route.tags.length > 0 ? route.tags : [route.tag],
    operationId: route.operationId,
    summary: route.summary || route.methodName || `${route.method.toUpperCase()} ${route.path}`,
    parameters: [...pathParams, ...routeParameters],
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
    ...(route.security === 'cookieAccessAuth'
      ? { security: [{ cookieAccessAuth: [] }, { bearerAuth: [] }] }
      : route.security === 'cookieRefreshAuth'
      ? { security: [{ cookieRefreshAuth: [] }] }
      : route.security === 'bearerAuth' || route.security === true
      ? { security: [{ bearerAuth: [] }] }
      : {}),
  }
}
