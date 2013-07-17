// 简单的 N 框架
// nyf 2013.7.1

// 实现模块加载化

(function(global, undefined){
    'use strict';

    // 大对象
    var O_N = global.N, //原始的 N 对象or属性
        N = global.N = {},
        doc = global.document;

    // 原型方法引用
    var ArrayProto = Array.prototype,
        ObjectProto = Object.prototype,
        toString = ObjectProto.toString,
        hasOwn = ObjectProto.hasOwnProperty,
        slice = ArrayProto.slice;

    // 正则集中
    var typeReg = /\[object (\w+)\]/;
    
    // 
    var arrayType = "[object Array]",
        functionType = "[object Function]",
        objectType = "[object Object]";



    var Model = N.model = {},
        modelMap = {};

    /** 模块定义 define
    *   处理一下 2 种情况 参数
    *  
    *   @method define
    *   @param {String} name 必选 模块名称
    *   @param {Array} deps 可选 依赖关系模块
    *   @param {Function} wrap 必选 模块函数实现
    *   @return {Object} 返回模块信息对象
    *   @private
    */
    function define(name, deps, wrap){
        var expLen, i, len,
            exports = [],
            model = modelMap[name];

        if( model ){
            return model;
        }

        if( !wrap ){
            wrap = deps;
            deps = [];     
        }

        for (i=0, len=deps.length; i<len ; i++) {
            if( modelMap[deps[i]].export ){
                exports.push( modelMap[deps[i]].export );
            }else{
                // 该处需要加载所需模块文件
            }
        };

        model = {
            name : name,
            deps : deps,
            wrap : wrap,
            export : wrap.apply(this, exports)
        }

        return model;
    }

    function require(){
    }



    /** 底层基础工具函数
    *
    *
    *
    *
    */

    function isArray(arr){
        return (toString.call(arr) === arrayType);
    }

    function isFunction(func){
        return (toString.call(func) === functionType);
    }

    function type(obj){
        return (typeof obj === "object"?
                (obj===null ? "null" : typeReg.exec(toString.call(obj))[1].toLowerCase()) :
                typeof obj);
    }

    N.isArray = isArray;
    N.isFunction = isFunction;
    N.type = type;


    function each( array, iterator, context ){
        var value,i,len,
            forEach = ArrayProto.forEach;

        context = context||this;

        if(array == null) return;

        if(forEach && array.forEach === forEach){
            array.forEach(iterator, context);
        }else if( isArray(array) ){
            for(i=0, len=array.length; i<len; i++){
                iterator.call(context, array[i], i, array);            
            }
        }else{
            for(var key in array){
                if(hasOwn.call(array, key)){
                    iterator.call(context, array[key], key, array);
                }
            }
        }
    }

    // 
    function map( array, iterator, context ){
        var value,i,len,newArr,
            map = ArrayProto.map;

        context = context||this;

        if(array == null) return;

        if(map && array.map === map){
            return array.map(iterator, context);
        }else if( isArray(array) ){
            newArr = [];
            for(i=0, len=array.length; i<len; i++){
                newArr.push(iterator.call(context, array[i], i, array));            
            }
        }else{
            newArr = {};
            for(var key in array){
                if(hasOwn.call(array, key)){
                    newArr[key] = iterator.call(context, array[key], key, array);
                }
            }
        }
        return newArr;
    }

    N.each = each;
    N.map = map;

    function loadScript(url, callback){
        
    }
        
})(window);