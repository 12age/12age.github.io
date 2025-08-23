## MyBatis 动态 SQL

---

### 📌 1. 为什么需要动态 SQL？

在实际开发中，查询条件、更新字段经常是 **可选的**。
如果不用动态 SQL，你要写很多 `if else` 拼接字符串，非常麻烦，还容易出错。
MyBatis 提供了动态 SQL 标签，让 SQL 能够根据条件自动拼接。

---

### 📌 2. 常见动态 SQL 标签

#### ① `<if>`

按条件拼接 SQL 片段。

```xml
<select id="listEmp" resultType="Emp">
    select * from emp
    where 1=1
    <if test="name != null and name != ''">
        and name like concat('%', #{name}, '%')
    </if>
    <if test="gender != null">
        and gender = #{gender}
    </if>
</select>
```

判断 `null 和''`只有字符串才能判断

其他是判断`null`

![image](https://raw.githubusercontent.com/12age/blog-img/main/image-20250823225426-dqr4e9x.png)

👉 `test` 表达式中用 **OGNL 表达式**（对象导航图语言）。

---

#### ② `<where>`

自动处理 `where` 子句，**避免手动写** **`where 1=1`**。

```xml
<select id="listEmp" resultType="Emp">
    select * from emp
    <where>
        <if test="name != null and name != ''">
            and name like concat('%', #{name}, '%')
        </if>
        <if test="gender != null">
            and gender = #{gender}
        </if>
    </where>
</select>
```

👉 `<where>` 会自动去掉多余的 `and / or`，并在第一个条件前加上 `where`。

---

#### ③ `<set>`

用于 `update`，自动去掉最后一个 `,`。

```xml
<update id="updateEmp">
    update emp
    <set>
        <if test="name != null"> name = #{name}, </if>
        <if test="gender != null"> gender = #{gender}, </if>
        <if test="job != null"> job = #{job}, </if>
    </set>
    where id = #{id}
</update>
```

---

#### ④ `<choose> / <when> / <otherwise>`

类似 Java 的 `switch-case`，满足一个条件就不再往下判断。

```xml
<select id="findEmp" resultType="Emp">
    select * from emp
    <where>
        <choose>
            <when test="id != null">
                id = #{id}
            </when>
            <when test="name != null and name != ''">
                name = #{name}
            </when>
            <otherwise>
                gender = 1
            </otherwise>
        </choose>
    </where>
</select>
```

---

#### ⑤ `<foreach>`

常用于 **in 查询** 或 **批量插入**。

##### in 查询

```xml
<select id="listByIds" resultType="Emp">
    select * from emp where id in
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

👉 `collection` 是传入的参数（List/数组），`item` 是迭代变量。

##### 批量插入

```xml
<insert id="batchInsert">
    insert into emp(name, gender) values
    <foreach collection="list" item="emp" separator=",">
        (#{emp.name}, #{emp.gender})
    </foreach>
</insert>
```

---

#### ⑥ `<trim>`

更灵活的字符串拼接控制，可以代替 `<where>` 和 `<set>`。

例：等价于 `<where>`：

```xml
<trim prefix="where" prefixOverrides="and|or">
    <if test="name != null"> and name = #{name} </if>
    <if test="gender != null"> and gender = #{gender} </if>
</trim>
```

例：等价于 `<set>`：

```xml
<trim prefix="set" suffixOverrides=",">
    <if test="name != null"> name = #{name}, </if>
    <if test="gender != null"> gender = #{gender}, </if>
</trim>
```

---

### 📌 3. 动态 SQL 使用小技巧

1. 查询时推荐用 `<where>`，更新时推荐用 `<set>`。
2. 多条件只取一个时，用 `<choose>`。
3. 批量操作用 `<foreach>`。
4. 如果 `<where>` 或 `<set>` 不够灵活，可以用 `<trim>`。

---

### ✅ 总结

MyBatis 动态 SQL 常用标签：

- **条件拼接**：`<if>`、`<where>`
- **更新赋值**：`<set>`
- **多选一**：`<choose>` / `<when>` / `<otherwise>`
- **批量处理**：`<foreach>`
- **灵活拼接**：`<trim>`

---

## 查询数据后写回实体类

![image](https://raw.githubusercontent.com/12age/blog-img/main/image-20250823230354-ay4c5zm.png)

---