import { c as createFlowDiagram, s as styles_default } from "./flowDiagram-23GEKE2U.Ddw48dDZ.js";
import { _ as __name } from "../app.CQ2Www5d.js";
import "./chunk-5VM5RSS4.Bf1_IocE.js";
import "./chunk-XXDRQBXY.DvWPlGez.js";
import "./chunk-VR4S4FIN.DnxCZon7.js";
import "./chunk-32BRIVSS.CngmerwR.js";
import "./channel.BkbQpv6w.js";
import "./framework.UkvNxxWY.js";
import "./theme.CZhWekeJ.js";
var getStyles = /* @__PURE__ */ __name((options) => `${styles_default(options)}
  .swimlane.cluster rect {
    stroke: ${options.clusterBorder} !important;
  }
  [data-look="neo"].cluster rect {
    filter: none;
  }
`, "getStyles");
var styles_default2 = getStyles;
var diagram = createFlowDiagram({ defaultLayout: "swimlane", styles: styles_default2 });
export {
  diagram
};
