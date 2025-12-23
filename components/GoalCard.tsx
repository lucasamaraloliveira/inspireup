
import React from 'react';
import { CheckCircle2, Circle, ChevronRight, TrendingUp } from 'lucide-react';
import { Goal } from '../types';

import { motion } from 'framer-motion';

interface Props {
  goal: Goal;
  onSelect: (id: string) => void;
}

const GoalCard: React.FC<Props> = ({ goal, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(goal.id)}
      className="glass p-5 rounded-xl border border-white hover:border-indigo-300 transition-shadow cursor-pointer group hover:shadow-xl bg-white/50 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-md">
          {goal.category}
        </span>
        <span className="text-xs text-slate-400 font-medium">EXP +{goal.xpValue}</span>
      </div>
      <h3 className="font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors">
        {goal.title}
      </h3>

      <div className="relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-semibold inline-block text-indigo-600">
              {goal.progress}% Concluído
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
          <div
            style={{ width: `${goal.progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
          ></div>
        </div>
      </div>

      <div className="flex items-center text-slate-400 text-xs gap-1">
        <TrendingUp size={14} />
        <span>Ajustando trilha dinamicamente...</span>
      </div>
    </motion.div>
  );
};

export default GoalCard;
