
import React from 'react';
import { Users, Shield, ArrowRight } from 'lucide-react';
import { CommunityChallenge } from '../types';

const challenges: CommunityChallenge[] = [
  { id: '1', title: 'Meditação Semanal 7/7', participants: 1240, daysRemaining: 3, rewardXP: 500 },
  { id: '2', title: 'Leitura: Mindset (Dweck)', participants: 850, daysRemaining: 12, rewardXP: 1000 },
];

const CommunityHub: React.FC = () => {
  return (
    <div className="glass p-6 rounded-2xl shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-indigo-600" size={20} />
          Comunidade & Desafios
        </h3>
        <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
          Ver Tudo <ArrowRight size={14} />
        </button>
      </div>
      
      <div className="space-y-4">
        {challenges.map(challenge => (
          <div key={challenge.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{challenge.title}</h4>
              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">+{challenge.rewardXP} XP</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users size={12} /> {challenge.participants} participando
              </span>
              <span>{challenge.daysRemaining} dias restantes</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/3"></div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Grupos Sugeridos</h4>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map(i => (
              <img 
                key={i}
                src={`https://picsum.photos/seed/${i}/40/40`} 
                alt="user" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            ))}
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-400">
              +42
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            <strong>Produtividade Máxima</strong> e outros 12 grupos ativos agora.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
