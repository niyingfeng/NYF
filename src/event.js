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