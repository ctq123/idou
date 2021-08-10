
# 深入解析JSON.stringify和JSON.parse

![图片](https://cdn.poizon.com/node-common/74d377f9154b2973654039bbb10d2cf0.svg?x-oss-process=image/resize,w_400,h_400)

日常转化JSON的时候，我们都会用到JSON.stringify，但你真的了解JSON.stringify吗？

关于JSON.stringify，我们最多的应用场景无非就是将它转化为JSON字符串，但其实使用过程中也会碰到很多的问题和疑惑，比如：

1）转化JSON字符串的过程中，为什么有些字段莫名其妙地消失了？
2）经过序列化字符串的顺序为什么变化了？
3）JSON.stringify在什么场景下会抛出错误？
4）日期Date的值，枚举的值会如何处理？
5）想要使用JSON.stringify指定缩进空白，美化输出的时候，应该如何处理？
6）……

今天就跟大家聊一聊JSON.stringify的相关知识。

## JSON.stringify语法

```js
JSON.stringify(value[, replacer [, space]])
```
#### 参数
**value**
将要序列化成 一个 JSON 字符串的值

**replacer 可选** 
函数或数组

**space 可选** 
缩进空格数

### JSON.stringify的九大特性
#### 第一大特性
**标签：边界值** 
对于undefined，function，symbol值，在序列化过程中，不同的结构返回的结果不一样

```js
var obj = {
  x: undefined, 
  y: function() {}, 
  z: Symbol("")
}
JSON.stringify(obj);
// "{}"
```
* undefined、函数、 symbol 值，出现在对象中会被忽略

那么假设它们作为一个数组元素，序列化的结果又是怎样呢？

```js
var arr = [
  undefined, 
  function() {}, 
  Symbol("")
]
JSON.stringify(arr);
// "[null,null,null]"
```
* undefined、函数、 symbol 值，出现在数组中时被转换成 null

再问，三个元素单独转换时，序列化的结果是什么呢？
```js
JSON.stringify(undefined);
// undefined

JSON.stringify(function() {});
// undefined

JSON.stringify(Symbol("1"));
// undefined

```
* undefined、函数、 symbol 值，被单独转换时会返回 undefined

那么让我们来总结JSON.stringify的第一大也是最值得关注的特性：

* undefined、函数、 symbol 值，出现在对象中会被忽略
* undefined、函数、 symbol 值，出现在数组中时被转换成 null
* undefined、函数、 symbol 值，被单独转换时会返回 undefined

#### 第二大特性
**标签：toJSON** 
转换值如果有 toJSON() 方法，该方法定义什么值将被序列化
```js
var obj = {
  id: 1,
  name: 'Alan',
  toJSON: function() {
    return "hello"
  }
}
JSON.stringify(obj);
// "\"hello\""

var obj = {
  id: 1,
  name: 'Alan',
  address: {
    detail: 'xx',
    country: 'xx',
    toJSON: function() {
      return "hello"
    }
  }
}
JSON.stringify(obj);
// "{\"id\":1,\"name\":\"Alan\",\"address\":\"hello\"}"
```
因此，要转换的对象中不要包含toJSON函数，除非你真的在某种场景下特性要转换。

**思考** 
* 假设toJSON返回的是一个函数，结果输出的应该是什么？
```js
var obj = {
  id: 1,
  name: 'Alan',
  toJSON: function() {
    return function() { return 'test' }
  }
}
JSON.stringify(obj);
```
结合第一大特性，有兴趣的同学可以手动试一下

JSON.stringify的第二大特性：

* 对象的属性中，如果有 toJSON() 方法，JSON.stringify会直接使用toJSON()方法进行序列化


#### 第三大特性
**标签：顺序** 
由于受第一大特性的影响，健值对中某些值会被忽略，因此，非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中

```js
var obj = {
  b: undefined,
  c: 'c',
  d: function() {},
  e: 0,
  f: false,
  a: 1,
}
JSON.stringify(obj);
// "{\"c\":\"c\",\"e\":0,\"f\":false,\"a\":1}"
```
数组中的元素顺序不会受影响，因为默认会返回null

#### 第四大特性
**标签：对象**
* 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
```js
var arr = [
  new Number(1), new String("false"), new Boolean(false)
]
JSON.stringify(arr);
// "[1,\"false\",false]"
```

#### 第五大特性
**标签：相互引用，异常**
* 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误
```js
var obj1 = {
  a: ''
}
var obj2 = {
  b: obj1
}
obj1.a = obj2
JSON.stringify(obj1);
/**
 * Uncaught TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'a' -> object with constructor 'Object'
    --- property 'b' closes the circle
*/
```
因此，稳健的代码一般会加上try……catch防止程序崩溃，这种场景通常会出现在使用JSON.parse(JSON.stringify)实现深拷贝的场景中，因为只有层级较深的场景中才会出现这种循环引用

#### 第六大特性
**标签：symbol忽略**
* 所有以 symbol 为key属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们
```js
var obj = {
  a: '1',
  [Symbol.for("foo")]: "foo",
}
JSON.stringify(obj, function(k, v) { 
  if (typeof k === "symbol"){
    return 'foo'
  }
  return v
});
// "{\"a\":\"1\"}"
```

#### 第七大特性
**标签：Date**
* Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理
```js
var obj = {
  time: new Date('2021-08-10'),
}
JSON.stringify(obj);
// "{\"time\":\"2021-08-10T00:00:00.000Z\"}"
```
这个跟第四大特性是相似的

#### 第八大特性
**标签：NaN，Infinity**
* NaN 和 Infinity 格式的数值及 null 都会被当做 null
```js
var obj = {
  nan: NaN,
  ini: Infinity,
  n: null
}
JSON.stringify(obj);
// "{\"nan\":null,\"ini\":null,\"n\":null}"
```

#### 第九大特性
**标签：NaN，Infinity**
* 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性，不可枚举的值会被忽略
```js
var obj = {
  x: { value: 'x', enumerable: false },
  y: { value: 'y', enumerable: true }
}
var kk = Object.create(null, obj)
// kk = {y: "y", x: "x"}
JSON.stringify(kk);
// "{\"y\":\"y\"}"
```

### replacer参数
replacer可以是一个数组，也可以是一个函数

#### 作为数组时，数组的值代表将被序列化的属性，即要保留的值，其他的会被忽略
```js
var obj = {
  x: 'x',
  y: 'y',
  z: 'z'
}
JSON.stringify(obj, ['x', 'y']);
// "{\"x\":\"x\",\"y\":\"y\"}"
```
那假设为指定一个会默认被忽略的属性会怎样呢？如undefined

```js
var obj = {
  x: 'x',
  y: 'y',
  z: 'z',
  w: undefined
}
JSON.stringify(obj, ['x', 'y', 'w']);
// "{\"x\":\"x\",\"y\":\"y\"}"
```
由此可见，undefined还是会被忽略掉的，因此我们需要使用function进行改造

#### 作为函数时，它有两个参数key和value，它们都会被序列化
通俗点讲，就是让我们自定义JSON.stringify序列化函数
```js
var obj = {
  x: 'x',
  y: 'y',
  z: 'z',
  w: undefined,
  a: 1,
  b: false
}
JSON.stringify(obj, function(k, v) {
  if (v === undefined) {
    return 'undefined'
  }
  return v
});
// "{\"x\":\"x\",\"y\":\"y\",\"z\":\"z\",\"w\":\"undefined\"}"
```

### space参数
space用于控制字符串的缩进函数，用于美化JSON格式。如果是一个数字, 则在字符串化时每一级别会比上一级别缩进多这个数字值的空格（最多10个空格）；如果是一个字符串，则每一级别会比上一级别多缩进该字符串（或该字符串的前10个字符）

曾经有遇到过这样一种场景，后端返回一个请求数据，要求将请求数据显示在文本输入框中。要求美化它的格式。
```js
var respJSON = {"code":200,"msg":"success","data":{ "total": 10, "rows": [] },"errors":null,"status":200}
// 直接显示将会出现很乱的情况，如下：
```
![图片](https://cdn.poizon.com/node-common/dcbc997f3b8d97640c327ccfdaf9be3b.png)

```js
// 可以利用第三个参数进行美化
JSON.stringify(respJSON, null, '\t')
// 或者
JSON.stringify(respJSON, null, 4)
```
![图片](https://cdn.poizon.com/node-common/900d74f8bffd79da2f9ece2ecf762105.png)

---

## JSON.parse语法

```js
JSON.parse(text[, reviver])
```

#### 参数
**text**
将要反序列化的字符串

**reviver 可选** 
函数转换器，用于修改解析生成的原始值，调用时机在parse函数返回之前

### JSON.parse特性
**标签：json规范**
* JSON.parse() json需符合规范，不允许用逗号作为结尾
```js
JSON.parse("[1, 2, ]");
// 异常，逗号结尾

JSON.parse('{"a" : 1, }');
// 异常，逗号结尾

JSON.parse('{a: 1}');
// 异常，不符合json规范
```

由于JSON.parse是用于反序列化字符串，它本身并没有什么特殊的特性，反而是它的第二个参数有一些特性，下面我们着重说一下reviver函数转换器

### reviver特性
#### 第一大特性
**标签：顺序**
指定了reviver函数之后，会逐层地去解析返回的值，它会从最最里层的属性开始，一级一级地往外去解析，最终达到顶层。有点类似于koa中洋葱模型的后半段，从里往外去解析。
```js
var objStr = "{\"b\":{\"c\":\"2\"}}"
JSON.parse(objStr, function(k, v) { 
  console.log(k); 
});
// c b ""
```
* 从最内层开始，按照层级顺序，依次向外遍历

#### 第二大特性
**标签：undefined**
* 指定了reviver函数之后，如果返回的是undefined，当前属性会从所属对象中删除
```js
var objStr = "{\"a\":{\"aa\":1},\"b\":[null, null]}"
JSON.parse(objStr)
// { a: {aa: 1}, b: [null, null] }
JSON.parse(objStr, function(k, v) { 
  if (k === 'aa') {
    return undefined
  }
  if (v === null) {
    return undefined
  }
  return v
});
// { a: {}, b: [] } 注意此处的b数组长度依然是2
```
虽然上述的输出的数组是空(empty)，但长度依然是2。b中的元素是空，不是null，也不是undefined，而是empty，但长度依然是占着的。

#### 第三大特性
**标签：顶层**
* 当遍历到顶层的值时，传入 reviver 函数的参数key值是一个空字符串""，value值是解析完成的值
```js
var objStr = "{\"b\": 1}"
JSON.parse(objStr, function(k, v) { 
  console.log(k); 
});
// b ""
// 这里没有指定返回值，因此输出为undefined
```

## 总结
今天主要介绍了我们日常使用比较多JSON格式，但JSON其实并不属于javascript严格意义上的子集。而我们日常又常用，因此我们了解了一波JSON.stringify和JSON.parse两大函数，以及它们各自的特性，让我们回顾一下相关的知识点。

* JSON.stringify的九大特性
  + undefined、函数、 symbol 值，出现在对象中会被忽略；undefined、函数、 symbol 值，出现在数组中时被转换成 null；undefined、函数、 symbol 值，被单独转换时会返回 undefined

  + 对象的属性中，如果有 toJSON() 方法，JSON.stringify会直接使用toJSON()方法进行序列化

  + 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中
  
  + 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值

  + 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误

  + 所有以 symbol 为key属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们

  + Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理

  + NaN 和 Infinity 格式的数值及 null 都会被当做 null

  + 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性，不可枚举的值会被忽略

* JSON.parse特性
  + JSON.parse() json需符合规范，不允许用逗号作为结尾

  + reviver特性
    + 从最内层开始，按照层级顺序，依次向外遍历
    + 指定了reviver函数之后，如果返回的是undefined（或不指定返回），当前属性会从所属对象中删除
    + 当遍历到顶层的值时，传入 reviver 函数的参数key值是一个空字符串""，value值是解析完成的值

由于JSON.stringify本身存在着诸多缺陷，这里给大家安利一个工具json转换工具[serialize-javascript](https://www.npmjs.com/package/serialize-javascript)
