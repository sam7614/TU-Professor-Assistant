import {test} from 'node:test';
import assert from 'node:assert/strict';
import curriculum from '../src/data/tu-curriculum.json' with {type:'json'};
import demo from '../src/data/synthetic-students.json' with {type:'json'};
import {matchCourseSnapshot} from '../server/tu-matching.ts';
const m=curriculum.modules[0];
const fields=['active','synthetic','id','name','department','grade','module','moduleCreditsEarned','moduleCreditsRequired','creditsEarned','totalCredits','gpa','attendance','status','careerGoal','midtermScore','finalScore','assignmentScore','projectScore','participationScore','socialScore','lastConsultation','scenario','reflection','planChangeReason','prerequisiteMet','plannedSemesterCredits','selectedModules','college','departmentId','moduleId','curriculumVersion','gradedCredits'];
const student={...demo[0],active:true,grade:4,department:m.department,college:m.college,departmentId:m.departmentId,moduleId:m.moduleId,module:m.module,selectedModules:m.module,curriculumVersion:curriculum.version};
const rows=curriculum.moduleCourses.filter(c=>c.moduleId===m.moduleId).map(c=>({studentId:student.id,courseRowId:c.courseRowId,moduleId:m.moduleId,credits:c.credits,status:'completed',gradePoint:3,synthetic:true}));
function csv(headers:string[],data:Record<string,unknown>[]){const cell=(v:unknown)=>`"${String(v??'').replaceAll('"','""')}"`;return [headers,...data.map(r=>headers.map(h=>r[h]))].map(r=>r.map(cell).join(',')).join('\n');}
const run=(data=rows,s=student)=>matchCourseSnapshot(csv(fields,[s]),csv(Object.keys(rows[0]),data));
test('official course credits determine progress and GPA; raw grade edits update weighted GPA',()=>{
 const initial=run();assert.equal(initial.students[0].progress,100);assert.equal(initial.students[0].gpa,3);assert.equal(initial.students[0].totalCredits,m.publishedCredits);assert.equal(initial.students[0].courseRecords?.length,rows.length);
 const changed=run(rows.map((r,i)=>i===0?{...r,gradePoint:4.5}:r));assert(changed.students[0].gpa>3);assert.notEqual(initial.revision,changed.revision);
 const failed=run(rows.map((r,i)=>i===0?{...r,status:'failed',gradePoint:0}:r));assert.equal(failed.students[0].creditsEarned,m.publishedCredits!-rows[0].credits!);assert(failed.students[0].gpa<3);
});
test('foreign keys, source credits, duplicate/missing courses and impossible grades are rejected atomically',()=>{
 for(const patch of [{studentId:'unknown'},{courseRowId:'unknown'},{moduleId:'unknown'},{credits:999},{status:'failed',gradePoint:3},{status:'planned',gradePoint:3},{gradePoint:5},{synthetic:false}])assert.throws(()=>run(rows.map((r,i)=>i===0?{...r,...patch}:r)));
 assert.throws(()=>run([...rows,rows[0]]));assert.throws(()=>run(rows.slice(1)));
 assert.throws(()=>run(rows,{...student,department:'unrelated'}));
});
test('future-year completion is rejected and an entirely planned module has no computed GPA',()=>{
 const future=curriculum.modules.find(m=>curriculum.moduleCourses.some(c=>c.moduleId===m.moduleId&&c.year>1))!;
 const s={...student,grade:1,moduleId:future.moduleId,module:future.module,departmentId:future.departmentId,department:future.department,college:future.college};
 const records=curriculum.moduleCourses.filter(c=>c.moduleId===future.moduleId).map(c=>({studentId:s.id,courseRowId:c.courseRowId,moduleId:future.moduleId,credits:c.credits,status:'completed',gradePoint:3,synthetic:true}));
 assert.throws(()=>matchCourseSnapshot(csv(fields,[s]),csv(Object.keys(records[0]),records)));
 const planned=run(rows.map(r=>({...r,status:'planned',gradePoint:null} as any)));assert.equal(planned.students[0].gradedCredits,0);assert.equal(planned.students[0].progress,0);
});
