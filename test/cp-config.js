
exports.config = {
    paths:{
		src:[
			'./test1.js-n', // -n参数，表示 此文件不压缩
			'./test.js'    
		],
		tar: '../tar.js'  //输出的目标文件
	},
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
            inline_script: false // – pass true to escape occurrences of </script in strings
        }
    }
}

