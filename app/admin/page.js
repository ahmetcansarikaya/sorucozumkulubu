'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Session:', session);
      console.log('Status:', status);
      console.log('User Role:', session?.user?.role);

      if (status === 'loading') {
        return;
      }

      if (status === 'unauthenticated') {
        console.log('Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor...');
        router.push('/auth/login');
        return;
      }

      if (status === 'authenticated' && session?.user) {
        if (session.user.role === undefined) {
          console.log('Role bilgisi bekleniyor...');
          return;
        }

        if (session.user.role !== 'admin') {
          console.log('Kullanıcı admin değil, ana sayfaya yönlendiriliyor...');
          router.push('/');
          return;
        }

        console.log('Admin erişimi onaylandı');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [status, session, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AdminDashboard />;
} 