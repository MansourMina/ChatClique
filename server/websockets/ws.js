const WebSocket = require('ws');

function wsServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    console.log('New client connected!');

    ws.on('close', () => {
      console.log('Client disconnected!');
    });
  });
}

module.exports = { wsServer };
