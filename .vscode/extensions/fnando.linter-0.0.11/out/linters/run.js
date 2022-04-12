"use strict";
var __awaiter = (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignore = exports.fix = exports.run = void 0;
const vscode = require("vscode");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const linters = require(".");
const getAvailableLinters_1 = require("../helpers/getAvailableLinters");
const expandCommand_1 = require("../helpers/expandCommand");
const getLinterConfig_1 = require("../helpers/getLinterConfig");
const getEditor_1 = require("../helpers/getEditor");
const getIndent_1 = require("../helpers/getIndent");
const debug_1 = require("../helpers/debug");
function run(document, diagnosticCollection, offenses) {
  return __awaiter(this, void 0, void 0, function* () {
    if (["code-runner-output"].includes(document.languageId)) {
      return;
    }
    const config = vscode.workspace.getConfiguration("linter");
    const availableLinters = getAvailableLinters_1.getAvailableLinters();
    const matchingLinters = Object.keys(availableLinters).filter((name) => {
      var _a, _b, _c;
      return availableLinters[name].languages.includes(document.languageId) &&
        ((_c =
                (_b =
                      (_a = availableLinters[name].files) === null ||
                        _a === void 0
                        ? void 0
                        : _a[document.languageId]) === null || _b === void 0
                  ? void 0
                  : _b.includes(path.basename(document.uri.path))) !== null &&
            _c !== void 0
          ? _c
          : true);
    });
    const diagnostics = [];
    const contents = document.getText();
    if (!matchingLinters.length) {
      debug_1.debug(
        "No linters found for",
        JSON.stringify(document.languageId),
      );
    }
    offenses.length = 0;
    for (let linterName of matchingLinters) {
      const linterConfig = availableLinters[linterName];
      if (!linterConfig.enabled) {
        debug_1.debug(`${linterName}`, "linter is disabled, so skipping.");
        continue;
      }
      const rootDir = findRootDir(document.uri);
      const configFile = findConfigFile(document.uri, linterConfig.configFiles);
      const command = expandCommand_1.expandCommand(linterConfig, {
        $file: document.uri.path,
        $extension: path.extname(document.uri.path).toLowerCase(),
        $config: configFile,
        $debug: config.debug,
        $lint: true,
        $language: document.languageId,
      });
      debug_1.debug({
        rootDir,
        configFile,
        command,
      });
      offenses.push(
        ...runLinter(
          document.uri,
          contents,
          rootDir,
          linters.get(linterName),
          command,
        ),
      );
    }
    offenses.forEach((offense) => {
      diagnostics.push({
        code: offense.code,
        source: offense.source,
        message: offense.message,
        range: new vscode.Range(
          new vscode.Position(offense.lineStart, offense.columnStart),
          new vscode.Position(offense.lineEnd, offense.columnEnd),
        ),
        severity: offense.severity,
      });
    });
    diagnosticCollection.clear();
    diagnosticCollection.set(document.uri, diagnostics);
  });
}
exports.run = run;
function findConfigFile(uri, configFiles) {
  if (!configFiles.length) {
    return "";
  }
  const dirs = uri.path.split("/").slice(0, -1);
  while (dirs.length > 0) {
    for (let candidate of configFiles) {
      const configFile = path.resolve(dirs.join("/"), candidate);
      if (fs.existsSync(configFile)) {
        return configFile;
      }
    }
    dirs.pop();
  }
  return "";
}
function isBinWithinPath(bin) {
  var _a, _b;
  const dirs =
    (_b = (_a = process.env.PATH) === null || _a === void 0
          ? void 0
          : _a.split(":").filter(Boolean)) !== null && _b !== void 0
      ? _b
      : [];
  return dirs.some((dir) => {
    try {
      return (fs.accessSync(path.join(dir, bin), fs.constants.X_OK) ===
        undefined);
    } catch (error) {
      return false;
    }
  });
}
function runLinter(uri, input, rootDir, linter, command) {
  var _a, _b, _c, _d, _e, _f;
  try {
    if (!command[0].includes("/") && !isBinWithinPath(command[0])) {
      debug_1.debug(
        `The ${command[0]} binary couldn't be found within $PATH:`,
        (_a = process.env.PATH) === null || _a === void 0
          ? void 0
          : _a.split(":").filter(Boolean),
      );
      return [];
    }
    const result = childProcess.spawnSync(command[0], command.slice(1), {
      input,
      env: process.env,
      cwd: rootDir,
    });
    if (result.error) {
      debug_1.debug(
        `Error while running "${command[0]}":`,
        result.error.message,
      );
      return [];
    }
    const params = {
      uri,
      stdout: (_c = (_b = result.stdout) === null || _b === void 0
              ? void 0
              : _b.toString()) !== null && _c !== void 0
        ? _c
        : "",
      stderr: (_e = (_d = result.stderr) === null || _d === void 0
              ? void 0
              : _d.toString()) !== null && _e !== void 0
        ? _e
        : "",
      status: (_f = result.status) !== null && _f !== void 0
        ? _f
        : 0,
    };
    return linter.call(params);
  } catch (error) {
    debug_1.debug(error);
    return [];
  }
}
function findRootDir(uri) {
  var _a;
  const rootDirUri =
    ((_a = vscode.workspace.getWorkspaceFolder(uri)) === null || _a === void 0
      ? void 0
      : _a.uri) ||
    vscode.Uri.parse(path.resolve(uri.path, ".."));
  return rootDirUri.path;
}
function fix(offense, editor, type) {
  const input = editor.document.getText();
  const rootDir = findRootDir(offense.uri);
  const linterConfig = getLinterConfig_1.getLinterConfig(offense.source);
  const configFile = findConfigFile(offense.uri, linterConfig.configFiles);
  const command = expandCommand_1.expandCommand(linterConfig, {
    $file: offense.uri.path,
    $extension: path.extname(offense.uri.path).toLowerCase(),
    $code: offense.code,
    $fixAll: type === "fix-all",
    $fixOne: type === "fix-one",
    $fixCategory: type === "fix-category",
    $config: configFile,
    $debug: vscode.workspace.getConfiguration("linter").debug,
    $language: editor.document.languageId,
  });
  const linter = linters.get(offense.source);
  try {
    const result = childProcess.spawnSync(command[0], command.slice(1), {
      input,
      env: process.env,
      cwd: rootDir,
    });
    editor.edit((change) => {
      const firstLine = editor.document.lineAt(0);
      const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
      const range = new vscode.Range(firstLine.range.start, lastLine.range.end);
      change.replace(
        range,
        linter.fixOutput(
          input,
          result.stdout.toString(),
          result.stderr.toString(),
        ),
      );
    });
  } catch (error) {
    debug_1.debug(error);
  }
}
exports.fix = fix;
function ignore(offense, type) {
  const linter = linters.get(offense.source);
  const editor = getEditor_1.getEditor(offense.uri);
  if (!editor) {
    return;
  }
  let line;
  let replacement;
  if (type === "ignore-eol") {
    line = editor.document.lineAt(offense.lineStart);
    replacement = linter.ignoreEol({
      text: line.text,
      number: offense.lineStart,
    }, offense.code);
  }
  if (type === "ignore-file") {
    line = editor.document.lineAt(0);
    const indent = getIndent_1.getIndent(line.text);
    replacement = linter.ignoreFile(
      { text: line.text, number: 0 },
      offense.code,
      indent,
    );
  }
  if (type === "ignore-line") {
    line = editor.document.lineAt(Math.max(0, offense.lineStart - 1));
    const indent = getIndent_1.getIndent(
      editor.document.lineAt(offense.lineStart).text,
    );
    replacement = linter.ignoreLine(
      { number: offense.lineStart, text: line.text },
      offense.code,
      indent,
    );
  }
  editor.edit((change) => change.replace(line.range, replacement));
}
exports.ignore = ignore;
//# sourceMappingURL=run.js.map
