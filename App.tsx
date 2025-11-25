import React, { useState } from 'react';
import VideoInput from './components/VideoInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loading from './components/Loading';
import { analyzeVideo } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { PlayIcon } from './components/Icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAnalyze = async (url: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);
    setErrorMsg('');

    try {
      const data = await analyzeVideo(url);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '发生未知错误，请重试');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text selection:bg-brand-500 selection:text-white flex flex-col">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-900 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Navbar */}
      <header className="border-b border-dark-border/50 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-gradient-to-br from-brand-500 to-purple-600 p-2 rounded-lg text-white">
               <PlayIcon />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              View<span className="text-brand-500">point</span>
            </span>
          </div>
          
          <div className="hidden sm:block">
            <span className="text-xs font-medium px-3 py-1 bg-dark-surface border border-dark-border rounded-full text-gray-400">
               v1.0 • Gemini 3 Pro
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section (only visible when IDLE) */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center max-w-2xl mx-auto mb-12 animate-[fadeIn_0.8s_ease-out]">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 tracking-tight">
              YouTube 长视频<br/>深度观点解析
            </h1>
            <p className="text-lg text-dark-subtext mb-10 leading-relaxed">
              没时间看1小时的视频？让 AI 为你提取核心论点、情感倾向和关键摘要。支持中文输出，助你快速获取信息精华。
            </p>
          </div>
        )}

        {/* Input Section (Always visible, but maybe smaller if has result? Keep it simple for now) */}
        {status !== AnalysisStatus.SUCCESS && (
            <div className={`w-full transition-all duration-500 ${status === AnalysisStatus.IDLE ? 'mb-12' : 'mb-8 opacity-50 pointer-events-none'}`}>
             <VideoInput onAnalyze={handleAnalyze} isLoading={status === AnalysisStatus.ANALYZING} />
            </div>
        )}

        {/* Loading State */}
        {status === AnalysisStatus.ANALYZING && <Loading />}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-2xl text-center text-red-200">
            <h3 className="text-lg font-bold mb-2">分析中断</h3>
            <p>{errorMsg}</p>
            <button 
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition"
            >
              重试
            </button>
          </div>
        )}

        {/* Success / Result State */}
        {status === AnalysisStatus.SUCCESS && result && (
          <div className="w-full">
            <div className="flex justify-center mb-8">
                <button 
                  onClick={() => setStatus(AnalysisStatus.IDLE)} 
                  className="text-sm text-dark-subtext hover:text-white underline underline-offset-4"
                >
                  ← 分析另一个视频
                </button>
            </div>
            <AnalysisDisplay data={result} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border mt-auto bg-dark-bg py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-dark-subtext text-sm">
          <p>© 2024 Viewpoint AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
