import React, { useState } from 'react';
import { BarChart3, Diamond, DollarSign, TrendingUp } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { MarketAnalysisResult } from '../types';
import { analyzeMarket } from '../services/geminiService';

export const MarketAnalyst: React.FC = () => {
  const [title, setTitle] = useState('');
  const [seniority, setSeniority] = useState('');
  const [result, setResult] = useState<MarketAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !seniority) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeMarket(title, seniority);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">4</span>
            Análise de Mercado
          </h2>
          <p className="text-slate-500 text-sm mt-1">Descubra salários e competências raras do mercado.</p>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <Input 
              label="Cargo" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: UX Designer"
              required
            />
          </div>
          <div className="w-full md:w-1/3">
             <Input 
              label="Senioridade" 
              value={seniority} 
              onChange={(e) => setSeniority(e.target.value)} 
              placeholder="Ex: Sênior"
              required
            />
          </div>
          <div className="mb-4 w-full md:w-auto">
             <Button type="submit" isLoading={loading} className="w-full md:w-auto">
               Analisar Mercado
             </Button>
          </div>
        </form>
      </div>

      <div className="flex-1">
        {loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
             <div className="h-48 bg-slate-200 rounded-2xl"></div>
             <div className="h-48 bg-slate-200 rounded-2xl"></div>
             <div className="col-span-1 md:col-span-2 h-40 bg-slate-200 rounded-2xl"></div>
           </div>
        )}

        {!loading && !result && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 p-12">
            <BarChart3 className="w-16 h-16 mb-4 opacity-10" />
            <p>Descubra salários e competências raras.</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salary Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <DollarSign className="w-32 h-32 transform rotate-12" />
                   </div>
                   <h3 className="text-slate-300 font-medium mb-2">Estimativa Salarial (Mensal)</h3>
                   <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                     {result.salaryRange}
                   </div>
                   <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-slate-200 border border-white/10">
                     {result.currency} - Brasil
                   </span>
                   
                   <div className="mt-8 pt-6 border-t border-white/10">
                     <div className="flex items-start gap-3">
                       <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
                       <p className="text-sm text-slate-300 italic">"{result.marketOutlook}"</p>
                     </div>
                   </div>
                </div>

                {/* Rare Skills */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                     <Diamond className="w-5 h-5 text-blue-600 mr-2" />
                     Competências Raras
                   </h3>
                   <div className="space-y-4">
                     {result.rareSkills.map((skill, idx) => (
                       <div key={idx} className="group p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors border border-slate-100 hover:border-blue-100">
                          <h4 className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {skill.description}
                          </p>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};