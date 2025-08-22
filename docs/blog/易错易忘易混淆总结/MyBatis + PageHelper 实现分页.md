## MyBatis + PageHelper 实现分页

---

### 1️⃣ 关键依赖

分页的核心是 **PageHelper**，需要在 `pom.xml` 中引入：

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.4.0</version>
</dependency>
```

---

### 2️⃣ 分页流程解析

```java
PageHelper.startPage(queryParam.getPage(), queryParam.getPageSize());
```

- `PageHelper.startPage(page, pageSize)` 会 **拦截**紧接着执行的 MyBatis 查询。
- 它会在 SQL 上动态添加 `LIMIT` 或者数据库对应的分页语法，比如：

```sql
SELECT * FROM clazz WHERE name = ? LIMIT 0, 10
```

- 原理：

  - PageHelper 会在查询前创建一个 **ThreadLocal** 变量存放分页信息。
  - 当 MyBatis 执行 SQL 时，PageHelper 的拦截器会读取这个信息，并修改 SQL。

---

```java
Page<Clazz> page = (Page<Clazz>) clazzMapper.page(queryParam);
```

- `clazzMapper.page(queryParam)` 是你的 Mapper 查询方法。
- 返回类型通常是 `List<Clazz>`，但 PageHelper 会把它 **包装成 Page 对象**，Page 实现了 List，同时多了分页信息（总记录数、总页数等）。

---

```java
PageResult<Clazz> pageResult = new PageResult<>();
pageResult.setTotal(page.getTotal());
pageResult.setRows(page.getResult());
```

- `PageResult` 是你自定义的分页结果对象。
- `page.getTotal()` → 总记录数
- `page.getResult()` → 当前页的数据列表

最终返回给前端的 JSON 就是标准的分页结构：

```json
{
  "total": 120,
  "rows": [
    { "id": 1, "name": "班级1" },
    { "id": 2, "name": "班级2" }
  ]
}
```

---

### 3️⃣ 总结原理

1. 调用 `PageHelper.startPage()` 设置分页参数（页码和每页大小）。
2. 执行 Mapper 查询时，PageHelper 拦截 SQL，加上分页语法。
3. 查询结果被 PageHelper 包装成 `Page` 对象，包含数据和分页信息。
4. 封装成自定义 `PageResult` 返回前端。

```java
//调用 PageHelper.startPage() 设置分页参数（页码和每页大小）。
PageHelper.startPage(queryParam.getPage(), queryParam.getPageSize());
//执行 Mapper 查询时，PageHelper 拦截 SQL，加上分页语法。
//查询结果被 PageHelper 包装成 Page 对象，包含数据和分页信息。
Page<Clazz> page = (Page<Clazz>) clazzMapper.page(queryParam);
//封装成自定义 PageResult 返回前端。
PageResult<Clazz> pageResult = new PageResult<>();
pageResult.setTotal(page.getTotal());
pageResult.setRows(page.getResult());
```

---

💡 **注意事项**

- `startPage` 必须在 Mapper 查询 **之前**调用。
- Mapper 返回值可以是 `List<T>`，PageHelper 会自动转换为 `Page<T>`。
- 如果你的查询涉及 `count(*)`，PageHelper 会自动帮你统计总记录数。

---

## Page类--**List** 的子类，又封装了分页信息

---

### 1️⃣ `Page` 的基本概念

- `Page<T>` 实现了 `List<T>` 接口，所以它本质上就是一个 **列表**，可以像普通 List 一样迭代、取值。
- 除了存放数据，它还额外记录了 **分页信息**，包括：

  - 总记录数 `total`
  - 当前页码 `pageNum`
  - 每页大小 `pageSize`
  - 总页数 `pages`
  - 当前页数据 `result`（其实就是 List 自身）

---

### 2️⃣ Page 类结构（简化版）

```java
public class Page<T> extends ArrayList<T> {
    private long total;      // 总记录数
    private int pageNum;     // 当前页码
    private int pageSize;    // 每页显示条数
    private int pages;       // 总页数
    private List<T> result;  // 当前页数据（通常就是 this）

    // getter / setter
}
```

> 实际 PageHelper 的 Page 类比这个更复杂，还支持排序、导航页码等。

---

### 3️⃣ 为什么 Page 可以直接用

因为 `Page` 继承自 `ArrayList<T>`，所以：

```java
Page<Clazz> page = (Page<Clazz>) clazzMapper.page(queryParam);
for (Clazz c : page) {
    System.out.println(c.getName());
}
```

就像操作普通 List 一样操作分页结果，同时还能获取总记录数：

```java
long total = page.getTotal();
```

---

### 4️⃣ Page 与 PageResult 的关系

通常我们不直接把 Page 返回给前端，而是封装成统一的分页对象：

```java
PageResult<Clazz> pageResult = new PageResult<>();
pageResult.setTotal(page.getTotal());   // 总记录数
pageResult.setRows(page.getResult());   // 当前页数据
```

这样前端 JSON 就标准化了：

```json
{
  "total": 100,
  "rows": [ { "id": 1, "name": "A班" }, { "id": 2, "name": "B班" } ]
}
```

---

💡 **总结**

- `Page` \= List + 分页信息
- MyBatis 查询结果被 PageHelper 包装成 Page
- Page 提供总数、页码等信息，方便后端封装分页结果

---