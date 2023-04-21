const db = require('../db');

async function getMessages() {
  const { rows } = await db.query('SELECT message from messages');
  return rows;
}

async function getChatsOfUser(userId) {
  const { rows } = await db.query(
    `SELECT  user_friend.username as friend_username, user_friend.user_id as friend_user_id, user_friend.image as friend_image,
       c.chat_id,
       COUNT(m.receiver_read) FILTER (where m.receiver_read = false and m.sender_id != $1)                                 AS unread,
       json_agg(json_build_object('message_id', m.message_id, 'username', sender.username, 'sender_id', sender.user_id,
                                  'send_date', send_date, 'receiver_read', receiver_read,  'type',type, 'message',
                                  m.message))                                                           AS messages

FROM friendships f
         JOIN chat_friendships cf on f.friendship_id = cf.friendship_id
         JOIN chats c on cf.chat_id = c.chat_id
          LEFT JOIN messages m on c.chat_id = m.chat_id
          LEFT JOIN users sender on sender.user_id = m.sender_id
          JOIN users user_friend
              on user_friend.user_id = (SELECT Case when f.user1_id = $1 then f.user2_id else f.user1_id end)

WHERE (f.user1_id = $1 OR f.user2_id = $1)
GROUP BY c.chat_id,user_friend.username, user_friend.user_id `,
    [userId],
  );

  rows.forEach((el) => {
    el.friend = [
      {
        username: el.friend_username,
        user_id: el.friend_user_id,
        image: el.friend_image,
      },
    ];
    delete el.friend_username;
    delete el.friend_user_id;
    delete el.friend_image;
    if (!el.messages[0].message_id) el.messages = [];
    else
      el.messages = el.messages.sort(
        (a, b) => new Date(a.send_date) - new Date(b.send_date),
      );
  });

  return rows;
}

async function postMessage(body) {
  const { rows } = await db.query(
    'INSERT INTO messages (message_id,message, send_date, sender_id, chat_id, type, receiver_read) VALUES ($1, $2, $3, $4,$5, $6, $7) returning *; ',
    [
      body.message_id,
      body.message,
      body.send_date,
      body.sender_id,
      body.chat_id,
      body.type,
      false,
    ],
  );
  return rows[0];
}

async function getUsersByEmail(email) {
  const { rows } = await db.query(
    'SELECT username, name, user_id, email, image, password from users where email = $1',
    [email],
  );
  return rows[0];
}

async function getUsers() {
  const { rows } = await db.query(
    'SELECT username, name, user_id, email from users ',
  );
  return rows;
}

async function registerUser(body) {
  const { rows } = await db.query(
    'INSERT INTO users (user_id, username, email, password, name, image) VALUES ($1, $2, $3, $4, $5, $6)',
    [
      body.userId,
      body.username,
      body.email,
      body.password,
      body.name,
      body.image,
    ],
  );
  return rows[0];
}

async function postRequest(body) {
  const { rows } = await db.query(
    'INSERT INTO friendship_requests (from_user_id,to_user_id,requested_date, status) VALUES ($1, $2, $3, $4);',
    [body.from_user_id, body.to_user_id, body.requested_date, body.status],
  );
  return rows[0];
}
async function delRequest(request_id) {
  const { rows } = await db.query(
    'DELETE from friendship_requests where request_id = $1',
    [request_id],
  );
  return rows[0];
}
async function addFriendship(body) {
  const { rows } = await db.query(
    'INSERT INTO friendships (user1_id, user2_id) VALUES ($1, $2) returning friendship_id',
    [body.user1_id, body.user2_id],
  );
  return rows[0];
}

async function addChat(date) {
  const { rows } = await db.query(
    'INSERT INTO chats (created_date) VALUES ($1) returning chat_id',
    [date],
  );
  return rows[0];
}

async function addChatFriendship(chat_id, friendship_id) {
  const { rows } = await db.query(
    'INSERT INTO chat_friendships (chat_id, friendship_id) VALUES ($1, $2) returning chat_friendship_id',
    [chat_id, friendship_id],
  );
  return rows[0];
}
async function getRequests(user_id) {
  const { rows } = await db.query(
    `SELECT request_id,
       from_user_id,
       to_user_id,
       requested_date,
       status,
       username as requested_username,
       name as requested_name
from friendship_requests
         JOIN users ON from_user_id = user_id where to_user_id = $1`,
    [user_id],
  );
  return rows;
}

async function getFriends(user_id) {
  const { rows } = await db.query(
    `SELECT 
from friendships
         JOIN users ON from_user_id = user_id where user1_id = $1 or user2_id = $1`,
    [user_id],
  );
  return rows;
}

async function readMessage(chat_id, message_id) {
  const { rows } = await db.query(
    'UPDATE messages set receiver_read = true where chat_id = $1 AND message_id = $2',
    [chat_id, message_id],
  );
  return rows;
}

async function readAllMessages(chat_id) {
  const { rows } = await db.query(
    'UPDATE messages set receiver_read = true where chat_id = $1',
    [chat_id],
  );
  return rows;
}

module.exports = {
  getChatsOfUser,
  postMessage,
  getUsersByEmail,
  getUsers,
  registerUser,
  postRequest,
  getRequests,
  delRequest,
  addFriendship,
  getFriends,
  getMessages,
  addChatFriendship,
  addChat,
  readMessage,
  readAllMessages,
};
