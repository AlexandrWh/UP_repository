import PhotoPost from './models/PhotoPost';

function buildRequest(url, params = {}) {
  const stringParams = Object.keys(params)
    .filter(key => typeof params[key] !== 'undefined')
    .reduce(
      (res, key) => `${res}&${key}=${
        params[key] instanceof Object ? JSON.stringify(params[key]) : params[key]}`,
      '',
    );
  return `${url}?${stringParams.slice(1)}`;
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function objectToFormData(obj) {
  const data = new FormData();
  Object.getOwnPropertyNames(obj)
    .forEach(key => data.append(key, obj[key]));
  return data;
}

function parsePost(rawPost) {
  const postObj = Object.assign({}, rawPost, { createdAt: new Date(rawPost.createdAt) });
  return new PhotoPost(postObj);
}

export function getPost(id) {
  return fetch(buildRequest(`/posts/${id}`))
    .then(handleErrors)
    .then(response => response.json())
    .then(rawPost => parsePost(rawPost));
}

export function getPosts(skip = 0, top = 10, filterConfig = {}) {
  return fetch(buildRequest('/posts', { top, skip, filterConfig }))
    .then(handleErrors)
    .then(response => response.json())
    .then(rawPosts => rawPosts.map(rawPost => parsePost(rawPost)));
}

export function likePost(id, user) {
  return fetch(buildRequest(`/posts/${id}/like`, { user }), {
    method: 'PUT',
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(json => parsePost(json));
}

export function createPost(post) {
  return fetch('/posts', {
    method: 'POST',
    body: objectToFormData(post),
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(json => parsePost(json));
}

export function updatePost(id, post) {
  const data = objectToFormData(post);
  return fetch(`/posts/${id}`, {
    method: 'PUT',
    body: data,
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(json => parsePost(json));
}

export function deletePost(id) {
  return fetch(`/posts/${id}`, {
    method: 'DELETE',
  });
}

export function login(email, password) {
  return fetch('/auth', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject();
  });
}

export function poll() {
  return fetch('/poll')
    .then(handleErrors)
    .then(response => response.json())
    .then(postsRaw => postsRaw.map(rawPost => parsePost(rawPost)));
}
