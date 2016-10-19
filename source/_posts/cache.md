---
title: Web缓存概述（一）
date: 2016-05-31 22:14:20
categories: 技术
tags: 缓存
---

#### 什么是缓存？
&emsp;&emsp;Web缓存是指一个Web资源（如html页面，图片，js，数据等）存在于Web服务器和客户端（浏览器）之间的副本。缓存会根据进来的请求保存输出内容的副本；当下一个请求来到的时候，如果是相同的URL，缓存会根据缓存机制决定是直接使用副本响应访问请求，还是向源服务器再次发送请求。比较常见的就是浏览器会缓存访问过网站的网页，当再次访问这个URL地址的时候，如果网页没有更新，就不会再次下载网页，而是直接使用本地缓存的网页。只有当网站明确标识资源已经更新，浏览器才会再次下载网页。

#### Web缓存的作用
**减少网络带宽消耗**
&emsp;&emsp;无论对于网站运营者还是用户，带宽都代表着金钱，过多的带宽消耗，只会便宜了网络运营商。当Web缓存副本被使用时，只会产生极小的网络流量，可以有效的降低运营成本。
**降低服务器压力**
&emsp;&emsp;给网络资源设定有效期之后，用户可以重复使用本地的缓存，减少对源服务器的请求，间接降低服务器的压力。同时，搜索引擎的爬虫机器人也能根据过期机制降低爬取的频率，也能有效降低服务器的压力。
**减少网络延迟，加快页面打开速度**
&emsp;&emsp;带宽对于个人网站运营者来说是十分重要，而对于大型的互联网公司来说，可能有时因为钱多而真的不在乎。那Web缓存还有作用吗？答案是肯定的，对于最终用户，缓存的使用能够明显加快页面打开速度，达到更好的体验。

#### Web缓存的类型
**浏览器端缓存**
&emsp;&emsp;浏览器会在你的硬盘上专门开辟一个空间专门为你存储资源副本。浏览器缓存的工作规则很简单：检查以确保副本是最新的，通常只要一次会话（就是当前浏览器调用的这次）。
&emsp;&emsp;浏览器缓存在用户触发“后退”操作或点击一个之前看过的链接的时候很管用。同样，如果你在网站上访问同一张图片，该图片可以从浏览器缓存中调出并几乎立即显现出来。

**服务器端缓存**

&emsp;&emsp;***代理服务器缓存***
&emsp;&emsp;代理服务器是浏览器和源服务器之间的中间服务器，浏览器先向这个中间服务器发起Web请求，经过处理后（比如权限验证，缓存匹配等），再将请求转发到源服务器。代理服务器缓存的运作原理跟浏览器的运作原理差不多，只是规模更大。可以把它理解为一个共享缓存，不只为一个用户服务，一般为大量用户提供服务，因此在减少相应时间和带宽使用方面很有效，同一个副本会被重用多次。常见代理服务器缓存解决方案有[Squid](http://www.squid-cache.org/ "squid")等，这里不再详述。

&emsp;&emsp;***CDN缓存***
&emsp;&emsp;CDN（Content delivery networks）缓存，也叫网关缓存、反向代理缓存。浏览器先向CDN网关发起Web请求，网关服务器后面对应着一台或多台负载均衡源服务器，会根据它们的负载请求，动态将请求转发到合适的源服务器上。虽然这种架构负载均衡源服务器之间的缓存没法共享，但却拥有更好的可扩展性。从浏览器角度来看，整个CDN就是一个源服务器，从这个层面来说，本文讨论浏览器和服务器之间的缓存机制，在这种架构下同样适用。

**应用层缓存**
- 缓存数据库的查询结果,减少数据库的压力。这个在大型网站是必须做的；
- 缓存磁盘文件的数据。比如常用的数据可以放到内存，不用每次都去读取磁盘，特别是密集计算的程序，比如中文分词的词库；
- 缓存某个耗时的计算操作，比如数据统计；
- 缓存频繁写入的数据（需要写到数据库），比如页面点击量操作可以暂时利用缓存，然后定期的写到数据库；

应用层缓存的架构也可以分几种：
- 嵌入式，也就是缓存和应用在同一个机器。比如单机的文件缓存，java中用hashMap来缓存数据等等。这种缓存速度快，没有网络消耗。
- 分布式缓存，把缓存的数据独立到不同的机器，通过网络来请求数据，比如常用的memcache就是这一类。

分布式缓存一般可以分为几种:
- 按应用切分数据到不同的缓存服务器，这是一种比较简单和实用的方式。
- 按照某种规则（hash,路由等等）把数据存储到不同的缓存服务器。
- 代理模式，应用在获取数据的时候都由代理透明的处理，缓存机制有代理服务器来处理。

通过代码的方式，在web服务器返回的响应中添加Expires和Cache-Control Header

```java
java.util.Date date = new java.util.Date();    
response.setDateHeader("Expires",date.getTime()+20000); //Expires:过时期限值 
response.setHeader("Cache-Control", "public"); //Cache-Control来控制页面的缓存与否,public:浏览器和缓存服务器都可以缓存页面信息；
response.setHeader("Pragma", "Pragma"); //Pragma:设置页面是否缓存，为Pragma则缓存，no-cache则不缓存

response.setHeader( "Pragma", "no-cache" );   
response.setDateHeader("Expires", 0);   
response.addHeader( "Cache-Control", "no-cache" );//浏览器和缓存服务器都不应该缓存页面信息
```
&emsp;&emsp;当然还可以通过配置web服务器的方式，让web服务器在响应资源的时候统一添加Expires和Cache-Control Header，比如tomcat提供的[ExpiresFilter](http://tomcat.apache.org/tomcat-7.0-doc/config/filter.html#Expires_Filter)。
**数据库端缓存**
&emsp;&emsp;这个可以用以“空间换时间”来说。比如建一个表来存储耗时的数据统计结果，在每次更新数据的时候同时更新基本数据表和统计结果的表。

#### 缓存规则和运用
**浏览器端的缓存规则**
&emsp;&emsp;对于浏览器端来讲，这些规则是在HTTP协议头和HTML页面的Meta标签中定义的。他们分别从新鲜度和校验值两个维度来规定浏览器是否可以直接使用缓存中的副本。

- **新鲜度（过期机制）**
  也就是缓存副本的有效期。一个缓存副本如果满足以下条件之一，浏览器就会认为它是有效的，足够新的：
1. 含有完整的过期时间控制头信息（HTTP协议报头），并且仍在有效期内；
2. 浏览器已经使用过这个缓存副本，并且在一个会话中已经检查过新鲜度；

- **校验值（验证机制）**：服务器返回资源的时候有时在控制头信息带上这个资源的实体标签Etag（Entity Tag），它可以用来作为浏览器再次请求过程的校验标识。如过发现校验标识不匹配，说明资源已经被修改或过期，浏览器需求重新获取资源内容。

**浏览器缓存的控制**
&emsp;&emsp;使用HTML Meta 标签

```html
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
```
&emsp;&emsp;上述代码的作用是告诉浏览器当前页面不被缓存，每次访问都需要去服务器拉取。使用上很简单，但只有部分浏览器可以支持，而且所有缓存代理服务器都不支持，因为代理不解析HTML内容本身。
&emsp;&emsp;可以通过这个页面测试你的浏览器是否支持：[Pragma No-Cache Test](http://www.procata.com/cachetest/tests/pragma/index.php) 。
**使用缓存有关的HTTP消息报头**
&emsp;&emsp;一个URI的完整HTTP协议交互过程是由HTTP请求和HTTP响应组成的。有关HTTP详细内容可参考《[Hypertext Transfer Protocol — HTTP/1.1](http://www.w3.org/Protocols/rfc2616/rfc2616.html)》、《[HTTP协议详解](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html)》等。
在HTTP请求和响应的消息报头中，常见的与缓存有关的消息报头有：
&emsp;&emsp;![](http://o6fmcea8z.bkt.clouddn.com/blog/image/http-header1.png)

**Cache-Control与Expires**
&emsp;&emsp;<font color="red">如果设了max-age就会覆盖expires</font>
&emsp;&emsp;Cache-Control与Expires的作用一致，都是指明当前资源的有效期，控制浏览器是直接从浏览器缓存取数据还是重新发请求到服务器取数据。只不过Cache-Control是http 1.1中为了弥补 Expires缺陷新加入的，所以可选择设置得更细致，如果同时设置的话，其优先级高于Expires。

**Last-Modified/ETag与Cache-Control/Expires**
&emsp;&emsp;配置Last-Modified/ETag的情况下，浏览器再次访问统一URI的资源，还是会发送请求到服务器询问文件是否已经修改，如果没有，服务器会只发送一个304回给浏览器，告诉浏览器直接从自己本地的缓存取数据；如果修改过那就整个数据重新发给浏览器；
- **Cache-control: public**表示缓存的版本可以被代理服务器或者其他中间服务器识别；
- **Cache-control: private**意味着这个文件对不同的用户是不同的。只有用户自己的浏览器能够进行缓存，公共的代理服务器不允许缓存；

&emsp;&emsp;Cache-Control/Expires则不同，如果检测到本地的缓存还是有效的时间范围内，浏览器直接使用本地副本，不会发送任何请求。两者一起使用时，Cache-Control/Expires的优先级要高于Last-Modified/ETag。即当本地副本根据Cache-Control/Expires发现还在有效期内时，则不会再次发送请求去服务器询问修改时间（Last-Modified）或实体标识（Etag）了。
&emsp;&emsp;一般情况下，使用Cache-Control/Expires会配合Last-Modified/ETag一起使用，因为即使服务器设置缓存时间, 当用户点击“刷新”按钮时，浏览器会忽略缓存继续向服务器发送请求，这时Last-Modified/ETag将能够很好利用304，从而减少响应开销。

**使用Expires HTTP头信息控制不过期**
&emsp;&emsp;Expires HTTP头是控制缓存的基本手段，Expires的中文意思是“有效期”，显然，就是告诉浏览器缓存的有效期。如果过期，缓存会检查源服务器以确定文件是否改变了。Expires头几乎每个缓存都支持。
&emsp;&emsp;大部分的服务器允许你以多种方式设置Expires响应头。通常，他们允许设置一个绝对过期时间，然后对比最后一次访问的时候或者最后一次文档修改的时候决定客户端内容的获取方式。
&emsp;&emsp;对于静态图片（如导航或按钮的图片）而言，Expires头信息是相当有用的，因为图片不怎么修改，您可以给图片设置一个相当长的过期时间，这回让你的用户感觉网站变快了。Expires对于控制有改变规律的网页也很有用，例如：你有一个新闻聚合页面，每天早上6点钟准时更新，您可以设置缓存的过期时间也是这个点，于是缓存就可以很聪明地知道什么时候该去重载新的内容，什么时候睡大觉。
&emsp;&emsp;Expires头唯一的有效值是HTTP时间，其他值都会被认为是“前男友前女友”之类，不会去缓存的。注意：时间是格林威治时间（GMT），而不是本地时间。如下所示：
>Expires: Fri, 30 Oct 1998 14:19:41 GMT

&emsp;&emsp;尽管Expires头很有用，但它有一定的局限性。首先，因为牵扯到时间，Web服务器端的时钟必须和缓存的同步，否则很可能实现不了预期的结果——缓存把前女友当初现女友，把现女友当作过去式——那就悲剧了。

**Last-Modified与ETag**
&emsp;&emsp;你可能会觉得使用Last-Modified已经足以让浏览器知道本地的缓存副本是否足够新，为什么还需要Etag（实体标识）呢？HTTP1.1中Etag的出现主要是为了解决几个Last-Modified比较难解决的问题：
- Last-Modified标注的最后修改只能精确到秒级，如果某些文件在1秒钟以内，被修改多次的话，它将不能准确标注文件的新鲜度；
- 如果某些文件会被定期生成，当有时内容并没有任何变化，但Last-Modified却改变了，导致文件没法使用缓存；
- 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形；

&emsp;&emsp;Etag是服务器自动生成或者由开发者生成的对应资源在服务器端的唯一标识符，能够更加准确的控制缓存。Last-Modified与ETag是可以一起使用的，服务器会优先验证ETag，一致的情况下，才会继续比对Last-Modified，最后才决定是否返回304。Etag的服务器生成规则和强弱Etag的相关内容可以参考，《[互动百科-Etag](http://www.hudong.com/wiki/Etag)》和《[HTTP Header definition](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html)》，这里不再深入。

**用户操作行为与缓存**
&emsp;&emsp;用户在使用浏览器的时候，会有各种操作，比如输入地址后回车，按F5刷新等，这些行为会对缓存有什么影响呢？
&emsp;&emsp;![](http://o6fmcea8z.bkt.clouddn.com/blog/image/user-action2.png)
&emsp;&emsp;通过上表我们可以看到，当用户在按F5进行刷新的时候，会忽略Expires/Cache-Control的设置，会再次发送请求去服务器请求，而Last-Modified/Etag还是有效的，服务器会根据情况判断返回304还是200；而当用户使用Ctrl+F5进行强制刷新的时候，只是所有的缓存机制都将失效，重新从服务器拉去资源。
&emsp;&emsp;相关有趣的分享：
&emsp;&emsp;《[浏览器缓存机制](http://www.laruence.com/2010/03/05/1332.html)》：不同浏览器对用户操作行为处理比较
&emsp;&emsp;《[HTTP 304客户端缓存优化的神奇作用和用法](http://spyrise.org/blog/http-304-not-modified-header-setting-optimize/)》：强行在代码层面比对文件的Last-Modified时间，保证用户使用Ctrl+F5进行刷新的时候也能正常返回304

**数据库端**
- 利用普通表或内存表来缓存一些统计数据。


**应用层端**
&emsp;&emsp;比较常见的应用层分布式缓存容器，Memcache、共享文件服务器、MemcacheDb、Tokyo Tyrant。java实现的缓存也比较多，比如oscache,jcache ,ehcached等等。

**前端**
&emsp;&emsp;前端比较常用的就是squid,Varnish Cache,ncache等等。

**哪些请求不能被缓存？**

无法被浏览器缓存的请求：
- HTTP信息头中包含Cache-Control:no-cache，pragma:no-cache，或Cache-Control:max-age=0等告诉浏览器不用缓存的请求；
- 需要根据Cookie，认证信息等决定输入内容的动态请求是不能被缓存的；
- 经过HTTPS安全加密的请求（有人也经过测试发现，ie其实在头部加入Cache-Control：max-age信息，firefox在头部加入Cache-Control:Public之后，能够对HTTPS的资源进行缓存，参考《[HTTPS的七个误解](http://www.ruanyifeng.com/blog/2011/02/seven_myths_about_https.html)》）；
- POST请求无法被缓存；
- HTTP响应头中不包含Last-Modified/Etag，也不包含Cache-Control/Expires的请求无法被缓存；

#### 构建可缓存的网络站点
- 同一个资源保证URL的稳定性；
- 万不得已不要变动文件：否则你要设置一个新的Last-Modified值。另外，当你更新站点的时候，只要上传改动的那些文件，而不要把整个站点都覆盖过去;
- 不同地方的图片和其他元素使用同一库，推荐使用公共CDN库，比如[BootCDN](http://www.bootcdn.cn/)等，有利于最大限度使用缓存；
- 对于不经常改变的图片/页面，将Cache-Control: max-age头信息的值设大一点，<font color="red">而对于html页面这种入口文件，不建议设置缓存</font>。这样既能保证在静态资源不变了情况下，可以不重发请求或直接通过304避免重复下载，又能保证在资源有更新的，只要通过给资源增加时间戳或者更换路径，就能让用户访问最新的资源；
- 如果资源改变了（尤其下载文件），改变其名字。由于一般这种资源会有很长的过期时间，而服务器上一直是正确的版本；因此，链接这个下载资源的页面需要要比较短的过期时间。否则，会出现服务器的资源是新的，但页面被缓存了，其中的链接地址还是旧的，就会出现新旧版本冲突的可能；
- Cookie能不用就不用：Cookie难以被缓存，且大多情境下是没有必要的。过多的使用Cookie会大大增加HTTP请求的负担，每次GET或POST请求，都会把Cookie都带上，增加网络传输流量，导致增长交互时间；如果你非得使用Cookie，建议只用在动态页面上;
- 减少HTTPS、SSL的使用：因为共享缓存不能存储认证页面，只在必要的时候使用，并且在SSL页面上减少图片的使用；
- 多用Get方式请求动态资源。虽然POST的请求方式比Get更安全，可以避免类似密码这种敏感信息在网络传输，被代理或其他人截获，但是Get请求方式更快，效率更高，而且能被缓存，建议对于那些不涉及敏感信息提交的请求尽量使用Get方式请求；
- 使用REDbot检查你的网站：可以帮助你应用本文所介绍的一些概念。
> REDbot：REDbot = RED + robot，是个机器人，检查HTTP资源，看他们如何会表现，指出常见的问题，并提出改进建议。虽然它属于HTTP一致性测试仪，但却可以找到不少HTTP相关问题。