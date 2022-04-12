"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeActionProvider = void 0;
const vscode = require("vscode");
const getLinterConfig_1 = require("./helpers/getLinterConfig");
const lodash_1 = require("lodash");
class CodeActionProvider {
  constructor(diagnostics, offenses) {
    this.offenses = offenses;
    this.diagnostics = diagnostics;
  }
  provideCodeActions(document, range) {
    const actions = [];
    lodash_1.uniq(this.offenses.map((offense) => offense.source)).forEach(
      (source) => {
        const lintConfig = getLinterConfig_1.getLinterConfig(source);
        if (lintConfig.capabilities.includes("fix-all")) {
          actions.push(this.fixAllAction(document.uri, source, "fix-all"));
        }
      },
    );
    const matchedOffenses = this.offenses.filter((offense) => {
      return (offense.uri.path === document.uri.path &&
        range.start.line === offense.lineStart &&
        range.start.character === offense.columnStart &&
        range.end.line === offense.lineEnd &&
        range.end.character === offense.columnEnd);
    });
    if (!matchedOffenses.length) {
      return [];
    }
    for (let offense of matchedOffenses) {
      const linterConfig = getLinterConfig_1.getLinterConfig(offense.source);
      this.openLink(
        document.uri,
        `Visit ${offense.source}'s website`,
        linterConfig.url,
      );
      if (
        linterConfig.capabilities.includes("fix-one") &&
        offense.correctable
      ) {
        actions.push(this.fixAction(document.uri, offense, "fix-one"));
      }
      if (
        linterConfig.capabilities.includes("fix-category") &&
        offense.correctable
      ) {
        actions.push(
          this.fixCategoryAction(document.uri, offense, "fix-category"),
        );
      }
      if (linterConfig.capabilities.includes("ignore-eol")) {
        actions.push(this.ignoreEol(document.uri, offense));
      }
      if (linterConfig.capabilities.includes("ignore-line")) {
        actions.push(this.ignoreLine(document.uri, offense));
      }
      if (linterConfig.capabilities.includes("ignore-file")) {
        actions.push(this.ignoreFile(document.uri, offense));
      }
      if (offense.url) {
        actions.push(
          this.openLink(
            document.uri,
            `View ${offense.source}:${offense.code} documentation`,
            offense.url,
          ),
        );
      }
    }
    return lodash_1.sortBy(this.dedupe(actions), (action) => action.title);
  }
  dedupe(actions) {
    const viewedTitles = [];
    return actions.filter((action) => {
      var _a, _b, _c;
      if (
        ((_a = action.command) === null || _a === void 0
          ? void 0
          : _a.command) === "linter.openUrl"
      ) {
        if (
          viewedTitles.includes(
            (_b = action.command) === null || _b === void 0 ? void 0 : _b.title,
          )
        ) {
          return false;
        }
        viewedTitles.push(
          (_c = action.command) === null || _c === void 0 ? void 0 : _c.title,
        );
      }
      return true;
    });
  }
  openLink(uri, title, url) {
    const action = new vscode.CodeAction(title);
    action.kind = vscode.CodeActionKind.QuickFix;
    action.diagnostics = this.diagnostics.get(uri);
    action.command = {
      title: "",
      command: "linter.openUrl",
      arguments: [url],
    };
    return action;
  }
  ignoreFile(uri, offense) {
    const action = new vscode.CodeAction(
      `Disable ${offense.source}:${offense.code} for the entire file`,
    );
    action.kind = vscode.CodeActionKind.QuickFix;
    action.diagnostics = this.diagnostics.get(uri);
    action.command = {
      title: "",
      command: "linter.ignoreError",
      arguments: [offense, "ignore-file"],
    };
    return action;
  }
  ignoreEol(uri, offense) {
    const action = new vscode.CodeAction(
      `Disable ${offense.source}:${offense.code} for this line`,
    );
    action.kind = vscode.CodeActionKind.QuickFix;
    action.diagnostics = this.diagnostics.get(uri);
    action.command = {
      title: "",
      command: "linter.ignoreError",
      arguments: [offense, "ignore-eol"],
    };
    return action;
  }
  ignoreLine(uri, offense) {
    const action = new vscode.CodeAction(
      `Disable ${offense.source}:${offense.code} for this line`,
    );
    action.kind = vscode.CodeActionKind.QuickFix;
    action.diagnostics = this.diagnostics.get(uri);
    action.command = {
      title: "",
      command: "linter.ignoreError",
      arguments: [offense, "ignore-line"],
    };
    return action;
  }
  fixAllAction(uri, source, type) {
    const action = new vscode.CodeAction(
      `Fix all ${source} rules on this file`,
    );
    action.kind = vscode.CodeActionKind.QuickFix;
    action.command = {
      title: "",
      command: "linter.autoCorrect",
      arguments: [
        {
          uri: uri,
          source,
        },
        type,
      ],
    };
    action.diagnostics = this.diagnostics.get(uri);
    return action;
  }
  fixCategoryAction(uri, offense, type) {
    const action = new vscode.CodeAction(
      `Fix all ${offense.source}:${offense.code} on this file`,
    );
    action.kind = vscode.CodeActionKind.QuickFix;
    action.command = {
      title: "",
      command: "linter.autoCorrect",
      arguments: [offense, type],
    };
    action.diagnostics = this.diagnostics.get(uri);
    return action;
  }
  fixAction(uri, offense, type) {
    const action = new vscode.CodeAction(
      `Fix ${offense.source}:${offense.code} on this file`,
    );
    action.kind = vscode.CodeActionKind.QuickFix;
    action.command = {
      title: "",
      command: "linter.autoCorrect",
      arguments: [offense, type],
    };
    action.diagnostics = this.diagnostics.get(uri);
    return action;
  }
}
exports.CodeActionProvider = CodeActionProvider;
CodeActionProvider.providedCodeActionKinds = [
  vscode.CodeActionKind.QuickFix,
];
//# sourceMappingURL=CodeActionProvider.js.map
