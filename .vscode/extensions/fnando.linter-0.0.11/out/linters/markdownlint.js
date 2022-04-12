"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixOutput = exports.call = void 0;
const vscode = require("vscode");
const call = ({ stderr, uri }) => {
  const result = JSON.parse(stderr);
  const offenses = [];
  result.forEach((offense) => {
    var _a;
    const [colStart, colEnd] =
      (_a = offense.errorRange) !== null && _a !== void 0 ? _a : [0, 0];
    offenses.push({
      uri,
      lineStart: Math.max(0, offense.lineNumber - 1),
      columnStart: Math.max(0, colStart - 1),
      lineEnd: Math.max(0, offense.lineNumber - 1),
      columnEnd: Math.max(0, colEnd - 1),
      code: offense.ruleNames[0],
      message: offense.ruleDescription,
      severity: vscode.DiagnosticSeverity.Error,
      source: "markdownlint",
      correctable: false,
      url: offense.ruleInformation,
    });
  });
  return offenses;
};
exports.call = call;
const fixOutput = (_contents, stdout) => {
  return stdout;
};
exports.fixOutput = fixOutput;
//# sourceMappingURL=markdownlint.js.map
