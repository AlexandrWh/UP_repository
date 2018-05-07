!function (t) {
    var e = {};

    function n(o) {
        if (e[o]) return e[o].exports;
        var s = e[o] = {i: o, l: !1, exports: {}};
        return t[o].call(s.exports, s, s.exports, n), s.l = !0, s.exports
    }

    n.m = t, n.c = e, n.d = function (t, e, o) {
        n.o(t, e) || Object.defineProperty(t, e, {configurable: !1, enumerable: !0, get: o})
    }, n.r = function (t) {
        Object.defineProperty(t, "__esModule", {value: !0})
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 0)
}([function (t, e, n) {
    "use strict";

    function o(t) {
        return "string" == typeof t || t instanceof String
    }

    n.r(e);

    class s {
        constructor({description: t, createdAt: e, author: n, photoLink: o, tags: s = [], likes: i = [], id: r}) {
            this.id = r, this.description = t, this.createdAt = e, this.author = n, this.photoLink = o, this.tags = s, this.likes = i
        }

        getLikesCnt() {
            return this.likes.length
        }

        like(t) {
            const e = this.likes.indexOf(t);
            -1 === e ? this.likes.push(t) : this.likes.splice(e, 1)
        }

        static validate(t) {
            return t instanceof s && o(t.id) && t.id.length > 0 && o(t.description) && t.description.length < 200 && t.createdAt instanceof Date && o(t.author) && t.author.length > 0 && o(t.photoLink) && t.photoLink.length > 0 && t.tags instanceof Array && t.likes instanceof Array
        }
    }

    class i {
        constructor() {
            this.photoPosts = [], this.isSorted = !0
        }

        static fromArray(t) {
            const e = new i;
            return t.forEach(t => e.addPhotoPost(t)), e
        }

        getPhotoPosts(t = 0, e = 10, n) {
            this.isSorted || (this.photoPosts.sort((t, e) => t.createdAt < e.createdAt), this.isSorted = !0);
            const o = [];
            for (let s = t; s < Math.min(this.photoPosts.length, t + e); s++) {
                let t = !0;
                const e = this.photoPosts[s];
                n && (n.author && e.author !== n.author && (t = !1), n.fromDate && e.createdAt < n.fromDate && (t = !1), n.toDate && e.createdAt > n.toDate && (t = !1), n.tags && !n.tags.every(t => -1 !== e.tags.indexOf(t)) && (t = !1)), t && o.push(e)
            }
            return o
        }

        addPhotoPost(t) {
            return this.photoPosts.push(t), this.isSorted = !1, t
        }

        getPhotoPost(t) {
            return this.photoPosts.find(e => e.id === t) || null
        }

        editPhotoPost(t, e) {
            const n = this.photoPosts.findIndex(e => e.id === t);
            return -1 !== n && (Object.assign(this.photoPosts[n], e), !0)
        }

        removePhotoPost(t) {
            const e = this.photoPosts.findIndex(e => e.id === t);
            return -1 !== e && (this.photoPosts.splice(e, 1), !0)
        }
    }

    let r, a = {};

    function c() {
        return a;
    }

    function p(t) {
        const e = document.createElement("template");
        return e.innerHTML = t, e.content.firstChild
    }

    function l(t, e, n = "") {
        return t ? " " + e : " " + n
    }

    function d(t) {
        const e = [];
        for (; t.firstChild;) e.push(t.removeChild(t.firstChild));
        return e;
    }

    function u({post: t}) {
        const {user: e} = c(), n = t => new String(t).padStart(2, "0"), o = e && t.author === e.name,
            s = e && -1 !== t.likes.indexOf(e.name),
            i = p(`\n    <div class="post">\n      <header class="post__header">\n       <span class="post__author">${t.author}</span>\n       <span class="post__header__right">\n         <span class="post__date">${(t => n(t.getDate()) + "." + n(t.getMonth() + 1) + "." + n(t.getFullYear() % 100))(t.createdAt)}</span>&nbsp\n         <span class = ${l(!o, "hidden")}>\n          <i class="material-icons icon-button post__header__edit">create</i>\n          <i class="material-icons icon-button post__header__remove">close</i>\n         </span>\n       </span>\n      </header>\n      <img class="post__photo" src="${t.photoLink}">\n      <footer class="post__footer">\n        <div class="post__like-panel">\n          <i class="material-icons post__like ${l(s, "post__like--liked")}">\n            ${s ? "favorite" : "favorite_border"}\n          </i>\n         <span class="post__likes-count">${t.likes.length}</span>\n       </div>\n       <div class="post__information">\n         <div class="post__tags">\n          ${(t => t.reduce((t, e) => t + (t => `<a class="post__tag">${t}</a>`)(e) + " ", ""))(t.tags)}\n         </div>\n         <p class="post__description">\n          ${t.description}\n         </p>\n       </div>\n      </footer>\n    </div>\n    `.trim());
        return i.querySelector(".post__header__edit").onclick = (() => {
            I({type: "EDIT_POST", id: t.id})
        }), i.querySelector(".post__header__remove").onclick = (() => {
            I({type: "REMOVE_POST", id: t.id})
        }), i.querySelector(".post__like").onclick = (() => {
            I({type: "LIKE_POST", id: t.id})
        }), i.setAttribute("data-id", t.id), i
    }

    function h() {
        return r = p('\n    <div class="posts" id="posts">\n      <div></div>\n    </div>\n  '.trim()), h.render([]), r
    }

    function _(t) {
        const e = r.firstChild.children;
        return Array.prototype.find.call(e, e => e.getAttribute("data-id") === t)
    }

    function f() {
        return p('\n    <footer class="footer panel">\n      <span class="footer__description bright">\n        It was created by Kuzmich Alexandr, 2-nd year student,\n        <a class="footer__email" href="mailto:senich10@mail.ru">\n            alexandrkuzmich@mail.ru\n        </a>\n        ,&nbsp FAMCS, group 8\n      </span>\n      <span class="footer__update bright">\n        Last update:\n         <span id="update-date">07.05.18</span>\n      </span>\n    </footer>\n    '.trim())
    }

    function g() {
        const {user: t} = c(),
            e = p(`\n    <div class="content main-content">\n      <aside class="sidebar">\n        <ul class="menu menu-panel">\n          <li class="menu__item">\n            <a href="#" class="bright">Impressions</a>\n          </li>\n          ${t ? '\n          <li class="menu__item bright">\n            <a href="#" class="bright">My impressions</a>\n          </li>\n          <li class="menu__item bright">\n            <a href="#" class="bright">New impression</a>\n          </li>'.trim() : ""}\n        </ul>\n      </aside>\n      <main class="main" id = "main">\n        <button class="show-more-button button">Load more...</button>\n      </main>\n    </div>\n  `.trim()),
            n = e.querySelector(".menu").children;
        n[0].onclick = (() => I({type: "SHOW_POSTS"})), n.length > 1 && (n[1].onclick = (() => I({
            type: "FILTER_POSTS",
            filterConfig: {author: t.name}
        })), n[2].onclick = (() => I({type: "CREATE_POST"})));
        const o = e.querySelector("#main");
        return o.insertBefore(h(), o.firstChild), e.querySelector(".sidebar").appendChild(function () {
            const t = p('\n    <form class="search menu-panel">\n      <span class="search__title bright">Filter</span>\n      <div class="search__panel">\n        <div class="search__option">\n        <input type="text" name="author" class="search__input" placeholder="By author">\n      </div>\n      <div class="search__option">\n        <label>From date</label>\n        <input type="date" name="fromDate" class="search__input">\n        <label>To date</label>\n        <input type="date" name="toDate" class="search__input">\n      </div>\n      <div class="search__option">\n        <input type="text" name="tags" class="search__input" placeholder="By tag">\n      </div>\n      <button class="search__button button">Filter</button>\n    </form>\n  '.trim());
            return t.querySelector(".search__button").onclick = (e => {
                e.preventDefault();
                const n = new FormData(t), o = n.get("tags").split(/[#, ]/).filter(t => "" !== t),
                    s = n.get("author").trim();
                I({
                    type: "FILTER_POSTS",
                    filterConfig: {
                        fromDate: "" === n.get("fromDate") ? null : new Date(n.get("fromDate")),
                        toDate: "" === n.get("toDate") ? null : new Date(n.get("toDate")),
                        tags: o,
                        author: s
                    }
                })
            }), t
        }()), e.querySelector(".show-more-button").onclick = (() => {
            I({type: "SHOW_MORE_POSTS"})
        }), I({type: "SHOW_POSTS"}), e
    }

    function m() {
        let t = c().user || {name: "Guest", avatarLink: "user_icon.png"};
        t.avatarLink = t.avatarLink || "user_icon.png";
        const e = p(`\n    <header class="header panel">\n      <div class="header__user-wrapper header__sideblock header__user">\n        <img class="header__user__avatar" src="${t.avatarLink}"> &nbsp\n        <span class="header__user__name">${t.name}</span>\n      </div>\n      <h1 class="header__title">Monogram</h1>\n      <div class="header__sideblock header__logout-wrapper">\n        <a class="header__logout">\n          <i class="material-icons icon-button">exit_to_app</i>\n        </a>\n      </div>\n    </header>\n  `.trim());
        return e.querySelector(".header__logout").onclick = (() => {
            I({type: "LOGOUT"}), I({type: "SET_PAGE", pageName: "signIn"})
        }), e
    }

    function b(t) {
        const e = p(`\n    <span \n      type="text" \n      class="post__tag post__tag--editable input" \n      contenteditable="true">\n      ${t}\n    </span>&nbsp\n  `.trim());
        return e.onkeypress = (t => {
            "Enter" === t.code && (t.preventDefault(), t.target.blur())
        }), e.onblur = (t => {
            0 === t.target.innerText.length && t.target.parentNode.removeChild(t.target)
        }), e
    }

    function y(t) {
        const e = p('\n    <div class="content main-content">\n      <main class="main" id = "main">\n        <div class="posts"></div>\n      </main>\n    </div>\n  '.trim());
        return e.querySelector(".posts").appendChild(function (t = {tags: [], photoLink: "", description: ""}) {
            const e = p(`\n    <div class="post">\n      <form class="post__edit-form">\n        <img class="post__photo" alt="Photo preview" src=${t.photoLink} />\n        <div>Photo link: <input id="photoLink" type="text" value="${t.photoLink}" class="input"/></div>\n        <div><label class="input" for="photoFile">Load photo</label><input type="file" accept="image/*" id="photoFile"></div>\n        <div class="post__tags">\n          Tags:\n          <span id="tags"></span>\n          <a class="post__tag post__tag--add input">Add tag</a>\n        </div>\n        <div>\n          Description:\n          <div>\n            <textarea \n              required \n              maxlength="200"\n              class="input post__description post__description--editable">${t.description}\n            </textarea>\n          </div>\n        </div>\n        <button type="submit" class="input bright">Save</button>\n        <button id="cancel" class="input bright">Cancel</button>\n    </div>\n  `.trim()),
                n = e.querySelector("#tags");
            t.tags.forEach(t => n.appendChild(b(t)));
            let o = {usePhotoLink: !0, photoLink: t.photoLink};
            return e.querySelector("#photoLink").onblur = (t => {
                const n = t.target.value;
                n !== o.photoLink && "" !== n && (e.querySelector(".post__photo").src = n, o = {
                    usePhotoLink: !0,
                    photoLink: n
                })
            }), e.querySelector("#photoFile").onchange = (t => {
                const n = t.target.files[0], s = new FileReader;
                s.onload = (() => {
                    o = {
                        usePhotoLink: !1,
                        photoFile: n
                    }, e.querySelector(".post__photo").src = s.result, e.querySelector("#photoLink").value = ""
                }), s.readAsDataURL(n)
            }), e.querySelector(".post__tag--add").onclick = (() => {
                const t = b("");
                n.appendChild(t), t.focus()
            }), e.querySelector(".post__edit-form").onsubmit = (n => {
                if (n.preventDefault(), !o.photoLink && !o.photoFile) return void alert("Please, provide either photo link, either photo file");
                const s = Array.prototype.map.call(e.querySelectorAll(".post__tag--editable"), t => t.innerText),
                    i = e.querySelector(".post__description").value,
                    r = Object.assign({}, t, {tags: s, description: i, likes: [],createdAt: new Date() });
                o.usePhotoLink ? r.photoLink = o.photoLink : (delete r.photoLink, r.photoFile = o.photoFile), I({
                    type: "SAVE_POST",
                    photo: o,
                    post: r
                })
            }), e.querySelector("#cancel").onclick = (t => {
                t.preventDefault(), I({type: "CANCEL_EDITING"})
            }), e.querySelector("#photoLink").onkeypress = (t => {
                "Enter" === t.code && t.preventDefault()
            }), e
        }(t)), [m(), e, f()]
    }

    function v(t, e = {}) {
        return `${t}?${Object.keys(e).filter(t => void 0 !== e[t]).reduce((t, n) => `${t}&${n}=${e[n] instanceof Object ? JSON.stringify(e[n]) : e[n]}`, "").slice(1)}`
    }

    function P(t) {
        if (!t.ok) throw Error(t.statusText);
        return t
    }

    function k(t) {
        const e = new FormData;
        return Object.getOwnPropertyNames(t).forEach(n => e.append(n, t[n])), e
    }

    function S(t) {
        const e = Object.assign({}, t, {createdAt: new Date(t.createdAt)});
        return new s(e)
    }

    function O() {
        c().postsInViewCnt = 0, c().filterConfig = null
    }

    function E(t, e) {
        d(document.body), O();
        let n = null;
        switch (t) {
            case"signIn":
                n = function () {
                    const t = p(`\n    <div class="sign-in">\n      <div class="sign-in__content">\n        <h1 class="sign-in__header bright">Monogram</h1>\n        ${'\n    <form class="sign-in__form">\n      <h1 class="sign-in__form__header bright">Sign in</h1>\n      <input type="email" required class="sign-in__input input" name="email" placeholder="Email Address">\n      <input type="password" required class="sign-in__input input" name="password" placeholder="Password">\n      <button type="submit" class="button bright sign-in__button">Sign in</button>\n      <button id="signAsGuest" class="button bright sign-in__button">Sign in as a guest</button>  \n    </form>\n  '.trim()}\n      </div>\n    </div>\n  `.trim());
                    return t.appendChild(f()), t.querySelector(".sign-in__form").onsubmit = (t => {
                        t.preventDefault();
                        const e = new FormData(t.target);
                        I({
                            type: "LOGIN",
                            email: e.get("email"),
                            password: e.get("password"),
                            onLoggedIn: () => I({type: "SET_PAGE", pageName: "app"}),
                            onError: () => {
                                alert("Wrong email or password")
                            }
                        })
                    }), t.querySelector("#signAsGuest").onclick = (t => {
                        t.preventDefault(), I({
                            type: "LOGIN",
                            asGuest: !0,
                            onLoggedIn: () => I({type: "SET_PAGE", pageName: "app"})
                        })
                    }), t
                }();
                break;
            case"app":
                n = [m(), g(), f()];
                break;
            case"editor":
                n = y(e);
                break;
            default:
                n = p("\n    Ooops! Page not found!\n  ".trim())
        }
        var o, s;
        o = n, s = document.body, Array.isArray(o) || (o = [o]), o.forEach(t => s.appendChild(t))
    }

    function L(t) {
        const {filterConfig: e} = c(), n = c().posts.getPhotoPosts(0, t, e).length;
        return n < t ? function (t = 0, e = 10, n = {}) {
            return fetch(v("/posts", {
                top: e,
                skip: t,
                filterConfig: n
            })).then(P).then(t => t.json()).then(t => t.map(t => S(t)))
        }(n, t - n, e).then(t => (t.forEach(t => c().posts.addPhotoPost(t)), n + t.length)) : Promise.resolve(t)
    }

    async function T(t) {
        const e = await L(t);
        c().postsInViewCnt = e, function () {
            const {posts: t, postsInViewCnt: e, filterConfig: n} = c(), o = t.getPhotoPosts(0, e, n);
            h.render(o)
        }()
    }

    async function C(t) {
        try {
            await function (t) {
                return fetch(`/posts/${t}`, {method: "DELETE"})
            }(t), c().postsInViewCnt--, c().posts.removePhotoPost(t), h.remove(t)
        } catch (t) {
            console.log(t)
        }
    }

    async function w(t) {
        const e = await function (t, e) {
            return fetch(v(`/posts/${t}/like`, {user: e}), {method: "PUT"}).then(P).then(t => t.json()).then(t => S(t))
        }(t, c().user.name);
        c().posts.editPhotoPost(t, e), h.update(t, e)
    }

    async function A(t) {
        console.log(t);
        if (t) {
            const e = await function (t, e) {
               // const n = k(e);
                t = 100;
                console.log(e);
                return fetch(`/posts/${t}`, {method: "PUT", body: JSON.stringify(e)});
                    //.then(e => e.json());
                    //.then(e => S(e))
            }(t.id, t);
            c().posts.editPhotoPost(e.id, e)
        } else t.author = c().user.name,
            c().posts.addPhotoPost(t),
            E("app")
    }
//.then(e => P(e))
    async function D({email: t, password: e, onLoggedIn: n, onError: o, asGuest: s}) {
        if (s) c().user = null, n(); else try {
            const s = await function (t, e) {
                return fetch("/auth", {
                    method: "POST",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify({email: t, password: e})
                }).then(t => t.ok ? t.json() : Promise.reject())
            }(t, e);
            c().user = s, n()
        } catch (t) {
            o()
        }
    }

    function I(t) {
        switch (t.type) {
            case"LIKE_POST":
                w(t.id);
                break;
            case"REMOVE_POST":
                C(t.id);
                break;
            case"CREATE_POST":
                E("editor");
                break;
            case"FILTER_POSTS":
                n = t.filterConfig, O(), c().filterConfig = n, T(c().postsPerPage);
                break;
            case"SHOW_POSTS":
                O(), T(c().postsPerPage);
                break;
            case"EDIT_POST":
                e = t.id, E("editor", c().posts.getPhotoPost(e));
                break;
            case"SAVE_POST":
                A(t.post);
                break;
            case"SHOW_MORE_POSTS":
                T(c().postsInViewCnt + c().postsPerPage);
                break;
            case"CANCEL_EDITING":
                E("app");
                break;
            case"SET_PAGE":
                E(t.pageName);
                break;
            case"LOGIN":
                D(t);
                break;
            case"LOGOUT":
                c().user = null, c().posts = i.fromArray([]), c().postsInViewCnt = 0, E("signIn")
        }
        var e, n
    }

    h.update = function (t, e) {
        const n = _(t);
        n && n.parentNode.replaceChild(u({post: e}), n)
    }, h.remove = function (t) {
        const e = _(t);
        e && e.parentNode.removeChild(e)
    }, h.render = function (t) {
        d(r);
        const e = document.createElement("div");
        0 === t.length ? e.appendChild(p('\n    <div class = "post posts-not-found">\n      No posts found.\n    </div>\n  '.trim())) : t.forEach(t => {
            e.appendChild(u({post: t}))
        }), r.appendChild(e)
    };
    const q = {posts: i.fromArray([]), filterConfig: null, postsInViewCnt: 0, user: null, postsPerPage: 10};
    var $;
    $ = q, a = Object.assign(a, $), I({type: "SET_PAGE", pageName: "app"})
}]);