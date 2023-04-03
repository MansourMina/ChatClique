const db = require('../db');

async function getMessages() {
  const { rows } = await db.query('SELECT text from messages');
  return rows;
}

async function getChatsOfUser(userId) {
  const { rows } = await db.query(
    `SELECT CASE
           WHEN f.user1_id = $1 THEN (u2.username, u2.user_id)
           ELSE (u1.username, u1.user_id)
           END as friend,
       chat_name, c.chat_id,
       json_agg(json_build_object('message_id',m.message_id,'username', sender.username, 'user_id', sender.user_id, 'message',
                                  m.text)) AS messages
FROM friendships f
         JOIN users u1 ON f.user1_id = u1.user_id
         JOIN users u2 ON f.user2_id = u2.user_id
         JOIN chat_friendships cf on f.friendships_id = cf.friendship_id
         JOIN chats c on cf.chat_id = c.chat_id
         JOIN messages m on c.chat_id = m.chat_id
         JOIN users sender on sender.user_id = m.user_id
WHERE
    (f.user1_id = $1 OR f.user2_id = $1)
GROUP BY f.user1_id,u2.username, u2.user_id,u1.username, u1.user_id,chat_name,c.chat_id `,
    [userId],
  );

  rows.forEach((el) => {
    el.friend = el.friend.replace('(', '');
    el.friend = el.friend.replace(')', '');
    let splittedFriend = el.friend.split(',');
    el.friend = [{ username: splittedFriend[0], user_id: splittedFriend[1] }];

    el.messages.forEach((m) => {
      ownMessage = false;
      if (m.user_id === userId) m.ownMessage = true;
      else m.ownMessage = false;
    });
  });

  return rows;
}

async function postMessage(body) {
  const { rows } = await db.query(
    'INSERT INTO messages (message_id,text, send_date, user_id, chat_id) VALUES ($1, $2, $3, $4,$5);',
    [body.message_id, body.text, body.send_date, body.user_id, body.chat_id],
  );
  return rows[0];
}
module.exports = { getMessages, getChatsOfUser, postMessage };
