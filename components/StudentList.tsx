
import React, { useState } from 'react';
import { Trash2, UserPlus, FileText } from 'lucide-react';
import { Student } from '../types';

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const StudentList: React.FC<Props> = ({ students, setStudents }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newNames = inputValue
      .split('\n')
      .map(n => n.trim())
      .filter(n => n !== "");
    
    const newStudents = newNames.map((name, index) => ({
      id: Date.now() + index,
      name
    }));

    setStudents([...students, ...newStudents]);
    setInputValue('');
  };

  const removeStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const names = text.split('\n').map(n => n.trim()).filter(n => n !== "");
        const newStudents = names.map((name, index) => ({
          id: Date.now() + index,
          name
        }));
        setStudents(prev => [...prev, ...newStudents]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Dán hoặc nhập danh sách tên (mỗi dòng một tên)..."
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
        />
        <button
          onClick={handleAdd}
          className="mt-2 w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          Thêm vào danh sách
        </button>
      </div>

      <div className="flex items-center gap-2 text-gray-400 py-2">
        <div className="flex-1 h-[1px] bg-gray-200"></div>
        <span className="text-xs uppercase font-bold tracking-widest">Hoặc</span>
        <div className="flex-1 h-[1px] bg-gray-200"></div>
      </div>

      <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600 font-medium">
        <FileText size={18} className="text-blue-500" />
        Tải file .txt / .csv
        <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
      </label>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        {students.map((student, index) => (
          <div
            key={student.id}
            className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700">{student.name}</span>
            </div>
            <button
              onClick={() => removeStudent(student.id)}
              className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-center py-8 text-gray-400 italic text-sm">
            Danh sách đang trống
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
