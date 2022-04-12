"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = void 0;
const vscode = require("vscode");
const call = ({ stderr, uri }) => {
  const lines = stderr.split(/\r?\n/g).filter((line) => line.trim());
  const offenses = [];
  lines.forEach((line) => {
    var _a;
    const matches = line.match(
      /^[^:]+:(\d+):\s*(?:(warning|error):)?\s*(.*?)$/,
    );
    if (!matches) {
      return;
    }
    const lineNumber = matches[1];
    const severity = (_a = matches[2]) !== null && _a !== void 0 ? _a : "error";
    const message = matches[3];
    const lineStart = Math.max(0, Number(lineNumber) - 1);
    offenses.push({
      severity: severity === "warning"
        ? vscode.DiagnosticSeverity.Warning
        : vscode.DiagnosticSeverity.Error,
      message,
      lineStart,
      lineEnd: lineStart,
      columnStart: 0,
      columnEnd: 0,
      correctable: false,
      code: "",
      uri,
      source: "ruby",
    });
  });
  return offenses;
};
exports.call = call;
//# sourceMappingURL=ruby.js.map
