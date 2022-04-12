var e2nav = new e2Pages();
app.ready(() => {
    vxCore.initExec(() => {
        if (vxCore.uid == null) {
            //console.log('unknow user');
            window.location = '/';
        } else {
            if (vxCore.email == null && vxCore.uid != null) {
                //新账号,未绑定邮箱
                app.open('/init.html');
                return true;
            } else {
                //账号已经登陆，初始化 header
                // if (document.getElementById('init_header') !== null) {
                //     $('.user_rpoint').html(vxCore.user_rpoint);
                //     $('.user_point').html(vxCore.user_point);
                //     $('.user_coins').html(vxCore.user_coin);
                // }
            }
            //获取 service
            let params = app.getUrlVars(window.location.href);
            switch (params.service) {
                case 'home':
                    e2nav.home();
                    break;
                case 'affiliate':
                    e2nav.affiliate();
                    break;
                case 'settings':
                    e2nav.settings();
                    break;
                case 'billing':
                    e2nav.billing();
                    break;
                case 'vxserver':
                    e2nav.vxserver();
                    break;
                case 'vxtrans':
                    e2nav.vxtrans();
                    break;
                case 'vxping':
                    e2nav.vxping();
                    break;
                case 'vxdns':
                    e2nav.vxdns();
                    break;
                case 'dbservice':
                    e2nav.dbservice();
                    break;
                case 'projects':
                    e2nav.projects();
                    break;
                case 'vps':
                    e2nav.vps();
                    break;
                default:
                    e2nav.home();
                    break;
            }
        }
    });
});