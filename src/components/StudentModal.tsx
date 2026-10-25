import React, { useRef } from 'react';
import { Student, Message } from '../types';
import curriculum from '../data/tu-curriculum.json';
import { 
  X, 
  Printer, 
  Bot, 
  Calendar, 
  Download, 
  Send, 
  Sticker,
  CheckCircle2,
  TrendingUp,
  FileText,
  Network,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';

interface StudentModalProps {
  student: Student;
  messages: Message[];
  onClose: () => void;
  onPrint: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, messages, onClose, onPrint }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const scoreData = [
    { name: '중간', score: student.midtermScore },
    { name: '기말', score: student.finalScore },
    { name: '과제', score: student.assignmentScore },
    { name: '프로젝트', score: student.projectScore },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity print:hidden"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[fadeIn_0.3s_ease-out]"
      >
        
        {/* Left Panel: Profile & Stats */}
        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-6 overflow-y-auto custom-scrollbar">
          <div className="text-center mb-6">
            <div className={`w-24 h-24 ${student.avatarColor} rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-gray-600 shadow-inner`}>
              {student.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{student.studentId} · {student.college} · {student.department}</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                {student.module}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                재학
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Grades */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">학업 성취도</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500 mb-1">수록 과목 평점</p>
                  <p className="text-xl font-bold text-blue-600">{student.gradedCredits===0?"미산출":student.gpa}<span className="text-xs text-gray-400">/4.5</span></p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500 mb-1">선택 모듈 취득 학점</p>
                  <p className="text-xl font-bold text-gray-800">{student.creditsEarned}<span className="text-xs text-gray-400">/{student.totalCredits}</span></p>
                </div>
              </div>
              
              <div className="h-40 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {
                        scoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score < 70 ? '#ef4444' : '#3b82f6'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-700 mb-3 text-sm">모듈 진행률</h4>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-600">{student.module} (전공)</span>
                  <span className="font-bold text-blue-600">{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${student.progress}%` }}></div>
                </div>
              </div>
              <div className="mb-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-600">선택 모듈 학점 기준</span>
                  <span className="font-bold text-green-600">{student.generalProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${student.generalProgress}%` }}></div>
                </div>
              </div>
            </div>

            {student.courseRecords && <section className="rounded-xl border bg-white p-4" aria-label="학생 과목 이수 원자료">
              <h4 className="mb-2 text-sm font-bold">선택 모듈 교과목 원자료</h4>
              <p className="mb-2 text-xs text-slate-500">과목·학점·학기는 공식 가이드북, 이수 상태·평점은 합성입니다. 선택 묶음은 한 항목으로 표시합니다.</p>
              <ul className="space-y-3">{student.courseRecords.map(record=>{const c=curriculum.moduleCourses.find(c=>c.courseRowId===record.courseRowId);return c?<li className="border-t pt-2 text-xs" key={record.courseRowId}><a href={c.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">{c.courseNameRaw}</a><p className="mt-1">{c.year}학년 {c.semester}학기 · {c.credits}학점{c.choiceGroup?' · 선택 묶음':''}</p><p>{({'completed':'이수','failed':'미이수(F)','in-progress':'수강 중','planned':'계획'})[record.status]} · {record.gradePoint===null?'평점 미산출':`합성 평점 ${record.gradePoint}`}</p></li>:null})}</ul>
            </section>}
            {/* AI Analysis Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Bot size={64} />
              </div>
              <h4 className="font-bold text-blue-800 mb-2 text-sm flex items-center gap-2">
                <Bot size={16} />
                AI 종합 진단
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed relative z-10">
                {student.analysis}
              </p>
            </div>

            {/* Print Button */}
            <button 
              onClick={onPrint} 
              className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex justify-center items-center gap-2 text-sm font-semibold transition shadow-md active:scale-[0.98]"
            >
              <Printer size={16} />
              상담 자료 출력 (PDF)
            </button>
          </div>
        </div>

        {/* Right Panel: AI Guidance & Logs */}
        <div className="w-full md:w-2/3 flex flex-col bg-white">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
            <div>
              <h3 className="font-bold text-lg text-gray-900">상담 및 지도 관리</h3>
              <p className="text-xs text-gray-500 mt-0.5">AI 분석 기반 상담 가이드 및 기록</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
            
            {/* AI Consultation Prep Dashboard */}
            <div className="p-6 pb-2">
              <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
                  <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                    <Bot size={16} />
                  </div>
                  <h4 className="font-bold text-indigo-900 text-sm">AI 상담 브리핑 (Consultation Briefing)</h4>
                  <span className="ml-auto text-[10px] text-indigo-400 font-medium px-2 py-0.5 bg-white rounded-full border border-indigo-100">
                    Updated today
                  </span>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Attendance & Attitude */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span className="text-xs font-bold text-gray-700">수업 출석 및 태도</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {student.aiSummary.attendanceAnalysis}
                    </p>
                  </div>

                   {/* 2. Academic Trend */}
                   <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={14} className="text-blue-600" />
                      <span className="text-xs font-bold text-gray-700">시험 및 성적 추이</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {student.aiSummary.academicTrend}
                    </p>
                  </div>

                   {/* 3. Assignment Quality */}
                   <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-amber-600" />
                      <span className="text-xs font-bold text-gray-700">과제 및 프로젝트 분석</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {student.aiSummary.assignmentQuality}
                    </p>
                  </div>

                   {/* 4. Network Intimacy */}
                   <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Network size={14} className="text-purple-600" />
                      <span className="text-xs font-bold text-gray-700">교우 관계 및 네트워크 친밀도</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {student.aiSummary.networkIntimacy}
                    </p>
                  </div>
                </div>
                
                {/* Warning Footer if needed */}
                {student.status === 'Warning' && (
                  <div className="bg-red-50 px-4 py-2 border-t border-red-100 flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-600" />
                    <span className="text-xs font-medium text-red-700">주의: 학업 성취도 하락세가 뚜렷하므로 동기 부여 중심의 상담이 권장됩니다.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 flex items-center gap-3 py-2">
               <div className="h-px bg-gray-200 flex-1"></div>
               <span className="text-xs text-gray-400 font-medium">상담 기록 (Chat History)</span>
               <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Existing Messages */}
            <div className="p-6 pt-2 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} ${msg.type === 'system' ? 'justify-center !mb-4' : ''}`}>
                  {msg.type === 'system' ? (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl max-w-lg w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                          <Calendar size={12} />
                          [대면 상담 기록]
                        </span>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      {!msg.isMe && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                          {student.name.charAt(0)}
                        </div>
                      )}
                      <div className={`p-3.5 rounded-2xl shadow-sm text-sm ${
                        msg.isMe 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${msg.isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2 mb-3">
              <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 transition flex items-center gap-1">
                 <Calendar size={12} /> 상담 일정 잡기
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 transition flex items-center gap-1">
                <Download size={12} /> 학습 자료 전송
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 transition flex items-center gap-1">
                <Sticker size={12} /> 칭찬 스티커
              </button>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <textarea 
                  placeholder="메시지를 입력하거나 상담 내용을 기록하세요..." 
                  className="w-full border border-gray-200 rounded-xl p-3 pl-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-12 py-3 bg-gray-50 focus:bg-white transition-colors"
                ></textarea>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 font-bold transition shadow-sm flex items-center justify-center">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;