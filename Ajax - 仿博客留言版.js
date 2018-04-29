window.onload = function() {
  var registerName = document.getElementById("username1"),
      registerMessage = document.getElementById("register_message"),
      oRegister = document.getElementsByClassName("register")[0],
      registerPassword=document.getElementById('password1'),
      registerBtn = document.getElementById("register_btn"),
      loginName=document.getElementById('username2'),
      loginPassword=document.getElementById('password2'),
      oLogin=document.getElementsByClassName('login')[0],
      loginBtn=document.getElementById('login_btn'),
      loginMessage=document.getElementById('login_message'),
      submitBtn=document.getElementById('submit'),
      guestbook=document.getElementById('guestbook'),
      content= document.getElementsByClassName('left')[0],
      page=1,
      flag=true,
      showMore=document.getElementById('showMore');

  //验证用户名是否能注册
  registerName.onblur = verifyUser;       
  function verifyUser() {
    ajax( "post", "guestbook/index.php","m=index&a=verifyUserName&username=" + this.value,function(responseText){
        var oRes = JSON.parse(responseText);
        registerMessage.innerHTML = oRes.message;
        if (!oRes.code) {
          registerMessage.style.color = "green";
        } else {
          registerMessage.style.color = "red";
        }
      }
    );
  }
    updateStatus();
    function updateStatus() {
      var uid = getCookie(" uid");
      var username = getCookie("username");
      if (uid) {
        oRegister.style.display = oLogin.style.display = "none";
        loginMessage.style.display = "inline-block";
        loginMessage.innerHTML = username + ",欢迎! <span id='logout'>退出</span>";
        var oLogout = document.getElementById("logout");
        oLogout.onclick = logout;
      } else {
        oLogin.style.display = oRegister.style.display = "inline-block";
        loginMessage.style.display = "none";
        loginName.value = loginPassword.value = "";
      }
    }
  
  //用户注册函数
  /*
    参数有:
        m=index:不知道什么意思
        a=函数  ;调用后端PHP文件中的用户注册reg函数
        username=用户注册名  ;  用户要进行注册的用户名
        password=用户密码   ;用户注册的密码;


    当后端返回数据的code为0时,说明用户可以成功注册
  */
  registerBtn.onclick=createUser;
  function createUser() {
    ajax('post','guestbook/index.php','m=index&a=reg&username='+encodeURI(registerName.value)+'&password='+registerPassword.value,function (responseText) {

      var oRes=JSON.parse(responseText);
      if (!oRes.code) {
        alert(oRes.message);
        oRegister.style.display='none';
      }else{
        alert(oRes.message);
      }
    })
  }
/*
  用户登录的函数:
    参数: m=index,a=login,username,password;

    当后端返回数据的code为0时,用户可以进行登录,此时,隐藏登录框,显示欢迎框.并显示退出按钮
*/
  loginBtn.onclick=login;
  function login() {
    ajax('post','guestbook/index.php','m=index&a=login&username='+encodeURI(loginName.value) +'&password='+loginPassword.value,function (responseText) {

      var oRes=JSON.parse(responseText);
      alert(oRes.message)

      if (oRes.code==0) {
        // oRegister.style.display=oLogin.style.display='none';
        // loginMessage.style.display='inline-block';
        // loginMessage.innerHTML=loginName.value + ",欢迎! <span id='logout'>退出</span>";
        // var oLogout=document.getElementById('logout');
        // oLogout.onclick=logout;
        updateStatus();
      } 

    })
  }
   /* 
      用户退出函数:
        参数:m=index,a=logout,username,password

        当后端返回数据的code为0时,说明成功退出;隐藏欢迎和退出界面,显示登录界面
   
   */
  function logout() {
    
    ajax('post','guestbook/index.php','m=index&a=logout&username='+loginMessage.innerHTML,function (responseText) {
      var oRes=JSON.parse(responseText);
      if (!oRes.code) {
        // oLogin.style.display= oRegister.style.display='inline-block';
        // loginMessage.style.display='none';
        // loginName.value=loginPassword.value='';
        updateStatus();
      }
    })

  }

  /*
    用户留言函数:
      参数:同上;

      code==0时,创建新的元素,并将留言内容添加到新元素再添加到留言版区域,但如果flag==false则说明留言版没有留言内容,需要清空欢迎留言的标签,再添加新的留言
  */

  submitBtn.onclick=submit;
  function submit() {
    ajax('post','guestbook/index.php','m=index&a=send&content='+guestbook.value,function (responseText) {
      var oRes = JSON.parse(responseText);

      alert(oRes.message);
      if (oRes.code == 0 && guestbook.value != "") {

        if (flag == false) {
          content.innerHTML = "";
          flag = true;
        }

        var oDl = document.createElement("dl");
        var oDt = document.createElement("dt");
        var oDd = document.createElement("dd");

        oDt.innerHTML = oRes.data.username;
        oDd.innerHTML = guestbook.value + "<span>踩(" + oRes.data.oppose + ")</span><span>顶(" + oRes.data.support + ")</span>";
        oDt.className = "customer";
        oDd.className = "notes";
        oDl.className = "content";

        oDl.appendChild(oDt);
        oDl.appendChild(oDd);
        content.insertBefore(oDl, content.children[0]);
        guestbook.value = "";
      }
     
    })
  }
/*

  参数:
      page:加载的页码;
      n:每页加载的条数;

  界面加载载入留言版的函数:
    当code==2时,说明数据已经加载完成,不进行下面操作并弹出提示;
    code==0时,创建新元素,并添加到"显示更多"的前面,再添加留言
    code==1时,说明没有数据可以添加到留言版,将 "欢迎留言"的界面创建并显示
*/
  getList();
  function getList() {
    ajax('post','guestbook/index.php',',m=index&a=getList&page='+page+'&n=10',function (responseText) {
      var oRes=JSON.parse(responseText);

      if (oRes.code==2) {
        alert(oRes.message);
        return;
      }

      if (oRes.code == 0) {

        for (let i = 0; i < oRes.data.list.length; i++) {
          var oDl = document.createElement('dl');
          var oDt = document.createElement('dt');
          var oDd = document.createElement('dd');

          oDt.innerHTML=oRes.data.list[i].username;
          oDd.innerHTML=oRes.data.list[i].content+'<span>踩('+oRes.data.list[i].oppose+')</span><span>顶('+oRes.data.list[i].support+')</span>';

          oDt.className = "customer";
          oDd.className = "notes";
          oDl.className = "content";
          oDl.appendChild(oDt);
          oDl.appendChild(oDd);
          content.insertBefore(oDl,content.children[content.children.length-1]);
        } 
      }else if(oRes.code==1){
        content.innerHTML = '<dl class="content"><dt class="customer">' + oRes.message + "</dt></dl>";
        flag=false;
      } 
    })
  }

  showMore.onclick = function() {
    page++;
    getList();
  };

  function getCookie(key) {

    var arr = document.cookie.split(";");

    for (let i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split("=");
      if (arr2[0] == key) {
        return decodeURI(arr2[1]);            //获取解码后的中文cookie!
      }
    }

  }


};




/*
  当用户登陆时，cookie中有uid的缓存。反之，用户退出时，uid则不存在，可以用getCookie函数读取是否存有uid，若有，则将页面加载成登陆状态
*/