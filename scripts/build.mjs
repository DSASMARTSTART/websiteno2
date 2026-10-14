import './generate-locales.mjs';
import { mkdir, cp, rm } from 'node:fs/promises';
await rm('dist', { recursive:true, force:true });
await mkdir('dist', { recursive:true });
for (const file of ['index.html','chi-siamo','faq','en','sr','es','styles.css','app.js','assets']) await cp(file, `dist/${file}`, { recursive:true });
console.log('Static site built in dist/');
