
import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, Trash2, Edit3, Settings, Users, Eye, Sparkles } from 'lucide-react';
import { TagConfig, Student, DEFAULT_CONFIG } from './types';
import StudentList from './components/StudentList';
import PreviewCard from './components/PreviewCard';
import SettingsPanel from './components/SettingsPanel';
import { generatePDF } from './services/pdfGenerator';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [background, setBackground] = useState<string | null>(null);
  const [config, setConfig] = useState<TagConfig>(DEFAULT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackground(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = async () => {
    if (students.length === 0 || !background) {
      alert("Vui lòng nhập danh sách học sinh và tải lên ảnh nền!");
      return;
    }
    setIsGenerating(true);
    try {
      await generatePDF(students, background, config);
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tạo PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanNamesWithAI = async () => {
    if (students.length === 0) return;
    setIsCleaning(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const studentNames = students.map(s => s.name).join('\n');
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Hãy chuẩn hóa danh sách tên học sinh sau đây: viết hoa chữ cái đầu, xóa khoảng trắng thừa, mỗi tên một dòng. Chỉ trả về danh sách tên, không thêm lời giải thích nào khác.\n\n${studentNames}`
      });

      const cleanedText = response.text || "";
      const cleanedNames = cleanedText.split('\n').filter(n => n.trim() !== "");
      setStudents(cleanedNames.map((name, index) => ({ id: Date.now() + index, name: name.trim() })));
    } catch (error) {
      console.error("AI Error:", error);
      alert("Không thể chuẩn hóa tên bằng AI. Hãy kiểm tra kết nối mạng.");
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 px-4 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <Edit3 className="text-blue-600 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Trình Tạo Bảng Tên Học Sinh</h1>
              <p className="text-blue-100 text-sm">Thiết kế đẹp - In ấn dễ dàng - Tiết kiệm thời gian</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating || students.length === 0 || !background}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md transition-all ${
              isGenerating || students.length === 0 || !background
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 text-blue-900 hover:bg-yellow-300 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                Đang tạo file...
              </span>
            ) : (
              <>
                <Download size={20} />
                Tải file danh sách (PDF - A4)
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Student List */}
        <section className="lg:col-span-4 bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-blue-100">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Users size={20} />
              Danh sách học sinh
            </h2>
            <button
              onClick={cleanNamesWithAI}
              disabled={isCleaning || students.length === 0}
              className="text-xs bg-white text-blue-600 px-2 py-1 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
              title="Dùng AI để chuẩn hóa tên"
            >
              <Sparkles size={14} />
              {isCleaning ? 'Đang xử lý...' : 'Chuẩn hóa'}
            </button>
          </div>
          <div className="p-6">
            <StudentList students={students} setStudents={setStudents} />
          </div>
        </section>

        {/* Right Column: Preview & Settings */}
        <section className="lg:col-span-8 flex flex-col gap-8">
          {/* Preview Area */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-100 relative min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Eye size={20} />
                Xem trước bảng tên
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-sm text-sm font-semibold"
              >
                <Upload size={18} />
                Tải mẫu nền lên
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundUpload}
              />
            </div>

            <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200">
              <PreviewCard 
                background={background} 
                studentName={students[0]?.name || "HỌ VÀ TÊN HỌC SINH"} 
                config={config}
              />
            </div>
            {!background && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl pointer-events-none">
                <p className="text-gray-500 italic">Hãy tải lên một tấm ảnh nền để bắt đầu</p>
              </div>
            )}
          </div>

          {/* Settings Area */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-green-100">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                <Settings size={20} />
                Cấu hình định dạng
              </h2>
            </div>
            <div className="p-6">
              <SettingsPanel config={config} setConfig={setConfig} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 text-center text-gray-500 text-sm">
        <p>© 2024 Trình Tạo Bảng Tên - Công cụ hỗ trợ giáo dục thông minh</p>
        <p className="mt-1">Mỗi trang A4 tự động chứa 5 bảng tên chuẩn in ấn.</p>
      </footer>
    </div>
  );
};

export default App;
