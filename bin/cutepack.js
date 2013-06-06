#!/usr/bin/env node


var build = require('../main.js').build;
var fs = require('fs'), path = require('path');

var filepath = path.join(process.cwd(), process.argv[2] || 'cp-config.js') || '';

var config, 
	cfgfile, 
	log = '//请在要运行打包的目录下新建cp-config.js文件，并至少填入以下配置内容（更详细参数配置见readme文档）：\n' + 
        'exports.config = {\n' +
        '    paths:{\n' +
        '        src:[\n' +
        '            "./test1.js-n", // 相对build配置文件的路径，-n参数，表示此文件不压缩\n' +
        '            "./test.js"\n' +   
        '        ],\n' +
        '        tar: "../tar.js"  //输出的目标文件\n' +
        '    }\n' +
        '}\n';
try{
	cfgfile = require(filepath)
	config = cfgfile.config;
}catch (e){
	console.log(log);
	return;
}

if(typeof config == 'undefined' || !config.paths) {
    console.log(log);
    return;
}
var options = config.options || 'undefined';

build(config.paths, options); // 没特殊需求，不需要传递options参数
