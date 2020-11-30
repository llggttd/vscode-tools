const vscode = require('vscode')
const moment = require('moment')
const snowFlake = require('./src/snow-flake')

var LINE_SEPERATOR = /\n|\r\n/
var JSON_SPACE = 2

/**
 * 获取当前操作区域和文本
 * @param {vscode.TextEditor} editor 
 */
function getCurrentSelection(editor) {
	let raw, range
	if (editor.selection.isEmpty) {
		raw = editor.document.getText()
		let start = new vscode.Position(0, 0)
		let lines = raw.split(LINE_SEPERATOR)
		let end = new vscode.Position(lines.length, lines[lines.length - 1].length)
		range = new vscode.Range(start, end)
	} else {
		range = editor.selection
		raw = editor.document.getText(range)
	}
	return {
		raw,
		range
	}
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

/**
 * 格式化JSON字符串
 */
const formatJson = vscode.commands.registerTextEditorCommand('json.format', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	let json = parseJson(raw)
	if (!json) {
		vscode.window.showErrorMessage('不合法的JSON字符串')
		return
	}
	editor.edit(function (builder) {
		builder.replace(range, JSON.stringify(json, null, JSON_SPACE))
	})
})

/**
 * 压缩JSON字符串
 */
const minifyJson = vscode.commands.registerTextEditorCommand('json.minify', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	let json = parseJson(raw)
	if (!json) {
		vscode.window.showErrorMessage('不合法的JSON字符串')
		return
	}
	editor.edit(function (builder) {
		builder.replace(range, JSON.stringify(json))
	})
})

/**
 * 插入当前时间
 */
const currentTime = vscode.commands.registerTextEditorCommand('date.currentTime', function (editor) {
	editor.edit(function (builder) {
		builder.insert(editor.selection.start, moment().format(moment.HTML5_FMT.TIME_SECONDS))
	})
})

/**
 * 插入当前日期
 */
const currentDate = vscode.commands.registerTextEditorCommand('date.currentDate', function (editor) {
	editor.edit(function (builder) {
		builder.insert(editor.selection.start, moment().format(moment.HTML5_FMT.DATE))
	})
})

/**
 * encodeURI
 */
const urlEncode = vscode.commands.registerTextEditorCommand('url.encodeURI', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	editor.edit(function (builder) {
		builder.replace(range, encodeURI(raw))
	})
})

/**
 * decodeURI
 */
const urlDecode = vscode.commands.registerTextEditorCommand('url.decodeURI', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	editor.edit(function (builder) {
		builder.replace(range, decodeURI(raw))
	})
})

/**
 * encodeURIComponents
 */
const urlComponentsEncode = vscode.commands.registerTextEditorCommand('url.encodeURIComponents', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	editor.edit(function (builder) {
		builder.replace(range, encodeURIComponent(raw))
	})
})

/**
 * decodeURIComponent
 */
const urlComponentsDecode = vscode.commands.registerTextEditorCommand('url.decodeURIComponents', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	editor.edit(function (builder) {
		builder.replace(range, decodeURIComponent(raw))
	})
})

/**
 * uniqueid
 */
const uniqId = vscode.commands.registerTextEditorCommand('util.uniqueId', function (editor) {
	editor.edit(function (builder) {
		builder.insert(editor.selection.start, snowFlake.nextId().toString())
	})
})

/**
 * base64编码
 */
const base64Encode = vscode.commands.registerTextEditorCommand('util.base64Encode', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	editor.edit(function (builder) {
		builder.replace(range, Buffer.from(raw).toString('base64'))
	})
})

/**
 * base64解码
 */
const base64Decode = vscode.commands.registerTextEditorCommand('util.base64Decode', function (editor) {
	let { raw, range } = getCurrentSelection(editor)
	editor.edit(function (builder) {
		builder.replace(range, Buffer.from(raw, 'base64').toString())
	})
})

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('激活扩展')
	context.subscriptions.push(formatJson)
	context.subscriptions.push(minifyJson)
	context.subscriptions.push(currentTime)
	context.subscriptions.push(currentDate)
	context.subscriptions.push(urlEncode)
	context.subscriptions.push(urlDecode)
	context.subscriptions.push(urlComponentsEncode)
	context.subscriptions.push(urlComponentsDecode)
	context.subscriptions.push(uniqId)
	context.subscriptions.push(base64Encode)
	context.subscriptions.push(base64Decode)
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {
	console.log('关闭扩展')
}

exports.deactivate = deactivate

module.exports = {
	activate,
	deactivate
}
