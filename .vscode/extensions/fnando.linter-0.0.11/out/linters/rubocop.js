"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixOutput = exports.ignoreEol = exports.call = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const camelizeObject_1 = require("../helpers/camelizeObject");
const offenseSeverity = {
  warning: vscode.DiagnosticSeverity.Warning,
  convention: vscode.DiagnosticSeverity.Error,
  error: vscode.DiagnosticSeverity.Error,
  info: vscode.DiagnosticSeverity.Information,
  fatal: vscode.DiagnosticSeverity.Error,
  refactor: vscode.DiagnosticSeverity.Information,
};
const call = ({ stdout, uri }) => {
  var _a;
  const result = JSON.parse(stdout);
  const offenses = [];
  (_a = result.files[0]) === null || _a === void 0
    ? void 0
    : _a.offenses.forEach((offense) => {
      offense = camelizeObject_1.camelizeObject(offense);
      offenses.push({
        uri,
        lineStart: Math.max(0, offense.location.startLine - 1),
        columnStart: Math.max(0, offense.location.startColumn - 1),
        lineEnd: Math.max(0, offense.location.lastLine - 1),
        columnEnd: Math.max(0, offense.location.lastColumn - 1),
        code: offense.copName,
        message: offense.message,
        severity: offenseSeverity[offense.severity],
        source: "rubocop",
        correctable: offense.correctable,
        url: getDocsUrl(offense.copName),
      });
    });
  return offenses;
};
exports.call = call;
const ignoreEol = (line, code) => {
  const regexp = /^(.*?)(?:\s*#\s*rubocop:disable\s*(.*?))?$/;
  const matches = line.text.match(regexp);
  let existingRules = [];
  if (matches && matches[2]) {
    existingRules = matches[2].split(/,\s*/);
  }
  existingRules.push(code);
  existingRules = lodash_1.uniq(lodash_1.sortBy(existingRules));
  return [
    (matches && matches[1]) || "",
    "# rubocop:disable",
    existingRules.join(", "),
  ].join(" ");
};
exports.ignoreEol = ignoreEol;
const fixOutput = (_contents, stdout) => stdout;
exports.fixOutput = fixOutput;
function getDocsUrl(code) {
  const parts = (code !== null && code !== void 0 ? code : "").split("/");
  if (parts.length === 0) {
    return undefined;
  }
  const department = (parts.length > 2 ? parts.slice(0, 2).join("") : parts[0])
    .toLowerCase();
  const anchor = code.toLowerCase().replace(/\//g, "");
  const urls = {
    bundler: `https://docs.rubocop.org/rubocop/cops_bundler.html#${anchor}`,
    gemspec: `https://docs.rubocop.org/rubocop/cops_gemspec.html#${anchor}`,
    layout: `https://docs.rubocop.org/rubocop/cops_layout.html#${anchor}`,
    lint: `https://docs.rubocop.org/rubocop/cops_lint.html#${anchor}`,
    metrics: `https://docs.rubocop.org/rubocop/cops_metrics.html#${anchor}`,
    migration: `https://docs.rubocop.org/rubocop/cops_migration.html#${anchor}`,
    minitest:
      `https://docs.rubocop.org/rubocop-minitest/cops_minitest.html#${anchor}`,
    naming: `https://docs.rubocop.org/rubocop/cops_naming.html#${anchor}`,
    performance:
      `https://docs.rubocop.org/rubocop-performance/cops_performance.html#${anchor}`,
    rails: `https://docs.rubocop.org/rubocop-rails/cops_rails.html#${anchor}`,
    rspec: `https://docs.rubocop.org/rubocop-rspec/cops_rspec.html#${anchor}`,
    rspeccapybara:
      `https://docs.rubocop.org/rubocop-rspec/cops_rspec/capybara.html#${anchor}`,
    rspecfactorybot:
      `https://docs.rubocop.org/rubocop-rspec/cops_rspec/factorybot.html#${anchor}`,
    rspecrails:
      `https://docs.rubocop.org/rubocop-rspec/cops_rspec/rails.html#${anchor}`,
    security: `https://docs.rubocop.org/rubocop/cops_security.html#${anchor}`,
    sorbet:
      `https://github.com/Shopify/rubocop-sorbet/blob/master/manual/cops_sorbet.md#${anchor}`,
    style: `https://docs.rubocop.org/rubocop/cops_style.html#${anchor}`,
  };
  return urls[department];
}
//# sourceMappingURL=rubocop.js.map
