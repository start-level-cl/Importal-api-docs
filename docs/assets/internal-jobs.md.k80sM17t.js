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
    _cache[6] || (_cache[6] = createStaticVNode('<h3 id="conversion-de-monedas-mindicador-cl" tabindex="-1">Conversión de Monedas (<code>mindicador.cl</code>) <a class="header-anchor" href="#conversion-de-monedas-mindicador-cl" aria-label="Permalink to &quot;Conversión de Monedas (`mindicador.cl`)&quot;">​</a></h3><p>Dado que la mercadería y costos internacionales se gestionan en Dólares Estadounidenses (USD), pero los clientes e inversores pagan localmente en Pesos Chilenos (CLP):</p><ol><li>El sistema realiza una llamada HTTP externa a la API de <strong>mindicador.cl</strong> para obtener el tipo de cambio oficial del día.</li><li>Almacena este valor y lo utiliza para calcular la conversión exacta de comisiones, fletes y bodegaje.</li></ol><h3 id="procesamiento-de-intereses-y-moras" tabindex="-1">Procesamiento de Intereses y Moras <a class="header-anchor" href="#procesamiento-de-intereses-y-moras" aria-label="Permalink to &quot;Procesamiento de Intereses y Moras&quot;">​</a></h3><ul><li><strong>Detección:</strong> El job identifica cobros cuyo estado es <code>PENDING</code> y cuya fecha de vencimiento (<code>dueDate</code>) es anterior a la fecha actual.</li><li><strong>Transición de Estado:</strong> Estos cobros pasan automáticamente al estado <code>OVERDUE</code>.</li><li><strong>Cálculo de Recargo:</strong> Se aplica una tasa de interés diaria configurada en la base de datos sobre el saldo insoluto, regenerando el balance total del cobro y actualizando el PDF adjunto.</li></ul><hr><h2 id="_2-reglas-de-negocio-de-vendedores-y-logistica" tabindex="-1">2. Reglas de Negocio de Vendedores y Logística <a class="header-anchor" href="#_2-reglas-de-negocio-de-vendedores-y-logistica" aria-label="Permalink to &quot;2. Reglas de Negocio de Vendedores y Logística&quot;">​</a></h2><p>Existen reglas estrictas implementadas a nivel de base de datos y validación de endpoints para evitar demoras y deudas incobrables en el marketplace:</p><h3 id="bloqueo-de-publicacion-de-productos" tabindex="-1">Bloqueo de Publicación de Productos <a class="header-anchor" href="#bloqueo-de-publicacion-de-productos" aria-label="Permalink to &quot;Bloqueo de Publicación de Productos&quot;">​</a></h3><p>Para garantizar que los vendedores entreguen a tiempo los pedidos de cargas pasadas:</p><ul><li><strong>Regla:</strong> Si un vendedor tiene algún pedido con estado <code>PENDING</code> asociado a una carga que ha sido cerrada oficialmente (<code>status = &#39;CLOSED&#39;</code>), el sistema le <strong>bloqueará la creación de nuevos productos</strong>.</li><li><strong>Efecto:</strong> Cualquier llamada a <code>POST /api/v1/vendedor/productos</code> por parte de este vendedor lanzará un error <code>400 BadRequestException</code> impidiendo la publicación hasta que resuelva sus órdenes pendientes.</li></ul><h3 id="transicion-de-carga-por-cierre-administrativo" tabindex="-1">Transición de Carga por Cierre Administrativo <a class="header-anchor" href="#transicion-de-carga-por-cierre-administrativo" aria-label="Permalink to &quot;Transición de Carga por Cierre Administrativo&quot;">​</a></h3><p>Cuando el administrador cierra oficialmente una carga en destino (<code>POST /api/v1/admin/cargas/{id}/close</code>):</p><ol><li><strong>Desactivación de Productos:</strong> Todos los productos de los vendedores que estaban asignados a esa carga cerrada se desactivan temporalmente para evitar nuevas compras mientras se reorganiza el transporte.</li><li><strong>Generación de Cobros:</strong> Se cierran las cuentas y se calculan las comisiones de logística correspondientes a los metros cúbicos o peso total utilizado.</li><li><strong>Transición Automática:</strong> Los vendedores deben migrar a la nueva carga abierta. Si no tienen órdenes pendientes en la carga cerrada, la asignación a la nueva carga abierta se procesa automáticamente al llamar a <code>/api/v1/vendedor/cargas/transicion-cierre</code>.</li></ol><h3 id="reserva-y-devolucion-inmediata-de-stock" tabindex="-1">Reserva y Devolución Inmediata de Stock <a class="header-anchor" href="#reserva-y-devolucion-inmediata-de-stock" aria-label="Permalink to &quot;Reserva y Devolución Inmediata de Stock&quot;">​</a></h3><ul><li><strong>Creación del Pedido:</strong> Cuando un cliente realiza una orden, el stock del producto disminuye <strong>inmediatamente</strong> en modo &quot;reserva&quot;.</li><li><strong>Confirmación:</strong> Al ser confirmado por el vendedor, la reserva se consolida.</li><li><strong>Rechazo o Cancelación:</strong> Si el vendedor rechaza la orden (falta de stock real o problema de envío) o el cliente la cancela, la base de datos revierte la operación y devuelve automáticamente las unidades al stock público del producto.</li></ul>', 16))
  ]);
}
const internalJobs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  internalJobs as default
};
