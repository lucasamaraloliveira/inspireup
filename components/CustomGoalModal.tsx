import React, { useState } from 'react';
import { X, Sparkles, Loader2, Target, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdopt: (title: string, category: string, xp: number) => Promise<void>;
    isAdopting: boolean;
}

const CustomGoalModal: React.FC<Props> = ({ isOpen, onClose, onAdopt, isAdopting }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Personalizado');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isAdopting) return;
        await onAdopt(title, category, 500);
        onClose();
        setTitle('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Target size={20} />
                                <h2 className="text-xl font-bold">Novo Objetivo</h2>
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    O que você quer conquistar?
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Correr uma maratona, Aprender Rust..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Categoria
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                >
                                    <option>Personalizado</option>
                                    <option>Carreira</option>
                                    <option>Saúde</option>
                                    <option>Finanças</option>
                                    <option>Educação</option>
                                    <option>Social</option>
                                </select>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 items-start">
                                <Sparkles size={20} className="text-indigo-600 shrink-0" />
                                <p className="text-xs text-indigo-700 leading-normal">
                                    Nossa IA criará uma trilha de aprendizagem personalizada com 5 passos para te ajudar a chegar lá!
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!title.trim() || isAdopting}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isAdopting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Criando Trilha...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Criar Objetivo com IA
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CustomGoalModal;
