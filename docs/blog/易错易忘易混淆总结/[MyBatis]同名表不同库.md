## MyBatis 代码生成器生成实体类／Mapper 时，如果不同数据库里有同名表，它是如何区分的

---

### 1. MyBatis Generator 生成原理

MBG 会根据 **配置的数据库连接 + 表名** 来生成代码。

配置示例（`generatorConfig.xml`）：

```xml
<context id="MyContext" targetRuntime="MyBatis3">
    <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                    connectionURL="jdbc:mysql://localhost:3306/db1"
                    userId="root"
                    password="root"/>

    <javaModelGenerator targetPackage="com.example.model" targetProject="src/main/java"/>
    <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"/>
    <javaClientGenerator type="XMLMAPPER" targetPackage="com.example.mapper" targetProject="src/main/java"/>

    <table tableName="user" domainObjectName="UserDB1"/>
</context>

<context id="MyContext2" targetRuntime="MyBatis3">
    <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                    connectionURL="jdbc:mysql://localhost:3306/db2"
                    userId="root"
                    password="root"/>

    <javaModelGenerator targetPackage="com.example.model" targetProject="src/main/java"/>
    <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"/>
    <javaClientGenerator type="XMLMAPPER" targetPackage="com.example.mapper" targetProject="src/main/java"/>

    <table tableName="user" domainObjectName="UserDB2"/>
</context>
```

---

### 2. 区分方式

1. **不同数据库用不同** **`context`** **配置**

    - 每个 `context` 对应一个数据库连接。
    - MyBatis Generator 会生成独立的实体类、Mapper 文件。
2. **指定** **`domainObjectName`**

    - 即使表名相同，你可以通过 `domainObjectName` 给生成的实体类取不同名字，比如 `UserDB1`、`UserDB2`。
    - 这样就不会冲突。
3. **包名区分**

    - 可以让不同数据库的实体类生成在不同包下，例如：

      - `com.example.db1.model.User`
      - `com.example.db2.model.User`
4. **XML Mapper 文件独立**

    - Mapper XML 也会按照 `tableName` + `domainObjectName` 分开生成，避免覆盖。

---

### 3. 总结

- **MyBatis Generator 不会自动处理同名表的冲突**，需要你在配置中：

  1. 用不同 `context` 指定不同数据库。
  2. 给实体类/Mapper 起不同名字或放不同包。
- IDEA 里的 Database 工具显示只是视觉问题，MBG 生成代码完全依赖你配置的数据库连接和表名。

---