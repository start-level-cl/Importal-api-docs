import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractLambdaRoutes, extractNestRoutes } from './lib/route-extractor.mjs'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(currentDir, '..', '..', '..')
const docsRoot = path.resolve(currentDir, '..')
const specPath = path.join(docsRoot, 'generated', 'openapi.json')

if (!fs.existsSync(specPath)) {
  throw new Error('Falta generated/openapi.json. Ejecuta primero npm run build')
}

const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))

function normalizePathParams(routePath) {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, '{$1}')
}

if (!spec.openapi || !spec.info || !spec.paths) {
  throw new Error('El spec no contiene openapi/info/paths')
}

const sourceRoutes = [
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
]

const specRoutes = new Set(
  Object.entries(spec.paths).flatMap(([routePath, methods]) =>
    Object.keys(methods).map(method => `${method.toLowerCase()} ${normalizePathParams(routePath)}`),
  ),
)

const missing = sourceRoutes
  .map(route => `${route.method} ${normalizePathParams(route.path)}`)
  .filter(route => !specRoutes.has(route))

if (missing.length > 0) {
  throw new Error(`Faltan rutas del codigo en el spec:\n${missing.join('\n')}`)
}

console.log(`Spec valido: ${specRoutes.size} operaciones documentadas`)
