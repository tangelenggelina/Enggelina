"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreLine = exports.ignoreFile = exports.call = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const camelizeObject_1 = require("../helpers/camelizeObject");
const filePragmaRegex = /^\/\/\s*swiftlint:disable(?:\s+(.+))?$/;
const linePragmaRegex = /^\/\/\s*swiftlint:disable-next(?:\s+(.+))?$/;
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
    const columnStart = Math.max(0, offense.character - 1);
    offenses.push({
      uri,
      lineStart,
      lineEnd: lineStart,
      columnStart,
      columnEnd: columnStart,
      message: offense.reason,
      code: offense.ruleId,
      source: "swiftlint",
      correctable: false,
      severity: offenseSeverity[offense.severity.toLowerCase()],
      url: getDocsUrl(offense.ruleId),
    });
  });
  return offenses;
};
exports.call = call;
const ignoreFile = (line, code) => {
  var _a;
  const { text } = line;
  const matches = text.match(filePragmaRegex);
  let existingRules = [];
  if (matches) {
    existingRules = ((_a = matches[1]) !== null && _a !== void 0 ? _a : "")
      .split(/\s+/);
  }
  existingRules.push(code);
  const pragma = [
    "// swiftlint:disable",
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(" "),
  ].join(" ");
  if (matches) {
    return pragma;
  }
  return line.number === 0
    ? [pragma, text].join("\n")
    : [text, pragma].join("\n");
};
exports.ignoreFile = ignoreFile;
const ignoreLine = (line, code, indent) => {
  var _a;
  const { text } = line;
  const matches = text.match(linePragmaRegex);
  let existingRules = [];
  if (matches) {
    existingRules = ((_a = matches[1]) !== null && _a !== void 0 ? _a : "")
      .split(/\s+/);
  }
  existingRules.push(code);
  const pragma = [
    `${indent}// swiftlint:disable:next`,
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(" "),
  ].join(" ");
  if (matches) {
    return pragma;
  }
  if (line.number === 0 && text.match(filePragmaRegex)) {
    return [text, pragma].join("\n");
  }
  return line.number === 0
    ? [pragma, text].join("\n")
    : [text, pragma].join("\n");
};
exports.ignoreLine = ignoreLine;
function getDocsUrl(code) {
  return `https://realm.github.io/SwiftLint/${code}.html`;
}
//# sourceMappingURL=swiftlint.js.map
