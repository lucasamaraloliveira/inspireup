
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
import { apiService } from './services/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from './components/DashboardHeader';
import GoalCard from './components/GoalCard';
import AICoach from './components/AICoach';
import GoalDetails from './components/GoalDetails';
import CommunityHub from './components/CommunityHub';
import IdeaLibrary from './components/IdeaLibrary';
import CustomGoalModal from './components/CustomGoalModal';
import GoalsManager from './components/GoalsManager';
import AchievementsView from './components/AchievementsView';


const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('Carregando insights da IA...');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isAdopting, setIsAdopting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Queries
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: apiService.getGoals
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['stats'],
    queryFn: apiService.getStats
  });

  // Mutations
  const toggleStepMutation = useMutation({
    mutationFn: ({ goalId, stepId, isCompleted }: any) => apiService.updateStep(goalId, stepId, isCompleted),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });

  const adoptGoalMutation = useMutation({
    mutationFn: apiService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] }); // For potential badge unlocks
      setActiveTab('dashboard');
      addXP(100);
    }
  });

  const updateStatsMutation = useMutation({
    mutationFn: apiService.updateStats,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] })
  });

  const updateFeedback = useCallback(async () => {
    if (goals.length === 0) {
      setFeedback("Comece a adicionar metas para receber feedback personalizado!");
      return;
    }
    setLoadingFeedback(true);
    try {
      const text = await apiService.getFeedback(goals);
      setFeedback(text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFeedback(false);
    }
  }, [goals]);

  useEffect(() => {
    if (goals.length > 0 && feedback === 'Carregando insights da IA...') {
      updateFeedback();
    }
  }, [goals.length, updateFeedback]);

  const handleToggleStep = async (goalId: string, stepId: string) => {
    const goal = goals.find((g: Goal) => g.id === goalId);
    if (!goal) return;

    const step = goal.steps.find((s: any) => s.id === stepId);
    if (!step) return;

    const newIsCompleted = !step.isCompleted;
    toggleStepMutation.mutate({ goalId, stepId, isCompleted: newIsCompleted });

    if (newIsCompleted) {
      addXP(50);
    }
  };

  const handleAdoptGoal = async (title: string, category: any, xp: number) => {
    setIsAdopting(true);
    try {
      const suggestedSteps = await apiService.generateLearningPath(title);
      await adoptGoalMutation.mutateAsync({
        title,
        category,
        xpValue: xp,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        steps: suggestedSteps
      });
    } catch (error: any) {
      console.error("Erro ao adotar meta:", error);
      alert(`Erro ao adotar meta: ${error.message || "Verifique a conexão com o servidor"}`);
    } finally {
      setIsAdopting(false);
    }
  };

  const addXP = async (amount: number) => {
    if (!stats) return;

    let newXp = stats.xp + amount;
    let newLevel = stats.level;
    if (newXp >= stats.xpToNextLevel) {
      newXp -= stats.xpToNextLevel;
      newLevel += 1;
    }

    updateStatsMutation.mutate({ xp: newXp, level: newLevel });
  };

  const openCustomModal = () => setIsCustomModalOpen(true);

  const selectedGoal = goals.find((g: Goal) => g.id === selectedGoalId);

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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id
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
              onClick={openCustomModal}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              <Plus size={18} />
              Adotar Meta
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {stats && <DashboardHeader stats={stats} />}
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

        {activeTab === 'goals' && (
          <GoalsManager goals={goals} onSelectGoal={setSelectedGoalId} />
        )}

        {activeTab === 'achievements' && stats && (
          <AchievementsView stats={stats} />
        )}

        {activeTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CommunityHub />
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Membros Online</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${i + 10}/40/40`} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-700">Usuário {i}</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'settings') && (
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

        <CustomGoalModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onAdopt={handleAdoptGoal}
          isAdopting={isAdopting}
        />
      </main>
    </div>
  );
};

export default App;
