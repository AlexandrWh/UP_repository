var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const mainModule = require('./public/module.js');
const way = './server/data/posts.json';

app.use('/', express.static('public'));
app.use(bodyParser.json());

function getPhotoPosts() {
    let posts = fs.readFileSync(way);
    posts = JSON.parse(posts.toString());
    return posts;
}

app.get('/getPost', (req, res) => {
    let posts = getPhotoPosts();
    posts.getPost = mainModule.getPhotoPost;
    let post = posts.getPost(req.query.id.toString());
    if (posts) {
        res.send(post).end();
    } else {
        res.send(404).end();
    }
})

app.delete('/removePhotoPost', (req, res) => {
    let posts = getPhotoPosts();
    posts.removePost = mainModule.removePhotoPost;
    if (posts.removePost(req.query.id.toString())) {
        fs.writeFileSync(way, JSON.stringify(posts));
        res.send(200).end();
    } else {
        res.send(404).end();
    }
})

app.post('/addPhotoPost', (req, res) => {
        let posts = getPhotoPosts();
        posts.addPost = mainModule.addPhotoPost;
        if (posts.addPost(req.body)) {
            fs.writeFileSync(way, JSON.stringify(posts));
            res.send(200).end();
        } else {
            res.send(404).end();
        }
    }
)

app.put('/editPhotoPost', (req, res) => {
        let posts = getPhotoPosts();
        posts.editPost = mainModule.editPhotoPost;
        posts.getPost = mainModule.getPhotoPost;
        let post = posts.getPost(req.query.id.toString());
        if (posts.editPost(req.query.id.toString(), req.body, post)) {
            fs.writeFileSync(way, JSON.stringify(posts));
            res.send(posts).end();
        } else {
            res.send(404).end();
        }
    }
)

app.post('/getPhotoPosts', (req, res) => {
    let posts = getPhotoPosts();
    const skip = req.query.skip;
    const top = req.query.top;
    const filterConfig = req.body;
    posts.getPhotoPosts = mainModule.getPhotoPosts;
    if (skip >= 0 && top >= 0 && filterConfig !== undefined) {
        res.send(posts.getPhotoPosts(skip, top, filterConfig)).end();
    } else {
        res.send(404).end();
    }

})

app.listen(3000, function () {
  console.log('listen 3000 port');
});