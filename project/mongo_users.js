const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    login: {type:String},
    password: {type:String},
});

const User = mongoose.model('users',UserSchema);

function addUser() {

}

function getUser() {

}