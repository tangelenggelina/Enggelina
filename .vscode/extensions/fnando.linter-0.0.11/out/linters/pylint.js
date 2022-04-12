"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreFile = exports.fixOutput = exports.call = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const OFFENSE_SEVERITY = {
  convention: vscode.DiagnosticSeverity.Warning,
  warning: vscode.DiagnosticSeverity.Error,
};
const call = ({ stdout, uri }) => {
  const result = JSON.parse(stdout);
  const offenses = [];
  result.forEach((offense) => {
    offenses.push({
      uri,
      lineStart: Math.max(0, offense.line - 1),
      columnStart: Math.max(0, offense.column - 1),
      lineEnd: Math.max(0, offense.line - 1),
      columnEnd: Math.max(0, offense.column - 1),
      code: `${offense.symbol} - ${offense["message-id"]}`,
      message: offense.message,
      severity: OFFENSE_SEVERITY[offense.type],
      source: "pylint",
      correctable: false,
      url: getDocsUrl(offense["message-id"]),
    });
  });
  return offenses;
};
exports.call = call;
const fixOutput = (_contents, stdout) => {
  return stdout;
};
exports.fixOutput = fixOutput;
const ignoreFile = (line, code) => {
  var _a;
  const { text } = line;
  const matches = text.match(/^#\s*pylint:\s+disable=(.*?)$/);
  let existingRules = [];
  if (matches) {
    existingRules = ((_a = matches[1]) !== null && _a !== void 0 ? _a : "")
      .split(/,\s*/).map((item) => item.trim());
  }
  existingRules.push(code.replace(/ - .*?$/, ""));
  const pragma = [
    "# pylint: disable=",
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(", "),
  ].join("");
  if (matches) {
    return pragma;
  }
  return line.number === 0
    ? [pragma, text].join("\n")
    : [text, pragma].join("\n");
};
exports.ignoreFile = ignoreFile;
function getDocsUrl(code) {
  if (!code) {
    return undefined;
  }
  return `http://pylint-messages.wikidot.com/messages:${code.toLowerCase()}`;
}
//# sourceMappingURL=pylint.js.map
