import * as THREE from 'three';
import { ribbonVert, ribbonFrag, dustVert, dustFrag } from './shaders';

const ACCENT = new THREE.Color('#ff4a1c');

/**
 * One renderer, one canvas, one rAF loop. Throws if WebGL is unavailable
 * (the caller shows the CSS fallback).
 * `state` is a plain object mutated by GSAP: { progress, reveal, intro }.
 */
export function createScene(canvas, state, { mobile, reduced }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 0, 9);
  const group = new THREE.Group();
  scene.add(group);

  // ── Film ribbon: a trefoil knot swept as a flat strip ──────────────────────
  const pts = [];
  const N = 14;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t), -Math.sin(3 * t)).multiplyScalar(0.95)
    );
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
  const SEG = mobile ? 360 : 700;
  const frames = curve.computeFrenetFrames(SEG, true);
  const W = 0.42;
  const pos = [];
  const nor = [];
  const uvs = [];
  const idx = [];
  for (let i = 0; i <= SEG; i++) {
    const u = i / SEG;
    const p = curve.getPoint(u % 1);
    const b = frames.binormals[i];
    const n = frames.normals[i];
    pos.push(p.x - b.x * W, p.y - b.y * W, p.z - b.z * W, p.x + b.x * W, p.y + b.y * W, p.z + b.z * W);
    nor.push(n.x, n.y, n.z, n.x, n.y, n.z);
    uvs.push(u, 0, u, 1);
    if (i < SEG) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  ribbonGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  ribbonGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  ribbonGeo.setIndex(idx);

  const ribbonMat = new THREE.ShaderMaterial({
    vertexShader: ribbonVert,
    fragmentShader: ribbonFrag,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uExplode: { value: 0 },
      uLen: { value: 100 },
      uAccent: { value: ACCENT },
    },
  });
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  group.add(ribbon);

  // ── Dust: cheap points, reacts to the pointer ──────────────────────────────
  const COUNT = mobile ? 140 : 520;
  const dp = new Float32Array(COUNT * 3);
  const ds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.random() * 5;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    dp[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.3;
    dp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    dp[i * 3 + 2] = r * Math.cos(ph) - 2;
    ds[i] = Math.random();
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(ds, 1));
  const dustMat = new THREE.ShaderMaterial({
    vertexShader: dustVert,
    fragmentShader: dustFrag,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPixel: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uAccent: { value: ACCENT },
    },
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── Sizing ─────────────────────────────────────────────────────────────────
  let w = 1;
  let h = 1;
  const resize = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    dustMat.uniforms.uPixel.value = dpr;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  // ── Loop ───────────────────────────────────────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf = 0;
  let visible = true;
  let time = 0;
  let last = performance.now();
  const ease = (x) => x * x * (3 - 2 * x);

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden || !visible) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduced) time += dt;
    const k = Math.min(1, dt * 3);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;

    const p = state.progress;
    const e = ease(Math.min(1, Math.max(0, (p - 0.1) / 0.8)));

    ribbonMat.uniforms.uTime.value = time;
    ribbonMat.uniforms.uReveal.value = state.reveal;
    ribbonMat.uniforms.uExplode.value = e * 1.2;
    dustMat.uniforms.uTime.value = time;
    dustMat.uniforms.uPointer.value.set(pointer.x, pointer.y);

    group.rotation.y = time * 0.12 + pointer.x * 0.35 + p * Math.PI * 1.2;
    group.rotation.x = -pointer.y * 0.2 + p * 0.5;
    group.rotation.z = Math.sin(time * 0.2) * 0.05;
    const s = (mobile ? 0.55 : 0.8) * (1 - e * 0.5) * (0.85 + 0.15 * state.intro);
    group.scale.setScalar(s);
    group.position.x = mobile ? 0 : 1.7 * (1 - e);
    group.position.y = (mobile ? 1.5 : 0.1) + e * 1.2;
    camera.position.z = 9 + e * 5;
    dust.rotation.y = time * 0.02 + p * 0.6;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    resize,
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    setActive(v) {
      visible = v;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ribbonGeo.dispose();
      ribbonMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
