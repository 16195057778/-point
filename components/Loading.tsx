import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-dark-border rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500 rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-brand-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium text-white">正在深度分析视频内容...</h3>
        <p className="text-dark-subtext text-sm">Gemini Pro 正在通过 Google Search 检索相关论点与摘要<br/>长视频可能需要 30 秒左右，请耐心等待</p>
      </div>
    </div>
  );
};

export default Loading;
