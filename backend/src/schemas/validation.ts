import { z } from 'zod';

export const GoalStepSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
    isCompleted: z.boolean().optional()
});

export const GoalSchema = z.object({
    title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
    category: z.string(),
    xpValue: z.number().int().positive(),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (AAAA-MM-DD)"),
    steps: z.array(GoalStepSchema)
});

export const UserStatsSchema = z.object({
    xp: z.number().int().nonnegative(),
    level: z.number().int().positive(),
    streak: z.number().int().nonnegative().optional()
});
