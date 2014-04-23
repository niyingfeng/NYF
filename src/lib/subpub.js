// subpub 模块 实现 发布者 与 订阅者 双向记录绑定 
// 即：发布者中记录订阅该发布者的所有订阅者， 订阅者中记录该订阅者订阅的所有发布者

// 实现创建 publisher 发布者 和 subscriber 订阅者 

// publisher 实现 1. publish 发布信息  2. addSubscriber 添加订阅者 
// 3. deleteSubscriber 删除订阅者  4. clear 清空订阅者。

// subscriber 实现 1. subscribe 订阅发布者 2. unsubscribe 取消订阅发布者
// 3. triggle 触发订阅者执行函数
//
//  var sp = N.require('subpub');
//
//  var a1 = sp.creatPublisher(), a2 = sp.creatPublisher(), a3 = sp.creatPublisher();
//  var b1 = sp.creatSubscriber(function(a){ console.log('b1 '+a) }),
//      b2 = sp.creatSubscriber(function(a){ console.log('b2 '+a) }), 
//      b3 = sp.creatSubscriber(function(a){ console.log('b3 '+a) });
//
//  a1.addSubscriber(b1)
//  a1.addSubscriber(b3)
//  a2.addSubscriber(b2)
//  a3.addSubscriber(b1)
//  a3.addSubscriber(b2)
//  a3.addSubscriber(b3)
//
//
//  <   a1.publish("this is a1 publish")    
//  >   "b1 this is a1 publish"
//  >   "b3 this is a1 publish" 
//
//  <   a3.deleteSubscriber(b1)
//  <   a3.deleteSubscriber(b2)
//  <   a3.publish("this is a3 publish")
//  >   "b3this is a3 publish"
//
//  <   b3.unsubscribe(a3)
//  <   b2.subscribe(a3)
//  <   a3.publish("this is a3 publish")
//  >   "b2 this is a3 publish"
//


N.define( "subpub", function(){
    var has = N.has,
        each = N.each,

        // 由于发布者 订阅者是双向存储标记的 所以使用发布者ID和订阅者ID进行标记
        // 发布和订阅总对象来关联 ID 与 对象
        PUBID = 0,  
        pubObj = {}, 
        SUBID = 0,
        subObj = {};

    function publisher(){

        // 本来想将该属性私有封装，不过代码量会增加很多，并且也没有什么必要
        this.subIds = [];
        this.pubID = PUBID;
    }

    publisher.prototype = {

        // 发布 触发所有的 subIds id 列表成员的 trigger
        publish : function( info ){
            var subIds = this.subIds;

            each( subIds, function( subId ){
                subObj[subId].trigger( info );
            });

            return this;
        },

        // 发布者中添加 订阅者， 并在订阅者中记录发布者 单一订阅原则
        addSubscriber : function( subscriber ){
            var subIds = this.subIds,
                subId = subscriber.subID;

            // 单一订阅 也可以避免 订阅者 发布者中相互记录的无限循环
            if( has( subIds, subId ) ){
                return;
            }

            if(subscriber && subscriber.subscribe){
                subIds.push( subId );
                subscriber.subscribe( this );
            }else{
                throw new Error('subscriber is illegal');
            }
        },

        deleteSubscriber : function( subscriber ){
            var subIds = this.subIds,
                subId = subscriber.subID;

            if( !has( subIds, subId ) ){
                return;
            }

            for (var i = subIds.length - 1; i >= 0; i--) {
                if( subIds[i] === subId ){
                    subIds.splice(i, 1);
                }
            };

            subscriber.unsubscribe( this );

            return this;
        },

        clear : function(){
            var subIds = this.subIds;
            for (var i = subIds.length - 1; i >= 0; i--) {
                subObj[ subIds[i] ].unsubscribe( this );
            };

            this.subIds = [];
        }
    }


    function subscriber( func ){
        this.pubIds = [];
        this.subID = SUBID;
        this.callbck = func;
    }

    subscriber.prototype = {
        subscribe : function( publisher ){
            var pubIds = this.pubIds,
                pubId = publisher.pubID;

            if( has( pubIds, pubId ) ){
                return;
            }

            if( publisher && publisher.addSubscriber ){
                pubIds.push( pubId );
                publisher.addSubscriber(this);
            }else{
                throw new Error('publisher is illegal');
            }
        },

        unsubscribe : function( publisher ){
            var pubIds = this.pubIds,
                pubId = publisher.pubID;

            if( !has( pubIds, pubId ) ){
                return;
            }

            for (var i = pubIds.length - 1; i >= 0; i--) {
                if( pubIds[i] === pubId ){
                    pubIds.splice(i, 1);
                }
            };

            publisher.deleteSubscriber( this ); 

            return this;
        },

        clear : function(){
            var pubIds = this.pubIds;
            for (var i = pubIds.length - 1; i >= 0; i--) {
                pubObj[ pubIds[i] ].deleteSubscriber( this );
            };

            this.pubIds = [];
        },

        trigger : function( args ){
            this.callbck( args );
        }
    }

    return {
        creatPublisher : function(){
            var pub = new publisher();
            pubObj[ PUBID++ ] = pub;

            return pub;
        },
        creatSubscriber : function( func ){
            var sub =  new subscriber( func );
            subObj[ SUBID++ ] = sub;

            return sub;
        }
    }
    
});