import {readFile,writeFile,mkdir,rm,copyFile} from 'node:fs/promises';
const html=await readFile('web/index.html','utf8');
const engine=html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
await writeFile('worker/engine.mjs',engine+'\nexport {Reactor};\n');
const api=await readFile('worker/api.mjs','utf8');
await rm('dist',{recursive:true,force:true});await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/index.html',html);
await writeFile('dist/server/index.js',engine+'\nconst page='+JSON.stringify(html)+';\n'+api.replace("import {Reactor} from './engine.mjs';",''));
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
