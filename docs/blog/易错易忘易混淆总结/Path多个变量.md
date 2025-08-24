## ／students／1,2,3

```
DELETE /students/1,2,3
```

路径里带了 **一组 ID（逗号分隔）** 。
👉 按照 SpringMVC 的规则，`@PathVariable` ~~并不会自动~~把 `"1,2,3"` 转成 `List<Integer>`。

---

 **SpringMVC + 类型转换机制** 的配合结果，看起来像是 `@PathVariable List<Integer>` 能直接用，其实背后发生了几件事：

---

### 🔎 为什么能成功？

URL 是：

```
DELETE /students/1,2,3
```

Controller：

```java
@DeleteMapping("/{ids}")
public Result delById(@PathVariable("ids") List<Integer> ids){
    stuService.delById(ids);
    return Result.success();
}
```

---

#### 1️⃣ `@PathVariable("ids")` 拿到的是什么？

- Spring 先匹配路径 `/students/{ids}`，把 `1,2,3` 整段当成 `"1,2,3"`。
- 现在问题来了：方法签名里是 `List<Integer>`，不是 `String`。

---

#### 2️⃣ Spring 的 **类型转换机制**

SpringMVC 在绑定参数时，会尝试用 **ConversionService** 做类型转换。
默认内置了一个 **String → Collection** 的转换器，它的规则是：

- 如果目标类型是 `List<X>`
- 并且源数据是 `String`
- 就会尝试按 **逗号分隔** 拆开 → 转成 `X` 类型

所以：

```java
"1,2,3" → ["1","2","3"] → [1,2,3]
```

👉 这就是为什么写 `@PathVariable List<Integer> ids` 也能成功。

---

#### 3️⃣ 为什么很多资料说不行？

因为：

- 在 **早期的 Spring 版本（比如 Spring 3.x / 4.x）** ，没有这个 `StringToCollectionConverter`，所以只能手动 `split`。
- 现在的 Spring Boot（默认自带 ConversionService）已经支持这种写法。

---

#### 4️⃣ MyBatis 的部分

```xml
<foreach collection="ids" item="id" separator=",">
    #{id}
</foreach>
```

这里的 `ids` 就是 Spring 已经帮你转换好的 `[1,2,3]`，所以能直接用。

---

### ✅ 总结

- `@PathVariable List<Integer>` 在 **新版本 SpringMVC** 是可以用的（因为内置了 String → Collection 的转换器）。
- 老教程/书上说不行，是因为老版本没有自动 split 功能。
- 这套写法是完全 OK 的，但从 **API 设计角度** `/students/1,2,3` 不如 `/students?ids=1&ids=2&ids=3` 或 JSON `[1,2,3]` 语义清晰。

---

### ✅ 正确做法

#### 方法 1：用 `@PathVariable String` + 手动切割

```java
@DeleteMapping("/students/{ids}")
public void delete(@PathVariable String ids) {
    List<Integer> idList = Arrays.stream(ids.split(","))
                                 .map(Integer::valueOf)
                                 .toList();
    System.out.println(idList); // [1, 2, 3]
}
```

调用：

```
DELETE /students/1,2,3
```

👉 `ids` 初始值是 `"1,2,3"`，自己转成 `List<Integer>`。

---

#### 方法 2：换 URL 设计（推荐 ✅）

用查询参数方式，SpringMVC 能自动绑定成 `List`：

```java
@DeleteMapping("/students")
public void delete(@RequestParam List<Integer> ids) {
    System.out.println(ids); // [1, 2, 3]
}
```

调用：

```
DELETE /students?ids=1&ids=2&ids=3
```

---

#### 方法 3：用 JSON 数组（更语义化）

```java
@DeleteMapping("/students")
public void delete(@RequestBody List<Integer> ids) {
    System.out.println(ids); // [1, 2, 3]
}
```

调用（请求体 JSON）：

```json
[1,2,3]
```

---

### 📌 总结

- `/students/1,2,3` 👉 **只能用**  **`@PathVariable String`** **然后手动 split**。
- `/students?ids=1&ids=2&ids=3` 👉  **`@RequestParam List<Integer>`**  **自动绑定**。
- `DELETE /students` + JSON `[1,2,3]` 👉  **`@RequestBody List<Integer>`**  **自动绑定**。

---