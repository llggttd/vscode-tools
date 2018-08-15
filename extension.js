const vscode = require('vscode')
const moment = require('moment')

var LINE_SEPERATOR = /\n|\r\n/
var JSON_SPACE = 4

/**
 * 
 * @param {TextEditor} editor 
 */
function getCurrentSelection(editor) {
    let raw, range
    if (!editor.selection.isEmpty) {
        range = editor.selection
        raw = editor.document.getText(range)
    } else {
        raw = editor.document.getText()
        let start = new vscode.Position(0, 0)
        let lines = raw.split(LINE_SEPERATOR)
        let end = new vscode.Position(lines.length, lines[lines.length - 1].length)
        range = new vscode.Range(start, end)
    }
    return [raw, range]
}

/**
 * 
 * @param {String} raw 
 */
function parseJson(raw) {
    try {
        return JSON.parse(raw)
    } catch (jsonParseError) {
        return undefined
    }
}

function activate(context) {
    console.log('激活扩展 <tools>');
    let formatJson = vscode.commands.registerTextEditorCommand('json.format', function (editor) {
        let [raw, range] = getCurrentSelection(editor)
        let json = parseJson(raw)
        if (!json) {
            vscode.window.showErrorMessage('不合法的JSON字符串')
            return
        }
        editor.edit(function (builder) {
            builder.replace(range, JSON.stringify(json, null, JSON_SPACE))
        })
    })
    context.subscriptions.push(formatJson)

    let minifyJson = vscode.commands.registerTextEditorCommand('json.minify', function (editor) {
        let [raw, range] = getCurrentSelection(editor)
        let json = parseJson(raw)
        if (!json) {
            vscode.window.showErrorMessage('不合法的JSON字符串')
            return
        }
        editor.edit(function (builder) {
            builder.replace(range, JSON.stringify(json))
        })
    })
    context.subscriptions.push(minifyJson);

    let currentTime = vscode.commands.registerTextEditorCommand('date.currentTime', function (editor) {
        editor.edit(function (builder) {
            builder.insert(editor.selection.start, moment().format('HH:mm:ss'))
        })
    })
    context.subscriptions.push(currentTime);

    let currentDate = vscode.commands.registerTextEditorCommand('date.currentDate', function (editor) {
        editor.edit(function (builder) {
            builder.insert(editor.selection.start, moment().format('YYYY-MM-DD'))
        })
    })
    context.subscriptions.push(currentDate);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log('关闭扩展 <tools>')
}
exports.deactivate = deactivate;