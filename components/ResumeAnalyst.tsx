import React, { useState } from 'react';
import { Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { ResumeAnalysisResult } from '../types';
import { analyzeResume } from '../services/geminiService';

export const ResumeAnalyst: React.FC = () => {
  const [jobDesc, setJobDesc] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDesc || !resumeText) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResume(resumeText, jobDesc);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto flex flex-col gap-4">
         <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">2</span>
            Dados da Análise
          </h2>
          
          <TextArea 
            label="Descrição da Vaga" 
            placeholder="Cole a descrição da vaga aqui..." 
            rows={6}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <TextArea 
            label="Texto do Currículo" 
            placeholder="Cole o texto do currículo do candidato aqui..." 
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <Button 
            onClick={handleAnalyze} 
            isLoading={loading} 
            className="w-full mt-4"
            disabled={!jobDesc || !resumeText}
          >
            Analisar Compatibilidade <Search className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Relatório de Análise</h2>
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p>Processando análise...</p>
          </div>
        )}

        {!loading && !analysis && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <Search className="w-12 h-12 mb-2 opacity-20" />
            <p>Insira os dados para iniciar a análise.</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-8 animate-fade-in">
            {/* Score Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg shadow-blue-200/50">
              <div>
                <h3 className="text-blue-100 font-medium text-lg">Match Score</h3>
                <p className="text-blue-200 text-sm mt-1">Compatibilidade com a vaga</p>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-500/30" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      stroke="currentColor" strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={251.2} 
                      strokeDashoffset={251.2 - (251.2 * analysis.matchScore) / 100} 
                      className="text-white transition-all duration-1000 ease-out" 
                    />
                 </svg>
                 <span className="absolute text-2xl font-bold">{analysis.matchScore}%</span>
              </div>
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <h3 className="text-emerald-800 font-bold flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 mr-2" /> Pontos Fortes
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <h3 className="text-amber-800 font-bold flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Gaps Identificados
                </h3>
                <ul className="space-y-3">
                  {analysis.gaps.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-amber-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2.5 mt-1.5 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">Resumo da Análise</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{analysis.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};