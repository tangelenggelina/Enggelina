"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const vscode = require("vscode");
const offenseSeverity = {
  error: vscode.DiagnosticSeverity.Error,
  warning: vscode.DiagnosticSeverity.Warning,
  info: vscode.DiagnosticSeverity.Information,
  style: vscode.DiagnosticSeverity.Information,
};
const call = ({ stdout, stderr, uri }) => {
  console.log({ stdout, stderr });
  const result = JSON.parse(stdout);
  const offenses = [];
  result.forEach((offense) => {
    offenses.push({
      uri,
      lineStart: Math.max(0, offense.line - 1),
      columnStart: Math.max(0, offense.column - 1),
      lineEnd: Math.max(0, offense.endLine - 1),
      columnEnd: Math.max(0, offense.endColumn - 1),
      message: offense.message,
      code: offense.code.toString(),
      source: "shellcheck",
      correctable: false,
      severity: offenseSeverity[offense.level],
    });
  });
  return offenses;
};
exports.call = call;
//# sourceMappingURL=shellcheck.js.map
