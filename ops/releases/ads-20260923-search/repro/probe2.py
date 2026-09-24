"""Probe the repro Worker: python3 probe2.py <mode> [leave_after_s]"""
import http.client
import json
import sys
import time

mode = sys.argv[1]
leave_after = float(sys.argv[2]) if len(sys.argv) > 2 else None
start = time.time()
conn = http.client.HTTPConnection("127.0.0.1", 4392, timeout=90)
conn.request("GET", f"/?mode={mode}")
resp = conn.getresponse()
results, meta, last_t, ending = 0, [], None, "clean EOF"
try:
    while True:
        if leave_after is not None and time.time() - start > leave_after:
            conn.sock.close()
            ending = f"client left at {time.time() - start:.2f}s"
            break
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
print(f"[{mode}] status {resp.status} results {results} last_line_s {round(last_t or -1, 2)} total_s {round(time.time() - start, 2)} meta {meta} ending: {ending}")
