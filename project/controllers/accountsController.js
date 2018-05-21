const fs = require('fs');

const filePath = './data/users.json';
const users = JSON.parse(fs.readFileSync(filePath));

module.exports.findUser = function findUser(email, password) {
  const foundUser = Object.assign({}, users.find(user => user.email === email && user.password === password));
  if (foundUser.email) {
    delete foundUser.email;
    delete foundUser.password;
    return foundUser;
  }
  else{
    return false;
  }
};

