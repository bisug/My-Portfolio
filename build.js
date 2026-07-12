const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'assets', 'css');
const jsDir = path.join(__dirname, 'assets', 'js');

// Simple CSS minifier.
// Safe for this codebase: calc() operators (* - /) and spaces inside them are
// preserved because only spaces around { } : ; , are removed, and there are no
// data: URIs or multi-word content strings that would be corrupted.
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around syntax
        .trim();
}

// String/template/comment-aware JS minifier for hand-written vanilla JS.
// It strips comments and collapses whitespace WITHOUT touching the contents of
// string or template literals, so URLs like 'https://…' and template spaces are
// never corrupted. Whitespace runs collapse to a single '\n' when they contain a
// newline (preserving automatic-semicolon-insertion boundaries) or a single ' '
// otherwise (preserving token boundaries like `const x`).
//
// Limitations (none present in this codebase): regex literals and division are
// both spelled '/', so a regex literal could be misread; and `${…}` expressions
// inside template literals are copied verbatim rather than minified. Neither
// occurs here — division only ever appears as `a / b` (a space follows the '/'),
// and template expressions contain no comments.
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
