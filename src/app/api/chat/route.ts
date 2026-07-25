import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { siteConfig } from '@/config/site';

// This is required to enable Edge Runtime for streaming
export const runtime = 'edge';

// We use OpenAI SDK, but point it to the InsForge AI Gateway
const openai = new OpenAI({
  baseURL: `${process.env.NEXT_PUBLIC_INSFORGE_URL}/v1`,
  // The service key is required to use the gateway from the server
  apiKey: process.env.INSFORGE_SERVICE_KEY || 'placeholder-service-key',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Inject our system context as the first message
    const systemMessage = {
      role: 'system',
      content: siteConfig.aiContext
    };

    const finalMessages = [systemMessage, ...messages];

    // Use the model configured in env, default to gpt-4o
    const model = process.env.NEXT_PUBLIC_AI_MODEL || 'openai/gpt-4o';

    const response = await openai.chat.completions.create({
      model: model,
      stream: true,
      messages: finalMessages,
    });

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during your request.' },
      { status: 500 }
    );
  }
}
