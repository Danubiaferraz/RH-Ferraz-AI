import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { JobGenerator } from './components/JobGenerator';
import { ResumeAnalyst } from './components/ResumeAnalyst';
import { InterviewPrep } from './components/InterviewPrep';
import { MarketAnalyst } from './components/MarketAnalyst';
import { AppTab } from './types';

function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.JOB_GENERATOR);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.JOB_GENERATOR:
        return <JobGenerator />;
      case AppTab.RESUME_ANALYST:
        return <ResumeAnalyst />;
      case AppTab.INTERVIEW_PREP:
        return <InterviewPrep />;
      case AppTab.MARKET_ANALYST:
        return <MarketAnalyst />;
      default:
        return <JobGenerator />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="font-bold text-slate-800">RH Ferraz AI</div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 md:p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
