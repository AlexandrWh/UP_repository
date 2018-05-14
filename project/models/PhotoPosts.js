const PhotoPost = require('./PhotoPost');

class PhotoPosts {
  constructor() {
    this.photoPosts = [];
    this.isSorted = true;
  }

  static fromArray(arr) {
    const posts = new PhotoPosts();
    arr.forEach(post => posts.addPhotoPost(post));
    return posts;
  }

  /**
  * @param {number} skip
  * @param {number} top
  * @param {{author? : String, fromDate? : Date, toDate? : Date, tags? : [String]}} filterConfig
  * @returns {[PhotoPost]}
  */
  getPhotoPosts(skip = 0, top = 10, filterConfig) {
    if (!this.isSorted) {
      this.photoPosts.sort((p1, p2) => p1.createdAt < p2.createdAt);
      this.isSorted = true;
    }
    const result = [];
    for (let i = skip; i < Math.min(this.photoPosts.length, skip + top); i++) {
      let isGood = true;
      const post = this.photoPosts[i];
      if (filterConfig) {
        if (filterConfig.author && post.author !== filterConfig.author) {
          isGood = false;
        }
        if (filterConfig.fromDate && post.createdAt < filterConfig.fromDate) {
          isGood = false;
        }
        if (filterConfig.toDate && post.createdAt > filterConfig.toDate) {
          isGood = false;
        }
        if (filterConfig.tags && !filterConfig.tags.every(tag => post.tags.indexOf(tag) !== -1)) {
          isGood = false;
        }
      }
      if (isGood) {
        result.push(post);
      }
    }
    return result;
  }

  getArray() {
    return this.photoPosts;
  }

  /**
  * @param {PhotoPost} post
  * @returns {PhotoPost} created post
  */
  addPhotoPost(_post) {
    let post = _post;
    if (!(post instanceof PhotoPost)) {
      post = new PhotoPost(_post);
    }
    if (!PhotoPost.validate(post)) {
     // return false;
    }
    this.photoPosts.push(post);
    this.isSorted = false;
    return post;
  }

  getAllPosts() {
    return this.photoPosts.slice();
  }

  getPhotoPostsCnt() {
    return this.photoPosts.length;
  }

  /**
  * @param {String} id
  * @returns {PhotoPost | null} Returns post with such id or null if not found.
  */
  getPhotoPost(id) {
    return this.photoPosts.find(post => post.id === id) || null;
  }

  /**
  * @returns {Boolean} success / failure
  */
  editPhotoPost(id, { description, tags, photoLink }) {
    const ind = this.photoPosts.findIndex(post => post.id === id);
    if (ind === -1) {
      return false;
    }
    const editedPost = Object.assign(new PhotoPost({}), this.photoPosts[ind]);
    if (typeof photoLink !== 'undefined') {
      editedPost.photoLink = photoLink;
    }
    if (tags) {
      editedPost.tags = tags;
    }
    if (typeof description !== 'undefined') {
      editedPost.description = description;
    }
    if (!PhotoPost.validate(editedPost)) {
      return false;
    }
    this.photoPosts[ind] = editedPost;
    return editedPost;
  }

  /**
  * @param {String} id
  * @returns {Boolean} success / failure
  */
  removePhotoPost(id) {
    const ind = this.photoPosts.findIndex(post => post.id === id);
    if (ind === -1) {
      return false;
    }
    this.photoPosts.splice(ind, 1);
    return true;
  }
}

module.exports = PhotoPosts;
