import React, { useState } from 'react';
import { Send, Copy, Check } from 'lucide-react';
import { Input, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { JobFormData } from '../types';
import { generateJobDescription } from '../services/geminiService';

export const JobGenerator: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    seniority: '',
    skills: '',
    tone: 'Profissional e Inspirador'
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    setLoading(true);
    setResult('');
    try {
      const text = await generateJobDescription(formData);
      setResult(text);
    } catch (err) {
      console.error(err);
      setResult('Erro ao gerar a descrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">1</span>
            Configurar Vaga
          </h2>
          <p className="text-slate-500 text-sm mt-1">Preencha os dados para criar sua vaga.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input 
            label="Título da Vaga" 
            name="title" 
            placeholder="Ex: Desenvolvedor React Sênior" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Departamento" 
              name="department" 
              placeholder="Ex: Engenharia" 
              value={formData.department} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Senioridade" 
              name="seniority" 
              placeholder="Ex: Pleno, Sênior" 
              value={formData.seniority} 
              onChange={handleChange} 
              required 
            />
          </div>
          <TextArea 
            label="Habilidades Obrigatórias" 
            name="skills" 
            placeholder="Ex: React, TypeScript, Tailwind, Node.js..." 
            rows={3}
            value={formData.skills} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Tom de Voz" 
            name="tone" 
            placeholder="Ex: Inovador, Corporativo, Descontraído" 
            value={formData.tone} 
            onChange={handleChange} 
            required 
          />
          
          <div className="mt-6">
            <Button type="submit" isLoading={loading} className="w-full">
              Gerar Descrição <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Resultado</h2>
          {result && (
            <button 
              onClick={handleCopy}
              className="text-slate-500 hover:text-blue-600 transition-colors flex items-center text-sm gap-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl p-6 border border-slate-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-4 w-1/2 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              <p className="mt-4 text-sm">Gerando descrição...</p>
            </div>
          ) : result ? (
            <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap">
              {result}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>O resultado da sua vaga aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};