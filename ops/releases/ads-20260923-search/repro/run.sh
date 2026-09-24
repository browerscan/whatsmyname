#!/bin/bash
# Reproduce the search cutoff in workerd: route streaming logic, 5 s timeout, 20 s fake upstream.
set -uo pipefail
HERE="$HOME/artifacts/whatismyname-search-probe/repro"
WS="$HOME/test-workspace/whatismyname-ui-rel-20260923"
for p in 4391 4392; do lsof -nP -iTCP:$p -sTCP:LISTEN >/dev/null && { echo "port $p busy"; exit 2; }; done
python3 "$HERE/slow_upstream.py" & UP=$!
cd "$HERE"
set -m
WRANGLER_SEND_METRICS=false node "$WS/node_modules/wrangler/bin/wrangler.js" dev --config wrangler.json --local --ip 127.0.0.1 --port 4392 --inspector-port 0 > "$HERE/wrangler.log" 2>&1 & WR=$!
set +m
for i in $(seq 1 120); do nc -z 127.0.0.1 4392 2>/dev/null && break; sleep 0.5; done
sleep 1
python3 "$HERE/probe_local.py"
kill -- -$WR 2>/dev/null; kill $UP 2>/dev/null
sleep 1
echo "--- worker log"
grep -i "Streaming error" "$HERE/wrangler.log" | head -3
for p in 4391 4392; do lsof -nP -iTCP:$p -sTCP:LISTEN >/dev/null && echo "port $p STILL BUSY" || echo "port $p released"; done
