import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini Client
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is missing.');
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return ai;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API 1: AI Food Recognition & Nutrition Extraction
  app.post('/api/recognize-food', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', foodHint, userProfile } = req.body;

      let client: GoogleGenAI;
      try {
        client = getGeminiClient();
      } catch (err: any) {
        return res.status(500).json({
          error: 'Gemini API is not configured. Please ensure GEMINI_API_KEY is available in Settings > Secrets.',
          details: err.message,
        });
      }

      const prompt = `你是一位拥有丰富营养学和中国及国际餐饮知识的资深营养师与AI食物检测系统。
请严格分析给出的食物图片（或食物描述：${foodHint || '请直接识别图片中的菜品'}）。
结合用户的健康画像（目标：${userProfile?.goal || '减脂/健康'}，过敏原：${userProfile?.allergies?.join(',') || '无'}，偏好：${userProfile?.dietaryPreferences?.join(',') || '均衡'}）。

请输出严格的 JSON 格式数据，包含以下字段：
- name: 菜品名称（如：宫保鸡丁、全麦三明治、清蒸鲈鱼等）
- category: 分类及烹饪方式（如：经典川菜 · 炒制、西式轻食 · 现制、新鲜水果 · 鲜切）
- confidence: 识别置信度整数百分比（如 85, 92, 98）
- minWeight: 建议估计分量下限（克，如 180）
- maxWeight: 建议估计分量上限（克，如 220）
- currentWeight: 预估单份重量（克，如 200 或 300）
- calories: 预估单份热量（kcal 整数，如 520）
- servingSize: 分量描述（如：一份 (约 300g)）
- dailyPercent: 占普通成人每日推荐摄入能量的百分比（如 26, 65 等）
- protein: 蛋白质含量（克）
- fat: 脂肪含量（克）
- carbs: 碳水化合物含量（克）
- fiber: 膳食纤维（克）
- sodium: 钠含量（毫克 mg）
- sugar: 糖分含量（克）
- saltiness: 口感咸度评估（0-100，如 70 偏咸，20 清淡）
- spiciness: 口感辣度评估（0-100，如 60 中辣，0 不辣）
- sweetness: 口感甜度评估（0-100，如 30 微甜）
- additiveRisk: 加工过程添加剂风险（'low' | 'medium' | 'high'）
- additiveRiskLabel: 添加剂风险简评（如 '低风险'、'天然无添加'、'中风险(含复合调味料)'）
- allergens: 过敏原警示列表（如 ["含花生", "含大豆 (酱油)", "含麸质谷物"]，若无则为空数组）
- nutritionistAdvice: 专属营养师建议（1-2句亲切有指导意义的中文建议，例如针对热量、纳、油脂、搭配建议）`;

      const parts: any[] = [];
      if (imageBase64) {
        // Strip data URI header if present
        const cleanedBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanedBase64,
          },
        });
      }
      parts.push({ text: prompt });

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              confidence: { type: Type.INTEGER },
              minWeight: { type: Type.INTEGER },
              maxWeight: { type: Type.INTEGER },
              currentWeight: { type: Type.INTEGER },
              calories: { type: Type.INTEGER },
              servingSize: { type: Type.STRING },
              dailyPercent: { type: Type.INTEGER },
              protein: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
              sodium: { type: Type.NUMBER },
              sugar: { type: Type.NUMBER },
              saltiness: { type: Type.INTEGER },
              spiciness: { type: Type.INTEGER },
              sweetness: { type: Type.INTEGER },
              additiveRisk: { type: Type.STRING },
              additiveRiskLabel: { type: Type.STRING },
              allergens: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nutritionistAdvice: { type: Type.STRING },
            },
            required: [
              'name',
              'category',
              'confidence',
              'calories',
              'protein',
              'fat',
              'carbs',
              'saltiness',
              'spiciness',
              'sweetness',
              'additiveRisk',
              'additiveRiskLabel',
              'allergens',
              'nutritionistAdvice',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from AI model');
      }

      const parsedData = JSON.parse(text);
      res.json({
        success: true,
        data: {
          ...parsedData,
          id: 'ai_' + Date.now(),
        },
      });
    } catch (error: any) {
      console.error('Error in /api/recognize-food:', error);
      res.status(500).json({
        success: false,
        error: error.message || '识别分析失败，请重试',
      });
    }
  });

  // API 2: Personalized Nutritionist Chat / Advice
  app.post('/api/nutritionist-advice', async (req, res) => {
    try {
      const { foodName, userProfile, currentIntake, targetCalories } = req.body;
      const client = getGeminiClient();

      const prompt = `你是用户的专属高级注册临床营养师。
用户刚刚查看或记录了食物：${foodName || '今日餐食'}。
用户画像：
- 性别：${userProfile?.gender === 'female' ? '女' : '男'}，年龄：${userProfile?.age || 25}岁，身高：${userProfile?.height || 175}cm，体重：${userProfile?.weight || 68}kg
- 目标：${userProfile?.goal === 'lose_fat' ? '减脂塑形' : userProfile?.goal === 'gain_muscle' ? '增肌增重' : '维持健康'}
- 今日已摄入：${currentIntake || 1200} kcal / 目标：${targetCalories || 2000} kcal
- 偏好及过敏：${userProfile?.dietaryPreferences?.join(',') || '无特殊'}，过敏：${userProfile?.allergies?.join(',') || '无'}

请提供一段亲切、科学、极具实操性的饮食营养点评与下一餐搭配建议（150字以内）。`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        advice: response.text?.trim() || '保持营养均衡，适量摄入优质蛋白和高纤维蔬菜！',
      });
    } catch (error: any) {
      console.error('Error in /api/nutritionist-advice:', error);
      res.status(500).json({
        success: false,
        advice: '这道菜热量适中，但钠含量偏高，建议今天晚餐少放盐，多补充一些绿叶蔬菜。',
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
