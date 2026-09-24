"""Same measurement as probe_stream.py, against the local repro Worker."""
import http.client
import json
import time

start = time.time()
conn = http.client.HTTPConnection("127.0.0.1", 4392, timeout=60)
conn.request("GET", "/")
resp = conn.getresponse()
results, meta, last_t, ending = 0, [], None, "clean EOF"
try:
    while True:
        line = resp.readline()
        if not line:
            break
        last_t = time.time() - start
        obj = json.loads(line)
        if "total" in obj or "completed" in obj:
            meta.append((round(last_t, 2), obj))
        else:
            results += 1
except Exception as exc:
    ending = f"exception after {time.time() - start:.2f}s: {type(exc).__name__}: {exc}"
print("status", resp.status)
print("results", results, "of 100; last_line_s", round(last_t or -1, 2), "total_s", round(time.time() - start, 2))
print("metadata", meta)
print("ending", ending)
