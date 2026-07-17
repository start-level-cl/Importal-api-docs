import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, j as createBaseVNode, a as createTextVNode, b as createBlock, w as withCtx, E as createVNode, a0 as Suspense, a1 as createStaticVNode } from "./chunks/framework.UkvNxxWY.js";
const __pageData = JSON.parse('{"title":"Registro y Lambdas (Serverless)","description":"","frontmatter":{},"headers":[],"relativePath":"lambdas.md","filePath":"lambdas.md"}');
const _sfc_main = { name: "lambdas.md" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  return openBlock(), createElementBlock("div", null, [
    _cache[1] || (_cache[1] = createBaseVNode("h1", {
      id: "registro-y-lambdas-serverless",
      tabindex: "-1"
    }, [
      createTextVNode("Registro y Lambdas (Serverless) "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#registro-y-lambdas-serverless",
        "aria-label": 'Permalink to "Registro y Lambdas (Serverless)"'
      }, "​")
    ], -1)),
    _cache[2] || (_cache[2] = createBaseVNode("p", null, "Para optimizar costos, mejorar el rendimiento y evitar la persistencia de usuarios basura o spam en la base de datos relacional PostgreSQL, Pascalle Store utiliza un flujo de registro serverless basado en AWS Lambdas y bases de datos NoSQL.", -1)),
    _cache[3] || (_cache[3] = createBaseVNode("h2", {
      id: "flujo-de-registro-de-usuarios",
      tabindex: "-1"
    }, [
      createTextVNode("Flujo de Registro de Usuarios "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#flujo-de-registro-de-usuarios",
        "aria-label": 'Permalink to "Flujo de Registro de Usuarios"'
      }, "​")
    ], -1)),
    _cache[4] || (_cache[4] = createBaseVNode("p", null, "El registro de nuevos clientes, inversores o bodegueros se gestiona temporalmente fuera del backend NestJS principal:", -1)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-12",
          class: "mermaid",
          graph: "sequenceDiagram%0A%20%20%20%20actor%20Usuario%0A%20%20%20%20participant%20Lambda%20as%20Importal-registration-lambda%0A%20%20%20%20participant%20Dynamo%20as%20DynamoDB%0A%20%20%20%20participant%20SQS%20as%20SQS%20Queue%0A%20%20%20%20participant%20Notif%20as%20Importal-notification-lambda%0A%20%20%20%20participant%20Admin%20as%20Panel%20Admin%20NestJS%0A%20%20%20%20participant%20Backend%20as%20Backend%20NestJS%0A%0A%20%20%20%20Usuario-%3E%3ELambda%3A%20POST%20%2Fregistration-requests%20(Datos%20%2B%20Comprobante)%0A%20%20%20%20Note%20over%20Lambda%3A%20Valida%20campos%20y%20genera%20OTPs%0A%20%20%20%20Lambda-%3E%3EDynamo%3A%20Guarda%20solicitud%20(Status%3A%20PENDING)%0A%20%20%20%20Lambda-%3E%3ESQS%3A%20Encola%20mensaje%20de%20env%C3%ADo%20OTP%20(Email%20%2F%20SMS)%0A%20%20%20%20SQS-%3E%3ENotif%3A%20Trigger%20Lambda%20de%20Notificaciones%0A%20%20%20%20Notif--%3E%3EUsuario%3A%20Env%C3%ADa%20SMS%20y%20Email%20con%20c%C3%B3digo%20OTP%0A%20%20%20%20%0A%20%20%20%20Usuario-%3E%3ELambda%3A%20POST%20%2Fregistration-requests%2F%7Bemail%7D%2Fverify%20(Ingresa%20c%C3%B3digo)%0A%20%20%20%20Note%20over%20Lambda%3A%20Compara%20OTP%20contra%20DynamoDB%0A%20%20%20%20Lambda-%3E%3EDynamo%3A%20Actualiza%20is_verified%20%3D%20true%0A%20%20%20%20%0A%20%20%20%20Admin-%3E%3EBackend%3A%20POST%20%2Fregistration-requests%2F%7Bemail%7D%2Fapprove%0A%20%20%20%20Note%20over%20Backend%3A%20Crea%20usuario%20en%20Postgres%20y%20Cognito%2FAuth%0A%20%20%20%20Note%20over%20Backend%3A%20Genera%20ClientCredit%20(Inversi%C3%B3n%20Inicial)%20si%20rol%20es%20CLIENT%0A%20%20%20%20Backend-%3E%3EDynamo%3A%20Marca%20en%20DynamoDB%20(Status%3A%20APPROVED)%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[5] || (_cache[5] = createStaticVNode('<hr><h2 id="servicios-involucrados" tabindex="-1">Servicios Involucrados <a class="header-anchor" href="#servicios-involucrados" aria-label="Permalink to &quot;Servicios Involucrados&quot;">​</a></h2><h3 id="_1-importal-registration-lambda" tabindex="-1">1. <code>Importal-registration-lambda</code> <a class="header-anchor" href="#_1-importal-registration-lambda" aria-label="Permalink to &quot;1. `Importal-registration-lambda`&quot;">​</a></h3><ul><li><strong>Tecnología:</strong> Node.js.</li><li><strong>Propósito:</strong> Actúa como el primer punto de contacto para nuevos registros.</li><li><strong>Almacenamiento Temporal:</strong> Lee y escribe en una tabla de <strong>Amazon DynamoDB</strong>. Almacena la contraseña hasheada, datos personales, la firma del consentimiento y los metadatos del comprobante de transferencia subido.</li><li><strong>Verificación de Doble Canal (2FA):</strong><ul><li>Genera dos códigos OTP independientes (uno para correo electrónico y otro para teléfono móvil).</li><li>Cuando el usuario ingresa el código correcto en cada canal, actualiza <code>is_email_verified</code> y <code>is_phone_verified</code>.</li><li>La solicitud sólo queda lista para revisión administrativa cuando ambos canales están validados (<code>is_verified = true</code>).</li></ul></li></ul><h3 id="_2-importal-notification-lambda" tabindex="-1">2. <code>Importal-notification-lambda</code> <a class="header-anchor" href="#_2-importal-notification-lambda" aria-label="Permalink to &quot;2. `Importal-notification-lambda`&quot;">​</a></h3><ul><li><strong>Tecnología:</strong> Node.js.</li><li><strong>Propósito:</strong> Suscrita a colas de Amazon SQS (Simple Queue Service) para procesar de manera asíncrona todos los envíos de notificaciones.</li><li><strong>Canales Soportados:</strong><ul><li><strong>Email:</strong> Envío de correos transaccionales (OTP, confirmación de pagos, facturas en PDF).</li><li><strong>SMS:</strong> Códigos rápidos de autenticación móvil.</li><li><strong>WhatsApp:</strong> Alertas de estado logístico (&quot;Tu carga ha arribado a Santiago&quot;).</li></ul></li></ul><hr><h2 id="credito-de-inversion-inicial-al-registro" tabindex="-1">Crédito de Inversión Inicial al Registro <a class="header-anchor" href="#credito-de-inversion-inicial-al-registro" aria-label="Permalink to &quot;Crédito de Inversión Inicial al Registro&quot;">​</a></h2><p>Al momento de que un administrador aprueba una solicitud de registro (<code>POST /registration-requests/{email}/approve</code>), si el rol asignado al usuario es <code>CLIENT</code>, el backend de Pascalle Store genera automáticamente un crédito de inversión inicial.</p><h3 id="reglas-de-negocio" tabindex="-1">Reglas de Negocio <a class="header-anchor" href="#reglas-de-negocio" aria-label="Permalink to &quot;Reglas de Negocio&quot;">​</a></h3><ul><li><strong>1 sala (tipo de transporte):</strong> Si el cliente seleccionó solo 1 tipo de transporte (aéreo o marítimo), se le otorga un crédito de <strong>$50.000 CLP</strong>.</li><li><strong>2 salas (tipos de transporte):</strong> Si el cliente seleccionó ambos tipos de transporte (aéreo y marítimo), se le otorga un crédito de <strong>$100.000 CLP</strong>.</li></ul><h3 id="registro-en-base-de-datos" tabindex="-1">Registro en Base de Datos <a class="header-anchor" href="#registro-en-base-de-datos" aria-label="Permalink to &quot;Registro en Base de Datos&quot;">​</a></h3><p>Este crédito se persiste en la tabla <code>client_credits</code> mapeado bajo la entidad <code>ClientCredit</code> con la siguiente lógica:</p><ul><li><strong><code>client_id</code></strong>: Referencia al ID único del cliente aprobado en la tabla <code>users</code> (<code>saved.id</code>).</li><li><strong><code>amount_clp</code></strong>: Monto asignado ($50.000 o $100.000 CLP según la cantidad de salas).</li><li><strong><code>remaining_amount_clp</code></strong>: Inicializado con el mismo valor que <code>amount_clp</code>.</li><li><strong><code>notes</code></strong>: Texto descriptivo que indica la inversión inicial y el número de salas seleccionadas (ej. <code>Inversión inicial - Registro de cliente (X salas)</code>).</li><li><strong><code>order_adjustment_id</code></strong>: Se inicializa en <code>null</code>.</li></ul><hr><h2 id="ventajas-de-este-diseno" tabindex="-1">Ventajas de este Diseño <a class="header-anchor" href="#ventajas-de-este-diseno" aria-label="Permalink to &quot;Ventajas de este Diseño&quot;">​</a></h2><ol><li><strong>Protección de Base de Datos Core:</strong> PostgreSQL solo almacena cuentas validadas y activas. El spam y registros inconclusos mueren por TTL en DynamoDB.</li><li><strong>Desacoplamiento Financiero:</strong> La subida de comprobantes de pago pesados en Base64 se guarda directamente en buckets de Amazon S3 temporales mediante URLs firmadas, sin consumir ancho de banda de la base de datos PostgreSQL.</li><li><strong>Escalabilidad:</strong> SQS absorbe los picos de tráfico de notificaciones durante cierres de cargas o campañas de facturación periódica.</li></ol>', 17))
  ]);
}
const lambdas = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  lambdas as default
};
