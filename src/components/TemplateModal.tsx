import { X, Plus, Trash2, BookmarkPlus, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { StorageLocation, FoodCategory, FoodTemplate, CategoryFilterType } from '@/types';
import { useFoodStore } from '@/store/useFoodStore';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions: { value: FoodCategory; label: string; emoji: string }[] = [
  { value: 'vegetable', label: '蔬菜', emoji: '🥬' },
  { value: 'fruit', label: '水果', emoji: '🍎' },
  { value: 'meat', label: '肉类', emoji: '🥩' },
  { value: 'condiment', label: '调味品', emoji: '🧂' },
  { value: 'beverage', label: '饮料', emoji: '🥤' },
  { value: 'snack', label: '零食', emoji: '🍪' },
  { value: 'other', label: '其他', emoji: '📦' },
];

const locationOptions: { value: StorageLocation; label: string }[] = [
  { value: 'refrigerator', label: '冷藏' },
  { value: 'freezer', label: '冷冻' },
  { value: 'room', label: '常温' },
];

export function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
  const templates = useFoodStore((state) => state.templates);
  const addTemplate = useFoodStore((state) => state.addTemplate);
  const removeTemplate = useFoodStore((state) => state.removeTemplate);
  const addItemFromTemplate = useFoodStore((state) => state.addItemFromTemplate);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('个');
  const [shelfLifeDays, setShelfLifeDays] = useState('7');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('refrigerator');
  const [category, setCategory] = useState<FoodCategory>('other');
  const [showAddForm, setShowAddForm] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<CategoryFilterType>('all');

  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (templateCategoryFilter !== 'all') {
      result = result.filter((t) => t.category === templateCategoryFilter);
    }
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase().trim();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [templates, templateCategoryFilter, templateSearch]);

  const groupedTemplates = useMemo(() => {
    if (templateCategoryFilter !== 'all') {
      const meta = categoryOptions.find((c) => c.value === templateCategoryFilter);
      return meta ? [{ ...meta, items: filteredTemplates }] : [];
    }
    return categoryOptions
      .map((meta) => ({
        ...meta,
        items: filteredTemplates.filter((t) => t.category === meta.value),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredTemplates, templateCategoryFilter]);

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shelfLifeDays) return;

    addTemplate({
      name: name.trim(),
      unit: unit || '个',
      shelfLifeDays: Number(shelfLifeDays),
      storageLocation,
      category,
    });

    setName('');
    setUnit('个');
    setShelfLifeDays('7');
    setStorageLocation('refrigerator');
    setCategory('other');
    setShowAddForm(false);
  };

  const handleQuickAdd = (templateId: string) => {
    addItemFromTemplate(templateId, 1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-slideUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">常用食材模板</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {templates.length > 0 && (
          <div className="px-6 pt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="搜索模板..."
                className="w-full pl-9 pr-9 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm bg-white"
              />
              {templateSearch && (
                <button
                  onClick={() => setTemplateSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setTemplateCategoryFilter('all')}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  templateCategoryFilter === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setTemplateCategoryFilter(cat.value)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    templateCategoryFilter === cat.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xs">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <BookmarkPlus className="text-gray-400" size={28} />
              </div>
              <p className="text-gray-500 mb-4">还没有常用模板</p>
              <p className="text-sm text-gray-400">添加常用食材，下次一键录入</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">没有匹配的模板</p>
            </div>
          ) : (
            <div className="space-y-5">
              {groupedTemplates.map((group) => (
                <div key={group.value}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">{group.emoji}</span>
                    <span className="text-xs font-semibold text-gray-500">{group.label}</span>
                    <span className="text-xs text-gray-400">({group.items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onQuickAdd={handleQuickAdd}
                        onRemove={removeTemplate}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddForm && (
            <form onSubmit={handleAddTemplate} className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-4">添加新模板</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    食材名称
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：牛奶"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      单位
                    </label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="个/盒/斤"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      保质期（天）
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={shelfLifeDays}
                      onChange={(e) => setShelfLifeDays(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    食材类别
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                          category === cat.value
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    存放位置
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {locationOptions.map((loc) => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => setStorageLocation(loc.value)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          storageLocation === loc.value
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || !shelfLifeDays}
                    className="flex-1 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    保存模板
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200"
            >
              <Plus size={20} />
              添加新模板
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: FoodTemplate;
  onQuickAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

function TemplateCard({ template, onQuickAdd, onRemove }: TemplateCardProps) {
  const categoryLabel = categoryOptions.find((c) => c.value === template.category)?.label || '其他';
  const categoryEmoji = categoryOptions.find((c) => c.value === template.category)?.emoji || '📦';
  const locationLabel = locationOptions.find((l) => l.value === template.storageLocation)?.label || '常温';

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">{categoryEmoji}</span>
          <h4 className="font-semibold text-gray-800 text-sm truncate">{template.name}</h4>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {categoryLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-gray-600 font-medium">
            {template.name}-保质期{template.shelfLifeDays}天
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span>{template.unit}</span>
          <span>·</span>
          <span>{locationLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onQuickAdd(template.id)}
          className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"
        >
          一键添加
        </button>
        <button
          onClick={() => onRemove(template.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="删除模板"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
