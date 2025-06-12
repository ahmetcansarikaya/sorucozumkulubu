'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    questions: 0,
    answers: 0,
    comments: 0
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentAnswers, setRecentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, questionsRes, answersRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-questions'),
        fetch('/api/dashboard/recent-answers')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setRecentQuestions(questionsData);
      }

      if (answersRes.ok) {
        const answersData = await answersRes.json();
        setRecentAnswers(answersData);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Hoş Geldiniz, {session?.user?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Sorularım</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.questions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Cevaplarım</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.answers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Yorumlarım</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{stats.comments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Son Sorularım</h2>
            <div className="space-y-4">
              {recentQuestions.length > 0 ? (
                recentQuestions.map((question) => (
                  <div key={question.id} className="border-b pb-4 last:border-b-0">
                    <Link href={`/questions/${question.id}`} className="text-blue-600 hover:text-blue-800">
                      {question.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(question.createdAt).toLocaleDateString('tr-TR')} • {question._count.answers} cevap
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Henüz soru sorulmamış.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Son Cevaplarım</h2>
            <div className="space-y-4">
              {recentAnswers.length > 0 ? (
                recentAnswers.map((answer) => (
                  <div key={answer.id} className="border-b pb-4 last:border-b-0">
                    <Link href={`/questions/${answer.question.id}`} className="text-blue-600 hover:text-blue-800">
                      {answer.question.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(answer.createdAt).toLocaleDateString('tr-TR')} • {answer._count.comments} yorum
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Henüz cevap verilmemiş.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 