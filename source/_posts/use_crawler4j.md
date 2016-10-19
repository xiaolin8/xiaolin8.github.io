---
title: 记一次开源爬虫crawler4j的应用
date: 2016-04-24 22:17
categories:
- 技术
tags: 爬虫
---

crawler4j是一个开源的Java爬虫框架，通过使用其简单的接口就可以实现网站资源的多线程爬取。

<!--more-->

使用起来非常简单：

只需要在Java项目的pom文件中添加以下片段即可：


```xml

    <dependency>
        <groupId>edu.uci.ics</groupId>
        <artifactId>crawler4j</artifactId>
        <version>4.2</version>
    </dependency>
    
```

以下是我使用crawler4j爬取我[石油软件班](http://www.petrosoftware-class.com "石油软件班")历届帅哥美女们头像的例子：

```java
    String rootFolder = "d:/data2";//设置初始化目录
    int numberOfCrawlers = 8;//设置爬虫的数量
    String storageFolder = "d:/data2/img2";//设置图片的存储路径

    CrawlConfig config = new CrawlConfig();

    config.setCrawlStorageFolder(rootFolder);
    
    config.setPolitenessDelay(1000);//设置每次爬取时间间隔
    /*
     * Since images are binary content, we need to set this parameter to
     * true to make sure they are included in the crawl.
     */
    config.setIncludeBinaryContentInCrawling(true);
    
    config.setUserAgentString("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0");
    //https://www.zhihu.com/question/28521492
    
    //http://www.petrosoftware-class.com/
    String[] crawlDomains = {"http://www.petrosoftware-class.com/"};

    PageFetcher pageFetcher = new PageFetcher(config);
    RobotstxtConfig robotstxtConfig = new RobotstxtConfig();
    RobotstxtServer robotstxtServer = new RobotstxtServer(robotstxtConfig, pageFetcher);
    CrawlController controller = new CrawlController(config, pageFetcher, robotstxtServer);
    for (String domain : crawlDomains) {
      controller.addSeed(domain);
    }

    ImageCrawler.configure(crawlDomains, storageFolder);

    controller.start(ImageCrawler.class, numberOfCrawlers);
```

![classmates.jpg](http://o6fmcea8z.bkt.clouddn.com/blog/image/classmates.jpg)


### 爬虫的原理
1）首先你要明白爬虫怎样工作

想象你是一只蜘蛛，现在你被放到了互联“网”上。那么，你需要把所有的网页都看一遍。怎么办呢？没问题呀，你就随便从某个地方开始，比如说人民日报的首页，这个叫initial pages，用$表示吧。

在人民日报的首页，你看到那个页面引向的各种链接。于是你很开心地从爬到了“国内新闻”那个页面。太好了，这样你就已经爬完了俩页面（首页和国内新闻）！暂且不用管爬下来的页面怎么处理的，你就想象你把这个页面完完整整抄成了个html放到了你身上。

突然你发现， 在国内新闻这个页面上，有一个链接链回“首页”。作为一只聪明的蜘蛛，你肯定知道你不用爬回去的吧，因为你已经看过了啊。所以，你需要用你的脑子，存下你已经看过的页面地址。这样，每次看到一个可能需要爬的新链接，你就先查查你脑子里是不是已经去过这个页面地址。如果去过，那就别去了。

好的，理论上如果所有的页面可以从initial page达到的话，那么可以证明你一定可以爬完所有的网页。

2）效率
如果你就这样爬的话，你会发现要爬的网页实在太多了。设想全网有N个网站，那么分析一下判重的复杂度就是N*log(N)，因为所有网页要遍历一次，而每次判重用set的话需要log(N)的复杂度。通常的判重做法是怎样呢？Bloom Filter. 简单讲它仍然是一种hash的方法，但是它的特点是，它可以使用固定的内存（不随url的数量而增长）以O(1)的效率判定url是否已经在set中。可惜天下没有白吃的午餐，它的唯一问题在于，如果这个url不在set中，BF可以100%确定这个url没有看过。但是如果这个url在set中，它会告诉你：这个url应该已经出现过，不过我有2%的不确定性。注意这里的不确定性在你分配的内存足够大的时候，可以变得很小很少。一个简单的教程:[Bloom Filters by Example](http%3A//billmill.org/bloomfilter-tutorial/ "Bloom Filters by Example")好，现在已经接近处理判重最快的方法了。另外一个瓶颈——你只有一台机器。不管你的带宽有多大，只要你的机器下载网页的速度是瓶颈的话，那么你只有加快这个速度。用一台机子不够的话——用很多台吧！当然，我们假设每台机子都已经进了最大的效率——使用多线程.

3）集群化抓取

据统计2013年豆瓣的page量已经达到了几百万个，如果用100多台机器昼夜不停地运行，那么需要一个月时间左右才能爬完。想象如果只用一台机子你就得运行100个月了...

那么，假设你现在有100台机器可以用，怎么实现一个分布式的爬取算法呢？

我们把这100台中的99台运算能力较小的机器叫作slave，另外一台较大的机器叫作master，那么回顾上面代码中的url_queue，如果我们能把这个queue放到这台master机器上，所有的slave都可以通过网络跟master联通，每当一个slave完成下载一个网页，就向master请求一个新的网页来抓取。而每次slave新抓到一个网页，就把这个网页上所有的链接送到master的queue里去。同样，bloom filter也放到master上，但是现在master只发送确定没有被访问过的url给slave。Bloom Filter放到master的内存里，而被访问过的url放到运行在master上的Redis里，这样保证所有操作都是O(1)。（至少平摊是O(1)，Redis的访问效率见:[LINSERT – Redis](http%3A//redis.io/commands/linsert "LINSERT – Redis")

4）展望及后续处理

虽然上面用很多“简单”，但是真正要实现一个商业规模可用的爬虫并不是一件容易的事。上面的代码用来爬一个整体的网站几乎没有太大的问题。

但是如果附加上你需要这些后续处理，比如

有效地存储（数据库应该怎样安排）

有效地判重（这里指网页判重，咱可不想把人民日报和抄袭它的大民日报都爬一遍）

有效地信息抽取（比如怎么样抽取出网页上所有的地址抽取出来，“朝阳区奋进路中华道”），搜索引擎通常不需要存储所有的信息，比如图片我存来干嘛...

及时更新（预测这个网页多久会更新一次）

如你所想，这里每一个点都可以供很多研究者十数年的研究。虽然如此，
“路漫漫其修远兮,吾将上下而求索”。
