"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreEol = exports.fixOutput = exports.call = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const camelizeObject_1 = require("../helpers/camelizeObject");
const call = ({ stdout, uri }) => {
  var _a;
  const result = camelizeObject_1.camelizeObject(JSON.parse(stdout));
  const offenses = [];
  (_a = result[0]) === null || _a === void 0
    ? void 0
    : _a.violations.forEach((offense) => {
      offense = camelizeObject_1.camelizeObject(offense);
      const lineStart = Math.max(0, offense.lineNo - 1);
      const columnStart = Math.max(0, offense.linePos - 1);
      offenses.push({
        uri,
        lineStart,
        lineEnd: lineStart,
        columnStart,
        columnEnd: columnStart,
        message: offense.description,
        code: offense.code,
        source: "sqlfluff",
        correctable: false,
        severity: vscode.DiagnosticSeverity.Warning,
        url: getDocsUrl(offense.code),
      });
    });
  return offenses;
};
exports.call = call;
const fixOutput = (_input, stdout) => {
  return stdout;
};
exports.fixOutput = fixOutput;
const ignoreEol = (line, code) => {
  const regexp = /^(.*?)(?:\s+--noqa: disable=(.+))?$/;
  const matches = line.text.match(regexp);
  let existingRules = [];
  if (matches && matches[2]) {
    existingRules = matches[2].split(/,\s*/);
  }
  existingRules.push(code);
  existingRules = lodash_1.uniq(lodash_1.sortBy(existingRules));
  return [
    (matches && matches[1]) || "",
    `--noqa: disable=${existingRules.join(", ")}`,
  ].join(" ");
};
exports.ignoreEol = ignoreEol;
function getDocsUrl(code) {
  return `https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.core.rules.Rule_${code}`;
}
//# sourceMappingURL=sqlfluff.js.map
