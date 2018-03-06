var photoPost = (function(){
    return function (name, date, title, hashtags, photoLink, id) {
        this.name = name;
        this.id = id;
        this.date = date;
        this.photoLink = photoLink;
        this.title = title;
        this.arrhash = hashtags.split("#").slice(1);
        this.likers = new Array();
    }
})();

var photoPostArr = (function(){
    return function(){
        this.postArray = [];

        let isContain = function(arr1, arr2){
            for(let i in arr2){
                if(arr1.indexOf(arr[i]) == -1){
                    return false;
                }
            }
            return true;
        };

        this.getPhotoPost = function(id){
            for(var i in this.postArray){
                if(id == this.postArray[i].id){
                    return this.postArray[i];
                }
            }
            return null;
        };

        this.getPhotoPosts = function(filterConfig, skip = 0, top = 10){
            var buff = [];
            if(typeof(filterConfig) === 'undefined'){
                buff = this.postArray.map((elem)=>elem);
            }
            else{
                buff = this.postArray.filter((elem)=>{
                    if(filterConfig.name && filterConfig.name !== elem.name) return false;
                    if(filterConfig.dateFrom && filterConfig.dateFrom > elem.date) return false;
                    if(filterConfig.dateTo && filterConfig.dateTo < elem.date) return false;
                    if(filterConfig.title && !elem.title.includes(filterConfig.title)) return false;
                    if(filterConfig.arrhash){
                        let buff = elem.arrhash.join(" ");
                        for(let i in filterConfig.arrhash){
                            if(!buff.includes(filterConfig.arrhash[i])){
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            buff.sort((a,b)=> -(a.date-b.date));
            return buff.slice(skip,Math.min(buff.length,skip+top));
        };

        this.validatePhotoPost = function(photopost){
            if(typeof(photopost.name) !== 'string' ||
                typeof(photopost.title) !== 'string' ||
                !photopost.date ||
                !photopost.name ||
                !photopost.photoLink ||
                typeof(photopost.photoLink) !== 'string' ||
                typeof(photopost.id) !== 'string' ||
                !Array.isArray(photopost.arrhash) ||
                !(photopost.date instanceof Date)){
                return false;
            }
            return true;
        };

        this.addPhotoPost = function(photoPost){
            if(this.validatePhotoPost(photoPost)){
                this.postArray.push(photoPost);
            }
            else{
                console.log('invalid photopost');
            }
        };

        this.removePhotoPost = function(id){
            for(var i in this.postArray){
                if(id === this.postArray[i].id){
                    this.postArray[i] = this.postArray[this.postArray.length - 1];
                    this.postArray.length--;
                    return true;
                }
            }
            return false;
        };

        this.editPhotoPost = function(id, config){
            for(var i in this.postArray){
                if(id == this.postArray[i].id && this.validatePhotoPost(this.postArray[i])){
                    if(config.photoLink) this.postArray[i].photoLink = config.photoLink;
                    if(config.title) this.postArray[i].title = config.title;
                    if(config.arrhash) this.postArray[i].arrhash = config.arrhash;
                    return true;
                }
            }
            return false;
        };
    };
})();

let Posts = new photoPostArr();
for(let i = 0 ; i < 25 ;i++){
    Posts.addPhotoPost(new photoPost(
        "NameLess",
        new Date(),
        "" + (i+1) + "post",
        '#asfaasfa#efef#grgrd',
        "./images/" + (i+1) + ".png",
        "" + (i + 1)
    ));
}
Posts.addPhotoPost(new photoPost(
    "Nss",
    new Date(),
    "" + 50 + "post",
    '#asfaasfa#efef#grgrd',
    "./images/" + 50 + ".png",
    "" + 50
));
console.log('-validation');
console.log(' ');
Posts.addPhotoPost(new photoPost('lol', 'fdaf','#asfa', '#','20'));
Posts.addPhotoPost(new photoPost('fdaf','#asfa', '#','20'));
Posts.addPhotoPost(new photoPost(1212, 'fdaf','#asfa', '#','20'));
Posts.addPhotoPost(new photoPost('drop photoPostsbase', '2018-02-22T15:43:22', 'sdcsdc','#faafadfa#dgdg', '#',777));
console.log(Posts.getPhotoPosts( {
    name: 'Nss',
    dateFrom: new Date('2018-03-02'),
    arrhash: ["efef"]
}, 0, 10));
//get
// console.log('with invalid argument:')
// console.log(Posts.getPhotoPosts('argument'));
// console.log('');nsole.log('-getPhotoPosts');
// console.log('10 posts:');
// console.log(Posts.getPhotoPosts());
// console.log('3 posts start from the second:');
// console.log(Posts.getPhotoPosts(1, 3));
// console.log('skip = 6 and default-argument for top:');
// console.log(Posts.getPhotoPosts(6));
// console.log('posts after filtering:');
// console.log('-getPhotoPost');
// console.log('post with id 2:');
// console.log(Posts.getPhotoPost('2'));
// console.log('post with id 100:');
// console.log(Posts.getPhotoPost('100'));
// console.log('with invalid argument:');
// console.log(Posts.getPhotoPost(100));
// console.log('');
// console.log('-validatePhotoPost');
// console.log('with invalid createdAt:');
// const incorrectPost = new photoPost('skateray17', '2018-01-01', 'asfa#afa', '#');
// incorrectPost.publDate = 1;
// console.log('');
// console.log('-addPhotoPost');
// console.log('all posts: ');
// console.log(Posts);
// console.log('try to add invalid post: ');
// console.log(Posts.addPhotoPost(incorrectPost));
// console.log('all posts: ');
// console.log(Posts);
// console.log('try to add valid post: ');
// console.log(Posts.addPhotoPost(new photoPost('lol', '2018-22-02T12:24:53', 'fdaf#asfa', '#', ['lol', 'kek'])));
// console.log('all posts: ');
// console.log(Posts);
// console.log('');
// console.log('-editPhotoPost');
// console.log('id=3 post before editing:');
// console.log(Posts.getPhotoPost('3'));
// console.log('try to edit id=3 post:');
// console.log(Posts.editPhotoPost('3', {
//     title: 'new description',
//     likers: [],
// }));
// console.log('id=3 post after editing:');
// console.log(Posts.getPhotoPost('3'));
// console.log('with invalid argument:');
// console.log(Posts.editPhotoPost(''));
// console.log('');
// console.log('-removePhotoPost');
// console.log('with invalid argument:');
// console.log(Posts.removePhotoPost(''));
// console.log('remove id=3 post');
// console.log(Posts.removePhotoPost('3'));
// console.log('try to get id=3 post');
// console.log(Posts.getPhotoPost('3'));
// console.log('all posts: ');
// console.log(Posts);