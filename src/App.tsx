
import React, { useState } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  MessageSquare, 
  BarChart2,
  BrainCircuit,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import StudentModal from './components/StudentModal';
import PrintableReport from './components/PrintableReport';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import ConsultationAdvisor from './components/ConsultationAdvisor';
import ModuleAnalytics from './components/ModuleAnalytics';

import { Student } from './types';
import { StudentSyncPanel, useStudentData } from './StudentData';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'students' | 'consultation' | 'analytics'>('dashboard');
  const { students } = useStudentData();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const selectedStudent = students.find(student => student.id === selectedStudentId) || null;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenModal = (student: Student) => {
    setSelectedStudentId(student.id);
  };

  const handleCloseModal = () => {
    setSelectedStudentId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNavClick = (view: typeof currentView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50 print:hidden text-slate-800 font-sans">
        
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-900 flex items-center gap-2 tracking-tight cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <LayoutDashboard size={20} />
              </div>
              TU 교수 지원
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-medium ml-1">AI 학습설계 어시스턴트 · 고정 합성 데이터</p>
          </div>

          <nav className="flex-1 px-4 space-y-1.5">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                currentView === 'dashboard' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={20} />
              대시보드
            </button>
            <button 
              onClick={() => setCurrentView('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                currentView === 'students' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users size={20} />
              학생 관리
            </button>
            <button 
              onClick={() => setCurrentView('consultation')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                currentView === 'consultation' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BrainCircuit size={20} />
              학습/진로 상담
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors font-semibold"
            >
              <MessageSquare size={20} />
              메시지
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">3</span>
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-200 ${
                currentView === 'analytics' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart2 size={20} />
              모듈 분석 통계
            </button>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">P</div>
              <div>
                <p className="text-sm font-bold text-gray-900">김교수 교수</p>
                <p className="text-xs text-gray-500">컴퓨터공학과</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-blue-900" onClick={() => handleNavClick('dashboard')}>
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <LayoutDashboard size={18} />
              </div>
              <span className="text-lg tracking-tight">TU 교수 지원</span>
            </div>
            <button 
              aria-label="메뉴 열기"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            >
              <Menu size={24} />
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto h-full p-4 md:p-6 lg:p-8 custom-scrollbar relative">
            <p className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">합성 데이터 데모 · 학생 {students.length}건 · 실제 교육과정에 연결한 합성 학생입니다. 이수·성적·상담·관계는 가상이며 졸업 판정이 아닙니다.</p>
            <StudentSyncPanel />
            {currentView === 'dashboard' && (
              <Dashboard onOpenStudentModal={handleOpenModal} />
            )}
            {currentView === 'students' && (
              <StudentManagement onOpenStudentModal={handleOpenModal} />
            )}
            {currentView === 'consultation' && (
              <ConsultationAdvisor />
            )}
            {currentView === 'analytics' && (
              <ModuleAnalytics />
            )}
          </main>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Mobile Sidebar Drawer */}
            <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-2xl flex flex-col animate-[slideLeft_0.3s_ease-out]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900 text-lg">메뉴</h2>
                <button 
                  aria-label="메뉴 닫기"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                 <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">P</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">김교수 교수</p>
                    <p className="text-xs text-gray-500">컴퓨터공학과</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <button 
                  onClick={() => handleNavClick('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${
                    currentView === 'dashboard' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  대시보드
                </button>
                <button 
                  onClick={() => handleNavClick('students')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${
                    currentView === 'students' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users size={20} />
                  학생 관리
                </button>
                <button 
                  onClick={() => handleNavClick('consultation')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${
                    currentView === 'consultation' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BrainCircuit size={20} />
                  학습/진로 상담
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-semibold"
                >
                  <MessageSquare size={20} />
                  메시지
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                </button>
                <button 
                  onClick={() => handleNavClick('analytics')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all ${
                    currentView === 'analytics' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart2 size={20} />
                  모듈 분석 통계
                </button>
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm">
                  <LogOut size={20} />
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {selectedStudent && (
        <StudentModal 
          student={selectedStudent} 
          messages={[]}
          onClose={handleCloseModal}
          onPrint={handlePrint}
        />
      )}

      {selectedStudent && (
        <PrintableReport student={selectedStudent} />
      )}
    </>
  );
}

export default App;
