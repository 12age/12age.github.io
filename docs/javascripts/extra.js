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

// 线条背景
!function() {
    function o(w, v, i) {
        return w.getAttribute(v) || i
    }
    function j(i) {
        return document.getElementsByTagName(i)
    }
    function l() {
        var i = j("script"),
        w = i.length,
        v = i[w - 1];
        return {
            l: w,
            z: o(v, "zIndex", -1),
            o: o(v, "opacity", 0.5),
            c: o(v, "color", "0,0,0"),
            n: o(v, "count", 99)
        }
    }
    function k() {
        r = u.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        n = u.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
    function b() {
        e.clearRect(0, 0, r, n);
        var w = [f].concat(t);
        var x, v, A, B, z, y;
        t.forEach(function(i) {
            i.x += i.xa,
            i.y += i.ya,
            i.xa *= i.x > r || i.x < 0 ? -1 : 1,
            i.ya *= i.y > n || i.y < 0 ? -1 : 1,
            e.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);
            for (v = 0; v < w.length; v++) {
                x = w[v];
                if (i !== x && null !== x.x && null !== x.y) {
                    B = i.x - x.x,
                    z = i.y - x.y,
                    y = B * B + z * z;
                    y < x.max && (x === f && y >= x.max / 2 && (i.x -= 0.03 * B, i.y -= 0.03 * z), A = (x.max - y) / x.max, e.beginPath(), e.lineWidth = A / 2, e.strokeStyle = "rgba(" + s.c + "," + (A + 0.2) + ")", e.moveTo(i.x, i.y), e.lineTo(x.x, x.y), e.stroke())
                }
            }
            w.splice(w.indexOf(i), 1)
        }),
        m(b)
    }
    var u = document.createElement("canvas"),
    s = l(),
    c = "c_n" + s.l,
    e = u.getContext("2d"),
    r,
    n,
    m = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(i) {
        window.setTimeout(i, 1000 / 45)
    },
    a = Math.random,
    f = {
        x: null,
        y: null,
        max: 20000
    };
    u.id = c;
    u.style.cssText = "position:fixed;top:0;left:0;z-index:" + s.z + ";opacity:" + s.o;
    j("body")[0].appendChild(u);
    k(),
    window.onresize = k;
    window.onmousemove = function(i) {
        i = i || window.event,
        f.x = i.clientX,
        f.y = i.clientY
    },
    window.onmouseout = function() {
        f.x = null,
        f.y = null
    };
    for (var t = [], p = 0; s.n > p; p++) {
        var h = a() * r,
        g = a() * n,
        q = 2 * a() - 1,
        d = 2 * a() - 1;
        t.push({
            x: h,
            y: g,
            xa: q,
            ya: d,
            max: 6000
        })
    }
    setTimeout(function() {
        b()
    },
    100)
} ();