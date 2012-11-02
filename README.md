cutepack
========

# 功能简单的JS打包工具 #

- 简介
> 把多个JS文件，压缩并依次打包进一个JS文件，压缩采用uglify-js引擎，多个模块文件打包到一个文件里，减少http请求消耗 :）

- **安装**
> npm install cutepack -g  
> （需要node0.8版本）

- 使用
 > 配置好build.js文件，命令行运行 cutepack build.js

    build.js示例：
<pre>
exports.config = {
    paths:[
        './test1.js-n', // -n参数，表示 此文件不压缩
        './test.js'    
    ],
    options:{
        strict_semicolons: false, //设为true时，代码需要写严格的分号
        mangle_options: {
            //defines: { DEBUG: ['onename', 'false'], VERSION: ['string', '1.0'] },
            except:['onename']  // 保留指定的变量名，函数名..不被修改
        },
        squeeze_options:{
        
        },
        gen_options: {
            ascii_only: false,  // pass true if you want to encode non-ASCII characters as \uXXXX.
            inline_script: false // – pass true to escape occurrences of &lt;/script&gt; in strings
        }
    }
}

paths数组 -- 为需要压缩打包的文件路径列表。路径相对于build.js所在的目录
options -- 为压缩参数配置，例如保留关键字，转换中文等。没特殊要求，options可以不写
</pre>

- 局限性

    1、只支持同一磁盘文件，相对路径形式，非http等线上文件。

    2、不支持css文件压缩打包，不支持整个目录打包输出。

    3、仅支持压缩打包多个指定的JS文件到**一个**文件中，满足最简单实用的需求。

    4、默认处理的文件并非特大文件，不会造成读写大文件导致内存溢出。

    5、没有处理常见的模块依赖。

- change log
    > build.js中增加options配置项，可指定压缩时不改变某些关键词，转义非ASCII字符为\uXXXX字符形式。 *2012-10-29*

    > 可配置参数-n，不压缩某文件（例如已经压缩过的文件，不需要重复压缩） 
      *2012-10-26*

    > 最初功能实现 *2012-10-22*