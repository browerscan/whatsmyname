"""Fake upstream: NDJSON with a total line, 100 results at 5/s (20 s), then a completed line."""
import json
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/x-ndjson")
        self.send_header("Transfer-Encoding", "chunked")
        self.end_headers()

        def chunk(obj):
            data = (json.dumps(obj) + "\n").encode()
            self.wfile.write(b"%x\r\n%s\r\n" % (len(data), data))
            self.wfile.flush()

        try:
            chunk({"total": 100})
            for i in range(100):
                time.sleep(0.2)
                chunk({"source": f"site{i}", "url": f"https://example.com/{i}", "checkResult": {"isExist": False, "responseTime": 1}})
            chunk({"completed": True})
            self.wfile.write(b"0\r\n\r\n")
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, *args):
        pass


ThreadingHTTPServer(("127.0.0.1", 4391), Handler).serve_forever()
