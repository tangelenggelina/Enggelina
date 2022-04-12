"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEditor = void 0;
const vscode = require("vscode");
function getEditor(uri) {
  return vscode.window.visibleTextEditors.find((editor) =>
    editor.document.uri.path === uri.path
  );
}
exports.getEditor = getEditor;
//# sourceMappingURL=getEditor.js.map
