# HTML&CSS

<kbd>标签

​`\<kbd\>`​标签定义键盘文本样式。

HTML 键盘输入元素 (\<kbd\>) 用于表示用户输入，它将产生一个行内元素，以浏览器的默认 monospace 字体显示。

**提示:**   不推荐使用 \<kbd\> 标签，更推荐使用 CSS 实现丰富的效果。

<div>
<span data-type="text" style="color: var(--b3-font-color4);">文件的后缀名不能决定文件格式，只能决定打开文件打开的方式。</span>
</div>

# 书签

[08-HTML5详解 | 千古前端图文教程](https://web.qianguyihao.com/01-HTML/08-HTML5详解.html#新语义标签的兼容性处理)

## HTML | CSS | JS

**HTML**（HyperText Markup Language）：<span data-type="text" style="color: var(--b3-font-color4);">超文本标记语言</span>。从语义的角度描述页面的<span data-type="text" style="color: var(--b3-font-color4);">结构</span>。相当于人的身体组织结构。

**CSS**（Cascading Style Sheets）：<span data-type="text" style="color: var(--b3-font-color4);">层叠样式表</span>。从审美的角度<span data-type="text" style="color: var(--b3-font-color4);">美化页面</span>的样式。相当于人的衣服和打扮。

**JavaScript**（简称JS）：从<span data-type="text" style="color: var(--b3-font-color4);">交互</span>的角度描述页面的行为，实现业务逻辑和页面控制。相当于人的动作，让人有生命力。

## 浏览器

浏览器主要由下面这个七个部分组成

[浏览器的工作方式  |  Articles  |  web.dev](https://web.dev/articles/howbrowserswork?hl=zh-cn)

![image](https://raw.githubusercontent.com/12age/blog-img/main/image-20250809143759-4kupjcs.png)

1、User Interface（UI界面）：包括地址栏、前进/后退按钮、书签菜单等。也就是浏览器主窗口之外的其他部分。

2、Browser engine （浏览器引擎）：用来查询和操作渲染引擎。是UI界面和渲染引擎之间的桥梁。

3、Rendering engine（渲染引擎）：用于解析HTML和CSS，并将解析后的内容显示在浏览器上。

4、Networking （网络模块）：用于发送网络请求。

5、JavaScript Interpreter（JavaScript解析器）：用于解析和执行 JavaScript 代码。

6、UI Backend（UI后端）：用于绘制组合框、弹窗等窗口小组件。它会调用操作系统的UI方法。

7、Data Persistence（数据存储模块）：比如数据存储 cookie、HTML5中的localStorage、sessionStorage。

## HTML

### 文档声明头DTD

任何一个标准的HTML页面，第一行一定是一个以`<!DOCTYPE ……>`​开头的语句。这一行，就是文档声明头，即 DocType Declaration，简称<span data-type="text" style="color: var(--b3-font-color4);">DTD</span>。DTD可告知浏览器文档使用<span data-type="text" style="color: var(--b3-font-color4);">哪种 HTML 或 XHTML 规范</span>。

### body

​`<body>`​标签另外还有一些属性，`link`​属性表示默认显示的颜色、`alink`​属性表示鼠标点击但是还没有松开时的颜色、`vlink`​属性表示点击完成之后显示的颜色。

### p

**段落标签** `<p>`​ paragraph

- **文本级标签**：p、span、a、b、i、u、em。文本级标签里只能放<span data-type="text" style="color: var(--b3-font-color4);">文字、图片、表单元素</span>。（a标签里不能放a和input）
- **容器级标签**：div、h系列、li、dt、dd。容器级标签里可以放置<span data-type="text" style="color: var(--b3-font-color4);">任何东西</span>。

首行缩进2字符 `text-indent: 2em`​

em单位

em 是一个相对长度单位，它的值不是固定的，相对于<span data-type="text" style="color: var(--b3-font-color4);">当前元素的字体大小（font-size） 计算得出的</span>。

- **基准值**：
  ​`1em`​ \= 当前元素的 `font-size`​ 值（默认通常是 `16px`​，除非显式修改）。

  - 示例：若某段落 `font-size: 20px`​，则 `2em = 40px`​。
- **继承性**：
  如果当前元素未设置 `font-size`​，会继承父元素的字体大小作为基准。

### hr

**水平线标签** `<hr/>`​ horizontal

### br

换行标签 `<br/>`​

### div和span

​`<div>`​和`<span>`​标签 div的语义是division“分割” span的语义就是span“范围、跨度”。

- **div标签**：可以把标签中的内容分割为独立的区块。必须<span data-type="text" style="color: var(--b3-font-color4);">单独占据一行</span>。
- **span标签**：和div的作用一致，但<span data-type="text" style="color: var(--b3-font-color4);">不换行</span>。

“**div+css**”：div标签负责布局、结构、分块，css负责样式。

### 字体标签

- ​`&nbsp;`​：空格 （non-breaking spacing，不断打空格）
- ​`&lt;`​：小于号`<`​（less than）
- ​`&gt;`​：大于号`>`​

|特殊字符|描述|字符的代码|
| --------| --------------| ----------|
||空格符|​`&nbsp;`​|
|\<|小于号|​`&lt;`​|
|\>|大于号|​`&gt;`​|
|&|和号|​`&amp;`​|
|￥|人民币|​`&yen;`​|
|©|版权|​`&copy;`​|
|®|注册商标|​`&reg;`​|
|°|摄氏度|​`&deg;`​|
|±|正负号|​`&plusmn;`​|
|×|乘号|​`&times;`​|
|÷|除号|​`&divide;`​|
|²|平方2（上标2）|​`&sup2;`​|
|³|立方3（上标3）|​`&sup3;`​|

#### 下划线、中划线、斜体

- ：下划线标记
- 或：中划线标记（删除线）
- 或：斜体标记

#### 上标 下标

​`<sup>`​ 上标 `<sub>`​ 下标

### a

​`<a>`​ anchor 锚 `href`​（hypertext reference）：超文本地址。

- ​`href`​：目标URL
- ​`title`​：悬停文本。
- ​`name`​：主要用于设置一个锚点的名称。
- ​`target`​：告诉浏览器用什么方式来打开目标页面。`target`​属性有以下几个值：

  - ​`_self`​：在同一个网页中显示（默认值）
  - ​`_blank`​：<span data-type="text" style="color: var(--b3-font-color4);">在新的窗口中打开</span>。
  - ​`_parent`​：在父窗口中显示
  - ​`_top`​：在顶级窗口中显示

### table

​~~​~~​~~​`cellspacing="0"`​~~​~~​~~ ​ ~~取消表格边框的空隙~~

​~~​~~​~~​`cellspacing`​~~​~~​~~​ ~~是过时的 HTML4 属性~~

现代开发推荐使用 CSS 的 `border-collapse: collapse`​

- **取消空隙**：用 `border-collapse: collapse`​（推荐）。
- **自定义间距**：用 `border-spacing`​（需确保 `border-collapse: separate`​）。
- **现代开发**：优先使用 CSS 而非 HTML 的 `cellspacing`​。

---

- **tr**：tr 是 table row 的缩写，表示表格的一行。
- **td**：td 是 table data 的缩写，表示表格的数据单元格。
- **th**：th 是 table header的缩写，表示表格的表头单元格。

单元格的合并

- ​`colspan`​：横向合并。例如`colspan="2"`​表示当前单元格在水平方向上要占据两个单元格的位置。
- ​`rowspan`​：纵向合并。例如`rowspan="2"`​表示当前单元格在垂直方向上要占据两个单元格的位置。

### HTML 中引入 CSS 的方式

[HTML 中引入 CSS 的方式 | 菜鸟教程](https://www.runoob.com/w3cnote/html-import-css-method.html)

#### 内联方式

`<div style="background: red">`​

内联方式引入 CSS 代码会导致 HTML 代码变得冗长，且使得网页难以维护。

#### 嵌入方式

```html
<head>
    <style>

    .content {
        background: red;
    }

    </style>
</head>
```

嵌入的 CSS <span data-type="text" style="color: var(--b3-font-color4);">只对当前页面有效</span>，所以当多个页面需要引入相同的 CSS 代码时，这样写会导致代码冗余，也不利于维护。

#### 链接方式

```html
<head>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
```

最推荐的引入 CSS 的方式。并且所有的 CSS 代码只存在于 CSS 文件中，<span data-type="text" style="color: var(--b3-font-color4);">CSS 文件会在第一次加载时引入</span>，以后切换页面时只需加载 HTML 文件即可。

### 列表

无序列表`<ul>`​

- ul：unordered list，“无序列表”的意思。
- li：list item，“列表项”的意思。

```html
<ul>
	<li>默认1</li>
	<li>默认2</li>
	<li>默认3</li>
</ul>
```

有序列表`<ol>`​

```html
<ol >
	<li>呵呵哒1</li>
	<li>呵呵哒2</li>
	<li>呵呵哒3</li>
</ol>
```

定义列表`<dl>`​

​`<dl>`​英文单词：definition list，没有属性。dl的子元素只能是dt和dd。

- ​`<dt>`​：definition title 列表的标题，这个标签是必须的
- ​`<dd>`​：definition description 列表的列表项，如果不需要它，可以不加

```html
<dl>
	<dt>第一条</dt>
	<dd>你若是觉得你有实力和我玩，良辰不介意奉陪到底</dd>
	<dd>我会让你明白，我从不说空话</dd>
	<dd>我是本地的，我有一百种方式让你呆不下去；而你，无可奈何</dd>

	<dt>第二条</dt>
	<dd>良辰最喜欢对那些自认能力出众的人出手</dd>
	<dd>你可以继续我行我素，不过，你的日子不会很舒心</dd>
	<dd>你只要记住，我叫叶良辰</dd>
	<dd>不介意陪你玩玩</dd>
	<dd>良辰必有重谢</dd>

</dl>
```

### 表单标签

​`<form>`​ 用于<span data-type="text" style="color: var(--b3-font-color4);">与服务器的交互</span>。表单就是收集用户信息的，就是让用户填写的、选择的。

- ​`name`​：表单的名称，用于JS来操作或控制表单时使用；
- ​`id`​：表单的名称，用于JS来操作或控制表单时使用；
- ​`action`​：指定表单数据的处理程序，一般是PHP，如：action\=“login.php”
- ​`method`​：表单数据的提交方式，一般取值：get(默认)和post

**GET方式**： 将表单数据，以"name=value"形式追加到action指定的处理程序的后面，两者间<span data-type="text" style="color: var(--b3-font-color4);">用"?"隔开</span>，<span data-type="text" style="color: var(--b3-font-color4);">每一个表单的"name=value"间用"&amp;"号隔开</span>。 特点：只适合提交少量信息，并且不太安全(不要提交敏感数据)、提交的数据类型只限于ASCII字符。

**POST方式**： 将表单数据直接发送(隐藏)到action指定的处理程序。POST发送的数据不可见。Action指定的处理程序可以获取到表单数据。 特点：可以提交海量信息，相对来说<span data-type="text" style="color: var(--b3-font-color4);">安全</span>一些，提交的数据格式是多样的(Word、Excel、rar、img)。

**Enctype：**   表单数据的编码方式(<span data-type="text" style="color: var(--b3-font-color4);">加密方式</span>)，取值可以是：application/x-www-form-urlencoded、multipart/form-data。Enctype只能在POST方式下使用。

- Application/x-www-form-urlencoded：**默认**加密方式，除了上传文件之外的数据都可以
- Multipart/form-data：**上传附件时，必须使用这种编码方式**。

## flex布局

[Flex 布局教程：实例篇 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
