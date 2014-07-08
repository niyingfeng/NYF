// Ajax 模块

// var ajax = N.execute("ajax");
// ajax.ajax( method, url, {
//  data:{},
//  success:function(){},
//  faile:function(){}
// });

// ajax.get(), ajax.post(), ajax.put(), ajax.delete()


N.define( "ajax", function(){

    // 创建 XMLHttpRequest 兼容对象
    function xhr(){
        var http;

        if( window.XMLHttpRequest ){
            http = new XMLHttpRequest();
            xhr = function(){
                return new XMLHttpRequest();
            }
        }else if( window.ActiveXObject ){
            try{
                http = new ActiveXObject("Msxml2.XMLHTTP");
                xhr = function(){
                    return new ActiveXObject("Msxml2.XMLHTTP");
                }
            }catch(e){
                http = new ActiveXObject("Microsoft.XMLHTTP");
                xhr = function(){
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
        }

        return http;
    }

    // 将对象转化为URI方式的数据
    function encode( data ){
        
        var resultStr ="",
            encodeURI = encodeURIComponent,
            key;

        if( typeof data === "string" ){
            resultStr = encodeURI(data);
        }else{
            for ( key in data ) {
                if( data.hasOwnProperty( key ) ){
                    resultStr += "&" + encodeURI(key) + "=" +encodeURI(data[key]);
                } 
            }; 
        }

        return resultStr;
    }


    /** ajax主体方法 Ajax
    *   @method Ajax ajax的兼容方法
    *   @param {String} method 必选 请求方式
    *   @param {String} url 必选 请求地址
    *   @param {Object} options 可选 请求参数
    *       @param {Object | String} data 需要载入请求的数据
    *       @param {Function} success 请求成功的回调函数
    *       @param {Function} faile 请求失败的回调函数
    */
    function Ajax(method, url, options){
        var XHR, predata, success, faile;

        options = options || {},
        data = options.data || {}
        success = options.success,
        faile = options.faile,
        headers = headers ||{},
        XHR = xhr(),
        predata = encode(data);

        if( method === "GET" && predata){
            url += "?" + predata;
            predata = null;
        }

        XHR.open( method, url );

        XHR.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }

        XHR.onreadystatechange = function(){
            var err;

            if( XHR.readyState === 4 ){
                var ok = (( XHR.status >= 200 && XHR.status < 300) ||
                           XHR.status === 304);
                
                if( ok && success){
                    success( XHR.resposeText, XHR );
                }else if( !ok && faile ){
                    faile( XHR.resposeText, XHR );
                }
            }
        }

        XHR.send( predata );
    }

    function _Ajaxer( method ){
        return function( url, options ){
            return Ajax(method, url, options);
        }
    }

    var ajax = {
        ajax : Ajax,
        get : _Ajaxer("GET"),
        post : _Ajaxer("POST"),
        put : _Ajaxer("PUT")
    };

    return ajax;
});