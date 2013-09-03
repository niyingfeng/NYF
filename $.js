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

        if(str.nodeType){ return [str]; }
        if(typeof str !== "string"){ return []; } //不为string返回空数组

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