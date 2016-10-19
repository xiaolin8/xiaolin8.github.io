---
title: Java基础拾遗——注解
date: 2016-05-19 17:51:25
categories: 技术
tags: java
---

#### 注解的作用
&emsp;&emsp;在开发Java程序，尤其是Java EE应用的时候，总是免不了与各种配置文件打交道。以Java EE中典型的S(pring)S(truts)H(ibernate)架构来说，Spring、Struts和Hibernate这三个框架都有自己的XML格式的配置文件。这些配置文件需要与Java源代码保存同步，否则的话就可能出现错误。而且这些错误有可能到了运行时刻才被发现。把同一份信息保存在两个地方，总是个坏的主意。理想的情况是在一个地方维护这些信息就好了。其它部分所需的信息则通过自动的方式来生成。JDK 5中引入了源代码中的注解（annotation）这一机制。注解使得Java源代码中不但可以包含功能性的实现代码，还可以添加元数据。

#### 使用注解
&emsp;&emsp;在一般的Java开发中，最常接触到的可能就是@Override和@SupressWarnings这两个注解了。使用@Override的时候只需要一个简单的声明即可。这种称为标记注解（marker annotation ），它的出现就代表了某种配置语义。而其它的注解是可以有自己的配置参数的。配置参数以名值对的方式出现。使用 @SupressWarnings的时候需要类似@SupressWarnings({"uncheck", "unused"})这样的语法。在括号里面的是该注解可供配置的值。由于这个注解只有一个配置参数，该参数的名称默认为value，并且可以省略。而花括号则表示是数组类型。在JPA中的@Table注解使用类似@Table(name = "Customer", schema = "APP")这样的语法。从这里可以看到名值对的用法。在使用注解时候的配置参数的值必须是编译时刻的常量。
&emsp;&emsp;从某种角度来说，可以把注解看成是一个XML元素，该元素可以有不同的预定义的属性。而属性的值是可以在声明该元素的时候自行指定的。在代码中使用注解，就相当于把一部分元数据从XML文件移到了代码本身之中，在一个地方管理和维护。
#### 开发注解
&emsp;&emsp;在一般的开发中，只需要通过阅读相关的API文档来了解每个注解的配置参数的含义，并在代码中正确使用即可。在有些情况下，可能会需要开发自己的注解。这在库的开发中比较常见。注解的定义有点类似接口。下面的代码给出了一个简单的描述代码分工安排的注解。通过该注解可以在源代码中记录每个类或接口的分工和进度情况。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Assignment {
    String assignee();
    int effort();
    double finished() default 0;
} 
```
&emsp;&emsp;@interface用来声明一个注解，其中的每一个方法实际上是声明了一个配置参数。方法的名称就是参数的名称，返回值类型就是参数的类型。可以通过default来声明参数的默认值。在这里可以看到@Retention和@Target这样的元注解，用来声明注解本身的行为。@Retention用来声明注解的保留策略，有CLASS、RUNTIME和SOURCE这三种，分别表示注解保存在类文件、JVM运行时刻和源代码中。只有当声明为RUNTIME的时候，才能够在运行时刻通过反射API来获取到注解的信息。@Target用来声明注解可以被添加在哪些类型的元素上，如类型、方法和域等。

#### 处理注解

&emsp;&emsp;在程序中添加的注解，可以在编译时刻或是运行时刻来进行处理。在编译时刻处理的时候，是分成多趟来进行的。如果在某趟处理中产生了新的Java源文件，那么就需要另外一趟处理来处理新生成的源文件。如此往复，直到没有新文件被生成为止。在完成处理之后，再对Java代码进行编译。JDK 5中提供了apt工具用来对注解进行处理。apt是一个命令行工具，与之配套的还有一套用来描述程序语义结构的Mirror API。Mirror API（com.sun.mirror.*）描述的是程序在编译时刻的静态结构。通过Mirror API可以获取到被注解的Java类型元素的信息，从而提供相应的处理逻辑。具体的处理工作交给apt工具来完成。编写注解处理器的核心是AnnotationProcessorFactory和AnnotationProcessor两个接口。后者表示的是注解处理器，而前者则是为某些注解类型创建注解处理器的工厂。
&emsp;&emsp;以上面的注解Assignment为例，当每个开发人员都在源代码中更新进度的话，就可以通过一个注解处理器来生成一个项目整体进度的报告。 首先是注解处理器工厂的实现。

```java
public class AssignmentApf implements AnnotationProcessorFactory {  
    public AnnotationProcessor getProcessorFor(Set<AnnotationTypeDeclaration> atds,? AnnotationProcessorEnvironment env) {
        if (atds.isEmpty()) {
           return AnnotationProcessors.NO_OP;
        }
        return new AssignmentAp(env); //返回注解处理器
    } 
    public Collection<String> supportedAnnotationTypes() {
        return Collections.unmodifiableList(Arrays.asList("annotation.Assignment"));
    }
    public Collection<String> supportedOptions() {
        return Collections.emptySet();
    }
}
```
&emsp;&emsp;AnnotationProcessorFactory接口有三个方法：getProcessorFor是根据注解的类型来返回特定的注解处理器；supportedAnnotationTypes是返回该工厂生成的注解处理器所能支持的注解类型；supportedOptions用来表示所支持的附加选项。在运行apt命令行工具的时候，可以通过-A来传递额外的参数给注解处理器，如-Averbose=true。当工厂通过 supportedOptions方法声明了所能识别的附加选项之后，注解处理器就可以在运行时刻通过AnnotationProcessorEnvironment的getOptions方法获取到选项的实际值。注解处理器本身的基本实现如下所示。

```java
public class AssignmentAp implements AnnotationProcessor { 
    private AnnotationProcessorEnvironment env;
    private AnnotationTypeDeclaration assignmentDeclaration;
    public AssignmentAp(AnnotationProcessorEnvironment env) {
        this.env = env;
        assignmentDeclaration = (AnnotationTypeDeclaration) env.getTypeDeclaration("annotation.Assignment");
    }
    public void process() {
        Collection<Declaration> declarations = env.getDeclarationsAnnotatedWith(assignmentDeclaration);
        for (Declaration declaration : declarations) {
           processAssignmentAnnotations(declaration);
        }
    }
    private void processAssignmentAnnotations(Declaration declaration) {
        Collection<AnnotationMirror> annotations = declaration.getAnnotationMirrors();
        for (AnnotationMirror mirror : annotations) {
            if (mirror.getAnnotationType().getDeclaration().equals(assignmentDeclaration)) {
                Map<AnnotationTypeElementDeclaration, AnnotationValue> values = mirror.getElementValues();
                String assignee = (String) getAnnotationValue(values, "assignee"); //获取注解的值
            }
        }
    }   
} 
```
&emsp;&emsp;注解处理器的处理逻辑都在process方法中完成。通过一个声明（Declaration）的getAnnotationMirrors方法就可以获取到该声明上所添加的注解的实际值。得到这些值之后，处理起来就不难了。
&emsp;&emsp;在创建好注解处理器之后，就可以通过apt命令行工具来对源代码中的注解进行处理。 命令的运行格式是apt -classpath bin -factory annotation.apt.AssignmentApf src/annotation/work/*.java，即通过-factory来指定注解处理器工厂类的名称。实际上，apt工具在完成处理之后，会自动调用javac来编译处理完成后的源代码。
&emsp;&emsp;JDK 5中的apt工具的不足之处在于它是Oracle提供的私有实现。在JDK 6中，通过JSR 269把自定义注解处理器这一功能进行了规范化，有了新的javax.annotation.processing这个新的API。对Mirror API也进行了更新，形成了新的javax.lang.model包。注解处理器的使用也进行了简化，不需要再单独运行apt这样的命令行工具，Java编译器本身就可以完成对注解的处理。对于同样的功能，如果用JSR 269的做法，只需要一个类就可以了。

```java
@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedAnnotationTypes("annotation.Assignment")
public class AssignmentProcess extends AbstractProcessor {
    private TypeElement assignmentElement; 
    public synchronized void init(ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        Elements elementUtils = processingEnv.getElementUtils();
        assignmentElement = elementUtils.getTypeElement("annotation.Assignment");
    } 
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(assignmentElement);
        for (Element element : elements) {
            processAssignment(element);
        }
    }
    private void processAssignment(Element element) {
        List<? extends AnnotationMirror> annotations = element.getAnnotationMirrors();
        for (AnnotationMirror mirror : annotations) {
            if (mirror.getAnnotationType().asElement().equals(assignmentElement)) {
                Map<? extends ExecutableElement, ? extends AnnotationValue> values = mirror.getElementValues();
                String assignee = (String) getAnnotationValue(values, "assignee"); //获取注解的值
            }
        }
    } 
}  
```
&emsp;&emsp;仔细比较上面两段代码，可以发现它们的基本结构是类似的。不同之处在于JDK 6中通过元注解@SupportedAnnotationTypes来声明所支持的注解类型。另外描述程序静态结构的javax.lang.model包使用了不同的类型名称。使用的时候也更加简单，只需要通过javac -processor annotation.pap.AssignmentProcess Demo1.java这样的方式即可。
&emsp;&emsp;上面介绍的这两种做法都是在编译时刻进行处理的。而有些时候则需要在运行时刻来完成对注解的处理。这个时候就需要用到Java的反射API。反射API提供了在运行时刻读取注解信息的支持。不过前提是注解的保留策略声明的是运行时。Java反射API的AnnotatedElement接口提供了获取类、方法和域上的注解的实用方法。比如获取到一个Class类对象之后，通过getAnnotation方法就可以获取到该类上添加的指定注解类型的注解。

#### 实例分析

&emsp;&emsp;下面通过一个具体的实例来分析说明在实践中如何来使用和处理注解。假定有一个公司的雇员信息系统，从访问控制的角度出发，对雇员的工资的更新只能由具有特定角色的用户才能完成。考虑到访问控制需求的普遍性，可以定义一个注解来让开发人员方便的在代码中声明访问控制权限。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RequiredRoles {
    String[] value();
}
```

&emsp;&emsp;下一步则是如何对注解进行处理，这里使用的Java的反射API并结合动态代理。下面是动态代理中的InvocationHandler接口的实现。

```java
public class AccessInvocationHandler<T> implements InvocationHandler {
    final T accessObj;
    public AccessInvocationHandler(T accessObj) {
        this.accessObj = accessObj;
    }
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        RequiredRoles annotation = method.getAnnotation(RequiredRoles.class); //通过反射API获取注解
        if (annotation != null) {
            String[] roles = annotation.value();
            String role = AccessControl.getCurrentRole();
            if (!Arrays.asList(roles).contains(role)) {
                throw new AccessControlException("The user is not allowed to invoke this method.");
            }
        }
        return method.invoke(accessObj, args);
    } 
} 
```
&emsp;&emsp;在具体使用的时候，首先要通过Proxy.newProxyInstance方法创建一个EmployeeGateway的接口的代理类，使用该代理类来完成实际的操作。