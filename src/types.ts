export interface LogicMapItem {
  stage: string;
  content: string;
  connectionAnalysis: string;
  isLogical: boolean;
}

export interface AnalysisResult {
  summary: string;
  score: number;
  logic_map: LogicMapItem[];
  balance: {
    logos: number;
    pathos: number;
    ethos: number;
  };
  suggestions: string[];
  grammar_fixes: string[];
  speech_script: string;
}

export interface AnalysisError {
  message: string;
}
