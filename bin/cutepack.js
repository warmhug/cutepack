#!/usr/bin/env node


var build = require('../main.js').build;
var fs = require('fs'), path = require('path'), config = '';

var filepath = path.join(process.cwd(), process.argv[2]) || '';
//console.log(filepath);
config = require(filepath).config;


// if (fs.existsSync(filepath)){
    // config = fs.readFileSync(filepath, 'utf8');
// }else{
    // return;
// }
//console.log(config);

if(!config.paths) return;
var options = config.options || 'undefined';

build(config.paths, options); // 没特殊需求，不需要传递options参数
