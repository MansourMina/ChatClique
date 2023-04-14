const messagesModel = require('./model/messages');

const searchNumbers = async () => {
  try {
    let users = await messagesModel.getUsers();
    let searchId = users.map((el) => el.user_id);
    console.log(searchId);
  } catch (err) {
    console.log('HS');
  }

  // let randomNumber = () => {
  //   return Math.floor(Math.random() * (1000 - 9999));
  // };
};

searchNumbers();
