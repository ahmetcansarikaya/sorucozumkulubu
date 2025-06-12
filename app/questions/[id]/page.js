'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${id}`);
      if (!response.ok) throw new Error('Soru yüklenirken bir hata oluştu');
      const data = await response.json();
      setQuestion(data);
      setAnswers(data.answers);
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', newAnswer);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`/api/questions/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Cevap gönderilirken bir hata oluştu');
      }

      const data = await response.json();
      setAnswers(prev => [...prev, data]);
      setNewAnswer('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Cevap gönderme hatası:', error);
      alert(error.message || 'Cevap gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  function CommentsSection({ answerId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      fetchComments();
      // eslint-disable-next-line
    }, [answerId]);

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/questions/${question.id}/answers/${answerId}/comments`);
        if (!res.ok) throw new Error('Yorumlar yüklenemedi');
        const data = await res.json();
        setComments(data);
      } catch (e) {
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      setIsSubmitting(true);
      try {
        const res = await fetch(`/api/questions/${question.id}/answers/${answerId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newComment }),
        });
        if (!res.ok) throw new Error('Yorum eklenemedi');
        const data = await res.json();
        setComments((prev) => [...prev, data]);
        setNewComment('');
      } catch (e) {
        alert('Yorum eklenemedi.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="mt-4 ml-4 border-l pl-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Yorumlar</h4>
        {isLoading ? (
          <div className="text-xs text-gray-400">Yükleniyor...</div>
        ) : comments.length === 0 ? (
          <div className="text-xs text-gray-400">Henüz yorum yok.</div>
        ) : (
          <ul className="space-y-2 mb-2">
            {comments.map((comment) => (
              <li key={comment.id} className="bg-gray-50 rounded p-2 text-xs">
                <span className="font-medium text-gray-800">{comment.author.name}:</span> {comment.content}
                <span className="ml-2 text-gray-400">{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</span>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded border px-2 py-1 text-xs"
            placeholder="Yorum yaz..."
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white rounded px-3 py-1 text-xs disabled:opacity-50"
          >
            {isSubmitting ? '...' : 'Ekle'}
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Soru bulunamadı.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Soru Detayı */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {question.subject}
            </span>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700">{question.content}</p>
            {question.image && (
              <div className="mt-4">
                <img
                  src={question.image}
                  alt="Soru fotoğrafı"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{question.author.name}</span>
              <span>{new Date(question.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{question.views} görüntülenme</span>
              <span>{answers.length} cevap</span>
            </div>
          </div>
        </div>

        {/* Cevaplar */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Cevaplar</h2>
          
          {answers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Henüz cevap yok. İlk cevabı siz verin!
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700">{answer.content}</p>
                  {answer.image && (
                    <div className="mt-4">
                      <img
                        src={answer.image}
                        alt="Cevap fotoğrafı"
                        className="max-w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div className="flex items-center space-x-4">
                    <span>{answer.author.name}</span>
                    <span>{new Date(answer.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <CommentsSection answerId={answer.id} />
              </div>
            ))
          )}
        </div>

        {/* Cevap Formu */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cevap Yaz</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Cevabınızı yazın..."
              required
            />
            <div className="mt-4">
              <label htmlFor="answer-image" className="block text-sm font-medium text-gray-700">
                Fotoğraf Ekle (Opsiyonel)
              </label>
              <input
                type="file"
                id="answer-image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    className="max-h-48 rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Cevabı Gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 