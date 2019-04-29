// 1、先要指定好谁充当发布者（比如售楼处）
// 2、然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
// 3、最后发布消息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数。另外，还可以往回调函数里填入一些参数，订阅者可以接收这些参数。

// 例子
var salesOffices = {}; // 定义售楼处
salesOffices.clientList = []; // 缓存列表，存放订阅者的回调函数

salesOffices.listen = function (key, fn) {
    if (!this.clientList[key]) { // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
        this.clientList[key] = [];
    }
    this.clientList[key].push(fn); // 订阅的消息添加进消息缓存列表
};

salesOffices.trigger = function () { // 发布消息
    var key = Array.prototype.shift.call(arguments), // 取出消息类型
        fns = this.clientList[key]; // 取出该消息对应的回调函数集合
    if (!fns || fns.length === 0) { // 如果没有订阅该消息，则返回
        return false;
    }
    for (var i = 0, fn; fn = fns[i++];) {
        fn.apply(this, arguments); // (2) // arguments 是发布消息时附送的参数
    }
};

salesOffices.listen('squareMeter88', function (price) { // 小明订阅88 平方米房子的消息
    console.log('价格= ' + price); // 输出： 2000000
});

salesOffices.listen('squareMeter110', function (price) { // 小红订阅110 平方米房子的消息
    console.log('价格= ' + price); // 输出： 3000000
});

salesOffices.trigger('squareMeter88', 2000000); // 发布88 平方米房子的价格
salesOffices.trigger('squareMeter110', 3000000); // 发布110 平方米房子的价格

// 通用
var event = {
    clientList: [], // 订阅者列表
    listen: function (key, fn) { //订阅函数
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
    },
    trigger: function () { // 发布函数
        var key = Array.prototype.shift.call(arguments), // (1);
            fns = this.clientList[key];
        if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments); // (2) // arguments 是trigger 时带上的参数
        }
    }
};

// 取消订阅
event.remove = function (key, fn) {
    var fns = this.clientList[key];
    if (!fns) { // 如果key 对应的消息没有被人订阅，则直接返回
        return false;
    }
    if (!fn) { // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
        fns && (fns.length = 0);
    } else {
        for (var l = fns.length - 1; l >= 0; l--) { // 反向遍历订阅的回调函数列表
            var _fn = fns[l];
            if (_fn === fn) {
                fns.splice(l, 1); // 删除订阅者的回调函数
            }
        }
    }
};

//给所有的对象都动态安装发布—订阅功能
var installEvent = function (obj) {
    for (var i in event) {
        obj[i] = event[i];
    }
};

// 发布—订阅模式可以用一个全局的Event对象来实现，订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，Event作为一个类似“中介者”的角色，把订阅者和发布者联系起来
// var Event = (function(){
//     var clientList = {},
//     listen,
//     trigger,
//     remove;
//     listen = function( key, fn ){
//         if ( !clientList[ key ] ){
//             clientList[ key ] = [];
//         }
//         clientList[ key ].push( fn );
//     };
//     trigger = function(){
//         var key = Array.prototype.shift.call( arguments ),
//         fns = clientList[ key ];
//         if ( !fns || fns.length === 0 ){
//             return false;
//         }
//         for( var i = 0, fn; fn = fns[ i++ ]; ){
//             fn.apply( this, arguments );
//         }
//     };
//     remove = function( key, fn ){
//         var fns = clientList[ key ];
//         if ( !fns ){
//             return false;
//         }
//         if ( !fn ){
//             fns && ( fns.length = 0 );
//         }else{
//             for ( var l = fns.length - 1; l >=0; l-- ){
//                 var _fn = fns[ l ];
//                 if ( _fn === fn ){
//                     fns.splice( l, 1 );
//                 }
//             }
//         }
//     };
//     return {
//         listen: listen,
//         trigger: trigger,
//         remove: remove
//     }
// })();

// 添加命名空间
var Event = (function () {
    var global = this,
        Event,
        _default = 'default';
    Event = function () {
        var _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            each = function (ary, fn) {
                var ret;
                for (var i = 0, l = ary.length; i < l; i++) {
                    var n = ary[i];
                    ret = fn.call(n, i, n);
                }
                return ret;
            };
        _listen = function (key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function (key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (var i = cache[key].length; i >= 0; i--) {
                        if (cache[key] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key] = [];
                }
            }
        };
        _trigger = function () {
            var cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                ret,
                stack = cache[key];
            if (!stack || !stack.length) {
                return;
            }
            return each(stack, function () {
                return this.apply(_self, args);
            });
        };
        _create = function (namespace) {
            var namespace = namespace || _default;
            var cache = {},
                offlineStack = [], // 离线事件
                ret = {
                    listen: function (key, fn, last) {
                        _listen(key, fn, cache);
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === 'last') {
                        } else {
                            each(offlineStack, function () {
                                this();
                            });
                        }
                        offlineStack = null;
                    },
                    one: function (key, fn, last) {
                        _remove(key, cache);
                        this.listen(key, fn, last);
                    },
                    remove: function (key, fn) {
                        _remove(key, cache, fn);
                    },
                    trigger: function () {
                        var fn,
                            args,
                            _self = this;
                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function () {
                            return _trigger.apply(_self, args);
                        };
                        if (offlineStack) {
                            return offlineStack.push(fn);
                        }
                        return fn();
                    }
                };
            return namespace ?
                (namespaceCache[namespace] ? namespaceCache[namespace] :
                    namespaceCache[namespace] = ret)
                : ret;
        };
        return {
            create: _create,
            one: function (key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function (key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            listen: function (key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function () {
                var event = this.create();
                event.trigger.apply(this, arguments);
            }
        };
    }();
    return Event;
})();

// 优点： 一为时间上的解耦，二为对象之间的解耦
// 缺点：1、创建订阅者需要消耗一定的时间和内存。2、虽然可以弱化对象之间的联系，如果过度使用的话，反而使代码不好理解及代码不好维护等等。

Event.create('NBA').listen('湖人',function(num){
    console.log('湖人获得了' + num + '场冠军!');
})

Event.create('NBA').trigger('湖人',5)