import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"Pascalle Store Docs","text":"Portal Técnico de la Plataforma","tagline":"Documentación unificada de Backend, Auth, Lambdas y Arquitectura de Sistemas","actions":[{"theme":"brand","text":"Comenzar Guías","link":"/architecture"},{"theme":"alt","text":"Referencia API","link":"/reference.html"}],"image":{"src":"https://vitepress.dev/vitepress-logo-large.png","alt":"Pascalle Store Logo"}},"features":[{"icon":"🛡️","title":"Autenticación Unificada (Auth)","details":"Flujo de tokens JWT de corta duración y refresh tokens en cookies seguras HTTPS/Only."},{"icon":"⚙️","title":"Backend NestJS","details":"Lógica de negocio transaccional para Clientes, Vendedores y Bodegueros con PostgreSQL."},{"icon":"⚡","title":"Arquitectura Serverless (Lambdas)","details":"Microservicios en AWS Lambdas para el flujo de registro, verificación OTP y colas SQS."},{"icon":"📈","title":"Tareas Programadas y Cron Jobs","details":"Conciliación financiera de pagos, cálculo de moras con intereses y reportes PDF."}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
