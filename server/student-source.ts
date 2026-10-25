import { createHash } from 'node:crypto';
import curriculum from '../src/data/tu-curriculum.json' with {type:'json'};
import type { Student } from '../src/types.ts';

export const MAX_ACTIVE = 1000;
export const MAX_ROWS = 25000;
export const MAX_BYTES = 16 * 1024 * 1024;
const MODULES = [...new Set(['AI-SW MD', '빅데이터 경영', '디지털마케팅', '스마트팩토리', ...curriculum.modules.map(m=>m.module)])];
const STATUS = ['Good', 'Warning', 'Request', 'Waiting'];
const REQUIRED = ['active','synthetic','id','name','department','grade','module','moduleCreditsEarned','moduleCreditsRequired','creditsEarned','totalCredits','gpa','attendance','status','careerGoal','midtermScore','finalScore','assignmentScore','projectScore','participationScore','socialScore','lastConsultation','scenario','reflection','planChangeReason','prerequisiteMet','plannedSemesterCredits','selectedModules'];

export class DataError extends Error {}

// RFC4180-style quoted CSV, including embedded commas/newlines and escaped quotes.
export function parseCsv(text: string): string[][] {
  if (Buffer.byteLength(text) > MAX_BYTES) throw new DataError('시트 크기가 16MB 한도를 넘었습니다.');
  const result: string[][] = []; let row: string[] = []; let field = ''; let quoted = false; let closed = false;
  const pushField = () => { row.push(field); field = ''; closed = false; };
  const pushRow = () => { pushField(); if (row.some(value => value.trim() !== '')) result.push(row); row = []; if (result.length > MAX_ROWS + 1) throw new DataError('시트 행 수 한도는 25,000건입니다.'); };
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) { if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; closed = true; } } else field += ch; }
    else if (ch === ',') pushField();
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; pushRow(); }
    else if (ch === '"' && field.length === 0 && !closed) quoted = true;
    else { if (closed || ch === '"') throw new DataError('CSV 따옴표 형식이 올바르지 않습니다.'); field += ch; }
  }
  if (quoted) throw new DataError('CSV 따옴표가 닫히지 않았습니다.');
  if (field.length || row.length || closed) pushRow();
  return result;
}

export function studentsFromCsv(csv: string) {
  const matrix = parseCsv(csv); const headers = matrix.shift()?.map(s => s.trim()) || [];
  if (new Set(headers).size !== headers.length || REQUIRED.some(k => !headers.includes(k))) throw new DataError('Students 첫 행의 필수 영문 헤더가 없거나 중복되었습니다. Guide 탭을 확인하세요.');
  const ids = new Set<string>(); const students: Student[] = []; const errors: string[] = [];
  for (const [index, cells] of matrix.entries()) {
    const rowNo = index + 2;
    try {
      if (cells.length > headers.length) throw new DataError('헤더보다 열 수가 많습니다.');
      const row = Object.fromEntries(headers.map((key, i) => [key, (cells[i] ?? '').trim()]));
      const fail = (field: string) => { throw new DataError(`${field} 값을 확인하세요.`); };
      const bool = (key: string) => { const val = row[key].toLowerCase(); if (['true','1'].includes(val)) return true; if (['false','0'].includes(val)) return false; return fail(key); };
      const number = (key: string, min: number, max: number, whole = false) => {
        const value = row[key]; if (!/^(?:\d+\.?\d*|\.\d+)$/.test(value)) return fail(key);
        const n = Number(value); if (!Number.isFinite(n) || n < min || n > max || (whole && !Number.isInteger(n))) return fail(key); return n;
      };
      if (!bool('synthetic')) throw new DataError('공개 데모에는 synthetic=TRUE인 합성 자료만 연결할 수 있습니다.');
      if (!/^SYN-\d{7}$/.test(row.id) || !row.name.startsWith('가상학생') || row.name.length > 80) return fail('id/name (합성 식별자)');
      if (ids.has(row.id)) throw new DataError('중복 id가 있습니다.'); ids.add(row.id);
      if (!bool('active')) continue;
      const grade = number('grade',1,4,true); const moduleIndex = MODULES.indexOf(row.module); if (moduleIndex < 0) return fail('module');
      if (!STATUS.includes(row.status)) return fail('status');
      if (!row.department || row.department.length > 80) return fail('department');
      const moduleCreditsEarned = number('moduleCreditsEarned',0,200); const moduleCreditsRequired = number('moduleCreditsRequired',1,200);
      const creditsEarned = number('creditsEarned',0,300); const totalCredits = number('totalCredits',1,300);
      if (moduleCreditsEarned > moduleCreditsRequired || creditsEarned > totalCredits || moduleCreditsEarned > creditsEarned) throw new DataError('취득학점과 요구학점의 범위가 일치하지 않습니다.');
      const optionalText = (key: string) => { if (row[key].length > 2000) return fail(key); return row[key] || null; };
      const lastConsultation = optionalText('lastConsultation');
      if (lastConsultation) { const normalized = lastConsultation.replaceAll('.', '-'); if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized) || Number.isNaN(Date.parse(normalized)) || new Date(normalized).toISOString().slice(0,10) !== normalized) return fail('lastConsultation (YYYY-MM-DD)'); }
      const selectedModules = row.selectedModules.split('|').map(s=>s.trim()).filter(Boolean);
      if (!selectedModules.length || !selectedModules.includes(row.module) || selectedModules.some(s=>!MODULES.includes(s))) return fail('selectedModules');
      const progress = Math.round(moduleCreditsEarned / moduleCreditsRequired * 100);
      const syntheticFields = {synthetic:true,datasetVersion:'pb-google-sheet-v1',scenario:optionalText('scenario'),moduleCreditsEarned,moduleCreditsRequired,selectedModules,reflection:optionalText('reflection'),planChangeReason:optionalText('planChangeReason'),prerequisiteMet:bool('prerequisiteMet'),plannedSemesterCredits:number('plannedSemesterCredits',0,40,true)};
      const student: Student = {
        id:row.id,studentId:row.id,name:row.name,department:row.department,grade,module:row.module,progress,lastConsultation,status:row.status as Student['status'],
        gpa:number('gpa',0,4.5),creditsEarned,totalCredits,generalProgress:Math.round(creditsEarned/totalCredits*100),avatarColor:['bg-blue-100','bg-green-100','bg-purple-100','bg-yellow-100'][moduleIndex%4],
        email:`${row.id.toLowerCase()}@example.invalid`,phone:'연락처 없음 (합성)',careerGoal:optionalText('careerGoal')||'',
        attendance:number('attendance',0,100),midtermScore:number('midtermScore',0,100),finalScore:number('finalScore',0,100),assignmentScore:number('assignmentScore',0,100),projectScore:number('projectScore',0,100),participationScore:number('participationScore',0,100),socialScore:number('socialScore',0,100),
        analysis:`[합성 시트 입력] ${row.module} ${moduleCreditsEarned}/${moduleCreditsRequired}학점. 실제 AI 평가가 아닙니다.`,peerGroup:[],consultationTopics:['[합성] 모듈 계획 및 성찰 검토'],
        aiSummary:{attendanceAnalysis:'[합성] 시트 출석 입력값',academicTrend:'[합성] 추세 검증 자료 없음',assignmentQuality:'[합성] 시트 과제 점수',networkIntimacy:'[합성] 실제 교우관계·정서 추론 아님',overallSentiment:'Neutral'},
        ...(row.moduleId ? {college:row.college, departmentId:row.departmentId, moduleId:row.moduleId, curriculumVersion:row.curriculumVersion,gradedCredits:Number(row.gradedCredits||0)} : {}),
        ...syntheticFields
      };
      students.push(student);
    } catch (error) { errors.push(`${rowNo}행: ${error instanceof DataError ? error.message : '행 형식을 확인하세요.'}`); }
    if (errors.length >= 8) break;
  }
  if (errors.length) throw new DataError(errors.join(' '));
  if (!students.length) throw new DataError('active=TRUE인 합성 학생이 최소 1명 필요합니다.');
  if (students.length > MAX_ACTIVE) throw new DataError(`앱 표시 한도는 ${MAX_ACTIVE}명입니다. active 행을 줄여 주세요.`);
  return {students,totalRows:matrix.length,revision:createHash('sha256').update(csv).digest('hex')};
}

export async function readCsvSheet(sheetId: string, gid: string, fetcher: typeof fetch = fetch) {
  if (!/^[a-zA-Z0-9_-]{20,100}$/.test(sheetId) || !/^\d+$/.test(gid)) throw new DataError('시트 연결 설정이 올바르지 않습니다.');
  const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/export`);
  url.searchParams.set('format','csv');url.searchParams.set('gid',gid);url.searchParams.set('_',String(Date.now()));
  const response = await fetcher(url,{cache:'no-store',signal:AbortSignal.timeout(20000)});
  if (!response.ok) throw new DataError('구글시트를 읽지 못했습니다. 합성 자료 시트의 링크 열람 권한과 연결을 확인하세요.');
  if (response.headers.get('content-type')?.includes('text/html')) throw new DataError('구글시트 열람 권한이 필요합니다. 링크가 있는 사용자: 뷰어 설정을 확인하세요.');
  if (Number(response.headers.get('content-length') || 0) > MAX_BYTES) throw new DataError('시트 크기가 16MB 한도를 넘었습니다.');
  const reader=response.body?.getReader();if (!reader) throw new DataError('시트 응답이 비어 있습니다.');
  const chunks:Uint8Array[]=[];let size=0;
  while (true) { const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BYTES){await reader.cancel();throw new DataError('시트 크기가 16MB 한도를 넘었습니다.');}chunks.push(value); }
  return Buffer.concat(chunks).toString('utf8');
}

export async function readSheet(sheetId:string,gid:string,fetcher:typeof fetch=fetch){return studentsFromCsv(await readCsvSheet(sheetId,gid,fetcher));}
