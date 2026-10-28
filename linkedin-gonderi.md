# LinkedIn gönderisi (taslak, önceki gönderinin üslubunda)

> `[YOUTUBE_LINKI]` yerine video linkini koy. Hocayı etiketlemek için `@` yazıp adını listeden seç.

---

Neal Stephenson'ın "The Diamond Age" romanındaki, okuyana göre kendini uyarlayan kitap "Primer"dan yola çıkarak, yazılım mühendisliği kararlarını gerçekçi bir hastane krizi üzerinden öğreten, mobil uyumlu ve etkileşimli bir simülasyon olan SE Primer'ı spesifikasyon odaklı bir süreçle geliştirdim.

Oyuncu, Laboratuvar Bilgi Sistemi'ne yüklenen hatalı bir sürüm nedeniyle tahlil sonuçlarının yanlış hastalara gittiği bir olayda nöbetçi mühendis rolünü üstleniyor. Hata ayıklama, veri bütünlüğü ve KVKK başlıklarındaki üç kararın her birinin teknik sonucunu ve nedenini görüyor.

Sürecin teknik çıktıları:
• Problem tanımı, kapsam dışı maddeler, 5 kabul örneği ve durum makinesi içeren bir spesifikasyon yazdım. Google Stitch ile tasarım sistemini oluşturdum, Google AI Studio ile de çalışan uygulamaya dönüştürdüm.
• Oyuncunun seviyesine göre uyarlanan bir akış tasarladım: yeni başlayanlara otomatik ipucu veriliyor, deneyimli oyuncular ise 60 saniyelik süre kısıtı altında karar veriyor.
• Cevabı vermeden yalnızca soru soran Sokratik bir AI tutor geliştirdim. Tutor'u 20 farklı zorlayıcı öğrenci mesajıyla (ısrar, rol yapma, talimat geçersiz kılma, eleme vb.) elle etiketleyerek değerlendirdim. Tam cevap sızıntısı 0/20, kısmi yönlendirme 4/20 olarak ölçüldü.
• Değerlendirme öncesinde, model hata verdiğinde sabit bir yanıt döndüren gizli bir hata tespit ettim. Yeniden deneme, yedek model ve şeffaf hata bildirimi ile bu hatayı giderdim.
• Cypress ile 8 karar yolunun tamamını ve tüm kabul örneklerini kapsayan uçtan uca testler yazdım. 16 testin tamamı başarıyla geçti.

Bizleri her zaman mühendislik problemlerine sistematik ve sorgulayıcı bir bakış açısıyla yaklaşmaya teşvik eden değerli hocamız @Nurettin Şenyer'e katkılarından dolayı teşekkür ederim.
Projenin çalışma sürecini anlatan demo videoma, uygulamaya ve kaynak kodlarına aşağıdaki bağlantılardan ulaşabilirsiniz.

🎥 Demo Video: https://youtu.be/mHVhM-neVoo

📱 Uygulama: https://ai.studio/apps/af5726e6-29ac-45ee-b4fb-c9c934d50b2c

💻 GitHub Repo: https://github.com/Hakan-grsy/se-primer

#SoftwareEngineering #SpecDrivenDevelopment #AIEvaluation #GoogleAIStudio #Cypress #KVKK #SamsunÜniversitesi
