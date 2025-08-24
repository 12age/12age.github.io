## 🔥 动态 SQL 的使用时机

### 1️⃣ **基本概念**

动态 SQL 就是 **SQL 语句在运行时可以根据条件拼接变化**，常用 MyBatis 提供的 `<if>、<choose>、<when>、<where>、<set>` 等标签实现。

作用：

- 根据传入参数决定查询条件
- 根据参数决定更新字段
- 批量操作时动态生成 `IN` 条件

---

### 2️⃣ **典型使用场景**

#### ① 多条件查询

当查询条件可选时，用动态 SQL 可以避免拼接大量 if-else 或生成很多静态 SQL。

```xml
<select id="searchUsers" resultType="User">
  select * from user
  <where>
    <if test="name != null">and name = #{name}</if>
    <if test="age != null">and age = #{age}</if>
    <if test="gender != null">and gender = #{gender}</if>
  </where>
</select>
```

- 好处：只生成真正需要的查询条件，SQL 简洁高效。

---

#### ② 更新部分字段

当更新对象部分字段时，如果写死 SQL 会把 null 覆盖掉，动态 SQL 可以只更新非 null 字段：

```xml
<update id="updateUser">
  update user
  <set>
    <if test="name != null">name = #{name},</if>
    <if test="age != null">age = #{age},</if>
    <if test="gender != null">gender = #{gender},</if>
  </set>
  where id = #{id}
</update>
```

---

#### ③ 批量操作

例如批量删除、批量插入：

```xml
<delete id="deleteUsers">
  delete from user where id in
  <foreach collection="ids" item="id" separator="," open="(" close=")">
    #{id}
  </foreach>
</delete>
```

- `ids` 可以是前端传来的 List，动态生成 `IN (1,2,3)`。

---

#### ④ 动态排序、分页、分表查询

- 根据传入参数动态拼接 `ORDER BY`
- 动态选择表名或分库字段（如多租户系统）

```xml
<select id="listUsers" resultType="User">
  select * from ${tableName}
  <where>...</where>
  <if test="orderBy != null">order by ${orderBy}</if>
</select>
```

> 注意 `${}` 是直接拼字符串，易 SQL 注入，需要严格校验。

---

### 3️⃣ **不适合动态 SQL 的场景**

- SQL 很固定，只有极少参数（写死更清晰）
- 性能要求极高且 SQL 执行频繁（动态 SQL 可能影响缓存/解析）
- 安全要求严格，避免使用 `${}` 拼接用户输入

---

### 4️⃣ **总结**

动态 SQL 使用场景：

1. **多条件查询**：条件可选，避免生成大量 SQL
2. **部分更新**：只更新非 null 字段
3. **批量操作**：批量删除、批量插入、批量更新
4. **动态排序/分表/分页**：根据参数动态改变 SQL

原则：

- 只有 **SQL 本身会根据参数变化** 才用动态 SQL
- **静态 SQL 能解决问题** 就尽量用静态 SQL（可读性好、性能更稳定）

---