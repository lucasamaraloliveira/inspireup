
import React from 'react';
import { Trophy, Zap, Flame, User } from 'lucide-react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
}

const DashboardHeader: React.FC<Props> = ({ stats }) => {
  const progressPercent = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-2 glass p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {stats.level}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">Nível {stats.level}</h2>
            <div className="w-full bg-slate-200 h-3 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 mt-1">{stats.xp} / {stats.xpToNextLevel} XP para o próximo nível</p>
          </div>
        </div>
      </div>
      
      <div className="glass p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
        <Flame className="text-orange-500 w-8 h-8 mb-2" />
        <span className="text-2xl font-bold text-slate-800">{stats.streak} dias</span>
        <span className="text-sm text-slate-500">Ofensiva Atual</span>
      </div>

      <div className="glass p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
        <Trophy className="text-yellow-500 w-8 h-8 mb-2" />
        <span className="text-2xl font-bold text-slate-800">#{stats.rank}</span>
        <span className="text-sm text-slate-500">Ranking Global</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
