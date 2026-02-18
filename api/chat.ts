// Vercel Serverless Function: /api/chat
// Keeps the Kimi/Moonshot API key on the server (do NOT expose it to the browser).

type ChatCompletionMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: { message: 'Method not allowed' } });
      return;
    }

    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: { message: 'Missing KIMI_API_KEY server env var' } });
      return;
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body ?? {});

    const {
      messages,
      model = 'moonshot-v1-8k',
      temperature = 0.7,
      max_tokens = 1000,
    } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: { message: 'messages must be a non-empty array' } });
      return;
    }

    const safeMessages: ChatCompletionMessage[] = messages
      .filter((m: any) => m && typeof m === 'object')
      .map((m: any) => ({ role: m.role, content: m.content }))
      .filter(
        (m: any) =>
          (m.role === 'system' || m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string'
      );

    if (safeMessages.length === 0) {
      res.status(400).json({ error: { message: 'No valid messages provided' } });
      return;
    }

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: safeMessages,
        temperature,
        max_tokens,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      res.status(response.status).json(data?.error ? data : { error: { message: `API error: ${response.status}` } });
      return;
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: { message: err?.message || 'Unknown server error' } });
  }
}

