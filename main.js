
var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    uglify = require('./lib/uglify-js/uglify-js');

var _util = {'compressCode':''};
_util.uglify = function (orig_code, options) {
    options || (options = {});
    var jsp = uglify.parser;
    var pro = uglify.uglify;

    //console.log(orig_code,options)
    var ast = jsp.parse(orig_code, options.strict_semicolons); // parse code and get the initial AST
    ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names(去掉，则不修改变量名)
    ast = pro.ast_squeeze(ast, options.squeeze_options); // get an AST with compression optimizations
    var final_code = pro.gen_code(ast, options.gen_options); // compressed code here
    return final_code;
};
_util.getRoot = function () {
    //console.log('Current directory: ' + process.cwd());
    return process.cwd();
}
_util.checkPath = function (path) {
    var arr = path.split(/\.js/),arrlen = arr.length, flag = '';
    //console.log(arr.length);
    if (arr[0] === '') return;
    if (arrlen > 1 && arr[1] !== '') {
        switch (arr[1]) {
            case '-n':
                flag = '-n';
        }
    }
    return {
        path: arr[0] + '.js',
        flag: flag
    }
}
_util.pathParse = function (paths, options) {
    var root = _util.getRoot(), pathobj = '', pat = '', srcs = paths.src;
    for (var i = 0; i < srcs.length; i++) {
        pathobj = _util.checkPath(path.join(root, path.normalize(srcs[i])));
        pat = pathobj.path;
        if (pat && fs.existsSync(pat)) {
            _util.compressCode += _util.compress(pat, pathobj.flag, options)
        } else {
            continue;
        }
    }
    _util.createTarget(paths.tar);
}
_util.compress = function (pat, flag, options) {
    var data = fs.readFileSync(pat, 'utf8'), code = '';
    if (data) {
		if (flag && flag === '-n') {
	        code = data + '\n';
	    }else {
	        //console.log(_util.compressCode)
	        code = _util.uglify(data, options) + ';\n';
	    }
        return code;
    }
}
_util.createTarget = function (tar) {
	var tar = './' + tar
	fs.writeFileSync(tar, _util.compressCode);
	console.log('[build success] target file in "' + tar + '"');
}

function _build(paths, options) {
    if (typeof paths.src == 'undefined' || !util.isArray(paths.src)) {
        console.log('请确认设置了src路径，并且为数组类型');
        return;
    }
	if(typeof paths.tar == 'undefined' || Array.prototype.toString.call(paths.tar) != '[object String]') {
		paths.tar = '__build_' + Date.now() + '.js';
	}
	_util.compressCode = '';
    _util.pathParse(paths, options);
}
exports.build = _build;
