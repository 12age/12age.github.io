
<div id="pb-home">
    <!-- 引入 live2d-widget -->
    <script src="https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js"></script>
    <script>
        // 初始化 Live2D
        L2Dwidget.init({
            model: {
                jsonPath: 'https://unpkg.com/live2d-widget-model-shizuku/assets/shizuku.model.json',
                scale: 1
            },
            display: {
                position: 'right',
                width: 200,
                height: 400
            },
            react: {
                opacityDefault: 1,
                opacityOnHover: 1
            }
        });

        // 动态缩放逻辑
        function adjustLive2D() {
            const widget = document.getElementById('live2d-widget');
            if (!widget) return;

            const ww = window.innerWidth;
            let scale = 1;

            if (ww < 400) {
                scale = ww / 400;   // 小于 400px 时，按比例缩放
            }

            widget.style.transform = `scale(${scale})`;
        }

        // 页面加载和窗口变化时执行
        window.addEventListener('resize', adjustLive2D);
        window.addEventListener('load', adjustLive2D);
    </script>

    <!-- 首页标题 -->
    <h1>Rage.的博客</h1>
    <p class="subtitle">记录生活与技术</p>

    <!-- 卡片 -->
    <div  class="cards">
        <a href="blog/HTML&CSS" class="card">
            <h3>前端学习</h3>
            <div style="color: gray;">HTML&CSS入门学习</div>
        </a>

        <a href="blog/每日面试题/每日面试题目录" class="card">
            <h3>每日面试题</h3>
            <div style="color: gray;"> 好好学习，天天向上！</div>
        </a>

        <div class="card">
            <h3>关于我</h3>
            <p>我的简介与联系方式</p>
        </div>
    </div>

    <!-- 页脚 -->
    <footer>© 2025 Rage.的个人博客</footer>
</div>