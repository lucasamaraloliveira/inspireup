import React, { useState } from 'react';
import { Target, Search, Filter, CheckCircle2, Clock, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal } from '../types';
import GoalCard from './GoalCard';

interface Props {
    goals: Goal[];
    onSelectGoal: (id: string) => void;
}

const GoalsManager: React.FC<Props> = ({ goals, onSelectGoal }) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGoals = goals.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true :
            filter === 'completed' ? g.progress === 100 :
                g.progress < 100;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Minhas Metas</h2>
                    <p className="text-slate-500">Gerencie todos os seus objetivos e acompanhe sua evolução.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Pesquisar metas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-full md:w-64"
                        />
                    </div>
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
                        {(['all', 'pending', 'completed'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {f === 'all' ? 'Todas' : f === 'pending' ? 'Em Aberto' : 'Concluídas'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredGoals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} onSelect={onSelectGoal} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                    <Inbox size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-lg">Nenhuma meta encontrada</p>
                    <p className="text-sm">Tente ajustar seus filtros ou pesquisar por outro termo.</p>
                </div>
            )}
        </div>
    );
};

export default GoalsManager;
