## Mybatis @Param

```
org.apache.ibatis.binding.BindingException: Parameter 'ids' not found.
Available parameters are [arg0, collection, list]
```

MyBatis 在执行批量删除 SQL 时，找不到 `ids` 这个参数。

### 问题原因

 `Mapper` 方法是这样写的：

```java
int deleteByIds(List<Integer> ids);
```

但在对应的 Mapper XML 里用了：

```xml
<delete id="deleteByIds">
    delete from emp where id in
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

这里的问题就是：

- MyBatis 默认不会把参数名识别成 `ids`，而是统一命名为 `arg0`、`arg1` 或 `list`、`collection`。
- 所以你在 XML 里写 `collection="ids"`，它根本找不到。

### 解决方案

✅ 方法一：在参数上加 `@Param` 注解（推荐）

```java
int deleteByIds(@Param("ids") List<Integer> ids);
```

XML：

```xml
<delete id="deleteByIds">
    delete from emp where id in
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

✅ 方法二：不加 `@Param`，直接用 `list` 或 `collection`

```xml
<delete id="deleteByIds">
    delete from emp where id in
    <foreach collection="list" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

### 总结

报错就是因为 **方法参数名和 XML 里的** **`collection`** **名字不对应**。

- 如果你想写成 `ids`，必须在接口参数里加 `@Param("ids")`。
- 如果懒得写注解，XML 就改用 `list` 或 `collection`。

---