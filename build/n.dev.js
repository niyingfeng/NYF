/*! n 2013-11-22 by yingfeng */
// 简单的 N 框架
// nyf 2013.7.1

// 实现模块加载化

(function(global, undefined){
    'use strict';

    // 大对象
    var O_N = global.N, //原始的 N 对象or属性
        N = global.N = {},
        NID = N.NID = "N"+ (+new Date()),

        doc = global.document,
        userAgent = navigator.userAgent,
        host = location.protocol,
        absUrl = location.origin;

    // 原型方法引用
    var ArrayProto = Array.prototype,
        ObjectProto = Object.prototype,
        StringProto = String.prototype,
        toString = ObjectProto.toString,
        hasOwn = ObjectProto.hasOwnProperty,
        slice = ArrayProto.slice,
        trimFunc = StringProto.trim,
        ltrimFunc = StringProto.trimLeft,
        rtrimFunc = StringProto.trimRight;

    // 正则集中
    var typeReg = /\[object (\w+)\]/;
    
    // 一些常用的常量
    var arrayType = "[object Array]",
        functionType = "[object Function]",
        objectType = "[object Object]",

        // 简单的浏览器UA检测正则
        regmsie = /(MSIE) ([\w.]+)/,
        regwebkit = /(AppleWebKit)[ \/]([\w.]+)/,
        regmsie = /(Opera)([\w.]+)/,
        regmsie = /(Gecko\/)([\w.]+)/,

        // 处理模块id 进行规范化处理正则
        regrname = /(?:\.?\/)?([\w\W]*\/)?([\w\W]*)/;



    /*********************************扩展继承*************************************/
    /** 对象扩展 extend
    *  
    *   @method extend
    *   @param {String} receiver 可选 扩展的目标对象 如果无 则扩展到外围为对象（一般为 N）
    *   @param {obj} obj 必选 要扩展到目标对象的对象数据
    *   @param {boolean} 可选 主要是标识是否需要深度拷贝 默认为true
    *
    *   @return {Object} 返回目标对象
    *   
    */
    function extend(receiver, obj){
        var args = slice.call(arguments), key,
            deep = (type(args[args.length-1]) === "boolean")?args.pop():true;

        obj = args[args.length-1];

        if(args.length == 1){
            receiver = this;
        }
        for( key in obj ){
            if(hasOwn.call(obj, key)){
                if(!hasOwn.call(receiver,key)){
                    if( deep && (type(obj[key])==="object" || type(obj[key])==="array")){
                        receiver[key]={};
                        extend(receiver[key], obj[key]);
                    }else{
                        receiver[key] = obj[key];
                    }
                }else{                    
                    throw new Error("sorry "+key+" is already in the receiver object");
                }
            }
        }
        return receiver;
    }


    /** 对象扩展 mix
    *   简单来说是属于extend的简单形式，不进行深度拷贝 并且目标对象为必选
    *   @method mix
    *   @param {String} target 必选 扩展的目标对象
    *   @param {obj} obj 必选（可有多个） 要扩展到目标对象的对象数据
    *   
    *   @return {Object} 返回目标对象
    *   
    */
    function mix(target, obj){
        var args = slice.call(arguments), i=1, len=args.length, key;
        for(;i<len;i++){
            obj = args[i];
            for(key in obj){
                if(hasOwn.call(obj, key)){
                    if(!hasOwn.call(target, key)){
                        target[key] = obj[key];
                    }else{
                        throw new Error("sorry "+key+" is already in the receiver object");
                    }
                }
            }
        }
    }

    // 用于使用来继承扩展对象
    var createObject = (function(){
        function F(){};
        return function(obj){
            F.prototype = obj;
            F.prototype.constructor = obj;
            return new F();     
        }
    }());

    mix(N, {
        extend : extend,
        mix : mix,
        createObject : createObject
    });



    /**************************模块方面的***************************************/

    var Model, // 公共接口对象（公共接口集） 
        modelLoaded = {},     // 已经加载的模块（加载的未执行的模块信息集）
        modelMap = {};        // 已经执行的模块脚本返回的对象（模块结果集）    

    /** 模块定义 define
    *   处理一下 2 种情况 参数
    *  
    *   @method define
    *   @param {String} name 必选 模块名称
    *   @param {Array} deps 可选 依赖关系模块
    *   @param {Function} wrap 必选 模块函数实现
    *   @return {Object} 返回模块信息对象
    *   
    */
    function define(name, deps, wrap){
        var modelInfo = dealname(name),
            name = modelInfo["modelName"],
            model = modelLoaded[name];

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

    // 
    /** 模块预执行 execute
    *   对于已经加载的模块在依赖条件下将其执行，返回执行后的对象或者方法
    *  
    *   @method execute
    *   @param {String} name 必选 模块名称
    *   @return {Object} 返回模块执行完毕对象
    *   
    */
    function execute( name ){
        var mExports = [],

            modelInfo = dealname(name),
            name = modelInfo["modelName"],
            url = modelInfo["modelUrl"],

            modelload = modelLoaded[name],
            model = modelMap[name];

        if( modelload === undefined ){ // 当模块文件还未加载的时候
            // 需要加载模块文件 loadscript
            // 应使用回调 加载完毕后 继续execute方法
            // return loadscript( modelUrl(name), execute(name) );
            console.log(name+" 文件构建有误，重新加载文件！");
            loadScript(url, function(){ 
                execute( name ); 
                console.log(name+" 文件加载运行完成！"); 
            });

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

    function require( name ){
        return execute(name);
    }

    Model = {
        define : define,
        require : require,
        execute : execute
    }

    /** 规范化模块名 realname
    *   对于有地址信息的模块，提取出规范的模块名称
    *  
    *   @method realname
    *   @param {String} name 必选 模块名称id
    *   @return {Object} 返回规范的模块信息的对象
    *   
    */
    function dealname( name ){
        var infoArr = regrname.exec(name);
        return{
            modelName : infoArr[2],
            modelUrl : absUrl + (infoArr[1]===undefined ? "/" : "/"+infoArr[1]) + infoArr[2] + ".js",
        }
    }

    function setAbsUrl( url ){
        absUrl =/http|ftp|file/.test(url) ? url : host + "//" + url;
    }

    mix(N, {
        define : define,
        require : require,
        execute : execute,
        dealname : dealname,
        setAbsUrl : setAbsUrl
    });



    /************************** 底层基础工具函数 **************************************/
    /*   isArray  isFunction type  检测目标类型
    *   each map  迭代循环
    *   createNode 创建node对象
    *   loadScript 加载脚本文件
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

    mix(N, {
        isArray : isArray,
        isFunction : isFunction,
        type : type
    });



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

    function filter( array, iterator, context ){
        var value,i,len,newArr,
            filter = ArrayProto.filter;

        context = context||this;

        if(array == null) return;

        if(filter && array.filter === filter){
            return array.filter(iterator, context);
        }else if( isArray(array) ){
            newArr = [];
            for(i=0, len=array.length; i<len; i++){
                if( iterator.call(context, array[i], i, array) ){
                    newArr.push( array[i] );
                }          
            }
        }else{
            newArr = {};
            for(var key in array){
                if(hasOwn.call(array, key)){
                    if( iterator.call(context, array[key], key, array) ){
                        newArr[key] = array[key];
                    }
                }
            }
        }
        return newArr;
    }

    mix(N, {
        each : each,
        map : map,
        filter : filter
    });

    function createNode( tagName, attrs ){
        var node = doc.createElement(tagName);
        attrs = attrs || {};
        each(attrs, function(value, attr){
            node.setAttribute(attr, value);
        })
        return node;
    }

    function loadScript(url, callback){
        var node = createNode("script",{async:true,type:"text/javascript"}),
            head = loadScript.head = loadScript.head || doc.getElementsByTagName("head")[0];

        if( regmsie.test(userAgent) ){
            node.onreadystatechange = function(){
                if(/complete|loaded/.test(node.readyState)){
                    node.onreadystatechange = null;
                    callback();
                }
            }
        }else{
            node.onload = function(){
                callback();
            }
        }

        node.src = url;
        head.appendChild(node);
    }

    // 由于火狐浏览器不支持link的onload事件，所以做回调较为复杂，需要轮询检测（lazyload中学到）
    // 并且对于css的话 回调函数意义不大，只提供异步加载功能
    function loadCss(url){
        var node = createNode("link",{rel:"stylesheet",type:"text/css"}),
            head = loadCss.head = loadCss.head || doc.getElementsByTagName("head")[0];

        node.href = url;
        head.appendChild(node);
    }

    mix(N, {
        createNode : createNode,
        loadScript : loadScript,
        loadCss : loadCss
    });


    var trim, ltrim, rtrim;

    if( trimFunc ){
        trim = function( str ){ return str.trim(); };
        ltrim = function( str ){ return str.trimLeft(); }; 
        rtrim = function( str ){ return str.trimRight(); };
    }else{
        trim = function( str ){ return str.rplace(/^\s+|\s+$/g, '') };
        ltrim = function( str ){ return str.rplace(/^\s+/g, '') }; 
        rtrim = function( str ){ return str.rplace(/\s+$/g, '') };
    }

    mix(N, {
        trim : trim,
        ltrim : ltrim,
        rtrim : rtrim
    });


        
})(window);


/********************简单的使用文档************************
基础工具：
isArray, isFunction, type, each, map, creatNode, loadScript, loadCss


对象扩展对象方法
extend, mix, creatObject


模块化方法
define, require, execute, dealname, setAbsUrl 

************************************************************/
// 扩展selector 类似于 简单的DOM选择器
// 返回为 DOM对象数组形式 目前只支持单层的查找
// $(".classname") & $("#id") & $("#id1,#id2")
// 并不是为了实现如JQ中的选择器，实现一些简单的选择器功能 相当简单
// （ 摔 说穿了就是老子实现不了 TAT ）
// 之后需要扩展实现 简单的层级查找 $("#id .classname")

N.define("$",function(){

    'use strict';
    var objPro = Object.prototype,
        arrPro = Array.prototype,
        toString = objPro.toString,
        hasOwn = objPro.hasOwnProperty,
        slice = arrPro.slice,
        w = window,
        d = w.document,

        each = N.each;


    /** 微型选择器 $
    *  
    *   @method $ 目前只支持简单的复合选着 如$("#id, .classname") & $("#id") & $("#id1,#id2")
    *           暂不支持层级选着 如 $("#id tag")
    *   @param {String} str 必选，选择字符串
    *   @param {Object} obj 可选 选择节点的区域
    *   
    *   @return {Array} 返回目标DOM对象数组
    *   
    */
    function $(str,root){                   // $(".classname") & $("#id") & $("#id1,#id2")
        var elements = [],                  // 分割后的数组
            ele_len = 0,                    // 数组长度
            reg_spl = /\s*,\s*/,            // 截取 
            reg_white = /^\s+|\s+$/,
            dom_obj = {},                   // dom 对象
            ret = [],                       // 返回的dom对象
            root = root || d,
            element,i,name;    

        // 参数为DOM对象
        if(str.nodeType){ return [str]; }

        //不为string返回空数组
        if(typeof str !== "string"){ return []; } 

        // 单个情况
        if(str.indexOf(",") === -1){
            return getDomObj(str,root);
        }  

        elements = str.split(reg_spl);
        ele_len = elements.length;

        for(i = 0; i<ele_len; i++){
            dom_obj = getDomObj(elements[i],root);
            ret = ret.concat(dom_obj);
        }
    
        return ret;
    }

    function getDomObj(str, root){
        if(root.querySelectorAll){
                return slice.call(root.querySelectorAll(str));  //使用内置方法
        }else{
            if(str.indexOf("#")){
                str = str.slice(1);    
                return [d.getElementById(str)];
            }else if(str.indexOf(".")){
                str = str.slice(1);    
                return getByClass(str,root);
            }else{
                return slice.call(root.getElementsByTagName(str));
            }
        } 
    }

    function getByClass(classname, root){
        var elements, doms = [],  len;
        if(root.getElementsByClassName){
            return slice.call(root.getElementsByClassName(classname))
        }else{
            elements = root.getElementsByTagName("*");
            len = elements.length;

            each(elements, function(ele){
                if((" " + ele.classname + " ").indexof(" "+str+" ") !== -1){
                    doms.push(ele);
                }
            });
            return doms;
        }
    }

    // 重点为这个方法，对于在候选集中进行过滤
    //function filter(target, factor, str){}

    // 在一个选择器表达式中 最优化的选出候选集

    return function(str, root){
        return $(str,root);
    }

});
// 关于 cookie模块
// 返回包含 cookie 与 removeCookie 方法的对象

N.define( "cookie", function(){
    var doc = document
        dayMS = 60 * 60 * 24,
        defExpired = 7 * dayMS;

    function setCookie( name, val, options ){
        options = (typeof( options ) === "object") ? options : { expires : options } ;

        var expires = options.expires !== undefined ? options.expires * dayMS : defExpired;
        expires = ";expires="+(new Date( +new Date() + expires)).toGMTString();

        var path = options.path;
        path = path ? ";path="+path : "";

        var domain = options.domain;
        domain = domain ? ";domain="+domain : "";

        var secure = options.secure ? ";secure" : "";

        document.cookie = encode(name) + "=" +encode(val) + expires + path + domain + secure;

        return encode(name) + "=" +encode(val);
    }

    function getCookie( name ){
        var i, len, pair,
            cookieStr = doc.cookie,
            pairs = cookieStr.split(/;\s?/i);

        for(i=0, len=pairs.length; i<len; i++){
            pair = pairs[i].split("=");
            
            if( pair.length !== 2 ) continue;

            if( pair[0] === encode(name) ){

                return decodeURIComponent(pair[1]);  

            }
            return "";
        }

    }

    function encode(str){
        return (str+"").replace(/[,;"'\\=\s%]/g,function( v ){
            return encodeURIComponent(v);
        });
    }

    return function( name, val, options ){
        if( !name ) return;

        if( val === undefined ){
            return getCookie( name );
        }else{
            return setCookie( name, val, options );
        }
    };

});
// 对于样式进行处理'
// hide show
// addCss removeCss
// addClass removeClass

N.define( "css", function(){
    var trim = N.trim;

    function dealClass( classStr ){
        var classesName = [],
            classStr = trim( classStr );

        return classStr.split(/\s+/g);
    }
});
// 对于数据的处理，以闭包形式保存数据
// 借用 JQ 的模式，来处理普通对象和DOM对象的不同处理


N.define( "data", function(){
    var cache = [],
        uid = -1,
        NID = N.NID,
        type = N.type,
        extend = N.extend;

    /** 数据处理 data
    *   @method data 实现对于数据的集中存储，主要用来分离对DOM对象绑定数据的情况
    *                普通对象依旧不做处理
    */
    function data( obj, key, value ){
        var uNumber, dObject;
        if(obj.nodeType){
            uNumber = (obj[NID] !== undefined) ? obj[NID] : (obj[NID] = ++uid) ;
            dObject = cache[uNumber] || (cache[uNumber]={});
        }else{
            dObject = obj;
        }

            /*if(obj[NID]){
                uNumber = obj[NID];
            }else{
                uNumber = obj[NID] = ++uid;
                cache[uNumber]={}
            }*/

        if(type(value) === "undefined"){
            return dObject[key];
        }else if(type(value) === "object" || type(value) === "array") {  // 这边貌似还是不能放在一起
            dObject[key] = {};
            extend(dObject[key], value);
        }else{
            dObject[key] = value;
        }
       

    }

    function removeData( obj, key ){
        var uNumber = obj[NID];
        
        if(obj.nodeType){
            
            if(uNumber === undefined) return;

            if(key){
                delete cache[uNumber][key];
            }else{
                cache[uNumber] = undefined;
            }
        }else{
            delete obj[key];
        }
    }

    return {
        data : data,
        removeData : removeData
    }
});
// N 框架的 事件 模块
// bind unbind fire clean stop

N.define("event",["data"],function(data){
    "use strict"
    var doc = document,
        NID = N.NID,
        mouseEventRe = /^(?:mouse)|click/;


    // 事件绑定的兼容方法
    var addEvent = (function(){
        if( doc.addEventListener ){
            return function( target, name, handler, capture ){
                target.addEventListener(name, handler, capture || false)
            } 
        }else if( doc.attachEvent ){
            return function( target, name, handler ){
                target.attachEvent("on"+name, handler);
            }
        }else{
            return function( target, name, handler ){
                target["on"+name] = handler;
            }
        }
    })();

    var removeEvent = (function(){
        if( doc.removeEventListener ){
            return function( target, name, handler, capture ){
                target.removeEventListener(name, handler, capture || false)
            } 
        }else if( doc.detachEvent ){
            return function( target, name, handler ){
                target.detachEvent("on"+name, handler);
            }
        }else{
            return function( target, name ){
                target["on"+name] = null;
            }
        }
    })();

    // 简单的处理事件的属性值兼容
    function fixEvent(oEvent, data){
        var name, event = data || {}, undef;

        function returnFalse(){
            return false;
        }

        function returnTure(){
            return true;
        }

        for(name  in  oEvent){
            event[name] = oEvent[name];
        }

        if(!event.target){
            event.target = event.srcElement || doc;
        }

        if (originalEvent && mouseEventRe.test(oEvent.type) && oEvent.pageX === undef && oEvent.clientX !== undef) {
            var eventDoc = event.target.ownerDocument || document;
            var doc = eventDoc.documentElement;
            var body = eventDoc.body;

            event.pageX = oEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                ( doc && doc.clientLeft || body && body.clientLeft || 0);

            event.pageY = oEvent.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
                ( doc && doc.clientTop  || body && body.clientTop  || 0);
        }

        event.preventDefault = function(){
            event.isPreventedDefault = returnTure;

            // 主要 event 是完全拷贝了 oEvent，而不是引用 对于阻止默认事件还需要在oEvent上进行
            if(oEvent){
                if(oEvent.preventDefault){
                    oEvent.preventDefault();
                } else {
                    oEvent.returnValue = false;
                }
            }
        }

        event.stopPropagation = function(){
            event.isStopedPropagation = returnTure;

            if(oEvent){
                if(oEvent.stopPropagation){
                    oEvent.stopPropagation();
                } else {
                    oEvent.cancelBubble = true;
                }
            }
        }

        event.stop = function(){
            event.preventDefault();
            event.stopPropagation();
        }

        return event;
    }

    // 兼容处理 DomOnReady 事件
    function onReady(win, callback, eUtils){
        var doc = win.document, event = {type : 'ready'};

        if( eUtils.domLoaded ){
            callback(event);
            return;
        }

        // DOM ready 的事件句柄
        function readyHandler(){
            if( !eUtils.domLoaded ){
                eUtils.domLoaded = true;
                callback(event);
            }
        }

        function waitForDomLoaded(){
            if( doc.readyStatus === "complete" ){
                removeEvent( doc, "readystatechange", waitForDomLoaded );
                readyHandler();
            }
        }

        // IE 早期浏览器可以使用的判断DOMReady的替代方法
        function tryScroll(){
            try{
                doc.documentElement.doScroll("left");
            }catch(ex){
                setTimeout(tryScroll, 0);
                return;
            }

            readyHandler();
        }

        // W3C method
        if ( doc.addEventListener ){
            addEvent( win, 'DOMContentLoaded', readyHandler );
        } else {
            // IE method
            addEvent( doc, 'readystatechange', waitForDomLoaded );
            
            // 当IE下的另一种方式
            if( doc.documentElement.doScroll && win === win.top ){
                tryScroll();
            }
        }

        // 以上均失败的时候
        addEvent( win, 'load'. readyHandler );
    }
    
    // 事件 类
    function eUtils(){
        var self = this;

        self.domLoaded = false;

        function execHandlers(event, cache){
            var callbackList, i, l, callback;

            callbackList = cache[event.type];
            if( callbackList ){
                for( i=0, l=callbackList.length; i<l;i++ ){
                    callback = callbackList[i];

                    if( callback && callback.func.call( callback.scope, event ) === false ){
                        event.preventDefault();
                    }

                }
            }
        }

        /**
         * 对目标对象绑定 对于事件处理程序的事件句柄 被放在 data 数据 cache 中的 events 属性之中
         *
         * @method bind
         * @param {Object} target DOM节点或者其他对象
         * @param {String} names 事件名称,可以为数组形式
         * @param {function} callback 需要绑定的事件句柄
         * @param {Object} scope 回调函数所需要执行于。。。的作用域
         * @return 
         */
        self.bind = function( target, name, callback, scope ){
            var cacheID, cache, callbackList,
                callback = {
                    func : callback,
                    scope : scope || target
                };

            function nativeHandler( e ){
                e = fixEvent( e || window.event );
                e.type = e.type === 'focus' ? 'focusin' : 'focusout';
                execHandlers( e, cache );
            }

            target[NID] ? cacheID = target[NID] : data( target, 'event', {} ),
            cache = data.data(cacheID)['event'];
            callbackList = cache[name] || [];

            if( !callbackList ){
                addEvent( target, name, nativeHandler, false );
            }else{
                callbackList.push(callback);  
            }

            // 清理IE下内存问题
            target = callbackList = null;

            return callback;
        };


        /**
         * 对目标对象解除绑定
         *
         * @method bind
         * @param {Object} target DOM节点或者其他对象
         * @param {String} names 事件名称,可以为数组形式
         * @param {function} callback 需要解除绑定的事件句柄
         * @return 
         */
        self.unbind = function( target, name, callback ){
            var cacheID, cache, callbackList, i, len;

            cacheID = target[NID];

            if( !(cacheID = target[NID]) || !(cache = data.data(cacheID)['event']) || !(callbackList = cache[name]))
                 return ;

            for( i=0, len=callbackList.length; i<len; i++ ){
                if( callbackList[i]['func'] === callback ){
                    callbackList.splice(i, 1);
                    return;
                }
            }
        }


        /**
         * 对目标对象触发特定事件
         *
         * @method bind
         * @param {Object} target DOM节点或者其他对象
         * @param {String} name 事件名称
         * @return 
         */
        self.fire = function( target, name ){
            var cacheID, cache, callbackList, simulateE;

            cacheID = target[NID];

            if( !(cacheID = target[NID]) || !(cache = data.data(cacheID)['event']) || !(callbackList = cache[name]))
                 return ;

            simulateE = { type : name };

            execHandlers(simulateE, cache);

        }

        // 清空对象或者对象下某一事件的事件队列
        self.clean = function( target, name ){
            var cacheID, cache, callbackList, simulateE;

            cacheID = target[NID];

            if( !(cacheID = target[NID]) || !(cache = data.data(cacheID)['event']))
                return ;

            if( name ){
                // 清空name事件的事件队列
                cache[name] = name;
            }else{
                data.removeData(target, 'event');
            }

        }

        self.stop = function( e ){
            e = fixEvent( e || window.event );
            e.stop();
        }

    }

    var eutils = new eUtils();

    return eutils;

});