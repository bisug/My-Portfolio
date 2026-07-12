const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'assets', 'css');
const jsDir = path.join(__dirname, 'assets', 'js');

// Simple CSS minifier
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around syntax
        .trim();
}

// Simple JS minifier (basic whitespace removal for vanilla JS)
function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*/g, '') // Remove inline comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([=+\-*/%&|<>!?:;,.{}()[\]])\s*/g, '$1') // Remove spaces around syntax
        .replace(/return /g, 'return ')
        .replace(/const /g, 'const ')
        .replace(/let /g, 'let ')
        .replace(/var /g, 'var ')
        .trim();
}

console.log('Building CSS...');
// Read style.css and resolve imports
const styleContent = fs.readFileSync(path.join(cssDir, 'style.css'), 'utf8');
const importRegex = /@import\s+['"]([^'"]+)['"];/g;
let bundledCSS = '';
let match;

while ((match = importRegex.exec(styleContent)) !== null) {
    const importFile = match[1];
    const importPath = path.join(cssDir, importFile);
    console.log(`  Adding ${importFile}...`);
    bundledCSS += fs.readFileSync(importPath, 'utf8') + '\n';
}

const minifiedCSS = minifyCSS(bundledCSS);
fs.writeFileSync(path.join(cssDir, 'style.min.css'), minifiedCSS);
console.log('✔ CSS built successfully: style.min.css');


console.log('Building JS...');
const jsFiles = ['scroll.js', 'main.js'];
jsFiles.forEach(file => {
    const filePath = path.join(jsDir, file);
    const minFilePath = path.join(jsDir, file.replace('.js', '.min.js'));
    console.log(`  Minifying ${file}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    // Using a simpler approach for JS to avoid breaking things, since the regex above might break keywords
    // Actually, I'll just use basic space removal that's safe
    content = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
    content = content.replace(/\n+/g, '\n').trim();
    // I won't aggressively minify JS to avoid breaking syntax, just remove comments and extra newlines
    fs.writeFileSync(minFilePath, content);
});
console.log('✔ JS built successfully.');
