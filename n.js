// 简单的 N 框架
// nyf 2013.7.1

// 实现模块加载化

(function(global, undefined){
    'use strict';

    // 大对象
    var O_N = global.N, //原始的 N 对象or属性
        N = global.N = {},
        doc = global.document,

        userAgent = nagnavigator.userAgent;

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
        objectType = "[object Object]",

        regmsie = /(MSIE)([\w.]+)/,
        regwebkit = /(AppleWebKit)[ \/]([\w.]+)/,
        regmsie = /(Opera)([\w.]+)/,
        regmsie = /(Gecko\/)([\w.]+)/;



    var Model = N.model = {},
        modelLoaded = {},   // 已经加载的模块
        modelMap = {};      // 已经执行的模块脚本    

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
        var model = modelLoaded[name];

        if( model ){
            return model;
        }

        if( !wrap ){
            wrap = deps;
            deps = [];     
        }

        model = {
            name : name,
            deps : deps,
            wrap : wrap
        }

        modelLoaded[name] = model;
        return model;
    }

    function execute( name ){
        var mExports = [],
            modelload = modelLoaded[name],
            model = modelMap[name];

        if( modelload ){ // 当模块文件还未加载的时候
            // 需要加载模块文件 loadscript
            // 应使用回调 加载完毕后 继续execute方法
            // return loadscript( modelUrl(name), execute(name) );
            // return;
        }else if( model ){
            return model;
        }else{
            each( modelload.deps, function(dep){
                mExports.push( execute( dep ) );
            });
            model = modelload.wrap.apply( this, mExports );
        }

        modelMap[name] = model;
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
        return toString.call(arr) === arrayType;
    }

    function isFunction(func){
        return toString.call(func) === functionType;
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

    function createNode( tagName, attrs ){
        var node = doc.createElement(tagName);
        each(attrs, function(value, attr){
            node.setAttribute(attr, value);
        })
        return node;
    }

    function loadScript(url, callback){
        var node = createNode("js"),
            head = loadScript.head = loadScript.head || doc.getElementsByTagName("head")[0];

        if( regmsie.test(userAgent) ){
            node.onreadystatechange = function(){
                if(/complete|loaded/.test(node.readyState)){
                    node.onreadystatechange = null;
                    callback();
                }
            }
        }else{
            node.loaded = function(){
                callback();
            }
        }
        
        node.async = true;
        node.type = "text/javascript";
        node.src = url;

        head.inserBefore(node, head.firstChild);
    }
        
})(window);