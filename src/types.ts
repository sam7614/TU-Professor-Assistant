
import React from 'react';
import type { SimulationNodeDatum } from 'd3';

export interface AiSummary {
  attendanceAnalysis: string;
  academicTrend: string;
  assignmentQuality: string;
  networkIntimacy: string;
  overallSentiment: 'Positive' | 'Neutral' | 'Concern';
}

export interface Student {
  college?: string;
  departmentId?: string;
  moduleId?: string;
  curriculumVersion?: string;
  gradedCredits?: number;
  courseRecords?: {courseRowId: string; status: 'completed'|'failed'|'in-progress'|'planned'; gradePoint: number|null}[];

  id: string;
  name: string;
  studentId: string;
  department: string;
  grade: number; // Added grade field
  module: string;
  progress: number;
  lastConsultation: string | null;
  status: 'Good' | 'Warning' | 'Request' | 'Waiting';
  gpa: number;
  creditsEarned: number;
  totalCredits: number;
  generalProgress: number;
  avatarColor: string;
  analysis: string;
  email: string;
  phone: string;
  
  // New Analytics Fields
  attendance: number; // 0-100
  midtermScore: number;
  finalScore: number;
  assignmentScore: number;
  projectScore: number;
  participationScore: number; // 0-100 (In-class)
  socialScore: number; // 0-100 (Peer network)
  careerGoal: string;
  peerGroup: string[]; // Names of close friends/collaborators
  consultationTopics: string[]; // Suggested topics

  // AI Detailed Analysis
  aiSummary: AiSummary;
}

export interface StatMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  colorClass: string;
  icon: React.ReactNode;
}

export interface ChartData {
  name: string;
  count: number;
  fill: string;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  type: 'message' | 'system';
}

// Network Visualization Types
export interface NetworkNode extends SimulationNodeDatum {
  id: string;
  name: string;
  val: number; // Node size (participation)
  group: number; // Color group
  grade: number; // Grade level (1-4)
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number; // Link thickness (interaction frequency)
}

export interface CompanyInfo {
  keyRole: string;      // 중요직무
  coreIndustry: string; // 핵심산업
  mainProducts: string; // 주요생산품
}

export interface EmploymentInterview {
  id: string;
  name: string;
  studentId: string;
  module: string;
  company: string;
  role: string;
  interviewQuote: string;
  avatarUrl: string; // URL for caricature
  companyInfo: CompanyInfo; // Detailed company info
}
