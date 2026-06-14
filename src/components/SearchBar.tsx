import { Search, X } from 'lucide-react';
import { useFoodStore } from '@/store/useFoodStore';

export function SearchBar() {
  const searchQuery = useFoodStore((state) => state.searchQuery);
  const setSearchQuery = useFoodStore((state) => state.setSearchQuery);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜索食材名称..."
        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
