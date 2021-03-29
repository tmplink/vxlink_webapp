app.ready(() => {
    vxCore.initExec(()=>{
        if(vxCore.uid==null){
            window.location = '/';
        }else{
            if(vxCore.email==null&&vxCore.uid!=null){
                //新账号,未绑定邮箱
                app.open('/init.html');
                return true;
            }
            vxUser.pageInit();
            vxTrans.pageInit();
            vxPing.pageInit();
            vxHome.pageInit();
            vxSettings.pageInit();
            vxBilling.pageInit();
            vxAffiliate.pageInit();
            vxDbservice.pageInit();
            vxDns.pageInit();
        }
    });
});