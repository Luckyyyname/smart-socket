let userdom = document.getElementById("loginUsername");
let passdom = document.getElementById("loginPassword");
let buttondom = document.getElementById("loginButton");

function checkLogin(){
    if(passdom.value.length != 0){
        return true;
    }else{
        alert("用户名或密码有误，请重新登录");
        return false;
    }
}

$('#loginButton').click(function(){
    if (checkLogin()){
        $.ajax({
            // 'url':"{:url('/login')}",
            'url':"http://localhost:8080/login",
            'async':false,
            'type':'POST',
            'data':{username:$("#loginUsername").val(),password:$("#loginPassword").val()},
            'dataType':'json',
            'success':function(data){
                console.log(data);
                if(data.message === 'success'){
                    window.location.replace("index.html");
                } else {
                    alert("用户名密码错误");
                }
            },
            'error':function(err){
                console.log(err);
                console.log(this.url);
                alert("服务器请求超时，请重试！");
            }
        })
    }
})