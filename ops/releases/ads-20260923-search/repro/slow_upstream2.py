"""Fake upstream with modes.

steady: total line, 100 results at 5/s (20 s), completed line.
stall:  total line, 10 results, then silence for 60 s.
Each request's outcome (finished / client went away) is appended to upstream-events.log.
"""
import json
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

LOG = Path(__file__).with_name("upstream-events.log")


def log(event):
    with LOG.open("a") as fh:
        fh.write(f"{time.time():.2f} {event}\n")


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        mode = parse_qs(urlparse(self.path).query).get("mode", ["steady"])[0]
        self.send_response(200)
        self.send_header("Content-Type", "application/x-ndjson")
        self.send_header("Transfer-Encoding", "chunked")
        self.end_headers()

        def chunk(obj):
            data = (json.dumps(obj) + "\n").encode()
            self.wfile.write(b"%x\r\n%s\r\n" % (len(data), data))
            self.wfile.flush()

        sent = 0
        try:
            chunk({"total": 100})
            count = 100 if mode == "steady" else 10
            for i in range(count):
                time.sleep(0.2)
                chunk({"source": f"site{i}", "url": f"https://example.com/{i}", "checkResult": {"isExist": False, "responseTime": 1}})
                sent += 1
            if mode == "stall":
                for _ in range(60):
                    time.sleep(1)
                    self.wfile.write(b"")  # no data; detect a closed peer below
                    self.wfile.flush()
                log(f"{mode} stall-ended-without-disconnect sent={sent}")
                return
            chunk({"completed": True})
            self.wfile.write(b"0\r\n\r\n")
            log(f"{mode} finished sent={sent}")
        except (BrokenPipeError, ConnectionResetError):
            log(f"{mode} client-went-away sent={sent}")

    def log_message(self, *args):
        pass


ThreadingHTTPServer(("127.0.0.1", 4391), Handler).serve_forever()
