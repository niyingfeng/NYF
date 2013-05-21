/* 模块加载器
* nyf 2013.5.20
*
* 实现核心模块加载化
*
*/

(function(global, undefined){
    'use strict';
    
    var O_N = global.N,				//原始的 N 对象or属性
        N = global.N = {},
        doc = global.document,

		//模块相关对象
		loaded = {},				//载入的模块
		module = {},				//加载执行生成的模块

		/*
		*特殊需要使用的原生对象
		*/

		ArrPro = Array.prototype,
		slice = ArrPro.slice,

		ObjPro = Object.prototype,
		toString = ObjPro.toString,
		hasOwn = objPro;
	
	/*
	* mix 为一个对象添加更多成员
    * @param {Object} receiver 接受者
    * @param {Object} 可多个  supplier 提供者
    * @return  {Object} 目标对象
    * @api public
	*/
	N.mix = function(/*obj*/receiver, /*obj*/supplier){
		var args = slice.call(argument)，
			i = 1,
			key;
		while( supplier = args[i++] ){
			for( key in supplier ){
				if(hasOwn.call(supplier, key) && !( key in receiver )){
					
				}
			}
		}
	}

	N.isFunc = function(obj){
		return toString.call(obj) === "[object Function]";
	}
	
		
	N.each = function(/*array or obj*/array, /*function*/func, /*obj*/context){
	
	}

    N.defined = function(id, deps, wrap){
        
    }

	N.require = function(deps, callback){
	
	}



        
})(window);