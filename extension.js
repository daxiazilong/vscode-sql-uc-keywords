// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const uckw = require('./uppercase-keywords');
const { Range } = vscode;

// this method is called when your extension is activated
function activate() {
    console.log('SQL uppercase keywords activated');
    

    vscode.languages.registerDocumentRangeFormattingEditProvider('sql', {
        provideDocumentRangeFormattingEdits(document, range) {
            let text = document.getText(range);
            // let replaceRange = new Range(document.positionAt(0), document.positionAt(text.length));
            return [vscode.TextEdit.replace(range, uckw(text))];
        }
    });
}
exports.activate = activate;