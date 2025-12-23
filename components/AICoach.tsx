
import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  feedback: string;
  loading: boolean;
  onRefresh: () => void;
}

const AICoach: React.FC<Props> = ({ feedback, loading, onRefresh }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden mb-8">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold">Feedback do Mentor IA</h3>
          </div>
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <p className="text-indigo-50 text-sm leading-relaxed mb-4 italic">
          "{loading ? 'Analisando seu desempenho com algoritmos neurais...' : feedback}"
        </p>
        
        <div className="flex gap-2">
          <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
            Ajustar Metas
          </button>
          <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors border border-white/20">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
