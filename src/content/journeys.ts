import type { L10n } from './types'

export type Journey = {
  key: 'crypto' | 'dev' | 'ai'
  name: L10n
  color: string
  steps: Array<{ title: L10n; body: L10n; project?: string }>
}

/** Milestones are in order; years are left out until confirmed. */
export const JOURNEYS: Journey[] = [
  {
    key: 'crypto',
    name: { en: 'Crypto Journey', id: 'Crypto Journey' },
    color: 'var(--crypto)',
    steps: [
      { title: { en: 'Trader', id: 'Trader' }, body: { en: 'Where it started: risk, charts and the discipline to cut a loss.', id: 'Awal mula: risiko, chart, dan disiplin cut-loss.' } },
      { title: { en: 'Airdrop hunter', id: 'Airdrop hunter' }, body: { en: 'Tried protocol after protocol from the user’s side of the screen.', id: 'Mencoba protokol demi protokol dari sisi user.' } },
      { title: { en: 'Alpha hunter', id: 'Alpha hunter' }, body: { en: 'On-chain research, Polymarket liquidity farming, PancakeSwap LP mechanics.', id: 'Riset on-chain, LP farming di Polymarket, mekanik LP PancakeSwap.' } },
      { title: { en: 'Collector & miner', id: 'Collector & miner' }, body: { en: 'eDMT/eNAT block collecting — including eNAT #21,895,238, the ByBit hack trigger block — and GPU mining experiments on Vast.ai.', id: 'Koleksi blok eDMT/eNAT — termasuk eNAT #21,895,238, blok pemicu hack ByBit — dan eksperimen mining GPU di Vast.ai.' } },
      { title: { en: 'Builder', id: 'Builder' }, body: { en: 'Bots on Polymarket and Base, a Solana payment app, the Web3 Developer Jogja community.', id: 'Bot di Polymarket dan Base, aplikasi pembayaran Solana, komunitas Web3 Developer Jogja.' }, project: 'dollarkilat' },
    ],
  },
  {
    key: 'dev',
    name: { en: 'Developer Journey', id: 'Developer Journey' },
    color: 'var(--dev)',
    steps: [
      { title: { en: 'Informatics, 2023', id: 'Informatika, 2023' }, body: { en: 'Started Informatics Engineering at UDINUS, Kediri campus.', id: 'Mulai kuliah Teknik Informatika di UDINUS, kampus Kediri.' } },
      { title: { en: 'Web foundations', id: 'Fondasi web' }, body: { en: 'React, Next.js, TypeScript — and a GitHub profile README with live widgets.', id: 'React, Next.js, TypeScript — dan GitHub profile README dengan widget dinamis.' } },
      { title: { en: 'Own infrastructure', id: 'Infrastruktur sendiri' }, body: { en: 'A VPS, Cloudflare catch-all email, deploys on Netlify, Railway and Vercel; IBM Introduction to Cloud Computing.', id: 'VPS, email catch-all Cloudflare, deploy di Netlify, Railway, dan Vercel; sertifikat IBM Introduction to Cloud Computing.' } },
      { title: { en: 'Bots & tools', id: 'Bot & tools' }, body: { en: 'CRUDE Driller through 35+ versions, a tweet curation tool, the SapuX extension.', id: 'CRUDE Driller hingga 35+ versi, tweet curation tool, extension SapuX.' }, project: 'sapux' },
      { title: { en: 'Shipped for real users', id: 'Dipakai user nyata' }, body: { en: 'dollarkilat for Indonesian freelancers; SapuX released free for everyone.', id: 'dollarkilat untuk freelancer Indonesia; SapuX dirilis gratis untuk publik.' } },
    ],
  },
  {
    key: 'ai',
    name: { en: 'AI Explorer Journey', id: 'AI Explorer Journey' },
    color: 'var(--ai)',
    steps: [
      { title: { en: 'ML by hand', id: 'ML dengan tangan' }, body: { en: 'Naive Bayes, SVM and backprop networks, calculated step by step in class.', id: 'Naive Bayes, SVM, dan BPNN dihitung manual di kelas.' } },
      { title: { en: 'Computer vision', id: 'Computer vision' }, body: { en: 'Mango leaf disease classification and wildfire detection.', id: 'Klasifikasi penyakit daun mangga dan deteksi kebakaran hutan.' } },
      { title: { en: 'ML for markets', id: 'ML untuk pasar' }, body: { en: 'IBM Supervised ML: Classification; Bitcoin direction prediction with six classifiers.', id: 'IBM Supervised ML: Classification; prediksi arah Bitcoin dengan enam classifier.' } },
      { title: { en: 'ML in production', id: 'ML di produksi' }, body: { en: 'A calibrated XGBoost + LightGBM ensemble trading on Polymarket, with a Gemini Flash post-trade analyst.', id: 'Ensemble XGBoost + LightGBM terkalibrasi yang trading di Polymarket, dengan analis pasca-trade Gemini Flash.' }, project: 'polymarket-btc-15-minutes' },
      { title: { en: 'LLMs & agents', id: 'LLM & agent' }, body: { en: 'An anti-hoax RAG design, agentic coding with MCP servers and hooks, custom skills, a model router on a VPS.', id: 'Rancangan RAG anti-hoaks, agentic coding dengan MCP server dan hooks, skill custom, model router di VPS.' } },
      { title: { en: 'Research', id: 'Riset' }, body: { en: 'Thesis: XGBoost vs LSTM for Bitcoin, before and after the spot ETF.', id: 'Tugas akhir: XGBoost vs LSTM untuk Bitcoin, sebelum dan sesudah ETF spot.' }, project: 'thesis-xgboost-lstm-btc' },
    ],
  },
]
