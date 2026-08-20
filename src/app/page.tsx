'use client';
import { useEffect, useState, useMemo } from 'react';
import MemeEditorWrapper from '@/components/MemeEditorWrapper';
import { Search } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  imageUrl: string;
}

type TabType = 'Top' | 'Trendy';

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('Top');

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

  const filteredTemplates = useMemo(() => {
    let result = templates;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Fake sort for Trendy vs Top
    if (activeTab === 'Trendy') {
      result = [...result].reverse();
    }
    
    return result;
  }, [templates, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🔥</span>
            <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Memeify
            </h1>
          </div>
          <div className="flex gap-2 md:gap-4 items-center">
            <a href="/upload" className="text-xs md:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">Upload</a>
            <a href="/admin" className="text-xs md:text-sm font-semibold hover:text-blue-600 transition-colors">Admin</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedTemplate ? (
          <div className="flex flex-col items-center">
            {/* Hero & Search Section */}
            <div className="w-full max-w-3xl mb-10 mt-4 px-2">
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-center tracking-tight text-gray-900">
                Find the perfect meme template.
              </h2>
              <div className="relative w-full shadow-sm rounded-full overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input 
                  type="text"
                  placeholder="Search templates (e.g. Drake, Boyfriend)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-4 text-lg md:text-xl outline-none text-gray-800"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-200 p-1 rounded-lg">
              {(['Top', 'Trendy'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="w-full">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-500 mb-4 text-lg">No templates found for "{searchQuery}".</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group flex flex-col"
                      onClick={() => setSelectedTemplate(template.imageUrl)}
                    >
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3 border-t border-gray-50 flex-grow flex items-center justify-center">
                        <p className="font-semibold text-center text-xs md:text-sm text-gray-700 line-clamp-2">{template.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="mb-6 flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
            >
              &larr; Back to Gallery
            </button>
            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black mb-6 text-center text-gray-900">Customize Your Meme</h2>
              <div className="overflow-x-auto pb-4">
                <MemeEditorWrapper templateUrl={selectedTemplate} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
