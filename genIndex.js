const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rootDir = __dirname;
const chaptersDir = path.join(rootDir, "chapters");
const readmeTemplatePath = path.join(rootDir, "Readme.tl");
const readmeOutputPath = path.join(rootDir, "Readme.md");

async function generateTOC() {
  const files = fs.readdirSync(chaptersDir).filter((file) => file.endsWith(".md") && file !== "Readme.md");
  let toc = "# Table of contents\n\n";

  for (const file of files) {
    const filePath = path.join(chaptersDir, file);
    const headings = await extractHeadings(filePath);
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");
    toc += formatHeadings(headings, relativePath);
  }

  const templateContent = fs.readFileSync(readmeTemplatePath, "utf-8");
  const outputContent = templateContent.replace("{{toc}}", toc);
  fs.writeFileSync(readmeOutputPath, outputContent);

  console.log("Table of contents generated successfully!");
}

async function extractHeadings(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const headings = [];
  let insideCodeBlock = false;

  for await (const line of rl) {
    if (line.trim().startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
    }

    if (!insideCodeBlock) {
      const match = line.match(/^(#{1,3})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const anchor = text.toLowerCase().replace(/[^\w]+/g, "-");
        headings.push({ level, text, anchor });
      }
    }
  }

  return headings;
}

function formatHeadings(headings, relativePath) {
  let formatted = "";
  for (const heading of headings) {
    const indent = "  ".repeat(heading.level - 1);
    const link = `${relativePath}#${heading.anchor}`;
    formatted += `${indent}- [${heading.text}](${link})\n`;
  }
  return formatted;
}

generateTOC().catch((err) => console.error(err));
