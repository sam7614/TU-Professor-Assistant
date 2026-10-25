import { readSheet } from '../server/student-source.ts';
import config from '../src/data/sheet-config.json' with {type:'json'};
const data=await readSheet(config.spreadsheetId,config.gid);
console.log(JSON.stringify({source:'google-sheet',totalRows:data.totalRows,active:data.students.length,firstId:data.students[0].id,firstProgress:data.students[0].progress,revision:data.revision}));
