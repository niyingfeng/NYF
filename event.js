// N 框架的 事件 模块

N.define("event",["data"],function(data){

    var doc = document;

    var addEvent = (function(){
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

    var removeEvent = (function(){
        if( doc.removeEventListener ){
            return function( target, name, handler ){
                return target.removeEventListener(name, handler, false)
            } 
        }else if( doc.detachEvent ){
            return function( target, name, handler ){
                return target.detachEvent("on"+name, handler);
            }
        }else{
            return function( target, name ){
                return target["on"+name] = null;
            }
        }
    })();
   
    function on( target, name, callback ){
        var events = data.data( target, name) || [];

        events.push( callback );
        data.data( target, name, events);

        addEvent( target, name, function(){
            emit(target, name);
        });
    }

    function off( target, name, callback ){
        var events = data.data( target, name) || [];

        if( typeof callback === "function" && events.length !== 0){
            each( events, function( event , i , events){
                if( callback === event ){
                    events.splice(i , 1); 
                    data.data( target, name, events);
                }
            });
        }else{
            data.removeData( target, name, callback );
        }

        
    }

    function emit( target, name ){
        var events = data.data( target, name);

        each( events, function(event){
            event.call( target );
        });

    }


    return {
        on : on,
        off : off,
        emit : emit
    }
});