#!/bin/sh

# Consume the hook payload from stdin. The matcher already scopes when this runs.
cat >/dev/null

if node scripts/check-bootstrap-compat.js >/tmp/cursor-bootstrap-compat.log 2>&1; then
  printf '%s\n' '{"permission":"allow"}'
  exit 0
fi

printf '%s\n' '{"permission":"deny","user_message":"Blocked because the Bootstrap paragraph margin guard failed. Run `node scripts/check-bootstrap-compat.js` and add `m-0`, `mb-0`, or `my-0` to affected `<p>` tags before retrying.","agent_message":"Prevented a commit/push/publish command because scripts/check-bootstrap-compat.js reported one or more violations."}'
exit 2
