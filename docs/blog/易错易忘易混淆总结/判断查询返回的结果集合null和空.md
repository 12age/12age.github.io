## 判断查询返回的结果集合null和空

同时判断 **`emps != null && !emps.isEmpty()`** ，而不仅仅是 `emps != null`

![image](https://raw.githubusercontent.com/12age/blog-img/main/image-20250825113156-p54wy76.png)

---

### 1. `emps` 可能为 `null`

- 比如 `deptMapper.listByDeptId(id)` 没查到数据，有的 DAO 实现可能直接返回 `null`。
- 如果不先判断 `emps != null` 就直接 `.isEmpty()`，会 **NullPointerException**。

---

### 2. `emps` 也可能是一个 **空集合**

- 很多 ORM 框架（MyBatis、JPA）查询“没有结果”时返回的往往是 **空集合（empty list）** ，而不是 `null`。
- 这种情况下，`emps != null` 仍然成立，但实际上部门下并没有员工。
- 所以必须再判断 `!emps.isEmpty()`，才能确定“部门下确实有员工”。

---

### 3. 逻辑上的语义区别

- **`emps != null`** 只能说明返回结果不是空指针。
-  **`!emps.isEmpty()`**  才能说明“集合里确实有数据”。

结合在一起：

```java
if (emps != null && !emps.isEmpty()) {
    throw new DeptNotAllowedDeleteException("此部门下有员工，不能进行删除操作！");
}
```

👉 表示 **只有当集合存在，并且里面确实有员工时，才阻止删除**。

---

✅ 总结：
只判断 `null` 会导致 **空集合（[]）的情况漏掉**；
只判断 `isEmpty()` 又可能引发 **空指针异常**；
所以两个条件要一起用，确保逻辑安全又正确。

---

## 使用场景

`!= null && !xxx.isEmpty()` 的组合判断，在开发中经常出现。

本质上是为了 **既避免空指针，又保证集合/字符串真的有内容**。

---

### 1️⃣ 集合 (List / Set / Map)

```java
if (list != null && !list.isEmpty()) {
    // list 有元素，可以安全使用
}
```

- **只判断 !=**  **null**：可能是空集合 `[]`，但逻辑上是“无数据”。
- **只判断 isEmpty()** ：可能会 NPE。
  ✅ 两个一起用，保证安全且正确。

---

### 2️⃣ 字符串 (String)

```java
if (str != null && !str.isEmpty()) {
    // str 不为空字符串 ""
}
```

进一步的，很多时候要判断是否是“空白字符串”（包含空格、换行）：

```java
if (str != null && !str.trim().isEmpty()) {
    // str 有实际内容
}
```

或者用工具类（推荐）：

- Apache Commons Lang: `StringUtils.isNotBlank(str)`
- Spring: `StringUtils.hasText(str)`

---

### 3️⃣ 数组

```java
if (arr != null && arr.length > 0) {
    // arr 有元素
}
```

和集合类似，避免 `NullPointerException`。

---

### 4️⃣ 数据库查询结果 / Optional

很多时候数据库查询结果可能是：

- **null**（没查到，手写 Mapper 时常见）
- **空集合**（框架默认返回 empty list）

判断逻辑跟你代码里的 `emps` 一样。
如果用 JDK8 `Optional`：

```java
Optional.ofNullable(emps)
        .filter(list -> !list.isEmpty())
        .ifPresent(list -> { ... });
```

---

### 5️⃣ 自定义对象的属性

```java
if (user != null && user.getName() != null && !user.getName().isEmpty()) {
    // user 存在，并且 name 不为空
}
```

这种链式属性判断如果写多了会很丑，Java 8 以后推荐用 `Optional` 来写，或者用 Spring 的 `ObjectUtils.isEmpty()`。

---

### ✅ 总结通用模式

在 Java 里，“是否有数据”一般要同时判断：

- **对象是否存在**（`!= null`）
- **是否有内容**（集合 `!isEmpty()` / 数组 `length > 0` / 字符串 `!isEmpty()` 或 `isNotBlank()`）

这样写才最稳。

---