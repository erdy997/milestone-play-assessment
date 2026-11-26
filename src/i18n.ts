import type { DomainId, FrequencyValue, L, Lang, ResponseValue } from './types';

export const DISCLAIMER: L = {
  en: 'Developmental screening is not a diagnostic assessment. Results provide a preliminary overview of developmental observations and do not confirm or exclude any developmental condition. If concerns are identified, parents are encouraged to consult a qualified healthcare or developmental professional.',
  ms: 'Saringan perkembangan bukan penilaian diagnostik. Keputusan memberikan gambaran awal berdasarkan pemerhatian perkembangan dan tidak mengesahkan atau menolak sebarang keadaan perkembangan. Sekiranya terdapat kebimbangan, ibu bapa digalakkan mendapatkan konsultasi daripada profesional kesihatan atau perkembangan yang berkelayakan.',
};

export const DOMAIN_LABELS: Record<DomainId, L> = {
  grossMotor: { en: 'Gross Motor', ms: 'Motor Kasar' },
  fineMotor: { en: 'Fine Motor', ms: 'Motor Halus' },
  communication: { en: 'Communication & Language', ms: 'Komunikasi & Bahasa' },
  cognitive: { en: 'Cognitive Development', ms: 'Perkembangan Kognitif' },
  socialEmotional: { en: 'Social-Emotional & Adaptive', ms: 'Sosio-Emosi & Adaptif' },
};

export const DOMAIN_SHORT: Record<DomainId, L> = {
  grossMotor: { en: 'Gross Motor', ms: 'Motor Kasar' },
  fineMotor: { en: 'Fine Motor', ms: 'Motor Halus' },
  communication: { en: 'Language', ms: 'Bahasa' },
  cognitive: { en: 'Cognitive', ms: 'Kognitif' },
  socialEmotional: { en: 'Social-Emotional', ms: 'Sosio-Emosi' },
};

export const RESPONSE_LABELS: Record<ResponseValue, L> = {
  achieved: { en: 'Achieved', ms: 'Ya' },
  sometimes: { en: 'Sometimes', ms: 'Kadang-kadang' },
  notYet: { en: 'Not Yet', ms: 'Belum' },
  notSure: { en: 'Not Sure', ms: 'Tidak Pasti' },
  notObserved: { en: 'Not Observed', ms: 'Tidak Diperhatikan' },
};

/** Colours per response (used in charts and badges). Tuned against the brand palette. */
export const RESPONSE_COLORS: Record<ResponseValue, string> = {
  achieved: '#172B5A',
  sometimes: '#4F7BC4',
  notYet: '#E0A458',
  notSure: '#9AA3B5',
  notObserved: '#CDD3DE',
};

export const FREQUENCY_LABELS: Record<FrequencyValue, L> = {
  always: { en: 'Always', ms: 'Sentiasa' },
  often: { en: 'Often', ms: 'Kerap' },
  sometimes: { en: 'Sometimes', ms: 'Kadang-kadang' },
  rarely: { en: 'Rarely', ms: 'Jarang' },
  never: { en: 'Never', ms: 'Tidak pernah' },
  notSure: { en: 'Not Sure', ms: 'Tidak Pasti' },
};

export const FREQUENCY_COLORS: Record<FrequencyValue, string> = {
  always: '#172B5A',
  often: '#3F63A8',
  sometimes: '#7FB3DE',
  rarely: '#B9D3EE',
  never: '#D5DDEA',
  notSure: '#D9828B',
};

/** Label for any stored answer (developmental or frequency scale). */
export function answerLabel(v: ResponseValue | FrequencyValue): L {
  return (RESPONSE_LABELS as Record<string, L>)[v] ?? (FREQUENCY_LABELS as Record<string, L>)[v] ?? { en: String(v), ms: String(v) };
}

const S = {
  appName: { en: "LET'Z PLAY DEVELOPMENT CHECK", ms: "LET'Z PLAY DEVELOPMENT CHECK" },
  org: { en: "LET'Z PLAY THERAPY", ms: "LET'Z PLAY THERAPY" },
  motto: { en: 'Nurturing Abilities, Inspiring Possibilities.', ms: 'Nurturing Abilities, Inspiring Possibilities.' },
  tagline: { en: 'Understand Your Child. Discover Their Potential.', ms: 'Fahami Anak Anda. Temui Potensi Mereka.' },
  welcomeIntro: {
    en: 'Developmental screening is a short check of the everyday skills your child shows at home: moving, using their hands, talking, thinking and getting along with others. It helps you notice strengths and decide whether to talk to a professional.',
    ms: 'Saringan perkembangan ialah semakan ringkas tentang kemahiran harian yang ditunjukkan oleh anak anda di rumah: bergerak, menggunakan tangan, bercakap, berfikir dan bergaul dengan orang lain. Ia membantu anda mengenal pasti kekuatan dan memutuskan sama ada perlu berjumpa profesional.',
  },
  feat1: { en: 'For children 0–6 years', ms: 'Untuk kanak-kanak 0–6 tahun' },
  feat2: { en: 'About 5–10 minutes', ms: 'Kira-kira 5–10 minit' },
  feat3: { en: 'Data stays on this device', ms: 'Data kekal dalam peranti ini' },
  feat4: { en: 'Download a PDF report', ms: 'Muat turun laporan PDF' },
  chooseLanguage: { en: 'Choose language', ms: 'Pilih bahasa' },
  start: { en: 'Start Screening', ms: 'Mula Saringan' },
  resume: { en: 'Resume saved screening', ms: 'Sambung saringan yang disimpan' },
  demoBanner: {
    en: 'Demonstration items: the questions in this version are not a validated screening instrument and do not produce normative scores.',
    ms: 'Item demonstrasi: soalan dalam versi ini bukan instrumen saringan yang disahkan dan tidak menghasilkan skor normatif.',
  },
  // profile
  profileTitle: { en: 'Child Profile', ms: 'Profil Kanak-kanak' },
  profileSub: { en: 'We use the date of birth to choose questions suited to your child’s age.', ms: 'Tarikh lahir digunakan untuk memilih soalan yang sesuai dengan umur anak anda.' },
  childName: { en: "Child's name", ms: 'Nama kanak-kanak' },
  screeningId: { en: 'Screening ID', ms: 'ID Saringan' },
  nameOrId: { en: 'Enter a name or a screening ID (at least one).', ms: 'Masukkan nama atau ID saringan (sekurang-kurangnya satu).' },
  optional: { en: 'optional', ms: 'pilihan' },
  dob: { en: 'Date of birth', ms: 'Tarikh lahir' },
  age: { en: 'Age', ms: 'Umur' },
  chronologicalAge: { en: 'Chronological age', ms: 'Umur kronologi' },
  ageMonths: { en: 'Age in months', ms: 'Umur dalam bulan' },
  gender: { en: 'Gender', ms: 'Jantina' },
  male: { en: 'Male', ms: 'Lelaki' },
  female: { en: 'Female', ms: 'Perempuan' },
  preferNot: { en: 'Prefer not to say', ms: 'Tidak mahu nyatakan' },
  caregiver: { en: 'Parent / caregiver name', ms: 'Nama ibu bapa / penjaga' },
  screeningDate: { en: 'Screening date', ms: 'Tarikh saringan' },
  purpose: { en: 'Screening purpose', ms: 'Tujuan saringan' },
  purpose_exhibition: { en: 'Community / exhibition screening', ms: 'Saringan komuniti / pameran' },
  purpose_parentCheck: { en: 'Parent self-check', ms: 'Semakan kendiri ibu bapa' },
  purpose_followUp: { en: 'Follow-up screening', ms: 'Saringan susulan' },
  purpose_other: { en: 'Other', ms: 'Lain-lain' },
  ageGroup: { en: 'Questionnaire age group', ms: 'Kumpulan umur soal selidik' },
  continue: { en: 'Continue', ms: 'Teruskan' },
  back: { en: 'Back', ms: 'Kembali' },
  errDobRequired: { en: 'Please enter the date of birth.', ms: 'Sila masukkan tarikh lahir.' },
  errDobFuture: { en: 'Date of birth cannot be after the screening date.', ms: 'Tarikh lahir tidak boleh selepas tarikh saringan.' },
  errDobOld: { en: 'This screening is for children from birth to 72 months (6 years).', ms: 'Saringan ini untuk kanak-kanak dari lahir hingga 72 bulan (6 tahun).' },
  errDobInvalid: { en: 'Please enter a valid date.', ms: 'Sila masukkan tarikh yang sah.' },
  errNameOrId: { en: 'Please enter a name or a screening ID.', ms: 'Sila masukkan nama atau ID saringan.' },
  errNoItems: { en: 'No questions are configured for this age group.', ms: 'Tiada soalan dikonfigurasi untuk kumpulan umur ini.' },
  months: { en: 'months', ms: 'bulan' },
  years: { en: 'years', ms: 'tahun' },
  days: { en: 'days', ms: 'hari' },
  // questionnaire
  question: { en: 'Question', ms: 'Soalan' },
  of: { en: 'of', ms: 'daripada' },
  previous: { en: 'Previous', ms: 'Sebelumnya' },
  next: { en: 'Next', ms: 'Seterusnya' },
  finishDomain: { en: 'Next domain', ms: 'Domain seterusnya' },
  selectAnswer: { en: 'Please choose an answer to continue.', ms: 'Sila pilih jawapan untuk meneruskan.' },
  doesYourChild: { en: 'Does your child…', ms: 'Adakah anak anda…' },
  saved: { en: 'Progress saved on this device', ms: 'Kemajuan disimpan dalam peranti ini' },
  concernsTitle: { en: 'Your concerns', ms: 'Kebimbangan anda' },
  concernsSub: { en: 'Is there anything about your child’s development that worries you? This is optional.', ms: 'Adakah apa-apa tentang perkembangan anak anda yang membimbangkan anda? Ini adalah pilihan.' },
  concernsDomains: { en: 'Areas you are concerned about', ms: 'Bidang yang anda bimbangkan' },
  concernsText: { en: 'Describe your concerns (optional)', ms: 'Terangkan kebimbangan anda (pilihan)' },
  seeResults: { en: 'See Results', ms: 'Lihat Keputusan' },
  unanswered: { en: 'Some questions are not answered yet. Please complete them first.', ms: 'Beberapa soalan belum dijawab. Sila lengkapkan dahulu.' },
  goTo: { en: 'Go to first unanswered', ms: 'Pergi ke soalan pertama yang belum dijawab' },
  exit: { en: 'Exit', ms: 'Keluar' },
  // results
  resultsTitle: { en: 'Screening Results', ms: 'Keputusan Saringan' },
  descriptiveNote: {
    en: 'These are descriptive summaries of your answers. They are not normative developmental scores and do not classify your child.',
    ms: 'Ini ialah ringkasan deskriptif jawapan anda. Ia bukan skor perkembangan normatif dan tidak mengklasifikasikan anak anda.',
  },
  domainSummary: { en: 'Domain summaries', ms: 'Ringkasan domain' },
  responsesByDomain: { en: 'Responses by domain', ms: 'Respons mengikut domain' },
  catAchieved: { en: 'Skills reported as achieved', ms: 'Kemahiran dilaporkan telah dicapai' },
  catEmerging: { en: 'Skills reported as emerging or inconsistent', ms: 'Kemahiran dilaporkan sedang berkembang atau tidak konsisten' },
  catNotYet: { en: 'Skills reported as not yet achieved', ms: 'Kemahiran dilaporkan belum dicapai' },
  catClarify: { en: 'Items requiring clarification', ms: 'Item yang memerlukan penjelasan' },
  strengths: { en: 'Strengths observed', ms: 'Kekuatan yang diperhatikan' },
  monitor: { en: 'Areas requiring further observation', ms: 'Bidang yang memerlukan pemerhatian lanjut' },
  reviewItems: { en: 'Items for professional review', ms: 'Item untuk semakan profesional' },
  parentConcerns: { en: 'Parent concerns', ms: 'Kebimbangan ibu bapa' },
  noConcerns: { en: 'No concerns were reported.', ms: 'Tiada kebimbangan dilaporkan.' },
  recommendations: { en: 'Recommendations', ms: 'Cadangan' },
  homeActivities: { en: 'Suggested home activities', ms: 'Cadangan aktiviti di rumah' },
  none: { en: 'None', ms: 'Tiada' },
  downloadPdf: { en: 'DOWNLOAD DEVELOPMENTAL SCREENING REPORT (PDF)', ms: 'MUAT TURUN LAPORAN SARINGAN PERKEMBANGAN (PDF)' },
  generating: { en: 'Generating PDF…', ms: 'Menjana PDF…' },
  pdfError: { en: 'The PDF could not be created. Please try again.', ms: 'PDF tidak dapat dijana. Sila cuba lagi.' },
  pdfDone: { en: 'Report downloaded', ms: 'Laporan dimuat turun' },
  newScreening: { en: 'Start a new screening', ms: 'Mula saringan baharu' },
  editAnswers: { en: 'Edit answers', ms: 'Ubah jawapan' },
  proSection: { en: 'For professionals (optional)', ms: 'Untuk profesional (pilihan)' },
  proSectionSub: { en: 'Comments typed here appear on page 4 of the PDF. Leave blank to print empty fields for handwriting.', ms: 'Komen yang ditaip di sini akan dipaparkan di halaman 4 PDF. Biarkan kosong untuk mencetak ruangan kosong untuk ditulis tangan.' },
  otComments: { en: 'Occupational Therapist comments', ms: 'Komen Jurupulih Carakerja' },
  stComments: { en: 'Speech Therapist comments', ms: 'Komen Jurupulih Pertuturan' },
  otherObs: { en: 'Other professional observations', ms: 'Pemerhatian profesional lain' },
  referral: { en: 'Referral recommendation', ms: 'Cadangan rujukan' },
  ref_: { en: 'Not yet decided', ms: 'Belum ditentukan' },
  ref_none: { en: 'No referral needed at this time', ms: 'Tiada rujukan diperlukan buat masa ini' },
  ref_monitor: { en: 'Monitor and re-screen', ms: 'Pantau dan saring semula' },
  ref_ot: { en: 'Refer to Occupational Therapy', ms: 'Rujuk kepada Terapi Carakerja' },
  ref_st: { en: 'Refer to Speech Therapy', ms: 'Rujuk kepada Terapi Pertuturan' },
  ref_paeds: { en: 'Refer to paediatrician / doctor', ms: 'Rujuk kepada pakar kanak-kanak / doktor' },
  ref_multi: { en: 'Multidisciplinary assessment', ms: 'Penilaian pelbagai disiplin' },
  reviewerName: { en: 'Professional name', ms: 'Nama profesional' },
  reviewerRole: { en: 'Designation', ms: 'Jawatan' },
  signature: { en: 'Signature', ms: 'Tandatangan' },
  date: { en: 'Date', ms: 'Tarikh' },
  domain: { en: 'Domain', ms: 'Domain' },
  total: { en: 'Total', ms: 'Jumlah' },
  items: { en: 'items', ms: 'item' },
  // recommendations text
  recGeneral: {
    en: 'Keep observing and playing with your child every day. Development varies between children, and skills can appear at different times.',
    ms: 'Teruskan memerhati dan bermain dengan anak anda setiap hari. Perkembangan berbeza antara kanak-kanak dan kemahiran boleh muncul pada masa yang berlainan.',
  },
  recNotYet: {
    en: 'Some skills were reported as not yet achieved in: {domains}. Consider discussing these items with a qualified professional (e.g. paediatrician, occupational therapist or speech therapist).',
    ms: 'Beberapa kemahiran dilaporkan belum dicapai dalam: {domains}. Pertimbangkan untuk membincangkan item ini dengan profesional yang berkelayakan (cth. pakar kanak-kanak, jurupulih carakerja atau jurupulih pertuturan).',
  },
  recClarify: {
    en: 'Some items were marked "Not Sure" or "Not Observed". Try observing these skills at home over the next few weeks, or ask a professional to observe them with you.',
    ms: 'Beberapa item ditanda "Tidak Pasti" atau "Tidak Diperhatikan". Cuba perhatikan kemahiran ini di rumah dalam beberapa minggu akan datang, atau minta profesional memerhatikannya bersama anda.',
  },
  recConcerns: {
    en: 'You reported concerns about your child’s development. Your concerns are important: please share them with a qualified healthcare or developmental professional, whatever the screening responses show.',
    ms: 'Anda melaporkan kebimbangan tentang perkembangan anak anda. Kebimbangan anda penting: sila kongsikan dengan profesional kesihatan atau perkembangan yang berkelayakan, tanpa mengira respons saringan.',
  },
  recRescreen: {
    en: 'Repeat the screening as your child grows, for example every 6 months, or sooner if you notice changes or loss of skills.',
    ms: 'Ulangi saringan apabila anak anda membesar, contohnya setiap 6 bulan, atau lebih awal jika anda melihat perubahan atau kehilangan kemahiran.',
  },
  recLoss: {
    en: 'If your child loses skills they previously had, seek professional advice promptly.',
    ms: 'Jika anak anda kehilangan kemahiran yang pernah dikuasai, dapatkan nasihat profesional dengan segera.',
  },
  // admin
  admin: { en: 'Admin', ms: 'Pentadbir' },
  adminTitle: { en: 'Admin Dashboard', ms: 'Papan Pemuka Pentadbir' },
  adminSub: { en: 'Statistics for screenings saved in this browser on this device only.', ms: 'Statistik untuk saringan yang disimpan dalam pelayar ini pada peranti ini sahaja.' },
  totalSessions: { en: 'Total sessions', ms: 'Jumlah sesi' },
  completed: { en: 'Completed', ms: 'Selesai' },
  inProgress: { en: 'In progress', ms: 'Dalam proses' },
  ageDistribution: { en: 'Age distribution', ms: 'Taburan umur' },
  domainStats: { en: 'Domain response summary (completed screenings)', ms: 'Ringkasan respons domain (saringan selesai)' },
  sessions: { en: 'Screening sessions', ms: 'Sesi saringan' },
  exportCsv: { en: 'Export CSV', ms: 'Eksport CSV' },
  deleteAll: { en: 'Delete All Data', ms: 'Padam Semua Data' },
  deleteConfirm: { en: 'This permanently deletes every screening saved on this device. Tap again to confirm.', ms: 'Ini akan memadam secara kekal semua saringan dalam peranti ini. Tekan sekali lagi untuk mengesahkan.' },
  confirmDelete: { en: 'Yes, delete everything', ms: 'Ya, padam semua' },
  cancel: { en: 'Cancel', ms: 'Batal' },
  deleted: { en: 'All data deleted.', ms: 'Semua data telah dipadam.' },
  noData: { en: 'No screenings saved on this device yet.', ms: 'Belum ada saringan disimpan dalam peranti ini.' },
  view: { en: 'View', ms: 'Lihat' },
  status: { en: 'Status', ms: 'Status' },
  qrTitle: { en: 'Exhibition QR code', ms: 'Kod QR pameran' },
  qrSub: {
    en: 'Enter the public web address where this app is deployed (for example your GitHub Pages URL). The QR code is generated from exactly this address.',
    ms: 'Masukkan alamat web awam di mana aplikasi ini dihoskan (contohnya URL GitHub Pages anda). Kod QR dijana daripada alamat ini sahaja.',
  },
  qrUrl: { en: 'Deployed app URL', ms: 'URL aplikasi yang dihoskan' },
  qrGenerate: { en: 'Generate QR code', ms: 'Jana kod QR' },
  qrDownload: { en: 'Download QR (PNG)', ms: 'Muat turun QR (PNG)' },
  qrUseCurrent: { en: 'Use this page’s address', ms: 'Guna alamat halaman ini' },
  qrInvalid: { en: 'Enter a full public address starting with https://', ms: 'Masukkan alamat awam penuh bermula dengan https://' },
  qrLocal: {
    en: 'This looks like a local or private address. Phones at the exhibition will not be able to open it. Deploy the app first (see the deployment guide) and use its public URL.',
    ms: 'Ini kelihatan seperti alamat tempatan atau peribadi. Telefon di pameran tidak akan dapat membukanya. Hoskan aplikasi dahulu (lihat panduan) dan gunakan URL awamnya.',
  },
  qrNotDeployed: {
    en: 'Not deployed yet? Follow DEPLOYMENT.md in the source code to publish free on GitHub Pages, then come back here and paste the address.',
    ms: 'Belum dihoskan? Ikuti DEPLOYMENT.md dalam kod sumber untuk menerbitkan secara percuma di GitHub Pages, kemudian kembali ke sini dan tampal alamatnya.',
  },
  qrTest: { en: 'Open the URL to test it', ms: 'Buka URL untuk mengujinya' },
  bankTitle: { en: 'Question bank', ms: 'Bank soalan' },
  bankActive: { en: 'Active question bank', ms: 'Bank soalan aktif' },
  bankDemo: { en: 'Demonstration (not validated)', ms: 'Demonstrasi (tidak disahkan)' },
  bankConfigured: { en: 'Configured instrument', ms: 'Instrumen dikonfigurasi' },
  bankExport: { en: 'Download template JSON', ms: 'Muat turun templat JSON' },
  bankImport: { en: 'Import approved question bank (JSON)', ms: 'Import bank soalan yang diluluskan (JSON)' },
  bankReset: { en: 'Restore demonstration items', ms: 'Pulihkan item demonstrasi' },
  bankImported: { en: 'Question bank imported and saved on this device.', ms: 'Bank soalan diimport dan disimpan dalam peranti ini.' },
  bankInvalid: { en: 'Invalid question bank file', ms: 'Fail bank soalan tidak sah' },
  bankNote: {
    en: 'Only import items you are licensed or authorised to use, with attribution. Configure official scoring only for instruments that have it.',
    ms: 'Import hanya item yang anda dilesenkan atau dibenarkan untuk digunakan, dengan atribusi. Konfigurasikan pemarkahan rasmi hanya untuk instrumen yang mempunyainya.',
  },
  privacy: { en: 'Privacy', ms: 'Privasi' },
  privacyText: {
    en: 'All information stays in this browser on this device. Nothing is sent to any server. Use Admin > Delete All Data to remove it.',
    ms: 'Semua maklumat kekal dalam pelayar ini pada peranti ini. Tiada apa-apa dihantar ke mana-mana pelayan. Gunakan Pentadbir > Padam Semua Data untuk membuangnya.',
  },
  home: { en: 'Home', ms: 'Utama' },
  scoringOfficial: { en: 'Scoring follows the configured instrument’s official rules:', ms: 'Pemarkahan mengikut peraturan rasmi instrumen yang dikonfigurasi:' },
  score: { en: 'Score', ms: 'Skor' },
  // pdf
  pdfTitle: { en: 'Developmental Screening Report', ms: 'Laporan Saringan Perkembangan' },
  pdfP1: { en: 'Child Profile', ms: 'Profil Kanak-kanak' },
  pdfP2: { en: 'Developmental Summary', ms: 'Ringkasan Perkembangan' },
  pdfP3: { en: 'Observations & Recommendations', ms: 'Pemerhatian & Cadangan' },
  pdfP4: { en: 'Professional Review', ms: 'Semakan Profesional' },
  page: { en: 'Page', ms: 'Halaman' },
  generated: { en: 'Generated', ms: 'Dijana' },
  questionnaireUsed: { en: 'Question set', ms: 'Set soalan' },
  itemsCompleted: { en: 'Items completed', ms: 'Item dilengkapkan' },
  aboutReport: { en: 'About this report', ms: 'Tentang laporan ini' },
  aboutReportText: {
    en: 'This report summarises a parent/caregiver questionnaire completed during a developmental awareness screening. Responses describe what the parent/caregiver reported and have not been verified by direct assessment.',
    ms: 'Laporan ini meringkaskan soal selidik ibu bapa/penjaga yang dilengkapkan semasa saringan kesedaran perkembangan. Respons menggambarkan apa yang dilaporkan oleh ibu bapa/penjaga dan belum disahkan melalui penilaian secara langsung.',
  },
  notProvided: { en: 'Not provided', ms: 'Tidak dinyatakan' },
  // supplementary modules
  extraSections: { en: 'Additional sections', ms: 'Bahagian tambahan' },
  extraSectionsSub: { en: 'Optional parent questionnaires. Untick to skip.', ms: 'Soal selidik ibu bapa pilihan. Nyahtanda untuk langkau.' },
  questionsCount: { en: 'questions', ms: 'soalan' },
  notForAge: { en: 'Not available for this age', ms: 'Tidak tersedia untuk umur ini' },
  howOften: { en: 'How often does your child…', ms: 'Berapa kerap anak anda…' },
  frequentlyReported: { en: 'Reported often or always', ms: 'Dilaporkan kerap atau sentiasa' },
  noFrequent: { en: 'No behaviours were reported as often or always.', ms: 'Tiada tingkah laku dilaporkan kerap atau sentiasa.' },
  ideasToTry: { en: 'Ideas to try', ms: 'Idea untuk dicuba' },
  category: { en: 'Pattern', ms: 'Corak' },
  oftenAlways: { en: 'Often + Always', ms: 'Kerap + Sentiasa' },
  moduleDemo: {
    en: 'Demonstration items, not a validated sensory or learning assessment. Results show how often behaviours were reported, not scores.',
    ms: 'Item demonstrasi, bukan penilaian sensori atau pembelajaran yang disahkan. Keputusan menunjukkan kekerapan tingkah laku dilaporkan, bukan skor.',
  },
  recSensory: {
    en: 'Some sensory behaviours were reported as frequent ({cats}). If they affect eating, sleep, dressing, play or learning, consider discussing them with an occupational therapist.',
    ms: 'Beberapa tingkah laku sensori dilaporkan kerap ({cats}). Jika ia menjejaskan makan, tidur, berpakaian, bermain atau belajar, pertimbangkan untuk berbincang dengan jurupulih carakerja.',
  },
  recLearning: {
    en: 'Your child seems to enjoy learning through: {cats}. Use these as a starting point, while still offering activities for all the senses.',
    ms: 'Anak anda kelihatan gemar belajar melalui: {cats}. Gunakan ini sebagai titik permulaan, sambil terus menyediakan aktiviti untuk semua deria.',
  },
  pdfModules: { en: 'Sensory & Learning Profile', ms: 'Profil Sensori & Pembelajaran' },
} satisfies Record<string, L>;

export type StringKey = keyof typeof S;

export function tr(lang: Lang, key: StringKey, vars?: Record<string, string>): string {
  let s = S[key][lang];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

export const pick = (lang: Lang, l: L) => l[lang];
