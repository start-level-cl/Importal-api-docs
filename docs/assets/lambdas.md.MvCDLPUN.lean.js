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
    _cache[5] || (_cache[5] = createStaticVNode("", 17))
  ]);
}
const lambdas = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  lambdas as default
};
