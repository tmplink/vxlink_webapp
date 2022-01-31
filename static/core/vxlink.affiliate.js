class vxlink_affiliate {
    core = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_affiliate') !== null) {
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
                this.core.user_coin = this.core.user_coin - 100;
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

    lucky(){
        let pay =  parseInt(prompt('请输入一个数字，这是您要花费的积分，最多 100 积分。'));
        if(pay < 1 || isNaN(pay)){
            alert('输入有误');
            return false;
        }

        if(pay>100){
            pay = 100;
        }

        $.post(this.core.api_user, { token: this.core.token,pay:pay, action: 'get_lucky' },  (rsp) => {
            if (rsp.status === 1) {
                alert(`跳过华丽的抽奖动画后，恭喜您抽到了 ${rsp.data} G点券!`);
                this.core.refreshUserInfo();
            }else{
                alert('oh！看起来没有那么多的积分了。');
            }
        }, 'json');
    }

    get2022Gift(){
        $.post(this.core.api_user, { token: this.core.token, action: 'get_2022_gift' },  (rsp) => {
            if (rsp.status === 1) {
                alert(`恭喜您抽到了 2888 G点券!`);
                this.core.refreshUserInfo();
            }else{
                alert('oh！失败了。');
            }
        }, 'json');
    }
}