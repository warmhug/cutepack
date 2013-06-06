
var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    uglify = require('./lib/uglify-js/uglify-js');

var _util = {}, compressCode = '';
_util.uglify = function (orig_code, options) {
    options || (options = {});
    var jsp = uglify.parser;
    var pro = uglify.uglify;

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
    var arr = path.split(/\.js/),arrlen=arr.length, flag = '';
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
    var root = _util.getRoot(), pathobj = '', pat = '', flag = '', srcs = paths.src;
    for (var i = 0; i < srcs.length; i++) {
        pathobj = _util.checkPath(path.join(root, path.normalize(srcs[i])));
        pat = pathobj.path;
        flag = pathobj.flag;
        if (pat && fs.existsSync(pat)) {
            if (flag && flag === '-n') {
                compressCode += fs.readFileSync(pat, 'utf8') + '\n';
            }else {
                compressCode += _util.compress(pat, options) + '\n';
            }
        } else {
            continue;
        }
    }
    _util.createTarget(paths.tar);
}
_util.compress = function (file, options) {
    var data = fs.readFileSync(file, 'utf8'), code = '';
    //console.log(data);
    if (data) {
        code = _util.uglify(data, options);
        //console.log(code);
        return code;
    }
}
_util.createTarget = function (tar) {
    fs.writeFile('./' + tar, compressCode, function (err) {
        if (err) throw err;
        console.log('build success');
    });
}

function _build(paths, options) {
    if (typeof paths.src == 'undefined' || !util.isArray(paths.src)) {
        consoel.log('请确认设置了src路径，并且为数组类型');
        return;
    }
	if(typeof paths.tar == 'undefined' || Array.prototype.toString.call(paths.tar) != '[object String]') {
		paths.tar = '__build_' + Date.now() + '.js';
	}
    //
    _util.pathParse(paths, options);
}
exports.build = _build;
