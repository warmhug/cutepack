var build = require('../main.js').build;

var paths = [
    './test1.js-n', // -n参数，表示 此文件不压缩
    './test.js'
];

build(paths);