import { useState } from 'react';
import { Upload, X, Sparkles } from 'lucide-react';
import { CustomSticker } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface StickerLibraryProps {
  stickers: CustomSticker[];
  onUpdate: (stickers: CustomSticker[]) => void;
  onSelectSticker: (sticker: CustomSticker) => void;
}

const StickerLibrary = ({ stickers, onUpdate, onSelectSticker }: StickerLibraryProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const newStickers: CustomSticker[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.match(/^image\/(png|svg\+xml)$/)) {
        console.warn(`Skipping ${file.name}: Only PNG and SVG files are supported`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`Skipping ${file.name}: File size exceeds 5MB`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataURL(file);
        const fileType = file.type.includes('svg') ? 'svg' : 'png';

        newStickers.push({
          id: uuidv4(),
          imageUrl: dataUrl,
          name: file.name,
          fileType,
        });
      } catch (error) {
        console.error(`Error reading ${file.name}:`, error);
      }
    }

    if (newStickers.length > 0) {
      onUpdate([...stickers, ...newStickers]);
    }

    setIsUploading(false);
    event.target.value = '';
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(stickers.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-coquette-pink p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-coquette-rose" size={20} />
          <h3 className="text-lg font-bold text-coquette-darkBrown">Sticker Library</h3>
        </div>
        <label className={`flex items-center gap-2 bg-coquette-pink text-white px-3 py-2 rounded-lg hover:bg-coquette-rose transition-colors cursor-pointer text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Upload size={16} />
          <span>{isUploading ? 'Uploading...' : 'Upload Stickers'}</span>
          <input
            type="file"
            accept="image/png,image/svg+xml"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="text-xs text-coquette-brown mb-3 bg-coquette-bg p-2 rounded">
        💡 Upload PNG or SVG files with transparent backgrounds. Click a sticker to add it to your planner!
      </div>

      {stickers.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              onClick={() => onSelectSticker(sticker)}
              className="relative group cursor-pointer bg-coquette-bg rounded-lg p-2 hover:bg-coquette-pink/20 transition-all hover:scale-110 aspect-square flex items-center justify-center"
              title={sticker.name}
            >
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={(e) => handleDeleteSticker(sticker.id, e)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-coquette-brown">
          <p className="text-sm">No stickers uploaded yet. Click "Upload Stickers" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default StickerLibrary;