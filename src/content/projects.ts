import type { CuratedProject } from './types'

/**
 * Hand-written case studies for the featured projects (from the PRD).
 * Every other public repo on GitHub is listed automatically at build time.
 */
export const CURATED: CuratedProject[] = [
  {
    slug: 'polymarket-btc-15-minutes',
    repo: 'polymarket-btc-15-minutes',
    title: 'Polymarket BTC 15-min bot',
    categories: ['ml', 'web3'],
    journeys: ['crypto', 'dev', 'ai'],
    summary: {
      en: 'Predicts 15-minute Bitcoin moves on Polymarket with a Platt-calibrated XGBoost + LightGBM ensemble, then sizes every order with the Kelly criterion.',
      id: 'Memprediksi pergerakan Bitcoin 15 menit di Polymarket dengan ensemble XGBoost + LightGBM terkalibrasi Platt, lalu menentukan ukuran setiap order dengan Kelly criterion.',
    },
    stats: [
      { value: '79', label: { en: 'features', id: 'fitur' } },
      { value: '4', label: { en: 'WebSocket feeds', id: 'stream WebSocket' } },
      { value: '7', label: { en: 'routing rules', id: 'aturan routing' } },
      { value: '13', label: { en: 'cut-loss gates', id: 'gate cut-loss' } },
    ],
    stack: ['Python', 'XGBoost', 'LightGBM', 'WebSocket', 'React 19', 'Gemini Flash'],
    caseStudy: {
      overview: {
        en: 'A trading system for Polymarket’s 15-minute Bitcoin markets. Four WebSocket feeds become 79 features every interval; a Platt-calibrated XGBoost + LightGBM ensemble turns them into a probability; seven routing rules decide whether and how much to bet.',
        id: 'Sistem trading untuk market Bitcoin 15 menit di Polymarket. Empat stream WebSocket diolah jadi 79 fitur tiap interval; ensemble XGBoost + LightGBM terkalibrasi Platt mengubahnya jadi probabilitas; tujuh aturan routing memutuskan apakah dan seberapa besar bertaruh.',
      },
      problem: {
        en: 'Fifteen minutes is short enough that noise dominates and long enough that fees and slippage matter. A raw classifier score is not a probability, and betting on an uncalibrated score is how accounts go to zero.',
        id: 'Lima belas menit cukup singkat sehingga noise mendominasi, tapi cukup lama sehingga fee dan slippage berpengaruh. Skor classifier mentah bukan probabilitas, dan bertaruh dengan skor yang tidak terkalibrasi adalah cara cepat menghabiskan modal.',
      },
      approach: {
        en: 'Platt calibration on the ensemble output, Kelly-sized orders through a seven-rule router, thirteen cut-loss gates, and CUSUM drift detection to notice when the market stops looking like the training data. A Gemini Flash agent writes a post-trade analysis, and a React 19 dashboard shows it all live.',
        id: 'Kalibrasi Platt pada output ensemble, order berukuran Kelly lewat router tujuh aturan, tiga belas gate cut-loss, dan deteksi drift CUSUM untuk mengenali saat pasar sudah tidak mirip data latih. Agen Gemini Flash menulis analisis pasca-trade, dan dashboard React 19 menampilkannya secara live.',
      },
      broke: {
        en: 'A full review of the ML pipeline found label leakage, a regime-naming bug, semantic mismatches and inconsistent scraper thresholds. Backtests looked better than live trading until each one was fixed.',
        id: 'Review menyeluruh pada pipeline ML menemukan label leakage, bug penamaan regime, ketidakcocokan semantik, dan threshold scraper yang tidak konsisten. Backtest terlihat lebih bagus daripada trading live sampai semuanya diperbaiki.',
      },
      results: {
        en: 'A bot that trades with calibrated probabilities and knows when to stop. Results are shown as architecture and lessons, not profit claims.',
        id: 'Bot yang trading dengan probabilitas terkalibrasi dan tahu kapan harus berhenti. Hasil ditampilkan sebagai arsitektur dan pelajaran, bukan klaim profit.',
      },
    },
  },
  {
    slug: 'dollarkilat',
    title: 'dollarkilat',
    categories: ['web3'],
    journeys: ['crypto', 'dev'],
    homepage: 'https://dollarkilat.xyz',
    team: { en: 'Team project for Colosseum Frontier 2026 × Superteam Indonesia', id: 'Proyek tim untuk Colosseum Frontier 2026 × Superteam Indonesia' },
    summary: {
      en: 'A Solana PWA for Indonesian freelancers: get paid in USDC, spend it anywhere that takes QRIS.',
      id: 'PWA Solana untuk freelancer Indonesia: terima bayaran dalam USDC, belanjakan di mana pun yang menerima QRIS.',
    },
    stats: [
      { value: 'USDC', label: { en: 'in', id: 'masuk' } },
      { value: 'QRIS', label: { en: 'out', id: 'keluar' } },
      { value: 'PWA', label: { en: 'mobile-first', id: 'mobile-first' } },
    ],
    stack: ['Solana', 'Next.js', 'PWA', 'QRIS', 'Vercel'],
    caseStudy: {
      overview: {
        en: 'Indonesian freelancers increasingly get paid in USDC, but daily life runs on QRIS. dollarkilat bridges the two in one mobile web app.',
        id: 'Freelancer Indonesia makin sering dibayar dalam USDC, tapi kehidupan sehari-hari berjalan dengan QRIS. dollarkilat menjembatani keduanya dalam satu aplikasi web mobile.',
      },
      problem: {
        en: 'Getting from stablecoins to a coffee in Kediri usually means an exchange, a bank transfer and a wait. Every step costs fees and time.',
        id: 'Dari stablecoin ke secangkir kopi di Kediri biasanya harus lewat exchange, transfer bank, dan menunggu. Setiap langkah memakan fee dan waktu.',
      },
      approach: {
        en: 'A Solana-based PWA with a QRIS switching flow, explored together with payment-gateway sandboxes, QRIS merchant registration and the licensing it requires. The pitch covered the business model and a Value Proposition Canvas.',
        id: 'PWA berbasis Solana dengan alur switching QRIS, dieksplorasi bersama sandbox payment gateway, registrasi merchant QRIS, dan perizinan yang dibutuhkan. Pitch-nya mencakup model bisnis dan Value Proposition Canvas.',
      },
      broke: {
        en: 'The hard part is not the chain, it is the regulated rail on the other side: QRIS merchant onboarding and payment licensing shape what can ship.',
        id: 'Bagian tersulitnya bukan di chain, tapi di jalur yang diregulasi di sisi lain: onboarding merchant QRIS dan perizinan pembayaran menentukan apa yang bisa dirilis.',
      },
      results: {
        en: 'Submitted to Colosseum Frontier 2026 with Superteam Indonesia and deployed at dollarkilat.xyz.',
        id: 'Disubmit ke Colosseum Frontier 2026 bersama Superteam Indonesia dan sudah live di dollarkilat.xyz.',
      },
    },
  },
  {
    slug: 'sapux',
    repo: 'sapuX',
    title: 'SapuX',
    categories: ['tools'],
    journeys: ['dev'],
    summary: {
      en: 'A Chrome extension that unfollows X accounts inactive for 6–12 months, filtered by follower count. Free, and nothing leaves your browser.',
      id: 'Chrome extension yang meng-unfollow akun X yang tidak aktif 6–12 bulan, dengan filter jumlah follower. Gratis, dan tidak ada data yang keluar dari browser.',
    },
    stats: [
      { value: 'Free', label: { en: 'for everyone', id: 'untuk semua' } },
      { value: '0', label: { en: 'third-party servers', id: 'server pihak ketiga' } },
      { value: '6–12', label: { en: 'months inactive', id: 'bulan tidak aktif' } },
    ],
    stack: ['Chrome Extension', 'JavaScript'],
    caseStudy: {
      overview: {
        en: 'SapuX ("sapu" means broom) cleans up the accounts you follow on X: anyone silent for six months to a year, optionally filtered by follower count.',
        id: 'SapuX membersihkan akun yang kamu follow di X: siapa pun yang diam enam bulan sampai setahun, dengan filter jumlah follower opsional.',
      },
      problem: {
        en: 'Third-party unfollow tools ask for full account access. Handing your X session to a stranger’s server is a security risk.',
        id: 'Tools unfollow pihak ketiga meminta akses penuh ke akun. Menyerahkan sesi X ke server orang lain adalah risiko keamanan.',
      },
      approach: {
        en: 'Everything runs inside your own browser as an extension. No backend, no account handover.',
        id: 'Semuanya berjalan di dalam browser sendiri sebagai extension. Tanpa backend, tanpa menyerahkan akun.',
      },
      broke: {
        en: 'Releasing it publicly means designing for people who are not me: safe defaults and clear limits matter more than raw speed.',
        id: 'Merilisnya ke publik berarti mendesain untuk orang lain: default yang aman dan batas yang jelas lebih penting daripada kecepatan.',
      },
      results: {
        en: 'Open source on GitHub and free for anyone to use.',
        id: 'Open source di GitHub dan gratis dipakai siapa saja.',
      },
    },
  },
  {
    slug: 'thesis-xgboost-lstm-btc',
    title: 'XGBoost vs LSTM, pre & post ETF',
    categories: ['research', 'ml'],
    journeys: ['ai', 'crypto'],
    summary: {
      en: 'Final thesis: predicting Bitcoin’s daily close with fused technical and on-chain features, compared before and after spot ETF approval.',
      id: 'Tugas akhir: memprediksi harga penutupan harian Bitcoin dengan fusi fitur teknikal dan on-chain, dibandingkan sebelum dan sesudah persetujuan ETF spot.',
    },
    stats: [
      { value: '2', label: { en: 'models', id: 'model' } },
      { value: '2', label: { en: 'market regimes', id: 'rezim pasar' } },
    ],
    stack: ['Python', 'XGBoost', 'LSTM', 'Binance BTCUSDT', 'Coin Metrics'],
    caseStudy: {
      overview: {
        en: '“Comparative analysis of XGBoost and LSTM for Bitcoin daily closing price prediction based on fusion of technical indicators and on-chain data, pre and post spot ETF.”',
        id: '“Analisis Komparasi Algoritma XGBoost dan LSTM untuk Prediksi Harga Penutupan Harian Bitcoin Berbasis Fusion of Technical Indicators and On-Chain Data pada Periode Pra dan Pasca ETF Spot.”',
      },
      problem: {
        en: 'Spot ETF approval changed who trades Bitcoin. A model that worked before may not work after, and most studies ignore the break.',
        id: 'Persetujuan ETF spot mengubah siapa yang memperdagangkan Bitcoin. Model yang bekerja sebelumnya belum tentu bekerja sesudahnya, dan banyak studi mengabaikan perubahan ini.',
      },
      approach: {
        en: 'Daily BTCUSDT prices from Binance fused with Coin Metrics on-chain data, evaluated separately for the pre-ETF and post-ETF periods.',
        id: 'Harga harian BTCUSDT dari Binance difusikan dengan data on-chain Coin Metrics, lalu dievaluasi terpisah untuk periode pra dan pasca ETF.',
      },
      broke: {
        en: 'Every experiment is logged, including the ones that did not work — the thesis is as much about honest comparison as about the best score.',
        id: 'Setiap eksperimen dicatat, termasuk yang gagal — tugas akhir ini soal perbandingan yang jujur, bukan hanya skor terbaik.',
      },
      results: {
        en: 'In progress; a journal version is being prepared.',
        id: 'Sedang berjalan; versi jurnal sedang disiapkan.',
      },
    },
  },
]
