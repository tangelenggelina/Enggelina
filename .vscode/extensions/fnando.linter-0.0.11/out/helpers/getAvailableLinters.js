"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableLinters = void 0;
const vscode = require("vscode");
const _defaultLinters = require("../defaultLinters.json");
const defaultLinters = _defaultLinters;
function getAvailableLinters() {
  const config = vscode.workspace.getConfiguration("linter");
  const availableLinters = Object.assign(
    Object.assign({}, defaultLinters),
    config.linters,
  );
  return Object.keys(availableLinters).reduce((buffer, linterName) => {
    buffer[linterName] = Object.assign(
      Object.assign({}, defaultLinters[linterName]),
      config.linters[linterName],
    );
    return buffer;
  }, {});
}
exports.getAvailableLinters = getAvailableLinters;
//# sourceMappingURL=getAvailableLinters.js.map
