"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const vscode = require("vscode");
const offenseSeverity = {
  error: vscode.DiagnosticSeverity.Error,
  warning: vscode.DiagnosticSeverity.Warning,
};
const call = ({ stdout, stderr, uri }) => {
  console.log({ stdout, stderr });
  const result = JSON.parse(stdout);
  const offenses = [];
  Object.values(result.files)[0].messages.forEach((offense) => {
    const lineStart = Math.max(0, offense.line - 1);
    const columnStart = Math.max(0, offense.column - 1);
    offenses.push({
      uri,
      lineStart,
      lineEnd: lineStart,
      columnStart,
      columnEnd: columnStart,
      message: offense.message,
      code: offense.source,
      source: "php-code-sniffer",
      correctable: offense.fixable,
      severity: offenseSeverity[offense.severity],
    });
  });
  return offenses;
};
exports.call = call;
//# sourceMappingURL=php-code-sniffer.js.map
