import type { L, ModuleCategory, ModuleItem, SupplementaryModule } from '../types';

/*
 * ============================================================================================
 *  DEMONSTRATION SUPPLEMENTARY MODULES (sensory processing patterns, learning preferences)
 * ============================================================================================
 *  Items were written in plain language for this app. They are NOT taken from, or equivalent
 *  to, any published or proprietary instrument (e.g. Sensory Profile 2, SPM, Short Sensory
 *  Profile). They have no norms and are NOT validated. The app only reports how often each
 *  behaviour was reported. Replace or remove them through the question-bank JSON
 *  ("modules" array) before any clinical use.
 * ============================================================================================
 */

type Row = [category: string, en: string, ms: string, minMonths: number];

const ATTRIBUTION: L = {
  en: "Demonstration items written by the app developers for Let'z Play Therapy. Not adapted from any published instrument.",
  ms: "Item demonstrasi ditulis oleh pembangun aplikasi untuk Let'z Play Therapy. Tidak diadaptasi daripada mana-mana instrumen yang diterbitkan.",
};

function items(prefix: string, rows: Row[]): ModuleItem[] {
  const counter: Record<string, number> = {};
  return rows.map(([category, en, ms, minMonths]) => {
    counter[category] = (counter[category] ?? 0) + 1;
    return { id: `${prefix}-${category}-${counter[category]}`, category, text: { en, ms }, minMonths, maxMonths: 72 };
  });
}

const SENSORY_CATEGORIES: ModuleCategory[] = [
  {
    id: 'seeking',
    label: { en: 'Seeking', ms: 'Mencari Rangsangan' },
    description: { en: 'Looks for extra movement, touch, sound or oral input.', ms: 'Mencari lebih banyak pergerakan, sentuhan, bunyi atau rangsangan mulut.' },
    ideas: [
      { en: 'Plan safe movement breaks: jumping on a cushion, swinging, pushing a laundry basket.', ms: 'Rancang rehat pergerakan yang selamat: melompat di atas kusyen, berbuai, menolak bakul pakaian.' },
      { en: 'Offer "heavy work" play such as carrying books, pulling a wagon or crawling through tunnels.', ms: 'Beri permainan "kerja berat" seperti membawa buku, menarik troli atau merangkak melalui terowong.' },
    ],
  },
  {
    id: 'avoiding',
    label: { en: 'Avoiding', ms: 'Mengelak' },
    description: { en: 'Moves away from or resists certain sensations or busy places.', ms: 'Menjauhkan diri atau menolak rangsangan tertentu atau tempat yang sibuk.' },
    ideas: [
      { en: 'Introduce new textures or sounds slowly, in small steps, and let your child lead.', ms: 'Perkenalkan tekstur atau bunyi baharu secara perlahan, langkah demi langkah, dan biarkan anak memimpin.' },
      { en: 'Prepare your child before haircuts, crowds or noisy places, and offer a quiet break space.', ms: 'Sediakan anak sebelum menggunting rambut, ke tempat sesak atau bising, dan sediakan ruang rehat yang tenang.' },
    ],
  },
  {
    id: 'sensitivity',
    label: { en: 'Sensitivity', ms: 'Sensitif' },
    description: { en: 'Notices or is bothered by sensations more than other children.', ms: 'Lebih cepat perasan atau terganggu oleh rangsangan berbanding kanak-kanak lain.' },
    ideas: [
      { en: 'Reduce background noise and clutter during meals and learning time.', ms: 'Kurangkan bunyi latar dan barang bersepah semasa makan dan belajar.' },
      { en: 'Choose soft, label-free clothing and offer new foods alongside familiar ones.', ms: 'Pilih pakaian lembut tanpa label dan hidangkan makanan baharu bersama makanan yang biasa.' },
    ],
  },
  {
    id: 'registration',
    label: { en: 'Low Registration', ms: 'Kurang Peka' },
    description: { en: 'May miss or respond slowly to sensations others notice.', ms: 'Mungkin tidak perasan atau lambat bertindak balas terhadap rangsangan yang disedari orang lain.' },
    ideas: [
      { en: 'Use clear, strong cues: say the name, touch the shoulder and get down to eye level.', ms: 'Gunakan isyarat yang jelas: sebut nama, sentuh bahu dan rendahkan badan ke paras mata anak.' },
      { en: 'Add lively activity (music, movement) before tasks that need attention.', ms: 'Tambah aktiviti yang bertenaga (muzik, pergerakan) sebelum tugasan yang memerlukan tumpuan.' },
    ],
  },
];

const LEARNING_CATEGORIES: ModuleCategory[] = [
  {
    id: 'visual',
    label: { en: 'Visual', ms: 'Visual' },
    description: { en: 'Learning by looking: pictures, colours, watching others.', ms: 'Belajar melalui penglihatan: gambar, warna, memerhati orang lain.' },
    ideas: [
      { en: 'Use picture schedules, picture books and colourful charts.', ms: 'Gunakan jadual bergambar, buku bergambar dan carta berwarna.' },
      { en: 'Show and demonstrate before asking your child to try.', ms: 'Tunjuk dan demonstrasi dahulu sebelum meminta anak mencuba.' },
    ],
  },
  {
    id: 'auditory',
    label: { en: 'Auditory', ms: 'Auditori' },
    description: { en: 'Learning by listening: songs, stories, talking.', ms: 'Belajar melalui pendengaran: lagu, cerita, perbualan.' },
    ideas: [
      { en: 'Teach through songs, rhymes and stories read aloud.', ms: 'Ajar melalui lagu, pantun dan cerita yang dibacakan.' },
      { en: 'Talk through each step of an activity together.', ms: 'Terangkan setiap langkah aktiviti secara lisan bersama-sama.' },
    ],
  },
  {
    id: 'tactile',
    label: { en: 'Tactile', ms: 'Taktil (Sentuhan)' },
    description: { en: 'Learning by touching and handling real objects.', ms: 'Belajar melalui sentuhan dan memegang objek sebenar.' },
    ideas: [
      { en: 'Learn with real objects: counting buttons, tracing letters in sand or playdough.', ms: 'Belajar dengan objek sebenar: mengira butang, menulis huruf di atas pasir atau doh.' },
      { en: 'Offer craft, building and texture play.', ms: 'Sediakan aktiviti kraf, binaan dan permainan tekstur.' },
    ],
  },
  {
    id: 'kinesthetic',
    label: { en: 'Kinesthetic', ms: 'Kinestetik (Pergerakan)' },
    description: { en: 'Learning by moving the whole body: acting, jumping, doing.', ms: 'Belajar melalui pergerakan seluruh badan: berlakon, melompat, melakukan.' },
    ideas: [
      { en: 'Turn learning into movement games: hopping on numbers, acting out stories.', ms: 'Jadikan pembelajaran permainan bergerak: melompat atas nombor, melakonkan cerita.' },
      { en: 'Give short active breaks between sit-down activities.', ms: 'Beri rehat aktif yang singkat di antara aktiviti duduk.' },
    ],
  },
];

export const DEMO_SENSORY_MODULE: SupplementaryModule = {
  id: 'sensory',
  name: { en: 'Sensory Processing', ms: 'Pemprosesan Sensori' },
  intro: {
    en: 'How often does your child show these everyday sensory behaviours?',
    ms: 'Berapa kerap anak anda menunjukkan tingkah laku sensori harian ini?',
  },
  note: {
    en: 'Many children show some of these behaviours. Frequent behaviours are worth discussing with an occupational therapist mainly when they affect daily life (eating, sleep, dressing, play or learning). This is not a sensory processing assessment and does not give a sensory diagnosis.',
    ms: 'Ramai kanak-kanak menunjukkan sebahagian tingkah laku ini. Tingkah laku yang kerap wajar dibincangkan dengan jurupulih carakerja terutamanya jika ia menjejaskan kehidupan harian (makan, tidur, berpakaian, bermain atau belajar). Ini bukan penilaian pemprosesan sensori dan tidak memberi diagnosis sensori.',
  },
  isDemonstration: true,
  attribution: ATTRIBUTION,
  categories: SENSORY_CATEGORIES,
  items: items('demo-sensory', [
    ['seeking', 'Seeks lots of movement such as spinning, jumping or rocking.', 'Mencari banyak pergerakan seperti berpusing, melompat atau bergoyang.', 6],
    ['seeking', 'Likes to touch, squeeze or hold objects and people a lot.', 'Suka menyentuh, memicit atau memegang objek dan orang dengan kerap.', 6],
    ['seeking', 'Puts non-food objects in the mouth or chews on things.', 'Memasukkan objek bukan makanan ke dalam mulut atau mengunyah barang.', 24],
    ['seeking', 'Enjoys loud noises or often makes loud sounds.', 'Suka bunyi yang kuat atau kerap membuat bunyi yang kuat.', 12],
    ['avoiding', 'Becomes upset by messy play or sticky, wet textures.', 'Menjadi marah atau sedih semasa main kotor atau dengan tekstur melekit dan basah.', 12],
    ['avoiding', 'Strongly resists haircuts, nail cutting or tooth brushing.', 'Sangat menolak menggunting rambut, memotong kuku atau memberus gigi.', 6],
    ['avoiding', 'Covers ears or wants to leave loud or busy places.', 'Menutup telinga atau mahu keluar dari tempat yang bising atau sesak.', 12],
    ['avoiding', 'Moves away from crowded play areas or group activities.', 'Menjauhkan diri dari kawasan bermain yang sesak atau aktiviti berkumpulan.', 24],
    ['sensitivity', 'Notices small sounds others ignore, or is easily distracted by noise.', 'Perasan bunyi kecil yang orang lain tidak hiraukan, atau mudah terganggu oleh bunyi.', 12],
    ['sensitivity', 'Is bothered by clothing labels, seams or certain fabrics.', 'Terganggu oleh label baju, jahitan atau kain tertentu.', 12],
    ['sensitivity', 'Is a very picky eater because of food textures, smells or tastes.', 'Sangat memilih makanan kerana tekstur, bau atau rasa.', 12],
    ['sensitivity', 'Is bothered by bright lights more than other children.', 'Lebih terganggu oleh cahaya terang berbanding kanak-kanak lain.', 6],
    ['registration', 'Does not seem to notice when their name is called, even though hearing seems fine.', 'Seperti tidak perasan apabila namanya dipanggil, walaupun pendengarannya kelihatan baik.', 6],
    ['registration', 'Does not seem to notice when hands or face are messy or wet.', 'Seperti tidak perasan apabila tangan atau muka kotor atau basah.', 12],
    ['registration', 'Seems slow to react to bumps, falls or small hurts.', 'Kelihatan lambat bertindak balas apabila terlanggar, terjatuh atau sedikit cedera.', 12],
    ['registration', 'Seems tired or low in energy compared with other children.', 'Kelihatan letih atau kurang bertenaga berbanding kanak-kanak lain.', 6],
  ]),
};

export const DEMO_LEARNING_MODULE: SupplementaryModule = {
  id: 'learning',
  name: { en: 'Learning Preferences', ms: 'Kecenderungan Pembelajaran' },
  intro: {
    en: 'How often does your child enjoy learning and playing in these ways?',
    ms: 'Berapa kerap anak anda suka belajar dan bermain dengan cara ini?',
  },
  note: {
    en: 'Children learn through all their senses. These answers show what your child seems to enjoy now. They are not fixed "learning styles" and should not limit how your child is taught.',
    ms: 'Kanak-kanak belajar melalui semua deria. Jawapan ini menunjukkan apa yang anak anda gemari sekarang. Ia bukan "gaya pembelajaran" yang tetap dan tidak sepatutnya mengehadkan cara anak diajar.',
  },
  isDemonstration: true,
  attribution: ATTRIBUTION,
  categories: LEARNING_CATEGORIES,
  items: items('demo-learning', [
    ['visual', 'Enjoys looking at picture books, pictures or colourful things.', 'Suka melihat buku bergambar, gambar atau benda berwarna-warni.', 12],
    ['visual', 'Learns quickly by watching someone else do it first.', 'Cepat belajar dengan memerhati orang lain melakukannya dahulu.', 12],
    ['visual', 'Remembers where things are kept or places they have seen.', 'Ingat di mana barang disimpan atau tempat yang pernah dilihat.', 18],
    ['auditory', 'Enjoys songs, rhymes or stories read aloud.', 'Suka lagu, pantun atau cerita yang dibacakan.', 12],
    ['auditory', 'Remembers words of songs or things they have heard.', 'Ingat lirik lagu atau perkara yang pernah didengar.', 18],
    ['auditory', 'Listens with interest when someone explains or talks to them.', 'Mendengar dengan minat apabila seseorang menerangkan atau bercakap dengannya.', 12],
    ['tactile', 'Likes to touch and handle things to explore them (sand, playdough, textures).', 'Suka menyentuh dan memegang benda untuk meneroka (pasir, doh, tekstur).', 12],
    ['tactile', 'Learns best when holding real objects.', 'Paling mudah belajar apabila memegang objek sebenar.', 12],
    ['tactile', 'Enjoys drawing, building or craft activities with the hands.', 'Suka melukis, membina atau membuat kraf dengan tangan.', 18],
    ['kinesthetic', 'Enjoys learning through active games such as running, climbing or dancing.', 'Suka belajar melalui permainan aktif seperti berlari, memanjat atau menari.', 12],
    ['kinesthetic', 'Likes acting out stories or pretending with the whole body.', 'Suka melakonkan cerita atau berpura-pura menggunakan seluruh badan.', 18],
    ['kinesthetic', 'Uses body movements or gestures to show ideas.', 'Menggunakan pergerakan badan atau isyarat untuk menyampaikan idea.', 12],
  ]),
};

export const DEMO_MODULES: SupplementaryModule[] = [DEMO_SENSORY_MODULE, DEMO_LEARNING_MODULE];
