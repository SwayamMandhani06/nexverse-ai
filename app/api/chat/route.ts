import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body as { message?: string };

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // TODO: Connect to LLM provider (OpenAI, Anthropic, Gemini, etc.)
    // Placeholder streaming response
    const placeholderReply =
      `I'm the NexVerse AI assistant. You asked: "${message}". ` +
      `I can help you find the perfect headphones based on your mood, lifestyle, and audio preferences. ` +
      `What would you like to know about our X1, X1 Pro, or X1 Max?`;

    return NextResponse.json({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: placeholderReply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/chat] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
