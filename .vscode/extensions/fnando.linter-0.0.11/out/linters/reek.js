"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreLine = exports.call = void 0;
const vscode = require("vscode");
const camelizeObject_1 = require("../helpers/camelizeObject");
const call = ({ stdout, uri }) => {
  const result = JSON.parse(stdout);
  const offenses = [];
  result.forEach((offense) => {
    offense = camelizeObject_1.camelizeObject(offense);
    offenses.push({
      uri,
      lineStart: Math.max(0, offense.lines[0] - 1),
      columnStart: 0,
      lineEnd: Math.max(0, offense.lines[0] - 1),
      columnEnd: 0,
      code: offense.smellType,
      message: `${offense.context} ${offense.message}`,
      severity: vscode.DiagnosticSeverity.Warning,
      source: "reek",
      correctable: false,
      url: offense.documentationLink,
    });
  });
  return offenses;
};
exports.call = call;
const ignoreLine = (line, code, indent) =>
  [line.text, `${indent}# :reek:${code}`].join("\n");
exports.ignoreLine = ignoreLine;
//# sourceMappingURL=reek.js.map
