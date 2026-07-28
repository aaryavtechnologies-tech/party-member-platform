const https = require('https');

const URL = 'https://rashtriyaannadatavikasparty.org';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

console.log(`[Ping] Starting ping service for ${URL} every 14 minutes`);

// Initial ping after 5 seconds to ensure server is up
setTimeout(() => {
  pingServer();
}, 5000);

// Set interval for subsequent pings
setInterval(pingServer, PING_INTERVAL);

function pingServer() {
  https.get(URL, (res) => {
    console.log(`[Ping] Sent keep-alive ping to ${URL}. Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[Ping] Error pinging ${URL}: ${err.message}`);
  });
}
