"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixOutput = exports.call = void 0;
const vscode = require("vscode");
const debug_1 = require("../helpers/debug");
const OFFENSE_SEVERITY = {
  1: vscode.DiagnosticSeverity.Warning,
  2: vscode.DiagnosticSeverity.Error,
};
const call = ({ stdout, stderr, uri }) => {
  if (!stdout) {
    debug_1.debug("stylelint: stdout was empty, but here's stderr:");
    debug_1.log(stderr);
    return [];
  }
  let result = [];
  try {
    result = JSON.parse(stdout);
  } catch (error) {
    return [];
  }
  const offenses = [];
  result[0].warnings.forEach((offense) => {
    const message = offense.text.replace(` (${offense.rule})`, "");
    offenses.push({
      uri,
      lineStart: Math.max(0, offense.line - 1),
      columnStart: Math.max(0, offense.column - 1),
      lineEnd: Math.max(0, offense.line - 1),
      columnEnd: Math.max(0, offense.column - 1),
      code: offense.rule,
      message,
      severity: OFFENSE_SEVERITY[offense.severity],
      source: "stylelint",
      correctable: false,
      url: getDocsUrl(offense.rule),
    });
  });
  return offenses;
};
exports.call = call;
const fixOutput = (_contents, stdout) => {
  return stdout;
};
exports.fixOutput = fixOutput;
function getDocsUrl(code) {
  if (!code) {
    return undefined;
  }
  const [plugin, rule] = code.split("/");
  const urls = {
    standard: `https://stylelint.io/user-guide/rules/list/${plugin}`,
  };
  if (rule) {
    return urls[plugin];
  }
  return urls.standard;
}
//# sourceMappingURL=stylelint.js.map
