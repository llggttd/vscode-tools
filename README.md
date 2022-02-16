# Power Tools README

常用工具合集

## Features

支持指定选区，在不指定选区时，默认使用当前编辑器中的所有文本。

- json.format 格式化JSON字符串

- json.minify 压缩JSON字符串

- date.currentDate 在光标处插入当前时间, 如：2017-05-22

- date.currentTime 在光标处插入当前时间，如：14:24:17

- url.encodeURI URL编码

- url.decodeURI URL解码

- url.encodeURIComponents URL组件编码

- url.decodeURIComponents URL组件解码
 
- util.uniqueId 使用雪花算法生成分布式ID
 
- util.base64Encode base64编码

- util.base64Decode base64解码

- util.escape escape

- util.unescape unescape

## Requirements

- moment

## Extension Settings

## 打包

> npm install -g vsce
> vsce package