'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Bir Hata Oluştu
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'}
        </p>
        <div className="flex justify-end">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    </div>
  );
} 