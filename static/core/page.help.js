app.ready(() => {
    if(vxCore.uid!=null){
        $('.help_signin').removeClass("d-none");
    }else{
        $('.help_signout').removeClass("d-none");
    }
});