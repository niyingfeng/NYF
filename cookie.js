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

        document.cookie = encode(name) + "=" +encode(val) + expires + path + domain + secure;`
    }

    function getCookie( name ){}

    function encode(str){
        return (str+"").replace(/[,;"'\\=\s%]/g,function( v ){
            return encodeURIComponent(v);
        });
    }


    function cookie( name, val, options ){
        if( !name ) return;

        if( val === undefined ){
            return getCookie( name );
        }else{
            return setCookie( name, val, options );
        }
    }

    return cookie ;

});