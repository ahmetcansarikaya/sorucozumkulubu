'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchMessages();
      fetchUsers();
    }
  }, [status, router]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/messages');
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Mesajlar yüklenirken bir hata oluştu');
      }
      
      const data = await res.json();
      console.log('API Response:', data); // Debug için API yanıtını logla
      
      if (!data || typeof data !== 'object') {
        console.error('Geçersiz API yanıtı:', data);
        setReceived([]);
        setSent([]);
        return;
      }
      
      // Gelen ve giden mesajları kontrol et
      const validReceived = Array.isArray(data.received) ? data.received : [];
      const validSent = Array.isArray(data.sent) ? data.sent : [];
      
      setReceived(validReceived);
      setSent(validSent);
    } catch (error) {
      console.error('Mesaj yükleme hatası:', error);
      setError(error.message);
      setReceived([]);
      setSent([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Kullanıcılar yüklenirken bir hata oluştu');
      }
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        console.error('Geçersiz kullanıcı verisi:', data);
        setUsers([]);
        return;
      }
      
      // Kendisi hariç kullanıcıları filtrele
      const validUsers = data.filter(user => 
        user && typeof user === 'object' && 
        user.id && user.id !== session?.user?.id
      );
      
      setUsers(validUsers);
    } catch (error) {
      console.error('Kullanıcı yükleme hatası:', error);
      setError(error.message);
      setUsers([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!receiverId || !content.trim()) {
      setError('Lütfen bir alıcı seçin ve mesaj içeriği girin');
      return;
    }

    try {
      setSending(true);
      setError(null);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content: content.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Mesaj gönderilemedi');
      }

      setContent('');
      setReceiverId('');
      await fetchMessages();
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Mesaj Kutusu</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Yeni Mesaj Gönder</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">
                Alıcı
              </label>
              <select
                id="receiver"
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Kime...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Mesaj
              </label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Mesajınız..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {sending ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Gelen Mesajlar</h2>
            <div className="space-y-4">
              {received.length === 0 ? (
                <div className="text-gray-500 text-center py-4">Gelen mesajınız yok.</div>
              ) : (
                received.map(msg => {
                  if (!msg || typeof msg !== 'object' || !msg.id) {
                    console.error('Geçersiz mesaj verisi:', msg);
                    return null;
                  }
                  
                  return (
                    <div key={msg.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {msg.sender?.name || 'Bilinmeyen Kullanıcı'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString('tr-TR') : ''}
                        </span>
                      </div>
                      <p className="text-gray-700">{msg.content || 'İçerik yok'}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Gönderilen Mesajlar</h2>
            <div className="space-y-4">
              {sent.length === 0 ? (
                <div className="text-gray-500 text-center py-4">Gönderilen mesajınız yok.</div>
              ) : (
                sent.map(msg => {
                  if (!msg || typeof msg !== 'object' || !msg.id) {
                    console.error('Geçersiz mesaj verisi:', msg);
                    return null;
                  }
                  
                  return (
                    <div key={msg.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {msg.receiver?.name || 'Bilinmeyen Kullanıcı'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString('tr-TR') : ''}
                        </span>
                      </div>
                      <p className="text-gray-700">{msg.content || 'İçerik yok'}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 