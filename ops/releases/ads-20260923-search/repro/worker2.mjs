// Verbatim copy of the fixed streaming logic in app/api/search/whatsmyname/route.ts,
// with the upstream URL and both timeouts injected so they can be exercised in seconds.
export default {
  async fetch(request, env) {
    const UPSTREAM_RESPONSE_TIMEOUT_MS = Number(env.RESPONSE_TIMEOUT_MS);
    const UPSTREAM_IDLE_TIMEOUT_MS = Number(env.IDLE_TIMEOUT_MS);
    const mode = new URL(request.url).searchParams.get("mode") || "steady";

    const upstream = new AbortController();
    let watchdog;
    const armWatchdog = (ms) => {
      clearTimeout(watchdog);
      watchdog = setTimeout(
        () => upstream.abort(new DOMException("WhatsMyName upstream timed out", "TimeoutError")),
        ms,
      );
    };

    try {
      armWatchdog(UPSTREAM_RESPONSE_TIMEOUT_MS);
      const response = await fetch(`${env.UPSTREAM}?mode=${mode}`, {
        headers: { Accept: "application/x-ndjson" },
        signal: upstream.signal,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            clearTimeout(watchdog);
            controller.error(new Error("Response body is not readable"));
            return;
          }
          const decoder = new TextDecoder();
          let buffer = "";
          try {
            while (true) {
              armWatchdog(UPSTREAM_IDLE_TIMEOUT_MS);
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
            clearTimeout(watchdog);
            reader.releaseLock();
          }
        },
        cancel(reason) {
          clearTimeout(watchdog);
          upstream.abort(reason);
        },
      });

      return new Response(stream, { headers: { "Content-Type": "application/x-ndjson" } });
    } catch (error) {
      clearTimeout(watchdog);
      return new Response(JSON.stringify({ error: String(error) }), { status: 504 });
    }
  },
};
