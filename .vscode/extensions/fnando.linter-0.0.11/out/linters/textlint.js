"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const vscode = require("vscode");
const debug_1 = require("../helpers/debug");
const offenseSeverity = {
  1: vscode.DiagnosticSeverity.Warning,
  2: vscode.DiagnosticSeverity.Error,
};
const call = ({ stdout, stderr, uri }) => {
  if (!stdout) {
    debug_1.debug("textlint: stdout was empty, but here's stderr:", { stderr });
    return [];
  }
  const result = JSON.parse(stdout);
  const offenses = [];
  result[0].messages.forEach((offense) => {
    const lineStart = Math.max(0, offense.line - 1);
    const columnStart = Math.max(0, offense.column - 1);
    offenses.push({
      severity: offenseSeverity[offense.severity],
      message: offense.message.trim(),
      lineStart,
      lineEnd: lineStart,
      columnStart,
      columnEnd: columnStart,
      correctable: false,
      code: offense.ruleId,
      uri,
      source: "textlint",
    });
  });
  return offenses;
};
exports.call = call;
//# sourceMappingURL=textlint.js.map
