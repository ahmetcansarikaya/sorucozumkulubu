import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Hakkımızda</h1>
        <p className="text-lg text-gray-700 mb-6">
          <b>Soru Çözüm Kulübü</b>, öğrencilerin ve öğretmenlerin bir araya gelerek bilgi paylaşımında bulunduğu, soruların hızlı ve güvenilir şekilde çözüldüğü modern bir eğitim platformudur.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Amacımız</h2>
        <p className="mb-4 text-gray-700">
          Eğitimde fırsat eşitliğini sağlamak, öğrencilerin akıllarına takılan soruları kolayca sorabilmelerini ve uzmanlardan hızlıca yanıt alabilmelerini mümkün kılmak. Bilgiye erişimi demokratikleştirerek, herkesin başarıya ulaşmasını destekliyoruz.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nasıl Çalışır?</h2>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Öğrenciler ücretsiz üye olarak soru sorabilir.</li>
          <li>Öğretmenler ve diğer öğrenciler sorulara cevap verebilir.</li>
          <li>Her soru, alanında uzman kişiler tarafından incelenir ve onaylanır.</li>
          <li>Kullanıcılar özel mesajlaşma ile iletişim kurabilir.</li>
          <li>Profil sayfasından kişisel bilgilerini ve başarılarını yönetebilirler.</li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Vizyonumuz</h2>
        <p className="mb-4 text-gray-700">
          Türkiye'nin en güvenilir ve en büyük online eğitim topluluğu olmak; bilgiye ulaşmak isteyen herkese destek vermek.
        </p>
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">Ana sayfaya dön</Link>
        </div>
      </div>
    </div>
  );
} 