import React, {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {STUDENTS as fallback} from './constants';
import type {Student,ChartData,NetworkNode,NetworkLink} from './types';
import sheetConfig from './data/sheet-config.json';

export const SYNC_INTERVAL_MS=60000;
type SyncState={source:'demo'|'google-sheet';loading:boolean;error:string|null;lastChecked:string|null;lastApplied:string|null;revision:string|null;totalRows:number|null};
type DataValue=SyncState & {students:Student[];chartData:ChartData[];networkNodes:NetworkNode[];networkLinks:NetworkLink[];refresh:()=>Promise<void>};
const Context=createContext<DataValue|null>(null);

export function StudentDataProvider({children}:{children:React.ReactNode}) {
  const [students,setStudents]=useState<Student[]>(fallback);
  const [sync,setSync]=useState<SyncState>({source:'demo',loading:false,error:null,lastChecked:null,lastApplied:null,revision:null,totalRows:null});
  const requestId=useRef(0);const inflight=useRef<AbortController|null>(null);const revision=useRef<string|null>(null);
  const refresh=useCallback(async()=>{
    if(inflight.current)return;
    const id=++requestId.current;const controller=new AbortController();inflight.current=controller;
    const timer=window.setTimeout(()=>controller.abort(),25000);
    setSync(state=>({...state,loading:true}));
    try {
      const response=await fetch('/api/students',{cache:'no-store',signal:controller.signal});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||'시트 동기화에 실패했습니다.');
      if(payload.source!=='google-sheet'||payload.synthetic!==true||!Array.isArray(payload.students)||payload.students.length<1||payload.students.length>1000||typeof payload.revision!=='string')throw new Error('시트 응답 형식을 확인하지 못했습니다.');
      if(id!==requestId.current)return;
      const changed=revision.current!==payload.revision;
      if(changed){setStudents(payload.students);revision.current=payload.revision;}
      setSync(state=>({...state,source:'google-sheet',loading:false,error:null,lastChecked:payload.fetchedAt,lastApplied:changed?payload.fetchedAt:state.lastApplied,revision:payload.revision,totalRows:payload.totalRows}));
    }catch(error){if(id===requestId.current)setSync(state=>({...state,loading:false,error:error instanceof Error&&error.name!=='AbortError'?error.message:'시트 동기화가 시간 내 완료되지 않았습니다.'}));}
    finally{window.clearTimeout(timer);if(id===requestId.current)inflight.current=null;}
  },[]);
  useEffect(()=>{
    void refresh();
    const interval=window.setInterval(()=>{if(!document.hidden)void refresh();},SYNC_INTERVAL_MS);
    const visible=()=>{if(!document.hidden)void refresh();};
    document.addEventListener('visibilitychange',visible);
    return()=>{window.clearInterval(interval);document.removeEventListener('visibilitychange',visible);requestId.current++;inflight.current?.abort();inflight.current=null;};
  },[refresh]);
  const views=useMemo(()=>{
    const modules=['AI-SW MD','빅데이터 경영','디지털마케팅','스마트팩토리'];
    const chartData=modules.map((module,i)=>({name:['AI-SW','빅데이터','마케팅','팩토리'][i],count:students.filter(s=>s.module===module).length,fill:['#2563eb','#9333ea','#f59e0b','#10b981'][i]}));
    const networkNodes=students.map(s=>({id:s.id,name:s.name,val:s.participationScore/5,group:s.department==='컴퓨터공학과'?1:s.department==='소프트웨어학과'?2:3,grade:s.grade}));
    const groups=new Map<number,Student[]>();for(const s of students){const group=groups.get(s.grade)||[];group.push(s);groups.set(s.grade,group);}
    const networkLinks:NetworkLink[]=[];for(const group of groups.values())if(group.length>1)group.forEach((s,i)=>networkLinks.push({source:s.id,target:group[(i+1)%group.length].id,value:1}));
    return {chartData,networkNodes,networkLinks};
  },[students]);
  const value=useMemo(()=>({...sync,students,...views,refresh}),[sync,students,views,refresh]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useStudentData(){const context=useContext(Context);if(!context)throw new Error('StudentDataProvider is required');return context;}

export function StudentSyncPanel(){
  const data=useStudentData();
  return <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm" aria-label="학생 데이터 동기화">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="font-semibold text-slate-900">학생 데이터 · {data.source==='google-sheet'?'구글시트 연결됨':'내장 합성 데모'} · {data.students.length}명</p>
        <p className="mt-1 text-slate-600">화면이 열려 있으면 60초마다 확인 · 시트에서 앱으로 읽기 전용</p></div>
      <div className="flex flex-wrap gap-2"><a href={sheetConfig.url} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-2 text-blue-700">구글시트 편집</a>
        <button type="button" onClick={()=>void data.refresh()} disabled={data.loading} className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50">{data.loading?'동기화 중…':'지금 동기화'}</button></div>
    </div>
    <p className="mt-2 text-xs text-slate-500" aria-live="polite">최근 확인: {data.lastChecked?new Date(data.lastChecked).toLocaleString('ko-KR'):'아직 없음'} · 마지막 반영: {data.lastApplied?new Date(data.lastApplied).toLocaleString('ko-KR'):'아직 없음'}{data.totalRows!==null?` · 시트 전체 ${data.totalRows.toLocaleString()}건 중 active 행 표시`:''}</p>
    {data.error&&<p role="alert" className="mt-2 text-amber-800">{data.error} {data.source==='google-sheet'?'마지막 정상 반영 데이터를 유지하고 있습니다.':'현재 내장 합성 데모를 표시하고 있습니다.'}</p>}
  </section>;
}
