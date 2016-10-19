---
title: 数据库优化经验总结
date: 2016-04-30 10:14:29
categories:
- 技术
tags: 数据库
---



- **首先应考虑在 where 及 order by 涉及的列上建立索引以尽量避免全表扫描**。

- **应尽量避免在 where 子句中对字段进行 null 值判断**，否则将导致引擎放弃使用索引而进行全表扫描，如：

```sql
select id from t where num is null
```

&emsp;&emsp;最好不要给数据库留NULL，尽可能的使用 NOT NULL填充数据库。备注、描述、评论之类的可以设置为 NULL，其他的，最好不要使用NULL。不要以为 NULL 不需要空间，比如：char(100) 型，在字段建立时，空间就固定了， 不管是否插入值（NULL也包含在内），都是占用 100个字符的空间的，当然如果是varchar这样的变长字段，null 不占用空间。
&emsp;&emsp;可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：

```sql
select id from t where num = 0
```

- **应尽量避免在 where 子句中使用 != 或 <> 操作符**，否则查询引擎将放弃使用索引而进行全表扫描。



- **应尽量避免在 where 子句中使用 or 来连接条件，可以用union替代**，如果一个字段有索引，一个字段没有索引，将导致引擎放弃使用索引而进行全表扫描，如：

```sql
select id from t where num=10 or Name = 'admin'
```

可以这样查询：

```sql
select id from t where num = 10
union all
select id from t where Name = 'admin'
```

- **in 和 not in 也要慎用**，否则会导致全表扫描，如：

```sql
select id from t where num in(1,2,3)
```

- **对于连续的数值，能用 between 就不要用 in 了**：

```sql
select id from t where num between 1 and 3
```

- **很多时候用 exists 代替 in 是一个好的选择**：

```sql
select num from a where num in(select num from b)
```

可以用下面的语句替换：

```sql
select num from a where exists(select 1 from b where num=a.num)
```


- **尽可能地用全文检索替代Like模糊查询，以避免低效的全表扫描**：

```sql
select id from t where name like '%abc%'
```

- **如果在 where 子句中使用参数，也会导致全表扫描**。因为SQL只有在运行时才会解析局部变量，但优化程序不能将访问计划的选择推迟到运行时；它必须在编译时进行选择。然而，如果在编译时建立访问计划，变量的值还是未知的，因而无法作为索引选择的输入项。如下面语句将进行全表扫描：

```sql
select id from t where num = @num
```

可以改为强制查询使用索引：

```sql
select id from t with(index(索引名)) where num = @num
```

- **应尽量避免在where子句中对字段进行函数、算数运算或表达式操作**，否则系统将可能无法正确使用索引而进行全表扫描。如：

```sql
select id from t where num/2 = 100
select id from t where substring(name,1,3) = 'abc'       -–name以abc开头的id
select id from t where datediff(day,createdate,'2005-11-30') = 0
```

应改为:

```sql
select id from t where name like 'abc%'
select id from t where createdate >= '2005-11-30' and createdate < '2005-12-1'
```

- 根据**索引的前缀匹配原则**，在使用索引字段作为条件时，如果该索引是复合索引，那么必须使用到该索引中的第一个字段作为条件时才能保证系统使用该索引，否则该索引将不会被使用，并且应尽可能的让字段顺序与索引顺序相一致。

- **Update语句，如果只更改1、2个字段，不要Update全部字段**，否则频繁调用会引起明显的性能消耗，同时带来大量日志。

- 对于多张大数据量（这里几百条就算大了）的表JOIN，要**先分页再JOIN**，否则逻辑读会很高，性能很差。

- select count(\*) from table；这样**不带任何条件的count会引起全表扫描**，并且没有任何业务意义，是一定要杜绝的。

- **索引并不是越多越好**，索引固然可以提高相应的 select 的效率，但同时也降低了 insert 及 update 的效率，因为 insert 或 update 时有可能会重建索引，所以怎样建索引需要慎重考虑，视具体情况而定。一个表的索引数最好不要超过6个，若太多则应考虑一些不常使用到的列上建的索引是否有必要。

- **应尽可能的避免更新 clustered 索引数据列**，因为 clustered 索引数据列的顺序就是表记录的物理存储顺序，一旦该列值改变将导致整个表记录的顺序的调整，会耗费相当大的资源。若应用系统需要频繁更新 clustered 索引数据列，那么需要考虑是否应将该索引建为 clustered 索引。

- **尽量使用数字型字段，若只含数值信息的字段尽量不要设计为字符型，这会降低查询和连接的性能，并会增加存储开销**。这是因为引擎在处理查询和连 接时会逐个比较字符串中每一个字符，而对于数字型而言只需要比较一次就够了。

- **尽可能的使用 varchar/nvarchar 代替 char/nchar **，因为首先变长字段存储空间小，可以节省存储空间，其次对于查询来说，在一个相对较小的字段内搜索效率显然要高些。

- **任何地方都不要使用 select \* from t ，用具体的字段列表代替\***，不要返回用不到的任何字段。

- **拆分大的 DELETE 或INSERT 语句，批量提交SQL语句**。如果你需要在一个在线的网站上去执行一个大的DELETE或INSERT查询，你需要非常小心，要避免你的操作让你的整个网站停止响应。因为这两个操作是会锁表的，表一锁住了，别的操作都进不来了。如果你把你的表锁上一段时间，比如30秒钟，那么对于一个有很高访问量的站点来说，这30秒所积累的访问进程/线程，数据库链接，打开的文件数，可能不仅仅会让你的WEB服务崩溃，还可能会让你的整台服务器马上挂了。所以，如果你有一个很瞬间很大的处理请求，你一定把其拆分。（建议使用消息队列）

```sql
delete from logs where log_date <= ’2012-11-01’ limit 1000  -- 每次只删除1000条
```