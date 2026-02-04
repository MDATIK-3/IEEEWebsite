import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path'
const DATA_DIR = path.join(process.cwd(), 'src/data');
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GREETING_REGEX =
  /^(hi|hello|hey|heya|yo|hola|salam|assalamualaikum|good\s?(morning|afternoon|evening))[\s!,.?]*$/i;
const THANKS_REGEX = /^(thanks|thank you|ty|thx)[\s!,.?]*$/i;
const WELLBEING_REGEX = /^(how are you|how are you doing|how's it going)[\s!,.?]*$/i;

function getAllJsonFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

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

function buildKnowledgeBase() {
  const jsonFiles = getAllJsonFiles(DATA_DIR);
  let knowledgeBase = '';

  for (const file of jsonFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const relativePath = path
        .relative(DATA_DIR, file)
        .replace('.json', '')
        .replace(/\\/g, '/');
      knowledgeBase += `### ${relativePath}\n\n${JSON.stringify(data, null, 2)}\n\n---\n\n`;
    } catch (error) {
      console.warn(`Skipping invalid JSON file: ${file}`, error);
    }
  }

  return knowledgeBase.trim();
}

function getSmallTalkReply(query) {
  if (GREETING_REGEX.test(query)) {
    return 'Hello! I am the IEEE GUB Assistant. I can help with events, executive board info, membership, and contact details.';
  }
  if (WELLBEING_REGEX.test(query)) {
    return "I am doing well, thanks for asking. How can I help you with IEEE GUB today?";
  }
  if (THANKS_REGEX.test(query)) {
    return "You're welcome! If you want, I can also help with IEEE GUB events, membership, or leadership info.";
  }
  return null;
}

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Chat service is not configured. Missing GEMINI_API_KEY.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await request.json();
    const query = (body?.query || '').toString().trim();
    const context = Array.isArray(body?.context) ? body.context : [];

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const smallTalkReply = getSmallTalkReply(query);
    if (smallTalkReply) {
      return new Response(JSON.stringify({ response: smallTalkReply }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contextString =
      context.length > 0
        ? `\n\nConversation Context:\n${context
          .slice(-10)
          .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
          .join('\n')}`
        : '';

    const prompt = `
You are a helpful chatbot for the IEEE GUB website.
Answer the user's query based ONLY on the following data.
If the requested information is unavailable, say so clearly.
You may respond naturally to greetings, thanks, and brief pleasantries.

Return your answer in well-formatted markdown.

Special Instructions:
- When providing information about an executive or member, include their photo using markdown image syntax if image data is available.
- If the user asks to "show photo" or similar, display the photo path from the data.

Knowledge Base:
${buildKnowledgeBase()}
${contextString}

User Query: ${query}

Response:
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = result.response?.text?.()?.trim() || 'I could not generate a response.';

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
