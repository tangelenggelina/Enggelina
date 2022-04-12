"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinterConfig = void 0;
const getAvailableLinters_1 = require("./getAvailableLinters");
function getLinterConfig(name) {
  const availableLinters = getAvailableLinters_1.getAvailableLinters();
  return availableLinters[name];
}
exports.getLinterConfig = getLinterConfig;
//# sourceMappingURL=getLinterConfig.js.map
