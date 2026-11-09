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
      en: 'Trades Polymarket’s 15-minute Bitcoin markets with a Platt-calibrated XGBoost + LightGBM ensemble, twenty trade filters and Kelly-sized orders. More than 800 paper trades and a small live pilot in October 2026.',
      id: 'Trading di market Bitcoin 15 menit Polymarket dengan ensemble XGBoost + LightGBM terkalibrasi Platt, dua puluh filter trade, dan order berukuran Kelly. Lebih dari 800 trade simulasi dan pilot live kecil pada Oktober 2026.',
    },
    stats: [
      { value: '79', label: { en: 'features', id: 'fitur' } },
      { value: '20', label: { en: 'trade filters', id: 'filter trade' } },
      { value: '13', label: { en: 'cut-loss gates', id: 'gate cut-loss' } },
      { value: '800+', label: { en: 'simulated trades', id: 'trade simulasi' } },
    ],
    stack: ['TypeScript', 'Node.js', 'Python', 'XGBoost', 'LightGBM', 'WebSocket', 'Polymarket CLOB', 'Chainlink', 'React 19'],
    gallery: [
      {
        src: '/images/work/polymarket/dashboard-overview.webp',
        width: 1318,
        height: 662,
        alt: { en: 'POLY//15 dashboard: market pulse, bot decision, prediction, edge analysis and the Polymarket order book', id: 'Dashboard POLY//15: market pulse, keputusan bot, prediksi, analisis edge, dan order book Polymarket' },
        caption: {
          en: 'The live dashboard (dry run, 4 Nov 2026). Chainlink oracle price against the exact price to beat (TWAP), the bot’s decision, model and rule probabilities, and edge against the Polymarket book.',
          id: 'Dashboard live (dry run, 4 Nov 2026). Harga oracle Chainlink terhadap price to beat yang tepat (TWAP), keputusan bot, probabilitas model dan rule, serta edge terhadap order book Polymarket.',
        },
      },
      {
        src: '/images/work/polymarket/dashboard-signals.webp',
        width: 1318,
        height: 662,
        alt: { en: 'Dashboard panels: TA matrix, ML engine, JEV LLM layer, positions, session and bet sizing', id: 'Panel dashboard: matriks TA, ML engine, layer LLM JEV, posisi, sesi, dan bet sizing' },
        caption: {
          en: 'Signal internals: indicators, the ML ensemble blended with the rules, the LLM advisor in shadow mode, and Kelly sizing.',
          id: 'Isi sinyal: indikator, ensemble ML yang dipadukan dengan rule, advisor LLM dalam mode shadow, dan Kelly sizing.',
        },
      },
      {
        src: '/images/work/polymarket/dashboard-journal.webp',
        width: 1318,
        height: 662,
        alt: { en: 'Dashboard panels: trade accuracy, journal analytics against breakeven, and the global risk feed', id: 'Panel dashboard: akurasi trade, analitik jurnal terhadap titik impas, dan feed risiko global' },
        caption: {
          en: 'Every trade is journaled and scored against breakeven, including a “realistic fills” view that keeps only fills a live order would have got.',
          id: 'Setiap trade dicatat dan dinilai terhadap titik impas, termasuk tampilan “realistic fills” yang hanya memakai fill yang benar-benar bisa didapat order live.',
        },
      },
    ],
    caseStudy: {
      overview: {
        en: 'A trading system for Polymarket’s 15-minute Bitcoin markets: a TypeScript bot with a Python training pipeline. Live market feeds become 79 features on every poll; a Platt-calibrated XGBoost + LightGBM ensemble turns them into a probability; twenty trade filters and Kelly sizing decide whether and how much to bet. It has run more than 800 simulated trades, plus a small live pilot with real funds in October 2026.',
        id: 'Sistem trading untuk market Bitcoin 15 menit di Polymarket: bot TypeScript dengan pipeline training Python. Data pasar live diolah jadi 79 fitur di setiap polling; ensemble XGBoost + LightGBM terkalibrasi Platt mengubahnya jadi probabilitas; dua puluh filter trade dan Kelly sizing memutuskan apakah dan seberapa besar bertaruh. Bot ini sudah menjalankan lebih dari 800 trade simulasi, ditambah pilot live kecil dengan dana sungguhan pada Oktober 2026.',
      },
      problem: {
        en: 'Fifteen minutes is short enough that noise dominates and long enough that fees and slippage matter. The market price is already a strong forecast, so a model has to beat it, not just be accurate. And a raw classifier score is not a probability: betting on an uncalibrated score is how accounts go to zero.',
        id: 'Lima belas menit cukup singkat sehingga noise mendominasi, tapi cukup lama sehingga fee dan slippage berpengaruh. Harga pasar sendiri sudah merupakan prediksi yang kuat, jadi model harus mengalahkannya, bukan sekadar akurat. Dan skor classifier mentah bukan probabilitas: bertaruh dengan skor yang tidak terkalibrasi adalah cara cepat menghabiskan modal.',
      },
      approach: {
        en: 'Platt calibration on the ensemble output; Kelly sizing shrunk toward the market price; twenty numbered trade filters and thirteen cut-loss gates; CUSUM drift detection against the deployed model’s baseline. Every model is registered with its data and metrics, and a deploy gate rejects any model that does not beat the same-instant market price. An LLM advisor runs in shadow mode: it records a view on every market but cannot place or block a trade.',
        id: 'Kalibrasi Platt pada output ensemble; Kelly sizing yang ditarik ke arah harga pasar; dua puluh filter trade bernomor dan tiga belas gate cut-loss; deteksi drift CUSUM terhadap baseline model yang sedang dipakai. Setiap model dicatat bersama data dan metriknya, dan gate deploy menolak model yang tidak mengalahkan harga pasar di detik yang sama. Advisor LLM berjalan dalam mode shadow: mencatat pandangannya di setiap market, tapi tidak bisa membuka atau memblokir trade.',
      },
      broke: {
        en: 'Three things looked fine until they were measured. The first model claimed about 88% confidence in paper trading and won 68%: its training data had a 60-second look-ahead and a fake price-to-beat, so training and live features were rebuilt through one shared builder. The bot compared Bitcoin with the wrong reference: Polymarket settles on Chainlink’s 60-second TWAP, not the spot price, and matched 0 of 130 markets exactly until it read the TWAP tick. And the fee model charged about a quarter of the real taker fee, which put breakeven one to 1.3 points too low.',
        id: 'Tiga hal terlihat baik-baik saja sampai diukur. Model pertama mengklaim keyakinan sekitar 88% di paper trading tapi hanya menang 68%: data latihnya punya look-ahead 60 detik dan price-to-beat palsu, sehingga fitur training dan live dibangun ulang lewat satu builder yang sama. Bot membandingkan Bitcoin dengan acuan yang salah: Polymarket menyelesaikan market dengan TWAP 60 detik Chainlink, bukan harga spot, dan tidak ada satu pun dari 130 market yang cocok persis sampai bot membaca tick TWAP. Dan model fee hanya menghitung sekitar seperempat dari taker fee sebenarnya, sehingga titik impas 1–1,3 poin terlalu rendah.',
      },
      results: {
        en: 'After more than 800 simulated trades, a small live pilot ran from 26 October 2026. One of its trades entered against the model’s own direction, so a consensus gate now blocks that, and the bot is back in dry run while the stricter filters are evaluated. The LLM advisor stays in shadow because its calibrated forecast (Brier 0.233 over 617 markets) still trails the market’s own (0.228). Results are shown as architecture and lessons, not profit claims.',
        id: 'Setelah lebih dari 800 trade simulasi, pilot live kecil berjalan sejak 26 Oktober 2026. Salah satu trade-nya masuk berlawanan dengan arah model sendiri, jadi sekarang ada gate konsensus yang memblokirnya, dan bot kembali ke dry run selama filter yang lebih ketat dievaluasi. Advisor LLM tetap di mode shadow karena prediksinya yang sudah dikalibrasi (Brier 0,233 dari 617 market) masih kalah dari harga pasar (0,228). Hasil ditampilkan sebagai arsitektur dan pelajaran, bukan klaim profit.',
      },
    },
  },
  {
    slug: 'dollarkilat',
    repo: 'dollarkilat',
    title: 'dollarkilat',
    categories: ['web3'],
    journeys: ['crypto', 'dev'],
    homepage: 'https://dollarkilat.xyz',
    team: { en: 'Team project for Colosseum Frontier 2026 and Superteam Indonesia’s National Campus Hackathon', id: 'Proyek tim untuk Colosseum Frontier 2026 dan Indonesia National Campus Hackathon dari Superteam Indonesia' },
    summary: {
      en: 'An MVP for Indonesian freelancers: USDC on Solana in, QRIS payments out. Open source, live on devnet.',
      id: 'MVP untuk freelancer Indonesia: USDC di Solana masuk, bayar QRIS keluar. Open source, live di devnet.',
    },
    stats: [
      { value: 'USDC', label: { en: 'in', id: 'masuk' } },
      { value: 'QRIS', label: { en: 'out', id: 'keluar' } },
      { value: 'MVP', label: { en: 'live on Solana devnet', id: 'live di Solana devnet' } },
      { value: 'MIT', label: { en: 'open source', id: 'open source' } },
    ],
    stack: ['Solana', 'Next.js', 'PWA', 'QRIS', 'Vercel'],
    gallery: [
      {
        src: '/images/work/dollarkilat/landing-desktop.webp',
        width: 1440,
        height: 900,
        alt: { en: 'dollarkilat landing page: Earned in dollars, spend in rupiah', id: 'Halaman depan dollarkilat: Earned in dollars, spend in rupiah' },
        caption: {
          en: 'The public landing page at dollarkilat.xyz, the MVP running on Solana devnet.',
          id: 'Halaman publik dollarkilat.xyz, MVP yang berjalan di Solana devnet.',
        },
      },
      {
        src: '/images/work/dollarkilat/landing-phone.webp',
        width: 720,
        height: 1561,
        alt: { en: 'dollarkilat on a phone: headline, sign-up buttons and a balance preview card', id: 'dollarkilat di HP: judul, tombol daftar, dan kartu contoh saldo' },
        caption: {
          en: 'On a phone, where the PWA is meant to be used. The balance card is the page’s own preview, not a real account.',
          id: 'Di HP, tempat PWA ini dipakai. Kartu saldo adalah contoh dari halamannya sendiri, bukan akun sungguhan.',
        },
      },
      {
        src: '/images/work/dollarkilat/features-phone.webp',
        width: 720,
        height: 1561,
        alt: { en: 'dollarkilat features: embedded wallet, instant QRIS, live rate', id: 'Fitur dollarkilat: embedded wallet, QRIS instan, kurs live' },
        caption: {
          en: 'An embedded Solana wallet created from your email, QRIS payments, and a live USDC to IDR rate.',
          id: 'Wallet Solana yang dibuat otomatis dari email, pembayaran QRIS, dan kurs USDC ke IDR yang live.',
        },
      },
      {
        src: '/images/work/dollarkilat/steps-phone.webp',
        width: 720,
        height: 1561,
        alt: { en: 'dollarkilat in three steps: sign up with email, receive USDC, scan QRIS', id: 'dollarkilat dalam tiga langkah: daftar dengan email, terima USDC, scan QRIS' },
        caption: {
          en: 'Three steps: sign up with email, receive USDC, scan a QRIS code. No seed phrase and no wallet to install.',
          id: 'Tiga langkah: daftar dengan email, terima USDC, scan QRIS. Tanpa seed phrase dan tanpa install wallet.',
        },
      },
    ],
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
        en: 'Shipped as an MVP for Colosseum Frontier 2026 and Superteam Indonesia’s National Campus Hackathon: the full code is open source under MIT on GitHub, and the app is live at dollarkilat.xyz on Solana devnet. It was built for the hackathons, so its users so far are a small group; taking QRIS payouts to mainnet would need a licensed payment partner.',
        id: 'Dirilis sebagai MVP untuk Colosseum Frontier 2026 dan Indonesia National Campus Hackathon dari Superteam Indonesia: seluruh kodenya open source (MIT) di GitHub, dan aplikasinya live di dollarkilat.xyz di Solana devnet. Karena dibuat untuk hackathon, penggunanya sejauh ini masih sedikit; membawa pembayaran QRIS ke mainnet butuh mitra pembayaran berizin.',
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
    gallery: [
      {
        src: '/images/work/sapux/review.webp',
        width: 720,
        height: 1384,
        alt: { en: 'SapuX Review tab: accounts grouped as inactive, small and one-way, each with days since its last post', id: 'Tab Review SapuX: akun dikelompokkan jadi tidak aktif, kecil, dan satu arah, masing-masing dengan hari sejak post terakhir' },
        caption: {
          en: 'The Review tab after a scan of a test account: who has been silent, for how long, and who to keep. Simulation mode is on until you turn it off.',
          id: 'Tab Review setelah memindai akun uji: siapa yang diam, sudah berapa lama, dan siapa yang dipertahankan. Mode simulasi aktif sampai kamu matikan.',
        },
      },
      {
        src: '/images/work/sapux/confirm.webp',
        width: 720,
        height: 1384,
        alt: { en: 'SapuX confirmation before a live run: accounts to unfollow, estimated time and warnings', id: 'Konfirmasi SapuX sebelum menjalankan sungguhan: jumlah akun, perkiraan waktu, dan peringatan' },
        caption: {
          en: 'Before a live run it shows how many accounts, how long it will take, and which ones may still be active.',
          id: 'Sebelum menjalankan sungguhan, SapuX menunjukkan jumlah akun, perkiraan waktu, dan akun mana yang mungkin masih aktif.',
        },
      },
      {
        src: '/images/work/sapux/queue.webp',
        width: 720,
        height: 1384,
        alt: { en: 'SapuX queue card after the daily limit: Resume or Discard', id: 'Kartu antrean SapuX setelah batas harian: Resume atau Discard' },
        caption: {
          en: 'A daily limit stops the run; what is left waits in a queue you can resume the next day.',
          id: 'Batas harian menghentikan proses; sisanya menunggu di antrean yang bisa dilanjutkan besok.',
        },
      },
    ],
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
        en: 'Every experiment is logged, including the ones that did not work. The thesis is as much about honest comparison as about the best score.',
        id: 'Setiap eksperimen dicatat, termasuk yang gagal. Tugas akhir ini soal perbandingan yang jujur, bukan hanya skor terbaik.',
      },
      results: {
        en: 'In progress; a journal version is being prepared.',
        id: 'Sedang berjalan; versi jurnal sedang disiapkan.',
      },
    },
  },
]
