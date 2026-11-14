precision highp float;
uniform vec2 resolution;
uniform vec3 eye, target, plugOffset;
uniform float time, focal, stageAlpha;
uniform vec3 accent;
const float PI = 3.14159265;
const float INF = 1000.;
const float core = .245;
const vec3 worldUp = vec3(0.,1.,0.);

float radius(int i) {
    if(i==0) return 1.;
    if(i==1) return .890;
    if(i==2) return .716;
    if(i==3) return .474;
    return core;
}
float inset(int i) { return .007 + .015 * float(i); }
float ramp(float start,float end,float t) { return smoothstep(start,end,t); }
mat2 turn(float a) { return mat2(cos(a),sin(a),-sin(a),cos(a)); }

// Nearest valid boundary of each concentric solid. The open wedge faces the lens.
struct Hit { float dist; vec3 normal; vec3 local; float layer; float face; };
void consider(inout Hit h,float d,vec3 normal,vec3 local,float layer,float face){
    if(d>.001 && d<h.dist) {h=Hit(d,normal,local,layer,face);}
}
void sphereSurface(inout Hit h,vec3 o,vec3 d,int layer,bool lid){
    float r=radius(layer), b=dot(o,d), k=b*b-dot(o,o)+r*r;
    if(k<0.)return;
    float dist=-b-sqrt(k);
    vec3 p=o+dist*d;
    bool open=min(min(p.x,p.y),p.z)>inset(layer);
    if(layer==4 || open==lid) consider(h,dist,p/r,p,float(layer),0.);
}
void section(inout Hit h,vec3 o,vec3 d,bool lid){
    for(int i=0;i<4;i++){
        sphereSurface(h,o,d,i,lid);
        for(int a=0;a<3;a++){
            vec3 n=a==0?vec3(1,0,0):a==1?worldUp:vec3(0,0,1);
            float slope=dot(n,d);
            if(abs(slope)<.0001)continue;
            float t=(inset(i)-dot(n,o))/slope;
            if(t<.001 || t>h.dist)continue;
            vec3 p=o+t*d;
            float r=length(p);
            if(min(min(p.x,p.y),p.z)<inset(i)-.0001 || r>radius(i) || r<radius(i+1))continue;
            consider(h,t,lid?-n:n,p,float(i),float(a+1));
        }
    }
}
float strip(vec3 dir,vec3 center,vec3 longAxis,float width,float lengthScale){
    center=normalize(center);
    longAxis=normalize(longAxis-center*dot(longAxis,center));
    vec3 across=cross(center,longAxis);
    float front=dot(dir,center);
    vec2 uv=vec2(dot(dir,across),dot(dir,longAxis))/max(.01,front);
    vec2 edge=abs(uv)/vec2(width,lengthScale);
    return smoothstep(.1,.5,front)*(1.-smoothstep(.75,1.12,max(edge.x,edge.y)));
}
vec3 environment(vec3 r,float rough){
    vec3 col=mix(vec3(.001,.003,.007),vec3(.17,.23,.30),smoothstep(-.45,.8,r.y));
    col+=vec3(1.8,1.96,2.1)*strip(r,vec3(-.60,.83,.7),vec3(.0,1.,.5),.09+rough*.18,1.0);
    col+=vec3(.48,.68,1.1)*strip(r,vec3(.9,.38,-.2),vec3(.12,1.,.1),.11+rough*.2,.86);
    col+=vec3(1.6,1.06,.62)*strip(r,vec3(-.72,.26,-.48),worldUp,.10+rough*.15,.75);
    col+=vec3(.98,1.07,1.16)*strip(r,vec3(.16,.9,.8),vec3(1.,0.,0.),.029+rough*.08,.69);
    return col;
}
void pedestal(inout Hit h,vec3 o,vec3 d,float r,float top,float bottom,float layer){
    float t=(top-o.y)/d.y;
    vec3 p=o+d*t;
    if(length(p.xz)<r)consider(h,t,worldUp,p,layer,4.);
    float a=dot(d.xz,d.xz), b=dot(o.xz,d.xz), c=dot(o.xz,o.xz)-r*r;
    if(b*b-a*c<0.)return;
    t=(-b-sqrt(b*b-a*c))/a; p=o+d*t;
    if(p.y>bottom && p.y<top)consider(h,t,normalize(vec3(p.x,0,p.z)),p,layer,5.);
}
float lightPulse(float t,float center,float spread){float x=(t-center)/spread;return exp(-x*x);}
vec3 shade(Hit hit,vec3 dir){
    vec3 p=hit.local, n=hit.normal;
    float r=length(p), layer=hit.layer;
    float longitude=atan(p.z,p.x);
    float angle=hit.face<1.?longitude:hit.face<2.?atan(p.y,p.z):hit.face<3.?atan(p.z,p.x):atan(p.y,p.x);
    float outer=radius(int(min(layer,4.)));
    float inner=radius(int(min(layer+1.,4.)));
    float edgeRatio=clamp((r-inner)/max(.001,outer-inner),0.,1.);
    vec3 outward=normalize(p);
    // Rounded edges catch reflected studio lights on both sides of each machined band.
    if(hit.face>0. && layer<4.){
        float shoulder=exp(-max(0.,outer-r)*135.)-exp(-max(0.,r-inner)*110.);
        n=normalize(n+.87*shoulder*outward);
        if(layer>.5 && layer<1.5)n=normalize(n+.22*sin(edgeRatio*4.6)*outward);
        if(layer>2.5)n=normalize(n+.27*sin(r*170.)*outward);
    }
    float radialTick=pow(max(0.,cos(angle*154.)),12.);
    float mill=.5+.5*cos(r*710.+.19*sin(angle*32.));
    vec3 albedo;
    float metal=.7,rough=.26;
    if(layer<.5){albedo=vec3(.012,.021,.03);metal=.94;rough=.085;}
    else if(layer<1.5){albedo=vec3(.61,.32,.127);}
    else if(layer<2.5){albedo=vec3(.80,.79,.69);metal=.36;rough=.31;}
    else if(layer<3.5){albedo=vec3(.16,.24,.28);metal=.79;}
    else if(layer<4.5){albedo=accent;}
    else {albedo=vec3(.015,.023,.028);metal=.75;}
    float pattern=1.;
    if(hit.face>0. && layer<4.){
        pattern*=.86+.14*mill;
        if(layer<.5)pattern*=1.-.48*radialTick;
        if(layer>2.5)pattern*=.70+.30*smoothstep(-.1,.6,sin(r*250.));
        float rim=layer<.5?.89:layer<1.5?.716:layer<2.5?.474:.245;
        if(r-rim<.009)pattern*=.48;
        if(layer>1.5 && layer<2.5 && r>.656 && r<.691)pattern*=1.-.51*radialTick;
    }
    float diffuse=.19+.73*max(0.,dot(n,normalize(vec3(-.8,1.4,1.))))+.28*max(0.,dot(n,normalize(vec3(1.,.5,-.2))));
    vec3 refl=environment(reflect(dir,n),rough);
    float fres=pow(1.-clamp(dot(-dir,n),0.,1.),3.);
    vec3 col=pattern*(albedo*diffuse*(1.-.68*metal)+refl*(.065+albedo*metal))+refl*fres*.30;
    if(hit.face>0. && layer<4.){
        float wallDistance=hit.face<2.?min(p.y,p.z):hit.face<3.?min(p.x,p.z):min(p.x,p.y);
        float cornerShade=1.-.41*exp(-max(0.,wallDistance-.03)*11.);
        float contact=1.-.53*exp(-max(0.,r-inner)*59.);
        col*=cornerShade*contact;
        float sweep=pow(max(0.,cos(angle*3.5-.3)),18.);
        col+=vec3(.95,.79,.56)*sweep*(.065+.34*exp(-abs(r-outer)*160.));
        if(layer>.5 && layer<1.5){
            float gear=pow(max(0.,cos(angle*76.)),8.)*(1.-smoothstep(.018,.040,abs(edgeRatio-.52)));
            col=mix(col,vec3(.10,.061,.027),.68*gear);
        }
    }
    if(layer<.5 && hit.face==0.) {
        vec3 rx=reflect(dir,n);
        col+=vec3(1.05,1.24,1.4)*strip(rx,vec3(.55,.83,.18),vec3(1.,-.15,0.),.045,.81);
        col+=vec3(1.32,.82,.44)*strip(rx,vec3(-.5,.72,.31),worldUp,.058,.78);
    }
    if(hit.face==0. && layer<.5){
        float seam=min(min(abs(p.x-inset(0)),abs(p.y-inset(0))),abs(p.z-inset(0)));
        if(min(min(p.x,p.y),p.z)>-.01)col+=accent*exp(-seam*140.)*lightPulse(time,.94,.35)*2.;
    }
    if(hit.face>0. && layer<4.)col+=accent*(.012+.4*lightPulse(time,4.35+.42*r,.11))*exp(-.85*r);
    if(layer>3.5 && layer<4.5){
        float bands=.32+.27*cos(p.y*126.)+.15*cos(longitude*20.);
        float heat=.75+.18*sin(time*2.8)+3.6*lightPulse(time,4.4,.14);
        col=accent*(.39+bands*heat)*(.30+1.5*diffuse*diffuse)+vec3(1.,.81,.41)*pow(max(0.,dot(n,normalize(vec3(.4,.6,.8)))),8.)*.9;
    }
    if(layer<4. && hit.face>0.)col+=accent*lightPulse(time,4.38+r*.52,.058)*1.8;
    return col;
}
void main(){
    vec2 uv=(2.*gl_FragCoord.xy-resolution)/resolution.y;
    vec3 f=normalize(target-eye), right=normalize(cross(f,worldUp)), up=cross(right,f);
    vec3 d=normalize(f*focal+right*uv.x+up*uv.y);
    Hit hit=Hit(INF,worldUp,vec3(0),0.,0.);
    section(hit,eye,d,false); sphereSurface(hit,eye,d,4,false);
    vec3 movedEye=eye-plugOffset, movedDir=d;
    float lidTurn=.38*ramp(1.16,2.14,time);
    movedEye.xy=turn(-lidTurn)*movedEye.xy; movedDir.xy=turn(-lidTurn)*movedDir.xy;
    Hit lid=Hit(INF,worldUp,vec3(0),0.,0.);
    section(lid,movedEye,movedDir,true);
    if(lid.dist<hit.dist){hit=lid;hit.normal.xy=turn(lidTurn)*hit.normal.xy;}
    pedestal(hit,eye,d,.48,-.935,-1.015,6.);
    pedestal(hit,eye,d,.65,-1.005,-1.068,6.);
    float floorDist=(-1.07-eye.y)/d.y;
    vec3 ground=eye+floorDist*d;
    vec3 bg=mix(vec3(.0015,.0027,.0048),vec3(.010,.015,.021),exp(-dot(uv-vec2(-.18,.15),uv-vec2(-.18,.15))*2.1));
    if(floorDist>0.){
        float shadow=exp(-dot(ground.xz,ground.xz)*1.95);
        bg*=1.-.81*shadow;
        bg+=vec3(.009,.012,.018)*exp(-dot(ground.xz-vec2(-1.,-1.4),ground.xz-vec2(-1.,-1.4))*.37);
    }
    vec3 color=hit.dist<INF?shade(hit,d):bg;
    // The travelling light has a sharp filament, a warm halo, and a soft falloff at each end.
    float beam=abs(uv.x-(mix(-.92,.95,ramp(.13,1.13,time))+.21*uv.y));
    float gate=ramp(.12,.39,time)*(1.-ramp(.91,1.2,time))*exp(-pow(abs(uv.y-.12)/.58,4.));
    color+=gate*(accent*exp(-beam*87.)*1.2+vec3(1.,.9,.72)*exp(-beam*600.)*4.);
    float coreDist=length(cross(eye,d));
    float exposed=ramp(1.42,2.1,time);
    color+=accent*.15*exposed*exp(-coreDist*8.)*(1.+5.*lightPulse(time,4.41,.145));
    // Sparks travel away from the moving seam and, later, from the core.
    for(int i=0;i<26;i++){
        float seed=float(i), rand=fract(sin(seed*71.31+1.54)*7158.43);
        float birth=i<15 ? .65+rand*.41 : 4.37+rand*.11;
        float age=time-birth;
        if(age<=0. || age>.49)continue;
        float a=rand*6.283+seed*1.31;
        vec3 origin=i<15 ? vec3(.41+rand*.15,.13+rand*.65,.66) : vec3(.12,.14,.16);
        vec3 v=vec3(cos(a),.35+rand,sin(a))*(.78+rand*1.25);
        vec3 pos=origin+v*age-worldUp*age*age*1.1;
        vec3 delta=pos-eye;
        float miss=length(cross(delta,d));
        float sparkle=exp(-miss*miss*20000.)*(1.-smoothstep(.04,.48,age));
        color+=vec3(1.,.54,.21)*sparkle;
    }
    color=pow(1.-exp(-color*1.52),vec3(.48));
    gl_FragColor=vec4(color,hit.dist<INF?1.:max(stageAlpha,gate*exp(-beam*90.)));
}
