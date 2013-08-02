// N 框架的 事件 模块

N.define("event",["data"],function(data){

    function addEvent(){}
   
    function on( obj, name, callback ){
        data.data( obj, name, callback );
    }

    function off( obj, name, callback ){
        data.removeData( obj, name, callback );
    }

    function emit( obj, name ){}


    return {
        on : on,
        off : off,
        emit : emit
    }
});