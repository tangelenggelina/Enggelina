"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.log = void 0;
const vscode = require("vscode");
const output = vscode.window.createOutputChannel("linter");
function log(...args) {
  args = args.map((item) => {
    if (["boolean", "string", "number"].includes(typeof item)) {
      return item.toString();
    }
    if (item === null) {
      return "null";
    }
    if (item === undefined) {
      return "undefined";
    }
    return JSON.stringify(item, null, 2);
  });
  output.appendLine(args.join(" "));
}
exports.log = log;
function debug(...args) {
  log(`\n[${new Date().toLocaleString()}]`, ...args);
}
exports.debug = debug;
//# sourceMappingURL=log.js.map
