import React,{useMemo,useState} from 'react';
import {useStudentData} from '../StudentData';
import curriculum from '../data/tu-curriculum.json';

export default function ModuleAnalytics(){
 const {students}=useStudentData();const [college,setCollege]=useState('All');const [department,setDepartment]=useState('All');const [query,setQuery]=useState('');
 const departments=curriculum.departments.filter(d=>college==='All'||d.college===college);
 const rows=useMemo(()=>curriculum.modules.filter(m=>(college==='All'||m.college===college)&&(department==='All'||m.departmentId===department)&&(`${m.module} ${m.department}`).toLowerCase().includes(query.toLowerCase())).map(m=>{const cohort=students.filter(s=>s.moduleId===m.moduleId);return {...m,count:cohort.length,average:cohort.length?Math.round(cohort.reduce((sum,s)=>sum+s.progress,0)/cohort.length):null,completed:cohort.filter(s=>s.progress===100).length}}),[students,college,department,query]);
 return <div>
  <h2 className="text-2xl font-bold">동명대학교 모듈 교육과정</h2>
  <p className="mt-2 text-sm text-slate-600">2026 공식 가이드북의 4개 단과대학 · 24개 학과 · 234개 모듈 · 907개 로드맵 항목</p>
  <p className="mt-2 text-sm text-amber-800">교육과정 명칭·학점·학기는 공식 자료입니다. 학생 배정·이수·성적은 합성이며, 아래 평점과 이수율은 선택 모듈에 수록된 과목 기준입니다.</p>
  <a className="mt-3 inline-block text-sm text-blue-700 underline" href={curriculum.sourceUrl} target="_blank" rel="noreferrer">공식 모듈 가이드북 확인</a>
  <div className="my-5 flex flex-wrap gap-3">
   <select aria-label="교육과정 단과대학" className="max-w-full rounded-lg border p-2" value={college} onChange={e=>{setCollege(e.target.value);setDepartment('All')}}><option value="All">전체 단과대학</option>{curriculum.colleges.map(c=><option key={c.collegeId}>{c.college}</option>)}</select>
   <select aria-label="교육과정 학과" className="max-w-full rounded-lg border p-2" value={department} onChange={e=>setDepartment(e.target.value)}><option value="All">전체 학과</option>{departments.map(d=><option key={d.departmentId} value={d.departmentId}>{d.department}</option>)}</select>
   <input aria-label="교육과정 검색" className="max-w-full rounded-lg border p-2" placeholder="모듈·학과 검색" value={query} onChange={e=>setQuery(e.target.value)}/>
  </div>
  <p className="mb-3 text-sm text-slate-600">표시 모듈 {rows.length}개 · 배정 인원은 현재 연결된 합성 학생 기준</p>
  <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr>{['단과대학 / 학과','모듈 / 유형','로드맵 항목','요구학점','합성 배정','평균 이수율','이수 완료'].map(h=><th key={h} className="whitespace-nowrap p-3">{h}</th>)}</tr></thead><tbody>{rows.map(m=><tr key={m.moduleId} className="border-t"><td className="p-3"><span className="block text-xs text-slate-500">{m.college}</span>{m.department}</td><td className="p-3"><a className="text-blue-700 underline" href={m.sourceUrl} target="_blank" rel="noreferrer">{m.module}</a><span className="block text-xs text-slate-500">{m.moduleId} · {m.moduleType}</span></td><td className="p-3">{m.roadmapRowCount}</td><td className="p-3">{m.publishedCredits}</td><td className="p-3">{m.count}</td><td className="p-3">{m.average===null?'미배정':`${m.average}%`}</td><td className="p-3">{m.completed}</td></tr>)}</tbody></table></div>
 </div>;
}
