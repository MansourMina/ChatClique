const bcrypt = require('bcrypt');

const x = async () => {
  let hash = await bcrypt.compare('1234', '1234');
  console.log(hash);
};
x();
