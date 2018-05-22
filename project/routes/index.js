const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const postsController = require('../controllers/postsController');
const accountsController = require('../controllers/accountsController');

const photosDir = path.resolve(__dirname, '../data/photos');
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
});
const upload = multer({
  storage,
});

// const changesHistory = [];

function parseFormData(req, res, next) {
  if (req.file) {
    req.body.photoLink = `photos/${req.file.filename}`;
  }
  if(req.body.likes)
    req.body.likes = req.body.likes.split(',');
  else req.body.likes = [];
  next();
}

function deletePhotoFile(photoLink) {
  const photoPath = path.join(photosDir, path.basename(photoLink));
  fs.unlink(photoPath, () => {});
}

router.get('/photos/:id', (req, res) => {
  res.sendFile(path.join(photosDir, req.params.id));
});

router.get('/posts/:id', (req, res) => {
  const post = postsController.getPost(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

router.get('/posts', (req, res) => {
  const { top = 10, skip = 0 } = req.query;
  const filterConfig = req.query.filterConfig ? JSON.parse(req.query.filterConfig) : {};
  const posts = postsController.getPosts(skip, top, filterConfig);
  res.json(posts);
});

router.put('/posts/:id/like', (req, res) => {
  const post = postsController.likePost(req.params.id, req.query.user);
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

router.post('/posts', upload.single('photoFile'), parseFormData, (req, res) => {
  console.log(req.body);
  const post = postsController.createPost(req.body);
  console.log(post);
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(400);
  }
});

router.put('/posts/:id', upload.single('photoFile'), parseFormData, (req, res) => {
  const oldPost = postsController.getPost(req.params.id);
  //console.log(oldPost);
  if (!oldPost) {
    return res.sendStatus(404);
  }
  deletePhotoFile(oldPost.photoLink); // delete old file
  const post = postsController.updatePost(req.params.id, req.body);
  if (post) {
    return res.json(post);
  }
  return res.sendStatus(400);
});

router.delete('/posts/:id', (req, res) => {
  const post = postsController.getPost(req.params.id);
  if (!post) {
    return res.sendStatus(404);
  }
  deletePhotoFile(post.photoLink);
  if (postsController.removePost(req.params.id)) {
    return res.sendStatus(200);
  }
  return res.sendStatus(404);
});

router.post('/auth', (req, res) => {
  const user = accountsController.findUser(req.body.email, req.body.password);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(401);
  }
});

// router.get('/poll', (req, res) => {

// });

module.exports = router;
