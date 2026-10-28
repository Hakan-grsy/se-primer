import { DecisionConfig, Goal, Role } from '../types';

export const INCIDENT_INFO = {
  clock: '07:45',
  text: "Dün gece Laboratuvar Bilgi Sistemi'ne yeni sürüm yüklendi. Dr. Aksoy arıyor: 'Hastamın ekranında başka birinin kan sonuçları var!' Sabah 300 hasta sonuç bekliyor. Nöbetçi sensin.",
  system: 'Laboratuvar Bilgi Sistemi (LBS)',
  version: 'v2.4.1 (Yayın: 02:30)',
  affectedService: 'Biyokimya / Kan Tahlili Eşleme Servisi',
  caller: 'Dr. Aksoy · Dahiliye Polikliniği 3',
  waitingPatients: 300,
};

export function getRolePrefix(role: Role): string {
  switch (role) {
    case 'Backend geliştirici':
      return 'Backend geliştirici olarak';
    case 'Test (QA) mühendisi':
      return 'Test (QA) mühendisi olarak';
    case 'Takım lideri':
      return 'Takım lideri olarak';
    default:
      return `${role} olarak`;
  }
}

export const DECISIONS: Record<'karar1' | 'karar2' | 'karar3', DecisionConfig> = {
  karar1: {
    key: 'karar1',
    stepNumber: 1,
    category: 'Hata ayıklama',
    title: 'Sorunun kaynağını nasıl bulursun?',
    hint: 'Sorun tam olarak ne zaman başladı? O saatte sistemde ne değişmişti?',
    options: {
      A: {
        letter: 'A',
        title: 'Son sürümün değişikliklerini ve hata loglarını incele',
        isCorrect: true,
        whatHappened:
          '20 dakikada sorgudaki hatalı eşleşmeyi buldun: sonuçlar protokol numarası yerine sıra numarasıyla bağlanıyordu.',
        whyHappened:
          'Sorun yeni sürümden hemen sonra başladı. Değişikliğe bakmak, kök nedene giden en kısa yoldur.',
      },
      B: {
        letter: 'B',
        title: 'Sunucuyu yeniden başlat',
        isCorrect: false,
        whatHappened:
          'Ekranlar 20 dakika düzgün göründü, sonra hata geri geldi.',
        whyHappened:
          'Yeniden başlatma önbelleği temizler ama hatalı kodu düzeltmez. Belirtiyi bastırdın, nedeni değil.',
      },
    },
  },
  karar2: {
    key: 'karar2',
    stepNumber: 2,
    category: 'Veri bütünlüğü',
    title: 'Yanlış eşleşen kayıtları nasıl düzeltirsin?',
    hint: 'Şikâyet eden tek doktor mu, yoksa sadece ilk fark eden mi?',
    options: {
      A: {
        letter: 'A',
        title:
          'Sorguyla etkilenen tüm kayıtları bul, düzeltme script\'ini önce test ortamında dene',
        isCorrect: true,
        whatHappened:
          '12 etkilenen hasta bulundu, hepsi doğru şekilde düzeltildi.',
        whyHappened:
          'Tek bir şikâyet, sorunun yalnızca görünen kısmıdır. Toplu düzeltmeyi önce test ortamında denemek, canlı veriyi ikinci kez bozmayı önler.',
      },
      B: {
        letter: 'B',
        title: 'Şikâyet eden doktorun hastasını elle düzelt',
        isCorrect: false,
        whatHappened:
          'Ayşe Y.\'nin kaydı düzeldi, diğer 11 hasta hâlâ yanlış sonuç görüyor.',
        whyHappened:
          'Elle düzeltme yalnızca bildirilen vakayı çözer. Veri bütünlüğü, etkinin tamamını ölçmeyi gerektirir.',
      },
    },
  },
  karar3: {
    key: 'karar3',
    stepNumber: 3,
    category: 'KVKK',
    title: 'Hastaların sağlık verisi yetkisiz kişilerce görüldü. Ne yaparsın?',
    hint: 'Hastalar kendi verilerinin başkası tarafından görüldüğünü bilmeli mi?',
    options: {
      A: {
        letter: 'A',
        title: 'Hastanenin veri sorumlusuna / KVKK birimine bildir',
        isCorrect: true,
        whatHappened:
          'Birim Kurul\'a bildirim sürecini başlattı, etkilenen hastalar bilgilendirildi.',
        whyHappened:
          'Sağlık verisi özel nitelikli kişisel veridir. İhlal, öğrenildikten sonra en kısa sürede (72 saat içinde) bildirilmelidir.',
      },
      B: {
        letter: 'B',
        title: 'Sessizce düzelt, kimseye söyleme',
        isCorrect: false,
        whatHappened: 'Sorun kapandı gibi göründü.',
        whyHappened:
          'İhlali gizlemek, ihlalin kendisinden daha ağır sonuç doğurur. Öğrenildiğinde idari para cezası ve güven kaybı kaçınılmazdır.',
      },
    },
  },
};

export const GOAL_LEARNINGS: Record<Goal, string[]> = {
  'Hata ayıklama': [
    'Belirtiyi değil, kök nedeni düzelt.',
    'Sorun ne zaman başladıysa, o anda neyin değiştiğine bak.',
    'Yeniden başlatmak teşhis değildir.',
  ],
  'Test ve kalite': [
    'Toplu düzeltmeleri önce test ortamında dene.',
    'Tek şikâyet, sorunun görünen kısmıdır; etkinin tamamını ölç.',
    'Eşleştirme alanlarını regresyon testleriyle koru.',
  ],
  'Veri güvenliği ve KVKK': [
    'Sağlık verisi özel nitelikli kişisel veridir.',
    'İhlal 72 saat içinde Kurul\'a bildirilir.',
    'Gizlemek, ihlalden daha ağır sonuç doğurur.',
  ],
};
