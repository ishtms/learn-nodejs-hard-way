const fs = require('fs');
const path = require('path');

const chaptersDirectory = './chapters';
const indexFilePath = './index.md';

function processChapter(fileContent, chapterNumber) {
    const lines = fileContent.split('\n');
    const processedLines = [];

    let currentSection = 1;
    let sectionStack = [];

    for (const line of lines) {
        if (line.startsWith('#')) {
            const hashCount = line.match(/^#+/)[0].length;

            while (sectionStack.length >= hashCount) {
                sectionStack.pop();
            }

            const sectionNumber = [...sectionStack, currentSection].join('.');
            const newLine = line.replace(/^#+/, `# ${sectionNumber}`);
            processedLines.push(newLine);

            sectionStack.push(currentSection);
            currentSection = 1;
        } else {
            processedLines.push(line);
        }
    }

    return processedLines.join('\n');
}

function generateIndex() {
    const chapterFiles = fs.readdirSync(chaptersDirectory);

    const indexLines = [];

    for (let i = 0; i < chapterFiles.length; i++) {
        const chapterFile = chapterFiles[i];
        const chapterNumber = i + 1;
        const chapterFilePath = path.join(chaptersDirectory, chapterFile);

        const fileContent = fs.readFileSync(chapterFilePath, 'utf8');
        const processedContent = processChapter(fileContent, chapterNumber);

        indexLines.push(processedContent);
    }

    fs.writeFileSync('test.md', indexLines.join('\n'));
    console.log('Index file generated successfully.');
}

generateIndex();
