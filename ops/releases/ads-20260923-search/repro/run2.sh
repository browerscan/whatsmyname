#!/bin/bash
# Verify the fixed streaming logic in workerd: steady 20 s stream, stall, and visitor leaving.
set -uo pipefail
HERE="$HOME/artifacts/whatismyname-search-probe/repro"
WS="$HOME/test-workspace/whatismyname-search-rel-20260923"
for p in 4391 4392; do lsof -nP -iTCP:$p -sTCP:LISTEN >/dev/null && { echo "port $p busy"; exit 2; }; done
rm -f "$HERE/upstream-events.log"
python3 "$HERE/slow_upstream2.py" & UP=$!
cd "$HERE"
set -m
WRANGLER_SEND_METRICS=false node "$WS/node_modules/wrangler/bin/wrangler.js" dev --config wrangler2.json --local --ip 127.0.0.1 --port 4392 --inspector-port 0 > "$HERE/wrangler2.log" 2>&1 & WR=$!
set +m
for i in $(seq 1 120); do nc -z 127.0.0.1 4392 2>/dev/null && break; sleep 0.5; done
sleep 1
python3 "$HERE/probe2.py" steady
python3 "$HERE/probe2.py" stall
python3 "$HERE/probe2.py" steady 2
sleep 3
kill -- -$WR 2>/dev/null; kill $UP 2>/dev/null
sleep 1
echo "--- upstream events"
cat "$HERE/upstream-events.log" 2>/dev/null | cut -d' ' -f2-
echo "--- worker log"
grep -i "Streaming error" "$HERE/wrangler2.log" | sed 's/\x1b\[[0-9;]*m//g' | head -5
for p in 4391 4392; do lsof -nP -iTCP:$p -sTCP:LISTEN >/dev/null && echo "port $p STILL BUSY" || echo "port $p released"; done
