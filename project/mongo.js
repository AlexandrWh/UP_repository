const mongoose = require('mongoose');
const PhotoPostSchema = new mongoose.Schema({
    id: {type:String},
    description: {type:String},
    createdAt: {type:Date},
    author: {type:String},
    photoLink: {type:String},
    likes: {type:Array},
    tags: {type:String}
});

const PhotoPost = mongoose.model('photoposts',PhotoPostSchema);

module.exports = {
    addPhotoPost
};

function addPhotoPost(post) {
    return PhotoPost.findOne({id: post.id}).then(photopost=>{
        if(!photopost){
        photopost = new PhotoPost(post);
        return photopost.save();
    }
})
}

/*function editPhotoPost(id, content) {

}

function deletePhotoPost(id) {

}*/