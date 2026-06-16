import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractLambdaRoutes, extractNestRoutes } from './lib/route-extractor.mjs'
import {
  createDefaultOperation,
  info,
  operationOverrides,
  schemas,
  securitySchemes,
  servers,
  tags,
} from './lib/spec-config.mjs'
import { generateTypeDeclarations } from './lib/typegen.mjs'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(currentDir, '..', '..')
const docsRoot = path.resolve(currentDir, '..')
const generatedDir = path.join(docsRoot, 'generated')
const docsDir = path.join(docsRoot, 'docs')
const sourceRoutesPath = path.join(generatedDir, 'source-routes.json')

function hasSourceRepos() {
  return ['Importal-auth', 'Importal-backend', 'Importal-registration-lambda'].every(serviceRoot =>
    fs.existsSync(path.join(repoRoot, serviceRoot, 'src')),
  )
}

function loadSourceRoutes() {
  if (hasSourceRepos()) {
    const routes = enrichRoutes([
      ...extractNestRoutes({
        repoRoot,
        serviceRoot: 'Importal-auth',
        serviceName: 'auth',
        prefix: '/auth/api',
      }),
      ...extractNestRoutes({
        repoRoot,
        serviceRoot: 'Importal-backend',
        serviceName: 'backend',
        prefix: '/api',
      }),
      ...extractLambdaRoutes({
        repoRoot,
        serviceRoot: 'Importal-registration-lambda',
      }),
    ])

    if (!routes.some(route => route.path === '/api/v1/vendedor/pedidos-carga/status' && route.method === 'get')) {
      routes.push(
        ...enrichRoutes([
          {
            service: 'backend',
            source: 'Importal-backend/src/modules/orders/controllers/orders.controller.ts',
            method: 'get',
            path: '/api/v1/vendedor/pedidos-carga/status',
            operationId: 'backend_get_api_v1_vendedor_pedidos_carga_status',
            tag: 'Orders',
            tags: ['Orders'],
            summary: 'Consultar estado de pedidos de carga del vendedor',
            roles: ['vendor'],
            security: true,
            methodName: 'getVendorCargaStatus',
            parameters: [
              {
                name: 'tipo_carga',
                in: 'query',
                required: false,
                description: 'Opcional: AEREA o MARITIMA',
                schema: {
                  type: 'string',
                  enum: ['AEREA', 'MARITIMA'],
                },
              },
            ],
          },
        ]),
      )
    }

    for (const route of routes) {
      if (route.service === 'backend' && route.path === '/api/v1/vendedor/pedidos-carga/status' && route.method === 'get') {
        route.parameters = [
          {
            name: 'tipo_carga',
            in: 'query',
            required: false,
            description: 'Opcional: AEREA o MARITIMA',
            schema: {
              type: 'string',
              enum: ['AEREA', 'MARITIMA'],
            },
          },
        ]
      }
    }

    // Targeted expansion: if billing route uses GetCobrosQueryDto, ensure parameters are expanded
    for (const r of routes) {
      if (r.service === 'backend' && r.path === '/api/v1/admin/cobros' && r.method === 'get') {
        const dtoFile = path.join(repoRoot, 'Importal-backend', 'src', 'modules', 'billing', 'dto', 'billing.dto.ts')
        const params = parseDtoParameters(dtoFile, 'GetCobrosQueryDto')
        if (params.length > 0) {
          r.parameters = params
        }
      }
    }

    return routes
  }

  if (!fs.existsSync(sourceRoutesPath)) {
    throw new Error(
      'No se encontraron repos fuente y falta generated/source-routes.json. Ejecuta el build en un entorno con los monorepos o commitea el inventario generado.',
    )
  }

  return JSON.parse(fs.readFileSync(sourceRoutesPath, 'utf8'))
}

function parseDtoParameters(dtoFile, dtoName) {
  if (!fs.existsSync(dtoFile)) return []
  const src = fs.readFileSync(dtoFile, 'utf8')
  const classMatch = src.match(new RegExp(`export\\s+class\\s+${dtoName}\\s*{([\\s\\S]*?)\\n}\\s*(?:export\\s+class|$)`))
  if (!classMatch) return []
  const body = classMatch[1]
  const params = []
  for (const match of body.matchAll(/((?:^\s*@.*\n)+)\s*([A-Za-z_][A-Za-z0-9_]*)(\?)?\s*:\s*([^=;\n]+)(?:\s*=\s*[^;\n]+)?/gm)) {
    const decoratorBlock = match[1]
    const name = match[2]
    const optional = Boolean(match[3]) || /@IsOptional\(/.test(decoratorBlock)
    const declaredType = match[4].trim()
    const decorators = decoratorBlock.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    const schema = { type: 'string' }
    if (/@IsIn\(/.test(decoratorBlock)) {
      const enumMatch = decoratorBlock.match(/@IsIn\(\s*\[([\s\S]*?)\]\s*\)/)
      if (enumMatch) schema.enum = [...enumMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1])
    }
    if (/@Type\(\(\)\s*=>\s*Number\)/.test(decoratorBlock) || /@IsInt\(/.test(decoratorBlock) || /@Min\(/.test(decoratorBlock)) {
      schema.type = 'integer'
    }
    if (/@IsNumber\(/.test(decoratorBlock)) schema.type = 'number'
    if (/@IsBoolean\(/.test(decoratorBlock)) schema.type = 'boolean'

    params.push({ name, in: 'query', required: !optional, schema })
  }
  return params
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function sortObjectKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, sortObjectKeys(value[key])]),
    )
  }
  return value
}

function yamlScalar(value) {
  if (value === null) return 'null'
  if (typeof value === 'string') {
    if (value === '' || /[:#\-\n{}[\],&*!?|<>=@`]/.test(value)) {
      return JSON.stringify(value)
    }
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

function toYaml(value, level = 0) {
  const padding = '  '.repeat(level)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return value
      .map(item => {
        if (item && typeof item === 'object') {
          const nested = toYaml(item, level + 1)
          return `${padding}- ${nested.startsWith('\n') ? nested.trimStart() : nested.replace(/^/, '')}`
        }
        return `${padding}- ${yamlScalar(item)}`
      })
      .join('\n')
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    return entries
      .map(([key, item]) => {
        if (item && typeof item === 'object') {
          const nested = toYaml(item, level + 1)
          return `${padding}${key}:\n${nested}`
        }
        return `${padding}${key}: ${yamlScalar(item)}`
      })
      .join('\n')
  }

  return `${padding}${yamlScalar(value)}`
}

function buildPaths(routes) {
  const paths = {}
  const seen = new Set()
  const duplicates = []

  for (const route of routes) {
    const key = `${route.method} ${route.path}`
    if (seen.has(key)) {
      duplicates.push(route)
      continue
    }
    seen.add(key)

    const override = operationOverrides[key]
    const operation = {
      ...createDefaultOperation(route),
      ...(override || {}),
    }

    if (!paths[route.path]) {
      paths[route.path] = {}
    }
    paths[route.path][route.method] = operation
  }

  return { paths, duplicates }
}

function inferRoleGroup(route) {
  if (route.service !== 'backend') {
    return route.security ? 'interno' : 'publico'
  }

  const normalizedPath = route.path.toLowerCase()

  if (normalizedPath.includes('/admin/')) return 'admin'
  if (normalizedPath.includes('/cliente/')) return 'cliente'
  if (normalizedPath.includes('/vendedor/')) return 'vendedor'
  if (normalizedPath.includes('/bodeguero/')) return 'bodeguero'
  if (route.roles.includes('root') && route.roles.length === 1) return 'root'
  if (route.roles.length === 0) return 'comun'
  return 'comun'
}

function enrichRoutes(routes) {
  return routes.map(route => ({
    ...route,
    roleGroup: inferRoleGroup(route),
  }))
}

function createHtml(spec) {
  const flows = [
    {
      id: 'flujo-registro',
      title: 'Flujo de Registro de Usuario',
      description: 'Proceso completo para registrar un nuevo usuario en Importal: desde la solicitud inicial (con normalización de roles y carga de documentos), verificación por email y teléfono, hasta la aprobación administrativa.',
      steps: [
        {
          step: 1,
          actor: 'Usuario',
          label: 'Crear Solicitud de Registro',
          method: 'POST',
          path: '/registration-requests',
          service: 'registration-lambda',
          detail: 'El usuario envía sus datos básicos. Para el perfil "inversor" se requiere dirección de despacho, transportType (maritimo/aereo) y comprobante en base64. Para "cliente_antiguo" se requieren los mismos datos pero sin comprobante. Los tipos "cliente", "vendedor", "bedeguero" se normalizan en la lambda.',
          body: JSON.stringify({ email: 'usuario@ejemplo.com', name: 'Juan Pérez', rut: '12.345.678-9', phone: '+56912345678', password: 'Password123!', profileType: 'inversor', consentimiento: true, housingType: 'casa', streetAndNumber: 'Av. Ejemplo 123', region: 'Región Metropolitana', comuna: 'Providencia', agency: 'FlowEx', transportType: ['aerea'], comprobante: '<base64>', comprobanteFileName: 'comprobante.pdf', comprobanteContentType: 'application/pdf' }, null, 2),
          response: '201 Created — Solicitud guardada en DynamoDB con status: PENDING y OTP pendientes',
        },
        {
          step: 2,
          actor: 'Usuario',
          label: 'Solicitar Códigos OTP',
          method: 'POST',
          path: '/registration-requests/{email}/send-code',
          service: 'registration-lambda',
          detail: 'Genera códigos OTP y los envía vía SQS a notificaciones. Al pasar channel: "both", se despachan códigos a email y teléfono simultáneamente.',
          body: JSON.stringify({ channel: 'both' }, null, 2),
          response: '200 OK — { message: "OTP generated", channels: ["email", "phone"] }',
        },
        {
          step: 3,
          actor: 'Usuario',
          label: 'Verificar Canal (Email/Teléfono)',
          method: 'POST',
          path: '/registration-requests/{email}/verify',
          service: 'registration-lambda',
          detail: 'El usuario valida cada canal ingresando el código OTP. Cuando ambos canales están validados, se marca is_verified = true en DynamoDB.',
          body: JSON.stringify({ code: '123456', channel: 'email' }, null, 2),
          response: '200 OK — { is_email_verified: true, is_phone_verified: false, is_verified: false }',
        },
        {
          step: 4,
          actor: 'Usuario',
          label: 'Actualizar Contacto (Opcional)',
          method: 'PUT',
          path: '/registration-requests/{email}/update-contact',
          service: 'registration-lambda',
          detail: 'Si el correo o teléfono es incorrecto, se puede actualizar el contacto siempre que la solicitud esté PENDING.',
          body: JSON.stringify({ email: 'nuevo_usuario@ejemplo.com', phone: '+56987654321' }, null, 2),
          response: '200 OK — Contacto actualizado exitosamente',
        },
        {
          step: 5,
          actor: 'Administrador',
          label: 'Aprobar Solicitud (Admin)',
          method: 'POST',
          path: '/api/v1/registration-requests/{email}/approve',
          service: 'backend',
          detail: 'El administrador aprueba la solicitud. El backend valida el estado y OTPs, crea el usuario en Importal-auth, persiste el perfil y direcciones en PostgreSQL, y marca APPROVED en DynamoDB.',
          body: JSON.stringify({ reviewedBy: 'Administrador', role: 'client', notes: 'Papeles al día' }, null, 2),
          response: '201 Created — { request: { status: "APPROVED" }, user: { userId: "uuid" } }',
          requiresAuth: true,
          roles: ['admin', 'root'],
        },
        {
          step: 6,
          actor: 'Usuario',
          label: 'Login con credenciales',
          method: 'POST',
          path: '/auth/api/v1/auth/login',
          service: 'auth',
          detail: 'El usuario ahora puede iniciar sesión para obtener su par de tokens JWT (accessToken y refreshToken).',
          body: JSON.stringify({ email: 'usuario@ejemplo.com', password: 'Password123!' }, null, 2),
          response: '200 OK — { accessToken: "eyJ...", refreshToken: "eyJ..." }',
        },
      ],
    },
    {
      id: 'flujo-ingreso-bodeguero',
      title: 'Flujo de Registro — Perfil Bodeguero',
      description: 'Proceso simplificado para registrar un bodeguero. Solo requiere los campos base (sin dirección ni comprobante).',
      steps: [
        {
          step: 1, actor: 'Usuario', label: 'Crear Solicitud (bodeguero)', method: 'POST',
          path: '/registration-requests', service: 'registration-lambda',
          detail: 'El bodeguero solo requiere los campos base. La bodega asignada es fija y la asigna automáticamente el sistema al aprobar.',
          body: JSON.stringify({ email: 'bodeguero@ejemplo.com', name: 'Pedro Bodega', rut: '12.345.678-9', phone: '+56912345678', password: 'Password123!', profileType: 'bodeguero', consentimiento: true }, null, 2),
          response: '201 Created',
        },
        { step: 2, actor: 'Usuario', label: 'Enviar OTP a ambos canales', method: 'POST', path: '/registration-requests/{email}/send-code', service: 'registration-lambda', detail: 'Idéntico al flujo general.', body: JSON.stringify({ channel: 'both' }, null, 2), response: '200 OK' },
        { step: 3, actor: 'Usuario', label: 'Verificar email y teléfono', method: 'POST', path: '/registration-requests/{email}/verify', service: 'registration-lambda', detail: 'Repetir para channel: email y channel: phone.', body: JSON.stringify({ code: 'XXXXXX', channel: 'email' }, null, 2), response: '200 OK — is_verified: true' },
        { step: 4, actor: 'Administrador', label: 'Aprobar Solicitud', method: 'POST', path: '/api/v1/registration-requests/{email}/approve', service: 'backend', detail: 'Al aprobar, el bodeguero recibe bodega_asignada = "Av. Porvenir 1285, Casa 98, Lampa" automáticamente.', body: JSON.stringify({ reviewedBy: 'Admin', role: 'client' }, null, 2), response: '201 Created', requiresAuth: true, roles: ['admin', 'root'] },
      ],
    },
    {
      id: 'flujo-login',
      title: 'Flujo de Autenticación y Refresh de Token',
      description: 'Cómo autenticarse, validar el token y renovarlo cuando expira.',
      steps: [
        { step: 1, actor: 'Cliente', label: 'Login', method: 'POST', path: '/auth/api/v1/auth/login', service: 'auth', detail: 'Enviar credenciales. El accessToken expira en 1h; el refreshToken en 7d.', body: JSON.stringify({ email: 'usuario@ejemplo.com', password: 'Password123!' }, null, 2), response: '200 OK — { accessToken, refreshToken }' },
        { step: 2, actor: 'Cliente', label: 'Validar Token (opcional)', method: 'GET', path: '/auth/api/v1/auth/validate', service: 'auth', detail: 'Endpoint usado por el API Gateway para verificar JWT entrantes. Incluir header: Authorization: Bearer <token>.', response: '200 OK — { valid: true }', requiresAuth: true },
        { step: 3, actor: 'Cliente', label: 'Refresh de Token', method: 'POST', path: '/auth/api/v1/auth/refresh', service: 'auth', detail: 'Cuando el accessToken expira, usar el refreshToken para obtener un nuevo par de tokens sin re-autenticarse.', body: JSON.stringify({ refreshToken: 'eyJ...' }, null, 2), response: '200 OK — { accessToken, refreshToken }' },
        { step: 4, actor: 'Cliente', label: 'Logout', method: 'POST', path: '/auth/api/v1/auth/logout', service: 'auth', detail: 'Invalida el refreshToken en servidor. El accessToken queda activo hasta que expira por TTL.', requiresAuth: true, response: '200 OK' },
      ],
    },
    {
      id: 'flujo-pedido-stock',
      title: 'Flujo de Pedido con Reserva y Confirmación de Stock',
      description: 'Gestión de ciclo de vida del pedido: el cliente reserva stock de inmediato al crear el pedido, el vendedor confirma y despacha, y se libera la reserva de stock si la orden es rechazada o cancelada.',
      steps: [
        {
          step: 1,
          actor: 'Cliente',
          label: 'Ver Catálogo y Stock Disponible',
          method: 'GET',
          path: '/api/v1/cliente/productos',
          service: 'backend',
          detail: 'Obtiene los productos activos disponibles en el sistema con su stock real disponible.',
          requiresAuth: true,
          roles: ['client'],
          response: '200 OK — Listado de productos',
        },
        {
          step: 2,
          actor: 'Cliente',
          label: 'Crear Pedido (Reserva Inmediata)',
          method: 'POST',
          path: '/api/v1/cliente/pedidos',
          service: 'backend',
          detail: 'El cliente crea un pedido especificando producto, talla y cantidad. El backend reserva de inmediato la cantidad del stock del producto en la base de datos.',
          body: JSON.stringify({ productId: 12, quantity: 5, talla: 'L', cargaId: 4 }, null, 2),
          requiresAuth: true,
          roles: ['client'],
          response: '201 Created — { orderId: 88, status: "PENDING" }',
        },
        {
          step: 3,
          actor: 'Vendedor',
          label: 'Consultar Pedidos Recibidos',
          method: 'GET',
          path: '/api/v1/vendedor/pedidos',
          service: 'backend',
          detail: 'El vendedor consulta su lista de pedidos pendientes para procesar su despacho.',
          requiresAuth: true,
          roles: ['vendor'],
          response: '200 OK — Array de pedidos',
        },
        {
          step: 4,
          actor: 'Vendedor',
          label: 'Confirmar Pedido (Descuento Stock)',
          method: 'POST',
          path: '/api/v1/vendedor/pedidos/{id}/confirmar',
          service: 'backend',
          detail: 'El vendedor confirma que tiene la mercadería lista. Esto consolida el descuento del stock reservado y pasa el pedido a CONFIRMED.',
          requiresAuth: true,
          roles: ['vendor'],
          response: '200 OK — { id: 88, status: "CONFIRMED" }',
        },
        {
          step: 5,
          actor: 'Vendedor',
          label: 'Rechazar / Cancelar Pedido (Retorno Stock)',
          method: 'PUT',
          path: '/api/v1/vendedor/pedidos/{id}/estado',
          service: 'backend',
          detail: 'Si por alguna razón el pedido se cancela o rechaza, el backend automáticamente revierte la reserva y devuelve el stock al catálogo del producto.',
          body: JSON.stringify({ status: 'REJECTED' }, null, 2),
          requiresAuth: true,
          roles: ['vendor', 'admin', 'root'],
          response: '200 OK — { status: "REJECTED" } y stock devuelto',
        },
      ],
    },
    {
      id: 'flujo-billing-moras',
      title: 'Flujo de Facturación, Carga de Pagos y Moras',
      description: 'Ciclo financiero periódico de cobros: el administrador gatilla facturación, consulta la API mindicador para conversiones USD/CLP, gestiona moras con intereses, el cliente sube comprobante, y el administrador aprueba/rechaza.',
      steps: [
        {
          step: 1,
          actor: 'Administrador',
          label: 'Gatillar Facturación y Moras',
          method: 'POST',
          path: '/api/v1/admin/cobros/trigger',
          service: 'backend',
          detail: 'Procesa cobros acumulados, consulta tarifas de comisiones y logística, convierte valores de USD a CLP usando la API de mindicador, y a la vez identifica cobros OVERDUE para aplicar recargos por mora e intereses.',
          requiresAuth: true,
          roles: ['admin', 'root'],
          response: '200 OK — { ok: true, message: "Procesamiento completado." }',
        },
        {
          step: 2,
          actor: 'Cliente',
          label: 'Listar Cobros Pendientes',
          method: 'GET',
          path: '/api/v1/cliente/cobros',
          service: 'backend',
          detail: 'El cliente ve el detalle de sus facturas vigentes, fechas de vencimiento y montos cobrados en CLP.',
          requiresAuth: true,
          roles: ['client'],
          response: '200 OK — Array de cobros pendientes',
        },
        {
          step: 3,
          actor: 'Cliente',
          label: 'Descargar PDF de Cobro',
          method: 'GET',
          path: '/api/v1/cliente/cobros/{id}/pdf',
          service: 'backend',
          detail: 'Descarga un archivo PDF firmado con el detalle e ítemes cobrados en el período.',
          requiresAuth: true,
          roles: ['client', 'admin', 'root'],
          response: '200 OK — Archivo PDF en base64',
        },
        {
          step: 4,
          actor: 'Cliente',
          label: 'Subir Comprobante de Pago',
          method: 'POST',
          path: '/api/v1/cliente/cobros/{id}/pagar',
          service: 'backend',
          detail: 'El cliente realiza transferencia bancaria y sube el comprobante (formato PDF o imagen). El estado del cobro pasa a IN_REVIEW.',
          body: '[Archivo binario en Multipart/Form-Data]',
          requiresAuth: true,
          roles: ['client'],
          response: '200 OK — Comprobante en revisión',
        },
        {
          step: 5,
          actor: 'Administrador',
          label: 'Confirmar / Conciliar Pago',
          method: 'POST',
          path: '/api/v1/admin/cobros/{id}/confirmar',
          service: 'backend',
          detail: 'El administrador valida el comprobante contra su banco. Si está correcto, aprueba el cobro, pasando su estado a PAID y liberando los despachos asociados.',
          body: JSON.stringify({ approved: true, admin_comment: 'Comprobante verificado en cuenta corriente.' }, null, 2),
          requiresAuth: true,
          roles: ['admin', 'root'],
          response: '200 OK — Cobro marcado como PAID',
        },
      ],
    },
    {
      id: 'flujo-logistica-transito',
      title: 'Flujo de Logística: Solicitudes de Tránsito y Salida Anticipada',
      description: 'Proceso de despacho consolidado en cargas (aéreas o marítimas) por parte del vendedor, incluyendo aprobación de tránsito, cierres temporales, salida anticipada y reasignación de órdenes post-cierre.',
      steps: [
        {
          step: 1,
          actor: 'Vendedor',
          label: 'Crear Solicitud de Tránsito de Carga',
          method: 'POST',
          path: '/api/v1/vendedor/solicitudes-carga',
          service: 'backend',
          detail: 'El vendedor informa que tiene mercadería lista para embarque (AEREA o MARITIMA) para que la administración del sistema le asigne transporte.',
          body: JSON.stringify({ tipo_carga: 'AEREA' }, null, 2),
          requiresAuth: true,
          roles: ['vendor'],
          response: '201 Created — Solicitud de tránsito registrada',
        },
        {
          step: 2,
          actor: 'Administrador',
          label: 'Aprobar Tránsito y Asignar Carga',
          method: 'POST',
          path: '/api/v1/admin/solicitudes-carga/{id}/aprobar',
          service: 'backend',
          detail: 'El administrador revisa el volumen y tipo, aprueba la solicitud de tránsito, lo que la asocia a una Carga consolidadora oficial del sistema.',
          requiresAuth: true,
          roles: ['admin', 'root'],
          response: '200 OK — Solicitud de tránsito aprobada',
        },
        {
          step: 3,
          actor: 'Vendedor',
          label: 'Salida Anticipada o Cierre de Ventana',
          method: 'POST',
          path: '/api/v1/vendedor/cargas/transicion-cierre',
          service: 'backend',
          detail: 'El vendedor puede forzar un despacho anticipado de su carga antes del cierre automático de la ventana temporal. El sistema reasigna automáticamente a la siguiente carga disponible los pedidos que quedaron fuera.',
          body: JSON.stringify({ tipo_carga: 'AEREA' }, null, 2),
          requiresAuth: true,
          roles: ['vendor'],
          response: '200 OK — Transición de cierre procesada',
        },
        {
          step: 4,
          actor: 'Bodeguero',
          label: 'Actualizar Estado de la Carga en Destino',
          method: 'PUT',
          path: '/api/v1/bodeguero/cargas/{id}/status',
          service: 'backend',
          detail: 'Al arribar la carga, el bodeguero actualiza su estado (por ejemplo, a ARRIVED o RECEIVED), gatillando notificaciones de seguimiento al cliente.',
          body: JSON.stringify({ status: 'ARRIVED', notes: 'Llegada exitosa en bodega Santiago.' }, null, 2),
          requiresAuth: true,
          roles: ['bodeguero', 'admin', 'root'],
          response: '200 OK — Estado de carga actualizado',
        },
        {
          step: 5,
          actor: 'Bodeguero',
          label: 'Consultar Historial de Auditoría del Pedido',
          method: 'GET',
          path: '/api/v1/bodeguero/pedidos/{id}/auditoria',
          service: 'backend',
          detail: 'El bodeguero o administrador puede consultar la bitácora completa de cambios de estado y tracking del pedido para auditoría.',
          requiresAuth: true,
          roles: ['bodeguero', 'admin', 'root'],
          response: '200 OK — Historial de transiciones de estado',
        },
      ],
    },
  ]

  const serviceColors = {
    auth: '#7c3aed',
    backend: '#0369a1',
    'registration-lambda': '#b45309',
  }
  const actorColors = {
    'Usuario': '#059669',
    'Cliente': '#0891b2',
    'Vendedor': '#7c3aed',
    'Bodeguero': '#b45309',
    'Administrador': '#dc2626',
  }
  const methodColors = {
    get: '#16a34a', post: '#0284c7', put: '#d97706', patch: '#7c3aed', delete: '#dc2626',
  }

  function renderFlowSteps(steps) {
    return steps.map((s, idx) => `
      <div class="flow-step">
        <div class="flow-step-number">${s.step}</div>
        <div class="flow-step-body">
          <div class="flow-step-header">
            <span class="actor-badge" style="background:${actorColors[s.actor] || '#6b7280'}20;color:${actorColors[s.actor] || '#6b7280'}">${s.actor}</span>
            <span class="method-badge" style="background:${methodColors[s.method.toLowerCase()] || '#6b7280'}15;color:${methodColors[s.method.toLowerCase()] || '#6b7280'}">${s.method.toUpperCase()}</span>
            <code class="flow-path">${s.path}</code>
            <span class="service-tag" style="background:${serviceColors[s.service] || '#6b7280'}15;color:${serviceColors[s.service] || '#6b7280'}">${s.service}</span>
            ${s.requiresAuth ? '<span class="auth-badge">🔐 JWT</span>' : '<span class="public-badge">🌐 Público</span>'}
          </div>
          <p class="flow-detail">${s.detail}</p>
          ${s.body ? `<details class="flow-details"><summary>Ver body de ejemplo</summary><pre>${s.body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></details>` : ''}
          <div class="flow-response">← ${s.response}</div>
        </div>
      </div>
    `).join('')
  }

  function renderFlows(flows) {
    return flows.map(flow => `
      <div class="flow-card" id="${flow.id}">
        <div class="flow-card-header">
          <h3>${flow.title}</h3>
          <p>${flow.description}</p>
        </div>
        <div class="flow-steps">
          ${renderFlowSteps(flow.steps)}
        </div>
      </div>
    `).join('')
  }

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${spec.info.title}</title>
  <style>
    :root {
      --bg: #f5f1e8;
      --card: #fffdf8;
      --ink: #1f2937;
      --muted: #6b7280;
      --line: #d7c9ad;
      --accent: #8c3d1f;
      --accent-soft: #ead7c8;
      --code: #f3eadf;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, #fff7e8 0, transparent 28%),
        linear-gradient(180deg, #efe5d6 0, var(--bg) 28%, #f8f5ef 100%);
    }
    .wrap { max-width: 1200px; margin: 0 auto; padding: 40px 20px 80px; }
    .hero { margin-bottom: 28px; }
    h1 { font-size: 40px; margin: 0 0 10px; }
    p { margin: 0; color: var(--muted); line-height: 1.6; }
    .topbar { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px; align-items: center; }
    input {
      flex: 1 1 280px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line);
      background: var(--card); font: inherit;
    }
    select {
      min-width: 240px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line);
      background: var(--card); font: inherit; color: var(--ink);
    }
    .tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .tab {
      padding: 10px 22px; border-radius: 999px; border: 1.5px solid var(--line);
      background: var(--card); color: var(--ink); cursor: pointer; font: inherit;
      font-size: 15px; transition: all .15s;
    }
    .tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .tab:hover:not(.active) { background: var(--accent-soft); }
    .badge {
      display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 999px;
      background: var(--accent-soft); color: var(--accent); font-size: 12px; letter-spacing: .04em; text-transform: uppercase;
    }
    .section { margin-top: 28px; }
    .service-block {
      margin-top: 32px; padding: 18px; border: 1px solid var(--line); border-radius: 22px;
      background: rgba(255, 253, 248, .68); backdrop-filter: blur(6px);
    }
    .service-title { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .service-title h2, .role-title h3 { margin: 0; }
    .service-title h2 { font-size: 26px; }
    .role-block { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--line); }
    .role-block:first-of-type { margin-top: 0; padding-top: 0; border-top: 0; }
    .role-title { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .endpoint {
      background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px; margin-bottom: 14px;
      box-shadow: 0 10px 30px rgba(74, 54, 36, .06);
    }
    .endpoint header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
    .method { font-weight: 700; min-width: 68px; }
    .path { font-family: Consolas, monospace; background: var(--code); padding: 4px 8px; border-radius: 8px; }
    .meta { color: var(--muted); font-size: 14px; }
    details { margin-top: 10px; }
    summary { cursor: pointer; color: var(--accent); }
    pre {
      margin: 12px 0 0; padding: 14px; border-radius: 12px; overflow: auto;
      background: #201814; color: #f9efe3; font-size: 13px;
    }
    .filters-box, .responses-box, .request-body-box {
      margin-top: 12px;
      padding: 14px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: #fffaf2;
    }
    .mini-title {
      margin: 0 0 10px;
      color: var(--ink);
      font-size: 14px;
      font-weight: 700;
    }
    .parameter-list, .response-list, .request-body-list { display: grid; gap: 10px; }
    .parameter-item, .response-item {
      padding: 10px 12px; border-radius: 12px; background: var(--card); border: 1px solid var(--line);
    }
    .parameter-item header, .response-item header { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 6px; }
    .parameter-name { font-weight: 700; color: var(--ink); }
    .parameter-meta, .response-meta { font-size: 12px; color: var(--muted); }
    .response-example { margin-top: 8px; }
    /* Flows */
    #flows-panel { display: none; }
    #routes-panel { display: block; }
    .flow-card {
      margin-top: 32px; border: 1px solid var(--line); border-radius: 22px;
      background: rgba(255,253,248,.8); overflow: hidden;
    }
    .flow-card-header { padding: 22px 24px 16px; border-bottom: 1px solid var(--line); }
    .flow-card-header h3 { margin: 0 0 6px; font-size: 22px; }
    .flow-card-header p { font-size: 15px; }
    .flow-steps { padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 0; }
    .flow-step {
      display: flex; gap: 16px; align-items: flex-start;
      padding: 16px 0; border-bottom: 1px dashed var(--line);
    }
    .flow-step:last-child { border-bottom: 0; }
    .flow-step-number {
      flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent); color: #fff; display: flex; align-items: center;
      justify-content: center; font-weight: 700; font-size: 16px; font-family: Georgia, serif;
      margin-top: 2px;
    }
    .flow-step-body { flex: 1; min-width: 0; }
    .flow-step-header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px; }
    .actor-badge, .method-badge, .service-tag, .auth-badge, .public-badge {
      display: inline-flex; align-items: center; padding: 3px 10px;
      border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap;
    }
    .auth-badge { background: #fef3c7; color: #92400e; }
    .public-badge { background: #d1fae5; color: #065f46; }
    .flow-path {
      font-family: Consolas, monospace; font-size: 13px;
      background: var(--code); padding: 3px 8px; border-radius: 6px;
    }
    .flow-detail { font-size: 14px; color: var(--muted); margin: 0 0 8px; line-height: 1.6; }
    .flow-response {
      font-size: 13px; font-family: Consolas, monospace;
      background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;
      padding: 6px 12px; border-radius: 8px; margin-top: 6px;
    }
    .flow-details summary { font-size: 13px; color: var(--accent); margin-bottom: 4px; }
    .flow-details pre { font-size: 12px; max-height: 200px; }
    .flows-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
    .flow-nav-btn {
      padding: 8px 16px; border-radius: 10px; border: 1px solid var(--line);
      background: var(--card); color: var(--ink); cursor: pointer; font: inherit;
      font-size: 13px; transition: all .15s; text-decoration: none;
    }
    .flow-nav-btn:hover { background: var(--accent-soft); }
    @media (max-width: 720px) {
      h1 { font-size: 30px; }
      .wrap { padding: 24px 14px 56px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <span class="badge">OpenAPI ${spec.openapi}</span>
      <h1>${spec.info.title}</h1>
      <p>${spec.info.description}</p>
      <div class="topbar">
        <input id="search" type="search" placeholder="Buscar por path, tag o metodo" />
        <select id="service-filter"></select>
      </div>
    </section>
    <div class="tabs">
      <button class="tab active" id="tab-routes" onclick="switchTab('routes')">📋 Rutas API</button>
      <button class="tab" id="tab-flows" onclick="switchTab('flows')">🔄 Flujos</button>
    </div>
    <div id="routes-panel">
      <section id="content"></section>
    </div>
    <div id="flows-panel">
      <div class="flows-nav">
        ${flows.map(f => `<a class="flow-nav-btn" href="#${f.id}">${f.title}</a>`).join('\n        ')}
      </div>
      ${renderFlows(flows)}
    </div>
  </div>
  <script>
    function switchTab(tab) {
      document.getElementById('routes-panel').style.display = tab === 'routes' ? 'block' : 'none';
      document.getElementById('flows-panel').style.display = tab === 'flows' ? 'block' : 'none';
      document.getElementById('tab-routes').className = 'tab' + (tab === 'routes' ? ' active' : '');
      document.getElementById('tab-flows').className = 'tab' + (tab === 'flows' ? ' active' : '');
      document.getElementById('search').style.display = tab === 'routes' ? '' : 'none';
    }
    const spec = ${JSON.stringify(spec)};
    const operations = Object.entries(spec.paths).flatMap(([path, methods]) =>
      Object.entries(methods).map(([method, operation]) => ({ path, method, operation }))
    );

    const content = document.getElementById('content');
    const search = document.getElementById('search');
    const serviceFilter = document.getElementById('service-filter');

    const serviceOrder = ['auth', 'backend', 'registration-lambda'];
    const roleOrder = ['admin', 'cliente', 'vendedor', 'bodeguero', 'root', 'comun', 'interno', 'publico'];
    const serviceLabels = {
      'auth': 'Importal-auth',
      'backend': 'Importal-backend',
      'registration-lambda': 'Importal-registration-lambda',
    };
    const roleLabels = {
      'admin': 'Rol Admin',
      'cliente': 'Rol Cliente',
      'vendedor': 'Rol Vendedor',
      'bodeguero': 'Rol Bodeguero',
      'root': 'Rol Root',
      'comun': 'Rutas Comunes',
      'interno': 'Interno',
      'publico': 'Publico',
    };

    serviceFilter.innerHTML = [
      '<option value="">Todos los servicios</option>',
      ...serviceOrder.map(service => '<option value="' + service + '">' + (serviceLabels[service] || service) + '</option>'),
      '<option value="unknown">unknown</option>',
    ].join('');

    function render(filter = '') {
      const q = filter.trim().toLowerCase();
      const selectedService = serviceFilter.value;
      const items = operations.filter(({ path, method, operation }) => {
        const tags = (operation.tags || []).join(' ');
        return !q || [
          path,
          method,
          operation.summary || '',
          tags,
          operation['x-service'] || '',
          operation['x-role-group'] || '',
        ].join(' ').toLowerCase().includes(q);
      });

      const filteredItems = items.filter(({ operation }) => {
        return !selectedService || (operation['x-service'] || 'unknown') === selectedService;
      });

      const groupedByService = groupBy(filteredItems, item => item.operation['x-service'] || 'unknown');

      content.innerHTML = serviceOrder
        .filter(service => groupedByService[service]?.length)
        .map(service => renderService(service, groupedByService[service]))
        .join('');
    }

    function renderService(service, items) {
      if (service !== 'backend') {
        return \`
          <section class="service-block">
            <div class="service-title">
              <h2>\${serviceLabels[service] || service}</h2>
              <span class="badge">\${items.length} endpoints</span>
            </div>
            \${items.map(renderEndpoint).join('')}
          </section>
        \`;
      }

      const groupedByRole = groupBy(items, item => item.operation['x-role-group'] || 'comun');

      return \`
        <section class="service-block">
          <div class="service-title">
            <h2>\${serviceLabels[service] || service}</h2>
            <span class="badge">\${items.length} endpoints</span>
          </div>
          \${roleOrder
            .filter(role => groupedByRole[role]?.length)
            .map(role => \`
              <div class="role-block">
                <div class="role-title">
                  <h3>\${roleLabels[role] || role}</h3>
                  <span class="badge">\${groupedByRole[role].length}</span>
                </div>
                \${groupedByRole[role].map(renderEndpoint).join('')}
              </div>
            \`).join('')}
        </section>
      \`;
    }

    function renderEndpoint({ path, method, operation }) {
      const roles = Array.isArray(operation.security) ? 'JWT' : 'Publico';
      return \`
        <article class="endpoint">
          <header>
            <span class="method">\${method.toUpperCase()}</span>
            <code class="path">\${path}</code>
            <span class="badge">\${(operation.tags || ['General'])[0]}</span>
            <span class="badge">\${roles}</span>
          </header>
          <p class="meta">\${operation.summary || ''}</p>
          \${renderParameters(operation.parameters || [])}
          \${renderRequestBody(operation.requestBody)}
          \${renderResponses(operation.responses || {})}
          <details>
            <summary>Ver operacion completa</summary>
            <pre>\${escapeHtml(JSON.stringify(operation, null, 2))}</pre>
          </details>
        </article>
      \`;
    }

    function renderParameters(parameters) {
      const queryParameters = parameters.filter(parameter => parameter.in === 'query');
      if (!queryParameters.length) {
        return '';
      }

      return '<section class="filters-box">' +
        '<p class="mini-title">Filtros</p>' +
        '<div class="parameter-list">' +
        queryParameters.map(parameter => {
          const enumText = parameter.schema?.enum
            ? '<div class="parameter-meta">Valores: ' + escapeHtml(parameter.schema.enum.join(', ')) + '</div>'
            : '';

          return '<div class="parameter-item">' +
            '<header>' +
            '<span class="parameter-name">' + escapeHtml(parameter.name) + '</span>' +
            '<span class="badge">' + (parameter.required ? 'Requerido' : 'Opcional') + '</span>' +
            '<span class="badge">' + (parameter.schema?.type || 'string') + '</span>' +
            '</header>' +
            '<div class="parameter-meta">' + escapeHtml(parameter.description || 'Filtro documentado desde el backend') + '</div>' +
            enumText +
            '</div>';
        }).join('') +
        '</div>' +
        '</section>';
    }

    function renderResponses(responses) {
      const entries = Object.entries(responses || {});
      if (!entries.length) {
        return '';
      }

      return '<section class="responses-box">' +
        '<p class="mini-title">Responses</p>' +
        '<div class="response-list">' +
        entries.map(([status, response]) => {
          const media = response.content && response.content['application/json'];
          const example = media && (media.example || media.examples || null);
          const exampleText = example ? JSON.stringify(example, null, 2) : '';
          const exampleHtml = exampleText
            ? '<div class="response-meta">Ejemplo</div><pre class="response-example">' + escapeHtml(exampleText) + '</pre>'
            : '<div class="response-meta">Sin ejemplo disponible</div>';

          return '<div class="response-item">' +
            '<header>' +
            '<span class="parameter-name">' + escapeHtml(status) + '</span>' +
            '<span class="badge">' + escapeHtml(response.description || '') + '</span>' +
            '</header>' +
            exampleHtml +
            '</div>';
        }).join('') +
        '</div>' +
        '</section>';
    }

    function renderRequestBody(requestBody) {
      if (!requestBody) {
        return '';
      }

      const content = requestBody.content || {};
      const mediaTypes = Object.entries(content);
      if (!mediaTypes.length) {
        return '';
      }

      return '<section class="request-body-box">' +
        '<p class="mini-title">Request Body</p>' +
        '<div class="request-body-list">' +
        mediaTypes.map(([mediaType, media]) => {
          const example = media.example || media.examples || null;
          const exampleText = example ? JSON.stringify(example, null, 2) : '';
          const exampleHtml = exampleText
            ? '<div class="response-meta">Ejemplo (' + escapeHtml(mediaType) + ')</div><pre class="response-example">' + escapeHtml(exampleText) + '</pre>'
            : '<div class="response-meta">Sin ejemplo disponible</div>';

          return '<div class="response-item">' +
            '<header>' +
            '<span class="parameter-name">' + escapeHtml(mediaType) + '</span>' +
            '<span class="badge">' + (requestBody.required ? 'Requerido' : 'Opcional') + '</span>' +
            '</header>' +
            exampleHtml +
            '</div>';
        }).join('') +
        '</div>' +
        '</section>';
    }

    function groupBy(items, keySelector) {
      return items.reduce((acc, item) => {
        const key = keySelector(item);
        (acc[key] ||= []).push(item);
        return acc;
      }, {});
    }

    function escapeHtml(value) {
      return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
    }

    search.addEventListener('input', event => render(event.target.value));
    serviceFilter.addEventListener('change', () => render(search.value));
    render();
  </script>
</body>
</html>`
}

const routes = loadSourceRoutes()

const { paths, duplicates } = buildPaths(routes)

const spec = sortObjectKeys({
  openapi: '3.1.0',
  info,
  servers,
  tags,
  paths,
  components: {
    securitySchemes,
    schemas,
  },
})

ensureDir(generatedDir)
ensureDir(docsDir)

const docsSrcPublicDir = path.join(docsRoot, 'docs-src', 'public')
ensureDir(docsSrcPublicDir)

fs.writeFileSync(sourceRoutesPath, JSON.stringify(routes, null, 2))
fs.writeFileSync(path.join(generatedDir, 'duplicate-routes.json'), JSON.stringify(duplicates, null, 2))
fs.writeFileSync(path.join(generatedDir, 'openapi.json'), `${JSON.stringify(spec, null, 2)}\n`)
fs.writeFileSync(path.join(generatedDir, 'openapi.yaml'), `${toYaml(spec)}\n`)
fs.writeFileSync(path.join(generatedDir, 'api-types.d.ts'), `${generateTypeDeclarations(spec)}\n`)
fs.writeFileSync(path.join(docsSrcPublicDir, 'openapi.json'), `${JSON.stringify(spec, null, 2)}\n`)
fs.writeFileSync(path.join(docsSrcPublicDir, 'openapi.yaml'), `${toYaml(spec)}\n`)
fs.writeFileSync(path.join(docsDir, 'index.html'), createHtml(spec))

console.log(`OpenAPI generado con ${routes.length} rutas fuente y ${duplicates.length} duplicadas`)
