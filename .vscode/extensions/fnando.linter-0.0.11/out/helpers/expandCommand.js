"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandCommand = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const path = require("path");
const fs = require("fs");
function expandArgs(linterConfig, args) {
  var _a;
  const additionalArgs = Object.keys(
    (_a = linterConfig.args) !== null && _a !== void 0 ? _a : {},
  ).reduce((buffer, name) => {
    var _a, _b, _c;
    let value = true;
    const customArgs = ((_a = linterConfig.args) !== null && _a !== void 0
      ? _a
      : {})[name];
    if (
      (_b = customArgs.languages) === null || _b === void 0 ? void 0 : _b.length
    ) {
      value = value && customArgs.languages.includes(args.$language);
    }
    if (
      (_c = customArgs.extensions) === null || _c === void 0
        ? void 0
        : _c.length
    ) {
      value = value && customArgs.extensions.includes(args.$extension);
    }
    buffer[name] = value;
    return buffer;
  }, {});
  args = Object.assign(Object.assign({}, args), additionalArgs);
  return Object.keys(args).reduce(
    (buffer, key) =>
      Object.assign(buffer, { [`!${key}`]: !Boolean(buffer[key]) }),
    args,
  );
}
function expandCommand(linterConfig, args) {
  args = expandArgs(linterConfig, args);
  const command = linterConfig.command
    .flatMap((entry) => {
      if (!lodash_1.isArray(entry)) {
        return args[entry] || entry;
      }
      // If no value is found with that key, it means we don't have an argument
      // or the config is disabled.
      if (!args[entry[0]]) {
        return;
      }
      return entry.slice(1).map((item) => {
        var _a;
        return (_a = args[item]) !== null && _a !== void 0 ? _a : item;
      });
    })
    .filter(Boolean)
    .map((entry) => `${entry}`);
  const shim = path.join(
    vscode.extensions.getExtension("fnando.linter").extensionPath,
    "shims",
    `${path.basename(command[0])}-shim`,
  );
  if (fs.existsSync(shim)) {
    command[0] = shim;
  }
  return command;
}
exports.expandCommand = expandCommand;
//# sourceMappingURL=expandCommand.js.map
