import fs from 'node:fs'
import path from 'node:path'

const requiredFiles = [
  'docs/index.html',
  'generated/openapi.json',
  'generated/openapi.yaml',
  'generated/api-types.d.ts',
]

for (const filePath of requiredFiles) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Falta artefacto requerido: ${filePath}`)
  }
}

const html = fs.readFileSync(path.join('docs', 'index.html'), 'utf8')

if (!/<html[\s>]/i.test(html) || !/<\/html>/i.test(html)) {
  throw new Error('docs/index.html no contiene una estructura HTML valida')
}

if (!/<title>[^<]+<\/title>/i.test(html)) {
  throw new Error('docs/index.html no contiene un titulo HTML')
}

const spec = JSON.parse(fs.readFileSync(path.join('generated', 'openapi.json'), 'utf8'))

if (!spec.openapi || !spec.info || !spec.paths) {
  throw new Error('generated/openapi.json no contiene openapi/info/paths')
}

if (Object.keys(spec.paths).length === 0) {
  throw new Error('generated/openapi.json no contiene rutas documentadas')
}

console.log(`Documentacion estatica valida: ${Object.keys(spec.paths).length} rutas documentadas`)
