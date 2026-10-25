import React, { useState } from 'react';
import { 
  BarChart,
  Cell, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen,
  PieChart as PieChartIcon,
  Activity,
  Briefcase
} from 'lucide-react';
import { MODULE_TRENDS, MODULE_COMPETENCIES, EMPLOYMENT_INTERVIEWS } from '../constants';
import { useStudentData } from '../StudentData';
import StatCard from './StatCard';
import EmploymentModal from './EmploymentModal';

const ModuleAnalytics: React.FC = () => {
  const {chartData: CHART_DATA} = useStudentData();
  const [selectedEmploymentModule, setSelectedEmploymentModule] = useState<string | null>(null);

  const handleOpenEmploymentModal = (moduleName: string) => {
    setSelectedEmploymentModule(moduleName);
  };

  const handleCloseEmploymentModal = () => {
    setSelectedEmploymentModule(null);
  };

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <header className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">모듈 분석 통계</h2>
          <p className="text-gray-500 mt-1 text-sm">모듈별 학업 성취도, 역량 분포, GPA 추이 등을 종합적으로 분석합니다.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          metric={{
            label: '전체 수강 인원',
            value: 42,
            unit: '명',
            trend: '전학기 대비 12% 증가',
            trendUp: true,
            colorClass: 'bg-blue-50 text-blue-600',
            icon: <Users size={24} />
          }} 
        />
        <StatCard 
          metric={{
            label: '평균 GPA',
            value: 3.72,
            unit: '/ 4.5',
            trend: '전체 평균 상회',
            trendUp: true,
            colorClass: 'bg-green-50 text-green-600',
            icon: <Award size={24} />
          }} 
        />
        <StatCard 
          metric={{
            label: '모듈 이수율',
            value: 68,
            unit: '%',
            trend: '목표치(70%) 근접',
            colorClass: 'bg-purple-50 text-purple-600',
            icon: <TrendingUp size={24} />
          }} 
        />
        <StatCard 
          metric={{
            label: '학습 참여도',
            value: 85,
            unit: '점',
            trend: '실습 과목 참여도 우수',
            colorClass: 'bg-amber-50 text-amber-600',
            icon: <Activity size={24} />
          }} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* GPA Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              모듈별 GPA 성장 추이
            </h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-600"></span>AI-SW</span>
               <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-600"></span>빅데이터</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MODULE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[2.5, 4.5]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="AI-SW" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="BigData" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Marketing" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Factory" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BookOpen size={20} className="text-purple-600" />
              모듈별 핵심 역량 비교
            </h3>
          </div>
          <div className="h-64 w-full relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MODULE_COMPETENCIES}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="AI-SW" dataKey="AI-SW" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="빅데이터" dataKey="BigData" stroke="#9333ea" fill="#9333ea" fillOpacity={0.3} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
         {/* Student Distribution */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PieChartIcon size={20} className="text-gray-600" />
              모듈별 수강생 분포
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} layout="vertical" barSize={24}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
         
         {/* Detailed Stats Table */}
         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">모듈별 상세 지표</h3>
              <p className="text-xs text-gray-500 mt-1">* '취업 연계율'을 클릭하면 취업자 인터뷰를 확인할 수 있습니다.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">모듈명</th>
                    <th className="p-4 font-semibold text-center">수강생</th>
                    <th className="p-4 font-semibold text-center">평균 평점</th>
                    <th className="p-4 font-semibold text-center">이수율</th>
                    <th className="p-4 font-semibold text-center">취업 연계율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {[
                    { name: 'AI-SW MD', students: 18, gpa: 3.9, completion: 72, employment: 85, color: 'text-blue-600' },
                    { name: '빅데이터 경영', students: 12, gpa: 3.8, completion: 65, employment: 80, color: 'text-purple-600' },
                    { name: '디지털마케팅', students: 5, gpa: 3.8, completion: 78, employment: 75, color: 'text-amber-600' },
                    { name: '스마트팩토리', students: 4, gpa: 3.7, completion: 60, employment: 90, color: 'text-emerald-600' }
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6 font-bold text-gray-800">{row.name}</td>
                      <td className="p-4 text-center text-gray-600">{row.students}명</td>
                      <td className={`p-4 text-center font-medium ${row.color}`}>{row.gpa} / 4.5</td>
                      <td className="p-4 text-center text-gray-600">{row.completion}%</td>
                      <td 
                        className="p-4 text-center cursor-pointer group"
                        onClick={() => handleOpenEmploymentModal(row.name)}
                      >
                         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                            <Briefcase size={14} className="text-gray-400 group-hover:text-blue-600" />
                            {row.employment}%
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
      </div>

      {selectedEmploymentModule && (
        <EmploymentModal 
          moduleName={selectedEmploymentModule}
          interviews={EMPLOYMENT_INTERVIEWS}
          onClose={handleCloseEmploymentModal}
        />
      )}
    </div>
  );
};

export default ModuleAnalytics;