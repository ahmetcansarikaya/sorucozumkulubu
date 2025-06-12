'use client';

import Image from 'next/image';

const features = [
  {
    title: 'Hızlı Çözümler',
    description: 'Sorularınıza dakikalar içinde uzman öğretmenler ve başarılı öğrencilerden yanıtlar alın.',
    image: '/images/feature-1.jpg',
  },
  {
    title: 'Detaylı Açıklamalar',
    description: 'Her çözüm adım adım açıklanır, böylece konuyu tam olarak anlarsınız.',
    image: '/images/feature-2.jpg',
  },
  {
    title: 'Topluluk Desteği',
    description: 'Diğer öğrencilerle etkileşime geçin, birlikte öğrenin ve gelişin.',
    image: '/images/feature-3.jpg',
  },
];

export default function Features() {
  return (
    <div className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Neden Soru Çözüm Kulübü?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Öğrenciler için tasarlanmış, interaktif ve kullanıcı dostu bir platform.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <div className="relative mb-6 h-52 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={400}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  {feature.title}
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 