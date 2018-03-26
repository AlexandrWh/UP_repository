var image_box = function(photoPost){
    let buff ="";
    for(let i = 0 ; i < photoPost.arrhash.length; i++){
        buff += "<a class='hashtag' href='#' style= \"font: 25px 'Oswald', sans-serif;\">"+ '#' + photoPost.arrhash[i] + "</a>";
    }
    return"<div class=\"image-box\" id=" + photoPost.id + ">\n" +
        "                    <div class=\"image-head\">\n" +
        "                        <div><h2>"+ photoPost.name + "</h2></div>\n" +
        "                        <img class=\"edit-btn\" id=" + photoPost.id + " src=\"https://image.freepik.com/free-icon/no-translate-detected_318-61160.jpg\"></img>\n" +
        "                        <div></div>\n" +
        "                        <img class=\"delete-btn\" id=" + photoPost.id + " src=\"https://www.shareicon.net/data/2016/09/01/822390_delete_512x512.png\"></img>\n" +
        "                    </div>\n" +
        "                    <img class=\"image-staff\" src=" + photoPost.photoLink + "></img>\n" +
        "                    <div class=\"image-like\">\n" +
        "                        <img class=\"like-btn\" src=\"http://icons.iconarchive.com/icons/icons8/ios7/512/Messaging-Like-icon.png\"></img>\n" +
        "                        <div></div>\n" +
        "                        <div class=\"like-text\">\n" +
        "                            <b class=\"like-count\" style=\"font: 25px 'Oswald', sans-serif;\">" +photoPost.likers.length+ " отметок \"Нравится\"</b>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                    <div class=\"image-info\">\n" +
        "                        <span> <b style=\"font: 25px 'Oswald', sans-serif;\">" + photoPost.name + ':' + "</b>\n" +
        "                            <span class=\"image-desc\">" + photoPost.title + "</span>\n" +
        buff +
        "                        </span>\n" +
        "                    </div>\n" +
        "                </div>\n"
}

var photoPost = (function(){
    return function (name, date, title, hashtags, photoLink, id) {
        this.name = name;
        this.id = id;
        this.date = date;
        this.photoLink = photoLink;
        this.title = title;
        this.arrhash = hashtags.split("#").slice(1);
        this.likers = [];
    }
})();

var photoPostArr = (function(){
    return function(){

        this.postArray = [];

        this.getPhotoPost = function(id){
            for(var i in this.postArray){
                id = id.toString();
                if(id === this.postArray[i].id){
                    return this.postArray[i];
                }
            }
            return null;
        };

        this.getPhotoPosts = function(filterConfig, skip = 0, top = 10){
            var buff = [];
            if(!filterConfig){
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
                document.getElementById("staff").innerHTML = image_box(photoPost) + document.getElementById("staff").innerHTML;
                //alert(image_box(photoPost).length);
            }
            else{
                console.log('invalid photopost');
                alert("invalid photopost");
            }
        };

        this.removePhotoPost = function(id){
            for(var i in this.postArray){
                id = id.toString();
                if(id === this.postArray[i].id){
                    this.postArray.splice(i, 1);
                    elemArr = document.getElementById('staff').getElementsByClassName('image-box');
                    elemArr[i].remove();
                    return true;
                }
            }
            return false;
        };

        this.editPhotoPost = function(id, config){
            for(var i in this.postArray){
                if(id === this.postArray[i].id){
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

let posts = new photoPostArr();

localStorage.setItem('currentL', '10');
if(!JSON.parse(localStorage.getItem('posts'))){
    localStorage.setItem('posts', '[]');
    localStorage.setItem('id', '1');
}