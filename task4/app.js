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

        this.getPhotoPost = function(id){
            for(var i in this.postArray){
                if(id === this.postArray[i].id){
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
                for(let prop in filterConfig){
                    if(!this.postArray[0].hasOwnProperty(prop)){
                        console.log("Invalid filter");
                        return;
                    }
                }
                buff = this.postArray.filter((elem)=>{
                    for(let prop in filterConfig){
                        if(elem[prop]!== filterConfig[prop]){
                            return false;
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
                if(id === this.postArray[i].id && this.validatePhotoPost(this.postArray[i])){
                    if(config.photoLink) this.postArray[i].photoLink = config.photoLink;
                    if(config.title) this.postArray[i].title = config.title;
                    if(config.hashtags) this.postArray[i].title = config.hashtags;
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
console.log('-validation');
console.log(' ');
Posts.addPhotoPost(new photoPost('lol', 'fdaf','#asfa', '#','20'));
Posts.addPhotoPost(new photoPost('fdaf','#asfa', '#','20'));
Posts.addPhotoPost(new photoPost(1212, 'fdaf','#asfa', '#','20'));
Posts.addPhotoPost(new photoPost('drop photoPostsbase', '2018-02-22T15:43:22', 'sdcsdc','#faafadfa#dgdg', '#',777));
console.log('-getPhotoPosts');
console.log('10 posts:');
console.log(Posts.getPhotoPosts());
console.log('3 posts start from the second:');
console.log(Posts.getPhotoPosts(1, 3));
console.log('skip = 6 and default-argument for top:');
console.log(Posts.getPhotoPosts(6));
console.log('posts after filtering:');
console.log(Posts.getPhotoPosts(0, 10, {
    authors: ['lol', 'kek'],
    tags: ['#asfa', '#fdfd'],
    startDate: new Date(2018, 0, 0),
}));
//get
console.log('with invalid argument:')
console.log(Posts.getPhotoPosts('argument'));
console.log('');
console.log('-getPhotoPost');
console.log('post with id 2:');
console.log(Posts.getPhotoPost('2'));
console.log('post with id 100:');
console.log(Posts.getPhotoPost('100'));
console.log('with invalid argument:');
console.log(Posts.getPhotoPost(100));
console.log('');
console.log('-validatePhotoPost');
console.log('with invalid createdAt:');
const incorrectPost = new photoPost('skateray17', '2018-01-01', 'asfa#afa', '#');
incorrectPost.publDate = 1;
console.log('');
console.log('-addPhotoPost');
console.log('all posts: ');
console.log(Posts);
console.log('try to add invalid post: ');
console.log(Posts.addPhotoPost(incorrectPost));
console.log('all posts: ');
console.log(Posts);
console.log('try to add valid post: ');
console.log(Posts.addPhotoPost(new photoPost('lol', '2018-22-02T12:24:53', 'fdaf#asfa', '#', ['lol', 'kek'])));
console.log('all posts: ');
console.log(Posts);
console.log('');
console.log('-editPhotoPost');
console.log('id=3 post before editing:');
console.log(Posts.getPhotoPost('3'));
console.log('try to edit id=3 post:');
console.log(Posts.editPhotoPost('3', {
    title: 'new description',
    likers: [],
}));
console.log('id=3 post after editing:');
console.log(Posts.getPhotoPost('3'));
console.log('with invalid argument:');
console.log(Posts.editPhotoPost(''));
console.log('');
console.log('-removePhotoPost');
console.log('with invalid argument:');
console.log(Posts.removePhotoPost(''));
console.log('remove id=3 post');
console.log(Posts.removePhotoPost('3'));
console.log('try to get id=3 post');
console.log(Posts.getPhotoPost('3'));
console.log('all posts: ');
console.log(Posts);