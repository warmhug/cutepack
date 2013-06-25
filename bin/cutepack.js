#!/usr/bin/env node

//var util = require("util");
var build = require('../main.js').build;
var fs = require('fs'), path = require('path');

var filepath = path.join(process.cwd(), process.argv[2] || 'cp-config.js') || '';

var config, 
    cfgfile, 
    log = 
    '//请在要运行打包的目录下新建cp-config.js文件并参考以下配置参数，命令行运行cutepack。：\n' + 
    '//或者新建自定义命名的文件xxx，并参考以下配置参数，命令行运行cutepack xxx。：\n' + 
        'exports.config = \n' +
        '[\n' +
        '    {\n' +
        '        paths:{\n' +
        '            src:[\n' +
        '                "./test1.js-n", // 相对build配置文件的路径，-n参数，表示此文件不压缩\n' +
        '                "./test.js"\n' +   
        '            ],\n' +
        '            tar: "../tar.js"  //输出的目标文件\n' +
        '        }\n' +
        '    },\n' +
        '    {\n' +
        '        paths:{\n' +
        '            src:[\n' +
        '                "./test1.js-n",\n' +
        '                "./test.js"\n' +   
        '            ],\n' +
        '            tar: "../tar1.js"\n' +
        '        },\n' +
        '        options:{  //可选，一般不需要配置此参数\n' +
        '            strict_semicolons: true, //设为true时，代码需要写严格的分号\n' +
        '            mangle_options: {\n' +
        '                except:["onename"]   // 保留指定的变量名，函数名..不被修改\n' +
        '            },\n' +
        '            gen_options: {\n' +
        '                ascii_only: false,  // pass true if you want to encode non-ASCII characters as unicode characters.\n' +
        '                inline_script: false // – pass true to escape occurrences of </script in strings\n' +
        '            }\n' +
        '        }\n' +
        '    }\n' +        
        ']';
try{
    cfgfile = require(filepath)
    config = cfgfile.config;
}catch (e){
    console.log(log);
    return;
}

var options, _toString = Array.prototype.toString;

/**
console.log(typeof ('aaa'))
console.log(typeof (function(){}))
console.log(typeof (new function(){}))
console.log(typeof ({}))
console.log(typeof ([]))
console.log(typeof (/^\s+$/))
console.log(util.isRegExp(/^\s+$/))
console.log(Array.prototype.toString.call([{},{},'aaa']))  //注意此结果
console.log(util.isArray([{},{},'aaa']))
console.log(Array.isArray([{},{},'aaa']))
*/

if(typeof config == 'undefined') {
    console.log(log);
    return;
}else if(_toString.call(config) === '[object Object]' && config.paths){ //兼容原来配置方式
    options = config.options;
    build(config.paths, options); 
}else if(Array.isArray(config)){
    config.forEach(function(item){
        if(_toString.call(item) === '[object Object]' && item.paths){
            options = item.options;
            build(item.paths, options);             
        }
    })
}

