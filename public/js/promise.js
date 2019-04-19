// 构造函数接受一个executor立即执行函数
function Promise(executor) {
    var self = this;
    // 当前状态
    self.status = 'pending';
    // promise的值
    self.data = undefined;
    // promise状态变为resolve时的回调函数集，可能有多个
    self.onResolvedCallBack = [];
    // promise状态变为reject时的回调函数集，可能有多个
    self.onRejectedCallBack = [];

    function resolve(value) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'resolved';
                self.data = value;
                for (var i = 0; i < self.onResolvedCallBack.length; i++) {
                    self.onResolvedCallBack[i](value);
                }
            }
        });
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.data = reason;
                for (var i = 0; i < self.onRejectedCallBack.length; i++) {
                    self.onRejectedCallBack[i](reason);
                }
            }
        });
    }

    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

// promise对象的then方法绑定状态变为fulfilled时的回调
Promise.prototype.then = function(onResolved, onRejected) {
    // this.onResolvedCallBack.push(resolve);
	// this.onRejectedCallBack.push(reject);
    var self = this;
    var promise2;
    onResolved = typeof onResolved === 'function' ? onResolved : function(value) {
        return value;
    };
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {
        return reason;
    };
    if (self.status === 'resolved') {
        return promise2 = new Promise(function(resolve, reject) {
            try {
                // 调用onResolved毁掉函数
                var x = onResolved(self.data);
                //如果onResolved回调函数返回值为一个promise对象
                if (x instanceof Promise) {
                    // 将它的结果作为promise2的结果
                    x.then(resolve, reject);
                } else {
                    resolve(x);
                }
            } catch (e) {
                reject(e);
            }
        })
    }

    if (self.status === 'rejected') {
        return promise2 = new Promise(function(resolve, reject) {
            try {
                var x = onRejected(self.data);
                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    resolve(x)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    // promise对象当前状态为pending
    // 此时并不能确定调用onResolved还是pnRejected，需要等当前Promise状态确定
    // 所以需要将callBack放入promise1的回调数组中
    if (self.status === 'pending') {
        return promise2 = new Promise(function(resolve, reject) {
            self.onResolvedCallBack.push(function(value) {
                try {
                    var x = onResolved(self.data);
                    if (x instanceof Promise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(value);
                    }
                } catch (e) {
                    reject(e);
                }
            })
            self.onRejectedCallBack.push(function(reason) {
                try {
                    var x = onRejected(self.data);
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x);
                    }
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
}

const promise = new Promise((resolve) => {
    resolve(1);
})

promise.then((a) => alert(a)).then((b) => alert(b));