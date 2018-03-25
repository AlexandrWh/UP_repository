setUser(localStorage.getItem('currentUser'));
document.getElementsByClassName("menu-btn")[0].addEventListener('click', logoff_logon);

function setUser(user){
    if(user === 'null'){
        document.getElementsByClassName('content')[0].innerHTML = "<div class=\"staff\" id=\"staff\"></div>\n"+
            "<div style=\"padding: 100px calc(50% - 200px) 0 calc(50% - 200px)\">" +
            "<div><h2>Your name...</h2></div>" +
            "<input type=\"input_name\" id=\"login_name\" placeholder=\"Your name?\">" +
            "</div>";
        localStorage.setItem('currentUser', 'null');
        document.getElementById('header').innerHTML = "Welcome!";
    }
    else{
        let i = JSON.parse(localStorage.getItem('users')).indexOf(user);
        if(i != -1){
            user = JSON.parse(localStorage.getItem('users'))[i];
            localStorage.setItem('currentUser', user);
            document.getElementsByClassName('content')[0].innerHTML = "<div class=\"side-bar\">\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "                <div class = \"side-bar-element\">\n" +
                "                    <h1>типо меню</h1>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <div class=\"staff\" id=\"staff\">\n" +
                "            </div>\n" +
                "            <div class=\"find\">\n" +
                "                <div class = \"find-notes\">\n" +
                "                    <h2>Filter(name)</h2>\n" +
                "                    <input id=\"filter-name\" type=\"search\" placeholder=\"Search...\">\n" +
                "                </div>\n" +
                "                <div class = \"find-notes\">\n" +
                "                    <h2>Filter(hashtags)</h2>\n" +
                "                    <input id=\"filter-hash\" type=\"search\" placeholder=\"Search...\">\n" +
                "                </div>" +
                "                <div class = \"find-from\">\n" +
                "                    <h2>From</h2>\n" +
                "                    <input id=\"dateFrom\" type=\"date\" name=\"calendar\" value=\"2018-04-04\"\n" +
                "                           max=\"2018-05-05\" min=\"2018-03-03\">\n" +
                "                </div>\n" +
                "                <div class = \"find-to\">\n" +
                "                    <h2>To</h2>\n" +
                "                    <input id=\"dateTo\" type=\"date\" name=\"calendar\" value=\"2018-04-04\"\n" +
                "                           max=\"2018-05-05\" min=\"2018-03-03\">\n" +
                "                </div>\n" +
                "                <div class = \"find-go\">\n" +
                "                    Отфильтровать\n" +
                "                </div>" +
                "                <div style=\" margin: 10px 2px 2px 5px;\n" +
                "    border-bottom: 1px solid #7e7e7e;  border-top: 1px solid #7e7e7e\"></div>"+
                "                <div class = \"find-add\">\n" +
                "                    Добавить пост\n" +
                "                </div>\n" +
                "            </div>";
            let arr = JSON.parse(localStorage.getItem('posts'));
            let currentL = JSON.parse(localStorage.getItem('currentL'));
            for(let i = 0 ; i < Math.min(currentL, arr.length); i++){
                document.getElementById('staff').innerHTML += image_box(arr[i]);
            }
            if(currentL < arr.length){
                document.getElementById('staff').innerHTML += "<div class=\"download\"><h2>More...</h2></div>";
                document.getElementsByClassName('download')[0].addEventListener('click', more);
            }
            document.getElementsByClassName('header-width-limiter')[0].innerHTML = user;
            let col = document.getElementsByClassName('image-box');
            for(let i = 0 ;i < col.length; i++){
                if(arr[i].name !== user){
                    col[i].children[0].children[1].remove();
                    col[i].children[0].children[2].remove();
                }
            }
            let lk=document.getElementsByClassName("like-btn");
            let d=document.getElementsByClassName("delete-btn");
            for(let i=0;i<lk.length;i++){
                lk[i].setAttribute("like","0");
                lk[i].addEventListener("click",like);
            }
            for(let i=0;i<d.length;i++){
                d[i].addEventListener("click",delet);
            }
            document.getElementsByClassName('find-go')[0].addEventListener('click', filter);
            document.getElementsByClassName('find-add')[0].addEventListener('click', add);
        }
        else{
            alert('There is no such user! \n try: \n a \n aa \n aaa \n aaaa \n aaaaa \n aaaaaa \n aaaaaaa');
        }
    }
}

function filter(){
    let dateFrom = new Date(document.getElementById('dateFrom').value);
    let dateTo = new Date(document.getElementById('dateTo').value);
    let name = document.getElementById('filter-name').value;
    let arrhash = document.getElementById('filter-hash').value.split('#').slice(1);
    console.log(dateFrom);
    console.log(dateTo);
    console.log(name);
    console.log(arrhash);
    posts.postArray = JSON.parse(localStorage.getItem('posts'));
    console.log(posts.getPhotoPosts({
        dateFrom: dateFrom,
        dateTo: dateTo,
        name: name,
        arrhash: arrhash
    }));
}

function like(e){
    e.preventDefault();
    if(e.target.getAttribute("like")==="0"){
        e.target.src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png";
        e.target.setAttribute("like","1");
    }
    else{
        e.target.src="http://icons.iconarchive.com/icons/icons8/ios7/512/Messaging-Like-icon.png";
        e.target.setAttribute("like","0");
    }
}

function delet(e){
    posts.postArray = JSON.parse(localStorage.getItem('posts'));
    let id = e.target.id;
    posts.removePhotoPost(id);
    localStorage.setItem('posts',JSON.stringify(posts.postArray));
}

function more() {
    let arr = JSON.parse(localStorage.getItem('posts'));
    let currentL = JSON.parse(localStorage.getItem('currentL'));
    let prevL;
    document.getElementById('staff').lastChild.remove();
    for (let i = currentL; i < Math.min(currentL + 10, arr.length); i++) {
        document.getElementById('staff').innerHTML += image_box(arr[i]);
    }
    prevL = currentL;
    currentL = Math.min(currentL + 10, arr.length);
    if (currentL < arr.lenght) {
        document.getElementById('staff').innerHTML += "<div class=\"download\"><h2>More...</h2></div>";
        document.getElementsByClassName('download')[0].addEventListener('click', more);
    }
    let col = document.getElementsByClassName('image-box');
    for (let i = prevL; i < currentL; i++) {
        if (arr[i].name !== user) {
            col[i].children[0].children[1].remove();
            col[i].children[0].children[2].remove();
        }
    }
    let lk = document.getElementsByClassName("like-btn");
    let d = document.getElementsByClassName("delete-btn");
    for (let i = 0; i < lk.length; i++) {
        lk[i].setAttribute("like", "0");
        lk[i].addEventListener("click", like);
    }
    for (let i = 0; i < d.length; i++) {
        d[i].addEventListener("click", delet);
    }
}

function logoff_logon(){
    user = localStorage.getItem('currentUser');
    if(user !== 'null'){
        setUser('null');
    }
    else{
        user = document.getElementById('login_name').value;
        setUser(user);
    }
}

function add(){
    document.getElementsByClassName('content')[0].innerHTML =   "<div class=\"staff\" id=\"staff\"></div>\n" +
                                                                "<div style=\"padding: 50px calc(50% - 200px) 0 calc(50% - 200px);" +
                                                                             "display: grid;" +
                                                                             "grid-template-rows: 35px 250px 50px 50px 50px\">" +
                                                                    "<div><h2>Post information...</h2></div>" +
                                                                    "<div><input type=\"description\" id=\"description\" placeholder=\"description...\"></div>" +
                                                                    "<div><input type=\"hashtags\" id=\"hashtags\" placeholder=\"hashtags...\"></div>" +
                                                                    "<div><input type=\"photoLink\" id=\"photoLink\" placeholder=\"photolink...\"></div>" +
                                                                    "<div id=\"addPost\"></div>" +
                                                                "</div>";
    document.getElementsByClassName("menu-btn")[0].addEventListener('click', logoff_logon);
    document.getElementById("addPost").addEventListener('click', addPost);
}
function addPost(){
    let description = document.getElementById("description").value;
    let hashtags = document.getElementById("hashtags").value.split('#').slice(1);
    let photoLink_ = document.getElementById("photoLink").value;
    let post = [{
        name: localStorage.getItem('currentUser'),
        id: "1000",
        date: new Date(),
        photoLink: photoLink_,
        title: description,
        arrhash: hashtags,
        likers: []
    }];
    let arr = post.concat(JSON.parse(localStorage.getItem('posts')));
    localStorage.setItem('posts', JSON.stringify(arr));
    setUser(localStorage.getItem('currentUser'))
}
