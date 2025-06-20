'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [roleUpdating, setRoleUpdating] = useState(null); // userId
  const { data: session } = useSession();

  useEffect(() => {
    fetchStats();
    fetchQuestions();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('İstatistikler yüklenemedi');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
      setError('İstatistikler yüklenirken bir hata oluştu');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (!response.ok) throw new Error('Sorular yüklenemedi');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Soru yükleme hatası:', error);
      setError('Sorular yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Kullanıcılar yüklenemedi');
      const data = await response.json();
      const currentUserId = session?.user?.id;
      setUsers(
        (data.users || []).map(user =>
          user.id === currentUserId ? { ...user, isSelf: true } : user
        )
      );
    } catch (error) {
      setUserError('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setUserLoading(false);
    }
  };

  const handleStatusChange = async (questionId, newStatus) => {
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: questionId,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Soru güncellenemedi');
      
      // Soruları yeniden yükle
      fetchQuestions();
    } catch (error) {
      console.error('Soru güncelleme hatası:', error);
      setError('Soru güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/admin/questions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: questionId }),
      });

      if (!response.ok) throw new Error('Soru silinemedi');
      
      // Soruları yeniden yükle
      fetchQuestions();
    } catch (error) {
      console.error('Soru silme hatası:', error);
      setError('Soru silinirken bir hata oluştu');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setRoleUpdating(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Rol güncellenemedi');
      await fetchUsers();
    } catch (error) {
      alert('Rol güncellenirken bir hata oluştu');
    } finally {
      setRoleUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Kullanıcı Yönetimi */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Yönetimi</h2>
            {userLoading ? (
              <div>Yükleniyor...</div>
            ) : userError ? (
              <div className="text-red-500">{userError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            disabled={roleUpdating === user.id || user.isSelf}
                            onChange={e => handleRoleChange(user.id, e.target.value)}
                            className="text-sm rounded-md border-gray-300"
                          >
                            <option value="user">Kullanıcı</option>
                            <option value="admin">Admin</option>
                          </select>
                          {roleUpdating === user.id && <span className="ml-2 text-xs text-gray-400">Güncelleniyor...</span>}
                          {user.isSelf && <span className="ml-2 text-xs text-gray-400">(Kendiniz)</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* İstatistikler */}
        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Toplam Soru</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalQuestions}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kullanıcı</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Toplam Cevap</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalAnswers}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Bekleyen Sorular</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingQuestions}</dd>
              </div>
            </div>
          </div>
        )}

        {/* Soru Listesi */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sorular</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yazar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question) => (
                    <tr key={question.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{question.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{question.author.name}</div>
                        <div className="text-sm text-gray-500">{question.author.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={question.status}
                          onChange={(e) => handleStatusChange(question.id, e.target.value)}
                          className="text-sm rounded-md border-gray-300"
                        >
                          <option value="pending">Beklemede</option>
                          <option value="approved">Onaylandı</option>
                          <option value="rejected">Reddedildi</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(question.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 