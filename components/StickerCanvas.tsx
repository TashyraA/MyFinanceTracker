import { useState, useRef, useEffect } from 'react';
import { PlacedSticker, CustomSticker } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, RotateCw, ZoomIn, ZoomOut, MoveUp, MoveDown, X } from 'lucide-react';

interface StickerCanvasProps {
  month: string;
  placedStickers: PlacedSticker[];
  onUpdate: (stickers: PlacedSticker[]) => void;
  selectedSticker: CustomSticker | null;
  onStickerPlaced: () => void;
  children: React.ReactNode;
}

const StickerCanvas = ({ month, placedStickers, onUpdate, selectedSticker, onStickerPlaced, children }: StickerCanvasProps) => {
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);


  const safeStickers = Array.isArray(placedStickers) ? placedStickers : [];
  const monthStickers = safeStickers.filter(s => s && s.month === month);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!selectedSticker || isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const maxZIndex = monthStickers.length > 0 ? Math.max(...monthStickers.map(s => s.zIndex || 0)) : 0;

    const newSticker: PlacedSticker = {
      id: uuidv4(),
      stickerId: selectedSticker.id,
      src: selectedSticker.imageUrl,
      x: Math.max(0, Math.min(95, x)),
      y: Math.max(0, Math.min(95, y)),
      scale: 1,
      rotation: 0,
      zIndex: maxZIndex + 1,
      month,
    };

    const updatedStickers = [...safeStickers, newSticker];
    onUpdate(updatedStickers);
    onStickerPlaced();
  };

  const handleStickerMouseDown = (e: React.MouseEvent, sticker: PlacedSticker) => {
    e.stopPropagation();
    if (sticker.locked) return; // prevent interaction if locked
    setActiveStickerId(sticker.id);
    setIsDragging(true);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      x: e.clientX - (rect.left + (sticker.x / 100) * rect.width),
      y: e.clientY - (rect.top + (sticker.y / 100) * rect.height),
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !activeStickerId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

    const updatedStickers = safeStickers.map(s =>
      s.id === activeStickerId
        ? { ...s, x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) }
        : s
    );
    onUpdate(updatedStickers);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, activeStickerId, dragOffset]);

  const handleRotate = (id: string, delta: number) => {
    const updatedStickers = safeStickers.map(s =>
      s.id === id ? { ...s, rotation: ((s.rotation || 0) + delta) % 360 } : s
    );
    onUpdate(updatedStickers);
  };

  const handleScale = (id: string, delta: number) => {
    const updatedStickers = safeStickers.map(s =>
      s.id === id ? { ...s, scale: Math.max(0.3, Math.min(3, (s.scale || 1) + delta)) } : s
    );
    onUpdate(updatedStickers);
  };

  const handleDelete = (id: string) => {
    const updatedStickers = safeStickers.filter(s => s.id !== id);
    onUpdate(updatedStickers);
    setActiveStickerId(null);
  };

  const handleBringToFront = (id: string) => {
    const maxZIndex = Math.max(...monthStickers.map(s => s.zIndex || 0));
    const updatedStickers = safeStickers.map(s =>
      s.id === id ? { ...s, zIndex: maxZIndex + 1 } : s
    );
    onUpdate(updatedStickers);
  };

  const handleSendToBack = (id: string) => {
    const minZIndex = Math.min(...monthStickers.map(s => s.zIndex || 0));
    const updatedStickers = safeStickers.map(s =>
      s.id === id ? { ...s, zIndex: minZIndex - 1 } : s
    );
    onUpdate(updatedStickers);
  };

  const renderStickers = () => {
    return (
      <>
        {monthStickers
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map((sticker) => {
            if (!sticker || !sticker.src) return null;

            return (
              <div
                key={sticker.id}
                className={`absolute cursor-move select-none ${activeStickerId === sticker.id ? 'ring-2 ring-coquette-pastel' : ''}`}
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) scale(${sticker.scale || 1}) rotate(${sticker.rotation || 0}deg)`,
                  zIndex: 1000 + (sticker.zIndex || 0),
                  width: '80px',
                  height: '80px',
                  pointerEvents: 'auto',
                }}
                onMouseDown={(e) => handleStickerMouseDown(e, sticker)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStickerId(sticker.id);
                }}
              >
                <img
                  src={sticker.src}
                  alt="Sticker"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />

                {activeStickerId === sticker.id && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg p-1 border-2 border-coquette-pastel">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRotate(sticker.id, -15);
                      }}
                      className="p-1 hover:bg-coquette-cream rounded"
                      title="Rotate left"
                    >
                      <RotateCw size={14} className="transform -scale-x-100" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRotate(sticker.id, 15);
                      }}
                      className="p-1 hover:bg-coquette-cream rounded"
                      title="Rotate right"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScale(sticker.id, -0.2);
                      }}
                      className="p-1 hover:bg-coquette-cream rounded"
                      title="Shrink"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScale(sticker.id, 0.2);
                      }}
                      className="p-1 hover:bg-coquette-cream rounded"
                      title="Enlarge"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBringToFront(sticker.id);
                      }}
                      className="p-1 hover:bg-coquette-cream rounded"
                      title="Bring to front"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendToBack(sticker.id);
                      }}
                      className="p-1 hover:bg-coquette-cream rounded"
                      title="Send to back"
                    >
                      <MoveDown size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(sticker.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = safeStickers.map(s => s.id === sticker.id ? { ...s, locked: !s.locked } : s);
                        onUpdate(updated);
                      }}
                      className={`p-1 rounded ${sticker.locked ? 'bg-yellow-400 text-white' : 'hover:bg-coquette-cream'}`}
                      title={sticker.locked ? 'Unlock sticker' : 'Lock sticker'}
                    >
                      {sticker.locked ? '🔒' : '🔓'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

        {selectedSticker && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-coquette-pastel text-white px-4 py-2 rounded-lg shadow-lg z-[10001] flex items-center gap-2">
            <img 
              src={selectedSticker.imageUrl} 
              alt="" 
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm">Click anywhere to place sticker</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStickerPlaced();
              }}
              className="ml-2 hover:bg-white/20 rounded p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      className={`relative ${selectedSticker ? 'cursor-crosshair' : ''}`}
    >
      {children}
      {renderStickers()}
    </div>
  );
};

export default StickerCanvas;