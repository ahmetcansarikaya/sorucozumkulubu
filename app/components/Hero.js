'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Soru Çözüm Kulübüne Hoş Geldiniz
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Öğrenciler için interaktif soru çözüm platformu. Sorularınızı paylaşın, 
              cevaplar alın ve bilgi alışverişinde bulunun.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="/auth/register"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Hemen Başla
              </a>
              <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Daha Fazla Bilgi <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <div className="relative aspect-[3/2] w-full bg-gray-50 lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src="/images/hero.jpg"
              alt="Öğrenciler çalışırken"
              width={1000}
              height={667}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 