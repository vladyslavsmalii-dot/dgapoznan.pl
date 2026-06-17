const fs = require('fs');
const path = require('path');

const dir = 'd:/PD/.agent/workflows';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const strings = new Set();

const regex = />([^<]+)</g;

for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        const text = match[1].trim();
        if (text && /[а-яА-ЯёЁ]/.test(text)) {
            // Also split by common inner tags if any, but regex usually finds the innermost
            strings.add(text);
        }
    }
}
fs.writeFileSync(path.join(dir, 'strings.json'), JSON.stringify(Array.from(strings).sort(), null, 2));
console.log('Done extracting ' + strings.size + ' strings');
