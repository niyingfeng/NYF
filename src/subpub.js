// subpub 模块

// 实现创建 publisher 发布者 和 subscriber 订阅者

// publisher 实现 1. publish 发布信息  2. addSubscriber 添加订阅者 
// 3. deleteSubscriber 删除订阅者  4. clear 清空订阅者
// 每一个 publisher 均将其自己的 subscribers 私有。

// subscriber 实现
//
//
//
//
//
//
//
//
//


N.define( "subpub", function(){
    var has = N.has,
        each = N.each;
    function publisher(){
        var subscribers = [];

        function _publisher(){
            each(  );
        }

        _publisher.prototype = {
            publish : function( info ){
                each( subscribers, function( subscriber ){
                    subscriber( info );
                });

                return this;
            },

            addSubscriber : function( subscriber ){
                if( has( subscribers, subscriber ) ){
                    return this;
                }else{
                    subscribers.push(subscriber);
                    return this;
                }
            },

            deleteSubscriber : function( subscriber ){
                for (var i = subscribers.length - 1; i >= 0; i--) {
                    if( subscribers[i] === subscriber ){
                        subscribers.splice(i, 1);
                    }
                };

                return this;
            },

            clear : function(){
                subscribers = [];
            }
        }

        return new _publisher();
    }
    
});