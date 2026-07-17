import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-V7JOEXUC.CTzmoQsf.js";
import { _ as __name } from "../app.CQ2Www5d.js";
import "./chunk-5VM5RSS4.Bf1_IocE.js";
import "./chunk-XXDRQBXY.DvWPlGez.js";
import "./chunk-VR4S4FIN.DnxCZon7.js";
import "./chunk-32BRIVSS.CngmerwR.js";
import "./framework.UkvNxxWY.js";
import "./theme.CZhWekeJ.js";
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
