import { DEMO_MODULES } from './demoModules';
import type { AgeBand, AgeBandId, DomainId, QuestionBank, QuestionItem } from '../types';

/**
 * AGE BANDS used to pick age-appropriate items. Ages are in completed months (0 to 72).
 */
export const AGE_BANDS: AgeBand[] = [
  { id: '0-5', minMonths: 0, maxMonths: 5, label: { en: '0–5 months', ms: '0–5 bulan' } },
  { id: '6-11', minMonths: 6, maxMonths: 11, label: { en: '6–11 months', ms: '6–11 bulan' } },
  { id: '12-17', minMonths: 12, maxMonths: 17, label: { en: '12–17 months', ms: '12–17 bulan' } },
  { id: '18-23', minMonths: 18, maxMonths: 23, label: { en: '18–23 months', ms: '18–23 bulan' } },
  { id: '24-35', minMonths: 24, maxMonths: 35, label: { en: '24–35 months', ms: '24–35 bulan' } },
  { id: '36-47', minMonths: 36, maxMonths: 47, label: { en: '36–47 months', ms: '36–47 bulan' } },
  { id: '48-59', minMonths: 48, maxMonths: 59, label: { en: '48–59 months', ms: '48–59 bulan' } },
  { id: '60-72', minMonths: 60, maxMonths: 72, label: { en: '60–72 months', ms: '60–72 bulan' } },
];

/*
 * ============================================================================================
 *  DEMONSTRATION ITEMS ONLY
 * ============================================================================================
 *  The items below were written in plain language for this demo, describing broad, commonly
 *  discussed developmental skills. They are NOT copied from, and are NOT equivalent to, any
 *  validated or proprietary instrument (e.g. ASQ-3, SWYC, TOY8, Denver, CDC checklists).
 *  They have NOT been validated, have no norms, and must not be used to classify a child.
 *
 *  To use approved items:
 *    1. Export the template JSON from Admin > Question bank, or edit this file.
 *    2. Replace the items with items you are licensed/authorised to use, with attribution.
 *    3. Set isDemonstration: false and, ONLY if the instrument has official scoring rules,
 *       configure scoring.mode = 'points-cutoff' with the official cut-offs.
 *    4. Import the JSON in Admin > Question bank (stored on this device only), or rebuild.
 * ============================================================================================
 */
type Pair = [string, string]; // [English, Bahasa Melayu]

const RAW: Record<AgeBandId, Record<DomainId, Pair[]>> = {
  '0-5': {
    grossMotor: [
      ['When lying on the tummy, lifts head and chest up for a short time.', 'Semasa meniarap, mengangkat kepala dan dada untuk seketika.'],
      ['Holds head steady when held upright.', 'Kepala stabil apabila didukung secara tegak.'],
      ['Rolls from tummy to back or back to tummy.', 'Berguling dari meniarap ke terlentang atau sebaliknya.'],
    ],
    fineMotor: [
      ['Brings hands together or to the mouth.', 'Menemukan kedua-dua tangan atau membawa tangan ke mulut.'],
      ['Holds a small toy placed in the hand for a few seconds.', 'Memegang mainan kecil yang diletakkan di tangan selama beberapa saat.'],
      ['Reaches towards a toy held in front of them.', 'Cuba mencapai mainan yang dipegang di hadapannya.'],
    ],
    communication: [
      ['Makes cooing or gurgling sounds.', 'Mengeluarkan bunyi seperti "ooo" atau "aaa".'],
      ['Turns or quietens when hearing a familiar voice.', 'Menoleh atau menjadi tenang apabila mendengar suara yang dikenali.'],
      ['Makes different cries or sounds for different needs.', 'Mengeluarkan tangisan atau bunyi berbeza untuk keperluan berbeza.'],
    ],
    cognitive: [
      ['Follows a moving face or toy with the eyes.', 'Mengikuti pergerakan wajah atau mainan dengan mata.'],
      ['Looks at own hands with interest.', 'Melihat tangannya sendiri dengan minat.'],
      ['Shows interest in new sights or sounds.', 'Menunjukkan minat terhadap pemandangan atau bunyi baharu.'],
    ],
    socialEmotional: [
      ['Smiles back when someone smiles at them.', 'Membalas senyuman apabila seseorang senyum kepadanya.'],
      ['Calms down when picked up or spoken to.', 'Menjadi tenang apabila didukung atau diajak bercakap.'],
      ['Looks at faces during feeding or play.', 'Melihat wajah semasa diberi makan atau bermain.'],
    ],
  },
  '6-11': {
    grossMotor: [
      ['Sits without support for a short time.', 'Duduk tanpa sokongan untuk seketika.'],
      ['Crawls, creeps or shuffles to move around.', 'Merangkak, mengengsot atau bergerak untuk berpindah tempat.'],
      ['Pulls up to stand while holding furniture.', 'Menarik badan untuk berdiri sambil berpaut pada perabot.'],
    ],
    fineMotor: [
      ['Passes a toy from one hand to the other.', 'Memindahkan mainan dari satu tangan ke tangan yang lain.'],
      ['Picks up small food pieces using fingers.', 'Mengambil cebisan makanan kecil menggunakan jari.'],
      ['Bangs two toys together.', 'Mengetuk dua mainan bersama-sama.'],
    ],
    communication: [
      ['Babbles with repeated sounds such as "ba-ba" or "ma-ma".', 'Membebel dengan bunyi berulang seperti "ba-ba" atau "ma-ma".'],
      ['Responds when their name is called.', 'Memberi respons apabila namanya dipanggil.'],
      ['Uses simple gestures such as reaching up to be carried.', 'Menggunakan isyarat mudah seperti mengangkat tangan untuk didukung.'],
    ],
    cognitive: [
      ['Looks for a toy that has been partly hidden.', 'Mencari mainan yang disembunyikan sebahagiannya.'],
      ['Explores objects by shaking, banging or mouthing them.', 'Meneroka objek dengan menggoncang, mengetuk atau memasukkan ke mulut.'],
      ['Watches where a dropped toy falls.', 'Memerhati ke mana mainan yang dijatuhkan jatuh.'],
    ],
    socialEmotional: [
      ['Enjoys simple games like peek-a-boo.', 'Seronok dengan permainan mudah seperti "cak-cak".'],
      ['Shows they know familiar people compared with strangers.', 'Menunjukkan dia mengenali orang biasa berbanding orang asing.'],
      ['Shows feelings such as happiness or upset with face and voice.', 'Menunjukkan perasaan seperti gembira atau sedih melalui wajah dan suara.'],
    ],
  },
  '12-17': {
    grossMotor: [
      ['Walks while holding onto furniture or a hand.', 'Berjalan sambil berpaut pada perabot atau memegang tangan.'],
      ['Takes a few steps without help.', 'Melangkah beberapa langkah tanpa bantuan.'],
      ['Stands up from sitting on the floor without help.', 'Bangun berdiri dari duduk di lantai tanpa bantuan.'],
    ],
    fineMotor: [
      ['Picks up a small object with thumb and finger.', 'Mengambil objek kecil dengan ibu jari dan jari telunjuk.'],
      ['Puts an object into a container.', 'Memasukkan objek ke dalam bekas.'],
      ['Makes marks on paper with a crayon.', 'Membuat contengan di atas kertas dengan krayon.'],
    ],
    communication: [
      ['Says at least one word with meaning (e.g. "mama", "nak").', 'Menyebut sekurang-kurangnya satu perkataan yang bermakna (cth. "mama", "nak").'],
      ['Waves bye-bye or points to show something.', 'Melambai "bye-bye" atau menuding untuk menunjukkan sesuatu.'],
      ['Understands simple words such as "no" or "come".', 'Memahami perkataan mudah seperti "jangan" atau "mari".'],
    ],
    cognitive: [
      ['Copies simple actions such as clapping.', 'Meniru perbuatan mudah seperti bertepuk tangan.'],
      ['Uses everyday objects correctly, e.g. holds a cup to drink.', 'Menggunakan objek harian dengan betul, cth. memegang cawan untuk minum.'],
      ['Finds a toy that is fully hidden under a cloth.', 'Mencari mainan yang disembunyikan sepenuhnya di bawah kain.'],
    ],
    socialEmotional: [
      ['Brings or shows a toy to an adult to share interest.', 'Membawa atau menunjukkan mainan kepada orang dewasa untuk berkongsi minat.'],
      ['Seeks a familiar adult for comfort.', 'Mencari orang dewasa yang dikenali untuk keselesaan.'],
      ['Helps with dressing, e.g. pushes an arm through a sleeve.', 'Membantu semasa berpakaian, cth. memasukkan tangan ke lengan baju.'],
    ],
  },
  '18-23': {
    grossMotor: [
      ['Walks steadily without help.', 'Berjalan dengan stabil tanpa bantuan.'],
      ['Climbs onto a low chair or sofa.', 'Memanjat ke atas kerusi rendah atau sofa.'],
      ['Kicks a ball forward.', 'Menendang bola ke hadapan.'],
    ],
    fineMotor: [
      ['Stacks two or three blocks.', 'Menyusun dua atau tiga blok.'],
      ['Scribbles back and forth with a crayon.', 'Menconteng ke depan dan ke belakang dengan krayon.'],
      ['Feeds self with a spoon, with some spilling.', 'Makan sendiri dengan sudu walaupun ada yang tertumpah.'],
    ],
    communication: [
      ['Uses several single words.', 'Menggunakan beberapa perkataan tunggal.'],
      ['Points to a named body part or picture.', 'Menuding bahagian badan atau gambar yang disebut.'],
      ['Follows a one-step instruction without gestures, e.g. "give me the ball".', 'Mengikut arahan satu langkah tanpa isyarat, cth. "beri bola itu".'],
    ],
    cognitive: [
      ['Plays pretend with a toy, e.g. feeds a doll.', 'Bermain olok-olok dengan mainan, cth. memberi anak patung makan.'],
      ['Matches two identical objects.', 'Memadankan dua objek yang sama.'],
      ['Tries different ways to solve a simple problem (e.g. getting a toy).', 'Mencuba cara berbeza untuk menyelesaikan masalah mudah (cth. mendapatkan mainan).'],
    ],
    socialEmotional: [
      ['Shows interest in other children.', 'Menunjukkan minat terhadap kanak-kanak lain.'],
      ['Looks at your face to check your reaction in a new situation.', 'Melihat wajah anda untuk melihat reaksi anda dalam situasi baharu.'],
      ['Shows affection, e.g. hugs a familiar person.', 'Menunjukkan kasih sayang, cth. memeluk orang yang dikenali.'],
    ],
  },
  '24-35': {
    grossMotor: [
      ['Runs with few falls.', 'Berlari dengan jarang terjatuh.'],
      ['Jumps with both feet off the ground.', 'Melompat dengan kedua-dua kaki terangkat dari lantai.'],
      ['Walks up stairs, with or without holding a rail.', 'Menaiki tangga, dengan atau tanpa memegang pemegang.'],
    ],
    fineMotor: [
      ['Stacks five or more blocks.', 'Menyusun lima atau lebih blok.'],
      ['Turns pages of a book one at a time.', 'Menyelak halaman buku satu demi satu.'],
      ['Copies a straight line drawn by an adult.', 'Meniru garisan lurus yang dilukis oleh orang dewasa.'],
    ],
    communication: [
      ['Puts two or more words together, e.g. "more milk".', 'Menggabungkan dua atau lebih perkataan, cth. "nak susu lagi".'],
      ['Names familiar objects or pictures.', 'Menamakan objek atau gambar yang biasa dilihat.'],
      ['Follows a two-step instruction.', 'Mengikut arahan dua langkah.'],
    ],
    cognitive: [
      ['Sorts objects by shape or colour.', 'Mengasingkan objek mengikut bentuk atau warna.'],
      ['Completes a simple puzzle of 2–4 pieces.', 'Menyiapkan teka-teki mudah 2–4 kepingan.'],
      ['Understands "one" versus "many".', 'Memahami konsep "satu" dan "banyak".'],
    ],
    socialEmotional: [
      ['Plays next to or with other children.', 'Bermain di sebelah atau bersama kanak-kanak lain.'],
      ['Shows a wide range of feelings.', 'Menunjukkan pelbagai jenis perasaan.'],
      ['Tries to do things independently, e.g. takes off shoes.', 'Cuba melakukan sesuatu sendiri, cth. menanggalkan kasut.'],
    ],
  },
  '36-47': {
    grossMotor: [
      ['Pedals a tricycle or balance bike.', 'Mengayuh basikal roda tiga atau menunggang basikal imbangan.'],
      ['Stands on one foot for a moment.', 'Berdiri dengan sebelah kaki untuk seketika.'],
      ['Catches a large ball with both arms.', 'Menangkap bola besar dengan kedua-dua tangan.'],
    ],
    fineMotor: [
      ['Copies a circle.', 'Meniru bulatan.'],
      ['Snips paper with child-safe scissors.', 'Menggunting kertas dengan gunting kanak-kanak.'],
      ['Threads large beads onto a string.', 'Memasukkan manik besar ke dalam tali.'],
    ],
    communication: [
      ['Speaks in short sentences of three or more words.', 'Bercakap dalam ayat pendek tiga perkataan atau lebih.'],
      ['Is mostly understood by familiar adults.', 'Kebanyakan percakapannya difahami oleh orang dewasa yang biasa.'],
      ['Answers simple "what" and "where" questions.', 'Menjawab soalan mudah "apa" dan "di mana".'],
    ],
    cognitive: [
      ['Names some colours.', 'Menamakan beberapa warna.'],
      ['Counts a few objects.', 'Mengira beberapa objek.'],
      ['Engages in pretend play with a simple storyline.', 'Bermain olok-olok dengan jalan cerita mudah.'],
    ],
    socialEmotional: [
      ['Takes turns in a simple game with help.', 'Bergilir-gilir dalam permainan mudah dengan bantuan.'],
      ['Shows concern when another child is upset.', 'Menunjukkan keprihatinan apabila kanak-kanak lain sedih.'],
      ['Separates from a parent with limited distress in familiar places.', 'Boleh berpisah daripada ibu bapa tanpa terlalu tertekan di tempat yang biasa.'],
    ],
  },
  '48-59': {
    grossMotor: [
      ['Hops on one foot a few times.', 'Melompat dengan sebelah kaki beberapa kali.'],
      ['Walks down stairs with alternating feet.', 'Menuruni tangga dengan kaki berselang-seli.'],
      ['Throws a ball overhand towards a target.', 'Membaling bola dari atas bahu ke arah sasaran.'],
    ],
    fineMotor: [
      ['Draws a person with at least a few body parts.', 'Melukis orang dengan sekurang-kurangnya beberapa bahagian badan.'],
      ['Holds a pencil with fingers rather than a fist.', 'Memegang pensel dengan jari dan bukan genggaman.'],
      ['Cuts along a straight line.', 'Menggunting mengikut garisan lurus.'],
    ],
    communication: [
      ['Tells a simple story or recalls an event.', 'Menceritakan cerita mudah atau mengingati sesuatu peristiwa.'],
      ['Asks "why" or "how" questions.', 'Bertanya soalan "kenapa" atau "bagaimana".'],
      ['Speaks clearly enough for unfamiliar adults to understand most words.', 'Bercakap dengan cukup jelas sehingga kebanyakan perkataan difahami orang yang tidak dikenali.'],
    ],
    cognitive: [
      ['Counts up to 10 objects.', 'Mengira sehingga 10 objek.'],
      ['Understands "same" and "different".', 'Memahami konsep "sama" dan "berbeza".'],
      ['Remembers part of a familiar story.', 'Mengingati sebahagian daripada cerita yang biasa didengar.'],
    ],
    socialEmotional: [
      ['Plays cooperatively with other children.', 'Bermain secara bekerjasama dengan kanak-kanak lain.'],
      ['Follows simple group rules.', 'Mengikut peraturan kumpulan yang mudah.'],
      ['Dresses with little help (may need help with buttons).', 'Berpakaian dengan sedikit bantuan (mungkin perlu bantuan dengan butang).'],
    ],
  },
  '60-72': {
    grossMotor: [
      ['Skips or gallops.', 'Melompat-lompat (skipping) atau berlari seperti kuda.'],
      ['Balances on one foot for several seconds.', 'Mengimbangkan badan dengan sebelah kaki selama beberapa saat.'],
      ['Catches a small ball with hands.', 'Menangkap bola kecil dengan tangan.'],
    ],
    fineMotor: [
      ['Writes some letters or own name.', 'Menulis beberapa huruf atau nama sendiri.'],
      ['Copies a square or triangle.', 'Meniru segi empat atau segi tiga.'],
      ['Uses a spoon and fork well during meals.', 'Menggunakan sudu dan garpu dengan baik semasa makan.'],
    ],
    communication: [
      ['Uses full sentences to describe experiences.', 'Menggunakan ayat lengkap untuk menceritakan pengalaman.'],
      ['Follows three-step instructions.', 'Mengikut arahan tiga langkah.'],
      ['Takes turns in a back-and-forth conversation.', 'Bergilir-gilir semasa perbualan dua hala.'],
    ],
    cognitive: [
      ['Recognises some letters or numbers.', 'Mengenal beberapa huruf atau nombor.'],
      ['Understands time words such as "today" and "tomorrow".', 'Memahami perkataan masa seperti "hari ini" dan "esok".'],
      ['Completes a puzzle of 10 or more pieces.', 'Menyiapkan teka-teki 10 kepingan atau lebih.'],
    ],
    socialEmotional: [
      ['Waits for a turn with little reminding.', 'Menunggu giliran dengan sedikit peringatan.'],
      ['Talks about own feelings.', 'Bercakap tentang perasaannya sendiri.'],
      ['Uses the toilet independently most of the time.', 'Menggunakan tandas sendiri pada kebanyakan masa.'],
    ],
  },
};

function buildItems(): QuestionItem[] {
  const items: QuestionItem[] = [];
  (Object.keys(RAW) as AgeBandId[]).forEach((band) => {
    (Object.keys(RAW[band]) as DomainId[]).forEach((domain) => {
      RAW[band][domain].forEach(([en, ms], i) => {
        items.push({ id: `demo-${band}-${domain}-${i + 1}`, domain, band, text: { en, ms } });
      });
    });
  });
  return items;
}

export const DEMO_QUESTION_BANK: QuestionBank = {
  id: 'letzplay-demo',
  name: { en: "Let'z Play Demonstration Item Set", ms: "Set Item Demonstrasi Let'z Play" },
  version: '1.0.0-demo',
  isDemonstration: true,
  attribution: {
    en: "Demonstration items written in plain language by the app developers for Let'z Play Therapy. Not adapted from any published instrument.",
    ms: "Item demonstrasi ditulis dalam bahasa mudah oleh pembangun aplikasi untuk Let'z Play Therapy. Tidak diadaptasi daripada mana-mana instrumen yang diterbitkan.",
  },
  licence: {
    en: 'Not validated. For demonstration and awareness use only. Replace with authorised items before clinical use.',
    ms: 'Tidak disahkan. Untuk demonstrasi dan kesedaran sahaja. Gantikan dengan item yang dibenarkan sebelum kegunaan klinikal.',
  },
  scoring: { mode: 'descriptive' },
  items: buildItems(),
  modules: DEMO_MODULES,
};
