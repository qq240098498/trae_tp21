import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-300/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-40"
      title="添加食材"
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  );
}
