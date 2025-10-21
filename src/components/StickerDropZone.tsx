import { useState, useRef } from 'react';
import { X, Move } from 'lucide-react';
import { PlacedSticker } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface StickerDropZoneProps {
  children: React.ReactNode;
  month: string;
  placedStickers: PlacedSticker[];
  onUpdateStickers: (stickers: PlacedSticker[]) => void;
}

const StickerDropZone = ({ children, month, placedStickers, onUpdateStickers }: StickerDropZoneProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const monthStickers = placedStickers.filter(s => s.month === month);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const content = e.dataTransfer.getData('text/plain');
    const isImage = e.dataTransfer.getData('isImage') === 'true';

    if (!content) return;

    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newSticker: PlacedSticker = {
      id: uuidv4(),
      stickerId: uuidv4(),
      src: content,
      x: Math.max(0, Math.min(95, x)),
      y: Math.max(0, Math.min(95, y)),
      scale: 1,
      rotation: 0,
      zIndex: 0,
      month,
    };

    onUpdateStickers([...placedStickers, newSticker]);
  };

  const handleDeleteSticker = (id: string) => {
    onUpdateStickers(placedStickers.filter(s => s.id !== id));
  };

  const handleStickerDragStart = (e: React.MouseEvent, sticker: PlacedSticker) => {
    e.preventDefault();
    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingStickerId(sticker.id);
    setDragOffset({
      x: e.clientX - (rect.left + (sticker.x / 100) * rect.width),
      y: e.clientY - (rect.top + (sticker.y / 100) * rect.height),
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingStickerId) return;

    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

    onUpdateStickers(
      placedStickers.map(s =>
        s.id === draggingStickerId
          ? { ...s, x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) }
          : s
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingStickerId(null);
  };

  const handleResizeSticker = (id: string, delta: number) => {
    onUpdateStickers(
      placedStickers.map(s =>
        s.id === id ? { ...s, scale: Math.max(0.3, Math.min(3, s.scale + delta / 100)) } : s
      )
    );
  };

  return (
    <div
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative ${isDraggingOver ? 'ring-4 ring-coquette-pink ring-opacity-50' : ''}`}
    >
      {children}

      {/* Placed Stickers Overlay */}
      {monthStickers.map((sticker) => (
        <div
          key={sticker.id}
          className="absolute group cursor-move z-40"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            width: '80px',
            height: '80px',
            transform: `translate(-50%, -50%) scale(${sticker.scale})`,
          }}
          onMouseDown={(e) => handleStickerDragStart(e, sticker)}
        >
          <img
            src={sticker.src}
            alt="Sticker"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Controls */}
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={() => handleDeleteSticker(sticker.id)}
              className="bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X size={12} />
            </button>
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={() => handleResizeSticker(sticker.id, -10)}
              className="bg-coquette-pink text-white rounded px-2 py-0.5 text-xs shadow-lg hover:bg-coquette-rose"
              onMouseDown={(e) => e.stopPropagation()}
            >
              -
            </button>
            <button
              onClick={() => handleResizeSticker(sticker.id, 10)}
              className="bg-coquette-pink text-white rounded px-2 py-0.5 text-xs shadow-lg hover:bg-coquette-rose"
              onMouseDown={(e) => e.stopPropagation()}
            >
              +
            </button>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none">
            <Move size={16} className="text-coquette-pink drop-shadow-lg" />
          </div>
        </div>
      ))}

      {isDraggingOver && (
        <div className="absolute inset-0 bg-coquette-pink/10 pointer-events-none flex items-center justify-center z-30">
          <p className="text-coquette-darkBrown font-bold text-xl bg-white/90 px-6 py-3 rounded-lg shadow-lg">
            Drop sticker here! 🦋
          </p>
        </div>
      )}
    </div>
  );
};

export default StickerDropZone;