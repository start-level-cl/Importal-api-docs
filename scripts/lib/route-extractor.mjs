import fs from 'node:fs'
import path from 'node:path'

const HTTP_METHODS = ['Get', 'Post', 'Put', 'Patch', 'Delete']

function walkControllers(rootDir) {
  const results = []
  const entries = fs.readdirSync(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkControllers(fullPath))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.controller.ts')) {
      results.push(fullPath)
    }
  }

  return results
}

function cleanQuoted(value) {
  return value.replace(/^['"]|['"]$/g, '')
}

function extractControllerConfig(source) {
  const controllerMatch = source.match(/@Controller\(([\s\S]*?)\)\s*export class/)
  const controllerArgs = controllerMatch?.[1] ?? ''

  let basePath = ''
  let version = '1'
  let isVersionNeutral = false

  const stringControllerMatch = controllerArgs.match(/^\s*['"]([^'"]*)['"]\s*$/)
  if (stringControllerMatch) {
    basePath = stringControllerMatch[1]
  }

  const pathMatch = controllerArgs.match(/path:\s*['"]([^'"]+)['"]/)
  if (pathMatch) {
    basePath = pathMatch[1]
  }

  const versionMatch = controllerArgs.match(/version:\s*['"]([^'"]+)['"]/)
  if (versionMatch) {
    version = versionMatch[1]
  }

  if (/VERSION_NEUTRAL/.test(controllerArgs)) {
    isVersionNeutral = true
    version = ''
  }

  const tagMatch = source.match(/@ApiTags\(([^)]+)\)/)
  const tags = tagMatch
    ? tagMatch[1]
        .split(',')
        .map(item => cleanQuoted(item.trim()))
        .filter(Boolean)
    : []

  const hasBearerAuth = /@ApiBearerAuth\(/.test(source)

  return {
    basePath,
    version,
    isVersionNeutral,
    tags,
    hasBearerAuth,
  }
}

function joinUrlParts(...parts) {
  const tokens = parts
    .filter(Boolean)
    .map(part => part.replace(/\\/g, '/'))
    .flatMap(part => part.split('/'))
    .filter(Boolean)
  return `/${tokens.join('/')}`.replace(/\/+/g, '/')
}

function normalizeMethodPath(methodPath) {
  if (!methodPath) {
    return ''
  }
  const withoutLeadingSlash = methodPath.startsWith('/') ? methodPath.slice(1) : methodPath
  return withoutLeadingSlash.replace(/:([A-Za-z0-9_]+)/g, '{$1}')
}

function extractOperationMetadata(decoratorLines, methodName) {
  const joined = decoratorLines.join('\n')
  const routeMatch = joined.match(/@(Get|Post|Put|Patch|Delete)\(\s*(?:['"]([^'"]*)['"])?\s*\)/)
  if (!routeMatch) {
    return null
  }

  const summaryMatch = joined.match(/@ApiOperation\(\{\s*summary:\s*['"]([^'"]+)['"]/)
  const responseMatch = joined.match(/@ApiResponse\(\{\s*status:\s*(\d+),\s*description:\s*['"]([^'"]+)['"]/)
  const rolesMatch = joined.match(/@Roles\(([\s\S]*?)\)/)
  const statusMatch = joined.match(/@HttpCode\((?:HttpStatus\.)?(\w+)\)/)

  const roles = rolesMatch
    ? [...rolesMatch[1].matchAll(/UserRole\.([A-Z_]+)/g)].map(match => match[1].toLowerCase())
    : []

  return {
    method: routeMatch[1].toLowerCase(),
    routePath: routeMatch[2] ?? '',
    methodName,
    summary: summaryMatch?.[1],
    responseStatus: responseMatch?.[1] ? Number(responseMatch[1]) : undefined,
    responseDescription: responseMatch?.[2],
    roles,
    httpCode: statusMatch?.[1],
  }
}

function collectControllerOperations(filePath, serviceConfig) {
  const source = fs.readFileSync(filePath, 'utf8')
  const controller = extractControllerConfig(source)
  const lines = source.split(/\r?\n/)
  const operations = []
  let decorators = []
  let currentDecorator = []
  let decoratorBalance = 0

  for (const line of lines) {
    const trimmed = line.trim()

    if (currentDecorator.length > 0) {
      currentDecorator.push(trimmed)
      decoratorBalance += (trimmed.match(/\(/g) || []).length
      decoratorBalance -= (trimmed.match(/\)/g) || []).length

      if (decoratorBalance <= 0) {
        decorators.push(currentDecorator.join(' '))
        currentDecorator = []
        decoratorBalance = 0
      }
      continue
    }

    if (trimmed.startsWith('@')) {
      currentDecorator = [trimmed]
      decoratorBalance = (trimmed.match(/\(/g) || []).length - (trimmed.match(/\)/g) || []).length
      if (decoratorBalance <= 0) {
        decorators.push(currentDecorator.join(' '))
        currentDecorator = []
        decoratorBalance = 0
      }
      continue
    }

    const methodLineMatch = trimmed.match(/^(?:async\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/)
    if (!methodLineMatch) {
      if (trimmed && !trimmed.startsWith('//')) {
        decorators = []
      }
      continue
    }

    const metadata = extractOperationMetadata(decorators, methodLineMatch[1])
    decorators = []

    if (!metadata) {
      continue
    }

    const versionSegment = controller.isVersionNeutral ? '' : `v${controller.version || '1'}`
    const fullPath = joinUrlParts(
      serviceConfig.prefix,
      versionSegment,
      controller.basePath,
      normalizeMethodPath(metadata.routePath),
    )

    operations.push({
      service: serviceConfig.name,
      source: path.relative(serviceConfig.repoRoot, filePath).replace(/\\/g, '/'),
      method: metadata.method,
      path: fullPath,
      operationId: `${serviceConfig.name}_${metadata.method}_${fullPath.replace(/[{}]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`,
      tag: controller.tags[0] || serviceConfig.name,
      tags: controller.tags,
      summary: metadata.summary,
      roles: metadata.roles,
      security: controller.hasBearerAuth,
      responseStatus: metadata.responseStatus,
      responseDescription: metadata.responseDescription,
      methodName: metadata.methodName,
    })
  }

  return operations
}

export function extractNestRoutes({ repoRoot, serviceRoot, serviceName, prefix }) {
  const controllers = walkControllers(path.join(repoRoot, serviceRoot, 'src'))
  return controllers.flatMap(filePath =>
    collectControllerOperations(filePath, {
      repoRoot,
      name: serviceName,
      prefix,
    }),
  )
}

export function extractLambdaRoutes({ repoRoot, serviceRoot }) {
  const filePath = path.join(repoRoot, serviceRoot, 'src', 'index.ts')
  const source = fs.readFileSync(filePath, 'utf8')

  const routes = [
    { method: 'post', path: '/registration-requests', summary: 'Crear solicitud de registro publica' },
    { method: 'get', path: '/registration-requests', summary: 'Listar solicitudes pendientes para revision' },
    { method: 'post', path: '/registration-requests/{email}/send-code', summary: 'Generar y enviar OTP al email o telefono' },
    { method: 'post', path: '/registration-requests/{email}/verify', summary: 'Verificar OTP y marcar canal como verificado' },
    { method: 'put', path: '/registration-requests/{email}/update-contact', summary: 'Actualizar email o telefono de una solicitud pendiente' },
  ]

  for (const route of routes) {
    const routeAsRegex = route.path
      .replace('{email}', '[^/]+')
      .replace(/\//g, '\\/')
    if (!new RegExp(routeAsRegex).test(source) && !source.includes(route.path.replace('{email}', '${email}'))) {
      throw new Error(`No se pudo confirmar la ruta ${route.method.toUpperCase()} ${route.path} en registration lambda`)
    }
  }

  return routes.map(route => ({
    service: 'registration-lambda',
    source: path.relative(repoRoot, filePath).replace(/\\/g, '/'),
    method: route.method,
    path: route.path,
    operationId: `registration_lambda_${route.method}_${route.path.replace(/[{}]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`,
    tag: 'Registration',
    tags: ['Registration'],
    summary: route.summary,
    roles: [],
    security: false,
  }))
}
