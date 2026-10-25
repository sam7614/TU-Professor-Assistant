import { DataError } from '../server/student-source.js';
import {readMatchedSheet} from '../server/tu-matching.js';
import config from '../src/data/sheet-config.json' with { type: 'json' };

export default {
  async fetch(request: Request) {
    const headers = {'Cache-Control':'no-store, max-age=0','CDN-Cache-Control':'no-store','Vercel-CDN-Cache-Control':'no-store'};
    if (request.method !== 'GET') return Response.json({error:'읽기 전용 연결입니다.'},{status:405,headers:{...headers,Allow:'GET'}});
    try {
      const result=await readMatchedSheet(config.spreadsheetId,config.gid,config.courseGid);
      return Response.json({...result,source:'google-sheet',synthetic:true,fetchedAt:new Date().toISOString(),sheetUrl:config.url},{headers});
    } catch(error) {
      console.error('student_sheet_sync_failed',{kind:error instanceof DataError?'validation-or-access':'upstream'});
      return Response.json({error:error instanceof DataError?error.message:'구글시트 연결이 지연되거나 중단되었습니다. 잠시 후 다시 시도하세요.'},{status:502,headers});
    }
  }
};
