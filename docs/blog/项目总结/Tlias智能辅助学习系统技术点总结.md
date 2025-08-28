# Tlias智能辅助学习系统技术点总结

## Junit

[Junit入门](https://jxwi7qorep.feishu.cn/wiki/ZRnpwpPMSiL8aFkJFWZcbBrCnjn#DgAYdqcFpoUypfx0RMxcVxFLnaf)

> 引入依赖
>
> 在test/java目录下编写测试类，并编写对应的测试方法，并在方法上声明@Test注解。

## 三层架构

[分层解耦](https://jxwi7qorep.feishu.cn/wiki/F5xXw16HxivXrIkVz3Qc3v4Cnmg#GHLZdQ895o9tLpxc5UEcnUg5nYb)

### Controller

> 控制层。接收前端发送的请求，对请求进行处理，并响应数据。

`@RestController` = `@Controller` + `@ResponseBody`

`@RequestMapping("/rage")`

`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`

> `@ResponseBody`注解：
>
> 类型：方法注解、类注解
>
> 位置：书写在Controller方法上或类上
>
> 作用：将方法返回值直接响应给浏览器，如果返回值类型是<span data-type="text" style="color: var(--b3-font-color8);">实体对象/集合</span>，将会转换为<span data-type="text" style="color: var(--b3-font-color8);">JSON格式</span>后在响应给浏览器

### Service

> 业务逻辑层。处理具体的业务逻辑。

`@Service`

首先创建service的接口，再创建接口的实现类

`com.rage.service.impl`

`com.rage.service`

### ~~Dao~~

> 数据访问层(Data Access Object)，也称为持久层。负责数据访问操作，包括数据的增、删、改、查。

### Mapper

[Mybatis](https://jxwi7qorep.feishu.cn/wiki/BGunwvs3uigh4WkzsZYci5kHntc#SJp0dVXLioiIp3xEQmBckcg0nFd)

`@Mapper`

> 使用注解流程
>
> 引入依赖
>
> 创建对应的实体类`com.rage.pojo`下
>
> 配置数据库信息在`application.properties`或者`application.yml`
>
> 编写Mybatis程序：编写Mybatis的持久层接口，定义SQL语句

> 使用xml文件
>
> 在resource目录下创建mapper文件夹
>
> 编写xml映射文件（详情见起步配置）

![image](https://raw.githubusercontent.com/12age/blog-img/main/image-20250828101147-ms48fbf.png)

### PageHelper

[PageHelper分页插件](https://jxwi7qorep.feishu.cn/wiki/TajNwQMt6i4ffAkSBw2c7JdGnSb#RKYqdt53qo85DIxSbS7crnP2nX2)

> 引入依赖
>
> Mapper层正常查询数据，返回List集合
>
> Service层
>
> PageHelper.startPage设置分页参数
>
> 执行查询，用Page强转
>
> 将结果用PageResult封装返回

## 日志

[日志技术](https://jxwi7qorep.feishu.cn/wiki/MPeQw7SwSiopQRk1sdPc163BnQe#HRU2dI2LioTBkGxnEU9cY4ZInsb)

> 引入依赖
>
> `resources`下创建`logback.xml`配置文件

## 事务

[Transactional注解](https://jxwi7qorep.feishu.cn/wiki/ZakCwwMXGiQNMKkODuMcF3afned#BI7xd3gnsolGyHxzgUDcQIjKnHc)

> 在业务方法上加上 @Transactional 来控制事务

## 全局异常处理

[全局异常处理器](https://jxwi7qorep.feishu.cn/wiki/JrT6wghUfiebCJkBNyRcSE7LnTg#BzSxdyaWjovHbWxNetJcvQAHnYb)

`@RestControllerAdvice`

`@ExceptionHandler`

> 定义一个类，在类上加上一个注解@RestControllerAdvice，加上这个注解就代表我们定义了一个全局异常处理器
>
> 全局异常处理器当中，定义一个方法来捕获异常，在这个方法上需要加上注解@ExceptionHandler。通过@ExceptionHandler注解当中的value属性来指定我们要捕获的是哪一类型的异常

## JWT

[JWT令牌](https://jxwi7qorep.feishu.cn/wiki/WWBSwJvyqiDydakCURTczN9FnYN#TRRAd6fbEoXMANx0yffcTXiNnGd)

> 引入依赖
>
> 设置令牌
>
> 登录时将令牌返回前端

## 过滤器

[过滤器Filter](https://jxwi7qorep.feishu.cn/wiki/WWBSwJvyqiDydakCURTczN9FnYN#UeTpdHZrNo5cIixv7R0cSJ8vnbe)

`@WebFilter`

`@ServletComponentScan`

> 第1步，定义过滤器 ：1.定义一个类，实现 Filter 接口，并重写其所有方法
>
> 第2步，配置过滤器：Filter类上加 @WebFilter 注解，配置拦截资源的路径。引导类上加 @ServletComponentScan 开启Servlet组件支持

## 拦截器

[拦截器Interceptor](https://jxwi7qorep.feishu.cn/wiki/WWBSwJvyqiDydakCURTczN9FnYN#PM2Md5PfuoSAIjxxl0Acl7WBnMb)

`@Component`

`@Configuration`

> 定义拦截器，实现`HandlerInterceptor`接口，并重写其所有方法，加`@Component`来被spring扫描到
>
> 注册配置拦截器，在 `com.rage`下创建一个包，然后创建一个配置类 `WebConfig`， 实现 `WebMvcConfigurer` 接口，并重写 `addInterceptors` 方法，加`@Configuration`，在拦截器类加上`@Autowired`

## AOP

`@Component`

`@Aspect`

> 添加以上两个注解后表示这是一个注解类
>
> 在注解类的方法上加通知注解并跟切入点表达式，在方法内增强方法

[通知](https://jxwi7qorep.feishu.cn/wiki/I4kywxgkXiyKFokWhUmcvcqvn8f#EdRfdQFRfoIodVxbWXAcQnWGncg)

通知注解后跟切入点表达式

`@Around`

`@Before`

`@After`

`@AfterReturning`

`@AfterThrowing`

### 切入点表达式

[切入点表达式](https://jxwi7qorep.feishu.cn/wiki/I4kywxgkXiyKFokWhUmcvcqvn8f#BxE9dT4GNomDcmxnFuncJc6fnSb)