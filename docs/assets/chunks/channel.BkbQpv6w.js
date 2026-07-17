import { ad as Utils, ae as Color } from "../app.CQ2Www5d.js";
const channel = (color, channel2) => {
  return Utils.lang.round(Color.parse(color)[channel2]);
};
export {
  channel as c
};
