const https = require('https');
const http = require('http');

// Target URL resolution: RENDER_EXTERNAL_URL -> NEXT_PUBLIC_APP_URL -> BETTER_AUTH_URL -> Default Render URL
const BASE_URL = 
  process.env.RENDER_EXTERNAL_URL || 
  process.env.NEXT_PUBLIC_APP_URL || 
  process.env.BETTER_AUTH_URL || 
  'https://party-member-platform.onrender.com';

// Clean base URL and target the health endpoint
const CLEAN_BASE = BASE_URL.replace(/\/+$/, '');
const TARGET_URL = `${CLEAN_BASE}/api/health`;

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (keeps Render free instances from sleeping after 15m)
const INITIAL_DELAY = 30 * 1000; // 30 seconds (allows Next.js server to finish binding to port on boot)

console.log(`[Ping Service] Starting keep-alive service...`);
console.log(`[Ping Service] Target URL: ${TARGET_URL}`);
console.log(`[Ping Service] Ping Interval: Every 14 minutes (Initial ping in 30 seconds)`);

// Initial ping after 30 seconds to ensure server is listening
setTimeout(() => {
  pingServer();
}, INITIAL_DELAY);

// Interval pings every 14 minutes
setInterval(pingServer, PING_INTERVAL);

function pingServer() {
  const client = TARGET_URL.startsWith('https') ? https : http;

  console.log(`[Ping Service] Sending keep-alive request to ${TARGET_URL} at ${new Date().toISOString()}...`);

  client.get(TARGET_URL, (res) => {
    console.log(`[Ping Service] Response received. Status Code: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[Ping Service] Error pinging ${TARGET_URL}: ${err.message}`);
  });
}
