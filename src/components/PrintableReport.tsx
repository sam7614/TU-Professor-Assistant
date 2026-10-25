import React from 'react';
import { Student } from '../types';

interface PrintableReportProps {
  student: Student;
}

const PrintableReport: React.FC<PrintableReportProps> = ({ student }) => {
  return (
    <div className="hidden print:block fixed inset-0 z-[9999] bg-white p-8">
      <div className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold text-center">학생 학습설계 상담 기초자료</h1>
        <p className="text-center text-gray-600 mt-2">합성 데이터 시나리오 · 실제 학생 상담 결과 아님</p>
      </div>

      <div className="flex justify-between mb-8">
        <div className="w-1/2 pr-4">
          <table className="w-full text-left">
            <tbody>
              <tr><th className="py-2 w-24 align-top">성명</th><td>{student.name}</td></tr>
              <tr><th className="py-2 align-top">학번</th><td>{student.studentId}</td></tr>
              <tr><th className="py-2 align-top">현재 학기</th><td>{student.grade}학년 · 합성 시나리오</td></tr>
            </tbody>
          </table>
        </div>
        <div className="w-1/2 pl-4 text-right">
          <table className="w-full text-left">
            <tbody>
              <tr><th className="py-2 w-24 align-top">지도교수</th><td>미지정</td></tr>
              <tr><th className="py-2 align-top">상담일자</th><td>출력일: {new Date().toLocaleDateString('ko-KR')} (상담 실시일 아님)</td></tr>
              <tr><th className="py-2 align-top">선택 모듈 학점</th><td>{student.creditsEarned} / {student.totalCredits}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold border-b border-gray-400 mb-4 pb-2">1. 모듈 이수 현황</h3>
        <div className="border border-gray-300 p-8 h-48 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center">
            <p className="font-bold text-lg mb-2">{student.module} 진행률</p>
            <div className="w-64 bg-gray-200 h-4 rounded-full mx-auto">
                <div className="bg-black h-4 rounded-full" style={{ width: `${student.progress}%` }}></div>
            </div>
            <p className="mt-2 text-sm">{student.progress}% 완료</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">* 합성 이수 현황입니다. 수록 과목만 포함하며 대학 전체 성적표·졸업 판정이 아닙니다.</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold border-b border-gray-400 mb-4 pb-2">2. AI 학습 분석 및 제언</h3>
        <div className="bg-gray-50 p-6 rounded border border-gray-200 text-sm leading-relaxed text-justify">
          {student.analysis}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold border-b border-gray-400 mb-4 pb-2">3. 금일 상담 기록</h3>
        <div className="border border-gray-300 p-4 h-64 rounded bg-white">
          <p className="text-gray-400 text-sm">(상담 내용 및 지도 사항 수기 기록)</p>
        </div>
      </div>

      <div className="text-center mt-12 pt-8">
        <p className="text-sm mb-12">실제 상담을 진행한 경우에만 아래에 확인 서명합니다.</p>
        <div className="flex justify-around">
          <div>학생 서명: ________________ (인)</div>
          <div>교수 서명: ________________ (인)</div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;