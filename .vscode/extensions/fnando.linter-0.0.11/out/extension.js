"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const lodash_1 = require("lodash");
const CodeActionProvider_1 = require("./CodeActionProvider");
const run_1 = require("./linters/run");
const getEditor_1 = require("./helpers/getEditor");
function activate(context) {
  const runLinters = lodash_1.debounce(run_1.run, 200);
  const runFix = lodash_1.debounce(run_1.fix, 200);
  const runIgnore = lodash_1.debounce(run_1.ignore, 200);
  const { subscriptions } = context;
  const offenses = [];
  const diagnostics = vscode.languages.createDiagnosticCollection("linter");
  const codeActionProvider = new CodeActionProvider_1.CodeActionProvider(
    diagnostics,
    offenses,
  );
  // Diagnostics code ----------------------------------------------------------
  if (vscode.window.activeTextEditor) {
    runLinters(vscode.window.activeTextEditor.document, diagnostics, offenses);
  }
  subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
    offenses.length = 0;
    diagnostics.clear();
    if (editor) {
      runLinters(editor.document, diagnostics, offenses);
    }
  }));
  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      runLinters(document, diagnostics, offenses);
    }),
  );
  // CodeAction code -----------------------------------------------------------
  subscriptions.push(
    vscode.languages.registerCodeActionsProvider("*", codeActionProvider),
  );
  subscriptions.push(
    vscode.commands.registerCommand("linter.autoCorrect", (offense, type) => {
      const editor = getEditor_1.getEditor(offense.uri);
      if (editor) {
        runFix(offense, editor, type);
      }
    }),
  );
  subscriptions.push(
    vscode.commands.registerCommand("linter.openUrl", (url) => {
      vscode.env.openExternal(vscode.Uri.parse(url));
    }),
  );
  subscriptions.push(
    vscode.commands.registerCommand("linter.ignoreError", (offense, type) => {
      runIgnore(offense, type);
    }),
  );
  // Notifications -------------------------------------------------------------
  subscriptions.push(
    vscode.commands.registerCommand("linter.didStart", () => {}),
  );
  vscode.commands.executeCommand("linter.didStart");
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
