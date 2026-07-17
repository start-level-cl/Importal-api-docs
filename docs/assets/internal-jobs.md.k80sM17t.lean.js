import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, j as createBaseVNode, a as createTextVNode, b as createBlock, w as withCtx, E as createVNode, a0 as Suspense, a1 as createStaticVNode } from "./chunks/framework.UkvNxxWY.js";
const __pageData = JSON.parse('{"title":"Trabajos Internos y Reglas de Negocio (Cron & Backend Jobs)","description":"","frontmatter":{},"headers":[],"relativePath":"internal-jobs.md","filePath":"internal-jobs.md"}');
const _sfc_main = { name: "internal-jobs.md" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  return openBlock(), createElementBlock("div", null, [
    _cache[1] || (_cache[1] = createBaseVNode("h1", {
      id: "trabajos-internos-y-reglas-de-negocio-cron-backend-jobs",
      tabindex: "-1"
    }, [
      createTextVNode("Trabajos Internos y Reglas de Negocio (Cron & Backend Jobs) "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#trabajos-internos-y-reglas-de-negocio-cron-backend-jobs",
        "aria-label": 'Permalink to "Trabajos Internos y Reglas de Negocio (Cron & Backend Jobs)"'
      }, "​")
    ], -1)),
    _cache[2] || (_cache[2] = createBaseVNode("p", null, "La estabilidad financiera y logística de Pascalle Store depende de procesos programados en segundo plano (Cron Jobs) y reglas de validación complejas ejecutadas directamente en el backend de NestJS.", -1)),
    _cache[3] || (_cache[3] = createBaseVNode("hr", null, null, -1)),
    _cache[4] || (_cache[4] = createBaseVNode("h2", {
      id: "_1-facturacion-periodica-y-gestion-de-moras",
      tabindex: "-1"
    }, [
      createTextVNode("1. Facturación Periódica y Gestión de Moras "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#_1-facturacion-periodica-y-gestion-de-moras",
        "aria-label": 'Permalink to "1. Facturación Periódica y Gestión de Moras"'
      }, "​")
    ], -1)),
    _cache[5] || (_cache[5] = createBaseVNode("p", null, "El backend incluye un scheduler interno (o eventos externos de CloudWatch) que ejecutan procesos contables automatizados:", -1)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-13",
          class: "mermaid",
          graph: "graph%20TD%0A%20%20%20%20Trigger%5BGatillo%20Temporal%20%2F%20Admin%20Trigger%5D%20--%3E%20FetchAPI%5BConsulta%20API%20mindicador%5D%0A%20%20%20%20FetchAPI%20--%3E%20Convert%5BConversi%C3%B3n%20USD%20-%3E%20CLP%5D%0A%20%20%20%20Convert%20--%3E%20Calc%5BCalcular%20Costos%20de%20Carga%20y%20Comisiones%5D%0A%20%20%20%20Calc%20--%3E%20Generate%5BGenerar%20Cobros%20y%20PDFs%5D%0A%20%20%20%20Generate%20--%3E%20CheckMora%5BIdentificar%20Facturas%20Vencidas%20OVERDUE%5D%0A%20%20%20%20CheckMora%20--%3E%20ApplyMora%5BAplicar%20Intereses%20de%20Mora%5D%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[6] || (_cache[6] = createStaticVNode("", 16))
  ]);
}
const internalJobs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  internalJobs as default
};
