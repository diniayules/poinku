export type Lang = 'id' | 'en'

type Entry = { id: string; en: string }

export const dict = {
  appTitle: { id: 'Petualangan Poin', en: 'Point Adventure' },

  // Common
  back: { id: 'Kembali', en: 'Back' },
  cancel: { id: 'Batal', en: 'Cancel' },
  save: { id: 'Simpan', en: 'Save' },
  add: { id: 'Tambah', en: 'Add' },
  edit: { id: 'Ubah', en: 'Edit' },
  delete: { id: 'Hapus', en: 'Delete' },
  close: { id: 'Tutup', en: 'Close' },
  next: { id: 'Lanjut', en: 'Next' },
  approve: { id: 'Setuju', en: 'Approve' },
  reject: { id: 'Tolak', en: 'Reject' },
  give: { id: 'Berikan', en: 'Give' },
  laterFirst: { id: 'Nanti dulu', en: 'Later' },
  empty: { id: 'Belum ada', en: 'Empty' },
  forChild: { id: 'Untuk anak', en: 'For child' },
  optional: { id: 'opsional', en: 'optional' },
  pointsShort: { id: 'poin', en: 'points' },
  minutesShort: { id: 'menit', en: 'min' },

  // Setup
  setupWelcomeTitle: { id: 'Halo, Kapten!', en: 'Hello, Captain!' },
  setupWelcomeSub: {
    id: 'Selamat datang di Petualangan Poin. Ayo kita siapkan akunnya dulu.',
    en: 'Welcome to Point Adventure. Let’s set up the account first.',
  },
  setupStart: { id: 'Mulai Petualangan', en: 'Start Adventure' },
  setupCreatePinTitle: { id: 'Buat PIN Orang Tua', en: 'Create Parent PIN' },
  setupCreatePinSub: {
    id: 'PIN 4 digit untuk orang tua (untuk konfirmasi tugas & atur poin).',
    en: '4-digit PIN for parent (to confirm tasks & manage points).',
  },
  setupRetypePinTitle: { id: 'Ketik Ulang PIN', en: 'Retype PIN' },
  setupRetypePinSub: {
    id: 'Pastikan tidak salah ketik.',
    en: 'Make sure it’s correct.',
  },
  pinMismatch: {
    id: 'PIN tidak sama. Coba lagi.',
    en: 'PIN doesn’t match. Try again.',
  },
  pinWrong: { id: 'PIN salah. Coba lagi.', en: 'Wrong PIN. Try again.' },
  changePin: { id: 'Ganti PIN', en: 'Change PIN' },
  setupAddFirstTitle: {
    id: 'Tambah Anak Pertama',
    en: 'Add First Child',
  },
  setupAddFirstSub: {
    id: 'Siapa astronot pertama kita?',
    en: 'Who’s our first astronaut?',
  },
  fieldName: { id: 'Nama', en: 'Name' },
  fieldAvatar: {
    id: 'Avatar (foto atau pilih emoji)',
    en: 'Avatar (photo or pick emoji)',
  },
  setupFinish: {
    id: 'Selesai — Mulai Main!',
    en: 'Done — Start Playing!',
  },
  namePlaceholder: { id: 'Contoh: Adik', en: 'e.g. Sister' },

  // Home (default — fallback)
  homeTitle: { id: 'Pilih Astronot', en: 'Pick Astronaut' },
  homeSub: {
    id: 'Siapa yang mau lihat poinnya hari ini?',
    en: 'Who wants to check their points today?',
  },
  // Home — per tema
  homeTitleLuarAngkasa: { id: 'Pilih Astronot', en: 'Pick Astronaut' },
  homeTitleHutan: { id: 'Pilih Penjelajah', en: 'Pick Explorer' },
  homeTitleBawahLaut: { id: 'Pilih Penyelam', en: 'Pick Diver' },
  homeTitlePermen: { id: 'Pilih Pencicip', en: 'Pick Taster' },
  homeTitleCeria: { id: 'Pilih Sahabat', en: 'Pick Buddy' },
  parentMode: { id: 'Mode Orang Tua', en: 'Parent Mode' },
  parentModeMenuSub: {
    id: 'Pilih menu — perlu PIN untuk masuk',
    en: 'Pick a menu — PIN required to enter',
  },

  // PIN gate
  enterPin: {
    id: 'Masukkan PIN Orang Tua',
    en: 'Enter Parent PIN',
  },

  // Parent tabs
  tabKonfirmasi: { id: 'Konfirmasi', en: 'Confirm' },
  tabTugas: { id: 'Tugas', en: 'Tasks' },
  tabHadiah: { id: 'Hadiah', en: 'Rewards' },
  tabSesuaikan: { id: 'Sesuaikan Poin', en: 'Adjust Points' },
  tabPengaturan: { id: 'Pengaturan', en: 'Settings' },
  exitParent: {
    id: 'Keluar Mode Orang Tua',
    en: 'Exit Parent Mode',
  },

  // Menu descriptions
  menuKonfirmasiDesc: {
    id: 'Setujui tugas, usulan, & klaim hadiah anak',
    en: 'Approve tasks, suggestions & reward claims',
  },
  menuTugasDesc: {
    id: 'Atur daftar tugas harian anak',
    en: 'Manage daily routine tasks',
  },
  menuHadiahDesc: {
    id: 'Kelola katalog hadiah & harganya',
    en: 'Manage rewards catalog & prices',
  },
  menuSesuaikanDesc: {
    id: 'Tambah bonus atau kurangi poin',
    en: 'Add bonus or deduct points',
  },
  menuPengaturanDesc: {
    id: 'Tambah/hapus anak, ganti PIN, tema, bahasa',
    en: 'Add/remove children, PIN, theme, language',
  },
  tugasRutinitas: { id: 'Tugas Rutinitas', en: 'Routine Tasks' },

  // Child Dashboard
  changeProfile: { id: 'Ganti Profil', en: 'Switch Profile' },
  todaysTasks: { id: 'Tugas Hari Ini', en: 'Today’s Tasks' },
  schoolDay: { id: 'Hari Sekolah', en: 'School Day' },
  weekend: { id: 'Akhir Pekan', en: 'Weekend' },
  noTasksToday: {
    id: 'Belum ada tugas hari ini. Kamu bisa menambahkan sendiri 👇',
    en: 'No tasks yet today. You can add your own 👇',
  },
  waitingParent: {
    id: '⏳ Menunggu konfirmasi orang tua…',
    en: '⏳ Waiting for parent to confirm…',
  },
  approvedPoints: {
    id: '✨ Disetujui! +{poin} poin masuk',
    en: '✨ Approved! +{poin} points added',
  },
  addExtraTask: {
    id: '＋ Tambah tugas hari ini',
    en: '＋ Add a task today',
  },
  extraTaskLabel: {
    id: 'Tugas tambahan yang kamu kerjakan',
    en: 'Extra task you completed',
  },
  extraTaskPlaceholder: {
    id: 'Contoh: Membuatkan susu untuk adik',
    en: 'e.g. Made milk for little brother',
  },
  extraTaskHint: {
    id: 'Poinnya akan ditentukan oleh orang tua saat mengkonfirmasi.',
    en: 'Points will be set by parent on confirmation.',
  },
  sendToParent: { id: 'Kirim ke Orang Tua', en: 'Send to Parent' },
  proposalBadge: { id: 'Usulan', en: 'Suggested' },
  waitingPointSet: {
    id: '⏳ Menunggu orang tua menentukan poinnya…',
    en: '⏳ Waiting for parent to set points…',
  },

  // Rewards
  rewardsTitle: { id: 'Hadiah', en: 'Rewards' },
  rewardsGate: {
    id: '🔒 Selesaikan dulu semua tugas hari ini, baru kamu bisa klaim hadiah!',
    en: '🔒 Finish all today’s tasks first to claim rewards!',
  },
  rewardClaim: { id: 'Klaim', en: 'Claim' },
  rewardLockedNeed: {
    id: '🔒 Butuh {poin} poin lagi',
    en: '🔒 Need {poin} more points',
  },
  rewardLockedOther: {
    id: '🔒 Sudah pilih hadiah lain periode ini',
    en: '🔒 Already chose another reward this period',
  },
  rewardLockedToday: {
    id: '🔒 Selesaikan tugas hari ini dulu',
    en: '🔒 Finish today’s tasks first',
  },
  rewardWaiting: {
    id: '⏳ Menunggu konfirmasi orang tua',
    en: '⏳ Waiting for parent confirmation',
  },
  rewardGiven: { id: '🎉 Sudah diberikan!', en: '🎉 Given!' },
  rewardCelebrationTitle: {
    id: 'HADIAH TERSEDIA!',
    en: 'REWARD AVAILABLE!',
  },
  rewardCelebrationSub: {
    id: 'Pilih satu hadiah untuk di-klaim. Orang tua akan konfirmasi dulu.',
    en: 'Pick one reward to claim. Parent will confirm first.',
  },
  rewardTipeHarian: { id: 'Harian', en: 'Daily' },
  rewardTipeMingguan: { id: 'Mingguan', en: 'Weekly' },
  rewardTipeBulanan: { id: 'Bulanan', en: 'Monthly' },

  // Konfirmasi
  noPending: {
    id: 'Tidak ada yang menunggu konfirmasi 🎉',
    en: 'Nothing waiting for confirmation 🎉',
  },
  finishedAt: { id: 'Selesai pukul {jam}', en: 'Finished at {jam}' },
  lateBy: { id: '⚠️ Lewat {n} menit', en: '⚠️ {n} min late' },
  onTime: { id: '✓ Tepat waktu', en: '✓ On time' },
  pointsAt: { id: 'poin {periode} saat itu', en: '{periode} points then' },
  rewardClaimBadge: { id: 'Klaim Hadiah', en: 'Reward Claim' },
  claimedAt: { id: 'Diklaim pukul {jam}', en: 'Claimed at {jam}' },
  givePoints: { id: 'Beri poin:', en: 'Give points:' },
  approveWithPoints: {
    id: '✓ Setuju +{n}',
    en: '✓ Approve +{n}',
  },
  sentAt: { id: 'dikirim pukul {jam}', en: 'sent at {jam}' },

  // Tugas (parent)
  addTaskTitle: {
    id: 'Tambah Tugas Rutinitas Harian',
    en: 'Add Daily Routine Task',
  },
  editTaskTitle: { id: 'Ubah Tugas', en: 'Edit Task' },
  taskJudulPlaceholder: {
    id: 'Contoh: Gosok gigi',
    en: 'e.g. Brush teeth',
  },
  taskJam: { id: 'Jam', en: 'Time' },
  taskJamOpt: { id: 'Jam (opsional)', en: 'Time (optional)' },
  taskDurasi: { id: 'Durasi (menit)', en: 'Duration (min)' },
  pointsTitle: { id: 'Poin', en: 'Points' },
  durasiPlaceholder: { id: 'mis. 30', en: 'e.g. 30' },
  taskIkon: {
    id: 'Ikon (foto atau pilih emoji)',
    en: 'Icon (photo or pick emoji)',
  },
  taskJadwal: { id: 'Berlaku pada', en: 'Applies on' },
  jadwalSetiap: { id: 'Setiap hari', en: 'Every day' },
  jadwalSekolah: { id: 'Hari sekolah', en: 'School day' },
  jadwalAkhir: { id: 'Akhir pekan', en: 'Weekend' },
  taskListLabel: { id: 'Daftar tugas', en: 'Task list' },
  noTasks: { id: 'Belum ada tugas', en: 'No tasks yet' },
  suggestHint: {
    id: 'Sudah pernah dibuat untuk anak lain — klik untuk menyalin',
    en: 'Already exists for another child — tap to copy',
  },
  confirmDeleteTask: { id: 'Hapus tugas ini?', en: 'Delete this task?' },

  // Hadiah (parent)
  addRewardTitle: { id: 'Tambah Hadiah', en: 'Add Reward' },
  editRewardTitle: { id: 'Ubah Hadiah', en: 'Edit Reward' },
  rewardJudulPlaceholder: {
    id: 'Contoh: Screen time 1 jam',
    en: 'e.g. Screen time 1 hour',
  },
  rewardHarga: { id: 'Harga (poin)', en: 'Price (points)' },
  rewardTipe: { id: 'Tipe', en: 'Type' },
  rewardListLabel: { id: 'Daftar hadiah', en: 'Reward list' },
  noRewards: { id: 'Belum ada hadiah', en: 'No rewards yet' },
  confirmDeleteReward: { id: 'Hapus hadiah ini?', en: 'Delete this reward?' },

  // Sesuaikan Poin
  addPoints: { id: '+ Tambah Poin', en: '+ Add Points' },
  subtractPoints: { id: '− Kurangi Poin', en: '− Deduct Points' },
  pointAmount: { id: 'Jumlah poin', en: 'Amount of points' },
  reason: { id: 'Alasan', en: 'Reason' },
  reasonPlaceholderPlus: {
    id: 'Contoh: Bantu cuci piring',
    en: 'e.g. Helped wash dishes',
  },
  reasonPlaceholderMinus: {
    id: 'Contoh: Telat tidur',
    en: 'e.g. Late to bed',
  },
  addedToChild: {
    id: '✨ +{n} poin ditambahkan',
    en: '✨ +{n} points added',
  },
  subtractedFromChild: {
    id: '⚠️ -{n} poin dikurangi',
    en: '⚠️ -{n} points deducted',
  },
  addPointsTo: {
    id: 'Tambah +{n} ke {nama}',
    en: 'Add +{n} to {nama}',
  },
  subtractPointsFrom: {
    id: 'Kurangi -{n} dari {nama}',
    en: 'Deduct -{n} from {nama}',
  },
  recentAdjustments: {
    id: 'Riwayat penyesuaian (terbaru)',
    en: 'Recent adjustments',
  },
  noAdjustments: {
    id: 'Belum ada penyesuaian',
    en: 'No adjustments yet',
  },
  confirmDeleteAdjustment: {
    id: 'Hapus penyesuaian ini? Poin akan dikembalikan.',
    en: 'Delete this adjustment? Points will be reverted.',
  },
  dialogConfirmTitle: { id: 'Konfirmasi', en: 'Confirm' },
  dialogSuccessTitle: { id: 'Berhasil', en: 'Success' },
  dialogErrorTitle: { id: 'Gagal', en: 'Failed' },
  ok: { id: 'OK', en: 'OK' },

  // Multi-select
  selectMode: { id: '✓ Pilih', en: '✓ Select' },
  selectedN: { id: '{n} dipilih', en: '{n} selected' },
  selectAll: { id: 'Pilih semua', en: 'Select all' },
  unselectAll: { id: 'Lepas semua', en: 'Unselect all' },
  exitSelect: { id: 'Selesai', en: 'Done' },
  confirmBulkDelete: {
    id: 'Hapus {n} item terpilih?',
    en: 'Delete {n} selected items?',
  },
  confirmBulkDeleteAdjustment: {
    id: 'Hapus {n} penyesuaian terpilih? Total poin akan dikembalikan.',
    en: 'Delete {n} selected adjustments? Points will be reverted.',
  },

  // Pengaturan
  themeLabel: { id: 'Tema', en: 'Theme' },
  languageLabel: { id: 'Bahasa / Language', en: 'Language / Bahasa' },
  backupRestoreLabel: {
    id: 'Cadangkan & Pulihkan Data',
    en: 'Backup & Restore Data',
  },
  backupBtn: { id: '📤 Cadangkan Data', en: '📤 Backup Data' },
  restoreBtn: { id: '📥 Pulihkan Data', en: '📥 Restore Data' },
  backupHint: {
    id: 'Simpan file backup ke Google Drive / iCloud / email — bisa dipulihkan di device lain atau saat reset.',
    en: 'Save the backup file to Google Drive / iCloud / email — restorable on another device or after reset.',
  },
  restoreConfirm: {
    id: 'Pulihkan data dari file ini? Semua data saat ini akan diganti — pastikan sudah backup dulu.',
    en: 'Restore data from this file? All current data will be replaced — back up first if needed.',
  },
  restoreInvalid: {
    id: 'File tidak valid atau bukan backup Petualangan Poin.',
    en: 'Invalid file or not a Point Adventure backup.',
  },
  restoreDone: {
    id: 'Data berhasil dipulihkan ✅',
    en: 'Data restored ✅',
  },
  childrenLabel: { id: 'Anak', en: 'Children' },
  addChild: { id: '+ Tambah Anak', en: '+ Add Child' },
  addChildTitle: { id: 'Tambah Anak Baru', en: 'Add New Child' },
  editChildTitle: { id: 'Ubah Profil Anak', en: 'Edit Child Profile' },
  pinLabel: { id: 'PIN Orang Tua', en: 'Parent PIN' },
  pinNew: { id: 'PIN Baru', en: 'New PIN' },
  pinRetype: { id: 'Ketik Ulang', en: 'Retype' },
  savePin: { id: 'Simpan PIN', en: 'Save PIN' },
  pinChanged: {
    id: 'PIN berhasil diubah ✅',
    en: 'PIN changed successfully ✅',
  },
  confirmDeleteChild: {
    id: 'Hapus {nama}? Semua tugas, konfirmasi, dan riwayat poinnya juga ikut terhapus.',
    en: 'Delete {nama}? All tasks, confirmations, and point history will also be removed.',
  },

  // Tema labels (override storage labels at render time)
  temaLuarAngkasa: { id: 'Luar Angkasa', en: 'Outer Space' },
  temaHutan: { id: 'Hutan Petualangan', en: 'Forest Adventure' },
  temaBawahLaut: { id: 'Bawah Laut', en: 'Underwater' },
  temaPermen: { id: 'Negeri Permen', en: 'Candyland' },
  temaCeria: { id: 'Ceria', en: 'Cheerful' },

  // Periode di teks "saat itu"
  periodeHarianLower: { id: 'harian', en: 'daily' },
  periodeMingguanLower: { id: 'mingguan', en: 'weekly' },
  periodeBulananLower: { id: 'bulanan', en: 'monthly' },
} satisfies Record<string, Entry>

export type DictKey = keyof typeof dict
