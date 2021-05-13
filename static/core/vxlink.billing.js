class vxlink_billing {
    core = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_billing') !== null) {
            this.refreshBilling();
        }
    }

    refreshBilling(){
        $.post(this.core.api_user, {token: this.core.token, action: 'billing_list'}, function (rsp) {
            if (rsp.status === 1) {
                $('#billing_list').html(app.tpl('billing_list_tpl', rsp.data));
            }else{
                $('#billing_list').html('暂无订单.');
            }
        }, 'json');
    }
}