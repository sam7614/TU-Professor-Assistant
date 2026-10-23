import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { 
  Search, 
  User, 
  BrainCircuit, 
  Network, 
  GraduationCap, 
  AlertTriangle,
  FileText,
  Calendar,
  Share2,
  Users,
  Filter
} from 'lucide-react';
import { STUDENTS, NETWORK_NODES, NETWORK_LINKS } from '../constants';
import { NetworkNode, NetworkLink } from '../types';

interface ConsultationAdvisorProps {}

// Props for the internal D3 component
interface NetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  onNodeClick: (studentId: string) => void;
}

const ConsultationAdvisor: React.FC<ConsultationAdvisorProps> = () => {
  const [activeView, setActiveView] = useState<'individual' | 'network'>('individual');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(STUDENTS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Grade Filter State for Network View
  const [selectedNetworkGrade, setSelectedNetworkGrade] = useState<string>('All');

  const selectedStudent = STUDENTS.find(s => s.id === selectedStudentId) || STUDENTS[0];

  const filteredStudents = STUDENTS.filter(s => 
    s.name.includes(searchTerm) || s.studentId.includes(searchTerm)
  );

  // Data for Radar Chart (Student vs Avg)
  const radarData = [
    { subject: '출석', A: selectedStudent.attendance, B: 90, fullMark: 100 },
    { subject: '중간고사', A: selectedStudent.midtermScore, B: 78, fullMark: 100 },
    { subject: '기말고사', A: selectedStudent.finalScore, B: 75, fullMark: 100 },
    { subject: '과제', A: selectedStudent.assignmentScore, B: 85, fullMark: 100 },
    { subject: '프로젝트', A: selectedStudent.projectScore, B: 80, fullMark: 100 },
    { subject: '참여도', A: selectedStudent.participationScore, B: 70, fullMark: 100 },
  ];

  const barChartData = [
    { name: '중간', score: selectedStudent.midtermScore },
    { name: '기말', score: selectedStudent.finalScore },
    { name: '과제', score: selectedStudent.assignmentScore },
    { name: '프로젝트', score: selectedStudent.projectScore },
  ];

  // Filter Network Data based on Grade
  const filteredNetworkNodes = selectedNetworkGrade === 'All' 
    ? NETWORK_NODES 
    : NETWORK_NODES.filter(n => n.grade === parseInt(selectedNetworkGrade));

  const filteredNodeIds = new Set(filteredNetworkNodes.map(n => n.id));

  // Only show links where both source and target are in the filtered nodes
  const filteredNetworkLinks = NETWORK_LINKS.filter(l => 
    filteredNodeIds.has(l.source as string) && filteredNodeIds.has(l.target as string)
  );

  // D3 Network Graph Component
  const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links, onNodeClick }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltipContent, setTooltipContent] = useState<{name: string, val: number, grade: number, x: number, y: number} | null>(null);

    useEffect(() => {
      if (!svgRef.current || !containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Clear previous graph
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

      // Deep clone data to avoid mutation of props/constants by d3 force simulation
      const simulationNodes = JSON.parse(JSON.stringify(nodes));
      const simulationLinks = JSON.parse(JSON.stringify(links));

      // Simulation setup
      const simulation = d3.forceSimulation<NetworkNode>(simulationNodes)
        .force("link", d3.forceLink<NetworkNode, NetworkLink>(simulationLinks).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide<NetworkNode>().radius(d => d.val * 1.5 + 10));

      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(simulationLinks)
        .join("line")
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 2);

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(simulationNodes)
        .join("circle")
        .attr("r", (d: any) => d.val * 1.2) // Radius based on participation
        .attr("fill", (d: any) => {
          // Color based on grade if we want, or keep group. Let's keep group for variety but maybe tweak logic
          return d.group === 1 ? "#3b82f6" : d.group === 2 ? "#10b981" : "#f59e0b";
        })
        .call(d3.drag<SVGCircleElement, NetworkNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any);

      // Add labels
      const label = svg.append("g")
        .selectAll("text")
        .data(simulationNodes)
        .join("text")
        .text((d: any) => d.name)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("dx", 15)
        .attr("dy", 4)
        .attr("fill", "#374151");

      // Tooltip interaction
      node.on("mouseover", (event, d: any) => {
        setTooltipContent({
          name: d.name,
          val: d.val,
          grade: d.grade,
          x: event.pageX,
          y: event.pageY
        });
        if (event.currentTarget instanceof SVGCircleElement) {
          d3.select(event.currentTarget).attr("stroke", "#000").attr("stroke-width", 3);
        }
      })
      .on("mouseout", (event) => {
        setTooltipContent(null);
        if (event.currentTarget instanceof SVGCircleElement) {
          d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 2);
        }
      })
      .on("click", (event, d: any) => {
        const student = STUDENTS.find(s => s.name === d.name);
        if (student) onNodeClick(student.id);
      });

      simulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        node
          .attr("cx", (d: any) => Math.max(20, Math.min(width - 20, d.x))) // Boundary constraint
          .attr("cy", (d: any) => Math.max(20, Math.min(height - 20, d.y)));

        label
          .attr("x", (d: any) => Math.max(20, Math.min(width - 20, d.x)))
          .attr("y", (d: any) => Math.max(20, Math.min(height - 20, d.y)));
      });

      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return () => {
        simulation.stop();
      };
    }, [nodes, links, onNodeClick]);

    return (
      <div className="relative w-full h-full bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-gray-200" ref={containerRef}>
        <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur p-3 rounded-lg border border-gray-200 shadow-sm pointer-events-none">
           <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
             <Share2 size={16} className="text-blue-600"/>
             클래스 네트워크 맵
           </h4>
           <p className="text-xs text-gray-500 mt-1">
             노드 크기: 수업 참여도 (발화량)<br/>
             링크 두께: 상호작용 빈도
           </p>
           <div className="mt-2 flex gap-2">
             <div className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full bg-blue-500"></span>그룹 A</div>
             <div className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>그룹 B</div>
             <div className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full bg-amber-500"></span>그룹 C</div>
           </div>
        </div>
        
        {nodes.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            해당 학년의 데이터가 없습니다.
          </div>
        ) : (
          <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        )}

        {tooltipContent && (
          <div 
            className="fixed z-50 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px] min-w-[120px]"
            style={{ left: tooltipContent.x, top: tooltipContent.y }}
          >
            <p className="font-bold text-sm mb-1">{tooltipContent.name}</p>
            <p className="opacity-90">{tooltipContent.grade}학년</p>
            <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
               <div className="bg-blue-400 h-full" style={{width: `${(tooltipContent.val / 30) * 100}%`}}></div>
            </div>
            <p className="mt-1 text-[10px] text-gray-400">참여도 점수: {tooltipContent.val}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">학습/진로 상담 어드바이저</h2>
          <p className="text-gray-500 mt-1 text-sm">학생별 상세 데이터 분석 및 AI 기반 상담 가이드를 제공합니다.</p>
        </div>
        
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
          <button 
            onClick={() => setActiveView('individual')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
              activeView === 'individual' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <User size={16} />
            개별 학생 분석
          </button>
          <button 
            onClick={() => setActiveView('network')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
              activeView === 'network' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Users size={16} />
            클래스 네트워크
          </button>
        </div>
      </div>

      <div className="flex h-full gap-6 flex-col lg:flex-row overflow-hidden pb-6">
        
        {/* Left Sidebar: Student List (Always visible in Individual, hidden in Network unless needed) */}
        {activeView === 'individual' && (
          <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px] lg:h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600"/>
                상담 대상 선택
              </h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="이름 검색" 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {filteredStudents.map(student => (
                <div 
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`p-3 rounded-xl mb-1 cursor-pointer transition-all flex items-center gap-3 border ${
                    selectedStudentId === student.id 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-xs font-bold text-gray-600 shrink-0`}>
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`font-bold text-sm truncate ${selectedStudentId === student.id ? 'text-blue-900' : 'text-gray-900'}`}>
                        {student.name}
                      </p>
                      {student.status === 'Warning' && (
                        <AlertTriangle size={14} className="text-red-500" />
                      )}
                      {student.status === 'Waiting' && (
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{student.studentId} • {student.module}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar h-full pr-1">
          
          {activeView === 'individual' ? (
            <>
              {/* Header Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h1>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedStudent.status === 'Warning' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedStudent.status === 'Warning' ? '집중관리필요' : '학업상태양호'}
                      </span>
                    </div>
                    <p className="text-gray-500 flex items-center gap-2 text-sm">
                      <GraduationCap size={16} />
                      {selectedStudent.department} | {selectedStudent.module} 트랙
                    </p>
                  </div>
                  <div className="flex gap-2">
                     <div className="text-right px-4 py-2 bg-blue-50 rounded-xl">
                       <p className="text-xs text-blue-600 font-bold">진로 희망</p>
                       <p className="text-sm font-bold text-gray-900">{selectedStudent.careerGoal}</p>
                     </div>
                     <div className="text-right px-4 py-2 bg-gray-50 rounded-xl">
                       <p className="text-xs text-gray-500 font-bold">총 평점</p>
                       <p className="text-sm font-bold text-gray-900">{selectedStudent.gpa} / 4.5</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                
                {/* 1. Academic Balance (Radar) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <BrainCircuit size={20} className="text-purple-600"/>
                    학업 역량 분석
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">전체 수강생 평균 대비 학생의 영역별 성취도입니다.</p>
                  <div className="h-64 w-full relative -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name={selectedStudent.name} dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                        <Radar name="학과 평균" dataKey="B" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}/>
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                     <p className="text-xs text-purple-800 leading-relaxed">
                       <strong>분석:</strong> {selectedStudent.projectScore < 80 ? '프로젝트 및 실무 역량 강화가 필요합니다.' : '전반적으로 균형 잡힌 학업 성취를 보이고 있습니다.'}
                       {selectedStudent.attendance < 90 && ' 출석률 개선을 위한 지도가 필요합니다.'}
                     </p>
                  </div>
                </div>

                {/* 2. Score Detail (Bar Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600"/>
                    상세 평가 점수
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">이번 학기 주요 평가 항목별 획득 점수입니다. (70점 미만 경고)</p>
                  <div className="h-56 w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px'}} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {
                            barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.score < 70 ? '#ef4444' : '#2563eb'} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <span className="text-xs text-gray-500 block">학기 총점 예상</span>
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round((selectedStudent.midtermScore + selectedStudent.finalScore + selectedStudent.assignmentScore + selectedStudent.projectScore) / 4)}점
                      </span>
                    </div>
                     <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <span className="text-xs text-gray-500 block">과제 제출율</span>
                      <span className="text-lg font-bold text-gray-900">100%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Section: Social & AI Guide */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* 3. Social Network */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Network size={20} className="text-green-600"/>
                    교우 관계 및 협업
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">팀 프로젝트 협업 지수</span>
                        <span className="font-bold text-green-600">{selectedStudent.socialScore}점</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedStudent.socialScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase">주요 협업 동료 (Peer Group)</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedStudent.peerGroup.map((peer, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                            {peer}
                          </span>
                        ))}
                        {selectedStudent.peerGroup.length === 0 && <span className="text-xs text-gray-400">데이터 없음</span>}
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-100 mt-2">
                      <p className="text-xs text-green-800">
                        {selectedStudent.socialScore > 80 
                          ? "동료 평가가 매우 긍정적이며 팀 내 리더십을 발휘하고 있습니다." 
                          : selectedStudent.socialScore < 50 
                            ? "팀 활동 참여가 소극적입니다. 그룹 스터디 참여 독려가 필요합니다."
                            : "원만한 교우 관계를 유지하고 있으나 주도적인 역할 확대가 기대됩니다."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. AI Consultation Guide */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                   {/* Decorative Background */}
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <BrainCircuit size={120} />
                   </div>

                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
                    <Calendar size={20} className="text-blue-400"/>
                    AI 맞춤형 상담 가이드
                  </h3>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">추천 상담 주제</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedStudent.consultationTopics.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition cursor-pointer text-blue-100 rounded-lg text-sm border border-white/10">
                            💬 {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">교수님을 위한 코칭 팁</p>
                      <ul className="text-sm text-slate-200 space-y-2 list-disc list-inside">
                        {selectedStudent.progress < 50 && <li>현재 모듈 이수 진도가 느립니다. 계절학기 수강이나 학습 계획 재수립을 제안해보세요.</li>}
                        {selectedStudent.socialScore < 60 && <li>팀 프로젝트에서 겪는 어려움이 없는지 가볍게 물어봐주세요. (예: "조별 과제 할 때 힘든 점 없니?")</li>}
                        <li>"{selectedStudent.careerGoal}" 진로와 관련하여 최근 학교에서 지원하는 프로그램(캡스톤, 현장실습)을 안내해주면 좋습니다.</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                       <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition shadow-lg shadow-blue-900/50">
                         상담 일지 기록 시작하기
                       </button>
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            // Network View
            <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-lg font-bold text-gray-900">클래스 네트워크 분석</h3>
                   <p className="text-sm text-gray-500">학생 간 상호작용 및 그룹 역학 시각화</p>
                </div>
                
                {/* Grade Filter Controls */}
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <div className="flex items-center px-2 text-gray-400">
                     <Filter size={14} />
                     <span className="text-xs font-bold ml-1">학년 필터</span>
                  </div>
                  {(['All', '1', '2', '3', '4'] as const).map((grade) => (
                     <button
                       key={grade}
                       onClick={() => setSelectedNetworkGrade(grade)}
                       className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                         selectedNetworkGrade === grade 
                           ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                           : 'text-gray-500 hover:bg-gray-100'
                       }`}
                     >
                       {grade === 'All' ? '전체' : `${grade}학년`}
                     </button>
                  ))}
                </div>

              </div>
              
              {/* Stats Bar */}
              <div className="flex gap-3 mb-4">
                  <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                    표시된 학생: {filteredNetworkNodes.length}명
                  </div>
                  <div className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-100">
                    활성 링크: {filteredNetworkLinks.length}개
                  </div>
              </div>

              <div className="flex-1 min-h-[500px] relative">
                <NetworkGraph 
                  nodes={filteredNetworkNodes} 
                  links={filteredNetworkLinks} 
                  onNodeClick={(id) => {
                    setSelectedStudentId(id);
                    setActiveView('individual');
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConsultationAdvisor;