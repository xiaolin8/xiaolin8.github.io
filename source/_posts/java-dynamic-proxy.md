---
title: Java基础拾遗——动态代理
date: 2016-05-29 17:04:34
categories: 技术
tags: java
---

#### 什么是动态代理？
① 首先你要明白静态代理的作用
我们有一个字体提供类，有多种实现（从磁盘，从网络，从系统）

```java
public interface FontProvider {
    Font getFont(String name);
}

public abstract class ProviderFactory {
    public static FontProvider getFontProvider() {
        return new FontProviderFromDisk();
    }
}

public class Main() {
    public static void main(String[] args) {
        FontProvider fontProvider = ProviderFactory.getFontProvider();
        Font font = fontProvider.getFont("微软雅黑");
        ......
    }
}
```

现在我们希望给他加上一个缓存功能，我们可以用静态代理来完成

```java
public class CachedFontProvider implements FontProvider {
    private FontProvider fontProvider;
    private Map<String, Font> cached;

    public CachedFontProvider(FontProvider fontProvider) {
        this.fontProvider = fontProvider;
    }

    public Font getFont(String name) {
        Font font = cached.get(name);
        if (font == null) {
            font = fontProvider.getFont(name);
            cached.put(name, font);
        }
        return font;
    }
}


/* 对工厂类进行相应修改，代码使用处不必进行任何修改。
   这也是面向接口编程以及工厂模式的一个好处 */
public abstract class ProviderFactory {
    public static FontProvider getFontProvider() {
        return new CachedFontProvider(new FontProviderFromDisk());
    }
}
```

当然，我们直接修改FontProviderFromDisk类也可以实现目的，但是我们还有FontProviderFromNet, FontProviderFromSystem等多种实现类，一一修改太过繁琐且易出错。
况且将来还可能添加日志，权限检查，异常处理等功能显然用代理类更好一点。

② 然而为什么要用动态代理？
考虑以下各种情况，有多个提供类，每个类都有getXxx(String name)方法，每个类都要加入缓存功能，使用静态代理虽然也能实现，但是也是略显繁琐，需要手动一一创建代理类。

```java
public abstract class ProviderFactory {
    public static FontProvider getFontProvider() {...}
    public static ImageProvider getImageProvider() {...}
    public static MusicProvider getMusicProvider() {...}
    ......
}
```

使用动态代理怎么完成呢？

```java
public class CachedProviderHandler implements InvocationHandler {
    private Map<String, Object> cached = new HashMap<>();
    private Object target;

    public CachedProviderHandler(Object target) {
        this.target = target;
    }

    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable {
        Type[] types = method.getParameterTypes();
        if (method.getName().matches("get.+") && (types.length == 1) &&
                (types[0] == String.class)) {
            String key = (String) args[0];
            Object value = cached.get(key);
            if (value == null) {
                value = method.invoke(target, args);
                cached.put(key, value);
            }
            return value;
        }
        return method.invoke(target, args);
    }
}

public abstract class ProviderFactory {
    public static FontProvider getFontProvider() {
        Class<FontProvider> targetClass = FontProvider.class;
        return (FontProvider) Proxy.newProxyInstance(targetClass.getClassLoader(),
            new Class[] { targetClass },
            new CachedProviderHandler(new FontProviderFromDisk()));
    }
}
```

③ 这也是为什么Spring这么受欢迎的一个原因
Spring容器代替工厂，Spring AOP代替JDK动态代理，让面向切面编程更容易实现。
在Spring的帮助下轻松添加，移除动态代理，且对源代码无任何影响。