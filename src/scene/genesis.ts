import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { bus } from './bus'

/**
 * The Genesis scene: three particle streams (crypto / dev / AI) braid into a chain of blocks.
 * Every animatable value lives in `state` or on a `BlockRig`, so GSAP can tween them directly.
 */

export type BlockRig = {
  group: THREE.Group
  faces: Array<{ mesh: THREE.Mesh; normal: THREE.Vector3 }>
  edges: THREE.LineSegments
  core: THREE.Mesh
  base: THREE.Vector3
  /** 0..1 visibility (assembly) */
  on: number
  /** 0..1 scale-in */
  scale: number
  /** 0..1 "opened" — faces pull apart to reveal the glowing core */
  open: number
  /** 0..1 highlighted by scroll */
  lit: number
  label: THREE.CanvasTexture
  labelCanvas: HTMLCanvasElement
}

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const css = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return new THREE.Color(fallback)
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new THREE.Color(v || fallback)
}

export class GenesisScene {
  readonly state = {
    /** 1 while the camera sits close to the genesis block during the intro */
    intro: 1,
    flow: 0.06,
    rush: 0,
    suck: 0,
    spread: 2.4,
    alpha: 0,
    bloom: 0,
    rgb: 0,
    shake: 0,
    packets: 0,
    exposure: 1,
  }
  readonly blocks: BlockRig[] = []
  readonly links: Array<{ line: THREE.Line; geo: THREE.BufferGeometry; draw: number }> = []
  readonly ring: THREE.Mesh

  private renderer: THREE.WebGLRenderer
  private composer: EffectComposer
  private bloomPass: UnrealBloomPass
  private rgbPass: ShaderPass | null = null
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private raf = 0
  private prog = 0
  private uniforms: Record<string, THREE.IUniform>
  private pointer = new THREE.Vector2()
  private pointerS = new THREE.Vector2()
  private pointerW = new THREE.Vector3(999, 999, 0)
  private ray = new THREE.Raycaster()
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  private heroPos: THREE.Vector3
  private heroLook: THREE.Vector3
  private focusS = 0
  private focusPt = new THREE.Vector3()
  private tmpCam = new THREE.Vector3()
  private tmpLook = new THREE.Vector3()
  private lookCur: THREE.Vector3
  private chain = new THREE.Group()
  private glow: THREE.PointLight
  private dust: THREE.Points
  private pkGeo: THREE.BufferGeometry
  private pkMat: THREE.PointsMaterial
  private pkPos: Float32Array
  private packetsU: Array<{ u: number; sp: number }>
  private scrollS = 0
  private outroS = 0
  private velS = 0
  private visible = true
  private io: IntersectionObserver | null = null
  readonly chainPts: THREE.Vector3[] = []
  private readonly introPos = new THREE.Vector3(-1.6, 0.7, 6.2)
  private readonly introLook = new THREE.Vector3(0, 0, 0)
  private colors: { crypto: THREE.Color; dev: THREE.Color; ai: THREE.Color; acc: THREE.Color }

  constructor(private canvas: HTMLCanvasElement, private opts: { mobile: boolean; reduced: boolean }) {
    const { mobile } = opts
    this.colors = { crypto: css('--crypto', '#F5B83D'), dev: css('--dev', '#5AA9FF'), ai: css('--ai', '#B7F05A'), acc: css('--acc', '#FF6A1F') }
    const C = this.colors
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75)

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    this.renderer.setClearColor(0x07080a, 1)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200)
    this.camera.position.copy(this.introPos)
    this.lookCur = this.introLook.clone()
    this.camera.lookAt(this.lookCur)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0, 0.55, 0.18)
    this.composer.addPass(this.bloomPass)
    if (!mobile) {
      this.rgbPass = new ShaderPass(RGBShiftShader)
      this.rgbPass.uniforms['amount'].value = 0
      this.composer.addPass(this.rgbPass)
    }
    this.composer.addPass(new OutputPass())

    const scene = this.scene
    scene.fog = new THREE.FogExp2(0x07080a, 0.026)
    scene.add(new THREE.AmbientLight(0xffffff, 0.16))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(-8, 12, 10)
    scene.add(key)
    const rim = new THREE.DirectionalLight(C.dev, 0.7)
    rim.position.set(10, -4, -10)
    scene.add(rim)
    this.glow = new THREE.PointLight(C.acc, 40, 22, 1.8)
    scene.add(this.glow)

    /* ---------- chain of blocks on a curve that recedes into depth ---------- */
    const N = 10
    for (let i = 0; i < N; i++) this.chainPts.push(new THREE.Vector3(i * 2.5, Math.sin(i * 0.55) * 0.35, -i * 1.1))
    scene.add(this.chain)
    const S = 1.3
    const slab = new THREE.BoxGeometry(S, S, 0.07)
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(S + 0.02, S + 0.02, S + 0.02))
    const coreGeo = new THREE.IcosahedronGeometry(0.26, 0)
    const normals = [
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
    ]
    this.chainPts.forEach((p, i) => {
      const group = new THREE.Group()
      const labelCanvas = document.createElement('canvas')
      labelCanvas.width = labelCanvas.height = 256
      const label = new THREE.CanvasTexture(labelCanvas)
      label.colorSpace = THREE.SRGBColorSpace
      label.anisotropy = 4
      const faces = normals.map((n, fi) => {
        const front = fi === 0
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x0e0f12, metalness: 0.72, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.22,
          transparent: true, opacity: 0,
          map: front ? label : null, emissiveMap: front ? label : null,
          emissive: front ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0), emissiveIntensity: front ? 0.9 : 0,
        })
        const mesh = new THREE.Mesh(slab, mat)
        mesh.lookAt(n)
        mesh.position.copy(n).multiplyScalar(S / 2 - 0.035)
        group.add(mesh)
        return { mesh, normal: n }
      })
      const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: C.acc.clone(), transparent: true, opacity: 0 }))
      group.add(edges)
      const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: C.acc.clone().multiplyScalar(1.6), transparent: true, opacity: 0 }))
      group.add(core)
      group.position.copy(p)
      group.rotation.set(0.42, 0.62 + i * 0.04, 0)
      group.scale.setScalar(0.001)
      this.chain.add(group)
      const rig: BlockRig = { group, faces, edges, core, base: p.clone(), on: 0, scale: 0.72, open: 0, lit: 0, label, labelCanvas }
      this.blocks.push(rig)
      this.drawLabel(rig, i, i === 0 ? 'mining…' : 'pending')
    })
    for (let i = 0; i < N - 1; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: C.acc.clone(), transparent: true, opacity: 0 }))
      this.chain.add(line)
      this.links.push({ line, geo, draw: 0 })
    }
    const PK = 16
    this.pkPos = new Float32Array(PK * 3)
    this.pkGeo = new THREE.BufferGeometry()
    this.pkGeo.setAttribute('position', new THREE.BufferAttribute(this.pkPos, 3))
    this.pkMat = new THREE.PointsMaterial({ color: C.acc.clone().multiplyScalar(3), size: 0.17, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    const pk = new THREE.Points(this.pkGeo, this.pkMat)
    pk.frustumCulled = false
    this.chain.add(pk)
    this.packetsU = Array.from({ length: PK }, (_, i) => ({ u: i / PK, sp: 0.03 + Math.random() * 0.02 }))

    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.985, 1, 160),
      new THREE.MeshBasicMaterial({ color: C.acc.clone().multiplyScalar(3), transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
    )
    this.ring.position.copy(this.chainPts[0])
    scene.add(this.ring)

    /* ---------- GPU particle streams ---------- */
    const PER = mobile ? 2200 : 6500
    const TOTAL = PER * 3
    const A = {
      aStream: new Float32Array(TOTAL), aT0: new Float32Array(TOTAL), aSp: new Float32Array(TOTAL), aR: new Float32Array(TOTAL),
      aPh: new Float32Array(TOTAL), aTw: new Float32Array(TOTAL), aSize: new Float32Array(TOTAL), aCol: new Float32Array(TOTAL * 3),
    }
    const SC = [C.crypto, C.dev, C.ai]
    for (let s = 0; s < 3; s++) {
      for (let i = 0; i < PER; i++) {
        const k = s * PER + i
        A.aStream[k] = s
        A.aT0[k] = Math.random()
        A.aSp[k] = 0.7 + Math.random() * 0.6
        A.aR[k] = Math.pow(Math.random(), 0.65)
        A.aPh[k] = Math.random() * Math.PI * 2
        A.aTw[k] = 2.5 + Math.random() * 5
        A.aSize[k] = 0.5 + Math.pow(Math.random(), 3) * 2.6
        const c = SC[s].clone().multiplyScalar(0.7 + Math.random() * 0.6)
        A.aCol.set([c.r, c.g, c.b], k * 3)
      }
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TOTAL * 3), 3))
    pGeo.setAttribute('aStream', new THREE.BufferAttribute(A.aStream, 1))
    pGeo.setAttribute('aT0', new THREE.BufferAttribute(A.aT0, 1))
    pGeo.setAttribute('aSp', new THREE.BufferAttribute(A.aSp, 1))
    pGeo.setAttribute('aR', new THREE.BufferAttribute(A.aR, 1))
    pGeo.setAttribute('aPh', new THREE.BufferAttribute(A.aPh, 1))
    pGeo.setAttribute('aTw', new THREE.BufferAttribute(A.aTw, 1))
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(A.aSize, 1))
    pGeo.setAttribute('aCol', new THREE.BufferAttribute(A.aCol, 3))
    this.uniforms = {
      uProg: { value: 0 }, uTime: { value: 0 }, uSpread: { value: 2.4 }, uAlpha: { value: 0 }, uPx: { value: dpr },
      uMouse: { value: new THREE.Vector3(999, 999, 0) }, uSuck: { value: 0 }, uTurb: { value: 1 },
      uA: { value: [new THREE.Vector3(-30, 13, -10), new THREE.Vector3(-34, -2, 8), new THREE.Vector3(-28, -15, -4)] },
      uB: { value: [new THREE.Vector3(-16, 10, 3), new THREE.Vector3(-18, -7, -7), new THREE.Vector3(-14, -10, 7)] },
      uC: { value: [new THREE.Vector3(-6, 2.5, -1.5), new THREE.Vector3(-7, -1.5, 3), new THREE.Vector3(-5, -2.5, -2)] },
      uEnd: { value: this.chainPts[0].clone() },
    }
    const pMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aStream, aT0, aSp, aR, aPh, aTw, aSize; attribute vec3 aCol;
        uniform float uProg, uTime, uSpread, uPx, uSuck, uTurb; uniform vec3 uMouse, uEnd; uniform vec3 uA[3], uB[3], uC[3];
        varying vec3 vC; varying float vA;
        vec3 bez(vec3 a, vec3 b, vec3 c, vec3 d, float t){ float u = 1. - t; return u*u*u*a + 3.*u*u*t*b + 3.*u*t*t*c + t*t*t*d; }
        void main(){
          int s = int(aStream + .5);
          float t = fract(aT0 + uProg * aSp);
          t = mix(t, max(t, .82), uSuck * step(.5, aT0));
          vec3 p = bez(uA[s], uB[s], uC[s], uEnd, t);
          float k = 1. - t;
          float rad = aR * uSpread * pow(k, .85);
          float a = aPh + t * aTw + uTime * .35;
          p.y += cos(a) * rad; p.z += sin(a) * rad;
          // cheap turbulence so the streams breathe instead of looking like tubes
          p += vec3(sin(p.y * .35 + uTime * .9 + aPh), cos(p.z * .3 + uTime * .7), sin(p.x * .25 + uTime * .6 + aPh)) * .45 * k * uTurb;
          vec2 d = p.xy - uMouse.xy; float dl = length(d);
          p.xy += normalize(d + 1e-4) * smoothstep(3.2, 0., dl) * 1.5 * (1. - t * .6);
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_PointSize = aSize * uPx * (36. / -mv.z);
          gl_Position = projectionMatrix * mv;
          float edge = smoothstep(0., .06, t) * (1. - smoothstep(.93, 1., t));
          vA = edge * clamp(30. / -mv.z, 0., 1.);
          vC = aCol * (1. + smoothstep(.75, 1., t) * 1.7);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uAlpha; varying vec3 vC; varying float vA;
        void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); a *= a; gl_FragColor = vec4(vC, a * vA * uAlpha); }`,
    })
    const particles = new THREE.Points(pGeo, pMat)
    particles.frustumCulled = false
    scene.add(particles)

    const DUST = mobile ? 500 : 1300
    const dpos = new Float32Array(DUST * 3)
    for (let i = 0; i < DUST; i++) dpos.set([(Math.random() - 0.35) * 90, (Math.random() - 0.5) * 46, (Math.random() - 0.7) * 60], i * 3)
    const dGeo = new THREE.BufferGeometry()
    dGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
    this.dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ color: 0x9a978f, size: 0.045, transparent: true, opacity: 0.45, depthWrite: false }))
    scene.add(this.dust)

    /* ---------- camera path through the chain ---------- */
    this.heroPos = mobile ? new THREE.Vector3(-3, 1.4, 19) : new THREE.Vector3(-7, 1.8, 15)
    this.heroLook = mobile ? new THREE.Vector3(1, 1.6, -2) : new THREE.Vector3(-4, 0.5, -2)

    this.onResize = this.onResize.bind(this)
    this.onPointer = this.onPointer.bind(this)
    this.frame = this.frame.bind(this)
    window.addEventListener('resize', this.onResize)
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting }, { threshold: 0 })
    this.io.observe(canvas)
  }

  /** Paint the block's front face: block number + hash, so the 3D carries real data. */
  drawLabel(rig: BlockRig, index: number, hash: string) {
    const c = rig.labelCanvas.getContext('2d')
    if (!c) return
    const W = 256
    c.fillStyle = '#0e0f12'
    c.fillRect(0, 0, W, W)
    c.strokeStyle = 'rgba(255,106,31,0.35)'
    c.lineWidth = 2
    c.strokeRect(14, 14, W - 28, W - 28)
    c.fillStyle = '#ff6a1f'
    c.font = '500 18px "IBM Plex Mono", ui-monospace, monospace'
    c.fillText(index === 0 ? 'GENESIS' : 'BLOCK', 30, 50)
    c.fillStyle = '#ecebe3'
    c.font = '400 92px "Instrument Serif", Georgia, serif'
    c.fillText(`#${index}`, 26, 152)
    c.fillStyle = '#8f8d86'
    c.font = '400 15px "IBM Plex Mono", ui-monospace, monospace'
    c.fillText(hash.slice(0, 16), 30, 196)
    c.fillText(hash.slice(16, 32), 30, 218)
    rig.label.needsUpdate = true
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y)
  }

  private onPointer(e: PointerEvent) {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }

  private onResize() {
    const w = window.innerWidth, h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.composer.setSize(w, h)
  }

  start() {
    this.clock.start()
    this.raf = requestAnimationFrame(this.frame)
  }

  private frame() {
    this.raf = requestAnimationFrame(this.frame)
    if (!this.visible) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime
    const st = this.state
    const rm = this.opts.reduced
    const u = this.uniforms

    this.scrollS = damp(this.scrollS, bus.scroll, 6, dt)
    this.outroS = damp(this.outroS, bus.outro, 4, dt)
    this.velS = damp(this.velS, Math.min(1, Math.abs(bus.velocity) / 60), 5, dt)
    this.pointerS.x = damp(this.pointerS.x, this.pointer.x, 4, dt)
    this.pointerS.y = damp(this.pointerS.y, this.pointer.y, 4, dt)

    if (!rm) this.prog += dt * (st.flow + st.rush + this.velS * 0.8) * 0.12
    u.uProg.value = this.prog
    u.uTime.value = rm ? 0 : t
    u.uSpread.value = st.spread
    u.uSuck.value = st.suck
    u.uAlpha.value = st.alpha
    u.uTurb.value = 1 + this.velS * 2
    this.ray.setFromCamera(this.pointerS, this.camera)
    this.ray.ray.intersectPlane(this.plane, this.pointerW)
    ;(u.uMouse.value as THREE.Vector3).copy(this.pointerW)

    this.chain.rotation.y = Math.sin(t * 0.18) * 0.04
    this.chain.rotation.x = Math.sin(t * 0.13) * 0.02
    this.chain.position.y = Math.sin(t * 0.4) * 0.08

    /* camera: intro close-up → hero framing → path along the chain → pulled back for the outro */
    // focus index along the chain: dwell on each block, glide between them
    const N0 = this.chainPts.length - 1
    this.focusS = damp(this.focusS, bus.focus, 5, dt)
    const f = Math.min(N0, Math.max(0, this.focusS))
    const fi = Math.min(N0 - 1, Math.floor(f))
    const ff = easeInOutCubic(f - fi)
    const P = this.focusPt.copy(this.chainPts[fi]).lerp(this.chainPts[fi + 1], ff)
    const chainCam = this.tmpCam.set(P.x - 1, P.y + 1.6, P.z + 5.6)
    const chainLook = this.tmpLook.set(P.x + 3, P.y - 0.2, P.z - 1.6)
    const w = clamp01(this.scrollS / 0.12)
    const wE = w * w * (3 - 2 * w)
    const pathU = clamp01(this.scrollS)
    const camGoal = this.heroPos.clone().lerp(chainCam, wE)
    const lookGoal = this.heroLook.clone().lerp(chainLook, wE)
    camGoal.lerp(this.introPos, st.intro)
    lookGoal.lerp(this.introLook, st.intro)
    camGoal.x += this.pointerS.x * (0.9 - pathU * 0.5)
    camGoal.y += this.pointerS.y * (0.6 - pathU * 0.3)
    camGoal.z += this.outroS * 7
    camGoal.y += this.outroS * 2.8
    const cam = this.camera.position
    cam.set(damp(cam.x, camGoal.x, 3.2, dt), damp(cam.y, camGoal.y, 3.2, dt), damp(cam.z, camGoal.z, 3.2, dt))
    this.lookCur.set(damp(this.lookCur.x, lookGoal.x, 3.6, dt), damp(this.lookCur.y, lookGoal.y, 3.6, dt), damp(this.lookCur.z, lookGoal.z, 3.6, dt))
    if (st.shake > 0.001 && !rm) {
      cam.x += (Math.random() - 0.5) * st.shake
      cam.y += (Math.random() - 0.5) * st.shake
    }
    this.camera.lookAt(this.lookCur)

    /* blocks */
    const activeBlock = bus.active >= 0 ? bus.active + 1 : -1
    const accent = this.colors.acc
    this.blocks.forEach((b, i) => {
      b.lit = damp(b.lit, i === activeBlock ? 1 : 0, 6, dt)
      const open = Math.max(b.open, b.lit)
      b.group.scale.setScalar(Math.max(0.001, b.scale * (1 + b.lit * 0.1)))
      b.group.position.y = b.base.y + b.lit * 0.4
      b.group.rotation.y = 0.62 + i * 0.04 + b.lit * 0.6 + (rm ? 0 : Math.sin(t * 0.5 + i) * 0.03)
      b.faces.forEach(({ mesh, normal }, fi) => {
        const off = 0.615 + open * 0.42
        mesh.position.copy(normal).multiplyScalar(off)
        mesh.rotation.z = open * (fi % 2 ? -0.12 : 0.12)
        const m = mesh.material as THREE.MeshPhysicalMaterial
        m.opacity = b.on
      })
      const em = b.edges.material as THREE.LineBasicMaterial
      em.opacity = b.on * (0.4 + (i === 0 ? 0.35 : 0)) * (1 - open * 0.8)
      em.color.copy(accent).multiplyScalar(1 + (i === 0 ? 0.9 : 0))
      const cm = b.core.material as THREE.MeshBasicMaterial
      cm.opacity = b.on * (i === 0 ? 0.9 : 0.1 + open * 0.75)
      b.core.scale.setScalar(1 + open * 0.8)
      b.core.rotation.y = t * (0.6 + open * 1.5)
      b.core.rotation.x = t * 0.4
    })
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3()
    this.links.forEach((l, i) => {
      const a = this.blocks[i].group.position, b = this.blocks[i + 1].group.position
      tmpA.copy(a)
      tmpB.copy(a).lerp(b, l.draw)
      const arr = l.geo.attributes.position.array as Float32Array
      arr[0] = tmpA.x; arr[1] = tmpA.y; arr[2] = tmpA.z; arr[3] = tmpB.x; arr[4] = tmpB.y; arr[5] = tmpB.z
      l.geo.attributes.position.needsUpdate = true
      ;(l.line.material as THREE.LineBasicMaterial).opacity = l.draw > 0.001 ? 0.5 : 0
    })
    const N = this.blocks.length
    this.packetsU.forEach((p, k) => {
      if (!rm) p.u = (p.u + dt * p.sp * (1 + this.velS * 3)) % 1
      const f = p.u * (N - 1)
      const i = Math.min(N - 2, Math.floor(f))
      const r = f - i
      if (this.links[i].draw >= 0.999) {
        tmpA.copy(this.blocks[i].group.position).lerp(this.blocks[i + 1].group.position, r)
        this.pkPos[k * 3] = tmpA.x; this.pkPos[k * 3 + 1] = tmpA.y; this.pkPos[k * 3 + 2] = tmpA.z
      } else {
        this.pkPos[k * 3 + 1] = -999
      }
    })
    this.pkGeo.attributes.position.needsUpdate = true
    this.pkMat.opacity = st.packets

    const litPos = activeBlock >= 0 ? this.blocks[activeBlock].group.position : this.chainPts[0]
    this.glow.position.set(damp(this.glow.position.x, litPos.x, 4, dt), litPos.y + 1.6, litPos.z + 2.2)
    this.dust.rotation.y = t * 0.008

    this.bloomPass.strength = st.bloom + this.velS * 0.35
    if (this.rgbPass) this.rgbPass.uniforms['amount'].value = st.rgb + this.velS * 0.0035
    this.renderer.toneMappingExposure = st.exposure
    this.composer.render()
  }

  /** Point the shockwave ring at the camera before it expands. */
  faceRingToCamera() {
    this.ring.lookAt(this.camera.position)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('pointermove', this.onPointer)
    this.io?.disconnect()
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose?.()
      const mat = m.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else mat?.dispose?.()
    })
    this.blocks.forEach((b) => b.label.dispose())
    this.composer.dispose()
    this.renderer.dispose()
  }
}
