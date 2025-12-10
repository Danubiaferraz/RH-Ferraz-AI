import React from 'react';
import { Briefcase, FileText, Search, MessageSquare, BarChart3, X } from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: AppTab.JOB_GENERATOR, label: 'Gerador de Vagas', icon: FileText },
    { id: AppTab.RESUME_ANALYST, label: 'Analista de Currículo', icon: Search },
    { id: AppTab.INTERVIEW_PREP, label: 'Preparar Entrevistas', icon: MessageSquare },
    { id: AppTab.MARKET_ANALYST, label: 'Analista de Mercado e Salário', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg">
               <Briefcase className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="font-bold text-lg leading-none tracking-tight text-white">RH Ferraz AI</h1>
               <span className="text-xs text-blue-200 font-medium tracking-widest">RECRUTAMENTO</span>
             </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden ml-auto text-slate-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-300 group-hover:text-white'}`} />
                <span className="font-medium text-sm truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Profile Placeholder */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-slate-800">
              AI
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">Operador RH</p>
              <p className="text-xs text-slate-400">Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};