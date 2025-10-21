import { useState } from 'react';
import { Sparkles, Upload, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { CustomSticker } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface CollapsibleStickerPanelProps {
  customStickers: CustomSticker[];
  onUpdate: (stickers: CustomSticker[]) => void;
}

const CollapsibleStickerPanel = ({ customStickers, onUpdate }: CollapsibleStickerPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultStickers = [
    '⭐','💖','🌸','🦋','✨','💕','🌺','🎀',
    '🌷','🌹','💐','🌼','🌻','🏵️','💮','🪷',
    '🎨','🎭','🎪','🎡','🎢','🎠','🎯','🎲',
    '🍰','🧁','🍪','🍩','🍫','🍬','🍭','🍮',
    '☀️','🌙','⭐','🌟','💫','✨','🌈','☁️',
    '💝','💗','💓','💞','💘','💌','💟','❤️'
  ];

  const handleDragStart = (e: React.DragEvent, content: string, isImage: boolean = false) => {
    e.dataTransfer.setData('text/plain', content);
    e.dataTransfer.setData('isImage', isImage.toString());
    e.dataTransfer.effectAllowed = 'copy';
    if (isImage) {
      const img = new Image();
      img.src = content;
      e.dataTransfer.setDragImage(img, 25, 25);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onerror = () => {
        alert('Failed to read image file. Please try again.');
        setIsUploading(false);
      };
      reader.onload = () => {
        try {
          const result = reader.result as string;
          if (!result || !result.startsWith('data:image/')) throw new Error('Invalid image data');
          const newSticker: CustomSticker = {
            id: uuidv4(),
            imageUrl: result,
            name: file.name,
            fileType: 'png',
          };
          onUpdate([...customStickers, newSticker]);
        } catch {
          alert('Failed to process image. Please try a different file.');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Failed to upload sticker. Please try again.');
      setIsUploading(false);
    }
    event.target.value = '';
  };

  const handleDeleteSticker = (id: string) => {
    onUpdate(customStickers.filter(s => s.id !== id));
  };

  return (
    <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'}`}>
      <div className="flex items-stretch">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-coquette-pink text-white p-3 rounded-l-xl hover:bg-coquette-rose border border-coquette-rose/40 transition-colors shadow-lg flex items-center justify-center"
        >
          {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
        
        <div className="bg-white border-2 border-coquette-pink rounded-l-xl shadow-2xl w-80 max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-coquette-pink/30 bg-gradient-to-r from-coquette-bg to-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-coquette-rose" size={24} />
              <h3 className="text-lg font-bold text-coquette-darkBrown">Sticker Bank</h3>
            </div>
            <label className={`flex items-center justify-center gap-2 bg-coquette-pink text-white px-4 py-2 rounded-lg hover:bg-coquette-rose transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload size={18} />
              <span className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Upload PNG Sticker'}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {customStickers.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-coquette-brown mb-2">Your Stickers (Drag to planner)</p>
                <div className="grid grid-cols-4 gap-2">
                  {customStickers.map((sticker) => (
                    <div key={sticker.id} className="relative group">
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, sticker.imageUrl, true)}
                        className="w-full h-16 cursor-move hover:scale-110 transition-transform bg-coquette-cream rounded-lg p-1 flex items-center justify-center"
                        title="Drag to planner"
                      >
                        <img
                          src={sticker.imageUrl}
                          alt={sticker.name}
                          className="max-w-full max-h-full object-contain pointer-events-none select-none"
                          draggable={false}
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteSticker(sticker.id)}
                        className="absolute -top-1 -right-1 bg-coquette-deep text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-coquette-brown mb-2">Default Stickers (Drag to planner)</p>
              <div className="grid grid-cols-6 gap-2">
                {defaultStickers.map((sticker, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sticker, false)}
                    className="text-3xl hover:scale-125 transition-transform cursor-move p-2 hover:bg-coquette-cream rounded-lg flex items-center justify-center"
                    title="Drag to planner"
                  >
                    {sticker}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-coquette-bg border-t border-coquette-pink/30">
            <p className="text-xs text-coquette-brown text-center">
              💡 Drag stickers anywhere on your planner! Move, resize, or delete them anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleStickerPanel;
