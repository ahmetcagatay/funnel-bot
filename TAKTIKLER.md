# Funnel Bot - Lead Analiz ve Donusum Taktikleri

## 1. Lead Geldiginde Yapilacaklar

### 1.1 Veri Toplama
- Supabase'den lead verisini cek (telefon, website, sektor, butce, deneyim vs.)
- Headless Chrome ile sitenin rendered DOM'unu al (SPA'lar icin WebFetch calismaz)
- Google'da marka adi + rakip arastirmasi yap
- Rakiplerin B2B fiyatlarini ve ozelliklerini topla

### 1.2 Site Analizi Kontrol Listesi
- [ ] SSR/SSG var mi? (Sayfa kaynaginda icerik gorunuyor mu?)
- [ ] Meta description var mi, spesifik mi?
- [ ] OG taglari var mi? (LinkedIn/WhatsApp paylasiminda onizleme cikar mi?)
- [ ] Title tag markalanmis mi yoksa jenerik mi?
- [ ] Pricing sayfasi var mi?
- [ ] Demo/trial sayfasi var mi?
- [ ] About/hakkimizda sayfasi var mi?
- [ ] Blog icerik var mi?
- [ ] Testimonial/sosyal kanit var mi?
- [ ] Footer linkleri calisiyor mu?
- [ ] Mobil uyumlu mu?
- [ ] Hangi teknoloji/platform ile yapilmis? (Lovable, Vercel, Next.js vs.)

### 1.3 Rapor Olusturma
- `/musteri-adi/rapor.html` seklinde klasor olustur
- Raporda 7 bolum: profil, site analizi, marka sorunu, rakip analizi, fiyat karsilastirmasi, aksiyon plani, sonuc
- "Iyilestirmeleri Kopyala" butonunu basa koy (tarayicida gorunur, PDF'te gizli)
- Fiyat karsilastirmasinda TUM planlari goster (sadece en pahalisiyla kiyaslama)


## 2. Funnel Tasarim Taktikleri

### 2.1 Soru Tasarimi
- ILK SORU her zaman bir agri noktasi olmali: "Meeting'lerde her seyi anliyor musun?"
- Sorular konusma gibi hissettirmeli, form gibi degil
- 8-10 soru ideal - daha az yetersiz, daha fazla sikici
- Her soru tek ekran (scroll yok, PWA hissi)
- Emoji ana gorsel dil olarak kullan (SVG/animasyon yoksa)
- Multi-select sorulari "en buyuk zorluk" gibi konularda kullan

### 2.2 Soru Sirasi (Template)
1. Agri noktasi (anliyor musun?)
2. Mevcut seviye (CEFR biliyor musun?)
3. Spesifik zorluklar (multi-select)
4. Siklik/yogunluk (ne siklikta?)
5. Bireysel mi takim mi?
6. Mevcut cozum (su an ne yapiyorsun?)
7. Butce algisi (ne kadar degerli?)
8. Kisisellesmis analiz sonucu
9. Email ile lead capture
10. Dashboard preview + aksiyon butonu

### 2.3 Kritik Kurallar
- FIYAT GOSTERME: Kullanici raporu gorene kadar hicbir ucret bahsetme
- ONCE LEAD AL: "Sign up" degil, "biz sana ulasalim" dili kullan
- UCRETSIZ DEGER VER: Raporun bir kismini ucretsiz goster, gerisi icin kayit iste
- SIKISTIRMA: Ilk lead'ler pivotlama icin degerli - fiyatla sikistirma
- SOSYAL KANIT: Her adimda kucuk bir social proof ekle ("1,200+ kisi analiz edildi")
- MOBIL ONCELIK: Tam ekran, swipeable, bottom-anchored butonlar


## 3. Fiyat Karsilastirma Taktikleri

### 3.1 Dogru Kiyaslama
- Musterinin TUM planlarini goster (free, starter, enterprise)
- Her plani kendi segmentindeki rakiplerle kiyasla
- Bireysel ve B2B fiyatlari AYRI tablolarda goster
- Sadece en pahali planla kiyaslamak haksizlik - iyi fiyatlanan planlari da vurgula

### 3.2 Fiyat Pozisyonlama
- Rakiplerden ucuz plan varsa: "Rekabetci" tag'i ile vurgula
- Rakiplerden pahali plan varsa: "Neden pahali?" sorusunu cevapla (SSO, ozel ogretmen vs.)
- Fiyat onerisi: Yeni urunler icin pazarin ortasi veya altinda girmek mantikli
- "Tamamlayici urun" konumlandirmasi: "ELSA ile pratiginizi yapin, X ile performansinizi olcun"


## 4. WhatsApp Iletisim Sablonu

```
Merhaba,

Funnel verilerinizi analiz ettik. [DOMAIN] icin detayli bir rapor hazirladik:

📊 *Analiz Raporu:*
https://funnel-bot.vercel.app/[MUSTERI]/rapor.html

Raporda sunlar var:
- Site teknik analizi (SEO, UX sorunlari)
- Rakip karsilastirmasi
- Fiyatlandirma analizi
- Adim adim iyilestirme plani

Ayrica sizin icin ornek bir funnel tasarladik:

🎯 *Demo Funnel:*
https://funnel-bot.vercel.app/[MUSTERI]/demo-funnel.html

Funnel stratejisinin detaylari ve uygulama plani icin birlikte calisabiliriz. Uygun oldugunuz bir zamanda konusalim mi?
```


## 5. Teknik Altyapi

### 5.1 Dosya Yapisi
```
funnel-bot/
├── index.html          # Ana funnel formu
├── dashboard.html      # Lead dashboard
├── vercel.json         # Routing
├── musteri-adi/
│   ├── rapor.html      # Musteri raporu
│   └── demo-funnel.html # Ornek funnel
└── baska-musteri/
    ├── rapor.html
    └── demo-funnel.html
```

### 5.2 Supabase Tablosu (funnel_leads)
- `source`: Hangi funnel'dan geldi ('main', 'demo-funnel', 'englifyai-demo' vs.)
- `status`: Lead durumu ('new', 'interested', 'contacted', 'converted')
- `answers`: JSON olarak tum funnel cevaplari
- `email`: Lead email adresi

### 5.3 Demo Funnel'da Supabase Entegrasyonu
- Son adimda "Begendim, sonraki asamaya gecelim" butonu
- Tiklandiginda Supabase'e POST atar (email + cevaplar + status: 'interested')
- Dashboard'da bu lead'leri gorebilirsin


## 6. Rapor Icin Gorsel/UX Onerileri (Musteriye Sunulacak)

### 6.1 Her Zaman Soyle
- "Gorsel anlatim zayif" - SVG ikonlar ve emoji kullanin, Claude Code ile hizlica olusturabilirsiniz
- "Pricing'i gizleyin" - Once lead alin, kullaniciyi taniyin, sonra fiyat sunun
- "Mobil PWA deneyimi" - Scroll yerine adim adim ilerleyen app-like akis
- "Mesaji basitlestirin" - Tek net CTA, kullaniciyi yormayin
- "Biz ulasalim" - Kullaniciyi arastirmak zorunda birakmayin, siz ulasacaginizi soyeleyin
- "Testimonial toplayin" - Pilot kullanicilardan geri bildirim alin

### 6.2 Strateji Notu (Her Raporda Kullan)
> Musterinizi tanimadan satis yapmak "kor satis" yapmaktir. Sitene yatirim yapan
> kullanicinin verdigi cevaplarla (butcesi, takim buyuklugu, sorunlari) onu taniyabilirsiniz.
> Ilk lead'leriniz en degerli ogrenme kaynaklarinizdir - onlari fiyatla sikistirmayin.


## 7. Headless Chrome ile SPA Icerik Cekme

SPA sitelerde WebFetch calismaz. Headless Chrome kullan:

```bash
# Rendered DOM'u al
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --dump-dom "https://site.com" 2>/dev/null > dom.html

# Sadece metin icerigini cek
... | python3 -c "
import sys, re, html
content = sys.stdin.read()
content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
content = re.sub(r'<svg[^>]*>.*?</svg>', '', content, flags=re.DOTALL)
content = re.sub(r'<[^>]+>', '\n', content)
content = html.unescape(content)
lines = [l.strip() for l in content.split('\n') if l.strip() and len(l.strip()) > 1]
seen = set()
for l in lines:
    if l not in seen:
        seen.add(l)
        print(l)
"

# PDF olusturma (header/footer olmadan)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --print-to-pdf="rapor.pdf" --no-pdf-header-footer rapor.html
```
