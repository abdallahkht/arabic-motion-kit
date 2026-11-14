// A deterministic frame function lets the editor scrub, reverse and export the same shot.
function mountCutaway(root, fragment, config) {
  const canvas = root.querySelector('canvas');
  const gl = canvas.getContext('webgl', {alpha:true, antialias:false, premultipliedAlpha:false, preserveDrawingBuffer:true});
  if (!gl) throw new Error('This 3D scene needs WebGL enabled.');
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, 'attribute vec2 corner; void main(){gl_Position=vec4(corner,0.,1.);}'],
    [gl.FRAGMENT_SHADER, fragment]
  ]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'corner');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const loc = Object.fromEntries(['eye','target','resolution','time','focal','plugOffset','stageAlpha','accent']
    .map(name => [name, gl.getUniformLocation(program,name)]));
  const w=canvas.width, h=canvas.height;
  gl.viewport(0,0,w,h);
  gl.uniform2f(loc.resolution,w,h);
  gl.uniform1f(loc.stageAlpha,config.transparent ? 0 : 1);
  const linear = v => Math.pow(parseInt(v,16)/255,2.2);
  gl.uniform3fv(loc.accent,config.accent.match(/[0-9a-f]{2}/gi).map(linear));
  const norm = v => v.map(x => x/Math.hypot(...v));
  const dot = (a,b) => a.reduce((sum,v,i)=>sum+v*b[i],0);
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const smooth = (start,end,t) => {
    const u=Math.max(0,Math.min(1,(t-start)/(end-start))); return u*u*(3-2*u);
  };
  const rows = [...root.querySelectorAll('[data-layer]')];
  const title = root.querySelector('[data-title]');
  const final = root.querySelector('[data-final]');
  const layers = [1,.89,.716,.474,.245];
  const compact = h/w<1.3;
  return function draw(seconds) {
    const t=seconds*5.9/config.duration;
    const push=smooth(.9,4.4,t);
    const angle=.57+.21*smooth(0,3.55,t)+.056*smooth(3.55,5.9,t);
    const distance=5.9-.56*push;
    const eye=[distance*Math.sin(angle)*.83, distance*.55, distance*Math.cos(angle)*.83];
    const target=[0,compact ? -.03 : -.22-.24*push,0];
    if(compact){target[0]+=.49;target[2]-=.49;}
    const f=norm(target.map((x,i)=>x-eye[i])), right=norm(cross(f,[0,1,0])), up=cross(right,f);
    const focal=(compact?1.75:2.25)*(1+.05*push+.026*Math.exp(-Math.pow((t-4.42)/.13,2)));
    const lift=smooth(1.12,2.15,t);
    gl.uniform3fv(loc.eye,eye);
    gl.uniform3fv(loc.target,target);
    gl.uniform3f(loc.plugOffset,-.66*lift,5.65*lift,.32*lift);
    gl.uniform1f(loc.focal,focal);
    gl.uniform1f(loc.time,t);
    gl.drawArrays(gl.TRIANGLES,0,3);
    const project = p => {
      const v=p.map((x,i)=>x-eye[i]), depth=dot(v,f);
      return [(1+focal*dot(v,right)/depth*h/w)*500,(1-focal*dot(v,up)/depth)*500];
    };
    title.style.opacity=String(1-smooth(1.07,1.72,t));
    rows.forEach((row,i)=>{
      const begin=rows.length===1?4.15:1.81+2.38*i/(rows.length-1);
      const show=smooth(begin,begin+.30,t);
      const idx=Math.round(i*4/Math.max(1,rows.length-1));
      const radius=idx===4?.125:(layers[idx]+layers[idx+1])*.5;
      const a=1.25-idx*.18;
      const pin=project([Math.cos(a)*radius,.012+idx*.015,Math.sin(a)*radius]);
      const y=compact?385+i*70:617+i*44;
      const elbow=compact?660+i*12:483+i*31;
      const end=compact?804:782;
      const line=row.querySelector('path'), point=row.querySelector('circle'), label=row.querySelector('div');
      line.setAttribute('d', 'M '+pin[0]+' '+pin[1]+' L '+elbow+' '+y+' H '+end);
      line.style.opacity=String(show);
      line.style.strokeDashoffset=String(1-show);
      point.setAttribute('cx',pin[0]); point.setAttribute('cy',pin[1]);
      point.style.opacity=String(show);
      label.style.top=(y*.1)+'%';
      label.style.left=(compact?81:79)+'%';
      label.style.opacity=String(show);
      label.style.transform='translateY(-50%) translateX('+(1-show)*11+'px)';
    });
    const stamp=smooth(4.34,4.57,t);
    final.style.opacity=String(stamp);
    final.style.transform='translateY('+((1-stamp)*18)+'%)';
  };
}
