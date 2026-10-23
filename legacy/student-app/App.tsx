
import React, { useState } from 'react';
import { ViewState } from './types';
import DashboardView from './views/DashboardView';
import AiRecommendationView from './views/AiRecommendationView';
import LearningHistoryView from './views/LearningHistoryView';
import ModuleExplorationView from './views/ModuleExplorationView';
import CurriculumDesignView from './views/CurriculumDesignView';
import ModuleCartView from './views/ModuleCartView';
import { DashboardIcon, HistoryIcon, ExploreIcon, DesignIcon, AiIcon, XIcon, CartIcon } from './components/Icons';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ view, label, icon: Icon }: { view: ViewState; label: string; icon: any }) => {
    const isActive = currentView === view;
    return (
      <li>
        <button
          onClick={() => {
            setCurrentView(view);
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
            isActive 
              ? 'bg-blue-100 text-blue-700 font-semibold' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-5 h-5" />
          {label}
        </button>
      </li>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-900">TU 학습설계 AI</h1>
        {isMobileMenuOpen && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-500">
            <XIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem view={ViewState.DASHBOARD} label="대시보드" icon={DashboardIcon} />
          <NavItem view={ViewState.LEARNING_HISTORY} label="학습 이력" icon={HistoryIcon} />
          <NavItem view={ViewState.MODULE_EXPLORATION} label="모듈 탐색" icon={ExploreIcon} />
          <NavItem view={ViewState.MODULE_CART} label="모듈 카트" icon={CartIcon} />
          <NavItem view={ViewState.CURRICULUM_DESIGN} label="나의 모듈 설계" icon={DesignIcon} />
          <NavItem view={ViewState.AI_RECOMMENDATION} label="AI 추천" icon={AiIcon} />
        </ul>
      </nav>
      <div className="border-t pt-4">
          <ul className="space-y-2">
              <li><a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                커뮤니티
              </a></li>
          </ul>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white p-6 border-r hidden lg:flex flex-col fixed h-full z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-xl flex flex-col animate-slide-in-left">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Mobile & Search */}
          <div className="flex justify-between items-center mb-6">
            <button 
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
               <span className="sr-only">Menu</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="hidden lg:block"></div> {/* Spacer */}
            
            <div className="relative w-full max-w-xs">
              <input type="text" placeholder="모듈명, 교과목명 검색..." className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          {/* Views */}
          {currentView === ViewState.DASHBOARD && <DashboardView />}
          {currentView === ViewState.AI_RECOMMENDATION && <AiRecommendationView />}
          {currentView === ViewState.LEARNING_HISTORY && <LearningHistoryView />}
          {currentView === ViewState.MODULE_EXPLORATION && <ModuleExplorationView />}
          {currentView === ViewState.MODULE_CART && <ModuleCartView />}
          {currentView === ViewState.CURRICULUM_DESIGN && <CurriculumDesignView />}
        </div>
      </main>
    </div>
  );
}

export default App;
