import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type PlannerCoverProps = {
  title?: string;
  isModal?: boolean;
  onClose?: () => void;
};

const PlannerCover: React.FC<PlannerCoverProps> = ({ title = '2025 Planner', isModal = false, onClose }) => {
  const navigate = useNavigate();
  const [isOpening, setIsOpening] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const Container: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    if (isModal) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          {children}
        </div>
      );
    }
    return <div className="flex items-center justify-center min-h-screen p-6">{children}</div>;
  };

  const openNotebook = () => {
    setIsOpening(true);
    if (onClose) onClose();
    // After animation finishes navigate to finance tracker (/)
    setTimeout(() => navigate('/'), 700);
  };

  // Public path for a user-supplied PNG. Place your PNG in the project's `public/` folder as `planner-cover.png`.
  const coverImageUrl = '/planner-cover.png';

  return (
    <Container>
      <div ref={wrapperRef} className="relative flex items-center justify-center">
        {/* Gold spiral binding (SVG) */}
        <div className="absolute left-6 top-12 bottom-12 z-30 pointer-events-none">
          <svg width="56" height="760" viewBox="0 0 56 760" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 18 }).map((_, i) => {
              const y = 18 + i * 40;
              return (
                <ellipse
                  key={i}
                  cx={28}
                  cy={y}
                  rx={9}
                  ry={6}
                  fill="#D4AF37"
                  stroke="#b88f2a"
                  strokeWidth={1}
                  opacity={0.98}
                />
              );
            })}
          </svg>
        </div>

        {/* Binder rings overlay */}
        <div className="absolute left-2 top-28 z-40 pointer-events-none">
          <svg width="36" height="220" viewBox="0 0 36 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 16 + i * 34;
              return (
                <g key={i} transform={`translate(8, ${y})`}>
                  <rect x={-6} y={-6} width={12} height={12} rx={3} fill="#b88f2a" opacity={0.95} />
                  <circle cx={0} cy={0} r={4} fill="#fff7d9" opacity={0.95} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Notebook container - fixed notebook dimensions */}
        <div className="w-[720px] h-[920px] relative perspective-1500">
          {/* back page (visible after flip) */}
          <div className={`absolute inset-0 rounded-2xl shadow-inner bg-white transition-opacity duration-500 ${isOpening ? 'opacity-100' : 'opacity-0'}`} />

          {/* front cover (brown) */}
          <div
            className={`absolute inset-0 rounded-2xl overflow-hidden transform-origin-left transition-transform duration-700 ease-in-out ${isOpening ? 'rotate-y-[-180deg] translate-x-6' : 'rotate-y-0'}`}
            style={{ transformStyle: 'preserve-3d' as any }}
          >
            <div
              className="absolute inset-0 border border-[#53361f] shadow-2xl flex flex-col items-center justify-center p-10 text-white"
              style={{
                backfaceVisibility: 'hidden',
                backgroundImage: `url(${coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Brown overlay so text stays readable on top of user image */}
              <div className="absolute inset-0 bg-[#6b4728] opacity-70 pointer-events-none" />
              {isModal && (
                <button
                  aria-label="Close cover"
                  onClick={() => onClose && onClose()}
                  className="absolute top-4 right-4 text-white/90 hover:text-white"
                >
                  ✕
                </button>
              )}
              <h1 className="text-5xl font-serif leading-tight">{title}</h1>
              <p className="mt-3 text-white/90">A cozy, intentional space for your plans.</p>
              <button
                onClick={() => {
                  // If an onClose handler is provided (modal), dismiss the cover to reveal underlying dashboard.
                  if (onClose) {
                    // start a brief visual opening then close
                    setIsOpening(true);
                    setTimeout(() => onClose && onClose(), 450);
                    return;
                  }
                  // fallback: navigate to root
                  openNotebook();
                }}
                className="mt-8 px-6 py-3 rounded-md bg-[#3f2b20] text-white font-semibold shadow hover:bg-[#342018] transition"
              >
                Open
              </button>
            </div>

            {/* inner page (the content) - positioned behind the cover */}
            <div className="absolute inset-0 bg-white rounded-2xl p-8 transform translate-x-2 translate-y-1" style={{ backfaceVisibility: 'hidden' }}>
              <div className={`${isOpening ? 'opacity-100 transition-opacity duration-700 delay-300' : 'opacity-0'}`}>
                <h2 className="text-2xl text-[#4b2e1a] mb-4">Welcome to your planner</h2>
                <p className="text-[#6b4728] mb-6">Open your finance tracker to view monthly lists and notes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PlannerCover;
