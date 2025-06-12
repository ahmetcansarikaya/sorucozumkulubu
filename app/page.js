import Link from 'next/link';
import Hero from './components/Hero';
import Features from './components/Features';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Statistics Section */}
      <section className="bg-blue-600 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Rakamlarla Soru Çözüm Kulübü
              </h2>
              <p className="mt-4 text-lg leading-8 text-blue-100">
                Binlerce öğrenciye ulaşan, güvenilir bir platform
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-blue-500/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-blue-100">Aktif Öğrenci</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">10,000+</dd>
              </div>
              <div className="flex flex-col bg-blue-500/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-blue-100">Çözülen Soru</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">50,000+</dd>
              </div>
              <div className="flex flex-col bg-blue-500/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-blue-100">Uzman Öğretmen</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">100+</dd>
              </div>
              <div className="flex flex-col bg-blue-500/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-blue-100">Başarı Oranı</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">%95</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Hemen Başlayın
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Soru Çözüm Kulübüne katılın, bilgi birikiminizi artırın ve başarıya ulaşın.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Ücretsiz Üye Ol
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Daha Fazla Bilgi <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-gray-400 hover:text-gray-300">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-300">
              İletişim
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-300">
              Gizlilik
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-300">
              Kullanım Şartları
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-400">
              &copy; 2024 Soru Çözüm Kulübü. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
} 