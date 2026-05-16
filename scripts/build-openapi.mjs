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
const repoRoot = path.resolve(currentDir, '..', '..', '..')
const docsRoot = path.resolve(currentDir, '..')
const generatedDir = path.join(docsRoot, 'generated')
const docsDir = path.join(docsRoot, 'docs')

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
    .topbar {
      display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px;
    }
    input {
      flex: 1 1 280px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line);
      background: var(--card); font: inherit;
    }
    .badge {
      display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 999px;
      background: var(--accent-soft); color: var(--accent); font-size: 12px; letter-spacing: .04em; text-transform: uppercase;
    }
    .section { margin-top: 28px; }
    .service-block {
      margin-top: 32px;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: rgba(255, 253, 248, .68);
      backdrop-filter: blur(6px);
    }
    .service-title {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .service-title h2,
    .role-title h3 {
      margin: 0;
    }
    .service-title h2 { font-size: 26px; }
    .role-block {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed var(--line);
    }
    .role-block:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
    }
    .role-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .endpoint {
      background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px; margin-bottom: 14px;
      box-shadow: 0 10px 30px rgba(74, 54, 36, .06);
    }
    .endpoint header {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;
    }
    .method { font-weight: 700; min-width: 68px; }
    .path { font-family: Consolas, monospace; background: var(--code); padding: 4px 8px; border-radius: 8px; }
    .meta { color: var(--muted); font-size: 14px; }
    details { margin-top: 10px; }
    summary { cursor: pointer; color: var(--accent); }
    pre {
      margin: 12px 0 0; padding: 14px; border-radius: 12px; overflow: auto; background: #201814; color: #f9efe3; font-size: 13px;
    }
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
      </div>
    </section>
    <section id="content"></section>
  </div>
  <script>
    const spec = ${JSON.stringify(spec)};
    const operations = Object.entries(spec.paths).flatMap(([path, methods]) =>
      Object.entries(methods).map(([method, operation]) => ({ path, method, operation }))
    );

    const content = document.getElementById('content');
    const search = document.getElementById('search');

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

    function render(filter = '') {
      const q = filter.trim().toLowerCase();
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

      const groupedByService = groupBy(items, item => item.operation['x-service'] || 'unknown');

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
          <details>
            <summary>Ver operacion</summary>
            <pre>\${escapeHtml(JSON.stringify(operation, null, 2))}</pre>
          </details>
        </article>
      \`;
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
    render();
  </script>
</body>
</html>`
}

const authRoutes = extractNestRoutes({
  repoRoot,
  serviceRoot: 'Importal-auth',
  serviceName: 'auth',
  prefix: '/auth/api',
})

const backendRoutes = extractNestRoutes({
  repoRoot,
  serviceRoot: 'Importal-backend',
  serviceName: 'backend',
  prefix: '/api',
})

const lambdaRoutes = extractLambdaRoutes({
  repoRoot,
  serviceRoot: 'Importal-registration-lambda',
})

const routes = enrichRoutes([...authRoutes, ...backendRoutes, ...lambdaRoutes])

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

fs.writeFileSync(path.join(generatedDir, 'source-routes.json'), JSON.stringify(routes, null, 2))
fs.writeFileSync(path.join(generatedDir, 'duplicate-routes.json'), JSON.stringify(duplicates, null, 2))
fs.writeFileSync(path.join(generatedDir, 'openapi.json'), `${JSON.stringify(spec, null, 2)}\n`)
fs.writeFileSync(path.join(generatedDir, 'openapi.yaml'), `${toYaml(spec)}\n`)
fs.writeFileSync(path.join(generatedDir, 'api-types.d.ts'), `${generateTypeDeclarations(spec)}\n`)
fs.writeFileSync(path.join(docsDir, 'index.html'), createHtml(spec))

console.log(`OpenAPI generado con ${routes.length} rutas fuente y ${duplicates.length} duplicadas`)
