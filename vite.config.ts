import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import studentApi from './api/students.ts';

// Use the same handler in local dev/preview and the deployed Vercel Function.
function studentApiPlugin(): Plugin {
  const mount = (server: Pick<ViteDevServer, 'middlewares'>) => {
    server.middlewares.use('/api/students', async (req, res) => {
      try {
        const response = await studentApi.fetch(new Request('http://localhost/api/students', { method: req.method || 'GET' }));
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      } catch {
        res.statusCode = 500;
        res.end('{"error":"로컬 API 연결에 실패했습니다."}');
      }
    });
  };
  return {name:'local-student-api',configureServer:mount,configurePreviewServer:mount};
}

export default defineConfig({plugins:[react(),studentApiPlugin()],server:{port:3000,strictPort:true}});
