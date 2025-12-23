import React from 'react';
import { Trophy, Star, Medal, Flag, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserStats, Badge } from '../types';

interface Props {
    stats: UserStats;
}

const AchievementsView: React.FC<Props> = ({ stats }) => {
    const badges = stats.badges || [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Conquistas & Glória</h2>
                <p className="text-slate-500">Suas vitórias acumuladas e sua posição no topo mundial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2 glass p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12">
                        <Trophy size={200} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Star className="text-yellow-400 fill-yellow-400" size={24} />
                            Seu Progresso de Elite
                        </h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Ranking Global</p>
                                <p className="text-4xl font-black">#{stats.rank}</p>
                                <p className="text-indigo-100 text-xs mt-2 flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    Subiu 12 posições esta semana
                                </p>
                            </div>
                            <div>
                                <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Progresso Total</p>
                                <p className="text-4xl font-black">{stats.level * 10}%</p>
                                <p className="text-indigo-100 text-xs mt-2">Próximo Rank: Bronze III</p>
                            </div>
                        </div>
                        <div className="mt-10 h-3 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
                                className="h-full bg-white shadow-lg"
                            />
                        </div>
                        <p className="text-right text-xs mt-2 font-medium">{stats.xp} / {stats.xpToNextLevel} XP até o Nível {stats.level + 1}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Medal className="text-orange-500" size={20} />
                        Estatísticas Vitalícias
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total de XP Ganho</p>
                            <p className="text-2xl font-bold text-slate-800">24,500</p>
                        </div>
                        <hr className="border-slate-100" />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Metas Completadas</p>
                            <p className="text-2xl font-bold text-slate-800">42</p>
                        </div>
                        <hr className="border-slate-100" />
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Duração da Ofensiva</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.streak} dias</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Medalhas Desbloqueadas ({badges.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center group transition-colors hover:border-indigo-300"
                        >
                            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <Award size={32} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 mb-1">{badge.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">{new Date(badge.unlockedAt!).toLocaleDateString()}</p>
                        </motion.div>
                    ))}

                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center grayscale opacity-50">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Medal size={32} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-400 mb-1">Mestre Zen</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Bloqueado</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsView;
