import { mine, type MineResult, type MineTick } from './pow'

/**
 * Mines in a Web Worker so the search never blocks the page (input, painting, the 3D scene);
 * falls back to the main thread when workers are unavailable or the worker fails.
 */
export function mineOffThread(data: string, opts: { prefix?: string; budgetMs?: number; onTick?: (t: MineTick) => void } = {}): Promise<MineResult> {
  const { onTick, ...rest } = opts
  if (typeof Worker === 'undefined') return mine(data, opts)
  return new Promise((resolve) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./pow.worker.ts', import.meta.url), { type: 'module' })
    } catch {
      resolve(mine(data, opts))
      return
    }
    let done = false
    const fallback = () => {
      if (done) return
      done = true
      worker.terminate()
      resolve(mine(data, opts))
    }
    worker.onmessage = (e: MessageEvent<{ tick?: MineTick; result?: MineResult }>) => {
      if (e.data.tick) onTick?.(e.data.tick)
      if (e.data.result && !done) {
        done = true
        worker.terminate()
        resolve(e.data.result)
      }
    }
    worker.onerror = fallback
    worker.postMessage({ data, ...rest })
  })
}
