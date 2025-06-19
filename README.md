# Soru Çözüm Kulübü

## Proje Tanımı

Soru Çözüm Kulübü, öğrencilerin sorularını paylaşabildiği, öğretmenlerin ve diğer öğrencilerin bu sorulara cevap verebildiği, etkileşimli bir eğitim platformudur. Kullanıcılar soru sorabilir, cevap yazabilir, yorum yapabilir ve özel mesajlaşma ile iletişim kurabilir. Platform, eğitimde fırsat eşitliğini artırmayı ve bilgi paylaşımını kolaylaştırmayı amaçlar.

## Kullanılan Teknolojiler

- **Next.js** (v14)
- **React** (v18)
- **Prisma ORM** (v5)
- **SQLite** (geliştirme için)
- **TailwindCSS** (modern ve hızlı stil altyapısı)
- **NextAuth.js** (kimlik doğrulama)
- **bcryptjs** (şifreleme)
- Ek olarak: PostCSS, Autoprefixer, ESLint

## Kurulum Talimatları

1. **Depoyu klonlayın:**
   ```bash
   git clone <repo-link>
   cd sorucozumkulubu
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Çevre değişkenlerini ayarlayın:**
   Proje köküne `.env` dosyası oluşturun ve aşağıdaki örneğe göre doldurun:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="gizli-bir-string"
   ```
   (Gerekli diğer değişkenler için NextAuth veya ek entegrasyonlarınız varsa dökümana bakın.)

4. **Veritabanı migrasyonlarını çalıştırın:**
   ```bash
   npx prisma migrate deploy
   # veya geliştirme için:
   npx prisma migrate dev
   ```

5. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

6. **Admin hesabı oluşturun:**
   - Kayıt sayfasından bir kullanıcı oluşturun.
   - Veritabanında bu kullanıcının `role` alanını `admin` olarak güncelleyin (örn. Prisma Studio ile):
     ```bash
     npx prisma studio
     ```
   - Veya doğrudan SQL ile:
     ```sql
     UPDATE User SET role = 'admin' WHERE email = 'admin@example.com';
     ```

## Admin Giriş Bilgileri (Test için)

```
E-posta: admin@example.com
Şifre: admin123
```
> Not: Bu kullanıcıyı manuel olarak oluşturup rolünü admin yapmalısınız. Otomatik olarak admin kullanıcı oluşturulmamaktadır.

## Ekran Görüntüleri

> Buraya ana sayfa, soru sorma, cevaplama ve admin panelinden ekran görüntüleri ekleyebilirsiniz. 