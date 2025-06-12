'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    search: '',
  });

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/questions?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sorular yüklenirken bir hata oluştu');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug için API yanıtını logla
      
      if (!data || !Array.isArray(data)) {
        console.error('Geçersiz API yanıtı:', data);
        setQuestions([]);
        return;
      }
      
      // Her bir sorunun gerekli alanlarını kontrol et
      const validQuestions = data.filter(question => {
        if (!question || typeof question !== 'object') return false;
        if (!question.id) return false;
        return true;
      });
      
      setQuestions(validQuestions);
    } catch (error) {
      console.error('Soru yükleme hatası:', error);
      setError(error.message);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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

  // questions dizisinin varlığını ve geçerliliğini kontrol et
  const validQuestions = Array.isArray(questions) ? questions : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sorular</h1>
          <Link
            href="/questions/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Yeni Soru Sor
          </Link>
        </div>

        {/* Filtreler */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Ders
              </label>
              <select
                id="subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="matematik">Matematik</option>
                <option value="fizik">Fizik</option>
                <option value="kimya">Kimya</option>
                <option value="biyoloji">Biyoloji</option>
                <option value="turkce">Türkçe</option>
                <option value="ingilizce">İngilizce</option>
              </select>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Sınıf
              </label>
              <select
                id="grade"
                name="grade"
                value={filters.grade}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
              </select>
            </div>

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Arama
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Soru ara..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Soru Listesi */}
        <div className="space-y-4">
          {validQuestions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Henüz soru bulunmuyor.
            </div>
          ) : (
            validQuestions.map((question) => {
              if (!question || typeof question !== 'object' || !question.id) {
                console.error('Geçersiz soru verisi:', question);
                return null;
              }

              return (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">{question.title || 'Başlıksız Soru'}</h2>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.subject || 'Belirtilmemiş'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{question.content || 'İçerik yok'}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {question.author?.name || 'Anonim'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {question.createdAt ? new Date(question.createdAt).toLocaleDateString('tr-TR') : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {question._count?.answers || 0} cevap
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 