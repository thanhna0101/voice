import React from 'react';
import { Gender } from '../types';

interface VoiceControlsProps {
  selectedGender: Gender;
  onChange: (gender: Gender) => void;
  disabled?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({ selectedGender, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Chọn Giọng Đọc (Voice)
      </label>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange(Gender.MALE)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
            selectedGender === Gender.MALE
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-semibold">Nam (Male)</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(Gender.FEMALE)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
            selectedGender === Gender.FEMALE
              ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/30'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-semibold">Nữ (Female)</span>
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        *Giọng nam sử dụng mô hình <strong>Puck</strong>, giọng nữ sử dụng mô hình <strong>Kore</strong>.
      </p>
    </div>
  );
};
