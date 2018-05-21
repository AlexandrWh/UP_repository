import { getState } from './state';
import { removeChildren, render } from './util';
import PhotoPosts from './components/PhotoPosts';
import PageNotFound from './components/PageNotFound';
import SignIn from './components/SignIn';
import App from './components/App';
import Editor from './components/Editor';
import { default as PhotoPostsModel } from './models/PhotoPosts';
import * as api from './api';

function clearPostsViewConfig() {
  getState().postsInViewCnt = 0;
  getState().filterConfig = null;
}

function setPage(pageName, args) {
  removeChildren(document.body);
  clearPostsViewConfig();
  let page = null;
  switch (pageName) {
    case 'signIn':
      page = SignIn();
      break;
    case 'app':
      page = App();
      break;
    case 'editor':
      page = Editor(args);
      break;
    default:
      page = PageNotFound();
  }
  render(page, document.body);
}

// function poll() {
//   api.poll()
//     .then((polledPosts) => {
//       polledPosts.forEach((polledPost) => {
//         if (polledPost)
//       });
//       poll();
//     });
// }

function showPosts() {
  const { posts, postsInViewCnt, filterConfig } = getState();
  const postsToShow = posts.getPhotoPosts(0, postsInViewCnt, filterConfig);
  PhotoPosts.render(postsToShow);
}

function loadMorePostsIfNeeded(wantedPostsCnt) {
  const { filterConfig } = getState();
  const availablePosts = getState().posts.getPhotoPosts(0, wantedPostsCnt, filterConfig);
  const availablePostsCnt = availablePosts.length;
  if (availablePostsCnt < wantedPostsCnt) {
    return api.getPosts(availablePostsCnt, wantedPostsCnt - availablePostsCnt, filterConfig)
      .then((posts) => {
        posts.forEach(post => getState().posts.addPhotoPost(post));
        return availablePostsCnt + posts.length;
      });
  }
  return Promise.resolve(wantedPostsCnt);
}

async function loadMorePostsIfNeededAndShow(wantedPostsCnt) {
  const availablePostsCnt = await loadMorePostsIfNeeded(wantedPostsCnt);
  getState().postsInViewCnt = availablePostsCnt;
  showPosts();
}

function showMorePosts() {
  loadMorePostsIfNeededAndShow(getState().postsInViewCnt + getState().postsPerPage);
}
async function removePost(id) {
  try {
    await api.deletePost(id);
    getState().postsInViewCnt--;
    getState().posts.removePhotoPost(id);
    PhotoPosts.remove(id);
  } catch (e) {
    console.log(e);
  }
}

function filterPosts(filterConfig) {
  clearPostsViewConfig();
  getState().filterConfig = filterConfig;
  loadMorePostsIfNeededAndShow(getState().postsPerPage);
}

async function likePost(id) {
  const post = await api.likePost(id, getState().user.name);
  getState().posts.editPhotoPost(id, post);
  PhotoPosts.update(id, post);
}

function editPost(id) {
  setPage('editor', getState().posts.getPhotoPost(id));
}

function createPost() {
  setPage('editor');
}

async function savePost(postToSave) {
  if (postToSave.id) {
    const post = await api.updatePost(postToSave.id, postToSave);
    getState().posts.editPhotoPost(post.id, post);
  } else {
    postToSave.author = getState().user.name;
    getState().posts.addPhotoPost(post);
    setPage('app');
  }
}

function logout() {
  getState().user = null;
  getState().posts = PhotoPostsModel.fromArray([]);
  getState().postsInViewCnt = 0;
  setPage('signIn');
}

async function login({
  email,
  password,
  onLoggedIn,
  onError,
  asGuest,
}) {
  if (asGuest) {
    getState().user = null;
    onLoggedIn();
  } else {
    try {
      const user = await api.login(email, password);
      getState().user = user;
      onLoggedIn();
    } catch (err) {
      onError();
    }
  }
}

export default function handle(action) {
  switch (action.type) {
    case 'LIKE_POST':
      likePost(action.id);
      break;
    case 'REMOVE_POST':
      removePost(action.id);
      break;
    case 'CREATE_POST':
      createPost();
      break;
    case 'FILTER_POSTS':
      filterPosts(action.filterConfig);
      break;
    case 'SHOW_POSTS': {
      clearPostsViewConfig();
      loadMorePostsIfNeededAndShow(getState().postsPerPage);
      break;
    }
    case 'EDIT_POST':
      editPost(action.id);
      break;
    case 'SAVE_POST':
      savePost(action.post);
      break;
    case 'SHOW_MORE_POSTS':
      showMorePosts();
      break;
    case 'CANCEL_EDITING':
      setPage('app');
      break;
    case 'SET_PAGE':
      setPage(action.pageName);
      break;
    case 'LOGIN':
      login(action);
      break;
    case 'LOGOUT':
      logout();
      break;
    default:
      break;
  }
}
