'use client';

import Image from 'next/image';

export default function Background({ children }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0" style={{ zIndex: -1 }}>
        <Image
          src="/images/background.jpg"
          alt="Arka plan"
          width={1920}
          height={1080}
          className="object-cover opacity-5"
          priority
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 