---
title: 使用AngularJS
date: 2016-07-19 10:43:24
categories: 前端
tags: AngularJS
---
#### AngularJS是什么？
AngularJS 通过新的属性和表达式扩展了 HTML，是一种构建动态Web应用的结构化框架。
它提供了现代Web应用中要用到的一系列高级功能，例如：
- 解耦应用逻辑、数据模型和视图；
- Ajax服务；
- 依赖注入；
- 浏览历史（使书签和前进、后退按钮能够像在普通Web应用中一样工作）；
- 便于测试；

#### 为什么使用AngularJS？
AngularJS比Jquery等类库的抽象层级更高，通过将逻辑代码直接关联到相关的DOM元素上，使得开发者可以站在更高的一个层次上来简化应用的开发。如同其他的抽象技术一样，这会损失一部分的灵活性。换句话说，并不是所有的应用都适合用AngularJS来做。AngularJS主要考虑的是构建CRUD的单页面应用，而DOM操作很频繁的一些应用则不适用。

#### 使用AngularJS
AngularJS 模块（Module） 定义了 AngularJS 应用。
AngularJS 控制器（Controller） 用于控制 AngularJS 应用。
ng-app指令定义了应用, ng-controller 定义了控制器。

```html
<div ng-app="myApp" ng-controller="myCtrl">

名: <input type="text" ng-model="firstName"><br>
姓: <input type="text" ng-model="lastName"><br>
<br>
姓名: {{firstName + " " + lastName}}

</div>

<script>
//angular.module 模块定义应用myApp，这个方法能够接受两个参数，第一个是模块的名称，第二个是依赖列表，也就是可以被注入到模块中的对象列表。
var app = angular.module('myApp', []);
//调用这个方法时如果只传递一个参数，就可以用它来引用模块。例如，可以通过以下代码来引用myApp模块：
//这个方法用于获取应用
angular.module('myApp');

//ng-controller 定义了控制器
app.controller('myCtrl', function($scope) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
});
</script>
```
我们使用ng-model指令将内部数据模型对象（$scope）中的name属性绑定到了文本输入字段上。
数据模型对象（model object）是指$scope对象。 $scope对象是一个简单的JavaScript对象，其中的属性可以被视图访问，也可以同控制器进行交互。

只有被具有ng-app属性的DOM元素包含的元素才会受AngularJS影响。
视图不需要知道如何保存对象，只要知道如何显示它即可

##### 作用域scope
$scope的所有属性，都可以自动被视图访问到。
$scope对象是定义应用业务逻辑、控制器方法和视图属性的地方。
作用域是应用状态的基础。基于动态绑定，我们可以依赖视图在修改数据时立刻更新$scope，也可以依赖$scope在其发生变化时立刻重新渲染视图。
AngularJS将$scope设计成和DOM类似的结构，因此$scope可以进行嵌套，也就是说我们可以引用父级$scope中的属性。

$rootScope是所有$scope对象的最上层。

**$scope 的生命周期**
每当事件被处理时， $scope就会对定义的表达式求值。此时事件循环会启动，并且Angular应用会监控应用程序内的所有对象，脏值检测循环也会运行。

$scope对象的生命周期处理有四个不同阶段。

创建：在创建控制器或指令时， AngularJS会用$injector创建一个新的作用域，并在这个新建的控
制器或指令运行时将作用域传递进去。
链接：当Angular开始运行时，所有的$scope对象都会附加或者链接到视图中。所有创建$scope对象的函数也会将自身附加到视图中。这些作用域将会注册当Angular应用上下文中发生变化时需要运行的$watch函数，Angular通过这些函数获知何时启动事件循环。
更新:当事件循环运行时，它通常执行在顶层$scope对象上（被称作$rootScope），每个子作用域都执行自己的脏值检测。每个监控函数都会检查变化。如果检测到任意变化， $scope对象就会触发指定的回调函数。
销毁:当一个$scope在视图中不再需要时，这个作用域将会清理和销毁自己。

##### 控制器
AngularJS中的控制器是一个函数。我们用它来给作用域对象设置初始状态，并添加自定义行为。

AngularJS同其他JavaScript框架最主要的一个区别就是，控制器并不适合用来执行DOM操作、格式化或数据操作，以及除存储数据模型之外的状态维护操作。它只是视图和$scope之间的桥梁。
**控制器嵌套（作用域包含作用域）**
