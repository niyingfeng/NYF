// 对于数据的处理，以闭包形式保存数据
// 借用 JQ 的模式，来处理普通对象和DOM对象的不同处理

N.define( "data", function(){
    var cache = [],
        uid = 0,
        NID = N.NID,
        type = N.type,
        extend = N.extend;

    /** 数据处理 data
    *   @method data 实现对于数据的集中存储，主要用来分离对DOM对象绑定数据的情况
    *                普通对象依旧不做处理
    */
    function data( obj, key, value ){
        var uNumber = obj[NID] || (obj[NID]=uid++),
            dObject = cache[uNumber] || (cache[uNumber]={});
        if(obj.nodeType){
            if(type(value) === "undefined"){
                return dObject[key];
            }else if(type(value) === "object" || type(value) === "array") {
                dObject[key] = {};
                extend(dObject[key], value)
            }else{
                dObject[key] = value;
            }
        }else{
            if(type(value) === "undefined"){
                return obj[key];
            }else if(type(value) === "object" || type(value) === "array") {
                obj[key] = {};
                extend(obj[key], value)
            }else{
                obj[key] = value;
            }
        }

    }

    function removeData( obj, key ){
        if(obj.nodeType){

        }else{
            
        }
    }

    return {
        data : data,
        removeData : removeData
    }
} );