import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Search, 
  Plus, 
  Bell, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from './StatCard';
import { STUDENTS, CHART_DATA } from '../constants';
import { Student } from '../types';

interface DashboardProps {
  onOpenStudentModal: (student: Student) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenStudentModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = STUDENTS.filter(s => 
    s.name.includes(searchQuery) || s.studentId.includes(searchQuery)
  );

  // Show only top 5 students in dashboard
  const displayStudents = filteredStudents.slice(0, 5);

  return (
    <>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">2025학년도 1학기 지도학생 현황</h2>
          <p className="text-gray-500 mt-1 text-sm">AI-SW 융합전공 및 컴퓨터공학과 모듈 이수 현황 대시보드</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72 group">
            <input 
              type="text" 
              placeholder="학생 이름 또는 학번 검색" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm group-hover:shadow-md"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-blue-500 transition-colors" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all text-sm whitespace-nowrap flex items-center gap-2 active:scale-95">
            <Plus size={18} />
            상담 일지 작성
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          metric={{
            label: '총 지도 학생',
            value: 42,
            unit: '명',
            colorClass: 'bg-blue-50 text-blue-600',
            icon: <Users size={24} />
          }} 
        />
        <StatCard 
          metric={{
            label: '평균 모듈 이수율',
            value: 68,
            unit: '%',
            trend: '전학기 대비 5% 증가',
            trendUp: true,
            colorClass: 'bg-green-50 text-green-600',
            icon: <TrendingUp size={24} />
          }} 
        />
        <StatCard 
          metric={{
            label: '상담 필요 (이수부진)',
            value: 5,
            unit: '명',
            trend: '진도율 30% 미만 경고',
            colorClass: 'bg-red-50 text-red-600',
            icon: <AlertCircle size={24} />
          }}
          onClick={() => alert('Filter logic here')}
        />
        <StatCard 
          metric={{
            label: '상담 신청 대기',
            value: 3,
            unit: '건',
            trend: '최근: 오늘 10:00',
            colorClass: 'bg-purple-50 text-purple-600',
            icon: <Clock size={24} />
          }} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Student Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg text-gray-900">학생별 모듈 이수 현황</h3>
            <div className="flex gap-2">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option>전체 보기</option>
                <option>이수 완료 임박</option>
                <option>위험군 (이수 부진)</option>
                <option>상담 요청</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold pl-6">이름/학번</th>
                  <th className="p-4 font-semibold">주력 모듈</th>
                  <th className="p-4 font-semibold">이수 진행률</th>
                  <th className="p-4 font-semibold">최근 상담</th>
                  <th className="p-4 font-semibold">상태</th>
                  <th className="p-4 font-semibold text-center pr-6">관리</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {displayStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-blue-50/50 transition cursor-pointer group"
                    onClick={() => onOpenStudentModal(student)}
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm group-hover:shadow transition-all`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold
                        ${student.module === 'AI-SW MD' ? 'bg-blue-100 text-blue-700' : 
                          student.module === '빅데이터 경영' ? 'bg-purple-100 text-purple-700' :
                          student.module === '디지털마케팅' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'}
                      `}>
                        {student.module}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full ${student.progress < 30 ? 'bg-red-500' : student.progress < 50 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${student.progress < 30 ? 'text-red-600' : 'text-gray-600'}`}>{student.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{student.lastConsultation || '-'}</td>
                    <td className="p-4">
                       {student.status === 'Good' && (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> 양호
                         </span>
                       )}
                       {student.status === 'Warning' && (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> 상담필요
                         </span>
                       )}
                       {student.status === 'Waiting' && (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 신청대기
                         </span>
                       )}
                        {student.status === 'Request' && (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> 요청
                         </span>
                       )}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center bg-gray-50/50">
            <button className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">전체 학생 명단 보기 ↓</button>
          </div>
        </div>

        {/* Right Side Widgets */}
        <div className="flex flex-col gap-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6">모듈별 학생 분포</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    interval={0}
                    tick={{fill: '#6b7280'}}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Messages Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">최근 메시지 & 알림</h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">모두 읽음</button>
            </div>
            <ul className="space-y-6 flex-1">
              <li className="flex gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div className="flex justify-between items-baseline w-full">
                    <p className="text-sm font-bold text-gray-800">박민수 학생</p>
                    <span className="text-gray-400 font-normal text-[10px]">10분 전</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">"교수님, 이번 캡스톤 디자인 수업 관련하여 상담 가능할까요?"</p>
                  <button className="text-[10px] text-blue-600 mt-1.5 font-medium hover:text-blue-700 transition-colors">답장하기</button>
                </div>
              </li>
              <li className="flex gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Bell size={18} />
                </div>
                <div>
                   <div className="flex justify-between items-baseline w-full">
                    <p className="text-sm font-bold text-gray-800">이수 경고 알림</p>
                    <span className="text-gray-400 font-normal text-[10px]">어제</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">이지은 학생의 '알고리즘' 과목 출석률이 80% 미만입니다.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;