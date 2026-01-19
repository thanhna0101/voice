import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Nội dung (Text Content)
        </label>
        <span className="text-xs text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded">
          Dòng 1: Yêu cầu chất giọng (Bắc, Trung, Nam...)
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`Ví dụ:\nGiọng Hà Nội trầm ấm, truyền cảm\nXin chào, đây là một ứng dụng chuyển đổi văn bản thành giọng nói tuyệt vời.`}
        className="flex-1 w-full bg-slate-800/50 border border-slate-700 text-slate-100 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none placeholder-slate-600 font-mono text-base leading-relaxed transition-all"
        spellCheck={false}
      />
    </div>
  );
};
