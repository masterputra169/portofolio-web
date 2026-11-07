import type { L10n, Lang } from './types'

export const SITE = {
  url: 'https://masterputra.tech',
  name: 'Timotius Kusuma Wardana Putra',
  shortName: 'Timotius',
  alias: 'masterputra',
  role: { en: 'Web3 developer', id: 'Web3 developer' } as L10n,
  location: { en: 'Kediri, Indonesia', id: 'Kediri, Indonesia' } as L10n,
  identity: {
    en: 'Timotius Kusuma Wardana Putra (masterputra) is a Web3 developer from Kediri, Indonesia, building trading bots, on-chain apps and ML tools.',
    id: 'Timotius Kusuma Wardana Putra (masterputra) adalah Web3 developer dari Kediri, Indonesia, yang membangun bot trading, aplikasi on-chain, dan tools machine learning.',
  } as L10n,
  tagline: {
    en: 'I used to trade the market. Now I build for it.',
    id: 'Dulu saya trading di pasar. Sekarang saya membangun untuknya.',
  } as L10n,
  githubUser: 'masterputra169',
  /**
   * One CV per site language (public/cv-en.pdf, public/cv-id.pdf), shown on /cv/ and /id/cv/.
   * `pages` are the PDF pages rendered at 150 dpi (public/images/cv/cv-<lang>-<n>.webp, 1241×1754),
   * so the CV can be read on phones whose browsers download PDFs instead of showing them.
   * After replacing a PDF: pdftoppm -r 150 -png public/cv-en.pdf <tmp>/cv-en, then convert to WebP.
   */
  cv: {
    en: { url: '/cv-en.pdf', file: 'CV_Timotius_Kusuma_Wardana_Putra_EN.pdf', name: 'English', pages: 2 },
    id: { url: '/cv-id.pdf', file: 'CV_Timotius_Kusuma_Wardana_Putra_ID.pdf', name: 'Bahasa Indonesia', pages: 2 },
  } as Record<Lang, { url: string; file: string; name: string; pages: number }> | null,
  email: 'timotiusputra1@gmail.com' as string | null,
  /** What I am doing right now: shown on /about, in the contact section and on the experience entry */
  status: {
    en: 'Currently an intern at PLN UP3 Kediri.',
    id: 'Saat ini magang di PLN UP3 Kediri.',
  } as L10n,
  photo: '/images/timotius.webp',
  photoJpg: '/images/timotius.jpg',
  avatar: '/images/avatar.jpg',
  /** the X profile picture and bio, shown with the X link (hero, /about card, contact) */
  xProfile: {
    avatar: '/images/x-avatar.webp',
    name: 'masterputra',
    bio: 'comeback arc | builder arc',
    /** the full profile artwork (the avatar is its centre square), shown in the X pop-up */
    artwork: { src: '/images/x-pfp.webp', width: 1000, height: 1258 },
    /** screenshot of the X profile (followers, smart followers), shown in the X pop-up */
    snapshot: { src: '/images/x-profile.webp', width: 472, height: 617, date: { en: 'November 2026', id: 'November 2026' } as L10n },
  },
}

/** /about: the opening line under the name (the name itself is the heading, so it is not repeated) */
export const ABOUT = {
  lead: {
    en: 'Web3 developer from Kediri, Indonesia, building trading bots, on-chain apps and ML tools.',
    id: 'Web3 developer dari Kediri, Indonesia, yang membangun bot trading, aplikasi on-chain, dan tools machine learning.',
  } as L10n,
  story: {
    en: 'I came to code through markets. Four years of trading, airdrop hunting and alpha hunting taught me risk, patience and how protocols feel from the user’s side. Now I build the tools I wished I had: bots that know when to stop, payment rails for freelancers like me, and models I can explain.',
    id: 'Saya sampai ke dunia coding lewat pasar. Empat tahun trading, berburu airdrop, dan berburu alpha mengajari saya soal risiko, kesabaran, dan rasanya memakai protokol dari sisi user. Sekarang saya membangun tools yang dulu saya cari: bot yang tahu kapan berhenti, jalur pembayaran untuk freelancer seperti saya, dan model yang bisa saya jelaskan.',
  } as L10n,
  /** "at a glance" numbers; keep them true (the trades are the bot's paper trades, followers as of the X snapshot) */
  glance: [
    { value: '4+', label: { en: 'years in crypto', id: 'tahun di crypto' } },
    { value: '800+', label: { en: 'paper trades by my bot', id: 'trade simulasi bot saya' } },
    { value: '2', label: { en: 'hackathons', id: 'hackathon' } },
    { value: { en: '1,791', id: '1.791' }, label: { en: 'followers on X', id: 'follower di X' } },
  ] as Array<{ value: string | L10n; label: L10n }>,
}

export const SOCIALS = [
  { key: 'x', label: 'X', handle: '@masterputra6969', url: 'https://x.com/masterputra6969' },
  { key: 'instagram', label: 'Instagram', handle: '@masterputra_99', url: 'https://www.instagram.com/masterputra_99/' },
  { key: 'github', label: 'GitHub', handle: 'masterputra169', url: 'https://github.com/masterputra169' },
  { key: 'linkedin', label: 'LinkedIn', handle: 'Timotius K. W. Putra', url: 'https://www.linkedin.com/in/timotius-kusuma-wardana-putra/' },
] as const

/** "current arc" status — edit freely, the label cycles through these */
export const ARCS = [
  { key: 'builder', label: 'builder arc', meaning: { en: 'Shipping projects', id: 'Sedang shipping proyek' } },
  { key: 'locked', label: 'locked in arc', meaning: { en: 'Heads down: thesis, study, code every day', id: 'Fokus penuh: TA, belajar, ngoding tiap hari' } },
  { key: 'crypto', label: 'crypto arc', meaning: { en: 'Active in the market and on-chain', id: 'Aktif di pasar dan on-chain' } },
] as const

export const EXPERTISE = {
  shipping: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Laravel', 'Firebase', 'XGBoost', 'LightGBM', 'Solana', 'EVM / Base', 'Vercel', 'Cloudflare', 'Railway', 'VPS'],
  obsessed: [
    { en: 'Game theory', id: 'Game theory' },
    { en: 'Quant finance — Monte Carlo, copulas, Brier score', id: 'Quant finance — Monte Carlo, copula, Brier score' },
    { en: 'On-chain analytics', id: 'Analisis data on-chain' },
    { en: 'Prediction markets', id: 'Prediction market' },
    { en: 'Liquidity providing', id: 'Liquidity providing' },
  ] as L10n[],
}

/** `start` (YYYY-MM) orders the list: newest first, whatever order the entries are written in. */
export const EXPERIENCE = [
  { start: '2026-09', org: 'PLN UP3 Kediri', role: { en: 'Intern — current', id: 'Magang — saat ini' }, period: { en: 'Sep – Dec 2026 · now', id: 'Sep – Des 2026 · sekarang' }, note: { en: 'Three-month internship.', id: 'Magang tiga bulan.' } },
  { start: '2026-07', org: 'Indonesia Web3 Hackathon 2026 · online workshop', role: { en: 'Workshop participant', id: 'Peserta workshop' }, period: { en: 'Jul – Aug 2026', id: 'Jul – Agu 2026' }, note: { en: 'The hackathon’s weekly online workshops: Web3 fundamentals, smart contracts in Solidity, AI × Web3. Mentored by Dev Web3 Jogja.', id: 'Workshop online mingguan dari hackathon ini: fundamental Web3, smart contract dengan Solidity, AI × Web3. Dimentori Dev Web3 Jogja.' } },
  { start: '2026-04', org: 'Colosseum Frontier 2026 · Indonesia National Campus Hackathon', role: { en: 'Hackathon participant — dollarkilat', id: 'Peserta hackathon — dollarkilat' }, period: { en: 'Apr – May 2026', id: 'Apr – Mei 2026' }, note: { en: 'Built a Solana payment PWA with a team and entered it in both: Colosseum Frontier 2026 and Superteam Indonesia’s National Campus Hackathon.', id: 'Membangun PWA pembayaran Solana bersama tim dan mengikutkannya di keduanya: Colosseum Frontier 2026 dan Indonesia National Campus Hackathon dari Superteam Indonesia.' } },
  { start: '2023-09', org: 'Universitas Dian Nuswantoro · PSDKU Kediri', role: { en: 'B.Sc. Informatics Engineering', id: 'S1 Teknik Informatika' }, period: { en: '2023 – present', id: '2023 – sekarang' }, note: { en: 'Final-year thesis on Bitcoin price prediction.', id: 'Tugas akhir tentang prediksi harga Bitcoin.' } },
] as const

export const CERTIFICATES = [
  {
    slug: 'indonesia-web3-hackathon-2026',
    title: 'Online Workshop Indonesia Web3 Hackathon 2026',
    issuer: 'Binance Academy, BNB Chain, Coinvestasi · mentoring by Dev Web3 Jogja',
    date: { en: 'Jul 5 – Aug 30, 2026', id: '5 Jul – 30 Agu 2026' },
    topics: { en: 'Web3 fundamentals, smart contract development, AI × Web3', id: 'Fundamental Web3, smart contract development, AI × Web3' },
    verify: null as string | null,
  },
  {
    slug: 'asean-data-science-explorers-2026',
    title: 'ASEAN Data Science Explorers 2026 — Enablement Session: SAP Analytics Cloud',
    issuer: 'SAP & ASEAN Foundation',
    date: { en: '2026', id: '2026' },
    topics: { en: 'SAP Analytics Cloud training session', id: 'Sesi pelatihan SAP Analytics Cloud' },
    verify: null as string | null,
  },
  {
    slug: 'ibm-cloud-computing',
    title: 'Introduction to Cloud Computing',
    issuer: 'IBM via Coursera',
    date: { en: 'Apr 12, 2026', id: '12 Apr 2026' },
    topics: { en: 'Cloud service models, deployment models, cloud-native basics', id: 'Model layanan cloud, model deployment, dasar cloud-native' },
    verify: 'https://coursera.org/verify/JJ8EY4UTVTRB',
  },
  {
    slug: 'ibm-supervised-ml',
    title: 'Supervised Machine Learning: Classification',
    issuer: 'IBM via Coursera',
    date: { en: 'Apr 9, 2026', id: '9 Apr 2026' },
    topics: { en: 'Classification models and evaluation', id: 'Model klasifikasi dan evaluasinya' },
    verify: 'https://coursera.org/verify/PNB7MJBIBW66',
  },
]

export const FAQ: Array<{ q: L10n; a: L10n }> = [
  {
    q: { en: 'Who is Timotius Kusuma Wardana Putra?', id: 'Siapa Timotius Kusuma Wardana Putra?' },
    a: {
      en: 'Timotius Kusuma Wardana Putra, also known as masterputra, is a Web3 developer and Informatics Engineering student at Universitas Dian Nuswantoro in Kediri, Indonesia. He spent about four years in crypto as a trader, airdrop hunter and alpha hunter before becoming a builder.',
      id: 'Timotius Kusuma Wardana Putra, dikenal juga sebagai masterputra, adalah Web3 developer dan mahasiswa Teknik Informatika Universitas Dian Nuswantoro di Kediri, Indonesia. Ia menghabiskan sekitar empat tahun di crypto sebagai trader, airdrop hunter, dan alpha hunter sebelum menjadi builder.',
    },
  },
  {
    q: { en: 'What has masterputra built?', id: 'Apa saja yang sudah dibangun masterputra?' },
    a: {
      en: 'A Polymarket BTC 15-minute prediction bot with a calibrated XGBoost + LightGBM ensemble, dollarkilat (an open-source MVP of a Solana payment PWA for Indonesian freelancers), SapuX (a Chrome extension that unfollows inactive X accounts), and thesis research comparing XGBoost and LSTM for Bitcoin price prediction.',
      id: 'Bot prediksi Polymarket BTC 15 menit dengan ensemble XGBoost + LightGBM terkalibrasi, dollarkilat (MVP open source berupa PWA pembayaran Solana untuk freelancer Indonesia), SapuX (Chrome extension untuk unfollow akun X yang tidak aktif), dan riset tugas akhir yang membandingkan XGBoost dan LSTM untuk prediksi harga Bitcoin.',
    },
  },
  {
    q: { en: 'What technologies does he use?', id: 'Teknologi apa yang ia pakai?' },
    a: {
      en: 'React, Next.js and TypeScript on the frontend; Node.js, Python, Laravel and Firebase on the backend; XGBoost, LightGBM and LSTM for machine learning; Solana and EVM chains such as Base for Web3.',
      id: 'React, Next.js, dan TypeScript di frontend; Node.js, Python, Laravel, dan Firebase di backend; XGBoost, LightGBM, dan LSTM untuk machine learning; Solana dan chain EVM seperti Base untuk Web3.',
    },
  },
  {
    q: { en: 'Where can I find him online?', id: 'Di mana saya bisa menemukannya?' },
    a: {
      en: 'By email at timotiusputra1@gmail.com, on LinkedIn as Timotius Kusuma Wardana Putra, on GitHub as masterputra169, on X as @masterputra6969 and on Instagram as @masterputra_99.',
      id: 'Lewat email di timotiusputra1@gmail.com, di LinkedIn sebagai Timotius Kusuma Wardana Putra, di GitHub sebagai masterputra169, di X sebagai @masterputra6969, dan di Instagram sebagai @masterputra_99.',
    },
  },
]
