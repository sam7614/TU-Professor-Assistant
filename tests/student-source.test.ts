import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseCsv, studentsFromCsv, readSheet } from '../server/student-source.ts';
import api from '../api/students.ts';

const fieldNames=['active','synthetic','id','name','department','grade','module','moduleCreditsEarned','moduleCreditsRequired','creditsEarned','totalCredits','gpa','attendance','status','careerGoal','midtermScore','finalScore','assignmentScore','projectScore','participationScore','socialScore','lastConsultation','scenario','reflection','planChangeReason','prerequisiteMet','plannedSemesterCredits','selectedModules'];
const demo=JSON.parse(fs.readFileSync(new URL('../src/data/synthetic-students.json',import.meta.url),'utf8'));
const base={...demo[0],active:true};
function csv(records:Record<string,unknown>[]) {
 const cell=(v:unknown)=>`"${String(Array.isArray(v)?v.join(' | '):v??'').replaceAll('"','""')}"`;
 return [fieldNames,...records.map(r=>fieldNames.map(k=>r[k]))].map(row=>row.map(cell).join(',')).join('\r\n');
}
test('quoted CSV supports BOM, Unicode, CRLF, escaped quotes and embedded newlines',()=>{
 assert.deepEqual(parseCsv('\uFEFFa,b\r\n"가상,학생","첫째\n""인용"""\r\n'),[['a','b'],['가상,학생','첫째\n"인용"']]);
 assert.throws(()=>parseCsv('a\n"unclosed'),/닫히지/);
 assert.throws(()=>parseCsv('a\n"x"junk'),/따옴표/);
});
test('active students are mapped and progress is recalculated from editable credits',()=>{
 const result=studentsFromCsv(csv([{...base,moduleCreditsEarned:3},{...demo[1],active:false}]));
 assert.equal(result.totalRows,2);assert.equal(result.students.length,1);assert.equal(result.students[0].progress,Math.round(3/base.moduleCreditsRequired*100));
 assert.equal(result.students[0].creditsEarned,base.creditsEarned);assert.equal(result.revision.length,64);
 assert(result.students[0].email.endsWith('@example.invalid'));
});
test('non-synthetic data, duplicate ids, invalid numbers, impossible credits/dates and empty cohort fail atomically',()=>{
 for(const patch of [{synthetic:false},{gpa:''},{gpa:'NaN'},{grade:0},{attendance:101},{moduleCreditsEarned:19},{lastConsultation:'2026-02-31'},{selectedModules:'Unknown'},{name:'실제이름'}])assert.throws(()=>studentsFromCsv(csv([{...base,...patch}])));
 assert.throws(()=>studentsFromCsv(csv([base,base])),/중복/);
 assert.throws(()=>studentsFromCsv(csv([{...base,active:false}])),/최소 1명/);
 assert.throws(()=>studentsFromCsv(csv([base]).replace('"active"','"id"')),/헤더/);
});
test('all 1000 school fixtures validate, and an excessive active cohort is rejected',()=>{
 assert.equal(studentsFromCsv(csv(demo.map((r:Record<string,unknown>)=>({...r,active:true})))).students.length,1000);
 const tooMany=Array.from({length:1001},(_,i)=>({...base,id:`SYN-${String(i+1).padStart(7,'0')}`}));
 assert.throws(()=>studentsFromCsv(csv(tooMany)),/1000명/);
});
test('sheet access errors and HTML login responses are explicit, configured host is fixed',async()=>{
 const fetcher=async(input:URL|RequestInfo)=>{assert.equal(new URL(String(input)).hostname,'docs.google.com');return new Response(csv([base]),{headers:{'Content-Type':'text/csv'}});};
 const result=await readSheet('1234567890123456789012345','123',fetcher as typeof fetch);assert.equal(result.students.length,1);
 await assert.rejects(readSheet('1234567890123456789012345','123',(async()=>new Response('login',{status:403})) as typeof fetch),/권한/);
 await assert.rejects(readSheet('1234567890123456789012345','123',(async()=>new Response('<html>',{headers:{'Content-Type':'text/html'}})) as typeof fetch),/권한/);
 await assert.rejects(readSheet('https://attacker.invalid','123',fetcher as typeof fetch),/설정/);
});
test('HTTP handler is read-only, disables caching, and exposes validated snapshots or explicit errors',async()=>{
 const original=globalThis.fetch;
 try {
   const post=await api.fetch(new Request('http://localhost/api/students',{method:'POST'}));assert.equal(post.status,405);assert.equal(post.headers.get('Allow'),'GET');
   globalThis.fetch=(async()=>new Response(csv([base]),{headers:{'Content-Type':'text/csv'}})) as typeof fetch;
   const response=await api.fetch(new Request('http://localhost/api/students'));const payload=await response.json();
   assert.equal(response.status,200);assert(response.headers.get('Cache-Control')?.includes('no-store'));assert.equal(payload.students[0].id,base.id);assert.equal(payload.source,'google-sheet');assert.equal(payload.synthetic,true);
   globalThis.fetch=(async()=>new Response('denied',{status:401})) as typeof fetch;
   assert.equal((await api.fetch(new Request('http://localhost/api/students'))).status,502);
 }finally{globalThis.fetch=original;}
});
