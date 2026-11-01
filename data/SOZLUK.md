# Veri sözlüğü — `data/oturumlar.csv`

Her satır **bir karardır**. Bir oturum (bir oyun) 3 satırdan oluşur (Karar 1, 2, 3).
Veri, oyunun veri toplama modunda (`http://localhost:3000/?veri=1`) oyun oynanırken otomatik olarak yazılır. Kod: `app/src/veriToplama.ts`, `app/server.ts` (`/api/oturum`).

| Sütun | Tür | Birim / değerler | Anlamı |
|---|---|---|---|
| `oturum_id` | metin | `o-` + 8 onaltılık karakter | Rastgele oturum kimliği. Kişiyle ya da cihazla bağı yoktur. |
| `kaynak` | metin | `gercek` \| `sentetik` | `gercek`: bir insan oynadı. `sentetik`: bir betik üretti. |
| `oyuncu_kodu` | metin | `O1`, `O2`, … | Anonim oyuncu kodu (adres: `?veri=1&oyuncu=O2`). Kodun kime ait olduğu hiçbir yere yazılmaz. |
| `seviye` | metin | Yeni başladım / Biraz deneyimim var / Deneyimliyim | Girişte seçilen seviye. |
| `rol` | metin | Backend geliştirici / Test (QA) mühendisi / Takım lideri | Girişte seçilen rol. |
| `hedef` | metin | Hata ayıklama / Test ve kalite / Veri güvenliği ve KVKK | Girişte seçilen öğrenme hedefi. |
| `karar_no` | tam sayı | 1, 2, 3 | Kaçıncı karar. |
| `onceki_yanlis_sayisi` | tam sayı | 0–2 | Bu oturumda bu karardan önceki yanlış karar sayısı. |
| `onceki_ort_sure_sn` | ondalık | saniye | Önceki kararların ortalama süresi. Karar 1'de 0. |
| `karar_suresi_sn` | ondalık | saniye (0,1 hassasiyet) | Karar ekranının açılmasından seçime kadar geçen süre. |
| `ipucu_acildi` | 0/1 | — | İpucu kartı göründü mü? "Yeni başladım" seviyesinde her zaman 1. |
| `tereddut_sayisi` | tam sayı | adet | Fare imlecinin A ve B seçenekleri arasında kaç kez gidip geldiği. Dokunmatik ekranda 0 kalır. |
| `tutor_mesaj_sayisi` | tam sayı | adet | Bu kararda AI tutor'a gönderilen mesaj sayısı. |
| `zaman_asimi` | 0/1 | — | 60 saniyelik süre doldu mu? (Yalnızca "Deneyimliyim" seviyesinde mümkün; dolarsa B seçilmiş sayılır.) |
| `secim` | metin | A \| B | Seçilen seçenek. |
| `dogru_mu` | 0/1 | — | **Hedef sütun.** Seçim doğruysa 1, yanlışsa 0. Model `dogru_mu = 0` olasılığını (`p_yanlis`) tahmin eder. |

## KVKK ve gizlilik
- Ad, e-posta, IP adresi, cihaz kimliği, konum ya da zaman damgası **toplanmaz**.
- Tutor'a yazılan mesajların **metni kaydedilmez**, yalnızca sayısı kaydedilir.
- Veri toplama modu yalnızca yerel geliştirme sunucusunda çalışır. Yayındaki uygulamada (`NODE_ENV=production`) `/api/oturum` uç noktası kapalıdır.

## Toplama bilgisi
- **Toplam:** 24 gerçek oturum (72 satır), 2 oyuncu, Kasım 2026.
- **O1 (ödev sahibi):** 17 oturum (51 satır). İlk 15 oturum `oyuncu_kodu` sütunu eklenmeden önce oynandı; bu 45 satır sonradan O1 olarak işaretlendi.
- **O2 (bir arkadaş):** 7 oturum (21 satır). O1'in verisindeki boşlukları kapatması istendi: süre dolması, "İpucu iste" düğmesi, tutor'a soru, yavaş oynama.
- Oyuncular, çeşitlilik için farklı seviye / rol / hedef kombinasyonları ve farklı oynama tarzları denedi.
- **Sentetik veri:** şu an yok.
