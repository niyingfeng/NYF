// 扩展selector 类似于 简单的DOM选择器
// 返回为 DOM对象数组形式 目前只支持单层的查找
// $(".classname") & $("#id") & $("#id1,#id2")
// 并不是为了实现如JQ中的选择器，实现一些简单的选择器功能 相当简单
// 之后需要扩展实现 简单的层级查找 $("#id .classname")

N.define("$", ["arrayUtil"], function( arrayUtil ){

    'use strict';
    var objPro = Object.prototype,
        arrPro = Array.prototype,
        toString = objPro.toString,
        hasOwn = objPro.hasOwnProperty,
        slice = arrPro.slice,
        w = window,
        d = w.document,

        each = N.each,
        extend = N.extend,
        trim = N.trim,
        filter = N.filter,
        isArray = N.isArray;

    // 几个基本选择器方法
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

    // 转化类数组形似的 each
    function likeArrayEach( nObj, iterator, context){
        var arr = [], i, len = nObj.length;

        for (i=0; i<len; i++) {
            if( nObj[i] ){
                arr[i] = nObj[i]; 
            }
        };

        each( arr, iterator, context )
    }

    function dealClass( classStr ){
        var classesName = [],
            classStr = trim( classStr );

        return classStr.split(/\s+/g);
    }

    //为了可以继承DOM的一般方法，将DOM数组信息放入实例对象中
    function markNObject( array, obj ){
        for( var i=0,len=array.length; i<len; i++ ){
            obj[i] = array[i];
        }
        obj.length = len;
        return obj;
    }


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
        if(str.nodeType){ 
            this[0] = str;
            this.length = 1;
            return this; 
        }

        //不为string返回空数组
        if(typeof str !== "string"){ 
            this.length=0;
            return this; 
        } 

        // 单个情况
        if(str.indexOf(",") === -1){
            return markNObject( getDomObj(str,root), this);
        }  

        elements = str.split(reg_spl);
        ele_len = elements.length;

        for(i = 0; i<ele_len; i++){
            dom_obj = getDomObj(elements[i],root);
            ret = ret.concat(dom_obj);
        }
    
        return markNObject( ret, this);
    }

    $.prototype = {
        constructor : $,

        addClass : function( classes ){
            var self = this;
            if( !isArray(classes) ){
                classes = [classes];
            }

            likeArrayEach( self, function( dom ){
                var classStr = dom.className,
                    oldclasses = dealClass( classStr ),
                    newclasses;

                    newclasses = arrayUtil.mergeRepeatArray( classes, oldclasses );

                    dom.className = newclasses.join(" ");
            } );

            return this;
        },
        deleteClass : function( classes ){
            var self = this;
            if( !isArray(classes) ){
                classes = [classes];
            }

            likeArrayEach( self, function( dom ){
                var classStr = dom.className,
                    oldclasses = dealClass( classStr ),
                    newclasses;

                    newclasses = arrayUtil.deleteRepeat( oldclasses, classes );

                    dom.className = newclasses.join(" ");
            } );

            return this;
        },

        hide : function(){
            var self = this;
            markNObject( self, function( dom ){
                dom.style.display = "none";
            } );

            return this;
        },
        show : function(){
            var self = this;
            markNObject( self, function( dom ){
                dom.style.display = "block";
            } );

            return this;
        }
    }


    // 重点为这个方法，对于在候选集中进行过滤
    //function filter(target, factor, str){}

    // 在一个选择器表达式中 最优化的选出候选集

    return function(str, root){
        return new $(str,root);
    }

});