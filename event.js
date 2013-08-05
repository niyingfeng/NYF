// N 框架的 事件 模块

N.define("event",["data"],function(data){

    var doc = document;

    var addEvent = (function( target, name, handler ){
        if( doc.addEventListener ){
            return function( target, name, handler ){
                return target.addEventListener(name, handler, false)
            } 
        }else if( doc.attachEvent ){
            return function( target, name, handler ){
                return target.attachEvent("on"+name, handler);
            }
        }else{
            return function( target, name, handler ){
                return target["on"+name] = handler;
            }
        }
    })();

    var removeEvent = function( target, name, handler ){}
   
    function on( target, name, callback ){
        data.data( obj, name, callback );
    }

    function off( target, name, callback ){
        data.removeData( target, name, callback );
    }

    function emit( target, name ){}


    return {
        on : on,
        off : off,
        emit : emit
    }
});