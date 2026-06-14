import { useStats } from '@/hooks/useFoodItems';

export function StatsBar() {
  const stats = useStats();
  const freshCount = stats.total - stats.danger - stats.warning - stats.expired;

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
        <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
        <div className="text-xs text-gray-500 mt-0.5">全部食材</div>
      </div>
      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
        <div className="text-2xl font-bold text-emerald-500">{freshCount}</div>
        <div className="text-xs text-gray-500 mt-0.5">新鲜</div>
      </div>
      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
        <div className="text-2xl font-bold text-amber-500">{stats.warning}</div>
        <div className="text-xs text-gray-500 mt-0.5">7天内</div>
      </div>
      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
        <div className="text-2xl font-bold text-red-500">{stats.danger + stats.expired}</div>
        <div className="text-xs text-gray-500 mt-0.5">3天内/过期</div>
      </div>
    </div>
  );
}
