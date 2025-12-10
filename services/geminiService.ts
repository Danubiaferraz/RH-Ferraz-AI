import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JobFormData, ResumeAnalysisResult, MarketAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

export const generateJobDescription = async (data: JobFormData): Promise<string> => {
  const prompt = `
    Atue como um especialista em RH Sênior. Crie uma descrição de vaga altamente atraente, profissional e objetiva.
    
    Detalhes da Vaga:
    - Título: ${data.title}
    - Departamento: ${data.department}
    - Senioridade: ${data.seniority}
    - Habilidades Obrigatórias: ${data.skills}
    - Tom de Voz: ${data.tone}

    A saída deve ser formatada em Markdown claro, contendo obrigatoriamente as seções:
    1. Título da Vaga
    2. Resumo da Missão
    3. Responsabilidades
    4. Requisitos Mínimos
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Erro ao gerar vaga:", error);
    throw error;
  }
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<ResumeAnalysisResult> => {
  const prompt = `
    Analise o seguinte currículo em relação à descrição da vaga fornecida.
    
    Descrição da Vaga:
    ${jobDescription}

    Texto do Currículo:
    ${resumeText}
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      matchScore: { type: Type.INTEGER, description: "Pontuação de adequação de 0 a 100" },
      strengths: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "Lista dos 3 maiores pontos fortes do candidato para esta vaga"
      },
      gaps: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "Lista dos 3 maiores gaps ou faltas do candidato"
      },
      summary: { type: Type.STRING, description: "Breve resumo da análise" }
    },
    required: ["matchScore", "strengths", "gaps", "summary"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("Sem resposta do modelo");
    return JSON.parse(text) as ResumeAnalysisResult;
  } catch (error) {
    console.error("Erro ao analisar currículo:", error);
    throw error;
  }
};

export const generateInterviewScript = async (title: string, skills: string): Promise<string> => {
  const prompt = `
    Crie um roteiro de entrevista estruturado para a vaga de "${title}".
    Habilidades Focais: ${skills}.

    O roteiro deve conter EXATAMENTE:
    1. 10 Perguntas Técnicas (focadas em hard skills e cenário real).
    2. 5 Perguntas Comportamentais no formato STAR (Situação, Tarefa, Ação, Resultado).

    Use uma linguagem profissional e encorajadora. Formate em Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Erro ao gerar entrevista.";
  } catch (error) {
    console.error("Erro ao gerar entrevista:", error);
    throw error;
  }
};

export const analyzeMarket = async (title: string, seniority: string): Promise<MarketAnalysisResult> => {
  const prompt = `
    Realize uma análise de mercado rápida para o cargo: ${title} (${seniority}).
    Estime a faixa salarial mensal média no Brasil e identifique competências raras.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      salaryRange: { type: Type.STRING, description: "Ex: R$ 5.000 - R$ 7.000" },
      currency: { type: Type.STRING, description: "Moeda utilizada (BRL)" },
      marketOutlook: { type: Type.STRING, description: "Breve frase sobre a demanda atual deste profissional" },
      rareSkills: {
        type: Type.ARRAY,
        description: "3 competências que tornam o profissional mais valioso",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["name", "description"]
        }
      }
    },
    required: ["salaryRange", "currency", "rareSkills", "marketOutlook"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta do modelo");
    return JSON.parse(text) as MarketAnalysisResult;
  } catch (error) {
    console.error("Erro ao analisar mercado:", error);
    throw error;
  }
};