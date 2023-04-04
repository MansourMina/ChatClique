const WebSocket = require('ws');
const { postMessage, generateMessageId } = require('../controllers/messages');

let connections = [];
function wsServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    // console.log('New client connected!');
    ws.on('message', async (p) => {
      const data = JSON.parse(p);
      if (data.type == 'connected') {
        registerConnection(ws, data.payload);
      }
      if (data.type == 'message') {
        const payload = data.payload;
        payload.message.message_id = generateMessageId();

        connections.forEach((el) => {
          if (
            el.connection.user_id == payload.receiver.user_id ||
            el.connection.user_id == payload.sender.user_id
          ) {
            el.ws.send(
              JSON.stringify({
                type: 'text',
                art: 'message',
                payload: {
                  sender: payload.sender,
                  receiver: payload.receiver,
                  message: payload.message,
                },
              }),
            );
          }
        });
        await postMessage(payload.message);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected!');
      connections = connections.filter((el) => el.ws != ws);
    });
  });
}

function registerConnection(ws, user) {
  // send status to client
  if (connections.find((el) => el.connection.user_id == user.user_id)) {
    ws.send(
      JSON.stringify({
        type: 'connection status',
        payload: 'connection rejected',
      }),
    );
  } else {
    // save new connection and websocket in connections
    connections.push({ ws: ws, connection: user });
    console.log(connections.map((el) => el.connection));
    console.log('New client connected!');

    ws.send(
      JSON.stringify({
        type: 'connection status',
        payload: 'connection accepted',
      }),
    );
    // connections.forEach((el) =>
    //   el.ws.send(
    //     JSON.stringify({
    //       type: 'text',
    //       art: 'information',
    //       payload: { nickname: nick, message: 'wurde hinzugefügt' },
    //     }),
    //   ),
    // );
    // updateNickNames();
  }
}
module.exports = { wsServer };
