## 事务@Transactional(rollbackFor = Exception.class)和事务传播

你问的这个注解：

```java
@Transactional(rollbackFor = Exception.class)
```

### 默认行为

Spring 的事务管理有个 **默认的回滚规则**：

- **运行时异常（RuntimeException）和 Error** 会触发回滚。
  例如：`NullPointerException`, `IllegalArgumentException`。
- **受检异常（Checked Exception）不会回滚**。
  例如：`IOException`, `SQLException`。

也就是说，如果你抛的是受检异常（`Exception`），Spring 默认 **不会帮你回滚**。

---

### `rollbackFor` 的作用

`rollbackFor = Exception.class` 就是告诉 Spring：

> 不管是运行时异常还是受检异常，只要抛出 `Exception`（及其子类），都要回滚事务。

等价于把 **回滚范围扩大**了。

---

### 举例

假设你写的代码里有个方法：

```java
@Transactional
public void batchRemove(List<Integer> ids) throws IOException {
    empMapper.deleteByIds(ids);
    if (true) {
        throw new IOException("测试异常");
    }
}
```

- 如果没写 `rollbackFor`，Spring 默认不会因为 `IOException` 回滚，数据就可能删除一半。
- 如果加了 `rollbackFor = Exception.class`，Spring 会在抛出 `IOException` 时也帮你回滚，保证事务一致性。

---

### 常见写法

- **常见业务**：

  ```java
  @Transactional
  public void doSomething() { ... }
  ```

  → 默认只对 RuntimeException 回滚。
- **保险写法**（所有异常都回滚）：

  ```java
  @Transactional(rollbackFor = Exception.class)
  public void doSomething() throws Exception { ... }
  ```

---

## Java 异常（Exception）

### 1. **受检异常（Checked Exception）**

- **特点**：编译器强制要求你处理（必须 `try...catch` 或 `throws` 抛出）。
- **继承体系**：继承自 `Exception`，但 **不是** `RuntimeException` 的子类。
- **常见例子**：

  - `IOException`（文件读写异常）
  - `SQLException`（数据库异常）
  - `ClassNotFoundException`
  - `ParseException`

```java
public void readFile() throws IOException {
    FileReader fr = new FileReader("test.txt"); // 可能抛 IOException
}
```

➡️ 编译器会强制你写 `throws IOException` 或者 `try...catch`，否则代码编译不过。

---

### 2. **非受检异常（Unchecked Exception / RuntimeException）**

- **特点**：编译器不强制你处理，可以随便抛。
- **继承体系**：`RuntimeException` 及其子类。
- **常见例子**：

  - `NullPointerException`
  - `IndexOutOfBoundsException`
  - `IllegalArgumentException`
  - `ArithmeticException`

```java
public void divide(int a, int b) {
    System.out.println(a / b); // b = 0 时抛 ArithmeticException
}
```

➡️ 编译时不会提示你要处理异常，但运行时可能挂掉。

---

### 3. **区别总结**

| 异常类型               | 是否必须处理 | 继承体系         | 常见例子 |
| ------------------------ | -------------- | ------------------ | ---------- |
| 受检异常 (Checked)     | ✅ 必须`try...catch`或`throws`    | 继承`Exception`，但不是`RuntimeException`子类 | `IOException`,`SQLException`        |
| 非受检异常 (Unchecked) | ❌ 不强制    | 继承`RuntimeException`             | `NullPointerException`,`IndexOutOfBoundsException`        |

---

所以回到你之前的 `@Transactional`：

- Spring 默认只在 **非受检异常（RuntimeException）**  才回滚。
- 如果你抛的是 **受检异常（如 SQLException）** ，那就要写 `rollbackFor = Exception.class`，不然不会回滚。

---

要不要我给你写一个小 demo 程序，分别演示受检异常和非受检异常在事务中的回滚差异？

## 事务传播

![image](https://raw.githubusercontent.com/12age/blog-img/main/image-20250823222321-rkanyji.png)

“事务传播”就是 **当一个事务方法调用另一个事务方法时，Spring 应该如何处理事务**。

---

### 1. 为什么要有传播行为？

比如你有两个方法：

```java
@Service
public class UserService {
    @Transactional
    public void createUser() {
        // A逻辑
        orderService.createOrder();
    }
}

@Service
public class OrderService {
    @Transactional
    public void createOrder() {
        // B逻辑
    }
}
```

问题是：`createUser()` 调用 `createOrder()` 时，**要用同一个事务，还是开启新事务？**
➡️ 这就由 **事务传播机制** 决定。

---

### 2. Spring 的事务传播类型（Propagation 枚举）

| 传播行为 | 说明                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------- |
| **REQUIRED**<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">(默认)</span>         | 如果当前有事务，就加入当前事务；没有就新建一个事务。                                       |
| **REQUIRES_NEW**         | 总是新建一个事务，如果外层有事务，就挂起外层事务。                                         |
| **SUPPORTS**         | 如果当前有事务，就加入事务；如果没有，就以非事务方式运行。                                 |
| **NOT_SUPPORTED**         | 不支持事务，总是以非事务方式运行，如果外层有事务，就挂起外层事务。                         |
| **NEVER**         | 不允许在事务中运行，如果调用时有事务，就抛异常。                                           |
| **MANDATORY**         | 必须运行在事务中，如果外层没有事务，就抛异常。                                             |
| **NESTED**         | 如果外层有事务，就在外层事务里再嵌套一个子事务（可以独立回滚）；如果没有事务，就新建一个。 |

---

### 3. 举例理解

#### ✅ REQUIRED（默认）

```java
@Transactional(propagation = Propagation.REQUIRED)
public void methodA() {
    methodB();
}
```

- A、B 在 **同一个事务** 里。
- 如果 B 抛异常，A 也会回滚。

---

#### ✅ REQUIRES\_NEW

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void methodB() { ... }
```

- 调用 B 时，会新建一个事务。
- 外层事务 A 会被 **挂起**，等 B 执行完再继续。
- B 的回滚不会影响 A，反之亦然。

---

#### ✅ NESTED

```java
@Transactional(propagation = Propagation.NESTED)
public void methodB() { ... }
```

- 在 A 的事务里创建一个“子事务”。
- B 回滚时，只会回滚自己，不影响 A。
- 但前提是数据库要支持 **保存点（savepoint）** ，比如 MySQL 就支持。

---

### 4. 对比总结

| 传播行为         | 是否复用外层事务 | 外层事务挂起 | 子事务回滚独立性 |
| ------------------ | ------------------ | -------------- | ------------------ |
| REQUIRED         | ✅ 复用          | ❌           | ❌               |
| REQUIRES\_NEW | ❌ 新建          | ✅           | ✅               |
| NESTED           | ✅ 复用 + 保存点 | ❌           | ✅（基于保存点） |

---

✅ 总结一句话：

- **REQUIRED**：最常用，外层事务有就加入，没有就新建。
- **REQUIRES_NEW**：外层事务挂起，自己开新事务。
- **NESTED**：外层事务里开一个子事务（依赖保存点）。

---