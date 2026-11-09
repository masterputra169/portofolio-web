/// <reference lib="webworker" />
import { mine } from './pow'

/** Off-main-thread proof-of-work: receives { data, prefix, budgetMs }, posts { tick } while searching and { result } once. */
self.onmessage = async (e: MessageEvent<{ data: string; prefix?: string; budgetMs?: number }>) => {
  const { data, ...opts } = e.data
  const result = await mine(data, { ...opts, onTick: (tick) => self.postMessage({ tick }) })
  self.postMessage({ result })
}
