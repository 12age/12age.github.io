// main.js

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

// // 线条背景
// !function() {
//     function o(w, v, i) {
//         return w.getAttribute(v) || i
//     }
//     function j(i) {
//         return document.getElementsByTagName(i)
//     }
//     function l() {
//         var i = j("script"),
//         w = i.length,
//         v = i[w - 1];
//         return {
//             l: w,
//             z: o(v, "zIndex", -1),
//             o: o(v, "opacity", 0.5),
//             c: o(v, "color", "0,0,0"),
//             n: o(v, "count", 99)
//         }
//     }
//     function k() {
//         r = u.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
//         n = u.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
//     }
//     function b() {
//         e.clearRect(0, 0, r, n);
//         var w = [f].concat(t);
//         var x, v, A, B, z, y;
//         t.forEach(function(i) {
//             i.x += i.xa,
//             i.y += i.ya,
//             i.xa *= i.x > r || i.x < 0 ? -1 : 1,
//             i.ya *= i.y > n || i.y < 0 ? -1 : 1,
//             e.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);
//             for (v = 0; v < w.length; v++) {
//                 x = w[v];
//                 if (i !== x && null !== x.x && null !== x.y) {
//                     B = i.x - x.x,
//                     z = i.y - x.y,
//                     y = B * B + z * z;
//                     y < x.max && (x === f && y >= x.max / 2 && (i.x -= 0.03 * B, i.y -= 0.03 * z), A = (x.max - y) / x.max, e.beginPath(), e.lineWidth = A / 2, e.strokeStyle = "rgba(" + s.c + "," + (A + 0.2) + ")", e.moveTo(i.x, i.y), e.lineTo(x.x, x.y), e.stroke())
//                 }
//             }
//             w.splice(w.indexOf(i), 1)
//         }),
//         m(b)
//     }
//     var u = document.createElement("canvas"),
//     s = l(),
//     c = "c_n" + s.l,
//     e = u.getContext("2d"),
//     r,
//     n,
//     m = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
//     function(i) {
//         window.setTimeout(i, 1000 / 45)
//     },
//     a = Math.random,
//     f = {
//         x: null,
//         y: null,
//         max: 20000
//     };
//     u.id = c;
//     u.style.cssText = "position:fixed;top:0;left:0;z-index:" + s.z + ";opacity:" + s.o;
//     j("body")[0].appendChild(u);
//     k(),
//     window.onresize = k;
//     window.onmousemove = function(i) {
//         i = i || window.event,
//         f.x = i.clientX,
//         f.y = i.clientY
//     },
//     window.onmouseout = function() {
//         f.x = null,
//         f.y = null
//     };
//     for (var t = [], p = 0; s.n > p; p++) {
//         var h = a() * r,
//         g = a() * n,
//         q = 2 * a() - 1,
//         d = 2 * a() - 1;
//         t.push({
//             x: h,
//             y: g,
//             xa: q,
//             ya: d,
//             max: 6000
//         })
//     }
//     setTimeout(function() {
//         b()
//     },
//     100)
// } ();

// 星空 + 流星背景优化版
// !function () {
//     function j(i) {
//         return document.getElementsByTagName(i);
//     }
//     function k() {
//         r = u.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
//         n = u.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
//     }
//     function b() {
//         e.clearRect(0, 0, r, n);

//         // 绘制星星
//         stars.forEach(function (s) {
//             s.alpha += (Math.random() - 0.5) * 0.05;
//             s.alpha = Math.max(0.1, Math.min(1, s.alpha));
//             e.beginPath();
//             e.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
//             e.fillStyle = "rgba(255,255,255," + s.alpha + ")";
//             e.fill();
//         });

//         // 绘制流星
//         meteors.forEach(function (m, i) {
//             var grad = e.createLinearGradient(m.x, m.y, m.x + m.dx * m.length, m.y + m.dy * m.length);
//             grad.addColorStop(0, "rgba(255,255,255," + m.opacity + ")"); // 头部亮
//             grad.addColorStop(0.3, "rgba(255,255,200," + (m.opacity * 0.8) + ")"); // 中间微黄
//             grad.addColorStop(1, "rgba(0,0,0,0)"); // 尾部完全透明

//             e.beginPath();
//             e.strokeStyle = grad;
//             e.lineWidth = 2;
//             e.moveTo(m.x, m.y);
//             e.lineTo(m.x + m.dx * m.length, m.y + m.dy * m.length);
//             e.stroke();

//             // 更新位置
//             m.x += m.dx;
//             m.y += m.dy;
//             m.opacity -= 0.005; // 更慢消失
//             if (m.opacity <= 0 || m.y > n || m.x < 0) meteors.splice(i, 1);
//         });

//         m(b);
//     }

//     var u = document.createElement("canvas"),
//         e = u.getContext("2d"),
//         r, n,
//         m = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (i) { setTimeout(i, 1000 / 45) };

//     u.style.cssText = "position:fixed;top:0;left:0;z-index:-1;";
//     j("body")[0].appendChild(u);
//     k();
//     window.onresize = k;

//     // 星星
//     var stars = [];
//     for (var i = 0; i < 200; i++) {
//         stars.push({
//             x: Math.random() * window.innerWidth,
//             y: Math.random() * window.innerHeight,
//             radius: Math.random() * 1.2,
//             alpha: Math.random()
//         });
//     }

//     // 流星
//     var meteors = [];
//     setInterval(function () {
//         meteors.push({
//             x: Math.random() * r,          // 起始位置随机
//             y: Math.random() * n * 0.3,    // 大部分从上方或中上方出现
//             dx: -6 - Math.random() * 4,    // 速度随机（水平偏左下）
//             dy: 6 + Math.random() * 4,
//             length: 150 + Math.random() * 150, // 流星长短不同
//             opacity: 1
//         });
//     }, 1800 + Math.random() * 2000); // 出现时间不规则

//     setTimeout(function () {
//         b();
//     }, 100);
// }();

// 放射状脉动几何网格
!function(){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.style.cssText = "position:fixed;top:0;left:0;z-index:-1;pointer-events:none;";
    document.body.appendChild(canvas);

    var w,h;
    var center = {x:0,y:0};
    var rings = 10;       // 放射圆层数
    var rays = 36;        // 放射射线数量
    var points = [];

    function createGrid(){
        points = [];
        center.x = w/2;
        center.y = h/2;

        // 生成环上点
        for(var r=1; r<=rings; r++){
            var radius = r*Math.min(w,h)/30;
            for(var i=0; i<rays; i++){
                var angle = (i/rays)*Math.PI*2;
                points.push({
                    baseX: center.x + Math.cos(angle)*radius,
                    baseY: center.y + Math.sin(angle)*radius,
                    angle: angle,
                    radius: radius,
                    phase: Math.random()*Math.PI*2
                });
            }
        }
    }

    function resize(){
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        createGrid();
    }
    window.addEventListener("resize",resize);
    resize();

    function draw(){
        ctx.clearRect(0,0,w,h);

        var time = performance.now()*0.002;

        // 绘制放射线
        for(var i=0;i<rays;i++){
            ctx.beginPath();
            ctx.moveTo(center.x,center.y);
            ctx.lineTo(center.x + Math.cos(i/rays*2*Math.PI)*w,
                       center.y + Math.sin(i/rays*2*Math.PI)*h);
            ctx.strokeStyle = "rgba(0,180,255,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 绘制环与脉动点
        points.forEach(p=>{
            var pulse = Math.sin(time + p.phase)*5;
            var x = center.x + Math.cos(p.angle)*(p.radius + pulse);
            var y = center.y + Math.sin(p.angle)*(p.radius + pulse);

            // 小圆点
            ctx.beginPath();
            ctx.arc(x,y,2 + Math.abs(pulse)/2,0,Math.PI*2);
            ctx.fillStyle = "rgba(0,255,255,0.8)";
            ctx.fill();

            // 可选环线
            ctx.beginPath();
            ctx.arc(center.x,center.y,p.radius + pulse,0,Math.PI*2);
            ctx.strokeStyle = "rgba(0,150,255,0.1)";
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        requestAnimationFrame(draw);
    }

    draw();
}();


