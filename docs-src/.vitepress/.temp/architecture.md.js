import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Arquitectura Global del Sistema","description":"","frontmatter":{},"headers":[],"relativePath":"architecture.md","filePath":"architecture.md"}');
const _sfc_main = { name: "architecture.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="arquitectura-global-del-sistema" tabindex="-1">Arquitectura Global del Sistema <a class="header-anchor" href="#arquitectura-global-del-sistema" aria-label="Permalink to &quot;Arquitectura Global del Sistema&quot;">​</a></h1><p>Pascalle Store opera bajo una arquitectura híbrida que combina microservicios tradicionales en contenedores (NestJS) y servicios serverless orientados a eventos (AWS Lambdas), administrados mediante Infraestructura como Código (IaC).</p><h2 id="componentes-del-ecosistema" tabindex="-1">Componentes del Ecosistema <a class="header-anchor" href="#componentes-del-ecosistema" aria-label="Permalink to &quot;Componentes del Ecosistema&quot;">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-9",
        class: "mermaid",
        graph: "graph%20TD%0A%20%20%20%20Client%5BCliente%20%2F%20Vendedor%20%2F%20Bodeguero%5D%20--%3E%7CHTTPS%7C%20APIGateway%5BAPI%20Gateway%20%2F%20Ingress%5D%0A%20%20%20%20%0A%20%20%20%20APIGateway%20--%3E%7C%2Fauth%2F*%7C%20AuthServ%5BImportal-auth%20%3Cbr%3E%20NestJS%20%2F%20Redis%5D%0A%20%20%20%20APIGateway%20--%3E%7C%2Fapi%2F*%7C%20BackServ%5BImportal-backend%20%3Cbr%3E%20NestJS%20%2F%20PostgreSQL%5D%0A%20%20%20%20APIGateway%20--%3E%7C%2Fregistration-requests%2F*%7C%20RegLambda%5BImportal-registration-lambda%20%3Cbr%3E%20Node.js%20%2F%20DynamoDB%5D%0A%20%20%20%20%0A%20%20%20%20BackServ%20--%3E%7CEventos%20SQS%7C%20NotifLambda%5BImportal-notification-lambda%5D%0A%20%20%20%20RegLambda%20--%3E%7CEventos%20SQS%7C%20NotifLambda%0A%20%20%20%20%0A%20%20%20%20NotifLambda%20--%3E%7CEnv%C3%ADo%7C%20SMS%5BServicios%20SMS%20%2F%20Email%20%2F%20WA%5D%0A%20%20%20%20%0A%20%20%20%20subgraph%20Almacenamiento%0A%20%20%20%20%20%20%20%20Postgres%5B(PostgreSQL)%5D%20%3C--%3E%20BackServ%0A%20%20%20%20%20%20%20%20Dynamo%5B(DynamoDB)%5D%20%3C--%3E%20RegLambda%0A%20%20%20%20end%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h3 id="_1-aplicacion-frontend-importal-frontend" tabindex="-1">1. Aplicación Frontend (<code>Importal-frontend</code>) <a class="header-anchor" href="#_1-aplicacion-frontend-importal-frontend" aria-label="Permalink to &quot;1. Aplicación Frontend (\`Importal-frontend\`)&quot;">​</a></h3><p>La interfaz de usuario principal de la plataforma, que interactúa directamente con los endpoints expuestos por los microservicios.</p><h3 id="_2-microservicio-de-autenticacion-importal-auth" tabindex="-1">2. Microservicio de Autenticación (<code>Importal-auth</code>) <a class="header-anchor" href="#_2-microservicio-de-autenticacion-importal-auth" aria-label="Permalink to &quot;2. Microservicio de Autenticación (\`Importal-auth\`)&quot;">​</a></h3><ul><li><strong>Framework:</strong> NestJS.</li><li><strong>Función:</strong> Centraliza la autenticación, generación de tokens JWT de corta duración, refresh tokens, validación de sesiones y roles de usuario.</li><li><strong>Almacenamiento:</strong> Utiliza un caché rápido en memoria (como Redis) para gestionar la invalidación de tokens activos.</li></ul><h3 id="_3-backend-core-importal-backend" tabindex="-1">3. Backend Core (<code>Importal-backend</code>) <a class="header-anchor" href="#_3-backend-core-importal-backend" aria-label="Permalink to &quot;3. Backend Core (\`Importal-backend\`)&quot;">​</a></h3><ul><li><strong>Framework:</strong> NestJS.</li><li><strong>Función:</strong> Aloja la lógica transaccional de negocio compleja: productos, inventario, stock, cobros, facturación periódica y control logístico.</li><li><strong>Roles del Backend:</strong><ul><li><code>client</code>: Consulta catálogo, reserva stock y realiza pagos.</li><li><code>vendedor</code>: Gestiona productos, confirma pedidos y solicita tránsitos de carga.</li><li><code>bodeguero</code>: Gestiona el arribo de cargas y auditoría física de mercadería.</li><li><code>admin</code> / <code>root</code>: Control absoluto, conciliación de pagos y cierre de cargas.</li></ul></li><li><strong>Almacenamiento:</strong> PostgreSQL relacional para transaccionalidad e integridad referencial.</li></ul><h3 id="_4-lambdas-de-procesamiento-asincrono" tabindex="-1">4. Lambdas de Procesamiento Asíncrono <a class="header-anchor" href="#_4-lambdas-de-procesamiento-asincrono" aria-label="Permalink to &quot;4. Lambdas de Procesamiento Asíncrono&quot;">​</a></h3><ul><li><strong><code>Importal-registration-lambda</code></strong>: Se ejecuta de forma serverless. Maneja las solicitudes temporales de registro para evitar saturar PostgreSQL. Almacena en DynamoDB, envía OTPs de verificación de doble factor y finalmente crea el usuario en Postgres/Auth tras la aprobación administrativa.</li><li><strong><code>Importal-notification-lambda</code></strong>: Consume mensajes desde colas SQS para despachar correos electrónicos, SMS o WhatsApp en segundo plano sin bloquear el flujo principal de las APIs.</li></ul><h3 id="_5-infraestructura-como-codigo-importal-iac" tabindex="-1">5. Infraestructura como Código (<code>Importal-iac</code>) <a class="header-anchor" href="#_5-infraestructura-como-codigo-importal-iac" aria-label="Permalink to &quot;5. Infraestructura como Código (\`Importal-iac\`)&quot;">​</a></h3><p>Todos los recursos cloud (VPC, bases de datos RDS, tablas DynamoDB, colas SQS, buckets de S3 y políticas IAM) están versionados y administrados a través de herramientas IaC en este repositorio.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("architecture.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const architecture = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  architecture as default
};
