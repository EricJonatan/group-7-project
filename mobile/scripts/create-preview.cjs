const { mkdirSync, copyFileSync } = require('node:fs');
const { resolve } = require('node:path');
const root = resolve(__dirname, '..');
mkdirSync(resolve(root, 'dist/preview'), { recursive: true });
copyFileSync(resolve(root, 'preview/index.html'), resolve(root, 'dist/preview/index.html'));
