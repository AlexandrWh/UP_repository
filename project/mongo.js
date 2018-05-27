const mongoose = require('mongoose');
const PhotoPostSchema = new mongoose.Schema({
    id: String,
    description: String,
    createdAt: Date,
    author: String,
    photoLink: String,
    likes: Array,
    tags: String
});

const PhotoPost = mongoose.model('photoposts',PhotoPostSchema);

function addPhotoPost(post) {
    return PhotoPost.findOne({id: post.id}).then(photopost=>{
        if(!photopost){
            photopost = new PhotoPost(post);
            return photopost.save();
    }});
}

function getPhotoPost(id){
    return PhotoPost.findOne({id: id}).then((post) => {
        console.log(post);
        return post;
    });
}

function deletePhotoPost(id) {
    return PhotoPost.findOneAndDelete({id: id}).then((post)=>{
        console.log(post);
        return post;
    });
}

function editPhotoPost(id, content) {
    return PhotoPost.findOneAndUpdate({id: id}, { $set: content}).then((post) =>{
        console.log(post);
        return post;
    })
}

function likePhotoPost(id, user) {
    return PhotoPost.findOne({id: id}).then(post=>{
        post.likes.push(user);
        post.save();
        console.log(post);
    });
}

module.exports = {
    addPhotoPost,
    getPhotoPost,
    editPhotoPost,
    deletePhotoPost,
    likePhotoPost
};






