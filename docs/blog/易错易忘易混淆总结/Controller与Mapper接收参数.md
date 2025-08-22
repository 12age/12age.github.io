## [Controller] 层接收请求参数的几种方式和常用注解

### 1️⃣ `@RequestParam` — 接收 Query 参数或表单参数

- **用法**：绑定 URL 查询参数或表单参数到方法参数。
- **典型场景**：

  - GET 请求：`/dept?id=1`
  - POST 表单：`id=1&name=xxx`
- **示例**：

```java
@GetMapping("/dept")
public Dept getDept(@RequestParam("id") Integer id,
                    @RequestParam(name = "name", required = false) String name) {
    // id 必需，name 可选
    return deptService.findById(id);
}
```

- **说明**：

  - `value` 或 `name`：绑定请求参数名
  - `required`：是否必填，默认 true
  - `defaultValue`：默认值

---

### 2️⃣ `@PathVariable` — 接收路径参数

- **用法**：绑定 URL 路径中的变量到方法参数
- **典型场景**：

  - RESTful 风格：`/dept/10`
- **示例**：

```java
@GetMapping("/dept/{id}")
public Dept getDept(@PathVariable("id") Integer id) {
    return deptService.findById(id);
}
```

- **说明**：

  - `@PathVariable("id")` 对应 `{id}` 占位符
  - 支持类型转换（如 String → Integer）

---

### 3️⃣ `@RequestBody` — 接收请求体 JSON / XML

- **用法**：将请求体内容自动反序列化成 Java 对象
- **典型场景**：

  - POST/PUT 请求，Content-Type: `application/json`
- **示例**：

```java
@PostMapping("/dept")
public Dept addDept(@RequestBody Dept dept) {
    // 前端发送 JSON: {"id":1,"name":"财务部"}
    return deptService.save(dept);
}
```

- **说明**：

  - 支持 JSON、XML 等
  - 接收复杂对象（DTO/VO）更方便

---

### 4️⃣ 自定义实体对象绑定

- **用法**：Spring 会自动把请求参数（Query 或表单）映射到对象属性
- **示例**：

```java
@GetMapping("/dept/search")
public List<Dept> searchDept(Dept dept) {
    // URL: /dept/search?id=1&name=财务部
    // 自动封装成 Dept 对象
    return deptService.search(dept);
}
```

- **说明**：

  - 属性名对应请求参数名即可
  - 不需要额外注解（但可加 `@ModelAttribute` 显式绑定）

---

### 5️⃣ 其他常用注解对比

| 注解 | 来源                                    | 功能                         | 典型用途                    |
| ------ | ----------------------------------------- | ------------------------------ | ----------------------------- |
| `@RequestParam`     | org.springframework.web.bind.annotation | 绑定请求参数（Query 或表单） | GET 查询、表单提交          |
| `@PathVariable`     | org.springframework.web.bind.annotation | 绑定 URL 路径变量            | RESTful 接口路径参数        |
| `@RequestBody`     | org.springframework.web.bind.annotation | 绑定请求体 JSON / XML        | POST/PUT 复杂对象           |
| `@ModelAttribute`     | org.springframework.web.bind.annotation | 绑定请求参数到对象属性       | GET/POST 请求参数封装到对象 |
| `@RequestHeader`     | org.springframework.web.bind.annotation | 绑定请求头                   | 获取 token、语言等信息      |
| `@CookieValue`     | org.springframework.web.bind.annotation | 绑定 Cookie                  | 获取登录信息或 sessionId    |

---

✅ **总结思路**：

1. **简单参数**（id, name, flag） → `@RequestParam` 或 `@PathVariable`
2. **复杂对象**（实体/DTO） → `@RequestBody`（JSON） 或 自动绑定（Query/表单）
3. **特殊来源** → `@RequestHeader` / `@CookieValue`

## [MyBatis]字段名和属性名不一致时的解决方案

### 使用XML配置

测试

好的 👍 我帮你把 **字段名和属性名不一致时的解决方案** 总结一下，分成三种常用方式：

---

#### 1. **SQL 起别名**（推荐简单场景）

- **原理**：在 SQL 查询里给列起别名，使其与 Java 属性名一致。
- **适用场景**：只有少数字段不一致，且是平铺的属性。
- **示例**：

  ```xml
  <select id="page" resultType="com.itheima.tliasmanage.pojo.Clazz">
      select c.id, c.name, e.name as masterName
      from clazz c left join emp e on c.master_id = e.id
  </select>
  ```

  → 结果列 `masterName` 会自动映射到 `Clazz.masterName`。

---

#### 2. **开启驼峰命名自动映射**

- **原理**：MyBatis 可以自动把下划线风格的列名（`user_name`）映射为驼峰风格的属性（`userName`）。
- **配置方式**：

  ```xml
  <settings>
      <setting name="mapUnderscoreToCamelCase" value="true"/>
  </settings>
  ```
- 在SpringBoot中

  `application.yaml`

  ```yml
  #mybatis
  mybatis:
    configuration:
      map-underscore-to-camel-case: true #开启驼峰
  ```

- **适用场景**：数据库字段统一是下划线命名，Java 属性统一是驼峰命名。
- **示例**：

  - 列：`begin_date`
  - 属性：`beginDate`
  - 无需别名或 `<resultMap>`，MyBatis 会自动映射。

---

#### 3. **使用**  **`<resultMap>`**  **手动指定映射**

- **原理**：通过 `<resultMap>` 明确配置 “列名 → 属性名” 的映射关系。
- **适用场景**：字段差异很多，或者涉及复杂映射（多表、一对一、一对多）。
- **示例**：

  ```xml
  <resultMap id="clazzMap" type="com.itheima.tliasmanage.pojo.Clazz">
      <id property="id" column="clazz_id"/>
      <result property="name" column="clazz_name"/>
      <result property="masterName" column="emp_name"/>
  </resultMap>

  <select id="page" resultMap="clazzMap">
      select c.clazz_id, c.clazz_name, e.name as emp_name
      from clazz c left join emp e on c.master_id = e.id
  </select>
  ```

---

#### ✅ 总结

- **简单场景（少数字段不一致）**  → 用 **SQL 别名**，最直观。
- **下划线 vs 驼峰** → 开启 **mapUnderscoreToCamelCase**。
- **复杂场景** → 用  **`<resultMap>`** ，灵活、可维护性高。

---

### 使用注解

要不要我帮你画一张 **决策流程图**（比如：字段不一致 → 少量？→ 起别名 / 启用驼峰 / 用 resultMap），这样你遇到问题能直接判断用哪种方式？

好问题 👍
除了 XML 里的 `<resultMap>`，MyBatis 也支持 **注解方式** 来解决字段名和属性名不一致的问题。

---

#### 方式一：用 `@Results` + `@Result` 注解

你可以在 Mapper 接口的方法上加注解，手动指定列名和属性名的对应关系。

```java
@Mapper
public interface ClazzMapper {

    @Select("""
        select c.id, c.name, e.name as emp_name
        from clazz c left join emp e on c.master_id = e.id
    """)
    @Results(id = "clazzMap", value = {
        @Result(column = "id", property = "id"),
        @Result(column = "name", property = "name"),
        @Result(column = "emp_name", property = "masterName")
    })
    List<Clazz> page();
}
```

- `@Result(column="数据库列名", property="Java属性名")`
- `@Results(id="xxx")` 可以给这个映射规则起名，在别的方法上用 `@ResultMap("xxx")` 复用。

---

##### 1️⃣ 为什么用三引号

你看到的三引号（`""" ... """`）其实不是 MyBatis 必须的，而是 **Java 15+ 的文本块（Text Block）语法**，用来写多行字符串，更方便阅读 SQL。

- Java 传统字符串写法：

```java
@Select("select c.id, c.name, e.name as emp_name " +
        "from clazz c " +
        "left join emp e on c.master_id = e.id")
List<Clazz> page();
```

- 当 SQL 很长或者有多行条件时，传统方式会出现很多 `+` 和 `\n`，不美观。
- Java 15+ 文本块写法：

```java
@Select("""
    select c.id, c.name, e.name as emp_name
    from clazz c
    left join emp e on c.master_id = e.id
    where c.name = #{name}
""")
List<Clazz> page();
```

- **优点**：

  1. 支持多行文本，无需 `+` 拼接。
  2. 保留 SQL 排版格式，更易读。
  3. 支持直接写带引号的字符串，不用额外转义。

##### 2️⃣ 注意事项

- 文本块语法要求 **Java 15 及以上**。
- 如果项目 Java 版本低于 15，就必须使用传统双引号拼接方式。

#### 方式二：用 SQL 起别名（搭配 `@Select`）

如果只是少量字段不一致，可以直接在 SQL 里起别名，就不需要写 `@Results` 了：

```java
@Mapper
public interface ClazzMapper {

    @Select("""
        select c.id, c.name, e.name as masterName
        from clazz c left join emp e on c.master_id = e.id
    """)
    List<Clazz> page();
}
```

这样 MyBatis 会直接把 `masterName` 映射到实体类的 `masterName` 属性。

---

#### 方式三：开启驼峰映射（全局设置）

在 `application.yml` 或 MyBatis 配置里开启：

```yaml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

这样：

- 数据库列 `begin_date`
- 会自动映射到 Java 属性 `beginDate`
  → 注解里就不用再写 `@Result`。

---

#### ✅ 总结

字段名和属性名不一致 → 注解解决方案有三种：

1. **少量不一致**：直接在 SQL 起别名。
2. **差异较多**：用 `@Results` + `@Result` 注解手动配置。
3. **统一风格（下划线 vs 驼峰）** ：开启 `map-underscore-to-camel-case`。

---