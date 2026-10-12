export const ribbonVert = /* glsl */ `
uniform float uTime;
uniform float uExplode;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;

float n3(vec3 p){
  return sin(p.x*1.7+uTime*.6)*sin(p.y*1.3-uTime*.5)*sin(p.z*1.9+uTime*.4);
}

void main(){
  vec3 p = position;
  float d = n3(p*1.2)*0.16 + n3(p*3.1)*0.05;
  p += normal * d;
  // scroll-driven fragmentation: strips drift apart along their normal
  float e = uExplode;
  p += normal * sin(uv.x*60.0) * 0.9 * e;
  p += normalize(position + 0.001) * e * 2.4 * (0.5 + 0.5*sin(uv.x*40.0 + uv.y*3.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  vUv = uv;
  gl_Position = projectionMatrix * mv;
}
`;

export const ribbonFrag = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uLen;
uniform vec3 uAccent;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;

void main(){
  if (vUv.x > uReveal) discard;
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(vV);
  float fres = pow(1.0 - abs(dot(N, V)), 2.6);

  // cheap studio-light environment: soft bands + one hard highlight
  vec3 R = reflect(-V, N);
  float band = smoothstep(.2, .9, sin(R.y*5.0 + R.x*2.0 + uTime*.3)*.5 + .5);
  vec3 col = mix(vec3(.03,.032,.036), vec3(.78,.76,.72), band*.55);
  col += vec3(.9,.88,.84) * pow(max(dot(R, normalize(vec3(.4,.8,.5))), 0.0), 24.0) * 1.2;
  col += uAccent * fres * 1.1;

  // film-strip detailing: sprocket holes, accent frame line, frame ticks
  float edge = min(vUv.y, 1.0 - vUv.y);
  float band2 = step(.045, edge) * (1.0 - step(.14, edge));
  float cell = fract(vUv.x * uLen);
  float perf = step(.25, cell) * (1.0 - step(.75, cell));
  col = mix(col, vec3(.01), band2 * perf * .92);
  float line = 1.0 - smoothstep(.0, .006, abs(edge - .17));
  col = mix(col, uAccent, line * .85);
  float tick = step(.94, fract(vUv.x * uLen * .25)) * step(.2, edge);
  col *= 1.0 - tick * .6;

  // glowing leading edge while the ribbon draws itself in
  float rv = 1.0 - smoothstep(.0, .02, uReveal - vUv.x);
  col += uAccent * rv * 1.5 * (1.0 - step(.999, uReveal));
  gl_FragColor = vec4(col, 1.0);
}
`;

export const dustVert = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uPixel;
uniform vec2 uPointer;
varying float vSeed;
void main(){
  vec3 p = position;
  p.y += sin(uTime*.2 + p.x*.8 + aSeed*6.28) * .25;
  p.x += cos(uTime*.15 + p.y*.6 + aSeed*6.28) * .2;
  p.xy += uPointer * (0.4 + aSeed) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.5 + aSeed * 3.0) * uPixel * (7.0 / -mv.z);
  vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
}
`;

export const dustFrag = /* glsl */ `
uniform vec3 uAccent;
varying float vSeed;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, .0, d) * .55;
  vec3 c = vSeed > .93 ? uAccent : vec3(.94,.91,.86);
  gl_FragColor = vec4(c, a);
}
`;
