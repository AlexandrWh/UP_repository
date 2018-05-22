function isString(s) {
    return typeof s === 'string' || s instanceof String;
}

/*PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel*/
let PhotoPostsModel = (function () {
    return class PhotoPosts {
        constructor() {
            this.photoPosts = [];
            this.isSorted = true;
        }

        static fromArray(arr) {
            const posts = new PhotoPosts();
            arr.forEach(post => posts.addPhotoPost(post));
            return posts;
        }

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

        addPhotoPost(post) {
            this.photoPosts.push(post);
            this.isSorted = false;
            return post;
        }

        getPhotoPost(id) {
            return this.photoPosts.find(post => post.id === id) || null;
        }

        editPhotoPost(id, fieldsToEdit) {
            const ind = this.photoPosts.findIndex(post => post.id === id);
            if (ind === -1) {
                return false;
            }
            Object.assign(this.photoPosts[ind], fieldsToEdit);
            return true;
        }

        removePhotoPost(id) {
            const ind = this.photoPosts.findIndex(post => post.id === id);
            if (ind === -1) {
                return false;
            }
            this.photoPosts.splice(ind, 1);
            return true;
        }
    }

})();
/*************************************module*****************************************************************/

/*util util util util util util util util util util util util util util util util util util util util*/
let util = (function () {
    function stringToDOMElement(s) {
        const template = document.createElement('template');
        template.innerHTML = s;
        return template.content.firstChild;
    }

    function addClassIf(condition, className, elseClassName = '') {
        return condition ? (' ' + className) : (' ' + elseClassName);
    }

    function renderIf(condition, html) {
        return condition ? html : '';
    }

    function wrap(element) {
        const wrapper = document.createElement('div');
        wrapper.appendChild(element);
        return wrapper;
    }

    function render(elements, wrapper) {
        if (!Array.isArray(elements)) {

            elements = [elements];
        }

        elements.forEach(element => wrapper.appendChild(element));
        return wrapper;
    }

    function createElement(tag, props, ...children) {
        const element = document.createElement(tag);
        Object.keys(props).forEach((propName) => {
            element[propName] = props[propName]
        });
        children.forEach(child => element.appendChild(child));
        return element;
    }

    function removeChildren(element) {
        // console.log(element);
        const children = [];
        if (element) {
            while (element.firstChild) {
                // console.log(1);
                children.push(element.firstChild);
                element.removeChild(element.firstChild);
            }
        }
        //   console.log(children);
        return children;
    }

    return {
        stringToDOMElement,
        addClassIf,
        renderIf,
        wrap,
        render,
        createElement,
        removeChildren
    }

})();
/******************************************************************************************************/
let state = {};

function getState() {
    return state;
}

function setState(stateUpdate) {
    state = Object.assign(state, stateUpdate);
}

/******************************************************************************************************/

/*handle handle handle handle handle handle handle handle handle handle handle handle handle handle */
let handle = (function () {
    /*api api api api api api api api api api api api api api api api api api api api api api api api api api api */
    let api = (function () {
        //import PhotoPost from './models/PhotoPost';

        /*PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost*/
        let PhotoPost = (function () {
            return class PhotoPost {

                constructor({
                                description,
                                createdAt,
                                author,
                                photoLink,
                                tags = [],
                                likes = [],
                                id,
                            }) {
                    this.id = id;
                    this.description = description;
                    this.createdAt = createdAt;
                    this.author = author;
                    this.photoLink = photoLink;
                    this.tags = tags;
                    this.likes = likes;
                }

                getLikesCnt() {
                    return this.likes.length;
                }

                like(userName) {
                    const ind = this.likes.indexOf(userName);
                    if (ind === -1) {
                        this.likes.push(userName);
                    } else {
                        this.likes.splice(ind, 1);
                    }
                }

                static validate(post) {
                    return (
                        post instanceof PhotoPost &&
                        isString(post.id) && post.id.length > 0 &&
                        isString(post.description) && post.description.length < 200 &&
                        (post.createdAt instanceof Date) &&
                        isString(post.author) && post.author.length > 0 &&
                        isString(post.photoLink) && post.photoLink.length > 0 &&
                        post.tags instanceof Array &&
                        post.likes instanceof Array
                    );
                }
            }

        })();

        /*************************************module*****************************************************************/

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
            const postObj = Object.assign({}, rawPost, {createdAt: new Date(rawPost.createdAt)});
            return new PhotoPost(postObj);
        }

        function getPost(id) {
            return fetch(buildRequest(`/posts/${id}`))
                .then(handleErrors)
                .then(response => response.json())
                .then(rawPost => parsePost(rawPost));
        }

        function getPosts(skip = 0, top = 10, filterConfig = {}) {
            return fetch(buildRequest('/posts', {top, skip, filterConfig}))
                .then(handleErrors)
                .then(response => response.json())
                .then(rawPosts => rawPosts.map(rawPost => parsePost(rawPost)));
        }

        function likePost(id, user) {
            return fetch(buildRequest(`/posts/${id}/like`, {user}), {
                method: 'PUT',
            })
                .then(handleErrors)
                .then(response => response.json())
                .then(json => parsePost(json));
        }

        function createPost(post) {
            const data = objectToFormData(post);
            //console.log(data);
            //console.log(post);
            return fetch('/posts', {
                method: 'POST',
                body: data,
            })
                .then(handleErrors)
                .then(response => response.json())
                .then(json => parsePost(json));

        }

        function updatePost(id, post) {
            const data = objectToFormData(post);
            return fetch(`/posts/${id}`, {
                method: 'PUT',
                body: data,
            })
                .then(handleErrors)
                .then(response => response.json())
                .then(json => parsePost(json));
        }

        function deletePost(id) {
            return fetch(`/posts/${id}`, {
                method: 'DELETE',
            });
        }

        function login(email, password) {
            return fetch('/auth', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject();
            });
        }

        function poll() {
            return fetch('/poll')
                .then(handleErrors)
                .then(response => response.json())
                .then(postsRaw => postsRaw.map(rawPost => parsePost(rawPost)));
        }

        return {
            getPost,
            getPosts,
            likePost,
            createPost,
            updatePost,
            deletePost,
            login,
            poll
        }
    })();
    /*************************************module*****************************************************************/

    /*PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts*/
    let PhotoPosts = (function () {

        /*PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost*/
        let PhotoPost = (function () {
            //import { stringToDOMElement, addClassIf } from '../util';
            //import handle from '../handlers';
            //import { getState } from '../state';

            return function PhotoPost({post}) {
                post.tags = post.tags.toString();
                post.tags = post.tags.split(",");
                if (!post.likes) post.likes = [];
                if (!post.createdAt) post.createdAt = new Date(); // fixed
                const {user} = getState();
                const pad = s => new String(s).padStart(2, '0');
                const formatDate = date => pad(date.getDate()) + '.' + pad(date.getMonth() + 1) + '.' + pad(date.getFullYear() % 100);
                const makeTag = tag => `<a class="post__tag">${tag}</a>`;
                const makeTags = tags => tags.reduce((s, tag) => s + makeTag(tag) + ' ', '');
                const isAuthor = user && post.author === user.name;
                const isLiked = user && post.likes.indexOf(user.name) !== -1;
                const element = util.stringToDOMElement(`
    <div class="post">
      <header class="post__header">
       <span class="post__author">${post.author}</span>
       <span class="post__header__right">
         <span class="post__date">${formatDate(post.createdAt)}</span>&nbsp
         <span class = ${util.addClassIf(!isAuthor, 'hidden')}>
          <i class="material-icons icon-button post__header__edit">create</i>
          <i class="material-icons icon-button post__header__remove">close</i>
         </span>
       </span>
      </header>
      <img class="post__photo" src="${post.photoLink}">
      <footer class="post__footer">
        <div class="post__like-panel">
          <i class="material-icons post__like ${util.addClassIf(isLiked, 'post__like--liked')}">
            ${isLiked ? 'favorite' : 'favorite_border'}
          </i>
         <span class="post__likes-count">${post.likes.length}</span>
       </div>
       <div class="post__information">
         <div class="post__tags">
          ${makeTags(post.tags)}
         </div>
         <p class="post__description">
          ${post.description}
         </p>
       </div>
      </footer>
    </div>
    `.trim());
                element.querySelector('.post__header__edit').onclick = () => {
                    handle({
                        type: 'EDIT_POST',
                        id: post.id,
                    });
                };
                element.querySelector('.post__header__remove').onclick = () => {
                    handle({
                        type: 'REMOVE_POST',
                        id: post.id,
                    });
                };
                element.querySelector('.post__like').onclick = () => {
                    handle({
                        type: 'LIKE_POST',
                        id: post.id,
                    });
                };
                element.setAttribute('data-id', post.id);
                return element;
            }

        })();
        /*************************************module*****************************************************************/

        /*PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound*/
        let PostsNotFound = (function () {
            //import { stringToDOMElement } from '../util';

            return function PostsNotFound() {
                const element = util.stringToDOMElement(`
    <div class = "post posts-not-found">
      No posts found.
    </div>
  `.trim());
                return element;
            }

        })();
        /*************************************function*****************************************************************/

        let element;

        function PhotoPosts() {
            element = util.stringToDOMElement(`
                 <div class="posts" id="posts">
                 <div></div>
                            </div>
                                            `.trim());
            PhotoPosts.render([]);
            return element;
        }

        function findNode(id) {
            const posts = element.firstChild.children;
            const node = Array.prototype.find.call(posts, post => post.getAttribute('data-id') === id);
            return node;
        }

        PhotoPosts.update = function (id, post) {
            const node = findNode(id);
            if (node) {
                node.parentNode.replaceChild(PhotoPost({post}), node);
            }
        };

        PhotoPosts.remove = function (id) {
            const node = findNode(id);
            if (node) {
                node.parentNode.removeChild(node);
            }
        };

        PhotoPosts.render = function (posts) {
            element = document.getElementById('posts');
            util.removeChildren(element);
            const wrapper = document.createElement('div');
            if (posts.length === 0) {
                wrapper.appendChild(PostsNotFound());
            } else {
                posts.forEach((post) => {
                    wrapper.appendChild(PhotoPost({post}));
                });
            }
            //console.log(wrapper);
            element.appendChild(wrapper);
        };

        return PhotoPosts;


    })();
    /*************************************module*****************************************************************/

    /*PageNotFound PageNotFound PageNotFound PageNotFound PageNotFound PageNotFound PageNotFound PageNotFound*/
    let PageNotFound = (function () {
        return function PageNotFound() {
            return util.stringToDOMElement(`
                  Ooops! Page not found!
                       `.trim());
        }
    })();
    /*************************************function*****************************************************************/

    /*SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn SignIn*/
    let SignIn = (function () {

        /*Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer*/
        let Footer = (function () {

            return function Footer() {
                return util.stringToDOMElement(`
    <footer class="footer panel">
      <span class="footer__description bright">
        Created by Kuzmich Alexandr, 2-nd year student from FAMCS
        <a class="footer__email" href="mailto:senich10@mail.ru">
            AlexandrWh
        </a>
      </span>
      <span class="footer__update bright">
        Last update:
         <span id="update-date">13.05.18</span>
      </span>
    </footer>
    `.trim());
            }

        })();
        /*************************************function*****************************************************************/

        return function SignIn() {
            const form = `
    <form class="sign-in__form">
      <h1 class="sign-in__form__header bright">Sign in</h1>
      <input type="email" required class="sign-in__input input" name="email" placeholder="Email Address">
      <input type="password" required class="sign-in__input input" name="password" placeholder="Password">
      <button type="submit" class="button bright sign-in__button">Sign in</button>
      <button id="signAsGuest" class="button bright sign-in__button">Sign in as a guest</button>  
    </form>
  `.trim();

            const element = util.stringToDOMElement(`
    <div class="sign-in">
      <div class="sign-in__content">
        <h1 class="sign-in__header bright">Monogram</h1>
        ${form}
      </div>
    </div>
  `.trim());
            element.appendChild(Footer());

            element.querySelector('.sign-in__form').onsubmit = (event) => {
                event.preventDefault();
                const formData = new FormData(event.target);
                handle({
                    type: 'LOGIN',
                    email: formData.get('email'),
                    password: formData.get('password'),
                    onLoggedIn: () => handle({
                        type: 'SET_PAGE',
                        pageName: 'app',
                    }),
                    onError: () => {
                        alert('Wrong email or password');
                    },
                });
            };

            element.querySelector('#signAsGuest').onclick = (event) => {
                event.preventDefault();
                handle({
                    type: 'LOGIN',
                    asGuest: true,
                    onLoggedIn: () => handle({
                        type: 'SET_PAGE',
                        pageName: 'app',
                    }),
                });
            };

            return element;
        }

    })();
    /*************************************function*****************************************************************/

    /*AppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppAppvAppAppAppAppApp*/
    let App = (function () {
        /*Content Content Content Content Content Content Content Content Content Content Content Content Content*/
        let Content = (function () {

            /*PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts PhotoPosts*/
            let PhotoPosts = (function () {

                /*PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost PhotoPost*/
                let PhotoPost = (function () {

                    return function PhotoPost({post}) {
                        const {user} = getState();
                        const pad = s => new String(s).padStart(2, '0');
                        const formatDate = date => pad(date.getDate()) + '.' + pad(date.getMonth() + 1) + '.' + pad(date.getFullYear() % 100);
                        const makeTag = tag => `<a class="post__tag">${tag}</a>`;
                        const makeTags = tags =>
                            tags.reduce((s, tag) => s + makeTag(tag) + ' ', '');
                        const isAuthor = user && post.author === user.name;
                        const isLiked = user && post.likes.indexOf(user.name) !== -1;
                        const element = util.stringToDOMElement(`
    <div class="post">
      <header class="post__header">
       <span class="post__author">${post.author}</span>
       <span class="post__header__right">
         <span class="post__date">${formatDate(post.createdAt)}</span>&nbsp
         <span class = ${util.addClassIf(!isAuthor, 'hidden')}>
          <i class="material-icons icon-button post__header__edit">create</i>
          <i class="material-icons icon-button post__header__remove">close</i>
         </span>
       </span>
      </header>
      <img class="post__photo" src="${post.photoLink}">
      <footer class="post__footer">
        <div class="post__like-panel">
          <i class="material-icons post__like ${util.addClassIf(isLiked, 'post__like--liked')}">
            ${isLiked ? 'favorite' : 'favorite_border'}
          </i>
         <span class="post__likes-count">${post.likes.length}</span>
       </div>
       <div class="post__information">
         <div class="post__tags">
          ${makeTags(post.tags)}
         </div>
         <p class="post__description">
          ${post.description}
         </p>
       </div>
      </footer>
    </div>
    `.trim());
                        element.querySelector('.post__header__edit').onclick = () => {
                            handle({
                                type: 'EDIT_POST',
                                id: post.id,
                            });
                        };
                        element.querySelector('.post__header__remove').onclick = () => {
                            handle({
                                type: 'REMOVE_POST',
                                id: post.id,
                            });
                        };
                        element.querySelector('.post__like').onclick = () => {
                            handle({
                                type: 'LIKE_POST',
                                id: post.id,
                            });
                        };
                        element.setAttribute('data-id', post.id);
                        return element;
                    }

                })();
                /*************************************module*****************************************************************/

                /*PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound PostsNotFound*/
                let PostsNotFound = (function () {

                    return function PostsNotFound() {
                        const element = util.stringToDOMElement(`
    <div class = "post posts-not-found">
      No posts found.
    </div>
  `.trim());
                        return element;
                    }

                })();
                /*************************************function*****************************************************************/

                let element;

                function PhotoPosts() {
                    element = util.stringToDOMElement(`
                 <div class="posts" id="posts">
                 <div></div>
                            </div>
                                            `.trim());
                    PhotoPosts.render([]);
                    return element;
                }

                function findNode(id) {
                    const posts = element.firstChild.children;
                    const node = Array.prototype.find.call(posts, post => post.getAttribute('data-id') === id);
                    return node;
                }

                PhotoPosts.update = function (id, post) {
                    const node = findNode(id);
                    if (node) {
                        node.parentNode.replaceChild(PhotoPost({post}), node);
                    }
                };

                PhotoPosts.remove = function (id) {
                    const node = findNode(id);
                    if (node) {
                        node.parentNode.removeChild(node);
                    }
                };

                PhotoPosts.render = function (posts) {
                    util.removeChildren(element);
                    const wrapper = document.createElement('div');
                    if (posts.length === 0) {
                        wrapper.appendChild(PostsNotFound());
                    } else {
                        posts.forEach((post) => {
                            wrapper.appendChild(PhotoPost({post}));
                        });
                    }
                    element.appendChild(wrapper);
                };

                return PhotoPosts;


            })();
            /*************************************module*****************************************************************/

            /*Filter Filter Filter Filter Filter Filter Filter Filter Filter Filter Filter Filter Filter Filter Filter*/
            let Filter = (function () {

                return function Filter() {
                    const element = util.stringToDOMElement(`
    <form class="search menu-panel">
      <span class="search__title bright">Filter</span>
      <div class="search__panel">
        <div class="search__option">
        <input type="text" name="author" class="search__input" placeholder="By author">
      </div>
      <div class="search__option">
        <label>From date</label>
        <input type="date" name="fromDate" class="search__input">
        <label>To date</label>
        <input type="date" name="toDate" class="search__input">
      </div>
      <div class="search__option">
        <input type="text" name="tags" class="search__input" placeholder="By tag">
      </div>
      <button class="search__button button">Filter</button>
    </form>
  `.trim());

                    element.querySelector('.search__button').onclick = (e) => {
                        e.preventDefault();
                        const formData = new FormData(element);
                        const tags = formData.get('tags').split(/[#, ]/).filter(s => s !== '');
                        const author = formData.get('author').trim();
                        const fromDate = formData.get('fromDate') === '' ? null : new Date(formData.get('fromDate'));
                        const toDate = formData.get('toDate') === '' ? null : new Date(formData.get('toDate'));
                        handle({
                            type: 'FILTER_POSTS',
                            filterConfig: {
                                fromDate,
                                toDate,
                                tags,
                                author,
                            },
                        });
                    };

                    return element;
                }
            })();
            /*************************************function*****************************************************************/

            return function Content() {
                const {user} = getState();

                const element = util.stringToDOMElement(`
    <div class="content main-content">
      <aside class="sidebar">
        <ul class="menu menu-panel">
          <li class="menu__item">
            <a href="#" class="bright">All posts</a>
          </li>
          ${user ? `
          <li class="menu__item bright">
            <a href="#" class="bright">Only my</a>
          </li>
          <li class="menu__item bright">
            <a href="#" class="bright">New post</a>
          </li>`.trim() : ''}
        </ul>
      </aside>
      <main class="main" id = "main">
        <button class="show-more-button button">Load more...</button>
      </main>
    </div>
  `.trim());

                const menuItems = element.querySelector('.menu').children;
                menuItems[0].onclick = () => handle({
                    type: 'SHOW_POSTS',
                });
                if (menuItems.length > 1) {
                    menuItems[1].onclick = () => handle({
                        type: 'FILTER_POSTS',
                        filterConfig: {
                            author: user.name,
                        },
                    });
                    menuItems[2].onclick = () => handle({
                        type: 'CREATE_POST',
                    });
                }

                const main = element.querySelector('#main');
                main.insertBefore(PhotoPosts(), main.firstChild);
                element.querySelector('.sidebar').appendChild(Filter());

                element.querySelector('.show-more-button').onclick = () => {
                    handle({
                        type: 'SHOW_MORE_POSTS',
                    });
                };

                handle({
                    type: 'SHOW_POSTS',
                });
                return element;
            }

        })();
        /*************************************function*****************************************************************/

        /*Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer*/
        let Footer = (function () {

            return function Footer() {
                return util.stringToDOMElement(`
    <footer class="footer panel">
      <span class="footer__description bright">
        Created by Kuzmich Alexandr, 2-nd year student from FAMCS
        <a class="footer__email" href="mailto:senich10@mail.ru">
            AlexandrWh
        </a>
      </span>
      <span class="footer__update bright">
        Last update:
         <span id="update-date">13.05.18</span>
      </span>
    </footer>
    `.trim());
            }

        })();
        /*************************************function*****************************************************************/

        /*Header Header Header Header Header Header Header Header Header HeaderHeader Header Header Header Header*/
        let Header = (function () {

            return function Header() {
                let user = getState().user || {
                    name: 'Guest',
                    avatarLink: 'user_icon.png',
                };
                user.avatarLink = user.avatarLink || 'user_icon.png';

                const element = util.stringToDOMElement(`
    <header class="header panel">
      <div class="header__user-wrapper header__sideblock header__user">
        <img class="header__user__avatar" src="${user.avatarLink}"> &nbsp
        <span class="header__user__name">${user.name}</span>
      </div>
      <h1 class="header__title">MONOGRAM</h1>
      <div class="header__sideblock header__logout-wrapper">
        <a class="header__logout">
          <i class="material-icons icon-button">exit_to_app</i>
        </a>
      </div>
    </header>
  `.trim());

                element.querySelector('.header__logout').onclick = () => {
                    handle({
                        type: 'LOGOUT',
                    });
                    handle({
                        type: 'SET_PAGE',
                        pageName: 'signIn',
                    });
                };

                return element;
            }

        })();
        /*************************************function*****************************************************************/

        return function App() {
            return [Header(), Content(), Footer()];
        }
    })();
    /*************************************function*****************************************************************/

    /*Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor Editor*/
    let Editor = (function () {

        /*Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer*/
        let Footer = (function () {

            return function Footer() {
                return util.stringToDOMElement(`
    <footer class="footer panel">
      <span class="footer__description bright">
        Created by Kuzmich Alexandr, 2-nd year student from FAMCS
        <a class="footer__email" href="mailto:senich10@mail.ru">
            AlexandrWh
        </a>
      </span>
      <span class="footer__update bright">
        Last update:
         <span id="update-date">13.05.18</span>
      </span>
    </footer>
    `.trim());
            }

        })();
        /*************************************function*****************************************************************/

        /*Header Header Header Header Header Header Header Header Header HeaderHeader Header Header Header Header*/
        let Header = (function () {

            return function Header() {
                let user = getState().user || {
                    name: 'Guest',
                    avatarLink: 'user_icon.png',
                };
                user.avatarLink = user.avatarLink || 'user_icon.png';

                const element = util.stringToDOMElement(`
    <header class="header panel">
      <div class="header__user-wrapper header__sideblock header__user">
        <img class="header__user__avatar" src="${user.avatarLink}"> &nbsp
        <span class="header__user__name">${user.name}</span>
      </div>
      <h1 class="header__title">MONOGRAM</h1>
      <div class="header__sideblock header__logout-wrapper">
        <a class="header__logout">
          <i class="material-icons icon-button">exit_to_app</i>
        </a>
      </div>
    </header>
  `.trim());

                element.querySelector('.header__logout').onclick = () => {
                    handle({
                        type: 'LOGOUT',
                    });
                    handle({
                        type: 'SET_PAGE',
                        pageName: 'signIn',
                    });
                };

                return element;
            }

        })();
        /*************************************function*****************************************************************/

        /*EditPost EditPost EditPost EditPost EditPost EditPost EditPost EditPost EditPost EditPost EditPost EditPost*/
        let EditPost = (function () {

            function makeTag(tag) {
                const element = util.stringToDOMElement(`
    <span 
      type="text" 
      class="post__tag post__tag--editable input" 
      contenteditable="true">
      ${tag}
    </span>&nbsp
  `.trim());

                element.onkeypress = (event) => {
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        event.target.blur();
                    }
                };

                element.onblur = (event) => {
                    if (event.target.innerText.length === 0) {
                        event.target.parentNode.removeChild(event.target);
                    }
                };
                return element;
            }

            return function EditPost(post = {
                tags: [],
                photoLink: '',
                description: '',
            }) {
                const element = util.stringToDOMElement(`
    <div class="post">
      <form class="post__edit-form">
        <img class="post__photo" alt="Photo preview" src=${post.photoLink} />
        <div>Photo link: <input id="photoLink" type="text" value="${post.photoLink}" class="input"/></div>
        <div><label class="input" for="photoFile">Load photo</label><input type="file" accept="image/*" id="photoFile"></div>
        <div class="post__tags">
          Tags:
          <span id="tags"></span>
          <a class="post__tag post__tag--add input">Add tag</a>
        </div>
        <div>
          Description:
          <div>
            <textarea 
              required 
              maxlength="200"
              class="input post__description post__description--editable">${post.description}
            </textarea>
          </div>
        </div>
        <button type="submit" class="input bright">Save</button>
        <button id="cancel" class="input bright">Cancel</button>
    </div>
  `.trim());
                const tagsWrapper = element.querySelector('#tags');
                post.tags.forEach(tag => tagsWrapper.appendChild(makeTag(tag)));

                let state = {
                    usePhotoLink: true,
                    photoLink: post.photoLink,
                };

                element.querySelector('#photoLink').onblur = (event) => {
                    const url = event.target.value;
                    if (url !== state.photoLink && url !== '') {
                        element.querySelector('.post__photo').src = url;
                        state = {
                            usePhotoLink: true,
                            photoLink: url,
                        };
                    }
                };

                element.querySelector('#photoFile').onchange = (event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                        state = {
                            usePhotoLink: false,
                            photoFile: file,
                        };
                        element.querySelector('.post__photo').src = reader.result;
                        element.querySelector('#photoLink').value = '';
                    };
                    reader.readAsDataURL(file);
                };

                element.querySelector('.post__tag--add').onclick = () => {
                    const newTag = makeTag('');
                    tagsWrapper.appendChild(newTag);
                    newTag.focus();
                };

                element.querySelector('.post__edit-form').onsubmit = (event) => {
                    event.preventDefault();
                    if (!state.photoLink && !state.photoFile) {
                        alert('Please, provide either photo link, either photo file');
                        return;
                    }
                    const tags = Array.prototype.map.call(
                        element.querySelectorAll('.post__tag--editable'),
                        node => node.innerText,
                    );
                    const description = element.querySelector('.post__description').value;
                    const postToSend = Object.assign({}, post, {
                        tags,
                        description,
                    });
                    if (state.usePhotoLink) {
                        postToSend.photoLink = state.photoLink;
                    } else {
                        delete postToSend.photoLink;
                        postToSend.photoFile = state.photoFile;
                    }
                    handle({
                        type: 'SAVE_POST',
                        photo: state,
                        post: postToSend,
                    });
                };

                element.querySelector('#cancel').onclick = (event) => {
                    event.preventDefault();
                    handle({
                        type: 'CANCEL_EDITING',
                    });
                };

                element.querySelector('#photoLink').onkeypress = (event) => {
                    if (event.code === 'Enter') {
                        event.preventDefault();
                    }
                };

                return element;
            }

        })();
        /*************************************function*****************************************************************/

        return function Editor(post) {
            const content = util.stringToDOMElement(`
    <div class="content main-content">
      <main class="main" id = "main">
        <div class="posts"></div>
      </main>
    </div>
  `.trim());
            content.querySelector('.posts').appendChild(EditPost(post));
            return [Header(), content, Footer()];
        }

    })();
    /*************************************function*****************************************************************/

    /*PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel PhotoPostsModel*/
    let PhotoPostsModel = (function () {
        return class PhotoPosts {
            constructor() {
                this.photoPosts = [];
                this.isSorted = true;
            }

            static fromArray(arr) {
                const posts = new PhotoPosts();
                arr.forEach(post => posts.addPhotoPost(post));
                return posts;
            }

            getPhotoPosts(skip = 0, top = 10, filterConfig) {
                console.log(filterConfig);
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

            addPhotoPost(post) {
                let arr = [];
                arr.push(post);
                let p = this.photoPosts;
                this.photoPosts = arr.concat(p);
                //this.photoPosts.push(post);
                this.isSorted = false;
                return post;
            }

            getPhotoPost(id) {
                return this.photoPosts.find(post => post.id === id) || null;
            }

            editPhotoPost(id, fieldsToEdit) {
                const ind = this.photoPosts.findIndex(post => post.id === id);
                if (ind === -1) {
                    return false;
                }
                Object.assign(this.photoPosts[ind], fieldsToEdit);
                return true;
            }

            removePhotoPost(id) {
                const ind = this.photoPosts.findIndex(post => post.id === id);
                if (ind === -1) {
                    return false;
                }
                this.photoPosts.splice(ind, 1);
                return true;
            }
        }

    })();

    /*************************************module*****************************************************************/

    function clearPostsViewConfig() {
        getState().postsInViewCnt = 0;
        getState().filterConfig = null;
    }

    function setPage(pageName, args) {
        util.removeChildren(document.body);
        //console.log(document.body);
        clearPostsViewConfig();
        let page = null;
        switch (pageName) {
            case 'signIn':
                page = SignIn();
                break;
            case 'app':
                page = App();
                //   console.log(page);
                break;
            case 'editor':
                page = Editor(args);
                break;
            default:
                page = PageNotFound();
        }
        util.render(page, document.body);
    }

    function showPosts() {
        const {posts, postsInViewCnt, filterConfig} = getState();
        const postsToShow = posts.getPhotoPosts(0, postsInViewCnt, filterConfig);
        PhotoPosts.render(postsToShow);
    }

    function loadMorePostsIfNeeded(wantedPostsCnt) {
        const {filterConfig} = getState();
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
        console.log(filterConfig);
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
            console.log(postToSave);
            const post = await api.updatePost(postToSave.id, postToSave);
            console.log(1);
            getState().posts.editPhotoPost(post.id, post);
            console.log(2);
            setPage('app');
            console.log(3);
        } else {
            postToSave.author = getState().user.name;
            const post = await api.createPost(postToSave);
            getState().posts.addPhotoPost(postToSave);
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

    function handle(action) {
        switch (action.type) {
            case 'LIKE_POST':
                likePost(action.id);
                break;
            case 'REMOVE_POST':
                removePost(action.id);
                break;
            case 'CREATE_POST':
                //  console.log(1);
                initialState.id = document.getElementsByClassName('data-id');
                console.log(initialState.id);
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
                //console.log(action.post);
                savePost(action.post);
                break;
            case 'SHOW_MORE_POSTS':
                showMorePosts();
                break;
            case 'CANCEL_EDITING':
                setPage('app');
                break;
            case 'SET_PAGE':
                // console.log(document.body);
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

    return {
        handle
    }
})();
/******************************************************************************************************/

const initialState = {
    posts: PhotoPostsModel.fromArray([]),
    filterConfig: null,
    postsInViewCnt: 0,
    user: null,
    postsPerPage: 10,
};

setState(initialState);

handle.handle({
    type: 'SET_PAGE',
    pageName: 'app',
});


