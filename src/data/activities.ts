import type { DomainId, L } from '../types';

/** General play ideas, grouped by broad age. These are suggestions, not therapy prescriptions. */
type Stage = 'infant' | 'toddler' | 'preschool';

export function stageForMonths(m: number): Stage {
  if (m < 12) return 'infant';
  if (m < 36) return 'toddler';
  return 'preschool';
}

export const HOME_ACTIVITIES: Record<Stage, Record<DomainId, L[]>> = {
  infant: {
    grossMotor: [
      { en: 'Daily supervised tummy time on a firm, safe surface.', ms: 'Masa meniarap setiap hari di permukaan yang kukuh dan selamat dengan pengawasan.' },
      { en: 'Place toys just out of reach to encourage rolling and reaching.', ms: 'Letakkan mainan sedikit jauh untuk menggalakkan berguling dan mencapai.' },
    ],
    fineMotor: [
      { en: 'Offer soft rattles and textured toys to hold and explore.', ms: 'Beri mainan lembut dan bertekstur untuk dipegang dan diterokai.' },
      { en: 'Let your baby pick up soft finger foods when ready.', ms: 'Biarkan bayi mengambil makanan lembut dengan jari apabila sudah bersedia.' },
    ],
    communication: [
      { en: 'Talk, sing and copy your baby’s sounds during daily routines.', ms: 'Bercakap, menyanyi dan tiru bunyi bayi semasa rutin harian.' },
      { en: 'Name objects and people your baby is looking at.', ms: 'Namakan objek dan orang yang sedang dilihat oleh bayi.' },
    ],
    cognitive: [
      { en: 'Play peek-a-boo and hide a toy under a cloth.', ms: 'Main "cak-cak" dan sembunyikan mainan di bawah kain.' },
      { en: 'Show high-contrast pictures and picture books.', ms: 'Tunjukkan gambar dan buku bergambar berkontras tinggi.' },
    ],
    socialEmotional: [
      { en: 'Hold face-to-face time with smiles and gentle talk.', ms: 'Luangkan masa bersemuka dengan senyuman dan percakapan lembut.' },
      { en: 'Keep predictable, calm routines for feeding and sleep.', ms: 'Kekalkan rutin makan dan tidur yang tenang dan konsisten.' },
    ],
  },
  toddler: {
    grossMotor: [
      { en: 'Outdoor play: walking on grass, climbing low steps, kicking a ball.', ms: 'Bermain di luar: berjalan di atas rumput, memanjat anak tangga rendah, menendang bola.' },
      { en: 'Dance and move to music together.', ms: 'Menari dan bergerak mengikut muzik bersama-sama.' },
    ],
    fineMotor: [
      { en: 'Stack blocks, use shape sorters and chunky crayons.', ms: 'Menyusun blok, menggunakan mainan susun bentuk dan krayon besar.' },
      { en: 'Play with playdough: squeeze, roll and poke.', ms: 'Bermain doh: picit, gulung dan cucuk.' },
    ],
    communication: [
      { en: 'Read picture books daily and point to and name pictures.', ms: 'Baca buku bergambar setiap hari sambil menuding dan menamakan gambar.' },
      { en: 'Expand on your child’s words: "car" → "big red car".', ms: 'Kembangkan perkataan anak: "kereta" → "kereta merah besar".' },
    ],
    cognitive: [
      { en: 'Simple puzzles, matching and sorting by colour.', ms: 'Teka-teki mudah, memadankan dan mengasingkan mengikut warna.' },
      { en: 'Pretend play with everyday items (cups, phones, dolls).', ms: 'Main olok-olok dengan barangan harian (cawan, telefon, anak patung).' },
    ],
    socialEmotional: [
      { en: 'Arrange short play times with other children.', ms: 'Atur masa bermain singkat bersama kanak-kanak lain.' },
      { en: 'Name feelings: "You look happy" or "You feel sad".', ms: 'Namakan perasaan: "Adik nampak gembira" atau "Adik rasa sedih".' },
    ],
  },
  preschool: {
    grossMotor: [
      { en: 'Hopping, balancing and ball games at the playground.', ms: 'Melompat, mengimbang dan permainan bola di taman permainan.' },
      { en: 'Obstacle courses using cushions and chairs at home.', ms: 'Laluan halangan menggunakan kusyen dan kerusi di rumah.' },
    ],
    fineMotor: [
      { en: 'Drawing, colouring, cutting and pasting crafts.', ms: 'Melukis, mewarna, menggunting dan menampal kraf.' },
      { en: 'Threading beads, buttoning and using pegs.', ms: 'Memasukkan manik, membutang baju dan menggunakan penyepit baju.' },
    ],
    communication: [
      { en: 'Ask open questions about their day and stories.', ms: 'Tanya soalan terbuka tentang hari mereka dan cerita.' },
      { en: 'Play rhyming and "I spy" word games.', ms: 'Main permainan berima dan "Saya nampak..." (I spy).' },
    ],
    cognitive: [
      { en: 'Count objects during daily routines (stairs, fruits).', ms: 'Kira objek semasa rutin harian (anak tangga, buah-buahan).' },
      { en: 'Board games that involve matching, turns and simple rules.', ms: 'Permainan papan yang melibatkan padanan, giliran dan peraturan mudah.' },
    ],
    socialEmotional: [
      { en: 'Practise turn-taking and sharing in group play.', ms: 'Berlatih bergilir dan berkongsi semasa bermain berkumpulan.' },
      { en: 'Give small responsibilities, e.g. tidying toys or dressing.', ms: 'Beri tanggungjawab kecil, cth. mengemas mainan atau berpakaian.' },
    ],
  },
};
