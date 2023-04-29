const WebSocket = require('ws');
const axios = require('axios');
let connections = [];
function wsServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });
  wss.on('connection', (ws) => {
    ws.on('message', (p) => {
      const data = JSON.parse(p);
      if (data.type == 'connected') {
        registerConnection(ws, data.payload);
      }
      if (data.type == 'message') {
        sendMessage(data.payload);
      }
      if (data.type == 'read') {
        read(ws, data.payload);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected!');
      let disonnectedUser = connections.find((el) => el.ws === ws);
      if (disonnectedUser) {
        connections.forEach((el) => {
          el.ws.send(
            JSON.stringify({
              type: 'disconnected',
              payload: disonnectedUser.connection.user,
            }),
          );
          connections = connections.filter((el) => el.ws != ws);
        });
      }
    });
  });
}

function sendMessage(payload) {
  axios
    .post('http://localhost:3000/messages', payload.message)
    .then((data) => {
      payload.message = data.data;
    })

    .catch(function () {});
  connections.forEach((el) => {
    if (
      el.connection.user.user_id == payload.receiver.user_id ||
      el.connection.user.user_id == payload.sender.user_id
    ) {
      el.ws.send(
        JSON.stringify({
          type: 'text',
          payload: {
            sender: payload.sender,
            receiver: payload.receiver,
            message: payload.message,
          },
        }),
      );
    }
  });
}

function read(ws, payload) {
  ws.send(
    JSON.stringify({
      type: 'readMessage',
      payload: payload,
    }),
  );
  axios
    .patch(
      'http://localhost:3000/messages/' + payload.chat_id,
      payload.message.message_id,
    )
    .then()
    .catch(function () {});
}

async function registerConnection(ws, user) {
  // send status to client
  if (
    connections.find((el) => el.connection.user.user_id == user.user.user_id)
  ) {
    ws.send(
      JSON.stringify({
        type: 'connection status',
        payload: 'connection rejected',
      }),
    );
  } else {
    // save new connection and websocket in connections
    connections.push({ ws: ws, connection: user });
    const { data } = await axios.get(
      `http://127.0.0.1:3000/chats/${user.user.user_id}`,
    );

    ws.send(
      JSON.stringify({
        type: 'loadMessages',
        payload: data,
      }),
    );

    console.log('New client connected!');

    connections.forEach((el) => {
      el.ws.send(
        JSON.stringify({
          type: 'connected',
          payload: connections.map((el) => el.connection.user),
        }),
      );
    });
  }
}
module.exports = { wsServer };
