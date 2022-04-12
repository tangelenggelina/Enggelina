"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreLine = exports.call = void 0;
const lodash_1 = require("lodash");
const vscode = require("vscode");
const offenseSeverity = {
  warning: vscode.DiagnosticSeverity.Warning,
  error: vscode.DiagnosticSeverity.Error,
};
const call = ({ stdout, uri }) => {
  const offenses = stdout
    .split(/\r?\n/)
    .map((line) => {
      const matches = line.match(/^.*?:(\d+):(\d+): \[(.*?)\] (.+) \((.*?)\)$/);
      if (!matches) {
        return;
      }
      const [_, lineNumber, column, severity, message, code] = matches;
      const lineStart = Math.max(0, Number(lineNumber) - 1);
      const columnStart = Math.max(0, Number(column) - 1);
      return {
        uri,
        lineStart,
        lineEnd: lineStart,
        columnStart,
        columnEnd: columnStart,
        severity: offenseSeverity[severity],
        message,
        code,
        source: "yamllint",
        correctable: false,
      };
    })
    .filter(Boolean);
  return offenses;
};
exports.call = call;
const ignoreLine = (line, code, indent) => {
  const matches = line.text.match(/^\s*# yamllint disable-line(?: (.*?))?$/);
  let existingRules = [];
  if (matches && matches[1]) {
    existingRules = matches[1].split(/\s+/);
  }
  existingRules.push(`rule:${code}`);
  const pragma = `${indent}# yamllint disable-line ${
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(", ")
  }`;
  if (matches) {
    return pragma;
  }
  return line.number === 0
    ? [pragma, line.text].join("\n")
    : [line.text, pragma].join("\n");
};
exports.ignoreLine = ignoreLine;
//# sourceMappingURL=yamllint.js.map
