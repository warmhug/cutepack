
var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    uglify = require('uglify-js');

var _util = {}, compressCode = '';
_util.uglify = function (orig_code, options) {
    options || (options = {});
    var jsp = uglify.parser;
    var pro = uglify.uglify;

    var ast = jsp.parse(orig_code, options.strict_semicolons); // parse code and get the initial AST
    ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names
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
    console.log(arr.length);
    if (arr[0] === '') return;
    if (arrlen > 1 && arr[1] !== '') {
        switch (arr[1]) {
            case '-n':
                flag = 'none';
        }
    }
    return {
        path: arr[0] + '.js',
        flag: flag
    }

}
_util.pathParse = function (paths) {
    var root = _util.getRoot(), pathobj = '';
    for (var i = 0; i < paths.length; i++) {
        single = path.join(root, path.normalize(paths[i]));
        var pathobj = _util.checkPath(single);

        if (fs.existsSync(single)) {
            compressCode += _util.compress(single) + '\n';
        } else {
            continue;
        }
    }
    _util.createTarget();
}
_util.compress = function (file) {
    var data = fs.readFileSync(file, 'utf8'), code = '';
    //console.log(data);
    if (data) {
        code = _util.uglify(data);
        //console.log(code);
        return code;
    }
}
_util.createTarget = function () {
    //var now=
    //console.log(compressCode);
    //console.log(Date.now());
    var name = '__build_' + Date.now() + '.js';
    fs.writeFile('./' + name, compressCode, function (err) {
        if (err) throw err;
        console.log('build success');
    });
}

function _build(paths) {
    if (!util.isArray(paths)) return;
    //
    _util.pathParse(paths);
}
exports.build = _build;
