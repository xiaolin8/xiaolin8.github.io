---
title: java基础拾遗——IO流
date: 2016-05-28 10:54:53
categories: 技术
tags: java
---

#### 流
简单的来说，流是一个连续的字节的序列。输入流是用来读取这个序列，而输出流则构建这个序列。
InputStream和OutputStream所操纵的基本单元就是字节。每次读取和写入单个字节或是字节数组。如果从字节的层次来处理数据类型的话，操作会非常繁琐。可以用更易使用的流实现来包装基本的字节流。如果想读取或输出Java的基本数据类型，可以使用DataInputStream和DataOutputStream。它们所提供的类似readFloat和writeDouble这样的方法，会让处理基本数据类型变得很简单。如果希望读取或写入的是Java中的对象的话，可以使用ObjectInputStream和ObjectOutputStream。它们与对象的序列化机制一起，可以实现Java对象状态的持久化和数据传递。基本流所提供的对于输入和输出的控制比较弱。InputStream只提供了顺序读取、跳过部分字节和标记/重置的支持，而OutputStream则只能顺序输出。

Java流操作有关的类或接口：

![](http://pic002.cnblogs.com/images/2012/384764/2012031413371190.png)

Java流类图结构：

![](http://pic002.cnblogs.com/images/2012/384764/2012031413373126.jpg)

**IO流的分类**

- 根据处理数据类型的不同分为：字符流和字节流
- 根据数据流向不同分为：输入流和输出流

**字符流和字节流**
字符流的由来： 
因为数据编码的不同，而有了对字符进行高效操作的流对象。本质其实就是基于字节流读取时，去查了指定的码表;

字节流和字符流的区别：
读写单位不同：字节流以字节（8bit）为单位，字符流以字符为单位，根据码表映射字符，一次可能读多个字节。
处理对象不同：字节流能处理所有类型的数据（如图片、avi等），而字符流只能处理字符类型的数据。

结论：只要是处理纯文本数据，就优先考虑使用字符流。 除此之外都使用字节流。

#### 流的使用
每个打开的流都需要被正确的关闭以释放资源。所遵循的原则是谁打开谁释放。如果一个流只在某个方法体内使用，则通过finally语句或是JDK 7中的try-with-resources语句来确保在方法返回之前，流被正确的关闭。如果一个方法只是作为流的使用者，就不需要考虑流的关闭问题。典型的情况是在servlet实现中并不需要关闭HttpServletResponse中的输出流。如果你的代码需要负责打开一个流，并且需要在不同的对象之间进行传递的话，可以考虑使用Execute Around Method模式。如下面的代码所示：

```java
public void use(StreamUser user) {
    InputStream input = null;
    try {
        input = open();
        user.use(input);
    } catch(IOException e) {
        user.onError(e);
    } finally {
        if (input != null) {
            try { 
                input.close();
            } catch (IOException e) {
                user.onError(e);
            }
        }
    }
 } 
```
如上述代码中所看到的一样，由专门的类负责流的打开和关闭。流的使用者StreamUser并不需要关心资源释放的细节，只需要对流进行操作即可。

#### 缓冲区
Java I/O默认是不缓冲流的
应用程序每次IO都要和设备进行通信，效率很低，因此缓冲区为了提高效率，当写入设备时，先写入缓冲区，每次等到缓冲区满了时，就将数据一次性整体写入设备，避免了每一个数据都和IO进行一次交互;
带关键字buffer的流

传统的缓冲区的实现是使用数组来完成。比如经典的从InputStream到OutputStream的复制的实现，就是使用一个字节数组作为中间的缓冲区。NIO中引入的Buffer类及其子类，可以很方便的用来创建各种基本数据类型的缓冲区。相对于数组而言，Buffer类及其子类提供了更加丰富的方法来对其中的数据进行操作。

在Buffer上进行的元素添加和删除操作，都围绕3个属性position、limit和capacity展开，分别表示Buffer当前的读写位置、可用的读写范围和容量限制。容量限制是在创建的时候指定的。Buffer提供的get/put方法都有相对和绝对两种形式。相对读写时的位置是相对于position的值，而绝对读写则需要指定起始的序号。在使用Buffer的常见错误就是在读写操作时没有考虑到这3个元素的值，因为大多数时候都是使用的是相对读写操作，而position的值可能早就发生了变化。一些应该注意的地方包括：将数据读入缓冲区之前，需要调用clear方法；将缓冲区中的数据输出之前，需要调用flip方法。

```java
ByteBuffer buffer = ByteBuffer.allocate(32);
CharBuffer charBuffer = buffer.asCharBuffer();
String content = charBuffer.put("Hello ").put("World").flip().toString();
System.out.println(content);  
```
上面的代码展示了Buffer子类的使用。首先可以在已有的ByteBuffer上面创建出其它数据类型的缓冲区视图，其次Buffer子类的很多方法是可以级联的，最后是要注意flip方法的使用。

#### 字符与编码
NIO中的java.nio.charset包提供了与字符集相关的类，可以用来进行编码和解码。其中的CharsetEncoder和CharsetDecoder允许对编码和解码过程进行精细的控制，如处理非法的输入以及字符集中无法识别的字符等。通过这两个类可以实现字符内容的过滤。比如应用程序在设计的时候就只支持某种字符集，如果用户输入了其它字符集中的内容，在界面显示的时候就是乱码。对于这种情况，可以在解码的时候忽略掉无法识别的内容。

```java
String input = "你123好";
Charset charset = Charset.forName("ISO-8859-1");
CharsetEncoder encoder = charset.newEncoder();
encoder.onUnmappableCharacter(CodingErrorAction.IGNORE);
CharsetDecoder decoder = charset.newDecoder();
CharBuffer buffer = CharBuffer.allocate(32);
buffer.put(input);
buffer.flip();
try {
    ByteBuffer byteBuffer = encoder.encode(buffer);
    CharBuffer cbuf = decoder.decode(byteBuffer);
    System.out.println(cbuf);  //输出123
} catch (CharacterCodingException e) {
    e.printStackTrace();
}  
```
在创建Reader/Writer子类实例的时候，总是应该使用两个参数的构造方法，即显式指定使用的字符集或编码解码器。如果不显式指定，使用的是JVM的默认字符集，有可能在其它平台上产生错误。

#### Java中的目录
**创建目录：**
File类中有两个方法可以用来创建文件夹：

- mkdir( )方法创建一个文件夹，成功则返回true，失败则返回false。失败表明File对象指定的路径已经存在，或者由于整个路径还不存在，该文件夹不能被创建。
- mkdirs()方法创建一个文件夹和它的所有父文件夹。
```java
String dirname = "/tmp/user/java/bin";
File d = new File(dirname);
// 现在创建目录
d.mkdirs();
```
**读取目录**
一个目录其实就是一个File对象，它包含其他文件和文件夹。
如果创建一个File对象并且它是一个目录，那么调用isDirectory( )方法会返回true。
可以通过调用该对象上的list()方法，来提取它包含的文件和文件夹的列表。
```java
String dirname = "/tmp";
      File f1 = new File(dirname);
      if (f1.isDirectory()) {
         System.out.println( "Directory of " + dirname);
         String s[] = f1.list();
         for (int i=0; i < s.length; i++) {
            File f = new File(dirname + "/" + s[i]);
            if (f.isDirectory()) {
               System.out.println(s[i] + " is a directory");
            } else {
               System.out.println(s[i] + " is a file");
            }
         }
      } else {
         System.out.println(dirname + " is not a directory");
    }
```

#### 通道
通道作为NIO中的核心概念，在设计上比之前的流要好不少。通道相关的很多实现都是接口而不是抽象类。通道本身的抽象层次也更加合理。通道表示的是对支持I/O操作的实体的一个连接。一旦通道被打开之后，就可以执行读取和写入操作，而不需要像流那样由输入流或输出流来分别进行处理。与流相比，通道的操作使用的是Buffer而不是数组，使用更加方便灵活。通道的引入提升了I/O操作的灵活性和性能，主要体现在文件操作和网络操作上。

#### 文件通道
对文件操作方面，文件通道FileChannel提供了与其它通道之间高效传输数据的能力，比传统的基于流和字节数组作为缓冲区的做法，要来得简单和快速。比如下面的把一个网页的内容保存到本地文件的实现。
```java
FileOutputStream output = new FileOutputStream("baidu.txt");
FileChannel channel = output.getChannel();
URL url = new URL("http://www.baidu.com");
InputStream input = url.openStream();
ReadableByteChannel readChannel = Channels.newChannel(input);
channel.transferFrom(readChannel, 0, Integer.MAX_VALUE);   
```
文件通道的另外一个功能是对文件的部分片段进行加锁。当在一个文件上的某个片段加上了排它锁之后，其它进程必须等待这个锁释放之后，才能访问该文件的这个片段。文件通道上的锁是由JVM所持有的，因此适合于与其它应用程序协同时使用。比如当多个应用程序共享某个配置文件的时候，如果Java程序需要更新此文件，则可以首先获取该文件上的一个排它锁，接着进行更新操作，再释放锁即可。这样可以保证文件更新过程中不会受到其它程序的影响。

另外一个在性能方面有很大提升的功能是内存映射文件的支持。通过FileChannel的map方法可以创建出一个MappedByteBuffer对象，对这个缓冲区的操作都会直接反映到文件内容上。这点尤其适合对大文件进行读写操作。

