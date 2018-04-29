let photoPostArr = (function () {
    let getPhotoPost = function (id) {
        for (var i in this) {
            id = id.toString();
            if (id === this[i].id) {
                return this[i];
            }
        }
        return null;
    }
    let getPhotoPosts = function (filterConfig, skip = 0, top = 10) {
        var buff = [];
        if (!filterConfig) {
            buff = this.map((elem) => elem);
        }
        else {
            buff = this.filter((elem) => {
                if (filterConfig.name && filterConfig.name !== elem.name) return false;
                if (filterConfig.dateFrom && filterConfig.dateFrom > elem.date) return false;
                if (filterConfig.dateTo && filterConfig.dateTo < elem.date) return false;
                if (filterConfig.title && !elem.title.includes(filterConfig.title)) return false;
                if (filterConfig.arrhash) {
                    let buff = elem.arrhash.join(" ");
                    for (let i in filterConfig.arrhash) {
                        if (!buff.includes(filterConfig.arrhash[i])) {
                            return false;
                        }
                    }
                }
                return true;
            });
        }
        buff.sort((a, b) => -(a.date - b.date));
        return buff.slice(skip, Math.min(buff.length, skip + top));
    }
    let validatePhotoPost = function (photopost) {
        if (typeof(photopost.name) !== 'string' ||
            typeof(photopost.title) !== 'string' ||
            !photopost.date ||
            !photopost.name ||
            !photopost.photoLink ||
            typeof(photopost.photoLink) !== 'string' ||
            typeof(photopost.id) !== 'string' ||
            !Array.isArray(photopost.arrhash) ||
            !(photopost.date instanceof Date)) {
            return false;
        }
        return true;
    }
    let addPhotoPost = function (photoPost) {
        if (this.validatePhotoPost(photoPost)) {
            this.push(photoPost);
            let post = [];
            post.push(photoPost);
            localStorage.setItem('posts', JSON.stringify(post.concat(JSON.parse(localStorage.getItem('posts')))));
            setUser(localStorage.getItem('currentUser'));
            //document.getElementById("staff").innerHTML = image_box(photoPost) + document.getElementById("staff").innerHTML;
            //alert(image_box(photoPost).length);
        }
        else {
            console.log('invalid photopost');
            alert("invalid photopost");
        }
    }
    let removePhotoPost = function (id) {
        for (var i in this) {
            id = id.toString();
            if (id === this[i].id) {
                this.splice(i, 1);
                localStorage.setItem('posts', JSON.stringify(posts.postArray));
                setUser(localStorage.getItem('currentUser'));
                return true;
            }
        }
        return false;
    }
    let editPhotoPost = function (id, config) {
        for (var i in this) {
            if (id === this[i].id) {
                if (config.photoLink) this[i].photoLink = config.photoLink;
                if (config.title) this[i].title = config.title;
                if (config.arrhash) this[i].arrhash = config.arrhash;
                return true;
            }
        }
        return false;
    }
    return {
        getPhotoPost,
        getPhotoPosts,
        addPhotoPost,
        editPhotoPost,
        removePhotoPost,
        validatePhotoPost
    }
})();

module.exports = photoPostArr;