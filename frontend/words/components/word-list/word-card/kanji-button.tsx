"use client";

type KanjiButtonProps = {
  onClick: () => void;
};

export default function KanjiButton({ onClick }: KanjiButtonProps) {
  return (
    <button
      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
      onClick={onClick}
    >
      <span className="text-2xl font-extrabold text-gray-300 hover:text-gray-700 transition-colors">
        漢
      </span>
    </button>
  );
}
