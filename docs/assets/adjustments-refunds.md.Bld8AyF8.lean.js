import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, j as createBaseVNode, a as createTextVNode, b as createBlock, w as withCtx, E as createVNode, a0 as Suspense, a1 as createStaticVNode } from "./chunks/framework.UkvNxxWY.js";
const __pageData = JSON.parse('{"title":"Ajustes de Pedidos y Reembolsos","description":"","frontmatter":{},"headers":[],"relativePath":"adjustments-refunds.md","filePath":"adjustments-refunds.md"}');
const _sfc_main = { name: "adjustments-refunds.md" };
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
  width: "44.939ex",
  height: "2.086ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -716 19863 922",
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
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "-0.566ex" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "86.27ex",
  height: "2.262ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -750 38131.3 1000",
  "aria-hidden": "true"
};
const _hoisted_5 = {
  class: "MathJax",
  jax: "SVG",
  style: { "direction": "ltr", "position": "relative" }
};
const _hoisted_6 = {
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "0" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "2.009ex",
  height: "1.545ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -683 888 683",
  "aria-hidden": "true"
};
const _hoisted_7 = {
  tabindex: "0",
  class: "MathJax",
  jax: "SVG",
  display: "true",
  style: { "direction": "ltr", "display": "block", "text-align": "center", "margin": "1em 0", "position": "relative" }
};
const _hoisted_8 = {
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "-2.018ex" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "88.569ex",
  height: "5.143ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -1381 39147.6 2273",
  "aria-hidden": "true"
};
const _hoisted_9 = {
  tabindex: "0",
  class: "MathJax",
  jax: "SVG",
  display: "true",
  style: { "direction": "ltr", "display": "block", "text-align": "center", "margin": "1em 0", "position": "relative" }
};
const _hoisted_10 = {
  style: { "overflow": "visible", "min-height": "1px", "min-width": "1px", "vertical-align": "-3.078ex" },
  xmlns: "http://www.w3.org/2000/svg",
  width: "99.561ex",
  height: "5.227ex",
  role: "img",
  focusable: "false",
  viewBox: "0 -950 44005.9 2310.5",
  "aria-hidden": "true"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  return openBlock(), createElementBlock("div", null, [
    _cache[25] || (_cache[25] = createBaseVNode("h1", {
      id: "ajustes-de-pedidos-y-reembolsos",
      tabindex: "-1"
    }, [
      createTextVNode("Ajustes de Pedidos y Reembolsos "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#ajustes-de-pedidos-y-reembolsos",
        "aria-label": 'Permalink to "Ajustes de Pedidos y Reembolsos"'
      }, "​")
    ], -1)),
    _cache[26] || (_cache[26] = createBaseVNode("p", null, [
      createTextVNode("El sistema de Pascalle Store cuenta con un ciclo estructurado para manejar diferencias de stock o incidencias en los pedidos a través de "),
      createBaseVNode("strong", null, "Ajustes y Reembolsos"),
      createTextVNode(". Permite a los vendedores reducir las unidades de un pedido y a los clientes elegir cómo ser compensados.")
    ], -1)),
    _cache[27] || (_cache[27] = createBaseVNode("hr", null, null, -1)),
    _cache[28] || (_cache[28] = createBaseVNode("h2", {
      id: "flujo-del-proceso-de-ajustes",
      tabindex: "-1"
    }, [
      createTextVNode("Flujo del Proceso de Ajustes "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#flujo-del-proceso-de-ajustes",
        "aria-label": 'Permalink to "Flujo del Proceso de Ajustes"'
      }, "​")
    ], -1)),
    _cache[29] || (_cache[29] = createBaseVNode("p", null, [
      createTextVNode("El flujo de vida de un ajuste de orden consta de tres fases principales: "),
      createBaseVNode("strong", null, "Creación, Resolución y Cierre"),
      createTextVNode(".")
    ], -1)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-13",
          class: "mermaid",
          graph: "stateDiagram-v2%0A%20%20%20%20%5B*%5D%20--%3E%20PENDING_CLIENT%20%3A%20Vendedor%20crea%20ajuste%20(adjustOrder)%0A%20%20%20%20%0A%20%20%20%20state%20PENDING_CLIENT%20%7B%0A%20%20%20%20%20%20%20%20%5B*%5D%20--%3E%20Acepta_Parcial%20%3A%20Cliente%20acepta%20(accept_partial%20%3D%20true)%0A%20%20%20%20%20%20%20%20%5B*%5D%20--%3E%20Rechaza_Parcial%20%3A%20Cliente%20rechaza%20(accept_partial%20%3D%20false)%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20Acepta_Parcial%20--%3E%20COMPLETED%20%3A%20Si%20elige%20CREDIT_NEXT_BILL%20o%20PARTIAL_DEDUCTION%0A%20%20%20%20Acepta_Parcial%20--%3E%20RESOLVED%20%3A%20Si%20elige%20FULL_REFUND%0A%20%20%20%20Acepta_Parcial%20--%3E%20BARTER_WAITING%20%3A%20Si%20elige%20BARTER_NEGOTIATION%0A%20%20%20%20%0A%20%20%20%20Rechaza_Parcial%20--%3E%20COMPLETED%20%3A%20Si%20elige%20CREDIT_NEXT_BILL%20o%20PARTIAL_DEDUCTION%0A%20%20%20%20Rechaza_Parcial%20--%3E%20RESOLVED%20%3A%20Si%20elige%20FULL_REFUND%0A%20%20%20%20Rechaza_Parcial%20--%3E%20BARTER_WAITING%20%3A%20Si%20elige%20BARTER_NEGOTIATION%0A%20%20%20%20%0A%20%20%20%20BARTER_WAITING%20--%3E%20COMPLETED%20%3A%20Acepta%20propuesta%20trueque%20(cliente)%0A%20%20%20%20BARTER_WAITING%20--%3E%20PENDING_CLIENT%20%3A%20Rechaza%20o%20cancela%20trueque%20(cliente%2Fadmin)%0A%20%20%20%20%0A%20%20%20%20RESOLVED%20--%3E%20COMPLETED%20%3A%20Administrador%20procesa%20(completeRefund)%0A%20%20%20%20COMPLETED%20--%3E%20%5B*%5D%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[30] || (_cache[30] = createBaseVNode("h3", {
      id: "_1-solicitud-de-ajuste-vendedor",
      tabindex: "-1"
    }, [
      createTextVNode("1. Solicitud de Ajuste (Vendedor) "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#_1-solicitud-de-ajuste-vendedor",
        "aria-label": 'Permalink to "1. Solicitud de Ajuste (Vendedor)"'
      }, "​")
    ], -1)),
    _cache[31] || (_cache[31] = createBaseVNode("p", null, "Cuando un vendedor no puede cumplir con la cantidad total de un pedido, solicita un ajuste desde su panel:", -1)),
    createBaseVNode("ul", null, [
      _cache[10] || (_cache[10] = createBaseVNode("li", null, [
        createBaseVNode("strong", null, "Endpoint:"),
        createTextVNode(),
        createBaseVNode("code", null, "PUT /api/v1/vendedor/pedidos/{id}/ajustar")
      ], -1)),
      _cache[11] || (_cache[11] = createBaseVNode("li", null, [
        createBaseVNode("strong", null, "Acción:"),
        createTextVNode(" Se define una cantidad ajustada ("),
        createBaseVNode("code", null, "adjusted_quantity"),
        createTextVNode(") menor que la original.")
      ], -1)),
      createBaseVNode("li", null, [
        _cache[9] || (_cache[9] = createBaseVNode("strong", null, "Cálculo de Reembolsos (Si el pedido ya fue cobrado):", -1)),
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            _cache[5] || (_cache[5] = createBaseVNode("strong", null, "Inversión (Inversión en CLP):", -1)),
            _cache[6] || (_cache[6] = createTextVNode(" Se calcula sobre la diferencia de ítems.", -1)),
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
                  createBaseVNode("mtext", null, "Diferencia"),
                  createBaseVNode("mo", null, "="),
                  createBaseVNode("mtext", null, "Cant. Original"),
                  createBaseVNode("mo", null, "−"),
                  createBaseVNode("mtext", null, "Cant. Ajustada")
                ])
              ], -1))
            ]),
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
                  createBaseVNode("mtext", null, "Impuesto %"),
                  createBaseVNode("mo", { stretchy: "false" }, ")")
                ])
              ], -1))
            ]),
            _cache[7] || (_cache[7] = createBaseVNode("em", null, "(Por defecto el impuesto es 8.25%)", -1))
          ]),
          _cache[8] || (_cache[8] = createBaseVNode("li", null, [
            createBaseVNode("strong", null, "Comisión de Logística:"),
            createTextVNode(" Se recalcula la comisión del cliente en la carga. Al cambiar la base del pedido, el porcentaje de la comisión puede variar según los tramos de la tabla "),
            createBaseVNode("code", null, "CommissionTier"),
            createTextVNode(". La diferencia entre la comisión original y la nueva comisión es el reembolso para el cliente.")
          ], -1))
        ])
      ]),
      _cache[12] || (_cache[12] = createBaseVNode("li", null, [
        createBaseVNode("strong", null, "Estado inicial:"),
        createTextVNode(" El ajuste queda en estado "),
        createBaseVNode("code", null, "PENDING_CLIENT"),
        createTextVNode(".")
      ], -1))
    ]),
    _cache[32] || (_cache[32] = createStaticVNode("", 11)),
    createBaseVNode("ol", null, [
      _cache[24] || (_cache[24] = createBaseVNode("li", null, [
        createBaseVNode("strong", null, "Costo de Flete de Caja Individual:"),
        createTextVNode(" Se calcula el costo flete total de cada caja según su tamaño parametrizado ("),
        createBaseVNode("code", null, "caja_size"),
        createTextVNode(").")
      ], -1)),
      createBaseVNode("li", null, [
        _cache[17] || (_cache[17] = createBaseVNode("strong", null, "Costo Proporcional por Pedido:", -1)),
        _cache[18] || (_cache[18] = createTextVNode(" En una caja compartida por ", -1)),
        createBaseVNode("mjx-container", _hoisted_5, [
          (openBlock(), createElementBlock("svg", _hoisted_6, [..._cache[13] || (_cache[13] = [
            createBaseVNode("g", {
              stroke: "currentColor",
              fill: "currentColor",
              "stroke-width": "0",
              transform: "scale(1,-1)"
            }, [
              createBaseVNode("g", { "data-mml-node": "math" }, [
                createBaseVNode("g", { "data-mml-node": "mi" }, [
                  createBaseVNode("path", {
                    "data-c": "1D441",
                    d: "M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z",
                    style: { "stroke-width": "3" }
                  })
                ])
              ])
            ], -1)
          ])])),
          _cache[14] || (_cache[14] = createBaseVNode("mjx-assistive-mml", {
            unselectable: "on",
            display: "inline",
            style: { "top": "0px", "left": "0px", "clip": "rect(1px, 1px, 1px, 1px)", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "position": "absolute", "padding": "1px 0px 0px 0px", "border": "0px", "display": "block", "width": "auto", "overflow": "hidden" }
          }, [
            createBaseVNode("math", { xmlns: "http://www.w3.org/1998/Math/MathML" }, [
              createBaseVNode("mi", null, "N")
            ])
          ], -1))
        ]),
        _cache[19] || (_cache[19] = createTextVNode(" pedidos, la porción del flete correspondiente a cada pedido se calcula dividiendo el costo total de la caja de forma equitativa:", -1)),
        createBaseVNode("mjx-container", _hoisted_7, [
          (openBlock(), createElementBlock("svg", _hoisted_8, [..._cache[15] || (_cache[15] = [
            createStaticVNode("", 1)
          ])])),
          _cache[16] || (_cache[16] = createBaseVNode("mjx-assistive-mml", {
            unselectable: "on",
            display: "block",
            style: { "top": "0px", "left": "0px", "clip": "rect(1px, 1px, 1px, 1px)", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "position": "absolute", "padding": "1px 0px 0px 0px", "border": "0px", "display": "block", "overflow": "hidden", "width": "100%" }
          }, [
            createBaseVNode("math", {
              xmlns: "http://www.w3.org/1998/Math/MathML",
              display: "block"
            }, [
              createBaseVNode("mtext", null, "Costo Proporcional del Pedido "),
              createBaseVNode("mi", null, "P"),
              createBaseVNode("mtext", null, " en Caja "),
              createBaseVNode("mi", null, "C"),
              createBaseVNode("mo", null, "="),
              createBaseVNode("mfrac", null, [
                createBaseVNode("mrow", null, [
                  createBaseVNode("mtext", null, "Costo Flete Total de la Caja "),
                  createBaseVNode("mi", null, "C")
                ]),
                createBaseVNode("mrow", null, [
                  createBaseVNode("mtext", null, "Cantidad de Pedidos Asignados a la Caja "),
                  createBaseVNode("mi", null, "C")
                ])
              ])
            ])
          ], -1))
        ])
      ]),
      createBaseVNode("li", null, [
        _cache[22] || (_cache[22] = createBaseVNode("strong", null, "Acumulación de Flete Final:", -1)),
        _cache[23] || (_cache[23] = createTextVNode(" Si un pedido está distribuido físicamente en múltiples cajas, su flete total facturado es la sumatoria de todas las porciones proporcionales calculadas en cada caja donde tenga presencia:", -1)),
        createBaseVNode("mjx-container", _hoisted_9, [
          (openBlock(), createElementBlock("svg", _hoisted_10, [..._cache[20] || (_cache[20] = [
            createStaticVNode("", 1)
          ])])),
          _cache[21] || (_cache[21] = createBaseVNode("mjx-assistive-mml", {
            unselectable: "on",
            display: "block",
            style: { "top": "0px", "left": "0px", "clip": "rect(1px, 1px, 1px, 1px)", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", "position": "absolute", "padding": "1px 0px 0px 0px", "border": "0px", "display": "block", "overflow": "hidden", "width": "100%" }
          }, [
            createBaseVNode("math", {
              xmlns: "http://www.w3.org/1998/Math/MathML",
              display: "block"
            }, [
              createBaseVNode("mtext", null, "Flete Total Facturado para el Pedido "),
              createBaseVNode("mi", null, "P"),
              createBaseVNode("mo", null, "="),
              createBaseVNode("munder", null, [
                createBaseVNode("mo", { "data-mjx-texclass": "OP" }, "∑"),
                createBaseVNode("mrow", { "data-mjx-texclass": "ORD" }, [
                  createBaseVNode("mi", null, "C"),
                  createBaseVNode("mo", null, "∈"),
                  createBaseVNode("mtext", null, "Cajas del Pedido "),
                  createBaseVNode("mi", null, "P")
                ])
              ]),
              createBaseVNode("mtext", null, "Costo Proporcional del Pedido "),
              createBaseVNode("mi", null, "P"),
              createBaseVNode("mtext", null, " en Caja "),
              createBaseVNode("mi", null, "C")
            ])
          ], -1))
        ])
      ])
    ]),
    _cache[33] || (_cache[33] = createStaticVNode("", 18))
  ]);
}
const adjustmentsRefunds = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  adjustmentsRefunds as default
};
