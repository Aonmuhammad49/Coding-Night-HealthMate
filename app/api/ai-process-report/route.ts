// app/api/ai-process-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// ──────────────────────────────────────────────────────────────
// Initialize Gemini 2.5 Pro
// ──────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

// ──────────────────────────────────────────────────────────────
// Zod Schema for AI Response
// ──────────────────────────────────────────────────────────────
const ReportAnalysisSchema = z.object({
  reviewed: z.boolean(),
  pending: z.boolean(),
  highlights: z.array(z.string()),
  summary: z.object({
    english: z.string(),
    romanUrdu: z.string(),
  }),
  doctorQuestions: z.array(z.string()),
  foods: z.object({
    avoid: z.array(z.string()),
    recommend: z.array(z.string()),
  }),
  homeRemedies: z.array(z.string()),
  note: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { report, fileBase64 } = await request.json();

    if (!report || !fileBase64) {
      return NextResponse.json({ error: 'Missing report or file' }, { status: 400 });
    }

    const { type, date, bp, sugar, weight, notes, fileName } = report;

    // Determine MIME type
    const mimeType = fileName.toLowerCase().endsWith('.pdf')
      ? 'application/pdf'
      : 'image/jpeg';

    // Convert base64 to Uint8Array
    const base64Data = fileBase64.split(',')[1];
    const fileBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // ────── Gemini Prompt (Multimodal) ──────
    const prompt = `
You are a medical AI assistant. Read the uploaded ${fileName} (${type}) directly and analyze it.

Manual inputs:
- BP: ${bp || 'N/A'}
- Sugar: ${sugar || 'N/A'} mg/dL
- Weight: ${weight || 'N/A'} kg
- Notes: ${notes || 'None'}

Do:
1. Highlight abnormal values (e.g., "WBC high: 15 (normal 4-11)")
2. Give English + Roman Urdu summary
3. Suggest 3-5 doctor questions
4. Suggest foods to avoid & better foods
5. Suggest 2-3 home remedies
6. End with: "Always consult your doctor before making any decision."

Respond ONLY with valid JSON matching this schema:
{
  "reviewed": true|false,
  "pending": true|false,
  "highlights": ["..."],
  "summary": {"english": "...", "romanUrdu": "..."},
  "doctorQuestions": ["..."],
  "foods": {"avoid": ["..."], "recommend": ["..."]},
  "homeRemedies": ["..."],
  "note": "Always consult..."
}
`.trim();

    // ────── Call Gemini with file + prompt ──────
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: fileBase64.split(',')[1],
        },
      },
    ]);

    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const aiData = JSON.parse(jsonMatch[0]);
    const validated = ReportAnalysisSchema.parse(aiData);

    return NextResponse.json(validated);

  } catch (error: any) {
    console.error('Gemini Error:', error);
    return NextResponse.json({
      reviewed: false,
      pending: true,
      highlights: [],
      summary: { english: 'Analysis failed.', romanUrdu: 'Jaanch nahi ho saki.' },
      doctorQuestions: ['Please consult a doctor.'],
      foods: { avoid: [], recommend: [] },
      homeRemedies: [],
      note: 'Always consult your doctor before making any decision.',
    }, { status: 500 });
  }
}