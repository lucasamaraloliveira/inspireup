
const API_URL = 'http://localhost:3001/api';

async function handleResponse(res: Response) {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Erro HTTP: ${res.status}`);
    }
    return res.json();
}

export const apiService = {
    async getGoals() {
        const res = await fetch(`${API_URL}/goals`);
        return handleResponse(res);
    },

    async createGoal(goal: any) {
        const res = await fetch(`${API_URL}/goals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal)
        });
        return handleResponse(res);
    },

    async updateStep(goalId: string, stepId: string, isCompleted: boolean) {
        const res = await fetch(`${API_URL}/goals/${goalId}/steps/${stepId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCompleted })
        });
        return handleResponse(res);
    },

    async getStats() {
        const res = await fetch(`${API_URL}/stats`);
        return handleResponse(res);
    },

    async updateStats(stats: any) {
        const res = await fetch(`${API_URL}/stats`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats)
        });
        return handleResponse(res);
    },

    async getFeedback(goals: any[]) {
        const res = await fetch(`${API_URL}/ai/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goals })
        });
        const data = await handleResponse(res);
        return data.feedback;
    },

    async generateLearningPath(goalTitle: string) {
        const res = await fetch(`${API_URL}/ai/learning-path`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goalTitle })
        });
        return handleResponse(res);
    }
};
