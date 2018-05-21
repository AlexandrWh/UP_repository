import PhotoPost from './PhotoPost';
import PhotoPosts from './PhotoPosts';

const postsData = [
  {
    author: 'Simon Karasik',
    description: 'post #1',
    createdAt: new Date(),
    photoLink: 'http://google.com',
  },
  {
    author: 'Alex Mukharski',
    description: 'post #2',
    createdAt: new Date(2018, 0, 0),
    photoLink: 'http://google.by',
    tags: ['tag1', 'tag2', 'tag3'],
  },
  {
    author: 'Alex Kovalchuk',
    description: 'post #3',
    createdAt: new Date(2017, 0, 5),
    photoLink: 'http://google.ru',
    tags: ['hello', "it's", 'me', 'tag2'],
  },
].map(postData => new PhotoPost(postData));
const badPostsData = [
  {
    author: 'Bad man',
    description: null,
    createdAt: 'never',
  },
  {
    author: 'Even worse man',
  },
].map(postData => new PhotoPost(postData));


console.log('PhotoPost');
console.log('#validate');
console.log('Post should be valid(true):', PhotoPost.validate(postsData[0]));
console.log('Post should be invalid(false):', PhotoPost.validate(badPostsData[0]));
console.log();

let photoPosts = new PhotoPosts();
console.log('PhotoPosts');
console.log('#addPhotoPost(post)');
console.log('Add valid post(true)', photoPosts.addPhotoPost(postsData[0]));
console.log('Add invalid post(false)', photoPosts.addPhotoPost(badPostsData[0]));
console.log();
console.log('#like');
console.log('like post:');
const examplePost = new PhotoPost({
  author: 'Arnold',
  description: 'In USA',
  photoLink: 'http',
  createdAt: new Date(),
});
examplePost.like('Simon Karasik');
console.log(examplePost);
console.log('#dislike');
examplePost.dislike('Simon Karasik');
console.log(examplePost);

console.log('#getPhotoPosts(skip, top, filterOptions)');
photoPosts = new PhotoPosts();
postsData.forEach(post => photoPosts.addPhotoPost(post));
console.log('getPhotoPosts()');
console.log(photoPosts.getPhotoPosts());
console.log('getPhotoPosts(0, 0)');
console.log(photoPosts.getPhotoPosts(0, 0));
console.log('getPhotoPosts(1, 2)');
console.log(photoPosts.getPhotoPosts(1, 2));
console.log("getPhotoPosts(0, 0, {tags: ['tag2']})");
console.log(photoPosts.getPhotoPosts(0, 10, { tags: ['tag2'] }));
console.log('getPhotoPosts(100, 1000)');
console.log(photoPosts.getPhotoPosts(100, 1000));
console.log();

console.log('#getPhotoPost(id)');
console.log("getPhotoPost('2')");
console.log(photoPosts.getPhotoPost('2'));
console.log("getPhotoPost('666') (should return null)");
console.log(photoPosts.getPhotoPost('666'));
console.log();

console.log('#editPhotoPost(id, {description, tags, photoLink})');
console.log('no post with such id (false): ', photoPosts.editPhotoPost('666', {}));
console.log('photoLink is empty (false): ', photoPosts.editPhotoPost('1', { photoLink: '' }));
console.log(
  'description is too long (false): ',
  photoPosts.editPhotoPost('1', { description: ''.padStart(300, 'hello') }),
);
console.log(
  'valid data (true): ',
  photoPosts.editPhotoPost('1', { tags: ['newTag1', 'newTag2'], description: 'edit it!' }),
);
console.log('after editing: ');
console.log(photoPosts.getPhotoPosts(0, 10));
console.log();

console.log('#removePhotoPost(id)');
console.log('no such id(false): ', photoPosts.removePhotoPost('666'));
console.log('post removed(true): ', photoPosts.removePhotoPost('1'));
console.log('after removing:');
console.log(photoPosts.getPhotoPosts(0, 10));
