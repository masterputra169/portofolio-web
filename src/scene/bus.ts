import type Lenis from 'lenis'

type Listener = () => void

/** Tiny shared state between DOM sections (ScrollTrigger) and the WebGL scene. */
export const bus = {
  /** 0..1 progress through the pinned chain section */
  scroll: 0,
  /** continuous index of the block the camera should frame (0 = genesis) */
  focus: 0,
  /** smoothed scroll velocity from Lenis (px/frame-ish) */
  velocity: 0,
  /** index of the featured project currently on screen, -1 when none */
  active: -1,
  /** 0..1 progress into the outro section */
  outro: 0,
  /** true while opaque sections fill the whole viewport: the canvas is hidden, so skip rendering */
  covered: false,
  mined: false,
  /** how the 3D scene is running, for the terminal's `gpu` command */
  gl: 'not started',
  /** true while the home intro is playing; smooth scrolling stays paused */
  introPending: false,
  genesisHash: '',
  genesisMs: 0,
  lenis: null as Lenis | null,
  listeners: new Set<Listener>(),
  onMined(fn: Listener) {
    if (this.mined) fn()
    else this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  },
  setMined(hash: string, ms: number) {
    this.mined = true
    this.genesisHash = hash
    this.genesisMs = ms
    this.listeners.forEach((fn) => fn())
    this.listeners.clear()
  },
}
