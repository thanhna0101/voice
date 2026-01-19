import React, { useState, useRef, useEffect } from 'react';
import { VoiceControls } from './components/VoiceControls';
import { TextInput } from './components/TextInput';
import { generateSpeechFromText } from './services/geminiService';
import { Gender, GenerationState } from './types';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    audioUrl: null,
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setState(prev => ({ ...prev, error: "Vui lòng nhập nội dung văn bản." }));
      return;
    }

    setState({ isLoading: true, error: null, audioUrl: null });

    try {
      const url = await generateSpeechFromText(text, gender);
      setState({ isLoading: false, error: null, audioUrl: url });
    } catch (err: any) {
      setState({ isLoading: false, error: err.message, audioUrl: null });
    }
  };

  // Auto-play when audio is ready
  useEffect(() => {
    if (state.audioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Auto-play prevented by browser policy", e));
    }
  }, [state.audioUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
      
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[800px]">
        
        {/* Left Panel: Inputs */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-8 border-b md:border-b-0 md:border-r border-white/5 bg-white/5">
          
          <header>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              VietVoice AI
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Chuyển đổi văn bản thành giọng nói Tiếng Việt tự nhiên với Google Gemini 2.5 Flash.
            </p>
          </header>

          <VoiceControls 
            selectedGender={gender} 
            onChange={setGender} 
            disabled={state.isLoading}
          />

          <div className="flex-1 min-h-[200px]">
            <TextInput 
              value={text} 
              onChange={setText} 
              disabled={state.isLoading}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={state.isLoading || !text.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              state.isLoading || !text.trim()
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 hover:scale-[1.02]'
            }`}
          >
            {state.isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Chuyển Đổi (Convert)</span>
              </>
            )}
          </button>
          
          {state.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2 items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {state.error}
            </div>
          )}
        </div>

        {/* Right Panel: Visualization / Result */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden bg-black/20">
          
          {/* Abstract Visual Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
             <div className="w-64 h-64 bg-indigo-600 rounded-full blur-[100px] animate-pulse"></div>
             <div className="w-48 h-48 bg-purple-600 rounded-full blur-[80px] absolute top-1/4 right-1/4 animate-pulse delay-75"></div>
          </div>

          <div className="z-10 w-full max-w-sm flex flex-col items-center gap-8">
            
            {/* Status Indicator */}
            <div className={`transition-all duration-500 ${state.audioUrl ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale'}`}>
              <div className="w-48 h-48 rounded-full border-4 border-slate-700 flex items-center justify-center bg-slate-900 shadow-2xl relative">
                {state.isLoading && (
                  <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin"></div>
                )}
                <div className="text-6xl">
                  {state.isLoading ? '🎙️' : state.audioUrl ? '🔊' : '💬'}
                </div>
              </div>
            </div>

            {/* Audio Player */}
            {state.audioUrl ? (
              <div className="w-full bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl animate-fade-in-up">
                <audio 
                  ref={audioRef}
                  controls 
                  src={state.audioUrl} 
                  className="w-full h-10 accent-indigo-500"
                />
                <div className="flex justify-between mt-3 px-1">
                   <a 
                    href={state.audioUrl} 
                    download={`vietvoice-${new Date().getTime()}.wav`}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống (Download WAV)
                  </a>
                  <span className="text-xs text-slate-500">24kHz • Mono</span>
                </div>
              </div>
            ) : (
               <div className="text-center text-slate-500">
                <p className="mb-2">Kết quả âm thanh sẽ hiện ở đây.</p>
                <p className="text-xs opacity-60">Sẵn sàng chuyển đổi.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
