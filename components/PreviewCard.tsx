
import React, { useEffect, useRef } from 'react';
import { TagConfig } from '../types';

interface Props {
  background: string | null;
  studentName: string;
  config: TagConfig;
}

const PreviewCard: React.FC<Props> = ({ background, studentName, config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!background) {
      // Draw placeholder
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#d1d5db';
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      return;
    }

    const img = new Image();
    img.src = background;
    img.onload = () => {
      // Clear and draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Setup font
      const weight = config.fontWeight === 'bold' ? 'bold ' : '';
      ctx.font = `${weight}${config.fontSize}px ${config.fontFamily}`;
      ctx.fillStyle = config.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Transform text
      let displayText = studentName;
      if (config.textTransform === 'uppercase') displayText = displayText.toUpperCase();
      if (config.textTransform === 'capitalize') {
        displayText = displayText.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      }

      // Calculate position based on percentages
      const x = (canvas.width * config.xOffset) / 100;
      const y = (canvas.height * config.yOffset) / 100;

      ctx.fillText(displayText, x, y);
    };
  }, [background, studentName, config]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={600}
        height={250}
        className="max-w-full rounded-xl shadow-lg border border-gray-200"
      />
      <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Tỉ lệ mô phỏng bảng tên</span>
      </div>
    </div>
  );
};

export default PreviewCard;
