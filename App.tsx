
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Trophy, 
  Users, 
  Settings, 
  Bell, 
  Plus,
  Search,
  Menu,
  X,
  Zap,
  Compass
} from 'lucide-react';
import { Goal, UserStats, Badge } from './types';
import { geminiService } from './services/geminiService';
import DashboardHeader from './components/DashboardHeader';
import GoalCard from './components/GoalCard';
import AICoach from './components/AICoach';
import GoalDetails from './components/GoalDetails';
import CommunityHub from './components/CommunityHub';
import IdeaLibrary from './components/IdeaLibrary';

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Dominar TypeScript Profissionalmente',
    category: 'Educação',
    progress: 45,
    xpValue: 800,
    deadline: '2024-06-30',
    steps: [
      { id: '1-1', description: 'Entender Generics profundamente', isCompleted: true, difficulty: 'Difícil' },
      { id: '1-2', description: 'Configurar strict mode em 3 projetos', isCompleted: true, difficulty: 'Médio' },
      { id: '1-3', description: 'Aprender Utillity Types', isCompleted: false, difficulty: 'Fácil' },
      { id: '1-4', description: 'Implementar Decorators customizados', isCompleted: false, difficulty: 'Difícil' },
    ]
  },
  {
    id: '2',
    title: 'Correr uma Meia Maratona',
    category: 'Saúde',
    progress: 20,
    xpValue: 1200,
    deadline: '2024-08-15',
    steps: [
      { id: '2-1', description: 'Comprar tênis de corrida adequado', isCompleted: true, difficulty: 'Fácil' },
      { id: '2-2', description: 'Correr 5km sem parar', isCompleted: false, difficulty: 'Médio' },
      { id: '2-3', description: 'Completar plano de treino de 12 semanas', isCompleted: false, difficulty: 'Difícil' },
    ]
  }
];

const INITIAL_STATS: UserStats = {
  level: 12,
  xp: 450,
  xpToNextLevel: 1000,
  streak: 14,
  rank: 128,
  badges: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('Carregando insights da IA...');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isAdopting, setIsAdopting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const updateFeedback = useCallback(async () => {
    setLoadingFeedback(true);
    const text = await geminiService.getPersonalFeedback(goals);
    setFeedback(text);
    setLoadingFeedback(false);
  }, [goals]);

  useEffect(() => {
    updateFeedback();
  }, []);

  const handleToggleStep = (goalId: string, stepId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedSteps = goal.steps.map(step => 
        step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
      );
      
      const completedCount = updatedSteps.filter(s => s.isCompleted).length;
      const progress = Math.round((completedCount / updatedSteps.length) * 100);
      
      if (updatedSteps.find(s => s.id === stepId)?.isCompleted) {
        addXP(50);
      }

      return { ...goal, steps: updatedSteps, progress };
    }));
  };

  const handleAdoptGoal = async (title: string, category: any, xp: number) => {
    setIsAdopting(true);
    try {
      const steps = await geminiService.generateLearningPath(title);
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title,
        category,
        xpValue: xp,
        progress: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        steps
      };
      setGoals(prev => [newGoal, ...prev]);
      setActiveTab('dashboard');
      addXP(100); // Bônus por adotar nova meta
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdopting(false);
    }
  };

  const addXP = (amount: number) => {
    setStats(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      if (newXp >= prev.xpToNextLevel) {
        newXp -= prev.xpToNextLevel;
        newLevel += 1;
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={20} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">InspireUp</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="hidden md:flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">InspireUp</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
              { id: 'discover', icon: Compass, label: 'Descobrir' },
              { id: 'goals', icon: Target, label: 'Minhas Metas' },
              { id: 'achievements', icon: Trophy, label: 'Conquistas' },
              { id: 'community', icon: Users, label: 'Comunidade' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <img src="https://picsum.photos/40/40" alt="Profile" className="w-10 h-10 rounded-full border border-white" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">Alex Silva</p>
              <p className="text-xs text-slate-500">Membro Premium</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="hidden md:flex items-center justify-between mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar ideias ou trilhas..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
            </button>
            <button 
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              <Plus size={18} />
              Adotar Meta
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DashboardHeader stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AICoach feedback={feedback} loading={loadingFeedback} onRefresh={updateFeedback} />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Metas em Andamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} onSelect={setSelectedGoalId} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <CommunityHub />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <IdeaLibrary onAdopt={handleAdoptGoal} isAdopting={isAdopting} />
        )}

        {(activeTab !== 'dashboard' && activeTab !== 'discover') && (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <LayoutDashboard size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Esta seção chegará em breve na próxima atualização.</p>
          </div>
        )}

        {selectedGoal && (
          <GoalDetails 
            goal={selectedGoal} 
            onClose={() => setSelectedGoalId(null)} 
            onToggleStep={handleToggleStep}
          />
        )}
      </main>
    </div>
  );
};

export default App;
