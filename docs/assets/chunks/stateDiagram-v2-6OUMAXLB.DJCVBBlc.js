import { s as styles_default, b as stateRenderer_v3_unified_default, a as stateDiagram_default, S as StateDB } from "./chunk-EX3LRPZG.DfweHIWf.js";
import { _ as __name } from "../app.CQ2Www5d.js";
import "./chunk-XXDRQBXY.DvWPlGez.js";
import "./chunk-VR4S4FIN.DnxCZon7.js";
import "./chunk-32BRIVSS.CngmerwR.js";
import "./framework.UkvNxxWY.js";
import "./theme.CZhWekeJ.js";
var diagram = {
  parser: stateDiagram_default,
  get db() {
    return new StateDB(2);
  },
  renderer: stateRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
