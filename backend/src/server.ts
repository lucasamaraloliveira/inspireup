
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from "@google/genai";
import { GoalSchema, UserStatsSchema } from './schemas/validation';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

const genAI = new GoogleGenAI({
    apiKey: process.env.API_KEY || ''
});
const MODEL_NAME = "gemini-2.0-flash";

app.use(cors());
app.use(express.json());

// Routes for Goals
app.get('/api/goals', async (req, res) => {
    try {
        const goals = await prisma.goal.findMany({
            include: { steps: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar metas" });
    }
});

app.post('/api/goals', async (req, res) => {
    try {
        const validatedData = GoalSchema.parse(req.body);
        const { title, category, xpValue, deadline, steps } = validatedData;
        const goal = await prisma.goal.create({
            data: {
                title,
                category,
                xpValue,
                deadline,
                steps: {
                    create: steps.map((s: any) => ({
                        description: s.description,
                        difficulty: s.difficulty,
                        isCompleted: s.isCompleted || false
                    }))
                }
            },
            include: { steps: true }
        });
        res.json(goal);
    } catch (error: any) {
        console.error("Erro na criação de meta:", error);
        res.status(400).json({
            error: "Falha na validação ou criação",
            details: error.errors || error.message
        });
    }
});

app.patch('/api/goals/:id/steps/:stepId', async (req, res) => {
    try {
        const { id, stepId } = req.params;
        const { isCompleted } = req.body;

        const step = await prisma.goalStep.update({
            where: { id: stepId },
            data: { isCompleted }
        });

        // Update goal progress
        const goal = await prisma.goal.findUnique({
            where: { id },
            include: { steps: true }
        });

        if (goal) {
            const completedCount = goal.steps.filter((s: any) => s.isCompleted).length;
            const progress = goal.steps.length > 0 ? Math.round((completedCount / goal.steps.length) * 100) : 0;
            await prisma.goal.update({
                where: { id },
                data: { progress }
            });
        }

        res.json(step);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar passo" });
    }
});

// Routes for Stats
app.get('/api/stats', async (req, res) => {
    try {
        let stats = await prisma.userStats.findFirst({
            include: { badges: true }
        });

        if (!stats) {
            stats = await prisma.userStats.create({
                data: {
                    level: 1,
                    xp: 0,
                    xpToNextLevel: 1000,
                    streak: 0,
                    rank: 100
                },
                include: { badges: true }
            });
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
});

app.patch('/api/stats', async (req, res) => {
    try {
        const validatedData = UserStatsSchema.partial().parse(req.body);
        const currentStats = await prisma.userStats.findFirst();
        if (!currentStats) return res.status(404).json({ error: "Stats not found" });

        const stats = await prisma.userStats.update({
            where: { id: currentStats.id },
            data: validatedData
        });

        // Auto-Badge Logic
        if (stats.level >= 5) {
            const hasLevel5Badge = await prisma.badge.findFirst({
                where: { userStatsId: stats.id, name: 'Veterano' }
            });
            if (!hasLevel5Badge) {
                await prisma.badge.create({
                    data: {
                        name: 'Veterano',
                        icon: 'Award',
                        description: 'Alcançou o nível 5!',
                        unlockedAt: new Date(),
                        userStatsId: stats.id
                    }
                });
            }
        }

        res.json(stats);
    } catch (error: any) {
        res.status(400).json({ error: error.errors || error.message });
    }
});

// AI Routes
app.post('/api/ai/learning-path', async (req, res) => {
    const { goalTitle } = req.body;
    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
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

        const responseText = result.text;
        const data = JSON.parse(responseText || '[]');
        res.json(data);
    } catch (error) {
        console.error("Erro ao gerar trilha IA:", error);
        res.status(500).json({ error: "Erro ao gerar trilha pelo Mentor IA" });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    const { goalTitle, currentSteps, message } = req.body;
    try {
        const stepsSummary = currentSteps.map((s: any) => `- ${s.description} (${s.isCompleted ? 'Concluído' : 'Pendente'})`).join("\n");
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: `Você é o InspireUp AI Coach. O usuário está trabalhando na meta: "${goalTitle}".
                Progresso atual:\n${stepsSummary}\n
                Mensagem do usuário: "${message}"\n
                Responda de forma motivadora e técnica, dando dicas específicas para os passos pendentes. Responda em português do Brasil.`
        });
        const responseText = result.text;
        res.json({ response: responseText });
    } catch (error) {
        console.error("Erro no chat IA:", error);
        res.status(500).json({ error: "Erro ao processar chat" });
    }
});

app.post('/api/ai/feedback', async (req, res) => {
    const { goals } = req.body;
    const goalsSummary = (goals || []).map((g: any) => `${g.title}: ${g.progress}% concluído`).join(", ");
    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: `Como um coach de alto desempenho, analise o progresso atual do usuário: ${goalsSummary}. 
                Forneça um feedback motivador, curto e acionável em português do Brasil. Max 100 palavras.`
        });
        const responseText = result.text;
        res.json({ feedback: responseText });
    } catch (error) {
        console.error("Erro no feedback IA:", error);
        res.status(500).json({ error: "Erro ao gerar feedback" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
