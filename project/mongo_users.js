const mongoose = require('mongoose');

const User = new mongoose.Schema({
    login: {type:String},
    password: {type:String},
    posts: {type:Array}
});

function addUser() {

}
