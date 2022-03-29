class e2Pages{

    current = null

    active(title){
        $('.navbar-collapse').collapse('hide');
        if(this.current!==title){
            $('#nav_'+this.current).removeClass('active');
            $('#nav_'+title).addClass('active');
            this.current=title;
        }
        //账号已经登陆，初始化 header
        if (document.getElementById('init_header') !== null) {
            $('.user_rpoint').html(vxCore.user_rpoint);
            $('.user_point').html(vxCore.user_point);
            $('.user_coins').html(vxCore.user_coin);
        }
        //初始化链接
        app.linkRebind();
    }

    home(){
        $('#admin_content').html(app.getFile('/tpl-e2/home.html'));
        this.active('home');
        vxHome.pageInit();
    }
    affiliate(){
        $('#admin_content').html(app.getFile('/tpl-e2/affiliate.html'));
        this.active('affiliate');
        vxAffiliate.pageInit();
    }
    settings(){
        $('#admin_content').html(app.getFile('/tpl-e2/settings.html'));
        this.active('settings');
        vxSettings.pageInit();
    }
    billing(){
        $('#admin_content').html(app.getFile('/tpl-e2/billing.html'));
        this.active('billing');
        vxBilling.pageInit();
    }
    vxserver(){
        $('#admin_content').html(app.getFile('/tpl-e2/vxserver.html'));
        this.active('vxserver');
        vxServer.pageInit();
    }
    vxtrans(){
        $('#admin_content').html(app.getFile('/tpl-e2/vxtrans.html'));
        this.active('vxtrans');
        vxTrans.pageInit();
    }
    vxping(){
        $('#admin_content').html(app.getFile('/tpl-e2/vxping.html'));
        this.active('vxping');
        vxPing.pageInit();
    }
    vxdns(){
        $('#admin_content').html(app.getFile('/tpl-e2/vxdns.html'));
        this.active('vxdns');
        vxDns.pageInit();
    }
    dbservice(){
        $('#admin_content').html(app.getFile('/tpl-e2/dbservice.html'));
        this.active('dbservice');
        vxDbservice.pageInit();
    }
    projects(){
        $('#admin_content').html(app.getFile('/tpl-e2/projects.html'));
        this.active('projects');
        $('#nav_projects').addClass('active');
    }
}