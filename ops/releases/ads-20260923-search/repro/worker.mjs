// Verbatim copy of the streaming logic in app/api/search/whatsmyname/route.ts,
// with the upstream URL and timeout injected so the 60 s cutoff can be reproduced in 5 s.
export default {
  async fetch(request, env) {
    const response = await fetch(env.UPSTREAM, {
      headers: { Accept: "application/x-ndjson" },
      signal: AbortSignal.timeout(Number(env.TIMEOUT_MS)),
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.error(new Error("Response body is not readable"));
          return;
        }
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              if (buffer.trim()) controller.enqueue(encoder.encode(buffer + "\n"));
              controller.close();
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (line.trim()) controller.enqueue(encoder.encode(line + "\n"));
            }
          }
        } catch (error) {
          console.error("Streaming error:", String(error));
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "application/x-ndjson" } });
  },
};
