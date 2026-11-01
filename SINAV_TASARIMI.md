# Sınav Tasarımı — "Sizinle uyumlanan sınav"

> *"Bu sınavı siz olsanız nasıl tasarlardınız?"* — en fazla 1 sayfa.

## 1. Tasarım ilkem
Sınav, öğrenciyi yalnızca ölçmemeli, ona bir şey de öğretmeli. Bu yüzden tanım sormuyorum. Kitapta cevabı olmayan ama kavramı anlayan birinin çözebileceği küçük bir olay veriyorum. Öğrenci kavramın adını değil, **neden gerektiğini** yazarsa puan alır. En çok ezberlenip en az anlaşılan kavramın **regresyon testi** olduğunu düşünüyorum: herkes "eski özellikler bozulmasın diye yapılır" der, ama işin içine rastgelelik girince ne yapacağını bilmez.

## 2. Senaryo sorusu
*Mağara Lordu*, sıra tabanlı bir zindan oyunu. Her saldırıda zar atılır: %10 ihtimalle kritik vuruş olur ve hasar iki katına çıkar. Ekip yeni bir silah ekliyor: **Buz Kılıcı**. Bu silah için hasar hesaplayan fonksiyon değiştirildi. Yeni sürüm çıktıktan sonra oyuncular, eskiden zorlanarak da olsa yenilebilen **Taş Golem**'in artık hiç yenilemediğini bildiriyor. Geliştirici bir oyunu elle oynayıp Golem'i yeniyor ve "bende sorun yok" diyor. Takım lideri, bir daha böyle bir şey olmaması için regresyon testi yazılmasını istiyor.

**Soru:** Oyunda rastgelelik varken bu hatayı yakalayacak **kararlı** bir regresyon testini nasıl tasarlarsınız? (a) Testin "doğru sonucu" nereden bileceğini, (b) zarı nasıl ele alacağınızı, (c) hangi savaşları test edip hangilerini dışarıda bırakacağınızı gerekçesiyle yazın.

## 3. Ölçtüğüm kavramlar
| Kavram | Cevapta görmek istediğim |
|---|---|
| Regresyon testi | Yeni silahın değil, **eski** davranışın (Golem'in yenilebilmesinin) korunduğunun test edilmesi. |
| Test kahini (oracle) | "Doğru sonuç" elle uydurulmaz: değişiklikten **önceki** sürüm referans alınır (karakterizasyon testi). |
| Sabit tohum (seed) | Zar sabit bir tohumla atılırsa aynı savaş her koşuda birebir tekrarlanır. Eski ve yeni sürüm aynı tohumla karşılaştırılır (diferansiyel test). |
| Hata toleransı | Tek bir savaşa değil, örneğin 1000 savaşın kazanma oranına bakılır. Oran eski sürüme göre belirlenen bir toleransın dışına çıkarsa test kırılır. |
| Önceliklendirme | Hasar fonksiyonu değiştiği için bu fonksiyonu kullanan savaşlar (Golem, öteki bosslar) test edilir. Menü ve harita gibi değişmeyen yerler dışarıda bırakılır. |

## 4. Çeldiriciler
- **"Güvenli olmak için her şeyi baştan test ederiz."** Kulağa sorumlu gelir, ama zaman ve maliyet sonsuz değildir. Ayrıca bu cevap, *neyin* bozulma riski taşıdığını düşünmediğini gösterir. Regresyon testi körlemesine değil, değişikliğin etkilediği yere göre seçilir.
- **"Testte zarı kapatırız, kritik vuruşu sıfırlarız."** Test kararlı olur, ama hata tam da kritik vuruşla Buz Kılıcı'nın birlikte hesaplandığı yerdeyse test onu hiç görmez. Rastgelelik kapatılmamalı, tohumla kontrol edilmeli.

## 5. Değerlendirme
Tek bir doğru cevap yok, gerekçe puanlanır. **Tam puan:** referansın eski sürüm olduğu, tohumun neden gerektiği ve hangi savaşların neden seçildiği açıklanmış. **Kısmi puan:** doğru kavramlar sayılmış ama bu senaryoya bağlanmamış. **Sıfır:** "her şeyi test ederiz" ya da "elle oynayıp bakarız" gibi gerekçesiz cevaplar.
