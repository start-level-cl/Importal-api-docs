import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, a1 as createStaticVNode, b as createBlock, w as withCtx, a as createTextVNode, E as createVNode, a0 as Suspense, j as createBaseVNode } from "./chunks/framework.UkvNxxWY.js";
const __pageData = JSON.parse('{"title":"Flujo de Trabajo de Bodega (Bodeguero Workflow)","description":"","frontmatter":{},"headers":[],"relativePath":"bodeguero-workflow.md","filePath":"bodeguero-workflow.md"}');
const _sfc_main = { name: "bodeguero-workflow.md" };
const _hoisted_1 = {
  tabindex: "0",
  class: "MathJax",
  jax: "SVG",
  display: "true",
  style: { "direction": "ltr", "display": "block", "text-align": "center", "margin": "1em 0", "position": "relative" }
};
const _hoisted_2 = {
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "-0.466ex" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "52.917ex",
  height: "2.163ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -750 23389.4 956",
  "aria-hidden": "true"
};
const _hoisted_3 = {
  tabindex: "0",
  class: "MathJax",
  jax: "SVG",
  display: "true",
  style: { "direction": "ltr", "display": "block", "text-align": "center", "margin": "1em 0", "position": "relative" }
};
const _hoisted_4 = {
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "-0.466ex" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "32.391ex",
  height: "2.061ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -705 14317 911",
  "aria-hidden": "true"
};
const _hoisted_5 = {
  tabindex: "0",
  class: "MathJax",
  jax: "SVG",
  display: "true",
  style: { "direction": "ltr", "display": "block", "text-align": "center", "margin": "1em 0", "position": "relative" }
};
const _hoisted_6 = {
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "-0.566ex" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "91.623ex",
  height: "2.262ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -750 40497.3 1000",
  "aria-hidden": "true"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  return openBlock(), createElementBlock("div", null, [
    _cache[14] || (_cache[14] = createStaticVNode("", 9)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-74",
          class: "mermaid",
          graph: "sequenceDiagram%0A%20%20%20%20autonumber%0A%20%20%20%20actor%20B%20as%20Bodeguero%0A%20%20%20%20actor%20C%20as%20Cliente%0A%20%20%20%20participant%20API%20as%20Importal%20Backend%0A%20%20%20%20participant%20DB%20as%20Base%20de%20Datos%0A%0A%20%20%20%20Note%20over%20B%2C%20API%3A%20Paso%201%3A%20Arribo%20de%20Carga%0A%20%20%20%20B-%3E%3EAPI%3A%20PUT%20%2Fapi%2Fv1%2Fbodeguero%2Fcargas%2F%3Aid%2Fstatus%20(ARRIVED)%0A%20%20%20%20API-%3E%3EDB%3A%20Actualiza%20estado%20y%20arrived_at%0A%20%20%20%20Note%20over%20API%3A%20Genera%20Cobros%20de%20Inversi%C3%B3n%20Mar%C3%ADtima%20si%20corresponde%0A%0A%20%20%20%20Note%20over%20B%2C%20API%3A%20Paso%202%3A%20Auditor%C3%ADa%20y%20Revisi%C3%B3n%0A%20%20%20%20B-%3E%3EAPI%3A%20PUT%20%2Fapi%2Fv1%2Fbodeguero%2Fpedidos%2F%3Aid%2Frevisar%20(reviewOrder)%0A%20%20%20%20Note%20over%20API%3A%20Valida%20Arribado%20y%20Cuadratura%20(Llegaron%20%2B%20Faltaron%20%2B%20Da%C3%B1ados)%0A%20%20%20%20alt%20Hay%20Diferencias%20(Faltantes%2FDa%C3%B1ados)%0A%20%20%20%20%20%20%20%20API-%3E%3EDB%3A%20Genera%20OrderAdjustment%20(PENDING_CLIENT)%0A%20%20%20%20%20%20%20%20API-%3E%3EDB%3A%20Marca%20Order.has_pending_adjustment%20%3D%20true%0A%20%20%20%20%20%20%20%20API-%3E%3EC%3A%20Env%C3%ADa%20Notificaci%C3%B3n%20ORDER_ADJUSTMENT_PENDING%0A%20%20%20%20%20%20%20%20Note%20over%20API%3A%20Se%20bloquea%20la%20generaci%C3%B3n%20autom%C3%A1tica%20de%20cobro%20de%20Flete%20y%20Aduana%0A%20%20%20%20else%20Sin%20Diferencias%0A%20%20%20%20%20%20%20%20API-%3E%3EDB%3A%20Marca%20revisado%20%3D%20true%0A%20%20%20%20%20%20%20%20Note%20over%20API%3A%20Genera%20Cobros%20de%20Flete%20y%20Aduana%20si%20todos%20est%C3%A1n%20revisados%0A%20%20%20%20end%0A%0A%20%20%20%20Note%20over%20C%2C%20API%3A%20Paso%203%3A%20Resoluci%C3%B3n%20de%20Ajustes%20(Cliente)%0A%20%20%20%20C-%3E%3EAPI%3A%20POST%20%2Fapi%2Fv1%2Fcliente%2Fajustes%2F%3AadjId%2Fresolver%0A%20%20%20%20API-%3E%3EDB%3A%20Resuelve%20ajuste%2C%20order.has_pending_adjustment%20%3D%20false%0A%20%20%20%20Note%20over%20API%3A%20Genera%20Cobros%20de%20Flete%20y%20Aduana%20para%20la%20carga%20del%20cliente%0A%0A%20%20%20%20Note%20over%20B%2C%20API%3A%20Paso%204%3A%20Empaque%20e%20Inspecci%C3%B3n%20Financiera%0A%20%20%20%20B-%3E%3EAPI%3A%20GET%20%2Fapi%2Fv1%2Fbodeguero%2Fcajas%2F%3Aid%20(Auditor%C3%ADa%20de%20empaque)%0A%20%20%20%20Note%20over%20B%2C%20API%3A%20Paso%205%3A%20Registrar%20Auditor%C3%ADa%20y%20Empaque%20(auditarEmpaque)%0A%20%20%20%20B-%3E%3EAPI%3A%20POST%20%2Fapi%2Fv1%2Fbodeguero%2Fdeliveries%2F%3Aid%2Fauditar-empaque%0A%20%20%20%20Note%20over%20API%3A%20Valida%20que%20cobros%20de%20INVERSION%2C%20LOGISTICA_COMISION%20y%20FLETE_SEGURO_ADUANA%20est%C3%A9n%20pagados%0A%20%20%20%20alt%20Hay%20Cobros%20Pendientes%0A%20%20%20%20%20%20%20%20API--%3E%3EB%3A%20Error%20HTTP%20400%20(Bloqueado%20por%20deuda)%0A%20%20%20%20else%20Pagos%20al%20d%C3%ADa%0A%20%20%20%20%20%20%20%20API-%3E%3EDB%3A%20Cambia%20Delivery%20a%20READY_TO_SHIP%0A%20%20%20%20%20%20%20%20API-%3E%3EDB%3A%20Guarda%20Bultos%20y%20BultoPhotos%0A%20%20%20%20end%0A%0A%20%20%20%20Note%20over%20B%2C%20API%3A%20Paso%206%3A%20Confirmar%20Salida%20F%C3%ADsica%20(shipDelivery)%0A%20%20%20%20B-%3E%3EAPI%3A%20POST%20%2Fapi%2Fv1%2Fbodeguero%2Fdeliveries%2F%3Aid%2Fship%0A%20%20%20%20API-%3E%3EDB%3A%20Cambia%20Delivery%20%26%20Orders%20a%20SHIPPED%0A%20%20%20%20API-%3E%3EC%3A%20Env%C3%ADa%20Notificaci%C3%B3n%20DELIVERY_CONFIRMED%0A%20%20%20%20end%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[15] || (_cache[15] = createStaticVNode("", 11)),
    createBaseVNode("mjx-container", _hoisted_1, [
      (openBlock(), createElementBlock("svg", _hoisted_2, [..._cache[1] || (_cache[1] = [
        createStaticVNode("", 1)
      ])])),
      _cache[2] || (_cache[2] = createBaseVNode("mjx-assistive-mml", {
        unselectable: "on",
        display: "block",
        style: { "top": "0px", "left": "0px", "clip": "rect(1px, 1px, 1px, 1px)", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "position": "absolute", "padding": "1px 0px 0px 0px", "border": "0px", "display": "block", "overflow": "hidden", "width": "100%" }
      }, [
        createBaseVNode("math", {
          xmlns: "http://www.w3.org/1998/Math/MathML",
          display: "block"
        }, [
          createBaseVNode("mtext", null, "Llegaron"),
          createBaseVNode("mo", null, "+"),
          createBaseVNode("mtext", null, "Faltaron"),
          createBaseVNode("mo", null, "+"),
          createBaseVNode("mtext", null, "Dañados"),
          createBaseVNode("mo", null, "=="),
          createBaseVNode("mtext", null, "order.total_items")
        ])
      ], -1))
    ]),
    _cache[16] || (_cache[16] = createStaticVNode("", 6)),
    createBaseVNode("ol", null, [
      _cache[12] || (_cache[12] = createStaticVNode("", 2)),
      createBaseVNode("li", null, [
        _cache[10] || (_cache[10] = createBaseVNode("strong", null, "Recálculo Financiero Automático:", -1)),
        _cache[11] || (_cache[11] = createTextVNode(" El backend calcula de forma preventiva los reembolsos en CLP: ", -1)),
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            _cache[7] || (_cache[7] = createBaseVNode("strong", null, "Inversión Reembolsable:", -1)),
            _cache[8] || (_cache[8] = createTextVNode(" Calculada sobre la diferencia física:", -1)),
            createBaseVNode("mjx-container", _hoisted_3, [
              (openBlock(), createElementBlock("svg", _hoisted_4, [..._cache[3] || (_cache[3] = [
                createStaticVNode("", 1)
              ])])),
              _cache[4] || (_cache[4] = createBaseVNode("mjx-assistive-mml", {
                unselectable: "on",
                display: "block",
                style: { "top": "0px", "left": "0px", "clip": "rect(1px, 1px, 1px, 1px)", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "position": "absolute", "padding": "1px 0px 0px 0px", "border": "0px", "display": "block", "overflow": "hidden", "width": "100%" }
              }, [
                createBaseVNode("math", {
                  xmlns: "http://www.w3.org/1998/Math/MathML",
                  display: "block"
                }, [
                  createBaseVNode("mtext", null, "Diferencia"),
                  createBaseVNode("mo", null, "="),
                  createBaseVNode("mtext", null, "Original"),
                  createBaseVNode("mo", null, "−"),
                  createBaseVNode("mtext", null, "Llegaron")
                ])
              ], -1))
            ]),
            createBaseVNode("mjx-container", _hoisted_5, [
              (openBlock(), createElementBlock("svg", _hoisted_6, [..._cache[5] || (_cache[5] = [
                createStaticVNode("", 1)
              ])])),
              _cache[6] || (_cache[6] = createBaseVNode("mjx-assistive-mml", {
                unselectable: "on",
                display: "block",
                style: { "top": "0px", "left": "0px", "clip": "rect(1px, 1px, 1px, 1px)", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "position": "absolute", "padding": "1px 0px 0px 0px", "border": "0px", "display": "block", "overflow": "hidden", "width": "100%" }
              }, [
                createBaseVNode("math", {
                  xmlns: "http://www.w3.org/1998/Math/MathML",
                  display: "block"
                }, [
                  createBaseVNode("mtext", null, "Reembolso Inversión"),
                  createBaseVNode("mo", null, "="),
                  createBaseVNode("mtext", null, "Diferencia"),
                  createBaseVNode("mo", null, "×"),
                  createBaseVNode("mtext", null, "Precio USD"),
                  createBaseVNode("mo", null, "×"),
                  createBaseVNode("mtext", null, "Tasa de Cambio"),
                  createBaseVNode("mo", null, "×"),
                  createBaseVNode("mo", { stretchy: "false" }, "("),
                  createBaseVNode("mn", null, "1"),
                  createBaseVNode("mo", null, "+"),
                  createBaseVNode("mtext", null, "Tasa Impuesto %"),
                  createBaseVNode("mo", { stretchy: "false" }, ")")
                ])
              ], -1))
            ])
          ]),
          _cache[9] || (_cache[9] = createBaseVNode("li", null, [
            createBaseVNode("strong", null, "Logística/Comisión Recalculada:"),
            createTextVNode(" Se evalúa el nuevo total de compra del cliente en la carga y se recalcula su porcentaje de comisión a través de los tramos de la tabla "),
            createBaseVNode("code", null, "CommissionTier"),
            createTextVNode(". La diferencia entre la comisión original cobrada y la nueva comisión ajustada se asigna como "),
            createBaseVNode("code", null, "refund_comision_clp"),
            createTextVNode(".")
          ], -1))
        ])
      ]),
      _cache[13] || (_cache[13] = createStaticVNode("", 2))
    ]),
    _cache[17] || (_cache[17] = createStaticVNode("", 44))
  ]);
}
const bodegueroWorkflow = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  bodegueroWorkflow as default
};
