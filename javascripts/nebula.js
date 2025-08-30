// 星云 Shader 背景（WebGL + GLSL）
!function () {
    // —— 基础 DOM / WebGL 初始化 ——
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true });
    if (!gl) { console.error('WebGL not supported'); return; }
    canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;';
    document.body.appendChild(canvas);

    function resize() {
        var w = window.innerWidth, h = window.innerHeight, dpr = Math.min(window.devicePixelRatio || 1.0, 2.0);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // —— 顶点/片元着色器 ——（full-screen quad + 星云噪声）
    var vertSrc = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

    // ★ 片元着色器：FBM 噪声生成星云，带调色板与轻微鼠标扰动
    var fragSrc = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse; // 0~1
    // --- hash & noise ---
    float hash( vec2 p ){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise( vec2 p ){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      float a = hash(i + vec2(0.0,0.0));
      float b = hash(i + vec2(1.0,0.0));
      float c = hash(i + vec2(0.0,1.0));
      float d = hash(i + vec2(1.0,1.0));
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    }
    // fbm
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
      for (int i=0; i<6; i++){
        v += a * noise(p);
        p = m * p * 2.0;
        a *= 0.5;
      }
      return v;
    }
    // 调色板
    vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
      return a + b * cos(6.28318 * (c*t + d));
    }
    void main(){
      vec2 uv = (gl_FragCoord.xy / u_resolution.xy);
      // 居中坐标，等比缩放
      vec2 p = (gl_FragCoord.xy - 0.5*u_resolution.xy) / min(u_resolution.x, u_resolution.y);

      // 鼠标轻微扰动与时间流动
      float t = u_time * 0.05;
      vec2 mouseWarp = (u_mouse - 0.5) * 1.5;           // -0.75..0.75
      vec2 q = p;
      q += 0.15 * vec2(sin(t*1.7 + p.y*2.0), cos(t*1.3 + p.x*2.0));
      q += 0.25 * mouseWarp;

      // 多层 fbm 叠加
      float n1 = fbm(q*2.0 + t);
      float n2 = fbm((q + 3.7)*3.0 - t*0.7);
      float n3 = fbm((q*1.5 - 2.1) - t*1.2);
      float neb = (n1*0.6 + n2*0.3 + n3*0.1);

      // 星云亮度与对比度
      float density = smoothstep(0.25, 0.95, neb);
      float glow = pow(density, 1.4);

      // 颜色：用调色板生成科幻星云色
      // a 基色, b 幅度, c 频率, d 相位
      vec3 colA = palette(neb + t*0.2, vec3(0.25,0.18,0.35), vec3(0.55,0.45,0.65), vec3(0.9,0.7,0.5), vec3(0.2,0.3,0.6));
      vec3 colB = palette(neb - t*0.1, vec3(0.05,0.10,0.15), vec3(0.45,0.35,0.65), vec3(0.7,0.9,0.6), vec3(0.0,0.15,0.3));
      vec3 nebula = mix(colB, colA, glow);

      // 星点（在星云上撒点）
      float star = 0.0;
      vec2 sp = p*vec2(1.2,1.2) + vec2(10.0);
      float sn = noise(sp*40.0 + t*20.0);
      star = smoothstep(0.995, 1.0, sn) * 0.9;             // 亮星
      // 微弱星尘
      float dust = smoothstep(0.97, 1.0, noise(sp*15.0 - t*10.0)) * 0.25;

      vec3 color = nebula + vec3(star) + vec3(dust);

      // 暗角（更像深空）
      float vign = smoothstep(1.2, 0.2, length(p));
      color *= mix(0.65, 1.0, vign);

      // 最终输出（稍微提升亮度）
      gl_FragColor = vec4(pow(color, vec3(0.95)), 1.0);
    }
  `;

    // —— 编译链接 ——
    function compile(gl, type, src) {
        var sh = gl.createShader(type);
        gl.shaderSource(sh, src); gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(sh)); gl.deleteShader(sh); return null;
        }
        return sh;
    }
    var vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
    var fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog)); return;
    }
    gl.useProgram(prog);

    // —— 全屏三角形（更省）——
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // 2D 大三角覆盖全屏
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 3, -1, -1, 3
    ]), gl.STATIC_DRAW);
    var a_pos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(a_pos);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

    // —— Uniforms ——
    var u_time = gl.getUniformLocation(prog, 'u_time');
    var u_res = gl.getUniformLocation(prog, 'u_resolution');
    var u_mouse = gl.getUniformLocation(prog, 'u_mouse');

    var start = performance.now();
    var mouse = { x: 0.5, y: 0.5 };
    function onMove(e) {
        var x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        var y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        mouse.x = x / window.innerWidth;
        mouse.y = 1.0 - y / window.innerHeight;
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    // —— 动画循环 ——
    function frame() {
        var t = (performance.now() - start) / 1000;
        gl.uniform1f(u_time, t);
        gl.uniform2f(u_res, canvas.width, canvas.height);
        gl.uniform2f(u_mouse, mouse.x, mouse.y);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}();