import React, { useState } from 'react';
import { SearchIcon, SparklesIcon } from './Icons';

interface VideoInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (input: string) => {
    // Simple YouTube URL validation
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    if (!validateUrl(url)) {
      setError('请输入有效的 YouTube 视频链接');
      return;
    }

    setError('');
    onAnalyze(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 ${isLoading ? 'animate-pulse' : ''}`}></div>
        <div className="relative flex items-center bg-dark-surface rounded-xl border border-dark-border p-2 shadow-2xl">
          <div className="pl-4 pr-3 text-dark-subtext">
             <SearchIcon />
          </div>
          <input
            type="text"
            className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none py-3 text-lg"
            placeholder="粘贴 YouTube 视频链接 (例如: https://youtu.be/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            className={`ml-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center space-x-2
              ${isLoading || !url 
                ? 'bg-dark-border cursor-not-allowed text-gray-400' 
                : 'bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-900/50 hover:shadow-brand-600/50'
              }`}
          >
            {isLoading ? (
               <span>分析中...</span>
            ) : (
               <>
                 <SparklesIcon />
                 <span>智能分析</span>
               </>
            )}
          </button>
        </div>
      </form>
      {error && (
        <p className="mt-3 text-brand-400 text-sm text-center animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default VideoInput;
