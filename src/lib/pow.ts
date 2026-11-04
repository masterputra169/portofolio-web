/** Real proof-of-work in the browser: SHA-256 until the hash starts with the target prefix. */

const enc = new TextEncoder()
export const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

/** Pure-JS fallback for browsers/contexts without crypto.subtle. */
export function sha256js(bytes: Uint8Array): ArrayBuffer {
  const l = bytes.length
  const bl = ((l + 9 + 63) >> 6) << 6
  const m = new Uint8Array(bl)
  m.set(bytes)
  m[l] = 0x80
  const dv = new DataView(m.buffer)
  dv.setUint32(bl - 4, l * 8)
  dv.setUint32(bl - 8, Math.floor(l / 0x20000000))
  const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const W = new Uint32Array(64)
  const r = (x: number, n: number) => (x >>> n) | (x << (32 - n))
  for (let o = 0; o < bl; o += 64) {
    for (let i = 0; i < 16; i++) W[i] = dv.getUint32(o + i * 4)
    for (let i = 16; i < 64; i++) {
      const a = W[i - 15], b = W[i - 2]
      W[i] = (W[i - 16] + (r(a, 7) ^ r(a, 18) ^ (a >>> 3)) + W[i - 7] + (r(b, 17) ^ r(b, 19) ^ (b >>> 10))) | 0
    }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7]
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0
      const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
    }
    H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h
  }
  const out = new Uint8Array(32)
  const odv = new DataView(out.buffer)
  H.forEach((v, i) => odv.setUint32(i * 4, v))
  return out.buffer
}

const hasSubtle = () => typeof crypto !== 'undefined' && !!crypto.subtle && typeof crypto.subtle.digest === 'function'
export const sha256 = async (s: string): Promise<string> => {
  const bytes = enc.encode(s)
  return hex(hasSubtle() ? await crypto.subtle.digest('SHA-256', bytes as BufferSource) : sha256js(bytes))
}

export type MineResult = { nonce: number; hash: string; ms: number }
export type MineTick = { nonce: number; best: string; rate: number; progress: number }

export async function mine(data: string, opts: { prefix?: string; budgetMs?: number; onTick?: (t: MineTick) => void } = {}): Promise<MineResult> {
  const prefix = opts.prefix ?? '0000'
  const budget = opts.budgetMs ?? 3600
  const BATCH = 256
  const useSubtle = hasSubtle()
  const t0 = performance.now()
  let nonce = 0
  let best: { nonce: number; hash: string } | null = null
  let lastTick = t0
  let lastNonce = 0
  for (;;) {
    const jobs: Array<Promise<ArrayBuffer>> = []
    for (let i = 0; i < BATCH; i++) {
      const bytes = enc.encode(`${data}|${nonce + i}`)
      jobs.push(useSubtle ? crypto.subtle.digest('SHA-256', bytes as BufferSource) : Promise.resolve(sha256js(bytes)))
    }
    const res = await Promise.all(jobs)
    for (let i = 0; i < BATCH; i++) {
      const h = hex(res[i])
      if (h.startsWith(prefix)) return { nonce: nonce + i, hash: h, ms: performance.now() - t0 }
      if (!best || h < best.hash) best = { nonce: nonce + i, hash: h }
    }
    nonce += BATCH
    const now = performance.now()
    if (now - lastTick > 50 && best) {
      opts.onTick?.({ nonce, best: best.hash, rate: Math.round((nonce - lastNonce) / ((now - lastTick) / 1000)), progress: (now - t0) / budget })
      lastTick = now
      lastNonce = nonce
    }
    if (best && now - t0 > budget && best.hash.startsWith(prefix.slice(0, -1))) return { ...best, ms: now - t0 }
    if (best && now - t0 > budget * 2) return { ...best, ms: now - t0 }
  }
}

export const shortHash = (h: string) => `${h.slice(0, 10)}…${h.slice(-6)}`
