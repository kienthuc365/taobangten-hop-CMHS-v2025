
import React from 'react';
import { TagConfig, FONT_OPTIONS } from '../types';
import { Move, Type, Palette, Maximize } from 'lucide-react';

interface Props {
  config: TagConfig;
  setConfig: React.Dispatch<React.SetStateAction<TagConfig>>;
}

const SettingsPanel: React.FC<Props> = ({ config, setConfig }) => {
  const handleChange = (key: keyof TagConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Font & Style */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Type size={14} /> Font & Kiểu chữ
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Phông chữ</label>
            <select
              value={config.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-200"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Kích thước ({config.fontSize}px)</label>
            <input
              type="range"
              min="10"
              max="100"
              value={config.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Màu sắc</label>
            <div className="flex items-center gap-2 p-1 border border-gray-200 rounded-lg">
              <input
                type="color"
                value={config.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none p-0"
              />
              <span className="text-xs font-mono">{config.color}</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Định dạng</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('fontWeight', config.fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  config.fontWeight === 'bold' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                In Đậm
              </button>
              <button
                onClick={() => handleChange('textTransform', config.textTransform === 'uppercase' ? 'none' : 'uppercase')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  config.textTransform === 'uppercase' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                VIẾT HOA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Position */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Move size={14} /> Vị trí chữ trên bảng
        </h3>

        <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-500">Trục dọc (Y-Offset): {config.yOffset}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.yOffset}
              onChange={(e) => handleChange('yOffset', parseInt(e.target.value))}
              className="w-full accent-green-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-500">Trục ngang (X-Offset): {config.xOffset}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.xOffset}
              onChange={(e) => handleChange('xOffset', parseInt(e.target.value))}
              className="w-full accent-green-600"
            />
          </div>

          <div className="text-[10px] text-gray-400 italic">
            * Kéo thanh trượt để điều chỉnh tên học sinh vào đúng vị trí của khung nền.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
