const mongoose = require('mongoose');

const PhotoPost = new mongoose.Schema({
    id: {type:String},
    description: {type:String},
    createdAt: {type:Date},
    author: {type:String},
    photoLink: {type:String},
    likes: {type:Array},
    tags: {type:String}
});

module.exports = {
    addPhotoPost
};

function addPhotoPost(post) {
    return PhotoPost.findOne({id: post.id}).then((photopost)=>{
        if(!photopost){
            photopost = new PhotoPost({
                id: {type:String},
                description: {type:String},
                createdAt: {type:Date},
                author: {type:String},
                photoLink: {type:String},
                likes: {type:Array},
                tags: {type:String}
                });
            return photopost.save();
        }
    })
}

function rePhotoPost(id, content) {

}

function deletePhotoPost(id) {

}

