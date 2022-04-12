"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixOutput = exports.ignoreFile = exports.ignoreLine = exports.call =
  void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const OFFENSE_SEVERITY = {
  1: vscode.DiagnosticSeverity.Warning,
  2: vscode.DiagnosticSeverity.Error,
};
const filePragmaRegex = /^\/\*\s*eslint-disable(?:\s+(.*?))?\s*\*\/$/;
const linePragmaRegex = /^\s*\/\/\s*eslint-disable-next-line(?:\s+(.*?))?$/;
const call = ({ stdout, uri }) => {
  const result = JSON.parse(stdout);
  const offenses = [];
  result[0].messages.forEach((offense) => {
    var _a, _b;
    offenses.push({
      uri,
      lineStart: Math.max(0, offense.line - 1),
      columnStart: Math.max(0, offense.column - 1),
      lineEnd: Math.max(
        0,
        ((_a = offense.endLine) !== null && _a !== void 0 ? _a : offense.line) -
          1,
      ),
      columnEnd: Math.max(
        0,
        ((_b = offense.endColumn) !== null && _b !== void 0
          ? _b
          : offense.column) - 1,
      ),
      code: offense.ruleId,
      message: offense.message,
      severity: OFFENSE_SEVERITY[offense.severity],
      source: "eslint",
      correctable: Boolean(offense.fix),
      url: getDocsUrl(offense.ruleId),
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
      .split(/,\s*/);
  }
  existingRules.push(code);
  const pragma = [
    `${indent}// eslint-disable-next-line`,
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(", "),
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
const ignoreFile = (line, code) => {
  var _a;
  const { text } = line;
  const matches = text.match(filePragmaRegex);
  let existingRules = [];
  if (matches) {
    existingRules = ((_a = matches[1]) !== null && _a !== void 0 ? _a : "")
      .split(/,\s*/);
  }
  existingRules.push(code);
  const pragma = [
    "/* eslint-disable",
    lodash_1.sortBy(lodash_1.uniq(existingRules)).join(", "),
    "*/",
  ].join(" ");
  if (matches) {
    return pragma;
  }
  return line.number === 0
    ? [pragma, text].join("\n")
    : [text, pragma].join("\n");
};
exports.ignoreFile = ignoreFile;
const fixOutput = (contents, stdout) => {
  try {
    return JSON.parse(stdout)[0].output;
  } catch (error) {
    console.error(error);
    return contents;
  }
};
exports.fixOutput = fixOutput;
function getDocsUrl(code) {
  if (!code) {
    return undefined;
  }
  const [plugin, rule] = code.split("/");
  const urls = {
    standard: `https://eslint.org/docs/rules/${plugin}`,
    "@typescript-eslint":
      `https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/${rule}.md`,
    react:
      `https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/${rule}.md`,
    "jsx-a11y":
      `https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/${rule}.md`,
    jest:
      `https://github.com/jest-community/eslint-plugin-jest/blob/HEAD/docs/rules/${rule}.md`,
    import:
      `https://github.com/benmosher/eslint-plugin-import/blob/HEAD/docs/rules/${rule}.md`,
    unicorn:
      `https://github.com/sindresorhus/eslint-plugin-unicorn/blob/HEAD/docs/rules/${rule}.md`,
    lodash:
      `https://github.com/wix/eslint-plugin-lodash/blob/HEAD/docs/rules/${rule}.md`,
  };
  if (rule) {
    return urls[plugin];
  }
  return urls.standard;
}
//# sourceMappingURL=eslint.js.map
