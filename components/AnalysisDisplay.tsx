import React from 'react';
import { AnalysisResult, Viewpoint } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { UserIcon, CheckCircleIcon } from './Icons';

interface AnalysisDisplayProps {
  data: AnalysisResult;
}

const SentimentBadge: React.FC<{ score: number }> = ({ score }) => {
  let color = 'bg-gray-500';
  let text = '中立';
  
  if (score >= 70) {
    color = 'bg-green-500';
    text = '积极';
  } else if (score <= 30) {
    color = 'bg-brand-500';
    text = '消极';
  } else {
    color = 'bg-yellow-500';
    text = '中立';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${color} bg-opacity-80`}>
      {text} {score}%
    </span>
  );
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-surface border border-dark-border p-2 rounded shadow-xl text-xs text-white">
        <p>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data }) => {
  const sentimentData = [
    { name: '正面', value: data.overallSentiment, color: '#22c55e' },
    { name: '负面', value: 100 - data.overallSentiment, color: '#ef4444' },
  ];

  const viewpointData = data.viewpoints.map((vp, idx) => ({
    name: `观点 ${idx + 1}`,
    score: vp.sentiment,
  }));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Section */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pr-10 leading-tight">
          {data.videoTitle || '未命名视频分析'}
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {data.topics.map((topic, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-dark-bg border border-dark-border text-xs text-gray-300">
              #{topic}
            </span>
          ))}
        </div>

        <div className="bg-dark-bg/50 rounded-xl p-5 border-l-4 border-brand-500">
          <h3 className="text-sm font-semibold text-brand-400 mb-2 uppercase tracking-wider">内容摘要</h3>
          <p className="text-gray-200 leading-relaxed text-base md:text-lg">
            {data.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Viewpoints */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center space-x-2 mb-2">
             <div className="h-6 w-1 bg-brand-500 rounded-full"></div>
             <h3 className="text-xl font-bold text-white">核心观点详情</h3>
           </div>
           
           <div className="space-y-4">
             {data.viewpoints.map((vp, idx) => (
               <div key={idx} className="bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-brand-500/50 transition duration-300 group">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center space-x-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-dark-bg text-brand-500 text-xs font-bold border border-dark-border group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <h4 className="text-lg font-semibold text-white">{vp.title}</h4>
                   </div>
                   <SentimentBadge score={vp.sentiment} />
                 </div>
                 <p className="text-dark-subtext text-sm md:text-base leading-relaxed pl-8 mb-3">
                   {vp.description}
                 </p>
                 {vp.speaker && (
                   <div className="flex items-center space-x-1 pl-8 text-xs text-gray-500">
                      <UserIcon />
                      <span>{vp.speaker}</span>
                   </div>
                 )}
               </div>
             ))}
           </div>

            {/* Conclusion */}
            <div className="mt-8 bg-gradient-to-br from-gray-900 to-dark-surface border border-dark-border rounded-xl p-6 relative">
              <div className="absolute top-4 right-4 text-green-500 opacity-20">
                <CheckCircleIcon />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">总结与启示</h3>
              <p className="text-gray-300 leading-relaxed italic">
                “{data.conclusion}”
              </p>
            </div>
        </div>

        {/* Sidebar: Analytics */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Overall Sentiment Chart */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 w-full text-left">整体情感倾向</h3>
            <div className="h-48 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                  <span className="text-3xl font-bold text-white">{data.overallSentiment}</span>
                  <span className="text-xs text-gray-500 block">综合得分</span>
               </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">基于 AI 对所有论点的情感加权分析</p>
          </div>

          {/* Viewpoints Score Bar Chart */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">观点倾向分布</h3>
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={viewpointData} layout="vertical" barSize={12}>
                   <XAxis type="number" hide domain={[0, 100]} />
                   <YAxis type="category" dataKey="name" tick={{fontSize: 10, fill: '#888'}} width={40} axisLine={false} tickLine={false} />
                   <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                   <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                     {viewpointData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.score > 50 ? '#22c55e' : '#ef4444'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Tips */}
          <div className="bg-dark-bg border border-dark-border rounded-xl p-4">
            <h4 className="text-xs font-bold text-gray-400 mb-2">💡 分析说明</h4>
            <p className="text-xs text-gray-500 leading-normal">
              本报告由 Gemini AI 生成，基于网络公开信息和视频元数据。对于超长视频，分析可能基于视频摘要或相关评论。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
