import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const analyzeLogic = async (text: string): Promise<AnalysisResult> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please add it to your secrets.");
  }

  const prompt = `
    당신은 논리 작법 및 수사학 전문가이자 교육 공학용 AI인 'LogicLens AI'입니다.
    사용자가 입력한 다음 텍스트(발표 대본, 주장문, 보고서 등)를 분석하여 논리의 허점을 찾아내고 설득력을 높일 수 있는 피드백을 제공하세요.

    텍스트: "${text}"

    반드시 다음의 JSON 구조로만 응답하세요:
    {
      "summary": "전체적인 분석 요약 (전문적이고 친절한 멘토 톤)",
      "score": 0-100 사이의 설득력 점수,
      "logic_map": [
        {
          "stage": "서론/본론1/본론2/결론 등",
          "content": "해당 단계의 핵심 내용",
          "connectionAnalysis": "논리적 연결성 분석",
          "isLogical": true/false
        }
      ],
      "balance": {
        "logos": 논리 비중(%),
        "pathos": 감정 비중(%),
        "ethos": 신뢰/윤리 비중(%)
      },
      "suggestions": ["논리적 설득력을 높이기 위한 구체적인 제안"],
      "grammar_fixes": ["틀린 띄어쓰기나 문법 오류 지적 및 교정 제안 (예: '띄어쓰기' -> '띄어 쓰기'로 수정하세요)"],
      "speech_script": "재작성된 구어체 대본"
    }

    분석 가이드라인:
    1. Logic Map: 주장과 근거 사이의 개연성을 엄격히 따지세요.
    2. Persuasion Score: 논리적 비약, 근거의 구체성, 연결성을 기준으로 산출하세요.
    3. Grammar: 텍스트 전체의 맞춤법, 띄어쓰기, 어색한 문장 성분 호응을 정밀하게 검사하여 구체적으로 지적하세요.
    4. Tone: 전문적이면서도 학생의 성장을 돕는 친절한 멘토링 스타일.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text || "";
    return JSON.parse(jsonText.trim()) as AnalysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};
