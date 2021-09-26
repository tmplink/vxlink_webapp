var e2nav = new e2Pages();
app.ready(() => {
    vxCore.initExec(()=>{
        if(vxCore.uid==null){
            //console.log('unknow user');
            window.location = '/';
        }else{
            if(vxCore.email==null&&vxCore.uid!=null){
                //新账号,未绑定邮箱
                app.open('/init.html');
                return true;
            }else{
                //账号已经登陆，初始化 header
                // if (document.getElementById('init_header') !== null) {
                //     $('.user_rpoint').html(vxCore.user_rpoint);
                //     $('.user_point').html(vxCore.user_point);
                //     $('.user_coins').html(vxCore.user_coin);
                // }
            }
            e2nav.home();
        }
    });
});