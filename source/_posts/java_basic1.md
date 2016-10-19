---
title: java基础拾遗——String、日期、集合类
date: 2016-05-26 21:40:42
categories: 技术
tags: java
---

#### String,StringBuffer与StringBuilder的区别?


**String 字符串常量**
**StringBuffer 字符串变量（线程安全）**
**StringBuilder 字符串变量（非线程安全）**



&emsp;&emsp;简要的说， String 类型和 StringBuffer 类型的主要性能区别其实在于 String 是不可变的对象, 因此在每次对 String 类型进行改变的时候其实都等同于生成了一个新的 String 对象，然后将指针指向新的 String 对象，所以为性能考虑经常改变内容的字符串最好不要用 String。
&emsp;&emsp;而如果是使用 StringBuffer 类则结果就不一样了，每次结果都会对 StringBuffer 对象本身进行操作，而不是生成新的对象，再改变对象引用。所以在一般情况下我们推荐使用 StringBuffer ，特别是字符串对象经常改变的情况下。而在某些特别情况下， String 对象的字符串拼接其实是被 JVM 解释成了 StringBuffer 对象的拼接，所以这些时候 String 对象的速度并不会比 StringBuffer 对象慢，而特别是以下的字符串对象生成中， String 效率是远要比 StringBuffer 快的：

```java
 String S1 = "This is only a" + " simple" + " test";
 StringBuffer Sb = new StringBuilder("This is only a").append(" simple").append(" test");
```

&emsp;&emsp;你会很惊讶的发现，生成 String S1 对象的速度简直太快了，而这个时候 StringBuffer 居然速度上根本一点都不占优势。其实这是 JVM 的一个把戏，在 JVM 眼里，这个String S1 = "This is only a" + " simple" + " test";其实就是：String S1 = “This is only a simple test”; 所以当然不需要太多的时间了。但大家这里要注意的是，如果你的字符串是来自另外的 String 对象的话，速度就没那么快了，譬如：

```java
String S2 = “This is only a”;
String S3 = “ simple”;
String S4 = “ test”;
String S1 = S2 +S3 + S4;
```

性能上比较：

<font color="red">在大部分情况下 StringBuffer > String<br/>在大部分情况下 StringBuilder > StringBuffer</font>

&emsp;&emsp;java.lang.StringBuilder一个可变的字符序列是5.0新增的。此类提供一个与 StringBuffer 兼容的 API，但不保证同步。该类被设计用作 StringBuffer 的一个简易替换，用在字符串缓冲区被单个线程使用的时候（这种情况很普遍）。如果可能，建议优先采用该类，因为在大多数实现中，它比 StringBuffer 要快。两者的方法基本相同。


#### Java日期时间使用总结
	
```java
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;

public class TestDate {

	public static void main(String[] args) throws ParseException {
	// 1、类 java.util.Date
	// Date 表示特定的瞬间，精确到毫秒。从 JDK 1.1 开始，应该使用 Calendar 类实现日期和时间字段之间转换，使用
	// DateFormat
	// 类来格式化和分析日期字符串。Date 中的把日期解释为年、月、日、小时、分钟和秒值的方法已废弃。

	// Date(long date)分配 Date 对象并初始化此对象，参数为毫秒数
	Date date = new Date();
	// 下面仅仅列出没有过时的方法：

	// boolean after(Date when)测试此日期是否在指定日期之后
	// int compareTo(Date anotherDate) 比较两个日期的顺序
	// boolean equals(Object obj) 比较两个日期的相等性

	/*
	* String toString() ----Fri May 27 17:44:46 CST 2016 把此 Date 对象转换为以下形式的
	* String： dow mon dd hh:mm:ss zzz yyyy 其中： dow 是一周中的某一天 (Sun, Mon, Tue,
	* Wed, Thu, Fri, Sat)。 
	* mon 是月份 (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)。 dd 是一月中的某一天（01 至 31），显示为两位十进制数。 
	* hh 是一天中的小时（00 至 23），显示为两位十进制数。 mm 是小时中的分钟（00 至 59），显示为两位十进制数。 ss 是分钟中的秒数（00 至 61），显示为两位十进制数。 
	* zzz 是时区（并可以反映夏令时）。标准时区缩写包括方法 parse 识别的时区缩写。如果不提供时区信息，则 zzz 为空，即根本不包括任何字符。 
	* yyyy 是年份，显示为 4 位十进制数。
	*/
	System.out.println("现在的日期是 = " + date.toString());
	System.out.println("自1970年1月1日0时0分0秒开始至今所经历的毫秒数 = " + date.getTime());

	// 2、类 java.text.DateFormat
	// 它以与语言无关的方式格式化并分析日期或时间
	// 要格式化一个当前语言环境下的日期，可使用某个静态工厂方法：
	// DateFormat df = DateFormat.getDateInstance();
	// for (int i = 0; i < myDate.length; ++i) {
	// output.println(df.format(myDate[i]) + "; ");
	// }

	// 要格式化不同语言环境的日期，可在 getDateInstance() 的调用中指定它。
	// DateFormat df = DateFormat.getDateInstance(DateFormat.LONG,
	// Locale.FRANCE);
	// SHORT 完全为数字，如 12.13.52 或 3:30pm
	// MEDIUM 较长，如 Jan 12, 1952
	// LONG 更长，如 January 12, 1952 或 3:30:32pm
	// FULL 是完全指定，如 Tuesday, April 12, 1952 AD 或 3:30:42pm PST
	DateFormat df = DateFormat.getDateInstance(DateFormat.SHORT);// 默认是MEDIUM
	System.out.println(df.format(new Date()));// LONG:2016年5月27日
											// FULL:2016年5月27日 星期五
											// MEDIUM：2016-5-27
											// SHORT:16-5-27
	// 3、java.text.SimpleDateFormat（DateFormat的直接子类）的使用
	// 日期和时间模式
	// 在日期和时间模式字符串中，未加引号的字母 'A' 到 'Z' 和 'a' 到 'z'
	// 被解释为模式字母，用来表示日期或时间字符串元素。文本可以使用单引号 (') 引起来，以免进行解释。"''"
	// 表示单引号。所有其他字符均不解释；只是在格式化时将它们简单复制到输出字符串，或者在分析时与输入字符串进行匹配。
	// y-->Year
	// M-->Month
	// w-->年中的周数
	// W-->月份中的周数
	// D-->年中的天数
	// d-->月份中的天数
	// F-->月份中的星期
	// E-->星期中的天数
	// a-->Am/pm 标记
	// H-->一天中的小时数（0-23）
	// K-->am/pm 中的小时数（0-11）
	// m-->小时中的分钟数
	// s-->分钟中的秒数
	// S-->毫秒数
	// 创建不同的日期格式
	DateFormat df1 = DateFormat.getInstance();
	DateFormat df2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss EE");
	DateFormat df3 = DateFormat.getDateInstance(DateFormat.FULL, Locale.CHINA); // 产生一个指定国家指定长度的日期格式，长度不同，显示的日期完整性也不同
	DateFormat df4 = new SimpleDateFormat("yyyy年MM月dd日 hh时mm分ss秒 EE", Locale.CHINA);
	DateFormat df5 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss EEEEEE", Locale.US);
	DateFormat df6 = new SimpleDateFormat("yyyy-MM-dd");

	// 将日期按照不同格式进行输出
	System.out.println("-------将日期按照不同格式进行输出------");
	System.out.println("按照Java默认的日期格式，默认的区域                      : " + df1.format(date));
	System.out.println("按照指定格式 yyyy-MM-dd hh:mm:ss EE ，系统默认区域      :" + df2.format(date));
	System.out.println("按照日期的FULL模式，区域设置为中文                      : " + df3.format(date));
	System.out.println("按照指定格式 yyyy年MM月dd日 hh时mm分ss秒 EE ，区域为中文 : " + df4.format(date));
	System.out.println("按照指定格式 yyyy-MM-dd hh:mm:ss EE ，区域为美国        : " + df5.format(date));
	System.out.println("按照指定格式 yyyy-MM-dd ，系统默认区域                  : " + df6.format(date));

	// 4、java.util.Calendar（抽象类）
	// 它为与一组日历字段之间的转换提供了一些方法，并为操作日历字段（例如获得下星期的日期）提供了一些方法。
	// Calendar中些陷阱，很容易掉下去：
	// 1、Calendar的星期是从周日开始的，常量值为0。
	// 2、Calendar的月份是从一月开始的，常量值为0。
	// 3、Calendar的每个月的第一天值为1。

	// 5、java.util.GregorianCalendar（Calendar的直接子类）
	// GregorianCalendar 是 Calendar 的一个具体子类，提供了世界上大多数国家使用的标准日历系统。
	//创建Calendar的方式 
     Calendar now1 = Calendar.getInstance(); 
     Calendar now2 = new GregorianCalendar(); 
     Calendar now3 = new GregorianCalendar(2007, 10, 30); 
     Calendar now4 = new GregorianCalendar(2007, 10, 30, 15, 55);      //陷阱:Calendar的月份是0~11 
     Calendar now5 = new GregorianCalendar(2007, 10, 30, 15, 55, 44); 
     Calendar now6 = new GregorianCalendar(Locale.US); 
     Calendar now7 = new GregorianCalendar(TimeZone.getTimeZone("GMT-8:00")); 

     //通过日期和毫秒数设置Calendar 
     now2.setTime(new Date()); 
     System.out.println(now2); 
     now2.setTimeInMillis(new Date().getTime()); 
     System.out.println(now2); 
     
     //定义日期的中文输出格式,并输出日期 
     df = new SimpleDateFormat("yyyy年MM月dd日 hh时mm分ss秒 E", Locale.CHINA); 
     System.out.println("获取日期中文格式化化输出：" + df.format(now5.getTime())); 
    System.out.println(); 
    System.out.println("--------通过Calendar获取日期中年月日等相关信息--------"); 
    System.out.println("获取年：" + now5.get(Calendar.YEAR)); 
    System.out.println("获取月(月份是从0开始的)：" + now5.get(Calendar.MONTH)); 
    System.out.println("获取日：" + now5.get(Calendar.DAY_OF_MONTH)); 
    System.out.println("获取时：" + now5.get(Calendar.HOUR)); 
    System.out.println("获取分：" + now5.get(Calendar.MINUTE)); 
    System.out.println("获取秒：" + now5.get(Calendar.SECOND)); 
    System.out.println("获取上午、下午：" + now5.get(Calendar.AM_PM)); 
    System.out.println("获取星期数值(星期是从周日开始的)：" + now5.get(Calendar.DAY_OF_WEEK)); 
    System.out.println(); 
    System.out.println("---------通用星期中文化转换---------"); 
    String dayOfWeek[] = {"", "日", "一", "二", "三", "四", "五", "六"}; 
    System.out.println("now5对象的星期是:" + dayOfWeek[now5.get(Calendar.DAY_OF_WEEK)]); 
    System.out.println(); 
	}
}
```

#### Java常用集合类

##### <font size = "3px">**Java集合类基本概念**</font>
Java容器类类库的用途是"保存对象"，并将其划分为两个不同的概念：
1. Collection
一组"对立"的元素，通常这些元素都服从某种规则
	① List必须保持元素特定的顺序
	② Set不能有重复元素
	③ Queue保持一个队列(先进先出)的顺序

2. Map
一组成对的"键值对"对象

Collection和Map的区别在于容器中每个位置保存的元素个数:
- Collection 每个位置只能保存一个元素(对象)
- Map保存的是"键值对"，就像一个小型数据库。我们可以通过"键"找到该键对应的"值"

##### <font size = "3px">**Java集合类架构层次关系**</font>
**1. Interface Iterable**
迭代器接口，这是Collection类的父接口。实现这个Iterable接口的对象允许使用foreach进行遍历，也就是说，所有的Collection集合对象都具有"foreach可遍历性"。这个Iterable接口只有一个方法: iterator()。它返回一个代表当前集合对象的泛型<T>迭代器，用于之后的遍历操作
**1.1 Collection**
Collection是最基本的集合接口，一个Collection代表一组Object的集合，这些Object被称作Collection的元素。Collection是一个接口，用以提供规范定义，不能被实例化使用
**1) Set**
    Set集合类似于一个罐子，"丢进"Set集合里的多个对象之间没有明显的顺序。Set继承自Collection接口，不能包含有重复元素(记住，这是整个Set类层次的共有属性)。
    Set判断两个对象相同不是使用"=="运算符，而是根据equals方法。也就是说，我们在加入一个新元素的时候，如果这个新元素对象和Set中已有对象进行注意equals比较都返回false，则Set就会接受这个新元素对象，否则拒绝。因为Set的这个制约，在使用Set集合的时候，应该注意两点：
1) 为Set集合里的元素的实现类实现一个有效的equals(Object)方法;
2) 对Set的构造函数，传入的Collection参数不能包含重复的元素;
	**1.1) HashSet**
     HashSet是Set接口的典型实现，HashSet使用HASH算法来存储集合中的元素，因此具有良好的存取和查找性能。当向HashSet集合中存入一个元素时，HashSet会调用该对象的HashCode()方法来得到该对象的hashCode值，然后根据该HashCode值决定该对象在HashSet中的存储位置。
     值得注意的是，HashSet集合判断两个元素相等的标准是两个对象通过equals()方法比较相等，并且两个对象的hashCode()方法的返回值相等；
		**1.1.1) LinkedHashSet**
            LinkedHashSet集合也是根据元素的hashCode值来决定元素的存储位置，但和HashSet不同的是，它同时使用链表维护元素的次序，这样使得元素看起来是以插入的顺序保存的。当遍历LinkedHashSet集合里的元素时，LinkedHashSet将会按元素的添加顺序来访问集合里的元素。LinkedHashSet需要维护元素的插入顺序，因此性能略低于HashSet的性能，但在迭代访问Set里的全部元素时(遍历)将有很好的性能(链表很适合进行遍历);

**1.2) SortedSet**    
    此接口主要用于排序操作，即实现此接口的子类都属于排序的子类；
**1.2.1) TreeSet**
            TreeSet是SortedSet接口的实现类，TreeSet可以确保集合元素处于排序状态；
**1.3) EnumSet**
        EnumSet是一个专门为枚举类设计的集合类，EnumSet中所有元素都必须是指定枚举类型的枚举值，该枚举类型在创建EnumSet时显式、或隐式地指定。EnumSet的集合元素也是有序的，它们以枚举值在Enum类内的定义顺序来决定集合元素的顺序；
**2) List**
    List集合代表一个元素有序、可重复的集合，集合中每个元素都有其对应的顺序索引。List集合允许加入重复元素，因为它可以通过索引来访问指定位置的集合元素。List集合默认按元素的添加顺序设置元素的索引；
**2.1) ArrayList**
        ArrayList是基于数组实现的List类，它封装了一个动态的增长的、允许再分配的Object[]数组。
        **2.2) Vector**
        Vector和ArrayList在用法上几乎完全相同，但Vector是同步的，而ArrayList则是异步的。因为同步的要求会影响执行的效率，所以如果你不需要线程安全的集合那么使用ArrayList是一个很好的选择，这样可以避免由于同步带 来的不必要的性能开销。
**2.2.1) Stack**
            Stack是Vector提供的一个子类，用于模拟"栈"这种数据结构(LIFO后进先出)
如果涉及到堆栈，队列等操作，应该考虑用List，对于需要快速插入，删除元素，应该使用LinkedList，如果需要快速随机访问元素，应该使用ArrayList。
如果程序在单线程环境中，或者访问仅仅在一个线程中进行，考虑非同步的类，其效率较高，如果多个线程可能同时操作一个类，应该使用同步的类。
**3) Queue**
    Queue用于模拟"队列"这种数据结构(先进先出 FIFO)。队列的头部保存着队列中存放时间最长的元素，队列的尾部保存着队列中存放时间最短的元素。新元素插入(offer)到队列的尾部，访问元素(poll)操作会返回队列头部的元素，队列不允许随机访问队列中的元素。结合生活中常见的排队就会很好理解这个概念；
**3.1) PriorityQueue**
        PriorityQueue并不是一个比较标准的队列实现，PriorityQueue保存队列元素的顺序并不是按照加入队列的顺序，而是按照队列元素的大小进行重新排序，这点从它的类名也可以看出来；
**3.2) Deque**
        Deque接口代表一个"双端队列"，双端队列可以同时从两端来添加、删除元素，因此Deque的实现类既可以当成队列使用、也可以当成栈使用；
**3.2.1) ArrayDeque**
       是一个基于数组的双端队列，和ArrayList类似，它们的底层都采用一个动态的、可重分配的Object[]数组来存储集合元素，当集合元素超出该数组的容量时，系统会在底层重新分配一个Object[]数组来存储集合元素；
**1.2 Map**
Map用于保存具有"映射关系"的数据，因此Map集合里保存着两组值，一组值用于保存Map里的key，另外一组值用于保存Map里的value。key和value都可以是任何引用类型的数据。Map的key不允许重复，即同一个Map对象的任何两个key通过equals方法比较结果总是返回false。
关于Map，我们要从代码复用的角度去理解，java是先实现了Set，然后通过包装了一个所有value都为null的list就实现了Map集合（key不能重复）;

> **hashtable与hashmap**
1.Hashtable是基于陈旧的Dictionary类的；
2.Hashtable是同步的，而HashMap不是同步的；
3.只有HashMap可以让你将空值作为一个表的条目的key或value；

**1) HashMap**
    和HashSet集合不能保证元素的顺序一样，HashMap也不能保证key-value对的顺序。并且类似于HashSet判断两个key是否相等的标准也是: 两个key通过equals()方法比较返回true、同时两个key的hashCode值也必须相等；
**1.1) LinkedHashMap**
    LinkedHashMap也使用双向链表来维护key-value对的次序，该链表负责维护Map的迭代顺序，与key-value对的插入顺序一致(注意和TreeMap对所有的key-value进行排序进行区分)
**2) Hashtable**
    是一个古老的Map实现类
**2.1) Properties **
    Properties对象在处理属性文件时特别方便(windows平台上的.ini文件)，Properties类可以把Map对象和属性文件关联起来，从而可以把Map对象中的key-value对写入到属性文件中，也可以把属性文件中的"属性名-属性值"加载到Map对象中；
**3) SortedMap**
    正如Set接口派生出SortedSet子接口，SortedSet接口有一个TreeSet实现类一样，Map接口也派生出一个SortedMap子接口，SortedMap接口也有一个TreeMap实现类；
![](http://images.cnitblog.com/i/532548/201404/262238192165666.jpg)

##### <font size = "3px">**Java集合类的应用场景**</font>
**HashSet**

如果两个对象通过equals()方法比较返回true，但这两个对象的hashCode()方法返回不同的hashCode值时，这将导致HashSet会把这两个对象保存在Hash表的不同位置，从而使对象可以添加成功，这就与Set集合的规则有些出入了。所以，我们要明确的是: equals()决定是否可以加入HashSet、而hashCode()决定存放的位置，它们两者必须同时满足才能允许一个新元素加入HashSet
但是要注意的是: 如果两个对象的hashCode相同，但是它们的equlas返回值不同，HashSet会在这个位置用链式结构来保存多个对象。而HashSet访问集合元素时也是根据元素的HashCode值来快速定位的，这种链式结构会导致性能下降。

所以如果需要把某个类的对象保存到HashSet集合中，我们在重写这个类的equlas()方法和hashCode()方法时，应该尽量保证两个对象通过equals()方法比较返回true时，它们的hashCode()方法返回值也相等;

**TreeSet**

```java

import java.util.*;

public class TreeSetTest
{
    public static void main(String[] args) 
    {
        TreeSet nums = new TreeSet();
        //向TreeSet中添加四个Integer对象
        nums.add(5);
        nums.add(2);
        nums.add(10);
        nums.add(-9);

        //输出集合元素，看到集合元素已经处于排序状态
        System.out.println(nums);

        //输出集合里的第一个元素
        System.out.println(nums.first());

        //输出集合里的最后一个元素
        System.out.println(nums.last());

        //返回小于4的子集，不包含4
        System.out.println(nums.headSet(4));

        //返回大于5的子集，如果Set中包含5，子集中还包含5
        System.out.println(nums.tailSet(5));

        //返回大于等于-3，小于4的子集。
        System.out.println(nums.subSet(-3 , 4));
    }
}

```
与HashSet集合采用hash算法来决定元素的存储位置不同，TreeSet采用红黑树的数据结构来存储集合元素。TreeSet支持两种排序方式: 自然排序、定制排序;TreeSet会调用集合元素的compareTo(Object obj)方法来比较元素之间的大小关系，然后将集合元素按升序排序，即自然排序。如果试图把一个对象添加到TreeSet时，则该对象的类必须实现Comparable接口，否则程序会抛出异常。

**EnumSet**

```java

import java.util.*;

enum Season
{
    SPRING,SUMMER,FALL,WINTER
}
public class EnumSetTest
{
    public static void main(String[] args) 
    {
        //创建一个EnumSet集合，集合元素就是Season枚举类的全部枚举值
        EnumSet es1 = EnumSet.allOf(Season.class);
        //输出[SPRING,SUMMER,FALL,WINTER]
        System.out.println(es1);

        //创建一个EnumSet空集合，指定其集合元素是Season类的枚举值。
        EnumSet es2 = EnumSet.noneOf(Season.class); 
        //输出[]
        System.out.println(es2); 
        //手动添加两个元素
        es2.add(Season.WINTER);
        es2.add(Season.SPRING);
        //输出[SPRING,WINTER]
        System.out.println(es2);

        //以指定枚举值创建EnumSet集合
        EnumSet es3 = EnumSet.of(Season.SUMMER , Season.WINTER); 
        //输出[SUMMER,WINTER]
        System.out.println(es3);

        EnumSet es4 = EnumSet.range(Season.SUMMER , Season.WINTER); 
        //输出[SUMMER,FALL,WINTER]
        System.out.println(es4);

        //新创建的EnumSet集合的元素和es4集合的元素有相同类型，
        //es5的集合元素 + es4集合元素 = Season枚举类的全部枚举值
        EnumSet es5 = EnumSet.complementOf(es4); 
        //输出[SPRING]
        System.out.println(es5);
    }
}

```
Set集合类使用总结：
>1) HashSet的性能总是比TreeSet好(特别是最常用的添加、查询元素等操作)，因为TreeSet需要额外的红黑树算法来维护集合元素的次序。只有当需要一个保持排序的Set时，才应该使用TreeSet，否则都应该使用HashSet;
>
2) 对于普通的插入、删除操作，LinkedHashSet比HashSet要略慢一点，这是由维护链表所带来的开销造成的。不过，因为有了链表的存在，遍历LinkedHashSet会更快;
>
3) EnumSet是所有Set实现类中性能最好的，但它只能保存同一个枚举类的枚举值作为集合元素;
>
4) HashSet、TreeSet、EnumSet都是"线程不安全"的，通常可以通过Collections工具类的synchronizedSortedSet方法来"包装"该Set集合
SortedSet s = Collections.synchronizedSortedSet(new TreeSet(...));

**List**

**ArrayList**
```java

import java.util.*;

public class ListTest
{
    public static void main(String[] args) 
    {
        List books = new ArrayList();
        //向books集合中添加三个元素
        books.add(new String("轻量级Java EE企业应用实战"));
        books.add(new String("疯狂Java讲义"));
        books.add(new String("疯狂Android讲义"));
        System.out.println(books);

        //将新字符串对象插入在第二个位置
        books.add(1 , new String("疯狂Ajax讲义"));
        for (int i = 0 ; i < books.size() ; i++ )
        {
            System.out.println(books.get(i));
        }

        //删除第三个元素
        books.remove(2);
        System.out.println(books);

        //判断指定元素在List集合中位置：输出1，表明位于第二位
        System.out.println(books.indexOf(new String("疯狂Ajax讲义")));  //①
        //将第二个元素替换成新的字符串对象
        books.set(1, new String("LittleHann"));
        System.out.println(books);

        //将books集合的第二个元素（包括）
        //到第三个元素（不包括）截取成子集合
        System.out.println(books.subList(1 , 2));
    }

```

**Stack栈**

```java
import java.util.*;

public class LinkedListTest {
  
  public static void main(String[] args) {
    LinkedList books = new LinkedList();
    
    // 将字符串元素加入队列的尾部(双端队列)
    books.offer("疯狂Java讲义");
    
    // 将一个字符串元素加入栈的顶部(双端队列)
    books.push("轻量级Java EE企业应用实战");
    
    // 将字符串元素添加到队列的头(相当于栈的顶部)
    books.offerFirst("疯狂Android讲义");
    
    for (int i = 0; i < books.size(); i++) {
      System.out.println(books.get(i));
      // 疯狂Android讲义
      // 轻量级Java EE企业应用实战
      // 疯狂Java讲义
    }
    
    // 访问、并不删除栈顶的元素       疯狂Android讲义
    System.out.println(books.peekFirst());
    // 访问、并不删除队列的最后一个元素     疯狂Java讲义
    System.out.println(books.peekLast());
    // 将栈顶的元素弹出"栈"    疯狂Android讲义
    System.out.println(books.pop());
    // 下面输出将看到队列中第一个元素被删除     [轻量级Java EE企业应用实战, 疯狂Java讲义]
    System.out.println(books);
    // 访问、并删除队列的最后一个元素     疯狂Java讲义
    System.out.println(books.pollLast());
    // 下面输出将看到队列中只剩下中间一个元素：
    // 轻量级Java EE企业应用实战
    System.out.println(books);
  }
}
```

**Queue**
**PriorityQueue**

```java
import java.util.PriorityQueue;

public class PriorityQueueTest {
  
  public static void main(String[] args) {
    PriorityQueue pq = new PriorityQueue();
    // 下面代码依次向pq中加入四个元素
    pq.offer(6);
    pq.offer(-3);
    pq.offer(9);
    pq.offer(0);
    
    // 输出pq队列，并不是按元素的加入顺序排列，
    // 而是按元素的大小顺序排列，输出[-3, 0, 9, 6]
    System.out.println(pq);
    // 访问队列第一个元素，其实就是队列中最小的元素：-3
    System.out.println(pq.poll());
  }
}
```

PriorityQueue不允许插入null元素，它还需要对队列元素进行排序;

**ArrayDeque**

```java
import java.util.*;

public class ArrayDequeTest
{
    public static void main(String[] args) 
    {
        ArrayDeque stack = new ArrayDeque();
        //依次将三个元素push入"栈"
        stack.push("疯狂Java讲义");
        stack.push("轻量级Java EE企业应用实战");
        stack.push("疯狂Android讲义");

        //输出：[疯狂Java讲义, 轻量级Java EE企业应用实战 , 疯狂Android讲义]
        System.out.println(stack);

        //访问第一个元素，但并不将其pop出"栈"，输出：疯狂Android讲义
        System.out.println(stack.peek());

        //依然输出：[疯狂Java讲义, 轻量级Java EE企业应用实战 , 疯狂Android讲义]
        System.out.println(stack);

        //pop出第一个元素，输出：疯狂Android讲义
        System.out.println(stack.pop());

        //输出：[疯狂Java讲义, 轻量级Java EE企业应用实战]
        System.out.println(stack);
    }
}
```

List集合类总结：
>1. java提供的List就是一个"线性表接口"，ArrayList(基于数组的线性表)、LinkedList(基于链的线性表)是线性表的两种典型实现
2. Queue代表了队列，Deque代表了双端队列(既可以作为队列使用、也可以作为栈使用)
3. 因为数组以一块连续内存来保存所有的数组元素，所以数组在随机访问时性能最好。所以的内部以数组作为底层实现的集合在随机访问时性能最好。
4. 内部以链表作为底层实现的集合在执行插入、删除操作时有很好的性能
5. 进行迭代操作时，以链表作为底层实现的集合比以数组作为底层实现的集合性能好

**Iterable接口**
>1) boolean hasNext(): 是否还有下一个未遍历过的元素
>2) Object next(): 返回集合里的下一个元素
>3) void remove(): 删除集合里上一次next方法返回的元素

iterator实现遍历:

```java
import java.util.*;

public class IteratorTest
{
    public static void main(String[] args) 
    {
        //创建一个集合
        Collection books = new HashSet();
        books.add("轻量级Java EE企业应用实战");
        books.add("疯狂Java讲义");
        books.add("疯狂Android讲义");


        //获取books集合对应的迭代器
        Iterator it = books.iterator();
        while(it.hasNext())
        {
            //it.next()方法返回的数据类型是Object类型，
            //需要强制类型转换
            String book = (String)it.next();
            System.out.println(book);
            if (book.equals("疯狂Java讲义"))
            {
                //从集合中删除上一次next方法返回的元素
                it.remove();
            }
            //对book变量赋值，不会改变集合元素本身
            book = "测试字符串";    
        }
        System.out.println(books);
    }
}
```
foreach实现遍历:

```java
import java.util.*;

public class ForeachTest
{
    public static void main(String[] args) 
    {
        //创建一个集合
        Collection books = new HashSet();
        books.add(new String("轻量级Java EE企业应用实战"));
        books.add(new String("疯狂Java讲义"));
        books.add(new String("疯狂Android讲义"));

        for (Object obj : books)
        {
            //此处的book变量也不是集合元素本身
            String book = (String)obj;
            System.out.println(book);
            if (book.equals("疯狂Android讲义"))
            {
                //下面代码会引发ConcurrentModificationException异常
                //books.remove(book);      
            }
        }
        System.out.println(books);
    }
}
```
ListIterator接口在Iterator接口的继承上增加了如下方法:
>1) boolean hasPrevious(): 返回该迭代器关联的集合是否还有上一个元素
>2) Object previous(): 返回该迭代器的上一个元素(向前迭代)
>3) void add(): 在指定位置插入一个元素

**HashMap、Hashtable**

```java
import java.util.Hashtable;

class A {
  
  int count;
  
  public A(int count) {
    this.count = count;
  }
  
  // 根据count的值来判断两个对象是否相等。
  public boolean equals(Object obj) {
    if (obj == this)
      return true;
    if (obj != null && obj.getClass() == A.class) {
      A a = (A) obj;
      return this.count == a.count;
    }
    return false;
  }
  
  // 根据count来计算hashCode值。
  public int hashCode() {
    return this.count;
  }
}

class B {
  
  // 重写equals()方法，B对象与任何对象通过equals()方法比较都相等
  public boolean equals(Object obj) {
    return true;
  }
}

public class HashtableTest {
  
  public static void main(String[] args) {
    Hashtable ht = new Hashtable();
    ht.put(new A(60000), "疯狂Java讲义");
    ht.put(new A(87563), "轻量级Java EE企业应用实战");
    ht.put(new A(1232), new B());
    System.out.println(ht);// {A@ea60=疯狂Java讲义, A@1560b=轻量级Java EE企业应用实战, A@4d0=B@97d01f}
    
    // 只要两个对象通过equals比较返回true，
    // Hashtable就认为它们是相等的value。
    // 由于Hashtable中有一个B对象，
    // 它与任何对象通过equals比较都相等，所以下面输出true。
    System.out.println(ht.containsValue("测试字符串")); // true
    
    // 只要两个A对象的count相等，它们通过equals比较返回true，且hashCode相等
    // Hashtable即认为它们是相同的key，所以下面输出true。
    System.out.println(ht.containsKey(new A(87563))); // true
    
    // 下面语句可以删除最后一个key-value对
    ht.remove(new A(1232));
    
    // 通过返回Hashtable的所有key组成的Set集合，
    // 从而遍历Hashtable每个key-value对
    for (Object key : ht.keySet()) {
      System.out.print(key + "---->");
      System.out.print(ht.get(key) + "\n");
      // A@ea60---->疯狂Java讲义
      // A@1560b---->轻量级Java EE企业应用实战
    }
  }
}
```

当使用自定义类作为HashMap、Hashtable的key时，如果重写该类的equals(Object obj)和hashCode()方法，则应该保证两个方法的判断标准一致--当两个key通过equals()方法比较返回true时，两个key的hashCode()的返回值也应该相同;

**Properties（Hashtable）**

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Properties;

public class PropertiesTest {
  
  public static void main(String[] args) throws Exception {
    Properties props = new Properties();
    // 向Properties中增加属性
    props.setProperty("username", "yeeku");
    props.setProperty("password", "123456");
    System.out.println(props);// {password=123456, username=yeeku}
    // 将Properties中的key-value对保存到a.ini文件中
    props.store(new FileOutputStream("a.ini"), "comment line");
    
    // 新建一个Properties对象
    Properties props2 = new Properties();
    // 向Properties中增加属性
    props2.setProperty("gender", "male");
    
    // 将a.ini文件中的key-value对追加到props2中
    props2.load(new FileInputStream("a.ini"));
    System.out.println(props2);// {password=123456, gender=male, username=yeeku}
  }
}
```
Properties还可以把key-value对以XML文件的形式保存起来，也可以从XML文件中加载key-value对

**TreeMap**

```java
import java.util.TreeMap;

class R implements Comparable {
  
  int count;
  
  public R(int count) {
    this.count = count;
  }
  
  public String toString() {
    return "R[count:" + count + "]";
  }
  
  // 根据count来判断两个对象是否相等。
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj != null && obj.getClass() == R.class) {
      R r = (R) obj;
      return r.count == this.count;
    }
    return false;
  }
  
  // 根据count属性值来判断两个对象的大小。
  public int compareTo(Object obj) {
    R r = (R) obj;
    return count > r.count ? 1 : count < r.count ? -1 : 0;
  }
}

public class TreeMapTest {
  
  public static void main(String[] args) {
    TreeMap tm = new TreeMap();
    tm.put(new R(3), "轻量级Java EE企业应用实战");
    tm.put(new R(-5), "疯狂Java讲义");
    tm.put(new R(9), "疯狂Android讲义");
    
    System.out.println(tm);//{R[count:-5]=疯狂Java讲义, R[count:3]=轻量级Java EE企业应用实战, R[count:9]=疯狂Android讲义}
    
    // 返回该TreeMap的第一个Entry对象
    System.out.println(tm.firstEntry());//R[count:-5]=疯狂Java讲义
    
    // 返回该TreeMap的最后一个key值
    System.out.println(tm.lastKey());//R[count:9]
    
    // 返回该TreeMap的比new R(2)大的最小key值。
    System.out.println(tm.higherKey(new R(2)));//R[count:3]
    
    // 返回该TreeMap的比new R(2)小的最大的key-value对。
    System.out.println(tm.lowerEntry(new R(2)));//R[count:-5]=疯狂Java讲义
    
    // 返回该TreeMap的子TreeMap
    System.out.println(tm.subMap(new R(-1), new R(4)));//{R[count:3]=轻量级Java EE企业应用实战}
  }
}
```
TreeMap中判断两个key相等的标准是:
>1) 两个key通过compareTo()方法返回0
>2) equals()放回true

再次强调一下:

>Set和Map的关系十分密切，java源码就是先实现了HashMap、TreeMap等集合，然后通过包装一个所有的value都为null的Map集合实现了Set集合类

**EnumMap**

```java
import java.util.*;

enum Season
{
    SPRING,SUMMER,FALL,WINTER
}
public class EnumMapTest
{
    public static void main(String[] args) 
    {
        //创建一个EnumMap对象，该EnumMap的所有key
        //必须是Season枚举类的枚举值
        EnumMap enumMap = new EnumMap(Season.class);
        enumMap.put(Season.SUMMER , "夏日炎炎");
        enumMap.put(Season.SPRING , "春暖花开");
        System.out.println(enumMap);//{SPRING=春暖花开, SUMMER=夏日炎炎}
    }
}
```
与创建普通Map有所区别的是，创建EnumMap是必须指定一个枚举类，从而将该EnumMap和指定枚举类关联起来

Map集合类总结：
>1) HashMap和Hashtable的效率大致相同，因为它们的实现机制几乎完全一样。但HashMap通常比Hashtable要快一点，因为Hashtable需要额外的线程同步控制
2) TreeMap通常比HashMap、Hashtable要慢(尤其是在插入、删除key-value对时更慢)，因为TreeMap底层采用红黑树来管理key-value对
3) 使用TreeMap的一个好处就是： TreeMap中的key-value对总是处于有序状态，无须专门进行排序操作