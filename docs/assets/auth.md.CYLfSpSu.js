import { _ as _export_sfc, C as resolveComponent, o as openBlock, c as createElementBlock, j as createBaseVNode, a as createTextVNode, b as createBlock, w as withCtx, E as createVNode, a0 as Suspense, a1 as createStaticVNode } from "./chunks/framework.UkvNxxWY.js";
const __pageData = JSON.parse('{"title":"Autenticación y Autorización (Auth)","description":"","frontmatter":{},"headers":[],"relativePath":"auth.md","filePath":"auth.md"}');
const _sfc_main = { name: "auth.md" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  return openBlock(), createElementBlock("div", null, [
    _cache[1] || (_cache[1] = createBaseVNode("h1", {
      id: "autenticacion-y-autorizacion-auth",
      tabindex: "-1"
    }, [
      createTextVNode("Autenticación y Autorización (Auth) "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#autenticacion-y-autorizacion-auth",
        "aria-label": 'Permalink to "Autenticación y Autorización (Auth)"'
      }, "​")
    ], -1)),
    _cache[2] || (_cache[2] = createBaseVNode("p", null, [
      createTextVNode("El servicio "),
      createBaseVNode("code", null, "Importal-auth"),
      createTextVNode(" es el encargado de validar la identidad de los usuarios y emitir las credenciales para la navegación en el resto de los microservicios.")
    ], -1)),
    _cache[3] || (_cache[3] = createBaseVNode("h2", {
      id: "estrategia-de-tokens-jwt",
      tabindex: "-1"
    }, [
      createTextVNode("Estrategia de Tokens JWT "),
      createBaseVNode("a", {
        class: "header-anchor",
        href: "#estrategia-de-tokens-jwt",
        "aria-label": 'Permalink to "Estrategia de Tokens JWT"'
      }, "​")
    ], -1)),
    _cache[4] || (_cache[4] = createBaseVNode("p", null, [
      createTextVNode("Para equilibrar seguridad y rendimiento, la plataforma implementa una estrategia de "),
      createBaseVNode("strong", null, "doble token"),
      createTextVNode(":")
    ], -1)),
    (openBlock(), createBlock(Suspense, null, {
      default: withCtx(() => [
        createVNode(_component_Mermaid, {
          id: "mermaid-12",
          class: "mermaid",
          graph: "sequenceDiagram%0A%20%20%20%20actor%20Cliente%0A%20%20%20%20participant%20Auth%20as%20Importal-auth%0A%20%20%20%20participant%20API%20as%20Importal-backend%0A%0A%20%20%20%20Cliente-%3E%3EAuth%3A%20POST%20%2Fauth%2Fapi%2Fv1%2Fauth%2Flogin%0A%20%20%20%20Note%20over%20Auth%3A%20Valida%20contrase%C3%B1a%20y%20firma%20JWT%0A%20%20%20%20Auth--%3E%3ECliente%3A%20200%20OK%20(AccessToken%20en%20JSON%20%2B%20RefreshToken%20en%20Cookie%20HttpOnly)%0A%20%20%20%20%0A%20%20%20%20Cliente-%3E%3EAPI%3A%20GET%20%2Fapi%2Fv1%2Fcliente%2Fproductos%20(Authorization%3A%20Bearer%20%3CAccessToken%3E)%0A%20%20%20%20Note%20over%20API%3A%20Valida%20firma%20de%20AccessToken%0A%20%20%20%20API--%3E%3ECliente%3A%20200%20OK%20(Cat%C3%A1logo)%0A%20%20%20%20%0A%20%20%20%20Note%20over%20Cliente%3A%20AccessToken%20Expira%20(1%20hora)%0A%20%20%20%20%0A%20%20%20%20Cliente-%3E%3EAPI%3A%20GET%20%2Fapi%2Fv1%2Fcliente%2Fproductos%20(Bearer%20caducado)%0A%20%20%20%20API--%3E%3ECliente%3A%20401%20Unauthorized%0A%20%20%20%20%0A%20%20%20%20Cliente-%3E%3EAuth%3A%20POST%20%2Fauth%2Fapi%2Fv1%2Fauth%2Frefresh%20(Cookie%20HttpOnly%20enviada%20autom%C3%A1ticamente)%0A%20%20%20%20Note%20over%20Auth%3A%20Valida%20RefreshToken%20en%20DB%2FRedis%0A%20%20%20%20Auth--%3E%3ECliente%3A%20200%20OK%20(Nuevo%20AccessToken%20en%20JSON)%0A"
        })
      ]),
      fallback: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(" Loading... ", -1)
      ])]),
      _: 1
    })),
    _cache[5] || (_cache[5] = createStaticVNode('<h3 id="_1-access-token-token-de-acceso" tabindex="-1">1. Access Token (Token de Acceso) <a class="header-anchor" href="#_1-access-token-token-de-acceso" aria-label="Permalink to &quot;1. Access Token (Token de Acceso)&quot;">​</a></h3><ul><li><strong>Ubicación:</strong> Se devuelve directamente en el cuerpo JSON tras el login.</li><li><strong>Formato:</strong> JWT firmado con algoritmo RS256 / HS256.</li><li><strong>Duración:</strong> Corta duración (generalmente 1 hora).</li><li><strong>Uso:</strong> Debe adjuntarse en las cabeceras HTTP de cada petición al backend:<div class="language-http vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">http</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">Authorization</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span></span></code></pre></div></li></ul><h3 id="_2-refresh-token-token-de-refresco" tabindex="-1">2. Refresh Token (Token de Refresco) <a class="header-anchor" href="#_2-refresh-token-token-de-refresco" aria-label="Permalink to &quot;2. Refresh Token (Token de Refresco)&quot;">​</a></h3><ul><li><strong>Ubicación:</strong> Se inyecta en una cookie de respuesta HTTP (<code>Set-Cookie</code>).</li><li><strong>Seguridad:</strong><ul><li><code>HttpOnly</code>: Impide el acceso al token mediante Javascript (<code>document.cookie</code>), protegiendo de ataques XSS.</li><li><code>Secure</code>: Obliga al navegador a transmitir la cookie únicamente a través de canales cifrados HTTPS.</li><li><code>SameSite=Strict/Lax</code>: Mitiga ataques CSRF (Cross-Site Request Forgery).</li></ul></li><li><strong>Duración:</strong> Larga duración (generalmente 7 días).</li><li><strong>Uso:</strong> El frontend consulta el endpoint <code>/auth/api/v1/auth/refresh</code> enviando la cookie de forma nativa para obtener un nuevo Access Token válido cuando este último caduque.</li></ul><hr><h2 id="roles-y-niveles-de-acceso" tabindex="-1">Roles y Niveles de Acceso <a class="header-anchor" href="#roles-y-niveles-de-acceso" aria-label="Permalink to &quot;Roles y Niveles de Acceso&quot;">​</a></h2><p>El sistema maneja un control de acceso basado en roles (RBAC) propagado en el payload del JWT:</p><table tabindex="0"><thead><tr><th>Rol</th><th>Descripción</th><th>Permisos Clave</th></tr></thead><tbody><tr><td><code>root</code></td><td>Superadministrador del sistema.</td><td>Bypass de validaciones, visualización completa, logs.</td></tr><tr><td><code>admin</code></td><td>Administrador operacional de Importal.</td><td>Aprobar registros, cerrar cargas, conciliar transferencias bancarias.</td></tr><tr><td><code>cliente</code></td><td>Compradores o inversores finales.</td><td>Comprar catálogo, realizar reservas, subir comprobantes de pago.</td></tr><tr><td><code>vendedor</code></td><td>Sellers y proveedores del marketplace.</td><td>Cargar catálogo propio, procesar despachos, solicitar tránsitos de carga.</td></tr><tr><td><code>bodeguero</code></td><td>Operadores físicos de bodega de destino.</td><td>Validar recepción de bultos físicos, registrar arribo de cargas.</td></tr></tbody></table><hr><h2 id="invalidacion-de-sesion-logout" tabindex="-1">Invalidación de Sesión (Logout) <a class="header-anchor" href="#invalidacion-de-sesion-logout" aria-label="Permalink to &quot;Invalidación de Sesión (Logout)&quot;">​</a></h2><p>Al llamar a <code>/auth/api/v1/auth/logout</code>:</p><ol><li>El backend de Auth invalida la sesión correspondiente en la base de datos o almacenamiento en caché (Redis).</li><li>Se reescribe la cookie del navegador expirándola inmediatamente (<code>Max-Age=0</code>).</li><li>El frontend desecha el Access Token cargado en memoria.</li></ol>', 12))
  ]);
}
const auth = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  __pageData,
  auth as default
};
