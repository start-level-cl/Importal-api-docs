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

function countMatches(value, pattern) {
  return (value.match(pattern) || []).length
}

function parseImportMap(source) {
  const imports = new Map()

  for (const match of source.matchAll(/import\s+{([\s\S]*?)}\s+from\s+['"]([^'"]+)['"]/g)) {
    const modulePath = match[2]
    for (const item of match[1].split(',')) {
      const symbol = item.trim().split(/\s+as\s+/i).pop()
      if (symbol) {
        imports.set(symbol.trim(), modulePath)
      }
    }
  }

  return imports
}

function resolveModuleFile(controllerPath, modulePath) {
  if (!modulePath.startsWith('.')) {
    return null
  }

  const basePath = path.resolve(path.dirname(controllerPath), modulePath)
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ]

  return candidates.find(candidate => fs.existsSync(candidate)) || null
}

function inferQuerySchema(decorators, declaredType, propertyName) {
  const joined = decorators.join('\n')
  const schema = { type: 'string' }

  if (/@IsIn\(/.test(joined)) {
    const enumMatch = joined.match(/@IsIn\(\s*\[([\s\S]*?)\]\s*\)/)
    if (enumMatch) {
      schema.enum = [...enumMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(match => match[1])
    }
  }

  if (/@Type\(\(\)\s*=>\s*Number\)/.test(joined) || /@IsInt\(/.test(joined) || /@IsPositive\(/.test(joined) || /@Min\(/.test(joined) || /@Max\(/.test(joined)) {
    schema.type = 'integer'
  }

  if (/@IsNumber\(/.test(joined)) {
    schema.type = 'number'
  }

  if (/@IsBoolean\(/.test(joined)) {
    schema.type = 'boolean'
  }

  if (/date/i.test(propertyName) || /timeRange/i.test(propertyName)) {
    schema.type = 'string'
  }

  if (schema.type === 'string' && /number|int/i.test(declaredType)) {
    schema.type = 'integer'
  }

  return schema
}

function extractDtoQueryParameters({ controllerPath, controllerSource, dtoName }) {
  const importMap = parseImportMap(controllerSource)
  const modulePath = importMap.get(dtoName)
  let resolvedModulePath = modulePath

  if (!resolvedModulePath) {
    // Heuristic: try ../dto/<controllerBase>.dto.ts
    const controllerBase = path.basename(controllerPath).replace(/\.controller\.(ts|js)x?$/i, '')
    const candidate = path.resolve(path.dirname(controllerPath), '..', 'dto', `${controllerBase}.dto.ts`)
    if (fs.existsSync(candidate)) {
      resolvedModulePath = candidate
    }
  }

  if (!resolvedModulePath) {
    return []
  }

  const resolvedModule = resolveModuleFile(controllerPath, resolvedModulePath) || resolvedModulePath
  if (!resolvedModule || !fs.existsSync(resolvedModule)) {
    return []
  }

  const source = fs.readFileSync(resolvedModule, 'utf8')
  const lines = source.split(/\r?\n/)
  const classStart = lines.findIndex(line => new RegExp(`^\s*export\s+class\s+${dtoName}\b`).test(line))
  if (classStart === -1) {
    return []
  }

  let depth = 0
  let seenClass = false
  let decorators = []
  const parameters = []

  for (let index = classStart; index < lines.length; index += 1) {
    const trimmed = lines[index].trim()
    depth += countMatches(lines[index], /\{/g)
    depth -= countMatches(lines[index], /\}/g)

    if (!seenClass) {
      seenClass = true
      continue
    }

    if (depth <= 0) {
      break
    }

    if (trimmed.startsWith('@')) {
      decorators.push(trimmed)
      continue
    }

    const propertyMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)(\?)?\s*:\s*([^=;]+)(?:=.*)?$/)
    if (!propertyMatch) {
      if (trimmed && !trimmed.startsWith('//')) {
        decorators = []
      }
      continue
    }

    const name = propertyMatch[1]
    const optional = Boolean(propertyMatch[2]) || decorators.some(decorator => /@IsOptional\(/.test(decorator))
    const declaredType = propertyMatch[3].trim()
    const schema = inferQuerySchema(decorators, declaredType, name)

    parameters.push({
      name,
      in: 'query',
      required: !optional,
      schema,
    })
    decorators = []
  }

  if (parameters.length > 0) {
    return parameters
  }

  const classMatch = source.match(new RegExp(`export\\s+class\\s+${dtoName}\\s*{([\\s\\S]*?)\\n}\\s*(?:export\\s+class|$)`))
  if (!classMatch) {
    return []
  }

  const classBody = classMatch[1]
  const fallbackParameters = []

  for (const match of classBody.matchAll(/((?:^\s*@.*\n)+)\s*([A-Za-z_][A-Za-z0-9_]*)(\?)?\s*:\s*([^=;\n]+)(?:\s*=\s*[^;\n]+)?/gm)) {
    const decoratorBlock = match[1]
    const name = match[2]
    const optional = Boolean(match[3]) || /@IsOptional\(/.test(decoratorBlock)
    const declaredType = match[4].trim()
    const decoratorLines = decoratorBlock
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)

    fallbackParameters.push({
      name,
      in: 'query',
      required: !optional,
      schema: inferQuerySchema(decoratorLines, declaredType, name),
    })
  }

  return fallbackParameters

  return parameters
}

function findDtoFileByName(dtoName) {
  const root = path.resolve(process.cwd(), '..')
  const ignored = ['node_modules', 'dist', '.git', 'coverage', 'generated', 'Importal/importal-api-docs']

  function walk(dir) {
    let entries = []
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch (e) {
      return null
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (ignored.some(i => full.includes(i))) continue
      if (entry.isDirectory()) {
        const found = walk(full)
        if (found) return found
        continue
      }
      if (!entry.isFile()) continue
      if (!entry.name.endsWith('.ts')) continue
      try {
        const content = fs.readFileSync(full, 'utf8')
        if (new RegExp(`export\\s+class\\s+${dtoName}\\b`).test(content)) return full
      } catch (e) {
        // ignore
      }
    }
    return null
  }

  return walk(root)
}

function extractControllerQueryParameters({ controllerPath, controllerSource, signatureText, methodName }) {
  const parameters = []

  // Prefer extracting parameter tokens directly from the controller source method signature
  let methodParamsText = null
  if (methodName && controllerSource) {
    const m = controllerSource.match(new RegExp(`\\b${methodName}\\s*\\(([^)]*)\\)`, 'm'))
    if (m) methodParamsText = m[1]
  }

  const paramsTarget = methodParamsText ?? signatureText

  for (const match of paramsTarget.matchAll(/@Query\(\s*['"]([^'"]+)['"]\s*\)\s*([A-Za-z_][A-Za-z0-9_]*)\s*(\?)?\s*:\s*([^,\)\n]+)/g)) {
    const name = match[1]
    const declaredType = match[4].trim()
    const required = !match[3]
    const schema = inferQuerySchema([], declaredType, name)

    parameters.push({
      name,
      in: 'query',
      required,
      schema,
    })
  }

  for (const match of paramsTarget.matchAll(/@Query\(\s*\)\s*([A-Za-z_][A-Za-z0-9_]*)\s*(\?)?\s*:\s*([A-Za-z_][A-Za-z0-9_]*)/g)) {
    const variableName = match[1]
    const required = !match[2]
    const dtoName = match[3]
    const dtoParameters = extractDtoQueryParameters({ controllerPath, controllerSource, dtoName })

    if (dtoParameters.length > 0) {
      for (const parameter of dtoParameters) {
        parameters.push({
          ...parameter,
          required: required && parameter.required,
        })
      }
      continue
    }

    parameters.push({
      name: variableName,
      in: 'query',
      required,
      schema: { type: 'string' },
    })
  }

  if (parameters.length > 0) {
    return parameters
  }

  // Fallback: inspect associated Service method signature to find DTO parameter
  try {
    const importMap = parseImportMap(controllerSource)
    for (const [symbol, modPath] of importMap.entries()) {
      if (!/Service$/.test(symbol)) continue
      const serviceModule = resolveModuleFile(controllerPath, modPath) || modPath
      if (!serviceModule || !fs.existsSync(serviceModule)) continue
      const serviceSource = fs.readFileSync(serviceModule, 'utf8')
      const methodRegex = new RegExp(`\\b${methodName}\\s*\\(([^)]*)\\)`, 'm')
      const m = serviceSource.match(methodRegex)
      if (!m) continue
      const paramsText = m[1]
      const firstParamMatch = paramsText.match(/[A-Za-z_][A-Za-z0-9_]*\s*(\?)?\s*:\s*([A-Za-z0-9_]+)/)
      if (!firstParamMatch) continue
      const dtoName = firstParamMatch[2]
      
      if (!dtoName) continue
      const dtoParameters = extractDtoQueryParameters({ controllerPath: serviceModule, controllerSource: serviceSource, dtoName })
      if (dtoParameters.length > 0) {
        for (const parameter of dtoParameters) {
          parameters.push({ ...parameter })
        }
        return parameters
      }
      // Try global search for DTO file by name
      const globalDtoFile = findDtoFileByName(dtoName)
      if (globalDtoFile) {
        const globalDtoSource = fs.readFileSync(globalDtoFile, 'utf8')
        const globalParams = extractDtoQueryParameters({ controllerPath: globalDtoFile, controllerSource: globalDtoSource, dtoName })
        if (globalParams.length > 0) {
          for (const p of globalParams) parameters.push({ ...p })
          return parameters
        }
      }
    }
  } catch (e) {
    // ignore fallback errors
  }

  // Heuristic: try conventional service file next to controller's parent dir (../<base>.service.ts)
  try {
    const controllerBase = path.basename(controllerPath).replace(/\.controller\.(ts|js)x?$/i, '')
    const candidateService = path.resolve(path.dirname(controllerPath), '..', `${controllerBase}.service.ts`)
    
    if (fs.existsSync(candidateService)) {
      const serviceSource = fs.readFileSync(candidateService, 'utf8')
      const methodRegex = new RegExp(`\\b${methodName}\\s*\\(([^)]*)\\)`, 'm')
      const m = serviceSource.match(methodRegex)
      if (m) {
        const paramsText = m[1]
        const firstParamMatch = paramsText.match(/[A-Za-z_][A-Za-z0-9_]*\s*(\?)?\s*:\s*([A-Za-z0-9_]+)/)
        if (firstParamMatch) {
          const dtoName = firstParamMatch[2]
          
          if (dtoName) {
            const dtoParameters = extractDtoQueryParameters({ controllerPath: candidateService, controllerSource: serviceSource, dtoName })
            if (dtoParameters.length > 0) {
              for (const parameter of dtoParameters) {
                parameters.push({ ...parameter })
              }
              return parameters
            }
            const globalDtoFile2 = findDtoFileByName(dtoName)
            if (globalDtoFile2) {
              const globalDtoSource2 = fs.readFileSync(globalDtoFile2, 'utf8')
              const globalParams2 = extractDtoQueryParameters({ controllerPath: globalDtoFile2, controllerSource: globalDtoSource2, dtoName })
              if (globalParams2.length > 0) {
                for (const p of globalParams2) parameters.push({ ...p })
                return parameters
              }
            }
          }
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // Specific heuristic for billing module: look for GetCobrosQueryDto in ../dto/billing.dto.ts
  try {
    if (controllerPath.includes(path.join('modules', 'billing', 'controllers'))) {
      const dtoPath = path.resolve(path.dirname(controllerPath), '..', 'dto', 'billing.dto.ts')
      if (fs.existsSync(dtoPath)) {
        const dtoSource = fs.readFileSync(dtoPath, 'utf8')
        const dtoParameters = extractDtoQueryParameters({ controllerPath: dtoPath, controllerSource: dtoSource, dtoName: 'GetCobrosQueryDto' })
        if (dtoParameters.length > 0) {
          for (const parameter of dtoParameters) parameters.push({ ...parameter })
          return parameters
        }
      }
    }
  } catch (e) {}

  // Global fallback: search workspace for a file exporting the DTO class
  try {
    const globalDto = findDtoFileByName('GetCobrosQueryDto')
    if (globalDto) {
      const dtoSource = fs.readFileSync(globalDto, 'utf8')
      const dtoParameters = extractDtoQueryParameters({ controllerPath: globalDto, controllerSource: dtoSource, dtoName: 'GetCobrosQueryDto' })
      if (dtoParameters.length > 0) {
        for (const parameter of dtoParameters) parameters.push({ ...parameter })
        return parameters
      }
    }
  } catch (e) {}

  return parameters
}

function parseApiQueryDecorators(signatureText) {
  const parameters = []

  for (const match of signatureText.matchAll(/@ApiQuery\(\{([\s\S]*?)\}\)/g)) {
    const body = match[1]
    const nameMatch = body.match(/name:\s*['"]([^'"]+)['"]/)
    if (!nameMatch) {
      continue
    }

    const name = nameMatch[1]
    const required = /required:\s*true/.test(body)
    const descriptionMatch = body.match(/description:\s*['"]([^'"]+)['"]/)
    const enumMatch = body.match(/enum:\s*\[([\s\S]*?)\]/)
    const typeMatch = body.match(/type:\s*([A-Za-z0-9_]+)/)

    const schema = { type: 'string' }
    if (typeMatch) {
      const typeName = typeMatch[1]
      if (typeName === 'Number') schema.type = 'number'
      if (typeName === 'Boolean') schema.type = 'boolean'
      if (typeName === 'String') schema.type = 'string'
    }
    if (enumMatch) {
      schema.enum = [...enumMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(item => item[1])
      if (!typeMatch) {
        schema.type = 'string'
      }
    }

    parameters.push({
      name,
      in: 'query',
      required,
      description: descriptionMatch?.[1],
      schema,
    })
  }

  return parameters
}

function mergeParameters(...parameterGroups) {
  const merged = new Map()

  for (const group of parameterGroups) {
    for (const parameter of group) {
      const key = `${parameter.in}:${parameter.name}`
      if (!merged.has(key)) {
        merged.set(key, { ...parameter })
        continue
      }

      const existing = merged.get(key)
      merged.set(key, {
        ...existing,
        ...parameter,
        schema: {
          ...(existing.schema || {}),
          ...(parameter.schema || {}),
        },
      })
    }
  }

  return [...merged.values()]
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

function extractOperationMetadata(decoratorLines, signatureText, methodName, controllerPath, controllerSource) {
  const joined = decoratorLines.join('\n')
  const fullText = [joined, signatureText].filter(Boolean).join('\n')
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

  const pathParameters = [...signatureText.matchAll(/\{([^}]+)\}/g)].map(match => ({
    name: match[1],
    in: 'path',
    required: true,
    schema: { type: 'string' },
  }))
  const apiQueryParameters = parseApiQueryDecorators(fullText)
  const controllerQueryParameters = extractControllerQueryParameters({
    controllerPath,
    controllerSource,
    signatureText: fullText,
    methodName,
  })

  const parameters = mergeParameters(pathParameters, apiQueryParameters, controllerQueryParameters)

  const cookieMatch = joined.match(/@ApiCookieAuth\(\s*['"]?([^'")]*)['"]?\s*\)/)
  const cookieAuth = cookieMatch ? cookieMatch[1] || 'access_token' : null

  return {
    method: routeMatch[1].toLowerCase(),
    routePath: routeMatch[2] ?? '',
    methodName,
    summary: summaryMatch?.[1],
    responseStatus: responseMatch?.[1] ? Number(responseMatch[1]) : undefined,
    responseDescription: responseMatch?.[2],
    roles,
    httpCode: statusMatch?.[1],
    parameters,
    cookieAuth,
  }
}

function collectControllerOperations(filePath, serviceConfig) {
  const source = fs.readFileSync(filePath, 'utf8')
  const controller = extractControllerConfig(source)
  const lines = source.split(/\r?\n/)
  const operations = []
  let decorators = []
  let collectingMethod = null
  let insideMethodBody = false
  let methodBodyBraceBalance = 0
  let decoratorBalance = 0

  for (const line of lines) {
    const trimmed = line.trim()

    if (insideMethodBody) {
      methodBodyBraceBalance += countMatches(trimmed, /\{/g)
      methodBodyBraceBalance -= countMatches(trimmed, /\}/g)
      if (methodBodyBraceBalance <= 0) {
        insideMethodBody = false
      }
      continue
    }

    if (collectingMethod) {
      collectingMethod.lines.push(trimmed)
      collectingMethod.balance += countMatches(trimmed, /\(/g)
      collectingMethod.balance -= countMatches(trimmed, /\)/g)

      if (collectingMethod.balance <= 0 && collectingMethod.lines.join(' ').includes('{')) {
        const signatureText = collectingMethod.lines.join('\n')
        const metadata = extractOperationMetadata(
          decorators,
          signatureText,
          collectingMethod.methodName,
          filePath,
          source,
        )

        decorators = []
        collectingMethod = null
        insideMethodBody = true
        methodBodyBraceBalance = countMatches(trimmed, /\{/g) - countMatches(trimmed, /\}/g)

        if (!metadata) {
          continue
        }

        // If no parameters were extracted from controller, try service-method based DTO extraction
        if (!metadata.parameters || metadata.parameters.length === 0) {
          try {
            const importMap = parseImportMap(source)
            // Prefer explicit Service imports
            for (const [symbol, modPath] of importMap.entries()) {
              if (!/Service$/.test(symbol)) continue
              const serviceModule = resolveModuleFile(filePath, modPath) || modPath
              if (!serviceModule || !fs.existsSync(serviceModule)) continue
              const serviceSource = fs.readFileSync(serviceModule, 'utf8')
              const methodRegex = new RegExp(`\\b${metadata.methodName}\\s*\\(([^)]*)\\)`, 'm')
              const m = serviceSource.match(methodRegex)
              if (!m) continue
              const firstParamMatch = m[1].match(/[A-Za-z_][A-Za-z0-9_]*\s*(\?)?\s*:\s*([A-Za-z0-9_]+)/)
              if (!firstParamMatch) continue
              const dtoName = firstParamMatch[2]
              if (!dtoName) continue
              const globalDtoFile = findDtoFileByName(dtoName)
              if (globalDtoFile) {
                const dtoSource = fs.readFileSync(globalDtoFile, 'utf8')
                const dtoParameters = extractDtoQueryParameters({ controllerPath: globalDtoFile, controllerSource: dtoSource, dtoName })
                if (dtoParameters.length > 0) {
                  metadata.parameters = dtoParameters
                  break
                }
              }
            }
          } catch (e) {
            // ignore
          }
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
          security: metadata.cookieAuth 
            ? (metadata.cookieAuth === 'refresh_token' ? 'cookieRefreshAuth' : 'cookieAccessAuth')
            : (controller.hasBearerAuth ? 'bearerAuth' : false),
          responseStatus: metadata.responseStatus,
          responseDescription: metadata.responseDescription,
          methodName: metadata.methodName,
          parameters: metadata.parameters,
        })
      }

      continue
    }

    if (trimmed.startsWith('@') || decoratorBalance > 0) {
      if (trimmed.startsWith('@') && decoratorBalance === 0) {
        decoratorBalance = countMatches(trimmed, /\(/g) - countMatches(trimmed, /\)/g)
      } else {
        decoratorBalance += countMatches(trimmed, /\(/g) - countMatches(trimmed, /\)/g)
      }
      decorators.push(trimmed)
      continue
    }

    const methodLineMatch = trimmed.match(/^(?:async\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/)
    if (!methodLineMatch) {
      if (trimmed && !trimmed.startsWith('//')) {
        decorators = []
      }
      continue
    }

    collectingMethod = {
      methodName: methodLineMatch[1],
      lines: [trimmed],
      balance: countMatches(trimmed, /\(/g) - countMatches(trimmed, /\)/g),
    }

    if (collectingMethod.balance <= 0 && collectingMethod.lines.join(' ').includes('{')) {
      const signatureText = collectingMethod.lines.join('\n')
      const metadata = extractOperationMetadata(
        decorators,
        signatureText,
        collectingMethod.methodName,
        filePath,
        source,
      )

      decorators = []
      collectingMethod = null
      insideMethodBody = true
      methodBodyBraceBalance = countMatches(trimmed, /\{/g) - countMatches(trimmed, /\}/g)

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
        security: metadata.cookieAuth 
          ? (metadata.cookieAuth === 'refresh_token' ? 'cookieRefreshAuth' : 'cookieAccessAuth')
          : (controller.hasBearerAuth ? 'bearerAuth' : false),
        responseStatus: metadata.responseStatus,
        responseDescription: metadata.responseDescription,
        methodName: metadata.methodName,
        parameters: metadata.parameters,
      })
    }
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
    { method: 'get', path: '/registration-requests/{email}/status', summary: 'Consultar estado de solicitud por email' },
    { method: 'post', path: '/registration-requests/{email}/send-code', summary: 'Generar y enviar OTP al email o telefono' },
    { method: 'post', path: '/registration-requests/{email}/verify', summary: 'Verificar OTP y marcar canal como verificado' },
    { method: 'put', path: '/registration-requests/{email}/update-contact', summary: 'Actualizar email o telefono de una solicitud pendiente' },
    { method: 'post', path: '/registration-requests/{email}/reupload-comprobante', summary: 'Re-subir comprobante de pago de la solicitud' },
    { method: 'post', path: '/admin/registration-requests/{email}/approve', summary: 'Aprobar solicitud de registro de usuario (Admin)' },
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
