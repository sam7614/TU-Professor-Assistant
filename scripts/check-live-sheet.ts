import {readMatchedSheet} from '../server/tu-matching.ts';
import config from '../src/data/sheet-config.json' with {type:'json'};
const data=await readMatchedSheet(config.spreadsheetId,config.gid,config.courseGid);
console.log(JSON.stringify({source:'google-sheet',totalRows:data.totalRows,active:data.students.length,firstId:data.students[0].id,firstProgress:data.students[0].progress,revision:data.revision}));
