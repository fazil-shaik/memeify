'use client';
import { useEffect, useState } from 'react';
import MemeEditorWrapper from '@/components/MemeEditorWrapper';

interface Template {
  id: number;
  name: string;
  imageUrl: string;
}

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch('/api/templates');
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (error) {
        console.error('Failed to load templates', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* <span className="text-3xl">🔥</span> */}
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Memeify</h1>
          </div>
          <div className="flex gap-4 items-center">
            <a href="/upload" className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100">Upload Template</a>
            <a href="/admin" className="text-sm font-semibold hover:text-blue-600">Admin Panel</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!selectedTemplate ? (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">Choose a Template</h2>
            {loading ? (
              <p className="text-center text-gray-500 py-10">Loading templates...</p>
            ) : templates.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">No templates found.</p>
                <a href="/admin" className="text-blue-600 hover:underline font-medium">Upload one in the Admin Panel</a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 group"
                    onClick={() => setSelectedTemplate(template.imageUrl)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <p className="font-semibold text-center text-sm truncate">{template.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              &larr; Back to Templates
            </button>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-center">Edit Meme</h2>
              <MemeEditorWrapper templateUrl={selectedTemplate} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
