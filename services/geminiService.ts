
import { GoogleGenAI } from "@google/genai";
import { Goal, GoalStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async generateLearningPath(goalTitle: string): Promise<GoalStep[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Crie um plano de ação detalhado com 5 passos para o objetivo: "${goalTitle}". 
        Retorne um JSON contendo uma lista de objetos com 'description' (em português) e 'difficulty' (Fácil, Médio ou Difícil).`,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: { type: "string" },
                difficulty: { type: "string", enum: ['Fácil', 'Médio', 'Difícil'] }
              },
              required: ['description', 'difficulty']
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      return data.map((item: any, index: number) => ({
        id: `step-${Date.now()}-${index}`,
        description: item.description,
        difficulty: item.difficulty,
        isCompleted: false
      }));
    } catch (error) {
      console.error("Erro ao gerar trilha de aprendizagem:", error);
      return [
        { id: '1', description: 'Pesquisar sobre o tema', difficulty: 'Fácil', isCompleted: false },
        { id: '2', description: 'Definir marcos iniciais', difficulty: 'Médio', isCompleted: false }
      ];
    }
  },

  async getPersonalFeedback(goals: Goal[]): Promise<string> {
    const goalsSummary = goals.map(g => `${g.title}: ${g.progress}% concluído`).join(", ");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Como um coach de alto desempenho, analise o progresso atual do usuário: ${goalsSummary}. 
        Forneça um feedback motivador, curto e acionável em português do Brasil. Max 100 palavras.`,
        config: {
          systemInstruction: "Você é o InspireUp AI Coach, focado em psicologia positiva e produtividade."
        }
      });
      return response.text || "Continue focado em seus objetivos. Você está no caminho certo!";
    } catch (error) {
      return "Você está indo muito bem! Mantenha a consistência para alcançar o próximo nível.";
    }
  }
};
