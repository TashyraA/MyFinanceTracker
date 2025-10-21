import { Sparkles } from 'lucide-react';

const StickerBank = () => {
  const stickers = [
    '⭐', '💖', '🌸', '🦋', '✨', '💕', '🌺', '🎀',
    '🌷', '🌹', '💐', '🌼', '🌻', '🏵️', '💮', '🪷',
    '🎨', '🎭', '🎪', '🎡', '🎢', '🎠', '🎯', '🎲',
    '🍰', '🧁', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮',
    '☀️', '🌙', '⭐', '🌟', '💫', '✨', '🌈', '☁️',
    '💝', '💗', '💓', '💞', '💘', '💌', '💟', '❤️'
  ];

  const handleStickerClick = (sticker: string) => {
    navigator.clipboard.writeText(sticker);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-coquette-rose" size={24} />
        <h2 className="text-xl font-bold text-coquette-darkBrown">Sticker Bank</h2>
      </div>

      <p className="text-sm text-coquette-brown mb-4">Click any sticker to copy it!</p>

      <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto">
        {stickers.map((sticker, index) => (
          <button
            key={index}
            onClick={() => handleStickerClick(sticker)}
            className="text-3xl hover:scale-125 transition-transform cursor-pointer p-2 hover:bg-coquette-bg rounded-lg"
            title="Click to copy"
          >
            {sticker}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-coquette-bg rounded-lg">
        <p className="text-xs text-coquette-brown">
          💡 Click any sticker to copy it, then paste it anywhere in your planner!
        </p>
      </div>
    </div>
  );
};

export default StickerBank;