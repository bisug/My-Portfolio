const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'assets', 'css');
const jsDir = path.join(__dirname, 'assets', 'js');

// CSS minifier. Only strips spaces around { } : ; , so calc() operators stay
// intact. Safe here: no data: URIs or multi-word content strings.
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
        .replace(/\s+/g, ' ')             // collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .trim();
}

// JS minifier for hand-written vanilla JS. Strips comments and collapses
// whitespace, but copies string/template literals verbatim so URLs and template
// spaces survive. Whitespace runs collapse to '\n' if they span a newline (keeps
// ASI boundaries) else ' ' (keeps token boundaries).
// Limitation (absent here): regex literals could be misread as division, and
// ${...} expressions aren't minified.
function minifyJS(js) {
    let out = '';
    let i = 0;
    const n = js.length;
    const isWs = (ch) => ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';

    while (i < n) {
        const c = js[i];
        const c2 = js[i + 1];

        // Line comment
        if (c === '/' && c2 === '/') {
            i += 2;
            while (i < n && js[i] !== '\n') i++;
            continue;
        }
        // Block comment
        if (c === '/' && c2 === '*') {
            i += 2;
            while (i < n && !(js[i] === '*' && js[i + 1] === '/')) i++;
            i += 2;
            continue;
        }
        // String or template literal — copy verbatim, honouring escapes
        if (c === '"' || c === "'" || c === '`') {
            const quote = c;
            out += c;
            i++;
            while (i < n) {
                const s = js[i];
                if (s === '\\') {
                    out += s + (js[i + 1] ?? '');
                    i += 2;
                    continue;
                }
                out += s;
                i++;
                if (s === quote) break;
            }
            continue;
        }
        // Collapse whitespace runs (outside strings/comments)
        if (isWs(c)) {
            let hasNewline = false;
            let j = i;
            while (j < n && isWs(js[j])) {
                if (js[j] === '\n') hasNewline = true;
                j++;
            }
            out += hasNewline ? '\n' : ' ';
            i = j;
            continue;
        }

        out += c;
        i++;
    }

    return out.trim();
}

console.log('Building CSS...');
// Read style.css and resolve @import order into a single bundle
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
jsFiles.forEach((file) => {
    const filePath = path.join(jsDir, file);
    const minFilePath = path.join(jsDir, file.replace('.js', '.min.js'));
    console.log(`  Minifying ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(minFilePath, minifyJS(content));
});
console.log('✔ JS built successfully: scroll.min.js, main.min.js');
