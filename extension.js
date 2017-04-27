const vscode = require('vscode')

var LINE_SEPERATOR = /\n|\r\n/
var JSON_SPACE = 4

function activate(context) {
    console.log('激活扩展 <tools>');

    let disposable = vscode.commands.registerTextEditorCommand('json.format', function (editor) {
        let raw = editor.document.getText()
        let json
        try {
            json = JSON.parse(raw)
        } catch (jsonParseError) {
            vscode.window.showErrorMessage('不合法的JSON字符串')
            return
        }
        let pretty = JSON.stringify(json, null, JSON_SPACE)
        editor.edit(function (builder) {
            let start = new vscode.Position(0, 0)
            let lines = raw.split(LINE_SEPERATOR)
            let end = new vscode.Position(lines.length, lines[lines.length - 1].length)
            let allRange = new vscode.Range(start, end)
            builder.replace(allRange, pretty)
        })
    })
    context.subscriptions.push(disposable)

    disposable = vscode.commands.registerTextEditorCommand('json.minify', function (editor) {
        let raw = editor.document.getText()
        let json
        try {
            json = JSON.parse(raw)
        } catch (jsonParseError) {
            vscode.window.showErrorMessage('不合法的JSON字符串')
            return
        }
        let pretty = JSON.stringify(json)
        editor.edit(function (builder) {
            let start = new vscode.Position(0, 0)
            let lines = raw.split(LINE_SEPERATOR)
            let end = new vscode.Position(lines.length, lines[lines.length - 1].length)
            let allRange = new vscode.Range(start, end)
            builder.replace(allRange, pretty)
        })
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log('关闭扩展 <tools>')
}
exports.deactivate = deactivate;