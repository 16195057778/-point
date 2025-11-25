import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to simulate delay if needed, but we rely on API response
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeVideo = async (url: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("未检测到 API KEY，请确保环境配置正确。");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    请你作为一个专业的视频内容分析师，利用 Google Search 工具查找并分析以下 YouTube 视频的内容：${url}
    
    该视频可能是一个长视频（约1小时），请尽力查找相关的文字记录、摘要、评论或新闻报道来重构视频的核心观点。
    
    请输出严格的 JSON 格式，不要包含 Markdown 代码块标记（如 \`\`\`json），直接返回 JSON 对象。
    
    JSON 结构要求如下：
    {
      "videoTitle": "视频标题（如果找不到请根据内容推测）",
      "summary": "视频内容的简明摘要（200字以内）",
      "viewpoints": [
        {
          "title": "核心论点标题",
          "description": "该论点的详细解释",
          "sentiment": 75, // 该论点的情感倾向打分，0为极度负面，100为极度正面，50为中立
          "speaker": "发言人姓名（如果不可考则留空）"
        }
      ],
      "conclusion": "视频的总结性结论或主要启示",
      "overallSentiment": 60, // 视频整体情感基调打分
      "topics": ["话题标签1", "话题标签2"] // 3-5个相关话题
    }

    如果无法通过搜索获取特定视频的详细信息，请基于你已有的知识库对该链接（如果链接包含标题信息）或搜索到的相关背景进行最合理的分析。
    语言必须为：简体中文。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Use a model capable of complex reasoning and search
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        // Schema definition helps structure the output even with search tools
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            viewpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  sentiment: { type: Type.NUMBER },
                  speaker: { type: Type.STRING, nullable: true },
                },
                required: ["title", "description", "sentiment"],
              },
            },
            conclusion: { type: Type.STRING },
            overallSentiment: { type: Type.NUMBER },
            topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["videoTitle", "summary", "viewpoints", "conclusion", "overallSentiment", "topics"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("模型未返回任何内容。");
    }

    // Clean up potential markdown formatting if the model ignores instruction (rare but possible)
    const jsonStr = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    return JSON.parse(jsonStr) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("分析失败，可能是无法访问该视频信息或 API 限制。请稍后重试。");
  }
};
