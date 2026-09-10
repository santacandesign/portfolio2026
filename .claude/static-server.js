const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/santa/Desktop/portfolio 2026';
const TYPES = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.xml':'application/xml','.csv':'text/csv','.otf':'font/otf','.woff2':'font/woff2','.mp4':'video/mp4'};
http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(f,(e,d)=>{
    if(e){ res.writeHead(404,{'Content-Type':'text/plain'}); return res.end('404 '+p); }
    res.writeHead(200,{'Content-Type':TYPES[path.extname(f).toLowerCase()]||'application/octet-stream'});
    res.end(d);
  });
}).listen(8910, ()=>console.log('serving on http://localhost:8899'));
