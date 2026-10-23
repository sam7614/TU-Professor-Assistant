
import { Student, ChartData, Message, NetworkNode, NetworkLink, EmploymentInterview } from './types';

// Helper to generate random data
const firstNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '지유', '서연', '민서', '하은', '지우', '수아', '서현', '예은', '유진', '현우', '건우', '우진', '선우', '정우', '준혁', '승우', '지훈', '현준', '은우', '지아', '서아', '채원', '지수'];
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];

const departments = ['컴퓨터공학과', '소프트웨어학과', 'AI융합학과'];
const modules = ['AI-SW MD', '빅데이터 경영', '디지털마케팅', '스마트팩토리'];
const careers = ['AI 연구원', '웹 개발자', '데이터 분석가', '클라우드 엔지니어', '보안 전문가', 'PM/기획자', '대학원 진학', '창업'];
const statuses: ('Good' | 'Warning' | 'Request' | 'Waiting')[] = ['Good', 'Good', 'Good', 'Warning', 'Waiting', 'Request'];
const colors = ['bg-gray-200', 'bg-blue-100', 'bg-red-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100'];

// AI Summary Templates
const aiTemplates = [
  {
    attendance: "출석률이 매우 우수하며 수업 태도가 성실합니다.",
    trend: "꾸준히 성적이 상승하는 추세입니다.",
    assign: "과제 완성도가 높고 코드가 깔끔합니다.",
    network: "학업 중심의 교우 관계가 형성되어 있습니다.",
    sentiment: 'Positive' as const
  },
  {
    attendance: "간헐적인 지각이 있으나 출석률은 양호합니다.",
    trend: "이론 과목에 비해 실습 점수가 다소 낮습니다.",
    assign: "기한은 준수하나 내용 보완이 필요합니다.",
    network: "다양한 그룹과 어울리며 사교성이 좋습니다.",
    sentiment: 'Neutral' as const
  },
  {
    attendance: "최근 결석 빈도가 늘어나고 있어 주의가 필요합니다.",
    trend: "전학기 대비 평점이 하락했습니다.",
    assign: "과제 제출이 늦거나 미제출 건이 존재합니다.",
    network: "교내 활동보다는 교외 활동 비중이 큽니다.",
    sentiment: 'Concern' as const
  }
];

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  let idCounter = 1;

  for (let grade = 1; grade <= 4; grade++) {
    for (let i = 0; i < 30; i++) {
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const module = modules[Math.floor(Math.random() * modules.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const template = status === 'Good' ? aiTemplates[0] : status === 'Warning' ? aiTemplates[2] : aiTemplates[1];

      // Generate Student ID based on grade
      const year = 2026 - grade; // 1학년=2025, 4학년=2022
      const studentId = `${year}${String(Math.floor(Math.random() * 9000) + 1000)}`;

      // Scores randomized based on status
      const baseScore = status === 'Good' ? 85 : status === 'Warning' ? 50 : 70;
      const randomScore = () => Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * 30) - 15));

      students.push({
        id: String(idCounter++),
        name: `${lastName}${firstName}`,
        studentId: studentId,
        department: dept,
        grade: grade,
        module: module,
        progress: grade === 1 ? Math.floor(Math.random() * 20) + 10 : grade === 4 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 30,
        lastConsultation: Math.random() > 0.5 ? `2024.0${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 28) + 1}` : null,
        status: status,
        gpa: parseFloat((Math.random() * 2.5 + 2.0).toFixed(2)),
        creditsEarned: (grade - 1) * 35 + Math.floor(Math.random() * 10),
        totalCredits: 130,
        generalProgress: Math.min(100, (grade - 1) * 25 + 20),
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        analysis: `현재 ${grade}학년으로 ${module} 트랙을 이수 중입니다. ${template.trend} ${template.attendance}`,
        email: `${year}${i}@tu.ac.kr`,
        phone: `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        attendance: Math.floor(Math.random() * 20) + 80,
        midtermScore: randomScore(),
        finalScore: randomScore(),
        assignmentScore: randomScore(),
        projectScore: randomScore(),
        participationScore: randomScore(),
        socialScore: Math.floor(Math.random() * 40) + 60,
        careerGoal: careers[Math.floor(Math.random() * careers.length)],
        peerGroup: [], // Will populate later
        consultationTopics: ["진로 상담", "학업 부진", "장학금 문의", "현장 실습"],
        aiSummary: {
          attendanceAnalysis: template.attendance,
          academicTrend: template.trend,
          assignmentQuality: template.assign,
          networkIntimacy: template.network,
          overallSentiment: template.sentiment
        }
      });
    }
  }

  // Populate peer groups randomly within same grade
  students.forEach(s => {
    const peers = students.filter(p => p.grade === s.grade && p.id !== s.id);
    const peerCount = Math.floor(Math.random() * 3);
    for(let k=0; k<peerCount; k++) {
        const randomPeer = peers[Math.floor(Math.random() * peers.length)];
        if(randomPeer && !s.peerGroup.includes(randomPeer.name)) {
            s.peerGroup.push(randomPeer.name);
        }
    }
  });

  return students;
};

export const STUDENTS: Student[] = generateStudents();

// Generate Chart Data from Students
const getChartData = () => {
    const counts = { 'AI-SW MD': 0, '빅데이터 경영': 0, '디지털마케팅': 0, '스마트팩토리': 0 };
    STUDENTS.forEach(s => {
        if(counts[s.module as keyof typeof counts] !== undefined) {
            counts[s.module as keyof typeof counts]++;
        }
    });
    return [
        { name: 'AI-SW', count: counts['AI-SW MD'], fill: '#2563eb' },
        { name: '빅데이터', count: counts['빅데이터 경영'], fill: '#9333ea' },
        { name: '마케팅', count: counts['디지털마케팅'], fill: '#f59e0b' },
        { name: '팩토리', count: counts['스마트팩토리'], fill: '#10b981' },
    ];
};

export const CHART_DATA: ChartData[] = getChartData();

export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'System',
    content: '상담 주제: 진로 및 모듈 이수 계획. 내용: AI 분야 취업 희망하여 관련 프로젝트 경험 부족을 고민함.',
    time: '2024.05.20 14:00',
    isMe: false,
    type: 'system'
  },
  {
    id: 2,
    sender: '학생',
    content: '교수님, 추천해주신 현장실습 기업 리스트 확인했습니다. 지원서 작성 중인데 조언 부탁드려도 될까요?',
    time: '어제 10:30 AM',
    isMe: false,
    type: 'message'
  },
  {
    id: 3,
    sender: '나',
    content: '그래. 초안 작성해서 메일로 보내주면 피드백 줄게. 내일 오후에 시간 괜찮으니 연구실 들러도 좋다.',
    time: '어제 11:15 AM',
    isMe: true,
    type: 'message'
  }
];

// Generate Network Nodes from STUDENTS
// We will select a subset or all students for the visualization
// Let's use all 120 students but give them random sizes and groups
export const NETWORK_NODES: NetworkNode[] = STUDENTS.map(s => ({
    id: s.id,
    name: s.name,
    val: s.participationScore / 5, // Scale for visualization
    group: s.department === '컴퓨터공학과' ? 1 : s.department === '소프트웨어학과' ? 2 : 3,
    grade: s.grade
}));

// Generate Random Links
// Links usually happen within the same grade, sometimes across
const generateLinks = (): NetworkLink[] => {
    const links: NetworkLink[] = [];
    const linkCount = 200; // Total interactions
    
    for(let i=0; i<linkCount; i++) {
        const source = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
        // 80% chance to link with same grade
        let target;
        if (Math.random() > 0.2) {
             const sameGrade = STUDENTS.filter(s => s.grade === source.grade && s.id !== source.id);
             target = sameGrade[Math.floor(Math.random() * sameGrade.length)];
        } else {
             target = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
        }

        if (target && source.id !== target.id) {
            links.push({
                source: source.id,
                target: target.id,
                value: Math.floor(Math.random() * 5) + 1
            });
        }
    }
    return links;
};

export const NETWORK_LINKS: NetworkLink[] = generateLinks();

// Module Analytics Data (Static for now, could be calculated)
export const MODULE_TRENDS = [
  { semester: '1-1', 'AI-SW': 3.2, 'BigData': 3.1, 'Marketing': 3.5, 'Factory': 3.0 },
  { semester: '1-2', 'AI-SW': 3.4, 'BigData': 3.3, 'Marketing': 3.6, 'Factory': 3.2 },
  { semester: '2-1', 'AI-SW': 3.6, 'BigData': 3.5, 'Marketing': 3.7, 'Factory': 3.4 },
  { semester: '2-2', 'AI-SW': 3.8, 'BigData': 3.6, 'Marketing': 3.8, 'Factory': 3.5 },
  { semester: '3-1', 'AI-SW': 3.9, 'BigData': 3.8, 'Marketing': 3.8, 'Factory': 3.7 },
];

export const MODULE_COMPETENCIES = [
  { subject: '이론지식', 'AI-SW': 90, 'BigData': 85, 'Marketing': 70, 'Factory': 80 },
  { subject: '실무구현', 'AI-SW': 85, 'BigData': 80, 'Marketing': 75, 'Factory': 95 },
  { subject: '문제해결', 'AI-SW': 88, 'BigData': 88, 'Marketing': 80, 'Factory': 85 },
  { subject: '의사소통', 'AI-SW': 70, 'BigData': 75, 'Marketing': 95, 'Factory': 70 },
  { subject: '창의성', 'AI-SW': 80, 'BigData': 70, 'Marketing': 90, 'Factory': 75 },
];

export const EMPLOYMENT_INTERVIEWS: EmploymentInterview[] = [
  {
    id: 'e1',
    name: '김태영',
    studentId: '20182233',
    module: 'AI-SW MD',
    company: '네이버 (Naver)',
    role: 'AI Search Engineer',
    interviewQuote: "AI-SW 모듈의 '자연어 처리 심화' 수업에서 진행했던 챗봇 프로젝트가 실제 입사 면접에서 큰 도움이 되었습니다. 이론뿐만 아니라 실제 파이프라인을 구축해본 경험이 실무 적응에 결정적이었습니다.",
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=KimTaeyoung&backgroundColor=c0aede',
    companyInfo: {
      keyRole: '대규모 검색 모델 최적화 및 자연어 이해(NLU) 연구',
      coreIndustry: 'IT 플랫폼 / 인터넷 서비스',
      mainProducts: '네이버 검색, 클로바 AI'
    }
  },
  {
    id: 'e2',
    name: '이수민',
    studentId: '20190011',
    module: 'AI-SW MD',
    company: 'BNK시스템',
    role: '금융 IT 개발자',
    interviewQuote: "부산/경남 지역 최고의 금융 IT 기업에 입사하게 되어 기쁩니다. 모듈 수업에서 배운 핀테크 보안 기초와 데이터베이스 설계 실습이 금융 시스템 이해에 큰 밑거름이 되었습니다.",
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=LeeSoomin&backgroundColor=b6e3f4',
    companyInfo: {
      keyRole: '금융 계정계/정보계 시스템 개발 및 운영',
      coreIndustry: '금융 IT / SI',
      mainProducts: '부산은행/경남은행 뱅킹 시스템'
    }
  },
  {
    id: 'e3',
    name: '박진호',
    studentId: '20191234',
    module: '빅데이터 경영',
    company: 'LG CNS',
    role: 'Data Analyst',
    interviewQuote: "빅데이터 경영 모듈에서 배운 통계적 분석 방법론이 현업 데이터 분석 업무의 기초가 되었습니다. 경영학적 마인드와 데이터 기술을 동시에 배운 것이 저만의 강점이 되었습니다.",
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ParkJinho&backgroundColor=ffdfbf',
    companyInfo: {
      keyRole: '고객 데이터 분석 및 DX 컨설팅',
      coreIndustry: 'IT 서비스 / SI',
      mainProducts: '스마트 물류, 제조 DX 솔루션'
    }
  },
  {
    id: 'e4',
    name: '최유리',
    studentId: '20189988',
    module: '디지털마케팅',
    company: '팬스타 (PanStar)',
    role: '글로벌 마케팅 기획',
    interviewQuote: "부산의 대표적인 해운/크루즈 기업에서 마케터로 일하고 있습니다. 디지털 마케팅 모듈에서 배운 타겟 고객 분석 기법을 활용해 일본 관광객 대상 프로모션을 성공적으로 기획할 수 있었습니다.",
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ChoiYuri&backgroundColor=ffd5dc',
    companyInfo: {
      keyRole: '크루즈/화물 운송 서비스 마케팅 전략 수립',
      coreIndustry: '해운 / 물류 / 관광',
      mainProducts: '팬스타 드림호, 고속화물페리'
    }
  },
  {
    id: 'e5',
    name: '정민호',
    studentId: '20195566',
    module: '스마트팩토리',
    company: 'DRB동일',
    role: '생산 기술 엔지니어',
    interviewQuote: "스마트팩토리 모듈의 IoT 센서 데이터 수집 실습이 실제 공장 자동화 직무와 매우 유사했습니다. 부산의 건실한 중견기업인 DRB에서 자동화 라인을 설계하는 꿈을 이뤘습니다.",
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JungMinho&backgroundColor=d1d4f9',
    companyInfo: {
      keyRole: '제조 공정 자동화 시스템 설계 및 유지보수',
      coreIndustry: '고무 제품 제조업 / 자동차 부품',
      mainProducts: '전동 벨트, 비히클 실링, 자동화 설비'
    }
  },
  {
    id: 'e6',
    name: '강지훈',
    studentId: '20197788',
    module: '스마트팩토리',
    company: 'S&T모티브',
    role: '품질 관리(QC)',
    interviewQuote: "자동차 모터 부품 정밀도를 다루는 곳이라 데이터 분석 능력이 필수적입니다. 학교에서 배운 공정 데이터 시각화 프로젝트 덕분에 면접에서 좋은 점수를 받았습니다.",
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=KangJihoon&backgroundColor=c0aede',
    companyInfo: {
      keyRole: '자동차 부품 품질 데이터 분석 및 공정 개선',
      coreIndustry: '자동차 부품 제조업 / 방위산업',
      mainProducts: '친환경 모터, 파워트레인 부품, K2 소총'
    }
  }
];
