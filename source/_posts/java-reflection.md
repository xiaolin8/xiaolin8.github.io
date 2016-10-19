---
title: java基础拾遗——反射
date: 2016-05-29 13:05:39
categories: 技术
tags: java
---
#### 什么是反射？

**Java 反射机制主要提供了以下功能：**
- 在运行时判断任意一个对象所属的类。
- 在运行时构造任意一个类的对象。
- 在运行时判断任意一个类所具有的成员变量和方法。
- 在运行时调用任意一个对象的方法。

&emsp;&emsp;正如英文单词reflection的含义一样，使用反射API的时候就好像在看一个Java类在水中的倒影一样。通过反射API我们可以获取程序在运行时刻的内部结构。知道了Java类的内部结构之后，就可以与它进行交互，包括创建新的对象和调用对象中的方法等。这种交互方式与直接在源代码中使用的效果是相同的，但是又额外提供了运行时刻的灵活性。
&emsp;&emsp;“程序运行时，允许改变程序结构或变量类型，这种语言称为动态语言”。从这个观点看，Perl，Python，Ruby是动态语言，C++，Java，C#不是动态语言。尽管在这样的定义与分类下Java不是动态语言，它却有着一个非常突出的动态相关机制：Reflection。这个字的意思是“反射、映象、倒影”，用在Java身上指的是我们可以于运行时加载、探知、使用编译期间完全未知的classes。换句话说，Java程序可以加载一个运行时才得知名称的class，获悉其完整构造（但不包括methods定义），并生成其对象实体、或对其fields设值、或唤起其methods。这种“看透class”的能力（the ability of the program to examine itself）被称为introspection（内省、内观、反省）。
&emsp;&emsp;使用反射的一个最大的弊端是**性能比较差**。相同的操作，用反射API所需的时间大概比直接的使用要慢一两个数量级。不过现在的JVM实现中，反射操作的性能已经有了很大的提升。在灵活性与性能之间，总是需要进行权衡的。应用可以在适当的时机来使用反射API。

#### 基本用法
&emsp;&emsp;第一个主要作用是获取程序在运行时刻的内部结构。这对于程序的检查工具和调试器来说，是非常实用的功能。只需要短短的十几行代码，就可以遍历出来一个Java类的内部结构，包括其中的构造方法、声明的域和定义的方法等。只要有了java.lang.Class类 的对象，就可以通过其中的方法来获取到该类中的构造方法、域和方法。对应的方法分别是getConstructor、getField和getMethod。这三个方法还有相应的getDeclaredXXX版本，区别在于getDeclaredXXX版本的方法只会获取该类自身所声明的元素，而不会考虑继承下来的。
&emsp;&emsp;反射API的另外一个作用是在运行时刻对一个Java对象进行操作。 这些操作包括动态创建一个Java类的对象，获取某个域的值以及调用某个方法。在Java源代码中编写的对类和对象的操作，都可以在运行时刻通过反射API来实现。考虑下面一个简单的Java类。

```java
class MyClass {
    public int count;
    public MyClass(int start) {
        count = start;
    }
    public void increase(int step) {
        count = count + step;
    }
} 
```
&emsp;&emsp;使用一般做法和反射API都非常简单。

```java
MyClass myClass = new MyClass(0); //一般做法
myClass.increase(2);
System.out.println("Normal -> " + myClass.count);
try {
    Constructor constructor = MyClass.class.getConstructor(int.class); //获取构造方法
    MyClass myClassReflect = constructor.newInstance(10); //创建对象
    Method method = MyClass.class.getMethod("increase", int.class);  //获取方法
    method.invoke(myClassReflect, 5); //调用方法
    Field field = MyClass.class.getField("count"); //获取域
    System.out.println("Reflect -> " + field.getInt(myClassReflect)); //获取域的值
} catch (Exception e) { 
    e.printStackTrace();
} 
```
&emsp;&emsp;使用Java反射API的时候<font color="red">可以绕过Java默认的访问控制检查</font>，比如可以直接获取到对象的私有域的值或是调用私有方法。只需要在获取到Constructor、Field和Method类的对象之后，调用setAccessible方法并设为true即可。有了这种机制，就可以很方便的在运行时刻获取到程序的内部状态。

#### 使用场景
&emsp;&emsp;Java 反射API的存在，为Java语言添加了一定程度上的动态性，可以实现某些动态语言中的功能。比如在JavaScript的代码中，可以通过 obj\["set" + propName\]()来根据变量propName的值找到对应的方法进行调用。虽然在Java源代码中不能这么写，但是通过反射API同样可以实现类似 的功能。这对于处理某些遗留代码来说是有帮助的。比如所需要使用的类有多个版本，每个版本所提供的方法名称和参数不尽相同。而调用代码又必须与这些不同的版本都能协同工作，就可以通过反射API来依次检查实际的类中是否包含某个方法来选择性的调用。
&emsp;&emsp;Java 反射API实际上定义了一种相对于编译时刻而言更加松散的契约。如果被调用的Java对象中并不包含某个方法，而在调用者代码中进行引用的话，在编译时刻就会出现错误。而反射API则可以把这样的检查推迟到运行时刻来完成。通过把Java中的字节代码增强、类加载器和反射API结合起来，可以处理一些对灵活性要求很高的场景。
&emsp;&emsp;在有些情况下，可能会需要从远端加载一个Java类来执行。比如一个客户端Java程序可以通过网络从服务器端下载Java类来执行，从而可以实现自动更新 的机制。当代码逻辑需要更新的时候，只需要部署一个新的Java类到服务器端即可。一般的做法是通过自定义类加载器下载了类字节代码之后，定义出 Class类的对象，再通过newInstance方法就可以创建出实例了。不过这种做法要求客户端和服务器端都具有某个接口的定义，从服务器端下载的是 这个接口的实现。这样的话才能在客户端进行所需的类型转换，并通过接口来使用这个对象实例。如果希望客户端和服务器端采用更加松散的契约的话，使用反射API就可以了。两者之间的契约只需要在方法的名称和参数这个级别就足够了。服务器端Java类并不需要实现特定的接口，可以是一般的Java类。
&emsp;&emsp;动态代理的使用场景就更加广泛了。需要使用AOP中的方法拦截功能的地方都可以用到动态代理。Spring框架的AOP实现默认也使用动态代理。不过JDK中的动态代理只支持对接口的代理，不能对一个普通的Java类提供代理。不过这种实现在大部分的时候已经够用了。
&emsp;&emsp;另外，java的JDBC加载数据库连接驱动时的Class.forName(Driver)也是用的反射。还有工厂模式中Factory类中用反射的话，就不需要再修改工厂类Factory了，非常方便。

