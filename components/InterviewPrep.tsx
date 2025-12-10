import React, { useState } from 'react';
import { MessageSquare, Download } from 'lucide-react';
import { Input, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { generateInterviewScript } from '../services/geminiService';

export const InterviewPrep: React.FC = () => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    setScript('');
    try {
      const result = await generateInterviewScript(title, skills);
      setScript(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
         <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <Input 
                label="Título da Vaga" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Ex: Gerente de Projetos" 
              />
            </div>
            <div className="flex-[2]">
              <Input 
                label="Habilidades Focais" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                placeholder="Ex: Liderança ágil, Scrum, Comunicação..." 
              />
            </div>
            <div className="mb-4">
               <Button onClick={handleGenerate} isLoading={loading}>
                 Gerar Roteiro
               </Button>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Roteiro de Entrevista
          </h2>
          {script && (
             <Button variant="secondary" className="!py-1.5 !px-3 text-sm" onClick={() => navigator.clipboard.writeText(script)}>
               <Download className="w-4 h-4 mr-2" /> Copiar Texto
             </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
           {loading ? (
             <div className="space-y-4 animate-pulse">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                 </div>
               ))}
             </div>
           ) : script ? (
             <div className="prose prose-slate max-w-none whitespace-pre-wrap">
               {script}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
               <p>Preencha os campos acima para gerar as perguntas.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
