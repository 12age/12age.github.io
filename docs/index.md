<div id="pb-home">
    <style>
        #pb-home {
            max-width: 960px;
            margin: 2rem auto;
            padding: 0 1rem;
            font-family: var(--md-text-font, system-ui, sans-serif);
        }

        /* 标题 */
        #pb-home h1 {
            font-size: 2rem;
            text-align: center;
            margin-bottom: 0.5rem;
            color: var(--md-primary-fg-color);
        }

        /* 副标题 */
        #pb-home p.subtitle {
            text-align: center;
            color: var(--md-default-fg-color--light);
            margin-bottom: 2rem;
        }

        /* 卡片布局 */
        #pb-home .cards {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        /* 单个卡片 */
        #pb-home .card {
            display: block;
            padding: 1rem 1.25rem;
            border-radius: var(--md-radius);
            background: var(--md-default-bg-color);
            color: inherit;
            text-decoration: none;
            box-shadow: var(--md-shadow-z1);
            transition: box-shadow 0.2s, transform 0.2s;
        }

        #pb-home .card:hover {
            box-shadow: var(--md-shadow-z2);
            transform: translateY(-3px);
        }

        #pb-home .card h3 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
            color: var(--md-primary-fg-color);
        }

        #pb-home .card p {
            margin: 0;
            color: var(--md-default-fg-color--light);
        }

        /* 页脚 */
        #pb-home footer {
            text-align: center;
            margin-top: 2.5rem;
            color: var(--md-default-fg-color--light);
            font-size: 0.85rem;
        }
    </style> <!-- 首页标题 -->
    <h1>欢迎来到我的博客</h1>
    <p class="subtitle">记录生活与技术</p>
    <!-- 卡片 -->
    <div class="cards">
        <a class="card" href="blog/HTML&CSS">
            <h3>前端学习</h3>
            <p>HTML&CSS入门学习</p>
        </a>
        <div class="card">
            <h3>每日面试题</h3>
            <a href="blog/2025年8月19日" style="color: gray;">2025年8月19日</a>

        </div>
        <div class="card">
            <h3>关于我</h3>
            <p>我的简介与联系方式</p>
        </div>
    </div>
    <!-- 页脚 -->
    <footer> © 2025 我的个人博客 </footer>
</div>