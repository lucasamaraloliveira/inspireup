
import React from 'react';
import { X, CheckCircle2, Circle, AlertTriangle, ChevronRight } from 'lucide-react';
import { Goal, GoalStep } from '../types';

interface Props {
  goal: Goal;
  onClose: () => void;
  onToggleStep: (goalId: string, stepId: string) => void;
}

const GoalDetails: React.FC<Props> = ({ goal, onClose, onToggleStep }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-indigo-600 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded-md">
              {goal.category}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">{goal.title}</h2>
          <p className="text-indigo-100 text-sm">Trilha de aprendizagem adaptável gerada por IA</p>
        </div>
        
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Próximos Passos
            <span className="text-sm font-normal text-slate-400">({goal.steps.filter(s => s.isCompleted).length}/{goal.steps.length})</span>
          </h3>
          
          <div className="space-y-4">
            {goal.steps.map((step) => (
              <div 
                key={step.id}
                onClick={() => onToggleStep(goal.id, step.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  step.isCompleted 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'
                }`}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="text-slate-300 shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${step.isCompleted ? 'line-through opacity-70' : ''}`}>
                    {step.description}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  step.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                  step.difficulty === 'Médio' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {step.difficulty}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-slate-500 font-semibold hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-colors">
              Atualizar Trilha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;
