# TypeScript 面试题

### void和undefined的区别?


1. void 0 比undefined占用的空间更小，运行更快 
2. undefined不是保留词，只是全局对象的一个属性，在低版本IE中可以被重写，另外，undefined 在 ES5 中已经是全局对象的一个只读（read-only）属性了，它不能被重写。但是在局部作用域中，还是可以被重写的。 
3. void 运算符能对给定的表达式进行求值，然后返回 undefined。也就是说，void 后面你随便跟上一个表达式，返回的都是 undefined，都能完美代替 undefined


### 什么是 never 类型？


* never类型表示的是那些永不存在的值的类型。
* never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。
* 参考链接 [TS系列之类型](https://segmentfault.com/a/1190000014120709)

### 下面代码会不会报错？怎么解决？

```
const obj = {
    a: 1,
    b: 'string',
};
obj.c = null;

报错，obj.c报错，不能给obj添加新的属性，需要给obj声明类型，可以声明接口
interface object{
  [any:string]:any;
}
然后const obj:object 就可以给obj添加新的属性了
```

### readonly 和 const 有什么区别？

* readonly只读属性，只能在对象刚刚创建的时候修改其值
* const 常量，在声明的时候确定其值，之后不可修改
* 区别：当设置属性值为不可改变时用 readonly，设置变量为不可改变时用 const。


### 下面代码中，foo 的类型应该如何声明

```
function foo (a: number) {
 
    return a + 1;
 
}
 
foo.bar = 123;

应声明如下

interface Foo{
    (a:number):number;
    [any:string]:any;
}

```

### 下面代码中，foo 的类型如何声明

```
let foo = {};
  
for (let i = 0; i< 100; i++) {
    foo[String(i)] = i;
}


应声明如下
interface Foo{
    [any:string]:any;
}

```

### 实现 MyConstructor

```
interface MyConstructor {
    new (hour: number, minute: number): MyInterface;
}
interface MyInterface {
    
}
class Bar implements MyInterface {
    constructor(public name: string) {}
}
class Foo implements MyInterface {
    constructor(public name: string) {}
}
  
function myfn(Klass: MyConstructor, name: string) {
    return new Klass(name);
}
  
myfn(Bar);
myfn(Foo);
```

### 什么是 Abstract Class？

* 抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法。
* 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 abstract关键字并且可以包含访问修饰符。

### 什么是 class mixin, 如何实现？

* mixin一般翻译为“混入”、“混合”，
早期一般解释为：把一个对象的方法和属性拷贝到另一个对象上；
也可以简单理解为能够被继承的类，
最终目的是实现代码的复用。

```
1. 首先定义了两个类，它们将做为mixins。 可以看到每个类都只定义了一个特定的行为或功能。
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

2. 创建一个类，结合了这两个mixins。
class SmartObject implements Disposable, Activatable {

  // Disposable
  isDisposed: boolean = false;
  dispose: () => void;
  // Activatable
  isActive: boolean = false;
  activate: () => void;
  deactivate: () => void;

}

3. 创建这个帮助函数，帮我们做混入操作。 它会遍历mixins上的所有属性，并复制到目标上去，把之前的占位属性替换成真正的实现代码。
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}

4. 最后，把mixins混入定义的类，完成全部实现部分。
applyMixins(SmartObject, [Disposable, Activatable]);
```

### typeof 关键词有什么用？

* 类型保护
* typeof类型保护*只有两种形式能被识别： typeof v === "typename"和 typeof v !== "typename"， "typename"必须是 "number"， "string"， "boolean"或 "symbol"。 但是TypeScript并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护(判断类型)。

### keyof 关键词有什么用？

* 索引类型
* keyof 与字符串索引签名进行交互， 如果有一个带有字符串索引签名的类型，那么 keyof T会是 string

### 下面代码中，foo 的类型如何声明？

```
function fn(value: number): string {
    return String(value);
}
const foo = fn;

应声明如下

interface Foo{
  (value:number):string;
}
```

### 下面代码会导致 TS 编译失败，如何修改 getValue 的类型声明。

```
function getValue() {
    return this.value;
}
  
getValue();

修改：
function getValue():any{
  return this.value;
}

```

### 类型声明里 「&」和「|」有什么作用？

* | 指联合类型，联合类型表示一个值可以是几种类型之一。 用竖线（ |）分隔每个类型，如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员
* & 指交叉类型，交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

### tsconfig.json 里 --strictNullChecks 参数的作用是什么？

* 当你声明一个变量时，它不会自动地包含 null或 undefined。但使用联合类型明确的包含它们。

### 下面代码里「date is Date」有什么作用？

```
function isDate(date: any): date is Date {
  if (!date) return false;
  return Object.prototype.toString.call(date) === '[object Date]';
}

date is Date这是一个类型谓词。作用是进行类型保护。（函数的返回值是一个类型谓词）
谓词为 parameterName is Type这种形式， parameterName必须是来自于当前函数签名里的一个参数名。
```

### interface 和 type 声明有什么区别？

* 类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。起别名不会新建一个类型 - 它创建了一个新 名字来引用那个类型。同接口一样，类型别名也可以是泛型 
* interface 用于定义接口，只声明成员方法，不做实现。

### 「import ... from」、「 import ... = require()」 和 「import ''」有什么区别？

```
import ... from
import {  } from "";导入一个模块中的某个导出内容
import * as name from "";将整个模块导入到一个变量，并通过它来访问模块的导出部分

import ... = require()
CommonJS和AMD的环境里都有一个exports变量，这个变量包含了一个模块的所有导出内容。
CommonJS和AMD的exports都可以被赋值为一个对象, 这种情况下其作用就类似于 es6 语法里的默认导出，即 export default语法了。虽然作用相似，但是 export default 语法并不能兼容CommonJS和AMD的exports。
为了支持CommonJS和AMD的exports, TypeScript提供了export =语法。
export =语法定义一个模块的导出对象。 这里的对象一词指的是类，接口，命名空间，函数或枚举。
若使用export =导出一个模块，则必须使用TypeScript的特定语法import module = require("module")来导入此模块。

import ""
一些模块会设置一些全局状态供其它模块使用。 这些模块可能没有任何的导出或用户根本就不关注它的导出。 使用该方法来导入这类模块

```

### 如何完善 Calculator 的声明。

```
interface Calculator {
    (num: number): Calculator;
    multiply(num: number): Calculator;
    add(num: number): Calculator;
}

let calcu: Calculator;
calcu(2).multiply(5).add(1)
```

### declare 关键字有什么用？

* 表示声明

