"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreLine = exports.call = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const camelizeObject_1 = require("../helpers/camelizeObject");
const linePragmaRegex = /^# hadolint ignore=(.+)$/;
const offenseSeverity = {
  error: vscode.DiagnosticSeverity.Error,
  warning: vscode.DiagnosticSeverity.Warning,
};
const call = ({ stdout, uri }) => {
  const result = JSON.parse(stdout);
  const offenses = [];
  result.forEach((offense) => {
    offense = camelizeObject_1.camelizeObject(offense);
    const lineStart = Math.max(0, offense.line - 1);
    const columnStart = Math.max(0, offense.column - 1);
    offenses.push({
      uri,
      lineStart,
      lineEnd: lineStart,
      columnStart,
      columnEnd: columnStart,
      message: offense.message,
      code: offense.code,
      source: "hadolint",
      correctable: false,
      severity: offenseSeverity[offense.level],
      url: getDocsUrl(offense.code),
    });
  });
  return offenses;
};
exports.call = call;
const ignoreLine = (line, code, indent) => {
  var _a;
  const { text } = line;
  const matches = text.match(linePragmaRegex);
  let existingRules = [];
  if (matches) {
    existingRules = ((_a = matches[1]) !== null && _a !== void 0 ? _a : "")
      .split(",");
  }
  existingRules.push(code);
  const pragma = [
    `${indent}# hadolint ignore=`,
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(","),
  ].join("");
  if (matches) {
    return pragma;
  }
  if (line.number === 0) {
    return [pragma, text].join("\n");
  }
  return [text, "", pragma].join("\n");
};
exports.ignoreLine = ignoreLine;
function getDocsUrl(code) {
  return `https://github.com/hadolint/hadolint/wiki/${code}`;
}
//# sourceMappingURL=hadolint.js.map
