import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, a1 as createStaticVNode, b as createBlock, w as withCtx, a as createTextVNode, E as createVNode, a0 as Suspense } from "./chunks/framework.UkvNxxWY.js";
const __pageData = JSON.parse('{"title":"Guía de Referencia de la API del Administrador (Admin API)","description":"","frontmatter":{},"headers":[],"relativePath":"admin-api.md","filePath":"admin-api.md"}');
const _sfc_main = { name: "admin-api.md" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  return openBlock(), createElementBlock("div", null, [
    _cache[2] || (_cache[2] = createStaticVNode("", 15)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-997",
          class: "mermaid",
          graph: "sequenceDiagram%0A%20%20%20%20autonumber%0A%20%20%20%20actor%20Admin%20as%20Administrador%0A%20%20%20%20participant%20API%20as%20Support%20Controller%0A%20%20%20%20participant%20Service%20as%20Support%20Service%0A%20%20%20%20participant%20DB%20as%20Base%20de%20Datos%0A%0A%20%20%20%20Admin-%3E%3EAPI%3A%20POST%20%2Fapi%2Fv1%2Fadmin%2Ftickets%2F%3Aid%2Fresolver%20(status%2C%20resolution%2C%20payment_proof_url)%0A%20%20%20%20API-%3E%3EService%3A%20resolveTicket(adminId%2C%20ticketId%2C%20dto)%0A%20%20%20%20Note%20over%20Service%3A%20Busca%20ticket%20por%20ID%0A%20%20%20%20alt%20payment_proof_url%20est%C3%A1%20presente%20en%20el%20DTO%0A%20%20%20%20%20%20%20%20Note%20over%20Service%3A%20Extrae%20metadata%20actual%20o%20inicializa%20%7B%7D%0A%20%20%20%20%20%20%20%20Note%20over%20Service%3A%20Asigna%20metadata.payment_proof_url%20%3D%20payment_proof_url%0A%20%20%20%20end%0A%20%20%20%20Note%20over%20Service%3A%20Setea%20resolved_by%20%3D%20adminId%2C%20resolved_at%20%3D%20Date.now()%20y%20status%0A%20%20%20%20Service-%3E%3EDB%3A%20Save%20ticket%0A%20%20%20%20DB--%3E%3EService%3A%20Registro%20guardado%0A%20%20%20%20Service--%3E%3EAPI%3A%20Retorna%20Ticket%20modificado%0A%20%20%20%20API--%3E%3EAdmin%3A%20HTTP%20200%20OK%20(JSON%20del%20Ticket)%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[3] || (_cache[3] = createStaticVNode("", 11)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-1231",
          class: "mermaid",
          graph: "flowchart%20TD%0A%20%20%20%20Start(%5BFiltrar%20por%20Sala%5D)%20--%3E%20CheckAereo%7B%C2%BFContiene%20'aer'%3F%7D%0A%20%20%20%20CheckAereo%20--%20S%C3%AD%20--%3E%20SetAereo%5BTerm%20%3D%20'%25aer%25'%5D%0A%20%20%20%20CheckAereo%20--%20No%20--%3E%20CheckMar%7B%C2%BFContiene%20'mar'%3F%7D%0A%20%20%20%20CheckMar%20--%20S%C3%AD%20--%3E%20SetMar%5BTerm%20%3D%20'%25mar%25'%5D%0A%20%20%20%20CheckMar%20--%20No%20--%3E%20SetCustom%5BTerm%20%3D%20'%25'%20%2B%20sala.toLowerCase()%20%2B%20'%25'%5D%0A%20%20%20%20%0A%20%20%20%20SetAereo%20--%3E%20BuildQuery%0A%20%20%20%20SetMar%20--%3E%20BuildQuery%0A%20%20%20%20SetCustom%20--%3E%20BuildQuery%0A%20%20%20%20%0A%20%20%20%20BuildQuery%5BQueryBuilder%5D%20--%3E%20SubQueryChats%5B%22Subconsulta%20Chats%3A%0A%20%20%20%20chat.user_id%20%3D%20user.id%20AND%20%0A%20%20%20%20LOWER(chat.transport_type)%20LIKE%20Term%22%5D%0A%20%20%20%20BuildQuery%20--%3E%20SubQueryOrders%5B%22Subconsulta%20Orders%20%2B%20Products%3A%0A%20%20%20%20order.client_id%20%3D%20user.id%20AND%20%0A%20%20%20%20LOWER(product.transport_type)%20LIKE%20Term%22%5D%0A%20%20%20%20%0A%20%20%20%20SubQueryChats%20--%3E%20Evaluate%7B%C2%BFCumple%20EXISTS%20Chats%20OR%20EXISTS%20Orders%3F%7D%0A%20%20%20%20SubQueryOrders%20--%3E%20Evaluate%0A%20%20%20%20Evaluate%20--%20S%C3%AD%20--%3E%20IncludeUser%5BIncluir%20Usuario%20en%20Resultado%5D%0A%20%20%20%20Evaluate%20--%20No%20--%3E%20ExcludeUser%5BExcluir%20Usuario%20del%20Resultado%5D%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[1] || (_cache[1] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[4] || (_cache[4] = createStaticVNode("", 57))
  ]);
}
const adminApi = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  adminApi as default
};
