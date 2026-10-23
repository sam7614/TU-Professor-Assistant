import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { STUDENTS } from '../constants';
import { Student } from '../types';

interface StudentManagementProps {
  onOpenStudentModal: (student: Student) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ onOpenStudentModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredStudents = STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.studentId.includes(searchQuery);
    const matchesModule = selectedModule === 'All' || student.module === selectedModule;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  const modules = Array.from(new Set(STUDENTS.map(s => s.module)));

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">학생 관리</h2>
            <p className="text-gray-500 mt-1 text-sm">전체 지도 학생 목록 및 상세 정보를 관리합니다.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
              <Download size={16} />
              엑셀 다운로드
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-md shadow-blue-200">
              <Plus size={16} />
              학생 추가
            </button>
          </div>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium min-w-[140px]"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              <option value="All">모든 모듈</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <Filter size={14} />
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium min-w-[140px]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">모든 상태</option>
              <option value="Good">양호</option>
              <option value="Warning">상담필요</option>
              <option value="Waiting">신청대기</option>
              <option value="Request">요청</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <Filter size={14} />
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-80 group">
          <input 
            type="text" 
            placeholder="이름, 학번으로 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="p-4 font-semibold pl-6 border-b">학생 정보</th>
                <th className="p-4 font-semibold border-b">연락처</th>
                <th className="p-4 font-semibold border-b">학적/모듈</th>
                <th className="p-4 font-semibold border-b">성적 (GPA)</th>
                <th className="p-4 font-semibold border-b">상태</th>
                <th className="p-4 font-semibold border-b text-center pr-6">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-blue-50/30 transition duration-150 cursor-pointer group"
                  onClick={() => onOpenStudentModal(student)}
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm group-hover:shadow-md transition-all`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{student.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Mail size={12} className="text-gray-400" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Phone size={12} className="text-gray-400" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900 font-medium">{student.department}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold
                      ${student.module === 'AI-SW MD' ? 'bg-blue-100 text-blue-700' : 
                        student.module === '빅데이터 경영' ? 'bg-purple-100 text-purple-700' :
                        student.module === '디지털마케팅' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'}
                    `}>
                      {student.module}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{student.gpa}</span>
                      <span className="text-gray-400 text-xs">/ 4.5</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {student.creditsEarned}학점 이수
                    </div>
                  </td>
                  <td className="p-4">
                    {student.status === 'Good' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> 양호
                      </span>
                    )}
                    {student.status === 'Warning' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> 상담필요
                      </span>
                    )}
                    {student.status === 'Waiting' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 신청대기
                      </span>
                    )}
                    {student.status === 'Request' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> 요청
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-xs text-gray-500">
            전체 <span className="font-bold text-gray-900">{filteredStudents.length}</span>명 중 <span className="font-bold text-gray-900">1-{Math.min(filteredStudents.length, 10)}</span>명 표시
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-white hover:text-gray-600 transition" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:bg-gray-50 transition">2</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:bg-gray-50 transition">3</button>
            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-blue-600 transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;