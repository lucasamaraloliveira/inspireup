
import React, { useState } from 'react';
import { GOAL_SUGGESTIONS } from '../constants/suggestions';
import * as LucideIcons from 'lucide-react';
import { Sparkles, Plus } from 'lucide-react';

interface Props {
  onAdopt: (title: string, category: string, xp: number) => void;
  isAdopting: boolean;
}

const IdeaLibrary: React.FC<Props> = ({ onAdopt, isAdopting }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Carreira');

  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent className={className} size={20} /> : <Plus size={20} />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Banco de Ideias InspireUp</h2>
        <p className="text-slate-500">Escolha um objetivo e deixe nossa IA traçar o caminho para o seu sucesso.</p>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        {Object.keys(GOAL_SUGGESTIONS).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(GOAL_SUGGESTIONS as any)[activeCategory].map((suggestion: any, index: number) => (
          <div 
            key={index}
            className="glass p-6 rounded-2xl border border-white hover:border-indigo-300 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <DynamicIcon name={suggestion.icon} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                {suggestion.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Recompensa: +{suggestion.xp} XP</p>
            </div>
            
            <button
              onClick={() => onAdopt(suggestion.title, activeCategory, suggestion.xp)}
              disabled={isAdopting}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all disabled:opacity-50"
            >
              {isAdopting ? (
                <LucideIcons.Loader2 className="animate-spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              Adotar com IA
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaLibrary;
