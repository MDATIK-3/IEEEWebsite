import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

function getAllJsonFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllJsonFiles(fullPath));
    } else if (item.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

const dataDir = path.join(process.cwd(), 'src/data');
const jsonFiles = getAllJsonFiles(dataDir);

let knowledgeBase = '';
for (const file of jsonFiles) {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const relativePath = path.relative(dataDir, file).replace('.json', '').replace(/\\/g, '/');
  knowledgeBase += `### ${relativePath}\n\n${JSON.stringify(data, null, 2)}\n\n---\n\n`;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');

export async function POST(request) {
  const { query } = await request.json();

  try {
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
      You are a helpful chatbot for the IEEE GUB website. Answer the user's query based ONLY on the following data. Do not add external information or hallucinate.
      
      Knowledge Base:
      ${knowledgeBase}
      
      User Query: ${query}
      
      Response:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}