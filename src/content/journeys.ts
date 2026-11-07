import type { L10n } from './types'

export type Journey = {
  key: 'crypto' | 'dev' | 'ai'
  name: L10n
  color: string
  /** `when` is shown above the title; leave it out where the period is not known */
  steps: Array<{ title: L10n; body: L10n; when?: L10n; project?: string }>
}

/** Milestones are in order; years only where confirmed. */
export const JOURNEYS: Journey[] = [
  {
    key: 'crypto',
    name: { en: 'Crypto Journey', id: 'Crypto Journey' },
    color: 'var(--crypto)',
    steps: [
      { title: { en: 'Trader', id: 'Trader' }, body: { en: 'Where it started: risk, charts and the discipline to cut a loss. I wasn’t a great trader, but I never gave up. I traded memecoins for positive expected value: the best asymmetric bets.', id: 'Awal mula: risiko, chart, dan disiplin cut-loss. Saya bukan trader yang hebat, tapi saya tidak pernah menyerah. Trading memecoin untuk EV positif: taruhan asimetris terbaik.' } },
      { when: { en: '2022 – 2024', id: '2022 – 2024' }, title: { en: 'Airdrop hunter', id: 'Airdrop hunter' }, body: { en: 'Tried protocol after protocol from the user’s side of the screen. Completed tasks set by project teams to qualify, and farmed retroactive airdrops.', id: 'Mencoba protokol demi protokol dari sisi user. Mengerjakan task dari tim proyek supaya lolos airdrop, dan berburu retroactive airdrop.' } },
      { when: { en: '2022', id: '2022' }, title: { en: 'GameFi era', id: 'Era GameFi' }, body: { en: 'Started out playing GameFi without spending real money; once I had some, I put real funds into other GameFi games.', id: 'Awalnya bermain GameFi tanpa uang sungguhan; setelah punya modal, saya memakai uang sungguhan di game GameFi lain.' } },
      { when: { en: '2023 – now', id: '2023 – sekarang' }, title: { en: 'Alpha hunter', id: 'Alpha hunter' }, body: { en: 'On-chain research and tracking on-chain alpha, the NFT hunting era, early hunting (getting into projects early for the biggest upside), and alpha hunting on X (Twitter).', id: 'Riset on-chain dan melacak alpha on-chain, era berburu NFT, early hunter (masuk ke proyek sejak awal untuk profit maksimal), dan alpha hunter di X (Twitter).' } },
      { when: { en: '2023', id: '2023' }, title: { en: 'Community', id: 'Komunitas' }, body: { en: 'Focused on getting more exposure and being active on X. Joined Indonesian crypto communities and DAOs, including Stress Capital and DFAM, and got followed by well-known crypto and Web3 accounts on Indonesian Crypto Twitter.', id: 'Fokus menambah exposure dan aktif di X. Bergabung dengan komunitas dan DAO crypto Indonesia, termasuk Stress Capital dan DFAM, dan di-follow akun-akun crypto dan Web3 ternama di Crypto Twitter Indonesia.' } },
      { when: { en: '2025 – now', id: '2025 – sekarang' }, title: { en: 'Liquidity provider', id: 'Liquidity provider' }, body: { en: 'Provided liquidity on Solana with Meteora, and on EVM chains with Uniswap, PancakeSwap and PRJX on HyperEVM.', id: 'Menyediakan likuiditas di Solana dengan Meteora, dan di chain EVM dengan Uniswap, PancakeSwap, serta PRJX di HyperEVM.' } },
      { title: { en: 'Miner', id: 'Miner' }, body: { en: 'GPU mining experiments on Vast.ai, including mining $PEARL.', id: 'Eksperimen mining GPU di Vast.ai, termasuk mining $PEARL.' } },
      { title: { en: 'Builder', id: 'Builder' }, body: { en: 'Bots on Polymarket, a Solana payment app, a simple DEX built on the 0x aggregator API, and Alphabot Auto Entry, a bot that enters NFT raffles automatically.', id: 'Bot di Polymarket, aplikasi pembayaran Solana, DEX sederhana dengan API agregator 0x, dan Alphabot Auto Entry, bot yang otomatis ikut raffle NFT.' }, project: 'dollarkilat' },
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
      { title: { en: 'Shipped in public', id: 'Dirilis ke publik' }, body: { en: 'SapuX released free for everyone; dollarkilat as a hackathon MVP on Solana devnet.', id: 'SapuX dirilis gratis untuk publik; dollarkilat sebagai MVP hackathon di Solana devnet.' } },
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
      { title: { en: 'ML in production', id: 'ML di produksi' }, body: { en: 'A calibrated XGBoost + LightGBM ensemble trading on Polymarket — 800+ paper trades and a small live pilot — with an LLM advisor kept in shadow until it beats the market.', id: 'Ensemble XGBoost + LightGBM terkalibrasi yang trading di Polymarket — 800+ trade simulasi dan pilot live kecil — dengan advisor LLM yang tetap di mode shadow sampai bisa mengalahkan pasar.' }, project: 'polymarket-btc-15-minutes' },
      { title: { en: 'LLMs & agents', id: 'LLM & agent' }, body: { en: 'An anti-hoax RAG design, agentic coding with MCP servers and hooks, custom skills, a model router on a VPS.', id: 'Rancangan RAG anti-hoaks, agentic coding dengan MCP server dan hooks, skill custom, model router di VPS.' } },
      { title: { en: 'Research', id: 'Riset' }, body: { en: 'Thesis: XGBoost vs LSTM for Bitcoin, before and after the spot ETF.', id: 'Tugas akhir: XGBoost vs LSTM untuk Bitcoin, sebelum dan sesudah ETF spot.' }, project: 'thesis-xgboost-lstm-btc' },
    ],
  },
]
