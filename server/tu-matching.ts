import curriculum from '../src/data/tu-curriculum.json' with {type:'json'};
import {DataError,parseCsv,studentsFromCsv,readCsvSheet} from './student-source.js';
import {createHash} from 'node:crypto';

const modules=new Map(curriculum.modules.map(m=>[m.moduleId,m]));
const courses=new Map(curriculum.moduleCourses.map(c=>[c.courseRowId,c]));
function records(csv:string){const rows=parseCsv(csv);const headers=rows.shift()||[];if(new Set(headers).size!==headers.length)throw new DataError('원자료 헤더가 중복되었습니다.');return {headers,rows:rows.map(cells=>Object.fromEntries(headers.map((key,i)=>[key.trim(),(cells[i]||'').trim()])))};}
function toCsv(headers:string[],rows:Record<string,string>[]) {const cell=(v:string)=>`"${v.replaceAll('"','""')}"`;return [headers,...rows.map(row=>headers.map(h=>row[h]||''))].map(r=>r.map(cell).join(',')).join('\n');}

export function matchCourseSnapshot(studentCsv:string,courseCsv:string){
 const source=records(studentCsv);
 if(!source.headers.includes('moduleId'))return studentsFromCsv(studentCsv); // Migration compatibility only.
 const studentRows=new Map(source.rows.map(s=>[s.id,s]));if(studentRows.size!==source.rows.length)throw new DataError('Students에 중복 학생 ID가 있습니다.');
 const raw=records(courseCsv);if(['studentId','courseRowId','moduleId','credits','status','gradePoint','synthetic'].some(k=>!raw.headers.includes(k)))throw new DataError('StudentCourses의 필수 헤더를 확인하세요.');
 const grouped=new Map<string,{courseRowId:string;status:'completed'|'failed'|'in-progress'|'planned';gradePoint:number|null}[]>();const seen=new Set<string>();
 for(const [i,row]of raw.rows.entries()){
  const fail=()=>{throw new DataError(`StudentCourses ${i+2}행의 학생·교과목 연결 또는 성적/상태를 확인하세요.`)};
  const student=studentRows.get(row.studentId),course=courses.get(row.courseRowId);const key=row.studentId+'|'+row.courseRowId;
  if(!student||!course||seen.has(key)||row.moduleId!==student.moduleId||course.moduleId!==row.moduleId||Number(row.credits)!==course.credits||!['true','1'].includes(row.synthetic.toLowerCase()))fail();
  const status=row.status as 'completed'|'failed'|'in-progress'|'planned';if(!['completed','failed','in-progress','planned'].includes(status))fail();
  const point=row.gradePoint===''?null:Number(row.gradePoint);
  if(status==='completed'&&(point===null||!Number.isFinite(point)||point<=0||point>4.5))fail();
  if(status==='failed'&&point!==0)fail();if(['in-progress','planned'].includes(status)&&point!==null)fail();
  if(['completed','failed'].includes(status)&&course!.year>Number(student!.grade))fail();
  seen.add(key);const list=grouped.get(row.studentId)||[];list.push({courseRowId:row.courseRowId,status,gradePoint:point});grouped.set(row.studentId,list);
 }
 for(const row of source.rows){
  const module=modules.get(row.moduleId);if(!module||row.departmentId!==module.departmentId||row.department!==module.department||row.college!==module.college||row.module!==module.module)throw new DataError('Students의 단과대학·학과·모듈 ID/명칭 연결을 확인하세요.');
  const items=grouped.get(row.id)||[];if(items.length!==module.roadmapRowCount)throw new DataError(`${row.id}: 선택 모듈의 교과목 이수 행이 누락되었습니다.`);
  let earned=0,graded=0,weighted=0;for(const item of items){const credit=courses.get(item.courseRowId)!.credits!;if(item.status==='completed')earned+=credit;if(item.status==='completed'||item.status==='failed'){graded+=credit;weighted+=credit*(item.gradePoint||0);}}
  row.moduleCreditsEarned=String(earned);row.moduleCreditsRequired=String(module.publishedCredits);row.creditsEarned=String(earned);row.totalCredits=String(module.publishedCredits);row.gpa=String(graded?Math.round(weighted/graded*100)/100:0);row.gradedCredits=String(graded);row.selectedModules=module.module;
 }
 const result=studentsFromCsv(toCsv(source.headers,source.rows));
 result.students=result.students.map(s=>({...s,courseRecords:grouped.get(s.id)||[]}));
 return {...result,curriculumVersion:curriculum.version,courseRows:raw.rows.length,revision:createHash('sha256').update(studentCsv+'\n'+courseCsv).digest('hex')};
}
export async function readMatchedSheet(id:string,gid:string,courseGid:string){const [students,courses]=await Promise.all([readCsvSheet(id,gid),readCsvSheet(id,courseGid)]);return matchCourseSnapshot(students,courses);}
