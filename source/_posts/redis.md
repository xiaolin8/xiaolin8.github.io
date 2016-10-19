---
title: 使用redis
date: 2016-07-17 16:10:42
categories: 技术
tags: redis
---
#### Redis 介绍
Redis(REmote DIctionary Server)

开源（C语言）、Key-Value数据库

- Redis支持数据的持久化，可以将内存中的数据保持在磁盘中，重启的时候可以再次加载进行使用。
- 它通常被称为**数据结构服务器**，因为值（value）可以是 字符串(String), 哈希(Map), 列表(list), 集合(sets) 和 有序集合(sorted sets)等类型。

#### Redis 优势
- 性能极高 – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作。
- 原子 – Redis的所有操作都是原子性的，同时Redis还支持对几个操作全并后的原子性执行。
- 丰富的特性 – Redis还支持 publish/subscribe, 通知, key 过期等等特性。

#### Why Key-Value?
  当网站数据量极大时，需要进行数据库的扩展。有2种方式：一种是仍然采用RDBMS，然后通过对数据库的垂直或水平切割将数据库部署到一个集群上，由于应用的不同，切割的方法也是不同的。另一种方式就是抛弃RDBMS而使用NoSQL。这样可极其方便地增强系统的可扩展性。如果要处理的数据量持续增大，多增加机器就可以了。也可以支持数量更多的并发查询。
#### Redis 连接

```
$ redis-cli -h host -p port -a password
```

#### String类型及操作
string类型是Redis最基本的数据类型，它是二进制安全的。

#### hash类型及操作
Redis hash 是一个string类型的field和value的映射表，hash特别适合用于存储对象。

- Set集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。
- 