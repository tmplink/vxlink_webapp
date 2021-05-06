class vxlink_affiliate {
    core = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_affiliate') !== null) {
            $('#nav_affiliate').addClass('active');
            this.rpointRefresh();
            this.regcodeList();
            this.moneyList();
        }
    }

    regcodeList() {
        $('#loading_regcode_list').fadeIn();
        $.post(this.core.api_user, { token: this.core.token, action: 'regcode_list' }, function (rsp) {
            $('#loading_regcode_list').fadeOut();
            if (rsp.status === 1) {
                $('#regcode_list').html(app.tpl('regcode_list_tpl', rsp.data));
            } else {
                $('#regcode_list').html('暂无可用的邀请码，要生成邀请码，您需要消耗EXP。在使用微林的服务时，您会自动获得EXP。');
            }
        }, 'json');
    }

    regcodeMake() {
        $('#loading_regcode_make').fadeIn();
        $.post(this.core.api_user, { token: this.core.token, action: 'regcode_make' }, (rsp) => {
            $('#loading_regcode_make').fadeOut();
            if (rsp.status === 1) {
                this.regcodeList();
            } else {
                $('#regcodeadd').html('没有足够的EXP，请先使用服务。');
            }
        }, 'json');
    }

    moneyList() {
        $.post(this.core.api_user, { token: this.core.token, action: 'money_list' }, function (rsp) {
            if (rsp.status === 1) {
                $('#aff_list').html(app.tpl('aff_list_tpl', rsp.data));
            }
        }, 'json');
    }

    moneyRequest() {
        var alipay_account = $('#alipay_val_1').val();
        var alipay_name = $('#alipay_val_2').val();
        if (alipay_account === '') {
            alert('请先填写用于收款的支付宝账号');
            return false;
        }
        if (alipay_name === '') {
            alert('请先填写该支付宝账号的真实姓名');
            return false;
        }
        var alipay = alipay_account + '(' + alipay_name + ')';
        $('#submit_getmoney').html('正在处理...');
        $('#submit_getmoney').addClass('disabled');
        $.post(this.core.api_user, { token: this.core.token, alipay: alipay, action: 'money_req' }, (rsp) => {
            if (rsp.status === 1) {
                this.moneyList();
                $('#submit_getmoney').html('完成');
            } else {
                $('#submit_getmoney').html(rsp.data);
            }
        }, 'json');
    }

    rpointRefresh(){
        if(this.core.user_rpoint>=50){
            $('#submit_getmoney').html('当前拥有' + this.core.user_rpoint +'积分，提交请求');
        }else{
            $('#submit_getmoney').attr('disabled',true);
            $('#submit_getmoney').html('当前拥有' + this.core.user_rpoint +'积分，需要至少 50 积分才可提交申请');
        }
    }
}