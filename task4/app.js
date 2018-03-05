var photoPost = (function(){
    return function (id, title, date, name, photoLink, hashtags, likers) {
        this.name = name;
        this.id = id;
        this.date = date;
        this.photoLink = photoLink;
        this.title = title;
        this.arrhash = hashtags.split("#").slice(1);
        this.likers = likers;
    }
})();

var photoPostArr = (function(){
    return function(){
        this.postArray = [];

        this.getPhotoPost = function(id){
            for(var i in postArray){
                if(id === postArray[i].id){
                    return postArray[i];
                }
            }
            return null;
        };

        this.getPhotoPosts = function(skip = 0, top = 10, filterConfig){
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

        this.validatePhotoPost = function(photoPost){
            if(!photoPost.date ||
                !photoPost.name ||
                !photoPost.photoLink ||
                typeof(photoPost.name) !== 'string' ||
                typeof(photoPost.title) !== 'string' ||
                typeof(photoPost.photoLink) !== 'string' ||
                typeof(photoPost.id) !== 'string' ||
                !Array.isArray(photoPost.arrhash) ||
                !(photoPost.date instanceof Date)){
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
            for(var i in postArray){
                if(id === postArray[i].id){
                    postArray[i] = postArray[postArray.length - 1];
                    postArray.length--;
                    return true;
                }
            }
            return false;
        };

        this.editPhotoPost = function(id, config){
            for(var i in postArray){
                if(id === postArray[i].id && validatePhotoPost(postArray[i])){
                    if(config.photoLink) postArray[i].photoLink = config.photoLink;
                    if(config.title) postArray[i].title = config.title;
                    if(config.hashtags) postArray[i].title = config.hashtags;
                    return true;
                }
            }
            return false;
        };
    };
})();



let Posts = new photoPostArr();
for(let i = 0 ; i < 25 ;i++){
    Posts.addPhotoPost(new photoPost("" + (i+1), "" + (i+1) + " post", new Date(), "NameLess", "./images/" + (i+1) + ".png", '#asfaasfa#efef#grgrd'));
}

console.log(Posts);


