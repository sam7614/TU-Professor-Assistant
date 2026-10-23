
import React, { useRef } from 'react';
import { EmploymentInterview } from '../types';
import { X, Building2, Quote, Award, Briefcase, Factory, Package } from 'lucide-react';

interface EmploymentModalProps {
  moduleName: string;
  interviews: EmploymentInterview[];
  onClose: () => void;
}

const EmploymentModal: React.FC<EmploymentModalProps> = ({ moduleName, interviews, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const filteredInterviews = interviews.filter(i => i.module === moduleName);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-[fadeIn_0.3s_ease-out]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
                {moduleName}
              </span>
              <h3 className="text-xl font-bold text-gray-900">취업 현황 및 학생 인터뷰</h3>
            </div>
            <p className="text-sm text-gray-500">대기업 및 부산 지역 우수 기업에 취업한 졸업생들의 생생한 후기입니다.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
          {filteredInterviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredInterviews.map((interview) => (
                <div key={interview.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  {/* Left: Profile & Company Info */}
                  <div className="w-full md:w-72 bg-gray-50/50 p-6 border-r border-gray-100 flex flex-col items-center text-center shrink-0">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden mb-3 bg-white">
                      <img src={interview.avatarUrl} alt={interview.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{interview.name}</h4>
                    <p className="text-xs text-gray-500 mb-4">{interview.studentId} 졸업</p>
                    
                    <div className="w-full bg-white rounded-xl p-3 border border-gray-200 shadow-sm mb-3">
                      <div className="flex items-center justify-center gap-1.5 text-blue-800 font-bold text-sm mb-1">
                        <Building2 size={16} />
                        {interview.company}
                      </div>
                      <p className="text-xs text-gray-600 font-medium bg-blue-50 py-1 px-2 rounded-lg inline-block">
                        {interview.role}
                      </p>
                    </div>

                    <div className="w-full text-left space-y-2 mt-2">
                       <div className="flex gap-2 items-start">
                         <div className="mt-0.5 min-w-[14px] text-gray-400"><Factory size={12} /></div>
                         <div>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">핵심 산업</p>
                           <p className="text-xs text-gray-700 font-medium leading-tight">{interview.companyInfo.coreIndustry}</p>
                         </div>
                       </div>
                       <div className="flex gap-2 items-start">
                         <div className="mt-0.5 min-w-[14px] text-gray-400"><Package size={12} /></div>
                         <div>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">주요 생산품/서비스</p>
                           <p className="text-xs text-gray-700 font-medium leading-tight">{interview.companyInfo.mainProducts}</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Right: Interview Content */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Briefcase size={18} className="text-blue-500" />
                        주요 담당 직무
                      </h5>
                      <p className="text-sm text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        {interview.companyInfo.keyRole}
                      </p>
                    </div>

                    <div className="relative pt-2">
                      <Quote size={32} className="text-gray-200 absolute -top-1 -left-1" />
                      <div className="relative z-10 pl-4">
                        <h5 className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-2">
                          <Award size={18} className="text-amber-500" />
                          모듈 이수가 취업에 어떤 도움이 되었나요?
                        </h5>
                        <p className="text-base text-gray-700 leading-relaxed italic font-serif">
                          "{interview.interviewQuote}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Building2 size={48} className="mb-4 opacity-20" />
              <p>해당 모듈의 인터뷰 데이터가 없습니다.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white text-center">
          <p className="text-xs text-gray-400">
            * 위 인터뷰는 졸업생의 동의를 얻어 게시되었습니다. 무단 배포를 금합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmploymentModal;
