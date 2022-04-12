"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndent = void 0;
function getIndent(line) {
  const matches = line.match(/^(\s+)/);
  return matches ? matches[1] : "";
}
exports.getIndent = getIndent;
//# sourceMappingURL=getIndent.js.map
